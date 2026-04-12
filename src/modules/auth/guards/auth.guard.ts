import { RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';

const RETURN_TO_KEY = 'sigeth_sso_return_to';

const readReturnTo = (to: RouteLocationNormalized) => {
  const queryReturnTo = typeof to.query.returnTo === 'string' ? to.query.returnTo : '';

  if (queryReturnTo) {
    sessionStorage.setItem(RETURN_TO_KEY, queryReturnTo);
    return queryReturnTo;
  }

  return sessionStorage.getItem(RETURN_TO_KEY) || '';
};

const redirectToOriginSystem = (returnTo: string, token: string | null, user: unknown) => {
  if (!returnTo || !token || !user) {
    return false;
  }

  const userStr = btoa(unescape(encodeURIComponent(JSON.stringify(user))));
  const separator = returnTo.includes('?') ? '&' : '?';
  sessionStorage.removeItem(RETURN_TO_KEY);
  window.location.href = `${returnTo}${separator}token=${encodeURIComponent(token)}&user=${encodeURIComponent(userStr)}`;
  return true;
};

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
    sessionStorage.removeItem(RETURN_TO_KEY);
    authStore.$patch({ token: null, user: null });
  }

  if (to.path === '/login' && !to.query.returnTo) {
    sessionStorage.removeItem(RETURN_TO_KEY);
  } else if (to.path === '/login') {
    readReturnTo(to);
  }

  if (to.path !== '/login' && !authStore.isAuthenticated) {
    return '/login';
  }

  if (to.path === '/login' && authStore.isAuthenticated) {
    const returnTo = readReturnTo(to);
    if (redirectToOriginSystem(returnTo, authStore.token, authStore.user)) {
      return false;
    }
    return '/';
  }

  return true;
}
