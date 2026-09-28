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

const safeBase64Encode = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const redirectToOriginSystem = (returnTo: string, token: string | null, user: any, authStore: any) => {
  if (!returnTo || !token || !user) {
    return false;
  }

  // Verificar si el usuario tiene permiso para ir al sistema destino
  const lowerReturn = returnTo.toLowerCase();
  if (lowerReturn.includes('9001') || lowerReturn.includes('sispo')) {
    if (!authStore.canAccessSystem('sispo')) {
      alert('Acceso no autorizado: Tu cuenta no tiene permisos para ingresar al sistema SISPO.');
      sessionStorage.removeItem(RETURN_TO_KEY);
      return false;
    }
  } else if (lowerReturn.includes('9002') || lowerReturn.includes('sigva')) {
    if (!authStore.canAccessSystem('sigva')) {
      alert('Acceso no autorizado: Tu cuenta no tiene permisos para ingresar al sistema SIGVA.');
      sessionStorage.removeItem(RETURN_TO_KEY);
      return false;
    }
  }

  const userStr = safeBase64Encode(JSON.stringify(user));
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
    if (redirectToOriginSystem(returnTo, authStore.token, authStore.user, authStore)) {
      return false;
    }
    return '/';
  }

  // Rutas internas de RRHH / SIGETH que requieren acceso explícito a SIGETH
  const sigethInternalPrefixes = ['/personal', '/sso', '/sedes', '/reportes', '/estructura', '/geo', '/recordatorios'];
  const isSigethInternal = sigethInternalPrefixes.some(prefix => to.path === prefix || to.path.startsWith(`${prefix}/`));
  if (isSigethInternal && authStore.isAuthenticated && !authStore.hasSigethAccess) {
    // Si no tiene acceso a SIGETH pero sí a otro sistema, redirigirlo allá
    if (authStore.canAccessSystem('sigva') && !authStore.canAccessSystem('sispo')) {
      window.location.href = 'http://localhost:9002';
      return false;
    }
    if (authStore.canAccessSystem('sispo') && !authStore.canAccessSystem('sigva')) {
      window.location.href = 'http://localhost:9001';
      return false;
    }
    return '/'; // Al portal general donde se listan sus accesos
  }

  return true;
}
