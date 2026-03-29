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

  if (to.path !== '/login' && !authStore.isAuthenticated) {
    return '/login';
  }

  if (to.path === '/login' && authStore.isAuthenticated) {
    return '/';
  }

  return true;
}
