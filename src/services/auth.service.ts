const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';
const AUTH_LOGIN_AT_KEY = 'auth_login_at';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 horas

const DEMO_EMAIL = 'admin@sanrafael.gov.co';
const DEMO_PASSWORD = 'SanRafael2026*';

export interface AuthUser {
  email: string;
  role: 'admin';
}

export const authService = {
  login: (email: string, password: string): boolean => {
    const normalized = email.trim().toLowerCase();
    if (normalized === DEMO_EMAIL && password === DEMO_PASSWORD) {
      localStorage.setItem(AUTH_TOKEN_KEY, 'demo-token');
      localStorage.setItem(AUTH_LOGIN_AT_KEY, String(Date.now()));
      localStorage.setItem(
        AUTH_USER_KEY,
        JSON.stringify({ email: DEMO_EMAIL, role: 'admin' } satisfies AuthUser)
      );
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_LOGIN_AT_KEY);
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const loginAt = localStorage.getItem(AUTH_LOGIN_AT_KEY);
    if (!token || !loginAt) return false;

    const elapsed = Date.now() - Number(loginAt);
    if (Number.isNaN(elapsed) || elapsed > SESSION_DURATION_MS) {
      authService.logout();
      return false;
    }
    return true;
  },

  getSessionExpiresAt: (): Date | null => {
    const loginAt = localStorage.getItem(AUTH_LOGIN_AT_KEY);
    if (!loginAt) return null;
    return new Date(Number(loginAt) + SESSION_DURATION_MS);
  },

  getUser: (): AuthUser | null => {
    if (!authService.isAuthenticated()) return null;
    const user = localStorage.getItem(AUTH_USER_KEY);
    return user ? (JSON.parse(user) as AuthUser) : null;
  },
};
