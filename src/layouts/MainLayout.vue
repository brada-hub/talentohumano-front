<template>
  <q-layout view="lHh Lpr lFf" class="bg-page">
    
    <!-- 1. HEADER (DEGRADADO PORTAL UNITEPC) -->
    <q-header flat class="bg-gradient-portal text-white">
      <q-toolbar class="q-py-sm q-px-md">
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" class="q-mr-md" />

        <div class="column">
          <div class="text-weight-bolder text-h6 text-uppercase" style="line-height: 1.1">
            {{ pageTitle }}
          </div>
          <div class="text-caption opacity-80 letter-spacing-1">
            SIGETH - UNITEPC
          </div>
        </div>

        <q-space />
      </q-toolbar>
    </q-header>

    <!-- 2. SIDEBAR (CLON IDENTICO AL SISPO) -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="270"
      class="sidebar-sispo"
      side="left"
    >
      <div class="column full-height no-wrap">
        
        <!-- Brand Area / UNITEPC LOGO -->
        <div class="q-pa-lg text-center">
          <q-img src="favicon.ico" width="200px" fit="contain" class="q-mb-sm" />
          <div class="text-grey-6 text-weight-bold" style="font-size: 11px; line-height: 1.3;">
            Sistema de Gestión de Talento Humano
          </div>
        </div>

        <!-- Section Label -->
        <div class="q-px-md q-mt-lg">
          <div class="text-grey-5 text-weight-bolder q-mb-sm letter-spacing-1" style="font-size: 9px;">
            MENÚ PRINCIPAL
          </div>
        </div>

        <!-- Navigation Menu -->
        <q-scroll-area class="col q-px-md">
          <q-list class="q-gutter-y-xs">
            <template v-for="item in navItems" :key="item.path">
              <q-item
                v-if="!item.requiresAdmin || isAdmin"
                clickable
                v-ripple
                :to="item.path"
                exact
                class="nav-item-sispo rounded-8"
                active-class="nav-item-active-teal"
              >
                <q-item-section avatar>
                  <q-icon :name="item.icon" size="20px" class="nav-icon" />
                </q-item-section>
                <q-item-section>
                  <div class="text-weight-bold" style="font-size: 13px;">
                    {{ item.label }}
                  </div>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-scroll-area>

        <!-- Sidebar Footer / Profile Info -->
        <div class="q-pa-md column q-gutter-y-sm">
           <div class="row no-wrap items-center q-pa-sm bg-grey-1 rounded-8">
              <q-avatar size="34px" color="indigo-1" text-color="indigo-9" class="text-weight-bold shadow-1">
                 {{ authStore.user?.username.charAt(0).toUpperCase() }}
              </q-avatar>
              <div class="column q-ml-md overflow-hidden">
                 <span class="text-caption text-weight-bolder text-grey-9 text-uppercase ellipsis" style="font-size: 11px;">
                    {{ authStore.user?.username }}
                 </span>
                 <span class="text-grey-6 text-uppercase text-weight-bolder" style="font-size: 8px;">
                    {{ activeRole }}
                 </span>
              </div>
           </div>

           <q-btn
             flat
             no-caps
             class="full-width btn-gradient-portal text-white rounded-8 text-weight-bold"
             icon="logout"
             label="Cerrar Sesión"
             style="font-size: 13px;"
             @click="handleLogout"
           />
        </div>
      </div>
    </q-drawer>

    <!-- 3. PAGE CONTENT CONTAINER -->
    <q-page-container class="bg-page shadow-inner">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'src/modules/auth/stores/useAuthStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)

onMounted(async () => {
  await authStore.fetchMe()
})

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Menú del Sistema de Gestión de Talento Humano (SIGETH)
const navItems = [
  { label: 'Inicio', icon: 'dashboard', path: '/', requiresAdmin: false },
  { label: 'Personas', icon: 'badge', path: '/personal', requiresAdmin: false },
  { label: 'Catálogos', icon: 'folder_open', path: '/geo', requiresAdmin: true },
  { label: 'SSO & Accesos', icon: 'admin_panel_settings', path: '/sso', requiresAdmin: true },
  { label: 'Mi Perfil', icon: 'account_circle', path: '/perfil', requiresAdmin: false },
]

const pageTitle = computed(() => {
  const current = navItems.find((item) => item.path === route.path)
  return current ? current.label : 'Bienvenidos'
})

const activeRole = computed(() => {
  const roles = authStore.user?.roles || []
  if (roles.length > 0) {
    return typeof roles[0] === 'string' ? roles[0] : (roles[0].nombres || 'Usuario')
  }
  return 'Usuario'
})

const isAdmin = computed(() => {
  const role = (activeRole.value || '').toUpperCase()
  return role === 'ADMIN' || role === 'SISTEMAS' || role === 'ADMINISTRADOR'
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style lang="scss">
// ══ COLOR VARIABLES SISPO ══
$sispo-primary: #6A37A3; // Púrpura UNITEPC
$sispo-accent: #00A99D;  // Teal / Turquesa de SISPO
$sispo-bg: #fdf2ff;      // Fondo lila suave para botones secundarios
$sispo-grey: #f4f6f8;    // Gris suave para cards sidebar

.bg-unitepc { background: $sispo-primary !important; }
.bg-grey-1 { background: $sispo-grey !important; }
.bg-purple-soft { background: $sispo-bg !important; }
.text-primary { color: $sispo-primary !important; }
.rounded-8 { border-radius: 8px !important; }

// Header spacing
.letter-spacing-1 { letter-spacing: 1px; }

// Sidebar specific
.sidebar-sispo {
  background: white !important;
  border-right: 1px solid #e2e8f0 !important;
}

.nav-item-sispo {
  color: #64748b;
  min-height: 52px;
  margin-bottom: 2px;
  
  .nav-icon { color: #94a3b8; }

  &:hover {
    background: #f8fafc;
    color: #1e293b;
    .nav-icon { color: $sispo-accent; }
  }
}

.nav-item-active-teal {
  background: linear-gradient(90deg, $sispo-primary, $sispo-accent) !important;
  color: white !important;
  box-shadow: 0 4px 15px rgba(106, 55, 163, 0.4);
  
  .nav-icon { color: white !important; }
}

.bg-page { background: #f8fafc; }
.shadow-inner { box-shadow: inset 0 2px 10px rgba(0,0,0,0.02); }

@media (max-width: 600px) {
  .hide-on-mobile { display: none; }
}
</style>
