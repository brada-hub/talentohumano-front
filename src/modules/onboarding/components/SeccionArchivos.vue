<template>
  <q-card flat class="rounded-32 bg-white card-shadow overflow-hidden q-mt-xl border-light">
    <!-- CABECERA INSTITUCIONAL: ARCHIVOS -->
    <q-card-section class="bg-unitepc-sso text-white row items-center q-pa-xl">
      <q-avatar size="56px" font-size="28px" color="white" text-color="blue-grey-10" icon="cloud_upload" class="q-mr-md shadow-2" />
      <div>
        <div class="text-h5 text-weight-bolder tracking-tight">5. Documentacion Firmada / Digital</div>
        <div class="text-caption opacity-80 uppercase tracking-widest text-weight-medium">Carga de Documentos Identitarios</div>
      </div>
      <q-space />
      <q-badge outline color="white" label="ESCANEOS OBLIGATORIOS" class="q-px-md" />
    </q-card-section>

    <q-card-section class="q-pa-xl">
      <div class="row q-col-gutter-xl items-center">
        <!-- ICONO Y REGLAS -->
        <div class="col-12 col-md-5">
          <div class="bg-blue-grey-1 q-pa-lg rounded-24 border-light shadow-1">
             <div class="row items-center q-mb-md">
               <q-icon name="info" color="blue-grey-8" size="sm" class="q-mr-sm" />
               <div class="text-subtitle2 text-weight-bold text-blue-grey-9 uppercase">Requisitos de Digitalizacion</div>
             </div>
             <p class="text-caption text-blue-grey-7 line-height-relaxed">
               Asegurese de que el documento este en formato <strong>PDF</strong> o <strong>Imagen de alta calidad</strong>. 
               El escaneo debe mostrar ambas caras de la Cedula de Identidad de forma legible. 
               (Maximo 1 MB).
             </p>
             <q-btn flat dense color="blue-grey-8" label="Ver ejemplo de escaneo" icon="visibility" class="text-weight-bold" size="sm" />
          </div>
        </div>

        <!-- CARGA DE ARCHIVO -->
        <div class="col-12 col-md-7">
          <div class="column q-gutter-y-md">
            <q-file 
              v-model="archivos.ci_escaneado" 
              @update:model-value="onCiFileChange"
              label="Cedula de Identidad Escaneada *" 
              outlined 
              rounded
              class="input-premium-dark"
              accept=".pdf,image/*"
              bg-color="white"
              :rules="[val => !!val || 'El carnet escaneado es obligatorio']"
            >
              <template v-slot:prepend>
                <q-icon name="badge" color="blue-grey-6" />
              </template>
              <template v-slot:append>
                <q-icon v-if="archivos.ci_escaneado" name="check_circle" color="positive" />
              </template>
              <q-tooltip class="bg-blue-grey-10">Adjunte su CI en un solo archivo</q-tooltip>
            </q-file>

            <div v-if="archivos.ci_escaneado" class="flex items-center q-pa-md bg-green-1 rounded-16 border-green-2 animate-bounce-soft">
              <q-icon name="task_alt" color="positive" size="sm" class="q-mr-md" />
              <div class="text-caption text-positive font-bold uppercase tracking-widest">Documento Listo para Envio</div>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Notify } from 'quasar'
import { useOnboardingStore } from 'src/stores/onboardingStore'
import { optimizeUploadFile } from 'src/shared/utils/uploadOptimizer'

const onboardingStore = useOnboardingStore()
const archivos = computed(() => onboardingStore.archivos)

const onCiFileChange = async (file: File | null) => {
  const result = await optimizeUploadFile(file)

  if (result.error) {
    onboardingStore.archivos.ci_escaneado = null
    Notify.create({ color: 'negative', message: result.error })
    return
  }

  onboardingStore.archivos.ci_escaneado = result.file

  if (result.optimized) {
    Notify.create({ color: 'info', message: 'La imagen fue optimizada antes de guardarse.' })
  }

  save()
}

const save = () => {
  onboardingStore.saveToLocal()
}
</script>

<style lang="scss" scoped>
.rounded-32 { border-radius: 32px !important; }
.rounded-24 { border-radius: 24px !important; }
.rounded-16 { border-radius: 16px !important; }

.bg-gradient-dark { background: linear-gradient(135deg, #455a64 0%, #263238 100%); }
.card-shadow { box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05); }
.border-light { border: 1px solid rgba(225, 232, 240, 0.8); }
.border-green-2 { border: 1px solid #c8e6c9; }

.input-premium-dark {
  :deep(.q-field__control) {
    border-radius: 20px !important;
    padding: 12px 20px;
    background: #ffffff !important;
    border: 2px solid #eceff1;
    transition: all 0.3s ease;
    &:hover { border-color: #455a64; background: #fcfdfe !important; }
  }
}

.animate-bounce-soft {
  animation: bounceSoft 2s infinite ease-in-out;
}

@keyframes bounceSoft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.tracking-tight { letter-spacing: -0.5px; }
.tracking-widest { letter-spacing: 1px; }
.line-height-relaxed { line-height: 1.6; }
</style>
