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
                v-if="canAccessItem(item)"
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
                 <q-img v-if="authStore.user?.persona?.foto" :src="authStore.user?.persona?.foto_url || authStore.user?.persona?.foto" />
                 <span v-else>{{ (authStore.userFullName || 'U').charAt(0).toUpperCase() }}</span>
              </q-avatar>
              <div class="column q-ml-md overflow-hidden">
                 <span class="text-caption text-weight-bolder text-grey-9 text-uppercase ellipsis" style="font-size: 11px;">
                    {{ authStore.userFullName }}
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

    <!-- DIALOGO: CAMBIO DE CONTRASEÑA OBLIGATORIO (PRIMER LOGUEO) -->
    <q-dialog v-model="showChangePasswordDialog" persistent>
      <q-card class="modern-dialog rounded-24 shadow-24" style="width: 450px">
        <q-card-section class="bg-gradient-portal text-white q-py-lg">
          <div class="row items-center no-wrap">
            <q-icon name="security" size="md" class="q-mr-md" />
            <div class="column">
              <div class="text-h6 font-bold">Cambio de Contraseña Obligatorio</div>
              <div class="text-caption opacity-80">Por seguridad, debes actualizar tu contraseña en tu primer acceso.</div>
            </div>
          </div>
        </q-card-section>
        
        <q-card-section class="q-pa-xl">
          <q-form @submit="handleChangePassword" class="q-gutter-y-lg">
             <q-input
              v-model="passwordForm.current_password"
              :type="isPwd1 ? 'password' : 'text'"
              label="Contraseña Actual (tu CI)"
              outlined
              class="modern-input"
              lazy-rules
              :rules="[val => !!val || 'Requerido']"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd1 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd1 = !isPwd1"
                />
              </template>
            </q-input>
            <q-input
              v-model="passwordForm.new_password"
              :type="isPwd2 ? 'password' : 'text'"
              label="Nueva Contraseña"
              outlined
              class="modern-input"
              lazy-rules
              :rules="[val => !!val || 'Requerido', val => val.length >= 4 || 'MÃ­n. 4 caracteres']"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd2 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd2 = !isPwd2"
                />
              </template>
            </q-input>
            <q-input
              v-model="passwordForm.new_password_confirmation"
              :type="isPwd3 ? 'password' : 'text'"
              label="Confirmar Nueva Contraseña"
              outlined
              class="modern-input"
              lazy-rules
              :rules="[val => !!val || 'Requerido', val => val === passwordForm.new_password || 'Las contraseñas no coinciden']"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd3 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd3 = !isPwd3"
                />
              </template>
            </q-input>

            <div class="row justify-end q-mt-xl">
              <q-btn 
                label="Actualizar y Continuar" 
                type="submit" 
                class="btn-gradient-portal rounded-12 q-px-xl text-white" 
                :loading="loadingPassword"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="sessionTimeoutState.warningVisible" persistent>
      <q-card class="modern-dialog rounded-24 shadow-24" style="width: 440px; max-width: 92vw">
        <q-card-section class="bg-gradient-portal text-white q-py-lg">
          <div class="row items-center no-wrap">
            <q-icon name="schedule" size="md" class="q-mr-md" />
            <div class="column">
              <div class="text-h6 font-bold">Sesión por expirar</div>
              <div class="text-caption opacity-80">Detectamos inactividad. Puedes continuar o cerrar ahora.</div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-xl">
          <div class="text-body1 text-grey-8 q-mb-md">
            Tu sesión se cerrará en
            <span class="text-primary text-weight-bolder">{{ sessionTimeoutState.countdownSeconds }}</span>
            segundos.
          </div>
          <div class="text-caption text-grey-6">
            Si sigues trabajando, presiona <strong>Seguir en línea</strong>.
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-px-xl q-pb-xl q-gutter-sm">
          <q-btn flat no-caps color="negative" label="Cerrar sesión ahora" @click="handleSessionLogoutNow" />
          <q-btn no-caps class="btn-gradient-portal text-white rounded-12 q-px-lg" label="Seguir en línea" @click="handleSessionContinue" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'src/modules/auth/stores/useAuthStore'
import { sessionTimeoutManager, sessionTimeoutState } from 'src/shared/session/sessionTimeoutManager'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)

// Lógica de cambio de contraseña obligatorio
const isPwd1 = ref(true)
const isPwd2 = ref(true)
const isPwd3 = ref(true)
const showChangePasswordDialog = computed(() => !!authStore.user?.debe_cambiar_password)
const loadingPassword = ref(false)
const passwordForm = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const handleChangePassword = async () => {
  loadingPassword.value = true
  try {
    await authStore.changePassword({
      current_password: passwordForm.current_password,
      new_password: passwordForm.new_password,
      new_password_confirmation: passwordForm.new_password_confirmation
    })
  } catch (err: any) {
    console.error(err)
  } finally {
    loadingPassword.value = false
  }
}

onMounted(async () => {
  await authStore.fetchMe()
})

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// MenÃº del Sistema de GestiÃ³n de Talento Humano (SIGETH)
const navItems = [
  { label: 'Inicio', icon: 'dashboard', path: '/', requiresAdmin: false },
  { label: 'Personas', icon: 'badge', path: '/personal', requiresAdmin: false, permission: 'personal.ver' },
  { label: 'Recordatorios', icon: 'notifications_active', path: '/recordatorios', requiresAdmin: false, permission: 'recordatorios.ver' },
  { label: 'Reportes', icon: 'analytics', path: '/reportes', requiresAdmin: false, permission: 'reportes.ver' },
  { label: 'Sedes y Campus', icon: 'apartment', path: '/sedes', requiresAdmin: true, permission: 'sedes.ver' },
  { label: 'Estructura', icon: 'account_tree', path: '/estructura', requiresAdmin: true, permission: 'estructura.ver' },
  { label: 'Catálogos', icon: 'folder_open', path: '/geo', requiresAdmin: true, permission: 'geo.ver' },
  { label: 'SSO & Accesos', icon: 'admin_panel_settings', path: '/sso', requiresAdmin: true, permission: 'sso.ver' },
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

const canAccessItem = (item: { requiresAdmin?: boolean; permission?: string }) => {
  if (item.requiresAdmin && !isAdmin.value) {
    return false
  }

  if (!item.permission) {
    return true
  }

  return isAdmin.value || authStore.can(item.permission)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handleSessionContinue = async () => {
  await sessionTimeoutManager.continueSession()
}

const handleSessionLogoutNow = async () => {
  await sessionTimeoutManager.logoutNow()
}
</script>

<style lang="scss">
// â•â• COLOR VARIABLES SISPO â•â•
$sispo-primary: #6A37A3; // PÃºrpura UNITEPC
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

