import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/personal', component: () => import('pages/PersonalPage.vue') },
      { path: '/personal/:id', component: () => import('pages/PersonalDetailPage.vue'), name: 'personal-detail' },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      { path: '', component: () => import('modules/auth/pages/LoginPage.vue') }
    ]
  },
  {
    path: '/portal',
    component: () => import('layouts/OnboardingLayout.vue'),
    children: [
      { path: '', redirect: '/portal/registro' },
      { path: 'verificar', component: () => import('modules/onboarding/pages/PortalVerificacionPage.vue') },
      { path: 'registro', component: () => import('modules/onboarding/pages/PortalRegistroPage.vue') },
      { path: 'token/:token', component: () => import('modules/onboarding/pages/PortalVerificacionPage.vue') },
      { path: 'success', component: () => import('modules/onboarding/pages/PortalCompletadoPage.vue') },
    ]
  },

  // Alphabetical sort/other groups...
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
