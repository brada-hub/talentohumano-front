<template>
  <q-page class="bg-marble min-h-screen font-sans">
    <div class="bg-unitepc-sso q-pt-xl q-pb-xl overflow-hidden relative-position shadow-2">
      <div class="absolute-full sso-grid"></div>

      <div class="q-px-lg relative-position z-top" style="max-width: 1000px; margin: 0 auto">
        <div class="row items-center q-gutter-x-sm q-mb-md animate-fade">
          <q-icon name="verified" class="text-teal-3" size="sm" />
          <span class="text-white text-caption text-weight-bold tracking-widest uppercase">Proceso Oficial de Vinculacion</span>
        </div>
        <h1 class="text-white text-h3 text-weight-bolder q-mt-none q-mb-md animate-slide-right tracking-tighter">
          FORMULARIO DE <span class="text-teal-3">REGISTRO</span>
        </h1>
        <p class="text-white opacity-80 text-subtitle1" style="max-width: 600px">
          Complete la informacion requerida de manera clara para habilitar su expediente institucional.
          Sus datos estan resguardados por el sistema <strong>SIGETH</strong>.
        </p>
      </div>

      <q-btn flat rounded color="white" label="Atras" to="/portal/verificar" no-caps class="absolute-top-right q-ma-md" style="z-index: 10" icon="arrow_back" />
    </div>

    <div class="q-pa-xl relative-position" style="max-width: 1400px; margin: 0 auto">
      <q-stepper
        v-model="step"
        ref="stepper"
        color="primary"
        animated
        flat
        class="bg-transparent q-pa-none"
      >
        <q-step
          :name="1"
          title="Filiacion y Datos Personales"
          subtitle="Informacion Obligatoria"
          icon="person"
          :done="step > 1"
          class="q-px-none"
        >
          <div class="animate-card-in">
            <SeccionDatosPersonales @change="onboardingStore.saveToLocal" />
          </div>

          <div class="row justify-end q-mt-lg">
            <q-btn
              @click="step = 2"
              color="indigo-9"
              :label="onboardingStore.isPersonaComplete ? 'Continuar a Beneficiarios' : 'Faltan Campos Obligatorios'"
              icon-right="arrow_forward"
              class="shadow-10 text-weight-bold q-py-sm q-px-lg transition-transform"
              rounded
              unelevated
              :disable="!onboardingStore.isPersonaComplete"
            />
          </div>
        </q-step>

        <q-step
          :name="2"
          title="Beneficiarios"
          subtitle="Herederos o derechohabientes"
          icon="groups"
          :done="step > 2"
          class="q-px-none"
        >
          <div class="animate-card-in">
            <SeccionBeneficiarios />
          </div>

          <div class="row justify-between q-mt-xl items-center bg-white q-pa-md rounded-32 shadow-2 border-light">
            <q-btn flat @click="step = 1" color="grey-8" label="Volver a Datos Personales" icon="arrow_back" rounded class="q-px-md"/>
            <q-btn @click="step = 3" color="indigo-9" label="Continuar a Documentacion" icon-right="arrow_forward" unelevated class="shadow-10 text-weight-bold q-py-sm q-px-lg" rounded />
          </div>
        </q-step>

        <q-step
          :name="3"
          title="Documentacion"
          subtitle="Hoja de Vida y Meritos"
          icon="folder_shared"
          :done="step > 3"
          class="q-px-none"
        >
          <div class="row q-col-gutter-xl">
            <div class="col-12 animate-card-in-delay-1"><SeccionFormacion /></div>
            <div class="col-12 animate-card-in-delay-2"><SeccionExperiencia /></div>
            <div class="col-12 animate-card-in-delay-3"><SeccionOtros /></div>
          </div>
          <div class="row justify-between q-mt-xl items-center bg-white q-pa-md rounded-32 shadow-2 border-light">
            <q-btn flat @click="step = 2" color="grey-8" label="Volver a Beneficiarios" icon="arrow_back" rounded class="q-px-md"/>
            <q-btn @click="step = 4" color="indigo-9" label="Continuar a Finalizar" icon-right="arrow_forward" unelevated class="shadow-10 text-weight-bold q-py-sm q-px-lg" rounded />
          </div>
        </q-step>

        <q-step
          :name="4"
          title="Finalizar Registro"
          subtitle="Confirmacion y Envio"
          icon="check_circle"
          class="q-px-none"
        >
          <div class="animate-card-in-delay-1 text-center q-pa-xl rounded-24 bg-blue-grey-1 border-light q-mb-xl">
            <q-icon name="outbox" size="80px" color="indigo-8" class="q-mb-md animate-bounce-soft" />
            <div class="text-h4 text-weight-bolder tracking-tight text-blue-grey-10">Todo Listo para el Envio</div>
            <p class="text-subtitle1 text-grey-7 q-mt-md" style="max-width: 500px; margin: 0 auto;">
              Verifique que toda su informacion personal, documentos escaneados y meritos de su trayectoria han sido cargados correctamente antes de guardar definitivamente su Legajo Digital.
            </p>
          </div>

          <div class="row justify-between items-center q-pa-md rounded-32 bg-white">
            <q-btn flat @click="step = 3" color="grey-8" label="Volver a Documentacion" icon="arrow_back" rounded class="q-px-md"/>
            <q-btn
              unelevated
              size="lg"
              color="indigo-10"
              rounded
              class="shadow-20 btn-finalizar q-px-xl py-md"
              @click="submitAll"
              :loading="onboardingStore.loading"
            >
              <div class="row items-center no-wrap">
                <q-icon name="cloud_done" class="q-mr-md" />
                <div class="text-weight-bolder uppercase tracking-widest" style="font-size: 0.9rem">Finalizar y Guardar Legajo</div>
              </div>
            </q-btn>
          </div>
        </q-step>
      </q-stepper>
    </div>

    <div class="q-py-xl text-center text-grey-5 text-caption uppercase tracking-widest font-weight-bold">
      © {{ new Date().getFullYear() }} · UNITEPC · SIGETH · Departamento de Talento Humano
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from 'src/stores/onboardingStore'
import { Notify } from 'quasar'
import SeccionDatosPersonales from '../components/SeccionDatosPersonales.vue'
import SeccionBeneficiarios from '../components/SeccionBeneficiarios.vue'
import SeccionFormacion from '../components/SeccionFormacion.vue'
import SeccionExperiencia from '../components/SeccionExperiencia.vue'
import SeccionOtros from '../components/SeccionOtros.vue'

const router = useRouter()
const onboardingStore = useOnboardingStore()
const step = ref(1)

const submitAll = async () => {
  onboardingStore.loading = true
  try {
    await onboardingStore.completarRegistro()
    Notify.create({
      color: 'indigo-10',
      message: 'Expediente almacenado correctamente. Bienvenido al sistema.',
      icon: 'verified',
      position: 'center',
      classes: 'rounded-16 shadow-20 text-weight-bold q-pa-lg'
    })
    router.push('/portal/success')
  } catch (err: any) {
    Notify.create({
      color: 'negative',
      message: err.response?.data?.message || err.message || 'Error al guardar el expediente.',
      icon: 'report_problem'
    })
  } finally {
    onboardingStore.loading = false
  }
}
</script>

<style scoped lang="scss">
.bg-marble {
  background: #f8f9fa;
  &::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: radial-gradient(#d1d9e6 0.5px, transparent 0.5px);
    background-size: 30px 30px;
    opacity: 0.3;
    pointer-events: none;
  }
}

.bg-unitepc-banner {
  background: linear-gradient(135deg, #4f2789 0%, #00c2cb 100%);
}

.rounded-32 { border-radius: 32px !important; }
.shadow-20 { box-shadow: 0 20px 50px rgba(79, 39, 137, 0.15); }
.border-dashed { border: 2px dashed #eceff1; }

.tracking-tighter { letter-spacing: -2px; }
.tracking-widest { letter-spacing: 2px; }

.animate-fade { animation: fadeIn 0.8s ease-out; }
.animate-slide-right { animation: slideRight 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
.animate-card-in { animation: cardIn 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
.animate-card-in-delay-1 { opacity: 0; animation: cardIn 0.8s 0.2s forwards; }
.animate-card-in-delay-2 { opacity: 0; animation: cardIn 0.8s 0.3s forwards; }
.animate-card-in-delay-3 { opacity: 0; animation: cardIn 0.8s 0.4s forwards; }
.animate-card-in-delay-4 { opacity: 0; animation: cardIn 0.8s 0.5s forwards; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideRight {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.btn-finalizar {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  &:hover { transform: translateY(-5px); box-shadow: 0 25px 60px rgba(79, 39, 137, 0.25); }
  &:active { transform: scale(0.95); }
}
</style>
