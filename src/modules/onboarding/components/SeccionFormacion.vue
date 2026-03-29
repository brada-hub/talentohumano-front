<template>
  <q-card flat class="rounded-32 bg-white card-shadow overflow-hidden q-mt-xl border-light">
    <!-- CABECERA INSTITUCIONAL: FORMACIÓN -->
    <q-card-section class="bg-unitepc-sso text-white row items-center q-pa-xl">
      <q-avatar size="56px" font-size="28px" color="white" text-color="indigo-8" icon="workspace_premium" class="q-mr-md shadow-2" />
      <div>
        <div class="text-h5 text-weight-bolder tracking-tight">2. Formación Académica</div>
        <div class="text-caption opacity-80 uppercase tracking-widest text-weight-medium">Grados Universitarios y Especializaciones</div>
      </div>
    </q-card-section>

    <!-- SECCIÓN PREGRADO -->
    <q-card-section class="q-pa-xl">
      <div class="row items-center q-mb-md">
        <div class="text-h6 text-indigo-9 text-weight-bolder">Formación de Pregrado</div>
        <q-space />
        <q-btn unelevated color="indigo-8" label="Añadir Pregrado" icon="add" rounded @click="openPregrado" />
      </div>

      <div v-if="pregradoList.length === 0" class="flex flex-center q-pa-lg bg-grey-1 rounded-24 border-dashed">
        <div class="text-center text-grey-5">
          <q-icon name="history_edu" size="40px" class="q-mb-sm" />
          <div class="text-subtitle1">No hay títulos de pregrado</div>
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
                <q-item-label caption class="text-weight-medium">{{ item.nivel }} - {{ item.institucion }}</q-item-label>
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

    <!-- SECCIÓN POSTGRADO -->
    <q-card-section class="q-pa-xl">
      <div class="row items-center q-mb-md">
        <div class="text-h6 text-teal-9 text-weight-bolder">Formación de Postgrado</div>
        <q-space />
        <q-btn unelevated color="teal-8" label="Añadir Postgrado" icon="add" rounded @click="openPostgrado" />
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
                <q-item-label caption class="text-weight-medium">{{ item.tipo }} - {{ item.institucion }}</q-item-label>
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

    <!-- DIÁLOGO PREGRADO -->
    <q-dialog v-model="dialogPregrado" persistent backdrop-filter="blur(4px)">
      <q-card style="width: 700px; max-width: 90vw;" class="rounded-24 overflow-hidden">
        <q-card-section class="bg-unitepc-sso text-white row items-center q-py-md">
          <div class="text-h6 text-weight-bold">{{ isEditing ? 'Editar Pregrado' : 'Registrar Pregrado' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-select v-model="form.nivel" label="Nivel Académico *" :options="['Técnico Medio', 'Técnico Superior', 'Licenciatura']" outlined dense />
          </div>
          <div class="col-12 col-md-6">
            <q-select v-model="form.id_pais" :options="paisOptions" emit-value map-options label="País de Titulación *" outlined dense @update:model-value="onPaisFormChange" />
          </div>
          <div class="col-12 col-md-6">
            <q-select v-model="form.id_depto" :options="deptoOptions" emit-value map-options label="Departamento / Estado *" outlined dense />
          </div>
          <div class="col-12">
            <q-input v-model="form.titulo" @update:model-value="forceUpper" input-class="text-uppercase" label="Nombre del Título en Provisión Nacional *" outlined dense />
          </div>
          <div class="col-12">
            <q-input v-model="form.institucion" @update:model-value="forceUpper" input-class="text-uppercase" label="Institución / Universidad *" outlined dense />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="form.fecha_emision_diploma" label="Fecha de Emisión del Diploma *" type="date" stack-label outlined dense />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="form.fecha_emision" label="Fecha de Emisión del Título *" type="date" stack-label outlined dense />
          </div>
          <!-- DOS ARCHIVOS PARA PREGRADO -->
          <div class="col-12">
            <q-file v-model="form.archivo_diploma" label="Subir DIPLOMA Académico (PDF/JPG) *" outlined dense accept=".pdf,image/*">
              <template v-slot:prepend><q-icon name="workspace_premium" /></template>
            </q-file>
          </div>
          <div class="col-12">
            <q-file v-model="form.archivo_titulo" label="Subir TÍTULO en Provisión Nacional (PDF/JPG) *" outlined dense accept=".pdf,image/*">
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

    <!-- DIÁLOGO POSTGRADO -->
    <q-dialog v-model="dialogPostgrado" persistent backdrop-filter="blur(4px)">
      <q-card style="width: 700px; max-width: 90vw;" class="rounded-24 overflow-hidden">
        <q-card-section class="bg-unitepc-sso text-white row items-center q-py-md">
          <div class="text-h6 text-weight-bold">{{ isEditing ? 'Editar Postgrado' : 'Registrar Postgrado' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <q-select v-model="form.tipo" label="Tipo de Postgrado *" :options="['Diplomado', 'Especialización', 'Maestría', 'Doctorado']" outlined dense />
          </div>
          <div class="col-12 col-md-6">
            <q-select v-model="form.id_pais" :options="paisOptions" emit-value map-options label="País *" outlined dense @update:model-value="onPaisFormChange" />
          </div>
          <div class="col-12 col-md-6">
            <q-select v-model="form.id_depto" :options="deptoOptions" emit-value map-options label="Depto/Estado *" outlined dense />
          </div>
          <div class="col-12">
            <q-input v-model="form.titulo" @update:model-value="forceUpper" input-class="text-uppercase" label="Nombre del Postgrado / Tesis *" outlined dense />
          </div>
          <div class="col-12">
            <q-input v-model="form.institucion" @update:model-value="forceUpper" input-class="text-uppercase" label="Institución / Universidad *" outlined dense />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="form.fecha_emision" label="Fecha de Emisión *" type="date" stack-label outlined dense />
          </div>
          <!-- UN ARCHIVO PARA POSTGRADO -->
          <div class="col-12">
            <q-file v-model="form.archivo_respaldo" label="Subir Título Escaneado (PDF/JPG) *" outlined dense accept=".pdf,image/*">
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
import { useOnboardingStore } from 'src/stores/onboardingStore'

const onboardingStore = useOnboardingStore()

// Arrays separados visualmente
const pregradoList = computed(() => onboardingStore.academico.filter(i => i.tipo_registro === 'pregrado'))
const postgradoList = computed(() => onboardingStore.academico.filter(i => i.tipo_registro === 'postgrado'))

// Catálogos desde el store
const paisOptions = computed(() => onboardingStore.paises)
const deptoOptions = computed(() => onboardingStore.departamentos) // Se filtran internamente al llamar fetch

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
    return !!(form.value.nivel && form.value.id_depto && form.value.titulo && form.value.institucion && form.value.fecha_emision_diploma && form.value.fecha_emision && form.value.archivo_diploma && form.value.archivo_titulo)
  }
  if (form.value.tipo_registro === 'postgrado') {
    return !!(form.value.tipo && form.value.id_depto && form.value.titulo && form.value.institucion && form.value.fecha_emision && form.value.archivo_respaldo)
  }
  return false
})

const resetForm = () => {
  form.value = { tipo_registro: '', nivel: '', tipo: '', titulo: '', institucion: '', id_depto: null, fecha_emision: '', archivo_diploma: null, archivo_titulo: null, archivo_respaldo: null }
  isEditing.value = false
  originalItem.value = null
}

const forceUpper = () => {
  if (form.value.titulo) form.value.titulo = form.value.titulo.toUpperCase()
  if (form.value.institucion) form.value.institucion = form.value.institucion.toUpperCase()
}

const openPregrado = () => {
  resetForm()
  form.value.tipo_registro = 'pregrado'
  dialogPregrado.value = true
}

const openPostgrado = () => {
  resetForm()
  form.value.tipo_registro = 'postgrado'
  dialogPostgrado.value = true
}

const editPregrado = (item: any) => {
  resetForm()
  form.value = { ...item }
  // Limpiar archivos si no son instancias de File (ej: objetos vacíos de LocalStorage)
  if (!(form.value.archivo_diploma instanceof File)) form.value.archivo_diploma = null
  if (!(form.value.archivo_titulo instanceof File)) form.value.archivo_titulo = null
  isEditing.value = true
  originalItem.value = item
  dialogPregrado.value = true
}

const editPostgrado = (item: any) => {
  resetForm()
  form.value = { ...item }
  if (!(form.value.archivo_respaldo instanceof File)) form.value.archivo_respaldo = null
  isEditing.value = true
  originalItem.value = item
  dialogPostgrado.value = true
}

const saveItem = () => {
  forceUpper() // Asegurar mayúsculas
  if (isEditing.value) {
    const index = onboardingStore.academico.findIndex(i => i === originalItem.value)
    if (index !== -1) onboardingStore.academico[index] = { ...form.value }
  } else {
    onboardingStore.academico.push({ ...form.value })
  }
  onboardingStore.saveToLocal()
  dialogPregrado.value = false
  dialogPostgrado.value = false
}

const deleteItem = (item: any) => {
  if (confirm('¿Está seguro de que desea eliminar permanentemente este registro?')) {
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
