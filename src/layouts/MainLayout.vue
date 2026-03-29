<template>
  <q-layout view="lHh Lpr lFf" class="bg-page">
    <!-- 1. HEADER -->
    <q-header flat bordered class="header-premium" :class="isDark ? 'text-white' : 'text-grey-9'">
      <q-toolbar class="q-py-sm">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="q-mr-sm"
        />

        <div class="header-title flex items-center">
          <q-icon name="dashboard" color="primary" size="24px" class="q-mr-sm" />
          <div class="text-weight-bolder text-h6 text-uppercase" style="letter-spacing: 1px">
            {{ pageTitle }}
          </div>
        </div>

        <q-space />

        <div class="q-gutter-sm flex items-center">
          <q-btn
            flat
            round
            :icon="isDark ? 'light_mode' : 'dark_mode'"
            :color="isDark ? 'amber' : 'grey-8'"
            @click="toggleDarkMode"
          />

          <q-separator vertical inset class="q-mx-sm" />

          <div class="column no-wrap items-end q-mr-sm hide-on-mobile">
            <span class="text-caption text-weight-bold text-primary">{{ authStore.user?.username }}</span>
            <span class="text-caption text-grey-7" style="font-size: 10px">{{ activeRole }}</span>
          </div>

          <q-avatar size="36px" class="avatar-header cursor-pointer">
            <img :src="`https://ui-avatars.com/api/?name=${authStore.user?.username}&background=6B4FA0&color=fff`" />
            <q-menu auto-close class="unitepc-menu">
              <q-list style="min-width: 150px">
                <q-item clickable @click="handleLogout" class="text-grey-7">
                  <q-item-section avatar>
                    <q-icon name="logout" size="sm" />
                  </q-item-section>
                  <q-item-section>Cerrar Sesión</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-avatar>
        </div>
      </q-toolbar>
    </q-header>

    <!-- 2. SIDEBAR (modern black or clean white) -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="280"
      :class="isDark ? 'bg-sidebar-dark text-white' : 'bg-sidebar-light text-grey-9'"
      class="sidebar-premium"
      side="left"
    >
      <div class="column full-height no-wrap">
        <!-- Brand Area -->
        <div class="brand-area q-pa-lg text-center">
          <div class="brand-logo flex flex-center q-mb-md">
            <q-img src="favicon.ico" width="180px" fit="contain" />
          </div>
          <div class="brand-tagline" :class="isDark ? 'text-grey-5' : 'text-grey-7'">
             SISTEMA DE TALENTO HUMANO
          </div>
        </div>

        <q-separator :dark="isDark" class="q-mx-lg opacity-20" />

        <!-- Navigation -->
        <q-scroll-area class="col q-mt-md">
          <q-list padding class="q-px-md">
          <q-item
            clickable
            v-ripple
            to="/"
            exact
            class="nav-item q-mb-sm"
            :active-class="isDark ? 'nav-item-active-dark' : 'nav-item-active-light'"
          >
            <q-item-section avatar>
              <q-icon name="dashboard" size="24px" />
            </q-item-section>
            <q-item-section class="text-weight-bold">Dashboard</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/personal"
            class="nav-item q-mb-sm"
            :active-class="isDark ? 'nav-item-active-dark' : 'nav-item-active-light'"
          >
            <q-item-section avatar>
              <q-icon name="person" size="24px" />
            </q-item-section>
            <q-item-section class="text-weight-bold">Personal</q-item-section>
          </q-item>
          </q-list>
        </q-scroll-area>

        <!-- User Footer Area -->
        <div class="footer-area q-pa-md">
          <q-btn
            flat
            color="grey-7"
            class="full-width q-py-sm"
            label="Cerrar Sesión"
            icon="logout"
            no-caps
            @click="handleLogout"
          />
        </div>
      </div>
    </q-drawer>

    <!-- 3. PAGE CONTENT -->
    <q-page-container>
      <router-view class="q-pa-md" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'src/modules/auth/stores/useAuthStore'
import { useDarkMode } from 'src/shared/composables/useDarkMode'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { isDark, toggle: toggleDarkMode } = useDarkMode()

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const navItems = [
  { label: 'Dashboard', icon: 'home', path: '/', requiresAdmin: false },
  { label: 'Personal', icon: 'person', path: '/personal', requiresAdmin: false },
  { label: 'Talento Humano', icon: 'work', path: '/talento-humano', requiresAdmin: false },
  { label: 'Académico', icon: 'school', path: '/academico', requiresAdmin: false },
  { label: 'Beneficios', icon: 'favorite', path: '/beneficios', requiresAdmin: false },
  { label: 'Configuración', icon: 'settings', path: '/config', requiresAdmin: true },
]

const pageTitle = computed(() => {
  const current = navItems.find((item) => item.path === route.path)
  return current ? current.label : 'Bienvenidos'
})

const activeRole = computed(() => {
  const roles = authStore.user?.roles || []
  return roles.length > 0 ? roles[0].nombres : 'Usuario'
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
// ══ Colors from DESIGN_SYSTEM.md ══
$sidebar-color: #6B4FA0;
$sidebar-active: #533D7D;
$teal-accent: #00A99D;
$purple-light: #A888E3;

.header-premium {
  background-color: var(--bg-header) !important;
}

.bg-sidebar-dark {
  background-color: #000000 !important;
  border-right: 1px solid #222222;
}

.bg-sidebar-light {
  background-color: #FFFFFF !important;
  border-right: 1px solid #E2E8F0;
}

.brand-area {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.brand-logo {
  min-height: 80px;
}

.brand-tagline {
  font-size: 10px;
  margin-top: 5px;
  letter-spacing: 2px;
  font-weight: 700;
  text-transform: uppercase;
}

.nav-item {
  border-radius: 12px;
  transition: all 0.2s ease;
  margin-top: 4px;
  color: var(--text-secondary);

  &:hover {
    background: rgba(106, 55, 163, 0.08); // Usa el lila oficial muy tenue
    color: var(--color-primary);
  }
}

.nav-item-active-dark {
  background: #00968B !important; // Teal oficial
  color: #FFFFFF !important;
  box-shadow: 0 4px 15px rgba(0, 150, 139, 0.4);
}

.nav-item-active-light {
  background: var(--color-primary) !important;
  color: #FFFFFF !important;
  box-shadow: 0 4px 15px rgba(106, 55, 163, 0.3);
}

.logout-btn-rounded {
  border-radius: 20px;
  font-weight: 700;
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
}

.avatar-header {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

body.body--dark .avatar-header {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.opacity-20 { opacity: 0.2; }

@media (max-width: 600px) {
  .hide-on-mobile { display: none; }
}
</style>
