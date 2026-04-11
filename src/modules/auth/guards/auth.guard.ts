import { RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';

export function authGuard(
  to: RouteLocationNormalized
) {
  const authStore = useAuthStore();

  // Allow public access to the portal routes
  if (to.path.startsWith('/portal')) {
    return true;
  }

  // Si a SIGETH le llega el flag de force (ej. sesión de SISPO expirada, 401)
  // destrozamos activamente el token cacheado para evitar el SSO Bucle Infinito
  if (to.query.force === 'true' || to.query.force) {
    localStorage.removeItem('sigeth_token');
    localStorage.removeItem('sigeth_user');
    authStore.$patch({ token: null, user: null });
  }

  if (to.path !== '/login' && !authStore.isAuthenticated) {
    return '/login';
  }

  if (to.path === '/login' && authStore.isAuthenticated) {
    if (to.query.returnTo) {
      const returnTo = to.query.returnTo as string;
      const tokenStr = authStore.token;
      const userStr = btoa(unescape(encodeURIComponent(JSON.stringify(authStore.user))));
      const separator = returnTo.includes('?') ? '&' : '?';
      window.location.href = `${returnTo}${separator}token=${encodeURIComponent(tokenStr)}&user=${encodeURIComponent(userStr)}`;
      return false;
    }
    return '/';
  }

  return true;
}
