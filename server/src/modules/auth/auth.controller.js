import { logger } from '../../utils/logger.js';

// Default Admin Credentials (can be configured via ENV)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'secret-admin-token-ppu-2026';

/**
 * POST /api/auth/login
 * Validates admin credentials and returns authentication status & token
 */
export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan Password wajib diisi' });
    }

    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      logger.info(`Admin login successful for user: ${username}`);
      return res.json({
        success: true,
        message: 'Login Admin Berhasil',
        token: ADMIN_TOKEN,
        user: {
          username: ADMIN_USERNAME,
          name: 'Administrator Diskominfo PPU',
          role: 'admin',
        },
      });
    }

    logger.warn(`Failed login attempt for user: ${username}`);
    return res.status(401).json({ error: 'Username atau Password salah!' });
  } catch (err) {
    logger.error('Login controller error:', err.message);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server auth' });
  }
}

/**
 * Express Middleware: requireAdminAuth
 * Protects mutation endpoints (POST/DELETE)
 */
export function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Akses ditolak. Silakan login sebagai Admin terlebih dahulu.' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Token Admin tidak valid atau telah kadaluarsa.' });
  }

  next();
}
