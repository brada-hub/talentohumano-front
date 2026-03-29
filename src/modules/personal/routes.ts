import { RouteRecordRaw } from 'vue-router'

const personalRoutes: RouteRecordRaw[] = [
  {
    path: '/personal',
    name: 'personal',
    component: () => import('layouts/MainLayout.vue'),
    meta: { auth: true },
    children: [
      {
        path: '',
        name: 'personal.list',
        component: () => import('./pages/PersonaListPage.vue'),
        meta: { title: 'Gestión de Personas' }
      },
      {
        path: 'create',
        name: 'personal.create',
        component: () => import('./pages/PersonaFormPage.vue'),
        meta: { title: 'Registrar Persona' }
      },
      {
        path: ':id',
        name: 'personal.detail',
        component: () => import('pages/PersonalDetailPage.vue'),
        meta: { title: 'Detalle de Personal' }
      }
    ]
  }
]

export default personalRoutes
