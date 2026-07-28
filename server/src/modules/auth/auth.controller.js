import config from '../../config/env.js';
import { logger } from '../../utils/logger.js';

/**
 * POST /api/auth/login
 * Validates admin credentials and returns authentication status & token
 */
export async function login(req, res) {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan Password wajib diisi' });
    }

    const expectedUsername = (config.adminUsername || 'admin').trim().toLowerCase();
    const expectedPassword = (config.adminPassword || 'admin').trim();

    const inputUsername = String(username).trim().toLowerCase();
    const inputPassword = String(password).trim();

    if (inputUsername === expectedUsername && inputPassword === expectedPassword) {
      logger.info(`Admin login successful for user: ${inputUsername}`);
      return res.json({
        success: true,
        message: 'Login Admin Berhasil',
        token: config.adminToken,
        user: {
          username: config.adminUsername,
          name: 'Administrator Diskominfo PPU',
          role: 'admin',
        },
      });
    }

    logger.warn(`Failed login attempt for user: ${inputUsername}`);
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
  if (token !== config.adminToken) {
    return res.status(403).json({ error: 'Token Admin tidak valid atau telah kadaluarsa.' });
  }

  next();
}
