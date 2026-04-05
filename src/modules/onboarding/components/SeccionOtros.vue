<template>
  <q-card flat class="rounded-32 bg-white card-shadow overflow-hidden q-mt-xl border-light">
    <!-- CABECERA INSTITUCIONAL: OTROS -->
    <q-card-section class="bg-unitepc-sso text-white row items-center q-pa-xl">
      <q-avatar size="56px" font-size="28px" color="white" text-color="green-8" icon="menu_book" class="q-mr-md shadow-2" />
      <div>
        <div class="text-h5 text-weight-bolder tracking-tight">4. Otros Meritos e Idiomas</div>
        <div class="text-caption opacity-80 uppercase tracking-widest text-weight-medium">Capacitaciones, Produccion Intelectual, Reconocimientos e Idiomas</div>
      </div>
    </q-card-section>

    <!-- ======== CAPACITACIONES ======== -->
    <q-card-section class="q-pa-xl">
      <div class="row items-center q-mb-md">
        <div class="text-h6 text-green-9 text-weight-bolder">Cursos y Capacitaciones</div>
        <q-space />
        <q-btn unelevated color="green-8" label="Agregar Capacitacion" icon="add" rounded @click="openCapacitacion" />
      </div>

      <div v-if="capacitacionList.length === 0" class="flex flex-center q-pa-md bg-grey-1 rounded-24 border-dashed">
         <div class="text-center text-grey-5">
          <q-icon name="model_training" size="32px" class="q-mb-sm" />
          <div class="text-subtitle1">Sin capacitaciones</div>
        </div>
      </div>

      <div v-else class="row q-col-gutter-lg">
        <div v-for="(item, index) in capacitacionList" :key="index" class="col-12 col-md-6">
          <q-card flat bordered class="rounded-24 item-card-green transition-all">
            <q-item class="q-pa-md">
              <q-item-section avatar><q-avatar color="green-1" text-color="green-8" icon="model_training" /></q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bolder text-green-9">{{ item.nombre_curso }}</q-item-label>
                <q-item-label caption class="text-weight-medium">
                  {{ item.institucion }} ({{ item.carga_horaria }} Hrs)
                  <span class="text-grey-6">({{ deptoOptions.find(d => d.value === item.id_depto)?.label || 'N/R' }})</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row q-gutter-xs">
                  <q-btn flat round color="grey-7" icon="edit" size="sm" @click="editCapacitacion(item)" />
                  <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteItem(item)" />
                </div>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
      </div>
    </q-card-section>

    <q-separator inset />

    <!-- ======== PRODUCCION INTELECTUAL ======== -->
    <q-card-section class="q-pa-xl">
      <div class="row items-center q-mb-md">
        <div class="text-h6 text-purple-9 text-weight-bolder">Produccion Intelectual</div>
        <q-space />
        <q-btn unelevated color="purple-8" label="Agregar Produccion" icon="add" rounded @click="openProduccion" />
      </div>

      <div v-if="produccionList.length === 0" class="flex flex-center q-pa-md bg-grey-1 rounded-24 border-dashed">
         <div class="text-center text-grey-5">
          <q-icon name="menu_book" size="32px" class="q-mb-sm" />
          <div class="text-subtitle1">Sin libros o articulos</div>
        </div>
      </div>

      <div v-else class="row q-col-gutter-lg">
        <div v-for="(item, index) in produccionList" :key="index" class="col-12 col-md-6">
          <q-card flat bordered class="rounded-24 item-card-green transition-all">
            <q-item class="q-pa-md">
              <q-item-section avatar><q-avatar color="purple-1" text-color="purple-8" icon="menu_book" /></q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bolder text-purple-9">{{ item.titulo }}</q-item-label>
                <q-item-label caption class="text-weight-medium">
                  {{ item.tipo }} ({{ item.editorial }})
                  <span class="text-grey-6">({{ deptoOptions.find(d => d.value === item.id_depto)?.label || 'N/R' }})</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row q-gutter-xs">
                  <q-btn flat round color="grey-7" icon="edit" size="sm" @click="editProduccion(item)" />
                  <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteItem(item)" />
                </div>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
      </div>
    </q-card-section>

    <q-separator inset />

    <!-- ======== RECONOCIMIENTOS ======== -->
    <q-card-section class="q-pa-xl">
      <div class="row items-center q-mb-md">
        <div class="text-h6 text-amber-9 text-weight-bolder">Reconocimientos y Premios</div>
        <q-space />
        <q-btn unelevated color="amber-8" text-color="dark" label="Agregar Reconocimiento" icon="add" rounded @click="openReconocimiento" />
      </div>

      <div v-if="reconocimientoList.length === 0" class="flex flex-center q-pa-md bg-grey-1 rounded-24 border-dashed">
         <div class="text-center text-grey-5">
          <q-icon name="emoji_events" size="32px" class="q-mb-sm" />
          <div class="text-subtitle1">Sin premios registrados</div>
        </div>
      </div>

      <div v-else class="row q-col-gutter-lg">
        <div v-for="(item, index) in reconocimientoList" :key="index" class="col-12 col-md-6">
          <q-card flat bordered class="rounded-24 item-card-green transition-all">
            <q-item class="q-pa-md">
              <q-item-section avatar><q-avatar color="amber-1" text-color="amber-9" icon="emoji_events" /></q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bolder text-amber-9">{{ item.titulo_premio }}</q-item-label>
                <q-item-label caption class="text-weight-medium">{{ item.institucion_otorgante }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row q-gutter-xs">
                  <q-btn flat round color="grey-7" icon="edit" size="sm" @click="editReconocimiento(item)" />
                  <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteItem(item)" />
                </div>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
      </div>
    </q-card-section>

    <q-separator inset />

    <!-- ======== IDIOMAS ======== -->
    <q-card-section class="q-pa-xl">
      <div class="row items-center q-mb-md">
        <div class="text-h6 text-deep-orange-9 text-weight-bolder">Idiomas y Lenguas</div>
        <q-space />
        <q-btn unelevated color="deep-orange-8" label="Agregar Idioma" icon="add" rounded @click="openIdioma" />
      </div>

      <div v-if="idiomaList.length === 0" class="flex flex-center q-pa-md bg-grey-1 rounded-24 border-dashed">
         <div class="text-center text-grey-5">
          <q-icon name="translate" size="32px" class="q-mb-sm" />
          <div class="text-subtitle1">Sin idiomas declarados</div>
        </div>
      </div>

      <div v-else class="row q-col-gutter-lg">
        <div v-for="(item, index) in idiomaList" :key="index" class="col-12 col-md-6">
          <q-card flat bordered class="rounded-24 item-card-green transition-all">
            <q-item class="q-pa-md">
              <q-item-section avatar><q-avatar color="deep-orange-1" text-color="deep-orange-8" icon="translate" /></q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bolder text-deep-orange-9">{{ item.idioma }}</q-item-label>
                <q-item-label caption class="text-weight-medium">Habla: {{ item.nivel_habla }} / Lee: {{ item.nivel_lee }} / Escribe: {{ item.nivel_escritura }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row q-gutter-xs">
                  <q-btn flat round color="grey-7" icon="edit" size="sm" @click="editIdioma(item)" />
                  <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteItem(item)" />
                </div>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
      </div>
    </q-card-section>


    <!-- DIALOGOS DE INGRESO (MODALS) -->

    <!-- CAPACITACIÃƒâ€œN -->
    <q-dialog v-model="dialogCapacitacion" persistent backdrop-filter="blur(4px)">
      <q-card style="width: 700px; max-width: 90vw;" class="rounded-24 overflow-hidden">
        <q-card-section class="bg-unitepc-sso text-white row items-center q-py-md">
          <div class="text-h6 text-weight-bold">{{ isEditing ? 'Editar Curso' : 'Nueva Capacitacion' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pa-lg row q-col-gutter-md">
          <div class="col-12"><q-input v-model="form.nombre_curso" @update:model-value="forceUpper" input-class="text-uppercase" label="Nombre del Curso/Capacitacion *" outlined dense /></div>
          <div class="col-12"><q-input v-model="form.institucion" @update:model-value="forceUpper" input-class="text-uppercase" label="Institucion Otorgante *" outlined dense /></div>
          <div class="col-12 col-md-4"><q-input v-model="form.fecha" label="Fecha *" type="date" stack-label outlined dense /></div>
          <div class="col-12 col-md-4"><q-input v-model="form.carga_horaria" label="Carga Horaria (Hrs) *" outlined dense /></div>
          <div class="col-12 col-md-4"><q-select v-model="form.id_pais" :options="paisOptions" emit-value map-options label="Pais *" outlined dense @update:model-value="onPaisFormChange" /></div>
          <div class="col-12 col-md-8"><q-select v-model="form.id_depto" :options="deptoOptions" emit-value map-options label="Depto/Estado *" outlined dense /></div>
          <div class="col-12">
            <q-file v-model="form.archivo_respaldo" @update:model-value="onFileSelected" :display-value="fileDisplayValue(form.archivo_respaldo, form.archivo_respaldo_actual)" label="Certificado (PDF/JPG) *" outlined dense accept=".pdf,image/*">
              <template v-slot:prepend><q-icon name="attach_file" /></template>
            </q-file>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated label="Guardar Capacitacion" color="green-8" @click="saveItem" :disable="!isFormValid" rounded no-caps class="q-px-lg" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- PRODUCCION INTELECTUAL -->
    <q-dialog v-model="dialogProduccion" persistent backdrop-filter="blur(4px)">
      <q-card style="width: 700px; max-width: 90vw;" class="rounded-24 overflow-hidden">
        <q-card-section class="bg-unitepc-sso text-white row items-center q-py-md">
          <div class="text-h6 text-weight-bold">{{ isEditing ? 'Editar Produccion' : 'Nueva Produccion Intelectual' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pa-lg row q-col-gutter-md">
          <div class="col-12 col-md-3"><q-select v-model="form.tipo" :options="['Libro', 'Articulo', 'InvestigaciÃƒÂ³n', 'Revista']" label="Tipo *" outlined dense /></div>
          <div class="col-12 col-md-4"><q-select v-model="form.id_pais" :options="paisOptions" emit-value map-options label="Pais *" outlined dense @update:model-value="onPaisFormChange" /></div>
          <div class="col-12 col-md-4"><q-select v-model="form.id_depto" :options="deptoOptions" emit-value map-options label="Depto/Estado *" outlined dense /></div>
          <div class="col-12"><q-input v-model="form.titulo" @update:model-value="forceUpper" input-class="text-uppercase" label="Titulo del Libro o Articulo *" outlined dense /></div>
          <div class="col-12 col-md-8"><q-input v-model="form.editorial" @update:model-value="forceUpper" input-class="text-uppercase" label="Editorial o Medio *" outlined dense /></div>
          <div class="col-12 col-md-4"><q-input v-model="form.fecha" label="Fecha *" type="date" stack-label outlined dense /></div>
          <div class="col-12">
            <q-file v-model="form.archivo_respaldo" @update:model-value="onFileSelected" :display-value="fileDisplayValue(form.archivo_respaldo, form.archivo_respaldo_actual)" label="Caratula o Comprobante (PDF/JPG) *" outlined dense accept=".pdf,image/*">
              <template v-slot:prepend><q-icon name="attach_file" /></template>
            </q-file>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated label="Guardar ProducciÃƒÂ³n" color="purple-8" @click="saveItem" :disable="!isFormValid" rounded no-caps class="q-px-lg" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- RECONOCIMIENTOS -->
    <q-dialog v-model="dialogReconocimiento" persistent backdrop-filter="blur(4px)">
      <q-card style="width: 700px; max-width: 90vw;" class="rounded-24 overflow-hidden">
        <q-card-section class="bg-unitepc-sso text-white row items-center q-py-md">
          <div class="text-h6 text-weight-bold">{{ isEditing ? 'Editar Premio' : 'Nuevo Reconocimiento' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pa-lg row q-col-gutter-md">
          <div class="col-12"><q-input v-model="form.titulo_premio" @update:model-value="forceUpper" input-class="text-uppercase" label="TÃƒÂ­tulo del Premio o Reconocimiento *" outlined dense /></div>
          <div class="col-12"><q-input v-model="form.institucion_otorgante" @update:model-value="forceUpper" input-class="text-uppercase" label="Institucion Otorgante *" outlined dense /></div>
          <div class="col-12 col-md-6"><q-input v-model="form.lugar" @update:model-value="forceUpper" input-class="text-uppercase" label="Lugar del Premio *" outlined dense /></div>
          <div class="col-12 col-md-6"><q-input v-model="form.fecha" label="Fecha *" type="date" stack-label outlined dense /></div>
          <div class="col-12">
            <q-file v-model="form.archivo_respaldo" @update:model-value="onFileSelected" :display-value="fileDisplayValue(form.archivo_respaldo, form.archivo_respaldo_actual)" label="Certificado o Evidencia (PDF/JPG) *" outlined dense accept=".pdf,image/*">
              <template v-slot:prepend><q-icon name="attach_file" /></template>
            </q-file>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated label="Guardar Reconocimiento" color="amber-8" text-color="dark" @click="saveItem" :disable="!isFormValid" rounded no-caps class="q-px-lg" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- IDIOMAS -->
    <q-dialog v-model="dialogIdioma" persistent backdrop-filter="blur(4px)">
      <q-card style="width: 700px; max-width: 90vw;" class="rounded-24 overflow-hidden">
        <q-card-section class="bg-unitepc-sso text-white row items-center q-py-md">
          <div class="text-h6 text-weight-bold">{{ isEditing ? 'Editar Idioma' : 'AÃƒÂ±adir Nuevo Idioma' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pa-lg row q-col-gutter-md">
          <div class="col-12"><q-select v-model="form.idioma" :options="['ESPAÃƒâ€˜OL', 'INGLÃƒâ€°S', 'PORTUGUÃƒâ€°S', 'FRANCÃƒâ€°S', 'ITALIANO', 'ALEMÃƒÂN', 'MANDARÃƒÂN', 'QUECHUA', 'AYMARA', 'GUARANÃƒÂ', 'OTRO']" label="Nombre del Idioma *" outlined dense /></div>
          <div class="col-12 col-md-4"><q-select v-model="form.nivel_habla" :options="['BÃƒÂ¡sico', 'Intermedio', 'Avanzado', 'Nativo']" label="Nivel Oral *" outlined dense /></div>
          <div class="col-12 col-md-4"><q-select v-model="form.nivel_lee" :options="['BÃƒÂ¡sico', 'Intermedio', 'Avanzado', 'Nativo']" label="Nivel de Lectura *" outlined dense /></div>
          <div class="col-12 col-md-4"><q-select v-model="form.nivel_escritura" :options="['BÃƒÂ¡sico', 'Intermedio', 'Avanzado', 'Nativo']" label="Nivel de Escritura *" outlined dense /></div>
          <div class="col-12">
            <q-file v-model="form.archivo_respaldo" @update:model-value="onFileSelected" :display-value="fileDisplayValue(form.archivo_respaldo, form.archivo_respaldo_actual)" label="Certificado (Opcional) (PDF/JPG)" outlined dense accept=".pdf,image/*">
              <template v-slot:prepend><q-icon name="attach_file" /></template>
            </q-file>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated label="Guardar Idioma" color="deep-orange-8" @click="saveItem" :disable="!isFormValid" rounded no-caps class="q-px-lg" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Notify } from 'quasar'
import { useOnboardingStore } from 'src/stores/onboardingStore'
import { getFileSizeError, sanitizeAlphanumeric, sanitizeLetters, sanitizeNumbers } from 'src/shared/utils/formValidators'
import { optimizeUploadFile } from 'src/shared/utils/uploadOptimizer'

const onboardingStore = useOnboardingStore()

// Arrays separados
const capacitacionList = computed(() => onboardingStore.otros.filter(i => i.tipo_registro === 'capacitacion'))
const produccionList = computed(() => onboardingStore.otros.filter(i => i.tipo_registro === 'produccion'))
const reconocimientoList = computed(() => onboardingStore.otros.filter(i => i.tipo_registro === 'reconocimiento'))
const idiomaList = computed(() => onboardingStore.otros.filter(i => i.tipo_registro === 'idioma'))

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

const dialogCapacitacion = ref(false)
const dialogProduccion = ref(false)
const dialogReconocimiento = ref(false)
const dialogIdioma = ref(false)

const isEditing = ref(false)
const originalItem = ref<any>(null)

const form = ref<any>({})

const isFormValid = computed(() => {
  if (form.value.tipo_registro === 'capacitacion') {
    return !!(form.value.nombre_curso && form.value.institucion && form.value.fecha && form.value.carga_horaria && form.value.id_depto && (form.value.archivo_respaldo || form.value.archivo_respaldo_actual))
  }
  if (form.value.tipo_registro === 'produccion') {
    return !!(form.value.tipo && form.value.id_depto && form.value.titulo && form.value.editorial && form.value.fecha && (form.value.archivo_respaldo || form.value.archivo_respaldo_actual))
  }
  if (form.value.tipo_registro === 'reconocimiento') {
    return !!(form.value.titulo_premio && form.value.institucion_otorgante && form.value.lugar && form.value.fecha && (form.value.archivo_respaldo || form.value.archivo_respaldo_actual))
  }
  if (form.value.tipo_registro === 'idioma') {
    return !!(form.value.idioma && form.value.nivel_habla && form.value.nivel_lee && form.value.nivel_escritura)
  }
  return false
})

const resetForm = () => {
  form.value = { 
    tipo_registro: '', 
    nombre_curso: '', institucion: '', fecha: '', carga_horaria: '', id_pais: 2, id_depto: null, archivo_respaldo: null, archivo_respaldo_actual: '',
    idioma: '', nivel_habla: '', nivel_escritura: '', nivel_lee: '', 
    tipo: '', titulo: '', editorial: '',
    titulo_premio: '', institucion_otorgante: '', lugar: ''
  }
  isEditing.value = false
  originalItem.value = null
}

const forceUpper = () => {
  if (form.value.nombre_curso) form.value.nombre_curso = sanitizeAlphanumeric(form.value.nombre_curso).toUpperCase()
  if (form.value.institucion) form.value.institucion = sanitizeLetters(form.value.institucion).toUpperCase()
  if (form.value.idioma) form.value.idioma = sanitizeLetters(form.value.idioma).toUpperCase()
  if (form.value.titulo) form.value.titulo = sanitizeAlphanumeric(form.value.titulo).toUpperCase()
  if (form.value.editorial) form.value.editorial = sanitizeAlphanumeric(form.value.editorial).toUpperCase()
  if (form.value.titulo_premio) form.value.titulo_premio = sanitizeAlphanumeric(form.value.titulo_premio).toUpperCase()
  if (form.value.institucion_otorgante) form.value.institucion_otorgante = sanitizeLetters(form.value.institucion_otorgante).toUpperCase()
  if (form.value.lugar) form.value.lugar = sanitizeAlphanumeric(form.value.lugar).toUpperCase()
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

// OPENERS
const openCapacitacion = async () => { resetForm(); form.value.tipo_registro = 'capacitacion'; await onboardingStore.fetchDepartamentos(form.value.id_pais); dialogCapacitacion.value = true }
const openProduccion = async () => { resetForm(); form.value.tipo_registro = 'produccion'; await onboardingStore.fetchDepartamentos(form.value.id_pais); dialogProduccion.value = true }
const openReconocimiento = async () => { resetForm(); form.value.tipo_registro = 'reconocimiento'; dialogReconocimiento.value = true }
const openIdioma = () => { resetForm(); form.value.tipo_registro = 'idioma'; dialogIdioma.value = true }

// EDITERS
const editCapacitacion = async (item: any) => { resetForm(); form.value = { ...item, id_pais: resolveCountryId(item), id_depto: asNumberOrNull(item.id_depto), archivo_respaldo_actual: extractFileRef(item.archivo_respaldo) }; if (!(form.value.archivo_respaldo instanceof File)) form.value.archivo_respaldo = null; await onboardingStore.fetchDepartamentos(form.value.id_pais); isEditing.value = true; originalItem.value = item; dialogCapacitacion.value = true }
const editProduccion = async (item: any) => { resetForm(); form.value = { ...item, id_pais: resolveCountryId(item), id_depto: asNumberOrNull(item.id_depto), archivo_respaldo_actual: extractFileRef(item.archivo_respaldo) }; if (!(form.value.archivo_respaldo instanceof File)) form.value.archivo_respaldo = null; await onboardingStore.fetchDepartamentos(form.value.id_pais); isEditing.value = true; originalItem.value = item; dialogProduccion.value = true }
const editReconocimiento = async (item: any) => { resetForm(); form.value = { ...item, archivo_respaldo_actual: extractFileRef(item.archivo_respaldo) }; if (!(form.value.archivo_respaldo instanceof File)) form.value.archivo_respaldo = null; isEditing.value = true; originalItem.value = item; dialogReconocimiento.value = true }
const editIdioma = (item: any) => { resetForm(); form.value = { ...item, archivo_respaldo_actual: extractFileRef(item.archivo_respaldo) }; if (!(form.value.archivo_respaldo instanceof File)) form.value.archivo_respaldo = null; isEditing.value = true; originalItem.value = item; dialogIdioma.value = true }

const saveItem = () => {
  forceUpper()
  if (form.value.carga_horaria !== undefined && form.value.carga_horaria !== null) form.value.carga_horaria = sanitizeNumbers(String(form.value.carga_horaria))
  const fileError = getFileSizeError(form.value.archivo_respaldo)
  if (fileError) {
    Notify.create({ color: 'negative', message: fileError })
    return
  }
  const payload = {
    ...form.value,
    id_pais: asNumberOrNull(form.value.id_pais),
    id_depto: asNumberOrNull(form.value.id_depto),
    archivo_respaldo: form.value.archivo_respaldo || form.value.archivo_respaldo_actual || null,
  }
  delete payload.archivo_respaldo_actual
  if (isEditing.value) {
    const index = onboardingStore.otros.findIndex(i => i === originalItem.value)
    if (index !== -1) onboardingStore.otros[index] = payload
  } else {
    onboardingStore.otros.push(payload)
  }
  onboardingStore.saveToLocal()
  dialogCapacitacion.value = false
  dialogProduccion.value = false
  dialogReconocimiento.value = false
  dialogIdioma.value = false
}

const deleteItem = (item: any) => {
  if (confirm('Ã‚Â¿EstÃƒÂ¡ seguro de que desea eliminar permanentemente este registro?')) {
    const index = onboardingStore.otros.findIndex(i => i === item)
    if (index !== -1) onboardingStore.otros.splice(index, 1)
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
.item-card-green {
  &:hover {
    border-color: #388e3c;
    background: #f1f8f1;
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(56, 142, 60, 0.1);
  }
}
.tracking-tight { letter-spacing: -0.5px; }
.tracking-widest { letter-spacing: 1px; }
.opacity-80 { opacity: 0.8; }
</style>
