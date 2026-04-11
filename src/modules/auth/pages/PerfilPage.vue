<template>
  <q-page class="q-pa-lg fade-in">
    <!-- Unified Profile Card -->
    <q-card class="unified-profile-card shadow-soft">
      
      <!-- Inside Banner -->
      <div class="profile-banner">
        <div class="banner-overlay"></div>
      </div>

      <div class="row items-end q-px-xl q-pb-lg q-pt-sm" style="position: relative; z-index: 2;">
        
        <!-- Avatar overlapping -->
        <q-avatar size="140px" class="profile-avatar shadow-lift" style="margin-top: -60px;">
          <q-img v-if="authStore.user?.persona?.foto" :src="authStore.user?.persona?.foto_url || authStore.user?.persona?.foto" />
          <span v-else class="text-h2 text-white text-weight-bold">{{ userInitials }}</span>
        </q-avatar>

        <!-- Basic Details -->
        <div class="column q-ml-xl q-pb-sm">
          <h1 class="text-h4 text-weight-bolder name-gradient q-my-none" style="letter-spacing: -0.5px;">
            {{ authStore.userFullName }}
          </h1>
          <div class="row items-center q-gutter-x-sm q-mt-xs">
            <span class="text-subtitle2 text-grey-6 text-uppercase letter-spacing-1 font-medium">
              {{ authStore.user?.persona ? authStore.user?.username : 'Usuario No Asociado' }}
            </span>
            <q-chip 
              v-if="authStore.userRoles.length > 0" 
              class="bg-indigo-1 text-indigo-9 text-weight-bold" 
              size="sm" dense
            >
               {{ typeof authStore.userRoles[0] === 'string' ? authStore.userRoles[0] : (authStore.userRoles[0]?.nombres || 'Rol') }}
            </q-chip>
          </div>
        </div>

        <q-space />

        <!-- Actions -->
        <div class="row q-gutter-md q-pb-sm">
          <q-btn
            outline
            color="indigo-5"
            icon="edit_note"
            label="Editar Info"
            class="rounded-12 text-weight-bold px-lg"
            no-caps
            @click="openEditDialog"
          />
          <q-btn
            color="red-5"
            flat
            class="rounded-12 bg-red-1 text-red-9 text-weight-bold px-md"
            icon="logout"
            no-caps
            @click="handleLogout"
          />
        </div>
      </div>

      <!-- Navigation Tabs -->
      <q-separator color="grey-2" />
      <q-tabs
        v-model="activeTab"
        class="text-grey-7 q-px-md"
        active-color="indigo-9"
        indicator-color="indigo-9"
        align="left"
        no-caps
      >
        <q-tab name="personal" label="Información Personal" icon="person_outline" class="text-weight-bold q-px-lg" />
        <q-tab name="security" label="Seguridad & Accesos" icon="shield" class="text-weight-bold q-px-lg" />
      </q-tabs>
      <q-separator color="grey-2" />

      <!-- Tab Panels -->
      <q-tab-panels v-model="activeTab" animated class="bg-transparent q-pa-lg">
        
        <!-- Tab 1: Personal Info -->
        <q-tab-panel name="personal">
          <div class="text-h6 text-weight-bolder text-grey-9 q-mb-xl">Mis Datos Demográficos</div>
          <div class="row q-col-gutter-xl">
            
            <div class="col-12 col-sm-6 col-md-6">
              <div class="info-group">
                <q-icon name="badge" color="indigo-5" size="22px"/>
                <div class="column">
                  <span class="info-label">Documento de Identidad</span>
                  <span class="info-value">{{ authStore.userCI || 'No registrado' }}</span>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-md-6">
              <div class="info-group">
                <q-icon name="location_on" color="indigo-5" size="22px"/>
                <div class="column">
                  <span class="info-label">Sede Administrativa</span>
                  <span class="info-value text-uppercase">{{ authStore.userSede }}</span>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-md-6">
              <div class="info-group">
                <q-icon name="cake" color="indigo-5" size="22px"/>
                <div class="column">
                  <span class="info-label">Fecha de Nacimiento</span>
                  <span class="info-value">{{ formatDate(authStore.user?.persona?.fecha_nacimiento) }}</span>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-md-6">
              <div class="info-group">
                <q-icon name="wc" color="indigo-5" size="22px"/>
                <div class="column">
                  <span class="info-label">Género / Estado Civil</span>
                  <span class="info-value text-uppercase">
                    {{ authStore.user?.persona?.sexo?.nombre || 'N/A' }} / {{ authStore.user?.persona?.estado_civil || 'N/A' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-md-6">
              <div class="info-group">
                <q-icon name="mail" color="indigo-5" size="22px"/>
                <div class="column">
                  <span class="info-label">Correo Personal</span>
                  <span class="info-value">{{ authStore.user?.persona?.correo_personal || 'No registrado' }}</span>
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-md-6">
              <div class="info-group">
                <q-icon name="phone" color="indigo-5" size="22px"/>
                <div class="column">
                  <span class="info-label">Celular Particular</span>
                  <span class="info-value">{{ authStore.user?.persona?.celular_personal || 'No registrado' }}</span>
                </div>
              </div>
            </div>

             <div class="col-12">
              <div class="info-group">
                <q-icon name="home" color="indigo-5" size="22px"/>
                <div class="column">
                  <span class="info-label">Dirección de Domicilio</span>
                  <span class="info-value">{{ authStore.user?.persona?.direccion_domicilio || 'No especificada' }}</span>
                </div>
              </div>
            </div>

          </div>
        </q-tab-panel>

        <!-- Tab 2: Security & Access -->
        <q-tab-panel name="security">
          <div class="row q-col-gutter-xl">
            <!-- Left: Passwords -->
            <div class="col-12 col-md-6">
              <div class="text-h6 text-weight-bolder text-grey-9 q-mb-md">Gestión de Credenciales</div>
              <p class="text-grey-6 text-subtitle2 q-mb-lg">
                Mantén tu cuenta segura actualizando regularmente tu contraseña.
                Asegúrate de usar contraseñas largas y únicas.
              </p>

              <q-card class="bg-indigo-1 q-pa-md rounded-16 shadow-none" bordered>
                <div class="row items-center justify-between no-wrap">
                  <div class="row items-center no-wrap">
                    <q-avatar size="48px" class="bg-white shadow-soft q-mr-md" text-color="indigo">
                      <q-icon name="password" />
                    </q-avatar>
                    <div class="column">
                      <span class="text-weight-bold text-body1 text-indigo-10">Contraseña de Acceso</span>
                      <span class="text-caption text-indigo-8">Última actualización: Desconocida</span>
                    </div>
                  </div>
                  <q-btn color="indigo-9" label="Cambiar" class="rounded-12 font-bold px-lg" no-caps @click="pwdDialog.show = true" />
                </div>
              </q-card>
            </div>

            <!-- Right: Roles and Perms -->
            <div class="col-12 col-md-6">
               <div class="text-h6 text-weight-bolder text-grey-9 q-mb-md">Permisos Asignados (SSO)</div>
               <p class="text-grey-6 text-subtitle2 q-mb-lg">
                Atribuciones vigentes vinculadas a esta cuenta corporativa dentro del ecosistema SIGETH.
              </p>
              <q-card class="bg-grey-1 shadow-none rounded-16 q-pa-lg" bordered>
                 <div class="row q-gutter-sm">
                  <q-chip 
                    v-for="perm in authStore.userPermissions" 
                    :key="perm" 
                    :label="perm"
                    outline
                    color="indigo-4"
                    size="md"
                    class="text-weight-bold bg-white"
                  />
                  <div v-if="!authStore.userPermissions.length" class="text-grey-5 text-center italic full-width q-py-lg text-body2">
                    No posees permisos granulares asignados en este momento.
                  </div>
                 </div>
              </q-card>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- DIALOG: CAMBIO DE PASSWORD -->
    <q-dialog v-model="pwdDialog.show" persistent>
      <q-card class="modern-dialog rounded-24 shadow-24" style="width: 440px">
        <q-card-section class="bg-gradient-portal text-white q-py-lg">
          <div class="row items-center no-wrap">
            <q-icon name="security" size="md" class="q-mr-md" />
            <div class="column">
              <div class="text-h6 font-bold">Seguridad de Cuenta</div>
              <div class="text-caption opacity-80">Actualización de contraseña</div>
            </div>
          </div>
        </q-card-section>
        
        <q-card-section class="q-pa-xl">
          <q-form @submit="changePassword" class="q-gutter-y-lg">
            <q-input 
              v-model="pwdDialog.data.current_password" 
              label="Contraseña Actual" 
              outlined 
              :type="isPwd1 ? 'password' : 'text'"
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
              v-model="pwdDialog.data.new_password" 
              label="Nueva Contraseña" 
              outlined 
              :type="isPwd2 ? 'password' : 'text'"
              class="modern-input" 
              lazy-rules 
              :rules="[val => !!val || 'Requerido', val => val.length >= 4 || 'Mínimo 4 caracteres']" 
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
              v-model="pwdDialog.data.new_password_confirmation" 
              label="Confirmar Nueva Contraseña" 
              outlined 
              :type="isPwd3 ? 'password' : 'text'"
              class="modern-input" 
              lazy-rules 
              :rules="[val => !!val || 'Requerido', val => val === pwdDialog.data.new_password || 'No coinciden']" 
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd3 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd3 = !isPwd3"
                />
              </template>
            </q-input>

            <div class="row justify-end q-gutter-x-md q-mt-xl">
              <q-btn flat label="Cancelar" color="grey-7" v-close-popup class="rounded-12 text-weight-bold" no-caps/>
              <q-btn label="Confirmar Cambio" type="submit" class="bg-indigo-9 rounded-12 q-px-xl text-white shadow-lift text-weight-bold" no-caps :loading="apiLoading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- DIALOG: EDITAR INFORMACION -->
    <q-dialog v-model="editDialog.show" persistent>
      <q-card class="modern-dialog rounded-24 shadow-24" style="width: 450px">
        <q-card-section class="bg-gradient-orange text-white q-py-lg">
          <div class="row items-center no-wrap">
            <q-icon name="edit_note" size="md" class="q-mr-md" />
            <div class="column">
              <div class="text-h6 font-bold">Editar Perfil</div>
              <div class="text-caption opacity-80">Actualiza tus datos de contacto</div>
            </div>
          </div>
        </q-card-section>
        
        <q-card-section class="q-pa-xl">
          <q-form @submit="updateProfile" class="q-gutter-y-lg">
            <q-input 
              v-model="editDialog.data.correo_personal" 
              label="Correo Personal" 
              outlined 
              type="email"
              class="modern-input" 
              lazy-rules 
              :rules="[val => !!val || 'Requerido']" 
            />
            <q-input 
              v-model="editDialog.data.celular_personal" 
              label="Número de Celular" 
              outlined 
              class="modern-input" 
              lazy-rules 
              :rules="[val => !!val || 'Requerido']" 
            />
            <q-input 
              v-model="editDialog.data.direccion_domicilio" 
              label="Dirección de Domicilio" 
              outlined 
              type="textarea"
              rows="3"
              class="modern-input" 
            />

            <div class="row justify-end q-gutter-x-md q-mt-xl">
              <q-btn flat label="Cancelar" color="grey-7" v-close-popup class="rounded-12 text-weight-bold" no-caps/>
              <q-btn label="Guardar Cambios" type="submit" color="orange-9" class="rounded-12 q-px-xl text-white shadow-lift text-weight-bold" no-caps :loading="apiLoading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'
import { useQuasar } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()
const apiLoading = ref(false)

const isPwd1 = ref(true)
const isPwd2 = ref(true)
const isPwd3 = ref(true)

const activeTab = ref('personal')

onMounted(async () => {
  if (!authStore.user?.persona) {
    await authStore.fetchMe()
  }

  if (router.currentRoute.value.query.forceChange === '1' || authStore.user?.debe_cambiar_password) {
    pwdDialog.show = true
    $q.notify({
      type: 'warning',
      message: 'Debes actualizar tu contraseña para continuar por razones de seguridad.',
      position: 'top-right',
      timeout: 10000,
      closeBtn: true
    })
  }
})

const formatDate = (date: string) => {
  if (!date) return 'No registrada'
  // Prevenir problemas de zona horaria (UTC-4 Bolivia) al parsear fechas YYYY-MM-DD
  const [year, month, day] = date.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const userInitials = computed(() => {
  const p = authStore.user?.persona
  if (p && p.nombres && p.primer_apellido) {
    return (p.nombres[0] + p.primer_apellido[0]).toUpperCase()
  }
  return (authStore.user?.username || 'U').substring(0, 2).toUpperCase()
})

const pwdDialog = reactive({
  show: false,
  data: {
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  }
})

const editDialog = reactive({
  show: false,
  data: {
    correo_personal: '',
    celular_personal: '',
    direccion_domicilio: ''
  }
})

const openEditDialog = () => {
  const p = authStore.user?.persona
  if (p) {
    editDialog.data = {
      correo_personal: p.correo_personal || '',
      celular_personal: p.celular_personal || '',
      direccion_domicilio: p.direccion_domicilio || ''
    }
  }
  editDialog.show = true
}

const updateProfile = async () => {
  apiLoading.value = true
  try {
    await authStore.updateProfile(editDialog.data)
    $q.notify({ type: 'positive', message: 'Perfil actualizado correctamente', icon: 'check_circle' })
    editDialog.show = false
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'Error al actualizar perfil', icon: 'error' })
  } finally {
    apiLoading.value = false
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const changePassword = async () => {
  apiLoading.value = true
  try {
    await authStore.changePassword({
      current_password: pwdDialog.data.current_password,
      new_password: pwdDialog.data.new_password,
      new_password_confirmation: pwdDialog.data.new_password_confirmation
    })
    $q.notify({
      type: 'positive',
      message: '¡Excelente! Contraseña actualizada',
      icon: 'verified_user'
    })
    pwdDialog.show = false
    pwdDialog.data = { current_password: '', new_password: '', new_password_confirmation: '' }
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: typeof error === 'string' ? error : 'La contraseña actual es incorrecta',
      icon: 'error'
    })
  } finally {
    apiLoading.value = false
  }
}
</script>

<style scoped>
/* 
  ====== REDESIGN UX/UI =======
  Harmonized layout, premium feel, modern web spacing.
*/
.fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Banner */
.profile-banner {
  height: 220px;
  background: url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80') center/cover no-repeat;
  position: relative;
}
.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(106, 55, 163, 0.8) 0%, rgba(0, 169, 157, 0.6) 100%);
  z-index: 1;
}

.unified-profile-card {
  margin: 0 auto;
  border-radius: 24px;
  background: white;
  max-width: 1100px;
  position: relative;
  border: 1px solid rgba(0,0,0,0.05);
  overflow: hidden;
}

.profile-avatar {
  border: 4px solid white;
  background: linear-gradient(135deg, #6A37A3 0%, #4f46e5 100%);
}

.name-gradient {
  background: linear-gradient(90deg, #6A37A3 0%, #00A99D 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.letter-spacing-1 { letter-spacing: 1.5px; }
.font-medium { font-weight: 500; }

.shadow-soft { box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08); }
.shadow-lift { transition: transform 0.3s; }
.shadow-lift:hover { transform: translateY(-4px); }

.px-lg { padding-left: 24px; padding-right: 24px; }
.px-md { padding-left: 16px; padding-right: 16px; }

.info-group {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}
.info-group:hover {
  background: white;
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

.info-label {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}
.info-value {
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
}

.rounded-16 { border-radius: 16px !important; }
.rounded-12 { border-radius: 12px !important; }
.bg-gradient-portal { background: linear-gradient(135deg, #6A37A3 0%, #00A99D 100%); }
.bg-gradient-orange { background: linear-gradient(135deg, #FF8C00 0%, #f97316 100%); }

.modern-dialog { border: 1px solid rgba(255,255,255,0.7); }
</style>
