<template>
  <q-card flat class="rounded-32 bg-white card-shadow overflow-hidden q-mt-xl border-light">
    <!-- CABECERA INSTITUCIONAL: FORMACION -->
    <q-card-section class="bg-unitepc-sso text-white row items-center q-pa-xl">
      <q-avatar size="56px" font-size="28px" color="white" text-color="indigo-8" icon="workspace_premium" class="q-mr-md shadow-2" />
      <div>
        <div class="text-h5 text-weight-bolder tracking-tight">2. Formacion Academica</div>
        <div class="text-caption opacity-80 uppercase tracking-widest text-weight-medium">Grados Universitarios y Especializaciones</div>
      </div>
    </q-card-section>

    <!-- SECCIÃƒâ€œN PREGRADO -->
    <q-card-section class="q-pa-xl">
      <div class="row items-center q-mb-md">
        <div class="text-h6 text-indigo-9 text-weight-bolder">Formacion de Pregrado</div>
        <q-space />
        <q-btn unelevated color="indigo-8" label="Agregar Pregrado" icon="add" rounded @click="openPregrado" />
      </div>

      <div v-if="pregradoList.length === 0" class="flex flex-center q-pa-lg bg-grey-1 rounded-24 border-dashed">
        <div class="text-center text-grey-5">
          <q-icon name="history_edu" size="40px" class="q-mb-sm" />
          <div class="text-subtitle1">No hay titulos de pregrado</div>
        </div>
      </div>

      <div v-else class="row q-col-gutter-lg">
        <div v-for="(item, index) in pregradoList" :key="index" class="col-12 col-md-6">
          <q-card flat bordered class="rounded-24 item-card transition-all">
            <q-item class="q-pa-md">
              <q-item-section avatar>
                <q-avatar color="indigo-1" text-color="indigo-8" icon="school" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bolder text-indigo-9">{{ item.titulo }}</q-item-label>
                <q-item-label caption class="text-weight-medium">
                  {{ item.nivel }} - {{ item.institucion }}
                  <span class="text-grey-6">({{ deptoOptions.find(d => d.value === item.id_depto)?.label || 'N/R' }})</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row q-gutter-xs">
                  <q-btn flat round color="grey-7" icon="edit" size="sm" @click="editPregrado(item)" />
                  <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteItem(item)" />
                </div>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
      </div>
    </q-card-section>

    <q-separator inset />

    <!-- SECCIÃƒâ€œN POSTGRADO -->
    <q-card-section class="q-pa-xl">
      <div class="row items-center q-mb-md">
        <div class="text-h6 text-teal-9 text-weight-bolder">Formacion de Postgrado</div>
        <q-space />
        <q-btn unelevated color="teal-8" label="Agregar Postgrado" icon="add" rounded @click="openPostgrado" />
      </div>

      <div v-if="postgradoList.length === 0" class="flex flex-center q-pa-lg bg-grey-1 rounded-24 border-dashed">
        <div class="text-center text-grey-5">
          <q-icon name="military_tech" size="40px" class="q-mb-sm" />
          <div class="text-subtitle1">No hay diplomas o postgrados</div>
        </div>
      </div>

      <div v-else class="row q-col-gutter-lg">
        <div v-for="(item, index) in postgradoList" :key="index" class="col-12 col-md-6">
          <q-card flat bordered class="rounded-24 item-card transition-all">
            <q-item class="q-pa-md">
              <q-item-section avatar>
                <q-avatar color="teal-1" text-color="teal-8" icon="workspace_premium" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bolder text-teal-9">{{ item.titulo }}</q-item-label>
                <q-item-label caption class="text-weight-medium">
                  {{ item.tipo }} - {{ item.institucion }}
                   <span class="text-grey-6">({{ deptoOptions.find(d => d.value === item.id_depto)?.label || 'N/R' }})</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row q-gutter-xs">
                  <q-btn flat round color="grey-7" icon="edit" size="sm" @click="editPostgrado(item)" />
                  <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteItem(item)" />
                </div>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
      </div>
    </q-card-section>

    <!-- DIALOGO PREGRADO -->
    <q-dialog v-model="dialogPregrado" persistent backdrop-filter="blur(4px)">
      <q-card style="width: 700px; max-width: 90vw;" class="rounded-24 overflow-hidden">
        <q-card-section class="bg-unitepc-sso text-white row items-center q-py-md">
          <div class="text-h6 text-weight-bold">{{ isEditing ? 'Editar Pregrado' : 'Registrar Pregrado' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-select v-model="form.nivel" label="Nivel Academico *" :options="['Tecnico Medio', 'Tecnico Superior', 'Licenciatura']" outlined dense />
          </div>
          <div class="col-12 col-md-6">
            <q-select v-model="form.id_pais" :options="paisOptions" emit-value map-options label="Pais de Titulacion *" outlined dense @update:model-value="onPaisFormChange" />
          </div>
          <div class="col-12 col-md-6">
            <q-select v-model="form.id_depto" :options="deptoOptions" emit-value map-options label="Departamento / Estado *" outlined dense />
          </div>
          <div class="col-12">
            <q-input v-model="form.titulo" @update:model-value="forceUpper" input-class="text-uppercase" label="Nombre del Titulo en Provision Nacional *" outlined dense />
          </div>
          <div class="col-12">
            <q-input v-model="form.institucion" @update:model-value="forceUpper" input-class="text-uppercase" label="Institucion / Universidad *" outlined dense />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="form.fecha_emision_diploma" label="Fecha de Emision del Diploma *" type="date" stack-label outlined dense />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="form.fecha_emision" label="Fecha de Emision del Titulo *" type="date" stack-label outlined dense />
          </div>
          <!-- DOS ARCHIVOS PARA PREGRADO -->
          <div class="col-12">
            <q-file v-model="form.archivo_diploma" @update:model-value="onFileSelected('archivo_diploma', $event)" :display-value="fileDisplayValue(form.archivo_diploma, form.archivo_diploma_actual)" label="Subir Diploma Academico (PDF/JPG) *" outlined dense accept=".pdf,image/*">
              <template v-slot:prepend><q-icon name="workspace_premium" /></template>
            </q-file>
          </div>
          <div class="col-12">
            <q-file v-model="form.archivo_titulo" @update:model-value="onFileSelected('archivo_titulo', $event)" :display-value="fileDisplayValue(form.archivo_titulo, form.archivo_titulo_actual)" label="Subir Titulo en Provision Nacional (PDF/JPG) *" outlined dense accept=".pdf,image/*">
              <template v-slot:prepend><q-icon name="verified" /></template>
            </q-file>
          </div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated :label="isEditing ? 'Guardar Cambios' : 'Agregar a mi Legajo'" color="indigo-8" @click="saveItem" :disable="!isFormValid" rounded no-caps class="q-px-lg" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- DIALOGO POSTGRADO -->
    <q-dialog v-model="dialogPostgrado" persistent backdrop-filter="blur(4px)">
      <q-card style="width: 700px; max-width: 90vw;" class="rounded-24 overflow-hidden">
        <q-card-section class="bg-unitepc-sso text-white row items-center q-py-md">
          <div class="text-h6 text-weight-bold">{{ isEditing ? 'Editar Postgrado' : 'Registrar Postgrado' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <q-select v-model="form.tipo" label="Tipo de Postgrado *" :options="['Diplomado', 'Especializacion', 'Maestria', 'Doctorado']" outlined dense />
          </div>
          <div class="col-12 col-md-6">
            <q-select v-model="form.id_pais" :options="paisOptions" emit-value map-options label="Pais *" outlined dense @update:model-value="onPaisFormChange" />
          </div>
          <div class="col-12 col-md-6">
            <q-select v-model="form.id_depto" :options="deptoOptions" emit-value map-options label="Depto/Estado *" outlined dense />
          </div>
          <div class="col-12">
            <q-input v-model="form.titulo" @update:model-value="forceUpper" input-class="text-uppercase" label="Nombre del Postgrado / Tesis *" outlined dense />
          </div>
          <div class="col-12">
            <q-input v-model="form.institucion" @update:model-value="forceUpper" input-class="text-uppercase" label="Institucion / Universidad *" outlined dense />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="form.fecha_emision" label="Fecha de Emision *" type="date" stack-label outlined dense />
          </div>
          <!-- UN ARCHIVO PARA POSTGRADO -->
          <div class="col-12">
            <q-file v-model="form.archivo_respaldo" @update:model-value="onFileSelected('archivo_respaldo', $event)" :display-value="fileDisplayValue(form.archivo_respaldo, form.archivo_respaldo_actual)" label="Subir Titulo Escaneado (PDF/JPG) *" outlined dense accept=".pdf,image/*">
              <template v-slot:prepend><q-icon name="attach_file" /></template>
            </q-file>
          </div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated :label="isEditing ? 'Guardar Cambios' : 'Agregar a mi Legajo'" color="teal-8" @click="saveItem" :disable="!isFormValid" rounded no-caps class="q-px-lg" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Notify } from 'quasar'
import { useOnboardingStore } from 'src/stores/onboardingStore'
import { getFileSizeError, sanitizeAlphanumeric, sanitizeLetters } from 'src/shared/utils/formValidators'
import { optimizeUploadFile } from 'src/shared/utils/uploadOptimizer'

const onboardingStore = useOnboardingStore()

// Arrays separados visualmente
const pregradoList = computed(() => onboardingStore.academico.filter(i => i.tipo_registro === 'pregrado'))
const postgradoList = computed(() => onboardingStore.academico.filter(i => i.tipo_registro === 'postgrado'))

// Catalogos desde el store
const paisOptions = computed(() => onboardingStore.paises)
const deptoOptions = computed(() => onboardingStore.departamentos) // Se filtran internamente al llamar fetch

const asNumberOrNull = (value: any) => {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

const resolveCountryId = (item?: any) =>
  asNumberOrNull(item?.id_pais ?? item?.depto?.pais_id ?? item?.depto?.pais?.id_pais) || 2

const extractFileRef = (value: any) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value.__fromServerUrl || ''
}

const fileDisplayValue = (file: any, fallbackPath?: string | null) => {
  if (file instanceof File) return file.name
  if (!fallbackPath) return ''
  const parts = String(fallbackPath).split('/')
  return parts[parts.length - 1] || ''
}

const onPaisFormChange = (val: number) => {
  if (val) {
    onboardingStore.fetchDepartamentos(val)
    form.value.id_depto = null
  }
}

const dialogPregrado = ref(false)
const dialogPostgrado = ref(false)

const isEditing = ref(false)
const originalItem = ref<any>(null)

const form = ref<any>({})

const isFormValid = computed(() => {
  if (form.value.tipo_registro === 'pregrado') {
    return !!(form.value.nivel && form.value.id_depto && form.value.titulo && form.value.institucion && form.value.fecha_emision_diploma && form.value.fecha_emision && (form.value.archivo_diploma || form.value.archivo_diploma_actual) && (form.value.archivo_titulo || form.value.archivo_titulo_actual))
  }
  if (form.value.tipo_registro === 'postgrado') {
    return !!(form.value.tipo && form.value.id_depto && form.value.titulo && form.value.institucion && form.value.fecha_emision && (form.value.archivo_respaldo || form.value.archivo_respaldo_actual))
  }
  return false
})

const resetForm = () => {
  form.value = {
    tipo_registro: '',
    nivel: '',
    tipo: '',
    titulo: '',
    institucion: '',
    id_pais: 2,
    id_depto: null,
    fecha_emision_diploma: '',
    fecha_emision: '',
    archivo_diploma: null,
    archivo_titulo: null,
    archivo_respaldo: null,
    archivo_diploma_actual: '',
    archivo_titulo_actual: '',
    archivo_respaldo_actual: '',
  }
  isEditing.value = false
  originalItem.value = null
}

const forceUpper = () => {
  if (form.value.titulo) form.value.titulo = sanitizeAlphanumeric(form.value.titulo).toUpperCase()
  if (form.value.institucion) form.value.institucion = sanitizeLetters(form.value.institucion).toUpperCase()
}

const onFileSelected = async (field: 'archivo_diploma' | 'archivo_titulo' | 'archivo_respaldo', file: File | null) => {
  const result = await optimizeUploadFile(file)
  if (result.error) {
    form.value[field] = null
    Notify.create({ color: 'negative', message: result.error })
    return
  }

  form.value[field] = result.file

  if (result.optimized) {
    Notify.create({ color: 'info', message: 'La imagen fue optimizada antes de guardarse.' })
  }
}

const openPregrado = async () => {
  resetForm()
  form.value.tipo_registro = 'pregrado'
  await onboardingStore.fetchDepartamentos(form.value.id_pais)
  dialogPregrado.value = true
}

const openPostgrado = async () => {
  resetForm()
  form.value.tipo_registro = 'postgrado'
  await onboardingStore.fetchDepartamentos(form.value.id_pais)
  dialogPostgrado.value = true
}

const editPregrado = async (item: any) => {
  resetForm()
  form.value = {
    ...item,
    id_pais: resolveCountryId(item),
    id_depto: asNumberOrNull(item.id_depto),
    archivo_diploma_actual: extractFileRef(item.archivo_diploma),
    archivo_titulo_actual: extractFileRef(item.archivo_titulo),
  }
  // Limpiar archivos si no son instancias de File (ej: objetos vacÃƒÂ­os de LocalStorage)
  if (!(form.value.archivo_diploma instanceof File)) form.value.archivo_diploma = null
  if (!(form.value.archivo_titulo instanceof File)) form.value.archivo_titulo = null
  await onboardingStore.fetchDepartamentos(form.value.id_pais)
  isEditing.value = true
  originalItem.value = item
  dialogPregrado.value = true
}

const editPostgrado = async (item: any) => {
  resetForm()
  form.value = {
    ...item,
    id_pais: resolveCountryId(item),
    id_depto: asNumberOrNull(item.id_depto),
    archivo_respaldo_actual: extractFileRef(item.archivo_respaldo),
  }
  if (!(form.value.archivo_respaldo instanceof File)) form.value.archivo_respaldo = null
  await onboardingStore.fetchDepartamentos(form.value.id_pais)
  isEditing.value = true
  originalItem.value = item
  dialogPostgrado.value = true
}

const saveItem = () => {
  forceUpper() // Asegurar mayÃƒÂºsculas
  const fileError = [form.value.archivo_diploma, form.value.archivo_titulo, form.value.archivo_respaldo].map(getFileSizeError).find(Boolean)
  if (fileError) {
    Notify.create({ color: 'negative', message: fileError })
    return
  }
  const payload = {
    ...form.value,
    id_pais: asNumberOrNull(form.value.id_pais),
    id_depto: asNumberOrNull(form.value.id_depto),
    archivo_diploma: form.value.archivo_diploma || form.value.archivo_diploma_actual || null,
    archivo_titulo: form.value.archivo_titulo || form.value.archivo_titulo_actual || null,
    archivo_respaldo: form.value.archivo_respaldo || form.value.archivo_respaldo_actual || null,
  }
  delete payload.archivo_diploma_actual
  delete payload.archivo_titulo_actual
  delete payload.archivo_respaldo_actual
  if (isEditing.value) {
    const index = onboardingStore.academico.findIndex(i => i === originalItem.value)
    if (index !== -1) onboardingStore.academico[index] = payload
  } else {
    onboardingStore.academico.push(payload)
  }
  onboardingStore.saveToLocal()
  dialogPregrado.value = false
  dialogPostgrado.value = false
}

const deleteItem = (item: any) => {
  if (confirm('Ã‚Â¿EstÃƒÂ¡ seguro de que desea eliminar permanentemente este registro?')) {
    const index = onboardingStore.academico.findIndex(i => i === item)
    if (index !== -1) onboardingStore.academico.splice(index, 1)
    onboardingStore.saveToLocal()
  }
}
</script>

<style lang="scss" scoped>
.rounded-32 { border-radius: 32px !important; }
.rounded-24 { border-radius: 24px !important; }
.card-shadow { box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05); }
.border-light { border: 1px solid rgba(225, 232, 240, 0.8); }
.border-dashed { border: 2px dashed #eceff1; }
.item-card {
  &:hover { 
    border-color: #303f9f;
    background: #f8f9ff;
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(48, 63, 159, 0.1);
  }
}
.tracking-tight { letter-spacing: -0.5px; }
.tracking-widest { letter-spacing: 1px; }
.opacity-80 { opacity: 0.8; }
</style>
