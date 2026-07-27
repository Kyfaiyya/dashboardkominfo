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

  static async loginAdmin(credentials: { username: string; password: string }) {
    const res = await fetch(`${this.BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Login gagal. Periksa username & password.');
    }
    return await res.json();
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
      throw new Error(err.error || `Failed to create ${entity}`);
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
}
