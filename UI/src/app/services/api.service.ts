/**
 * API Service - Network client wrapper for dashboard backend communication
 */

export class ApiService {
  private static BASE_URL = '';

  /**
   * Fetch status data terkini dari Redis cache via backend
   */
  static async getLatestData() {
    const res = await fetch(`${this.BASE_URL}/api/data/latest`);
    if (!res.ok) {
      throw new Error(`Failed to fetch latest data: ${res.statusText}`);
    }
    return await res.json();
  }

  /**
   * Fetch data historis dari TimescaleDB
   */
  static async getHistoricalData(metricType: string, range: string = '24h') {
    const res = await fetch(`${this.BASE_URL}/api/data/history/${metricType}?range=${range}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch historical data: ${res.statusText}`);
    }
    return await res.json();
  }

  /**
   * Trigger manual poll & broadcast
   */
  static async triggerPoll() {
    const res = await fetch(`${this.BASE_URL}/api/trigger`, { method: 'POST' });
    if (!res.ok) {
      throw new Error(`Failed to trigger poll: ${res.statusText}`);
    }
    return await res.json();
  }

  /**
   * Check backend health status
   */
  static async checkHealth() {
    const res = await fetch(`${this.BASE_URL}/health`);
    if (!res.ok) {
      throw new Error(`Health check failed: ${res.statusText}`);
    }
    return await res.json();
  }

  // ─── Kominfo Monitoring Endpoints ─────────────────────────────────────────

  static async getKominfoSummary() {
    const res = await fetch(`${this.BASE_URL}/api/kominfo/summary`);
    if (!res.ok) throw new Error('Failed to fetch Kominfo summary');
    return await res.json();
  }

  static async getKominfoMenara(params?: { kecamatan?: string; operator?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${this.BASE_URL}/api/kominfo/menara${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch Menara data');
    return await res.json();
  }

  static async getKominfoBlankspot() {
    const res = await fetch(`${this.BASE_URL}/api/kominfo/blankspot`);
    if (!res.ok) throw new Error('Failed to fetch Blankspot data');
    return await res.json();
  }

  static async getKominfoAplikasi(params?: { jenis?: string; status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${this.BASE_URL}/api/kominfo/aplikasi${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch Aplikasi data');
    return await res.json();
  }

  static async getKominfoWifi() {
    const res = await fetch(`${this.BASE_URL}/api/kominfo/wifi`);
    if (!res.ok) throw new Error('Failed to fetch WiFi data');
    return await res.json();
  }

  static async getKominfoWebsiteDesa(params?: { kecamatan?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${this.BASE_URL}/api/kominfo/website-desa${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch Website Desa data');
    return await res.json();
  }

  static async getKominfoWebsiteOpd() {
    const res = await fetch(`${this.BASE_URL}/api/kominfo/website-opd`);
    if (!res.ok) throw new Error('Failed to fetch Website OPD data');
    return await res.json();
  }

  static async getKominfoCctv(params?: { area?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${this.BASE_URL}/api/kominfo/cctv${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch CCTV data');
    return await res.json();
  }

  /**
   * Login admin with automatic retry on network/server errors.
   * Does NOT retry on 4xx (credential errors) — those are intentional.
   */
  static async loginAdmin(credentials: { username: string; password: string }, _retryCount = 0): Promise<any> {
    const MAX_RETRIES = 1;
    const RETRY_DELAY_MS = 800;

    try {
      const res = await fetch(`${this.BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const message = err.error || 'Login gagal. Periksa username & password.';

        // Only retry on server errors (5xx), not client errors (4xx)
        if (res.status >= 500 && _retryCount < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
          return this.loginAdmin(credentials, _retryCount + 1);
        }

        throw new Error(message);
      }

      return await res.json();
    } catch (err: any) {
      // Network errors (fetch itself threw — server unreachable, CORS, timeout)
      if (!(err instanceof Error && err.message) || err.message === 'Failed to fetch') {
        if (_retryCount < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
          return this.loginAdmin(credentials, _retryCount + 1);
        }
        throw new Error('Gagal menghubungi server. Pastikan backend sudah berjalan.');
      }
      throw err;
    }
  }

  static async createKominfoItem(entity: string, payload: any, token?: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${this.BASE_URL}/api/kominfo/${entity}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = typeof err.error === 'string' ? err.error : (err.error?.message || err.message || `Failed to create ${entity}`);
      throw new Error(msg);
    }
    return await res.json();
  }

  static async updateKominfoItem(entity: string, id: number, payload: any, token?: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${this.BASE_URL}/api/kominfo/${entity}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = typeof err.error === 'string' ? err.error : (err.error?.message || err.message || `Failed to update ${entity} item`);
      throw new Error(msg);
    }
    return await res.json();
  }

  static async deleteKominfoItem(entity: string, id: number, token?: string) {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${this.BASE_URL}/api/kominfo/${entity}/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) throw new Error(`Failed to delete ${entity} item`);
    return await res.json();
  }

  // ─── Dynamic Page & Tab Governance Endpoints ──────────────────────────────

  static async getGovernanceNavigation() {
    const res = await fetch(`${this.BASE_URL}/api/governance/navigation`);
    if (!res.ok) throw new Error('Failed to fetch governance navigation config');
    return await res.json();
  }

  static async updatePageVisibility(key: string, is_public: boolean, token?: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${this.BASE_URL}/api/governance/page/${encodeURIComponent(key)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ is_public }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update page visibility for ${key}`);
    }
    return await res.json();
  }

  static async updateTabVisibility(pageKey: string, tabKey: string, is_public: boolean, token?: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${this.BASE_URL}/api/governance/tab/${encodeURIComponent(pageKey)}/${encodeURIComponent(tabKey)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ is_public }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update tab visibility for ${tabKey}`);
    }
    return await res.json();
  }

  static async getGovernanceAuditLogs(token?: string) {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${this.BASE_URL}/api/governance/logs`, { headers });
    if (!res.ok) throw new Error('Failed to fetch governance audit logs');
    return await res.json();
  }
}
