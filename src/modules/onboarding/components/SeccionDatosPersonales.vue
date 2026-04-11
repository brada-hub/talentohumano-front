<template>
  <q-card flat class="rounded-32 bg-white card-shadow overflow-hidden q-pb-lg border-light">
    <!-- CABECERA INSTITUCIONAL STYLED -->
    <q-card-section class="bg-unitepc-sso text-white row items-center q-pa-xl">
      <q-avatar size="56px" font-size="28px" color="white" text-color="primary" icon="person" class="q-mr-md shadow-2" />
      <div>
        <div class="text-h5 text-weight-bolder tracking-tight">1. Datos Personales de Filiación</div>
        <div class="text-caption opacity-80 uppercase tracking-widest text-weight-medium">Información Obligatoria para Legajo Digital</div>
      </div>
      <q-space />
      <q-icon name="qr_code_2" size="48px" class="opacity-20 q-mr-md" />
    </q-card-section>

    <q-card-section class="row q-col-gutter-xl q-pa-xl">
      <!-- FOTO DE PERFIL / AVATAR PREMIUM -->
      <div class="col-12 col-md-3">
        <div class="column items-center q-gutter-y-md">
          <div class="avatar-container shadow-20">
            <q-avatar size="180px" class="avatar-border">
              <q-img v-if="fotoPreview" :src="fotoPreview" ratio="1" spinner-color="primary" />
              <div v-else class="full-height full-width flex flex-center bg-grey-1 text-grey-4">
                <q-icon name="person" size="80px" />
              </div>
            </q-avatar>
            <q-btn 
              round 
              color="indigo-9" 
              icon="photo_camera" 
              size="md" 
              class="absolute-bottom-right shadow-10 btn-upload"
              @click="onFileClick"
            >
              <q-tooltip class="bg-indigo-9">Subir Foto de Perfil</q-tooltip>
            </q-btn>
          </div>
          <div class="text-center">
            <div class="text-subtitle2 text-weight-bold text-grey-8">Fotografía Formal</div>
            <div class="text-caption text-grey-5 font-italic">Formato vertical .jpg o .png</div>
          </div>
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFotoChange" />
        </div>
      </div>

      <!-- FORMULARIO LIMPIO -->
      <div class="col-12 col-md-9">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-3"><q-select v-model="persona.tratamiento" @update:model-value="save" :options="tratamientoOptions" label="Tratamiento" outlined dense stack-label class="input-marble" /></div>
          <div class="col-12 col-md-3"><q-input v-model="persona.primer_apellido" @update:model-value="save" input-class="text-uppercase" label="Primer Apellido" outlined dense stack-label :rules="[val => !!val || 'Requerido']" class="input-marble" /></div>
          <div class="col-12 col-md-4"><q-input v-model="persona.segundo_apellido" @update:model-value="save" input-class="text-uppercase" label="Segundo Apellido" outlined dense stack-label class="input-marble" /></div>
          <div class="col-12 col-md-2"><q-input v-model="persona.nombres" @update:model-value="save" input-class="text-uppercase" label="Nombres" outlined dense stack-label :rules="[val => !!val || 'Requerido']" class="input-marble" /></div>
          
          <div class="col-12 col-md-4"><q-input v-model="persona.ci" @update:model-value="save" input-class="text-uppercase" label="Cédula de Identidad" outlined dense stack-label :rules="[val => !!val || 'Requerido']" class="input-marble" /></div>
          <div class="col-12 col-md-2"><q-input v-model="persona.complemento" @update:model-value="save" input-class="text-uppercase" label="Comp." outlined dense stack-label class="input-marble" /></div>
          <div class="col-12 col-md-3"><q-select v-model="persona.id_expedido" @update:model-value="save" label="Expedido" outlined dense :options="expedidoOptions" emit-value map-options stack-label class="input-marble" :rules="[val => !!val || 'Requerido']" /></div>
          <div class="col-12 col-md-3"><q-select v-model="persona.id_sexo" @update:model-value="save" label="Género" outlined dense :options="sexOptions" emit-value map-options stack-label class="input-marble" :rules="[val => !!val || 'Requerido']" /></div>

          <div class="col-12 col-md-4"><q-input v-model="persona.fecha_nacimiento" @update:model-value="save" type="date" stack-label label="Fecha de Nacimiento" outlined dense class="input-marble" :rules="[val => !!val || 'Requerido']" /></div>
          <div class="col-12 col-md-4"><q-input v-model="persona.celular_personal" @update:model-value="save" label="Teléfono Celular" outlined dense stack-label class="input-marble" :rules="[val => val && val.length >= 8 || 'Min. 8 digitos']" /></div>
          <div class="col-12 col-md-4"><q-input v-model="persona.correo_personal" @update:model-value="save" label="Email de Contacto" outlined dense stack-label class="input-marble" :rules="[val => !!val || 'Requerido']" /></div>
          <div class="col-12 col-md-4"><q-input v-model="persona.correo_institucional" @update:model-value="save" label="Correo Institucional" outlined dense stack-label class="input-marble" /></div>
          
          <div class="col-12 col-md-3"><q-select v-model="persona.estado_civil" @update:model-value="save" label="Estado Civil" outlined dense :options="civOptions" stack-label class="input-marble" :rules="[val => !!val || 'Requerido']" /></div>
          <div class="col-12 col-md-3"><q-select v-model="persona.id_nacionalidad" @update:model-value="save" :options="nationOptions" emit-value map-options label="Nacionalidad Originaria" outlined dense stack-label class="input-marble" :rules="[val => !!val || 'Requerido']" /></div>
          
          <div class="col-12 col-md-3">
             <q-select 
               v-model="persona.id_depto_residencia" 
               :options="deptoResidenciaOptions" 
               emit-value map-options
               label="Departamento" 
               outlined dense stack-label 
               class="input-marble" 
               @update:model-value="onDeptoChange"
               :rules="[val => !!val || 'Requerido']"
             />
          </div>

          <div class="col-12 col-md-3"><q-select v-model="persona.id_ciudad" :options="cityOptions" emit-value map-options label="Ciudad / Municipio" outlined dense stack-label class="input-marble" :rules="[val => !!val || 'Requerido']" /></div>

          <div class="col-12"><q-input v-model="persona.direccion_domicilio" @update:model-value="save" input-class="text-uppercase" label="Dirección Detallada de Domicilio" outlined dense stack-label class="input-marble" :rules="[val => !!val || 'Requerido']" /></div>

          <div class="col-12 q-mt-md">
            <q-file 
              v-model="archivos.ci_escaneado" 
              @update:model-value="onCiEscaneadoChange"
              label="Cédula de Identidad Escaneada (Obligatorio) *" 
              outlined 
              dense
              class="input-marble"
              accept=".pdf,image/*"
              :rules="[val => !!val || 'El carnet escaneado es obligatorio']"
            >
              <template v-slot:prepend>
                <q-icon name="cloud_upload" color="primary" />
              </template>
              <template v-slot:append>
                <q-icon v-if="archivos.ci_escaneado" name="check_circle" color="positive" />
              </template>
            </q-file>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Notify } from 'quasar'
import { useOnboardingStore } from 'src/stores/onboardingStore'
import { getFileSizeError, sanitizeAlphanumeric, sanitizeLetters, sanitizeNumbers } from 'src/shared/utils/formValidators'
import { optimizeUploadFile } from 'src/shared/utils/uploadOptimizer'

const emit = defineEmits(['change'])
const onboardingStore = useOnboardingStore()
const persona = computed(() => onboardingStore.persona)
const archivos = computed(() => onboardingStore.archivos)

// Opciones dinamicas desde el store
const paisOptions = computed(() => onboardingStore.paises)
const nationOptions = computed(() => onboardingStore.nacionalidades)
const expedidoOptions = computed(() => onboardingStore.expedidos)
const deptoResidenciaOptions = computed(() => onboardingStore.departamentos)
const cityOptions = computed(() => onboardingStore.ciudades)

const sexOptions = [ { label: 'Masculino', value: 1 }, { label: 'Femenino', value: 2 } ]
const civOptions = ['Soltero(a)', 'Casado(a)', 'Divorciado(a)', 'Viudo(a)', 'Conviviente']
const tratamientoOptions = ['Sr.', 'Sra.', 'Lic.', 'Ing.', 'Dr.', 'Dra.', 'Mgtr.', 'PhD.']

const fileInput = ref<HTMLInputElement | null>(null)
const fotoPreview = ref<string | null>(null)
const lastGeneratedInstitutionalEmail = ref('')

onMounted(async () => {
  if (onboardingStore.persona.foto) fotoPreview.value = onboardingStore.persona.foto
  
  // Cargar catálogos base en paralelo
  await Promise.all([
    onboardingStore.fetchPaises(),
    onboardingStore.fetchNacionalidades(),
    onboardingStore.fetchExpedidos()
  ])
  
  // Si ya tiene un pais seleccionado de antes (Bolivia por defecto), cargar los deptos de residencia
  if (persona.value.id_pais) {
    onboardingStore.fetchDepartamentos(persona.value.id_pais)
  }
  
  // Si ya tiene un depto, cargar sus ciudades
  if (persona.value.id_depto_residencia) {
    onboardingStore.fetchCiudades(persona.value.id_depto_residencia)
  }
})

// Cascada: Pais -> Departamentos
watch(() => persona.value.id_pais, (newVal) => {
  if (newVal) {
    onboardingStore.fetchDepartamentos(newVal)
    persona.value.id_depto_residencia = null
    persona.value.id_ciudad = null 
  }
})

// Cascada: Departamento -> Ciudades
const onDeptoChange = (deptoId: number) => {
  if (deptoId) {
    onboardingStore.fetchCiudades(deptoId)
  }
}

const onFileClick = () => fileInput.value?.click()
const onFotoChange = async (e: any) => {
  const file = e.target.files[0]
  if (file) {
    const result = await optimizeUploadFile(file)
    if (result.error || !result.file) {
      Notify.create({ color: 'negative', message: result.error || 'No se pudo procesar la imagen.' })
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = (event: any) => {
      fotoPreview.value = event.target.result
      onboardingStore.persona.foto = event.target.result
      save()
    }
    reader.readAsDataURL(result.file)
    if (result.optimized) {
      Notify.create({ color: 'info', message: 'La imagen fue optimizada antes de guardarse.' })
    }
  }
}

const onCiEscaneadoChange = async (file: File | null) => {
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
  if (persona.value.primer_apellido) persona.value.primer_apellido = sanitizeLetters(persona.value.primer_apellido).toUpperCase()
  if (persona.value.segundo_apellido) persona.value.segundo_apellido = sanitizeLetters(persona.value.segundo_apellido).toUpperCase()
  if (persona.value.nombres) persona.value.nombres = sanitizeLetters(persona.value.nombres).toUpperCase()
  if (persona.value.ci) persona.value.ci = sanitizeAlphanumeric(persona.value.ci).toUpperCase()
  if (persona.value.complemento) persona.value.complemento = sanitizeAlphanumeric(persona.value.complemento).toUpperCase()
  if (persona.value.celular_personal) persona.value.celular_personal = sanitizeNumbers(persona.value.celular_personal)
  if (persona.value.direccion_domicilio) persona.value.direccion_domicilio = sanitizeAlphanumeric(persona.value.direccion_domicilio).toUpperCase()
  
  emit('change')
}

const normalizeForEmail = (value: string) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

const buildInstitutionalEmail = () => {
  const nombres = normalizeForEmail(persona.value.nombres)
  const apellidos = normalizeForEmail(persona.value.primer_apellido)

  if (!nombres.length || !apellidos.length) return ''

  return `${nombres[0]}.${apellidos[0]}@unitepc.edu.bo`
}

watch(
  () => [persona.value.nombres, persona.value.primer_apellido],
  () => {
    const generated = buildInstitutionalEmail()
    const current = String(persona.value.correo_institucional || '').trim().toLowerCase()

    if (!generated) return

    if (!current || current === lastGeneratedInstitutionalEmail.value) {
      persona.value.correo_institucional = generated
    }

    lastGeneratedInstitutionalEmail.value = generated
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.rounded-32 { border-radius: 32px !important; }
.bg-gradient-unitepc {
  background: linear-gradient(135deg, #1a237e 0%, #311b92 100%);
}
.card-shadow {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
}
.border-light {
  border: 1px solid rgba(225, 232, 240, 0.8);
}
.avatar-container {
  position: relative;
  border-radius: 50%;
  padding: 8px;
  background: #fff;
}
.avatar-border {
  border: 4px solid #f8f9fa;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}
.btn-upload {
  border: 4px solid white;
  transition: all 0.3s ease;
  &:hover { transform: scale(1.1); }
}
.input-marble {
  :deep(.q-field__control) {
    border-radius: 12px !important;
    background: #f8f9fadb !important;
    transition: all 0.3s ease;
    &:hover { background: #fff !important; }
  }
  &.q-field--focused :deep(.q-field__control) {
    background: #fff !important;
    box-shadow: 0 4px 12px rgba(26, 35, 126, 0.1);
  }
}
.tracking-tight { letter-spacing: -0.5px; }
.tracking-widest { letter-spacing: 1px; }
.opacity-80 { opacity: 0.8; }
.opacity-20 { opacity: 0.2; }
</style>
