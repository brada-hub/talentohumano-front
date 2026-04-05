<template>
  <q-card flat class="rounded-32 bg-white card-shadow overflow-hidden q-mt-xl border-light">
    <!-- CABECERA INSTITUCIONAL: EXPERIENCIA -->
    <q-card-section class="bg-unitepc-sso text-white row items-center q-pa-xl">
      <q-avatar size="56px" font-size="28px" color="white" text-color="teal-8" icon="work_history" class="q-mr-md shadow-2" />
      <div>
        <div class="text-h5 text-weight-bolder tracking-tight">3. Experiencia Laboral</div>
        <div class="text-caption opacity-80 uppercase tracking-widest text-weight-medium">Trayectoria Profesional y Docencia</div>
      </div>
    </q-card-section>

    <!-- ======== EXPERIENCIA PROFESIONAL ======== -->
    <q-card-section class="q-pa-xl">
      <div class="row items-center q-mb-md">
        <div class="text-h6 text-teal-9 text-weight-bolder">Experiencia Profesional</div>
        <q-space />
        <q-btn unelevated color="teal-8" label="Agregar Profesional" icon="add" rounded @click="openProfesional" />
      </div>

      <div v-if="profesionalList.length === 0" class="flex flex-center q-pa-lg bg-grey-1 rounded-24 border-dashed">
         <div class="text-center text-grey-5">
          <q-icon name="work" size="40px" class="q-mb-sm" />
          <div class="text-subtitle1">No hay experiencia profesional registrada</div>
        </div>
      </div>

      <div v-else class="row q-col-gutter-lg">
        <div v-for="(item, index) in profesionalList" :key="index" class="col-12 col-md-6">
          <q-card flat bordered class="rounded-24 item-card-teal transition-all">
            <q-item class="q-pa-md">
              <q-item-section avatar>
                <q-avatar color="teal-1" text-color="teal-8" icon="work" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bolder text-teal-9">{{ item.cargo }}</q-item-label>
                <q-item-label caption class="text-weight-medium">
                  {{ item.empresa }} 
                  <span class="text-grey-6">({{ deptoOptions.find(d => d.value === item.id_depto)?.label || 'N/R' }})</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row q-gutter-xs">
                  <q-btn flat round color="grey-7" icon="edit" size="sm" @click="editProfesional(item)" />
                  <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteItem(item)" />
                </div>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
      </div>
    </q-card-section>

    <q-separator inset />

    <!-- ======== EXPERIENCIA DOCENTE ======== -->
    <q-card-section class="q-pa-xl">
      <div class="row items-center q-mb-md">
        <div class="text-h6 text-blue-9 text-weight-bolder">Experiencia en Docencia</div>
        <q-space />
        <q-btn unelevated color="blue-8" label="Agregar Docencia" icon="add" rounded @click="openDocencia" />
      </div>

      <div v-if="docenteList.length === 0" class="flex flex-center q-pa-lg bg-grey-1 rounded-24 border-dashed">
         <div class="text-center text-grey-5">
          <q-icon name="cast_for_education" size="40px" class="q-mb-sm" />
          <div class="text-subtitle1">No hay experiencia docente registrada</div>
        </div>
      </div>

      <div v-else class="row q-col-gutter-lg">
        <div v-for="(item, index) in docenteList" :key="index" class="col-12 col-md-6">
          <q-card flat bordered class="rounded-24 item-card-teal transition-all">
            <q-item class="q-pa-md">
              <q-item-section avatar>
                <q-avatar color="blue-1" text-color="blue-8" icon="cast_for_education" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bolder text-blue-9">{{ item.carrera }}</q-item-label>
                <q-item-label caption class="text-weight-medium">
                  {{ item.institucion }}
                   <span class="text-grey-6">({{ deptoOptions.find(d => d.value === item.id_depto)?.label || 'N/R' }})</span>
                   (Gestion: {{ item.gestion_periodo }})
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row q-gutter-xs">
                  <q-btn flat round color="grey-7" icon="edit" size="sm" @click="editDocencia(item)" />
                  <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteItem(item)" />
                </div>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
      </div>
    </q-card-section>

    <!-- DIALOGO PROFESIONAL -->
    <q-dialog v-model="dialogProfesional" persistent backdrop-filter="blur(4px)">
      <q-card style="width: 700px; max-width: 90vw;" class="rounded-24 overflow-hidden">
        <q-card-section class="bg-unitepc-sso text-white row items-center q-py-md">
          <div class="text-h6 text-weight-bold">{{ isEditing ? 'Editar Experiencia' : 'Nueva Experiencia Profesional' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg row q-col-gutter-md">
          <div class="col-12 col-md-6"><q-input v-model="form.cargo" @update:model-value="forceUpper" input-class="text-uppercase" label="Cargo o Puesto *" outlined dense /></div>
          <div class="col-12"><q-input v-model="form.empresa" @update:model-value="forceUpper" input-class="text-uppercase" label="Empresa / Institucion *" outlined dense /></div>
          <div class="col-12 col-md-6"><q-select v-model="form.id_pais" :options="paisOptions" emit-value map-options label="Pais *" outlined dense @update:model-value="onPaisFormChange" /></div>
          <div class="col-12 col-md-6"><q-select v-model="form.id_depto" :options="deptoOptions" emit-value map-options label="Depto/Estado *" outlined dense /></div>
          <div class="col-12 col-md-6"><q-input v-model="form.fecha_inicio" label="Fecha de Inicio *" type="date" stack-label outlined dense /></div>
          <div class="col-12 col-md-6"><q-input v-model="form.fecha_fin" label="Fecha de Conclusion" type="date" stack-label outlined dense hint="Vacio si continua" /></div>
          <div class="col-12">
            <q-file v-model="form.archivo_respaldo" @update:model-value="onFileSelected" :display-value="fileDisplayValue(form.archivo_respaldo, form.archivo_respaldo_actual)" label="Certificado / Contrato (PDF/JPG) *" outlined dense accept=".pdf,image/*">
              <template v-slot:prepend><q-icon name="attach_file" /></template>
            </q-file>
          </div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated :label="isEditing ? 'Guardar Cambios' : 'Agregar Experiencia'" color="teal-8" @click="saveItem" :disable="!isFormValid" rounded no-caps class="q-px-lg" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- DIALOGO DOCENCIA -->
    <q-dialog v-model="dialogDocencia" persistent backdrop-filter="blur(4px)">
      <q-card style="width: 700px; max-width: 90vw;" class="rounded-24 overflow-hidden">
        <q-card-section class="bg-unitepc-sso text-white row items-center q-py-md">
          <div class="text-h6 text-weight-bold">{{ isEditing ? 'Editar Docencia' : 'Nueva Experiencia en Docencia' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg row q-col-gutter-md">
          <div class="col-12"><q-input v-model="form.institucion" @update:model-value="forceUpper" input-class="text-uppercase" label="Institucion / Universidad *" outlined dense /></div>
          <div class="col-12 col-md-6"><q-input v-model="form.carrera" @update:model-value="forceUpper" input-class="text-uppercase" label="Carrera o Facultad *" outlined dense /></div>
          <div class="col-12 col-md-6"><q-select v-model="form.id_pais" :options="paisOptions" emit-value map-options label="Pais *" outlined dense @update:model-value="onPaisFormChange" /></div>
          <div class="col-12 col-md-6"><q-select v-model="form.id_depto" :options="deptoOptions" emit-value map-options label="Depto/Estado *" outlined dense /></div>
          <div class="col-12"><div class="text-subtitle2 text-grey-6 q-mb-xs">Gestiones / Periodos Dictados *</div></div>
          <div class="col-12 col-md-4">
            <q-select v-model="quickGestion.semestre" :options="['I', 'II', 'Verano', 'Invierno']" label="Periodo" outlined dense />
          </div>
          <div class="col-12 col-md-5">
            <q-input v-model="quickGestion.anio" label="Anio (Ej: 2025)" outlined dense mask="####" />
          </div>
          <div class="col-12 col-md-3">
             <q-btn unelevated color="blue-8" icon="add" label="Agregar" class="full-width" @click="addGestionToList" style="height: 40px" />
          </div>
          
          <div class="col-12">
            <div class="bg-grey-1 q-pa-sm border-light rounded-12 flex q-gutter-xs">
              <div v-if="form.gestion_list?.length === 0" class="text-caption text-grey-5 q-pa-xs">Sin periodos agregados... (Agregue al menos uno)</div>
              <q-chip 
                v-for="(g, idx) in form.gestion_list" 
                :key="idx" 
                removable 
                @remove="form.gestion_list.splice(idx, 1)" 
                color="blue-1" 
                text-color="blue-9" 
                class="text-weight-bold"
              >
                {{ g }}
              </q-chip>
            </div>
          </div>

          <div class="col-12"><div class="text-subtitle2 text-grey-6 q-mb-xs q-mt-sm">Asignaturas Dictadas</div></div>
          <div class="col-12">
            <q-select 
              v-model="form.asignaturas_list" 
              use-input 
              use-chips 
              multiple 
              new-value-mode="add-unique" 
              input-class="text-uppercase"
              label="Asignaturas Dictadas (escriba y presione Enter) *" 
              outlined 
              dense 
              hint="Ej: PROGRAMACION I, ESTRUCTURA DE DATOS"
            />
          </div>
          <div class="col-12">
            <q-file v-model="form.archivo_respaldo" @update:model-value="onFileSelected" :display-value="fileDisplayValue(form.archivo_respaldo, form.archivo_respaldo_actual)" label="Certificado de Trabajo Docente (PDF/JPG) *" outlined dense accept=".pdf,image/*">
              <template v-slot:prepend><q-icon name="attach_file" /></template>
            </q-file>
          </div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated :label="isEditing ? 'Guardar Cambios' : 'Agregar Docencia'" color="blue-8" @click="saveItem" :disable="!isFormValid" rounded no-caps class="q-px-lg" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOnboardingStore } from 'src/stores/onboardingStore'
import { Notify } from 'quasar'
import { getFileSizeError, sanitizeAlphanumeric, sanitizeLetters, sanitizeNumbers } from 'src/shared/utils/formValidators'
import { optimizeUploadFile } from 'src/shared/utils/uploadOptimizer'

const onboardingStore = useOnboardingStore()

const quickGestion = ref({ semestre: 'I', anio: new Date().getFullYear() })
const addGestionToList = () => {
  quickGestion.value.anio = Number(sanitizeNumbers(String(quickGestion.value.anio || '')))
  if (!quickGestion.value.anio) {
    Notify.create({ color: 'warning', message: 'Debe ingresar un anio valido' })
    return
  }
  const str = `${quickGestion.value.semestre}-${quickGestion.value.anio}`
  if (!form.value.gestion_list) form.value.gestion_list = []
  if (form.value.gestion_list.includes(str)) return
  form.value.gestion_list.push(str)
}

// Computados para separar las listas
const profesionalList = computed(() => onboardingStore.experiencia.filter(i => i.tipo_registro === 'profesional'))
const docenteList = computed(() => onboardingStore.experiencia.filter(i => i.tipo_registro === 'docente'))

const dialogProfesional = ref(false)
const dialogDocencia = ref(false)

// CatÃƒÂ¡logos desde el store
const paisOptions = computed(() => onboardingStore.paises)
const deptoOptions = computed(() => onboardingStore.departamentos)

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

const isEditing = ref(false)
const originalItem = ref<any>(null)

const form = ref<any>({})

const isFormValid = computed(() => {
  if (form.value.tipo_registro === 'profesional') {
    return !!(form.value.cargo && form.value.empresa && form.value.id_depto && form.value.fecha_inicio && (form.value.archivo_respaldo || form.value.archivo_respaldo_actual))
  }
  if (form.value.tipo_registro === 'docente') {
    return !!(form.value.institucion && form.value.carrera && form.value.id_depto && (form.value.asignaturas_list?.length > 0) && (form.value.gestion_list?.length > 0) && (form.value.archivo_respaldo || form.value.archivo_respaldo_actual))
  }
  return false
})

const resetForm = () => {
  form.value = { 
    tipo_registro: '', cargo: '', empresa: '', institucion: '', carrera: '', 
    asignaturas: '', asignaturas_list: [],
    gestion_list: [], gestion_periodo: '', id_pais: 2, id_depto: null, fecha_inicio: '', fecha_fin: '', archivo_respaldo: null, archivo_respaldo_actual: '' 
  }
  quickGestion.value = { semestre: 'I', anio: new Date().getFullYear() }
  isEditing.value = false
  originalItem.value = null
}

const forceUpper = () => {
  if (form.value.cargo) form.value.cargo = sanitizeLetters(form.value.cargo).toUpperCase()
  if (form.value.empresa) form.value.empresa = sanitizeLetters(form.value.empresa).toUpperCase()
  if (form.value.institucion) form.value.institucion = sanitizeLetters(form.value.institucion).toUpperCase()
  if (form.value.carrera) form.value.carrera = sanitizeAlphanumeric(form.value.carrera).toUpperCase()
}

const onFileSelected = async (file: File | null) => {
  const result = await optimizeUploadFile(file)
  if (result.error) {
    form.value.archivo_respaldo = null
    Notify.create({ color: 'negative', message: result.error })
    return
  }

  form.value.archivo_respaldo = result.file

  if (result.optimized) {
    Notify.create({ color: 'info', message: 'La imagen fue optimizada antes de guardarse.' })
  }
}

const openProfesional = async () => {
  resetForm()
  form.value.tipo_registro = 'profesional'
  await onboardingStore.fetchDepartamentos(form.value.id_pais)
  dialogProfesional.value = true
}

const openDocencia = async () => {
  resetForm()
  form.value.tipo_registro = 'docente'
  await onboardingStore.fetchDepartamentos(form.value.id_pais)
  dialogDocencia.value = true
}

const editProfesional = async (item: any) => {
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
  dialogProfesional.value = true
}

const editDocencia = async (item: any) => {
  resetForm()
  form.value = {
    ...item,
    id_pais: resolveCountryId(item),
    id_depto: asNumberOrNull(item.id_depto),
    archivo_respaldo_actual: extractFileRef(item.archivo_respaldo),
  }
  // Re-mapear asignaturas a lista de chips
  form.value.asignaturas_list = item.asignaturas ? item.asignaturas.split(', ') : []
  // Re-mapear gestion_periodo a lista de chips
  form.value.gestion_list = item.gestion_periodo ? item.gestion_periodo.split(', ') : []

  if (!(form.value.archivo_respaldo instanceof File)) form.value.archivo_respaldo = null
  await onboardingStore.fetchDepartamentos(form.value.id_pais)
  isEditing.value = true
  originalItem.value = item
  dialogDocencia.value = true
}

const saveItem = () => {
  forceUpper()
  const fileError = getFileSizeError(form.value.archivo_respaldo)
  if (fileError) {
    Notify.create({ color: 'negative', message: fileError })
    return
  }
  
  if (form.value.tipo_registro === 'docente') {
    // Unificar asignaturas y gestiones antes de guardar
    form.value.asignaturas = (form.value.asignaturas_list || []).map((s: string) => s.toUpperCase()).join(', ')
    form.value.gestion_periodo = (form.value.gestion_list || []).join(', ')
  }

  const payload = {
    ...form.value,
    id_pais: asNumberOrNull(form.value.id_pais),
    id_depto: asNumberOrNull(form.value.id_depto),
    archivo_respaldo: form.value.archivo_respaldo || form.value.archivo_respaldo_actual || null,
  }
  delete payload.archivo_respaldo_actual

  if (payload.tipo_registro === 'docente') {
    payload.asignaturas = (payload.asignaturas_list || []).map((s: string) => s.toUpperCase()).join(', ')
    payload.gestion_periodo = (payload.gestion_list || []).join(', ')
  }

  if (isEditing.value) {
    const index = onboardingStore.experiencia.findIndex(i => i === originalItem.value)
    if (index !== -1) onboardingStore.experiencia[index] = payload
  } else {
    onboardingStore.experiencia.push(payload)
  }
  onboardingStore.saveToLocal()
  dialogProfesional.value = false
  dialogDocencia.value = false
}

const deleteItem = (item: any) => {
  if (confirm('Ã‚Â¿EstÃƒÂ¡ seguro de que desea eliminar permanentemente este registro?')) {
    const index = onboardingStore.experiencia.findIndex(i => i === item)
    if (index !== -1) onboardingStore.experiencia.splice(index, 1)
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
.item-card-teal {
  &:hover { 
    border-color: #00796b;
    background: #f0fafa;
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 121, 107, 0.1);
  }
}
.tracking-tight { letter-spacing: -0.5px; }
.tracking-widest { letter-spacing: 1px; }
.opacity-80 { opacity: 0.8; }
</style>
