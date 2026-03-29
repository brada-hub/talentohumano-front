import { defineRouter } from '#q-app/wrappers';
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
  Router
} from 'vue-router';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 */

export default defineRouter(async function (/* { store, ssrContext } */): Promise<Router> {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Auth Guard
  // Since we are in TS, we can import it normally or keep it dynamic if lazy loading
  const { authGuard } = await import('src/modules/auth/guards/auth.guard');
  Router.beforeEach(authGuard);

  return Router;
});
