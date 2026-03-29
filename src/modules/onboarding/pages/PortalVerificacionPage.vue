<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-unitepc-sso sso-grid overflow-hidden">

        <div class="relative-position z-top flex flex-center full-width">
          <div class="column items-center full-width q-px-md">

            <!-- HERO BLOCK -->
            <div class="text-center text-white q-mb-xl hero-block" style="max-width: 500px">
              <div class="badge-pill q-mb-md">
                <span class="ping-dot"></span>
                <span class="text-caption text-weight-bold q-ml-sm" style="color: #80cbc4; letter-spacing: 2px;">
                  SIGETH · GESTIÓN DE LEGAJOS
                </span>
              </div>
              <h1 class="hero-title q-ma-none">
                Registro de <br />
                <span class="hero-gradient-text">Expediente Digital</span>
              </h1>
              <p class="hero-sub q-mt-md">
                Ingrese sus credenciales para habilitar la carga o actualización de sus antecedentes académicos y laborales.
              </p>
            </div>

            <!-- TARJETA DE VERIFICACIÓN -->
            <q-card flat class="main-card-sso overflow-hidden" style="max-width: 420px; width: 100%">
              <!-- LÍNEA DE LUZ (DEGRADADO SSO) -->
              <div class="bg-unitepc-sso" style="height: 5px"></div>

              <q-card-section class="q-pa-xl">
                <div class="column items-center q-mb-lg">
                  <div class="verify-icon-wrap bg-unitepc-sso shadow-10">
                    <q-icon name="fingerprint" size="32px" color="white" />
                  </div>
                  <div class="text-h6 text-weight-bold text-grey-9 q-mt-md">Verificación de Identidad</div>
                  <div class="text-caption text-grey-6 q-mt-xs">Valide su identidad con su cédula y fecha para acceder.</div>
                </div>

                <q-form @submit="onSubmit" class="q-gutter-y-md">
                  <q-input
                    v-model="form.ci"
                    label="Carnet de Identidad"
                    outlined
                    rounded
                    dense
                    bg-color="white"
                    :rules="[val => !!val || 'Requerido']"
                    :disable="!!resultado"
                  >
                    <template v-slot:prepend><q-icon name="badge" color="primary" /></template>
                  </q-input>

                  <q-input
                    v-model="form.fecha_nacimiento"
                    label="Fecha de Nacimiento"
                    outlined
                    rounded
                    dense
                    type="date"
                    stack-label
                    bg-color="white"
                    :rules="[val => !!val || 'Requerido']"
                    :disable="!!resultado"
                  >
                    <template v-slot:prepend><q-icon name="event" color="primary" /></template>
                  </q-input>

                  <!-- BOTÓN VALIDAR (solo si no se ha verificado aún) -->
                  <q-btn
                    v-if="!resultado"
                    type="submit"
                    unelevated
                    color="warning"
                    text-color="dark"
                    class="full-width btn-sso-action q-py-md text-weight-bold"
                    :loading="loading"
                    icon-right="arrow_forward"
                    label="VALIDAR MI IDENTIDAD"
                    no-caps
                  />
                </q-form>

                <!-- ══════ RESULTADO DE LA VERIFICACIÓN ══════ -->
                <div v-if="resultado" class="q-mt-lg animate-result">
                  <!-- PERSONA ENCONTRADA -->
                  <div v-if="resultado === 'encontrado'" class="q-pa-md rounded-16 bg-positive text-white text-center q-mb-md">
                    <q-icon name="check_circle" size="32px" class="q-mr-sm" />
                    <span class="text-weight-bold">¡Expediente encontrado!</span>
                    <div class="text-caption q-mt-xs">Se cargarán tus datos registrados previamente.</div>
                  </div>

                  <!-- PERSONA NO ENCONTRADA -->
                  <div v-if="resultado === 'nuevo'" class="q-pa-md rounded-16 bg-orange-8 text-white text-center q-mb-md">
                    <q-icon name="person_add" size="32px" class="q-mr-sm" />
                    <span class="text-weight-bold">No se encontró registro previo</span>
                    <div class="text-caption q-mt-xs">Puedes iniciar un nuevo expediente digital.</div>
                  </div>

                  <!-- ERROR -->
                  <div v-if="resultado === 'error'" class="q-pa-md rounded-16 bg-negative text-white text-center q-mb-md">
                    <q-icon name="error" size="32px" class="q-mr-sm" />
                    <span class="text-weight-bold">Error de conexión</span>
                    <div class="text-caption q-mt-xs">{{ errorMsg }}</div>
                  </div>

                  <!-- BOTONES DE ACCIÓN -->
                  <div class="column q-gutter-y-sm">
                    <q-btn
                      v-if="resultado === 'encontrado'"
                      unelevated
                      color="positive"
                      text-color="white"
                      class="full-width btn-sso-action q-py-md text-weight-bold"
                      icon-right="arrow_forward"
                      label="CARGAR MIS DATOS Y CONTINUAR"
                      no-caps
                      @click="goToRegistro"
                    />
                    <q-btn
                      v-if="resultado === 'nuevo'"
                      unelevated
                      color="warning"
                      text-color="dark"
                      class="full-width btn-sso-action q-py-md text-weight-bold"
                      icon="person_add"
                      icon-right="arrow_forward"
                      label="REGISTRARME COMO NUEVO"
                      no-caps
                      @click="goToRegistro"
                    />
                    <q-btn
                      v-if="resultado === 'error'"
                      unelevated
                      color="warning"
                      text-color="dark"
                      class="full-width btn-sso-action q-py-md text-weight-bold"
                      icon="person_add"
                      label="CONTINUAR DE TODAS FORMAS"
                      no-caps
                      @click="goToRegistroMinimal"
                    />
                    <q-btn
                      flat
                      rounded
                      color="grey-6"
                      class="full-width q-py-sm"
                      icon="refresh"
                      label="Intentar con otro CI"
                      no-caps
                      @click="resetForm"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- COPYRIGHT -->
            <div class="q-mt-xl text-white text-caption text-weight-bold text-center" style="opacity: 0.35; letter-spacing: 2px;">
              © {{ new Date().getFullYear() }} · UNITEPC · SIGETH
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from 'src/stores/onboardingStore'
import { Notify } from 'quasar'

const router = useRouter()
const onboardingStore = useOnboardingStore()

const loading = ref(false)
const form = ref({ ci: '', fecha_nacimiento: '' })
const resultado = ref<'encontrado' | 'nuevo' | 'error' | null>(null)
const errorMsg = ref('')

const onSubmit = async () => {
  loading.value = true
  resultado.value = null
  try {
    const resp = await onboardingStore.verificarIdentidad(form.value)
    if (resp.success && resp.datos_precargados) {
      resultado.value = 'encontrado'
      Notify.create({ color: 'positive', message: `Expediente encontrado para CI ${form.value.ci}`, icon: 'check_circle' })
    } else if (resp.success && !resp.datos_precargados) {
      resultado.value = 'nuevo'
    }
  } catch (err: any) {
    const status = err.response?.status
    const msg = err.response?.data?.message || ''
    
    if (status === 401) {
      // Fecha de nacimiento no coincide
      resultado.value = 'error'
      errorMsg.value = msg || 'La fecha de nacimiento no coincide con el CI proporcionado.'
      Notify.create({ color: 'negative', message: errorMsg.value, icon: 'error' })
    } else {
      // Error de servidor o conexión — permitir continuar como nuevo
      onboardingStore.persona.ci = form.value.ci
      onboardingStore.persona.fecha_nacimiento = form.value.fecha_nacimiento
      onboardingStore.saveToLocal()
      resultado.value = 'nuevo'
      Notify.create({ color: 'info', message: 'No se pudo verificar. Puedes registrarte como nuevo.', icon: 'info' })
    }
  } finally {
    loading.value = false
  }
}

const goToRegistro = () => {
  router.push('/portal/registro')
}

const goToRegistroMinimal = () => {
  onboardingStore.persona.ci = form.value.ci
  onboardingStore.persona.fecha_nacimiento = form.value.fecha_nacimiento
  onboardingStore.saveToLocal()
  router.push('/portal/registro')
}

const resetForm = () => {
  resultado.value = null
  form.value = { ci: '', fecha_nacimiento: '' }
  onboardingStore.clearStore()
}
</script>

<style scoped lang="scss">
.hero-block { animation: hero-in 0.8s ease-out both; }
@keyframes hero-in { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

.badge-pill {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  padding: 6px 16px;
}

.ping-dot {
  position: relative;
  width: 10px; height: 10px;
  background: #4ade80;
  border-radius: 50%;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: #4ade80;
    border-radius: 50%;
    animation: ping 1.5s infinite;
  }
}
@keyframes ping { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(3); opacity: 0; } }

.hero-title {
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -1.5px;
}

.hero-gradient-text {
  background: linear-gradient(100deg, #67e8f9 0%, #a5f3fc 40%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-sub { font-size: 0.9rem; opacity: 0.8; max-width: 400px; margin: 0 auto; color: #e0f2f1; }

.main-card-sso {
  background: #ffffff;
  border-radius: 28px !important;
  box-shadow: 0 40px 80px rgba(0,0,0,0.2) !important;
  animation: card-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
}
@keyframes card-in { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

.verify-icon-wrap {
  width: 64px; height: 64px;
  border-radius: 18px;
  display: flex; align-items: center; justify-content: center;
}

.btn-sso-action {
  border-radius: 999px !important;
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3) !important;
  transition: transform 0.2s, box-shadow 0.2s !important;
  &:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 15px 40px rgba(245, 158, 11, 0.45) !important;
  }
}

.animate-result {
  animation: resultIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes resultIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.rounded-16 { border-radius: 16px !important; }
</style>
