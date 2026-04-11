<template>
  <div class="legajo-shell q-mt-md">
    <div class="row items-center justify-between q-col-gutter-md q-mb-md">
      <div class="col-12 col-md">
        <div class="row items-center no-wrap">
          <div class="legajo-shell__icon q-mr-md">
            <q-icon name="folder_shared" color="primary" size="20px" />
          </div>
          <div>
            <div class="text-subtitle1 text-weight-bold text-uppercase letter-spacing-1">Legajo digital</div>
            <div class="text-caption text-grey-7">
              Documentos oficiales, contratos generados, firmados y respaldos del funcionario.
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-auto">
        <q-btn
          unelevated
          rounded
          color="primary"
          icon="upload_file"
          label="Subir documento"
          no-caps
          class="q-px-lg"
          @click="showUploadDialog = true"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-4">
        <div class="legajo-stat">
          <div class="text-caption text-grey-6">Total de documentos</div>
          <div class="text-h5 text-weight-bold text-primary">{{ legajoSummary.total_documentos }}</div>
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="legajo-stat">
          <div class="text-caption text-grey-6">Generados y firmados</div>
          <div class="text-h5 text-weight-bold text-primary">{{ legajoSummary.generated_signed_count }}</div>
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="legajo-stat">
          <div class="text-caption text-grey-6">Cobertura obligatoria</div>
          <div class="text-h5 text-weight-bold text-primary">{{ legajoSummary.coverage_percentage }}%</div>
        </div>
      </div>
      <div class="col-12 col-sm-6">
        <div class="legajo-stat legajo-stat--status">
          <div class="text-caption text-grey-6">Estado documental</div>
          <div class="row items-center q-gutter-sm q-mt-xs">
            <q-badge :color="getSummaryStatusColor(legajoSummary.status)" text-color="white" class="text-weight-bold">
              {{ legajoSummary.status }}
            </q-badge>
            <div class="text-caption text-grey-7">
              {{ legajoSummary.required_completed }}/{{ legajoSummary.required_total }} categorías obligatorias completas
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6">
        <div class="legajo-stat legajo-stat--status">
          <div class="text-caption text-grey-6">Pendientes obligatorios</div>
          <div class="row items-center q-gutter-sm q-mt-xs">
            <div class="text-h5 text-weight-bold text-primary">{{ legajoSummary.required_missing }}</div>
            <div class="text-caption text-grey-7">
              categorías faltantes por regularizar
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="legajo-loading">
      <q-spinner-dots color="primary" size="40px" />
      <div class="text-caption text-grey-7 q-mt-sm">Cargando legajo...</div>
    </div>

    <div v-else-if="documents.length === 0" class="legajo-empty">
      <q-icon name="cloud_off" size="64px" color="grey-4" />
      <div class="text-subtitle1 text-weight-bold q-mt-md">Sin documentos registrados</div>
      <div class="text-caption text-grey-6 q-mt-xs">
        Todavía no se han subido archivos al legajo de este funcionario.
      </div>
    </div>

    <div v-else class="row q-col-gutter-lg">
      <div
        v-for="category in visibleCategories"
        :key="category"
        class="col-12 col-lg-6"
      >
        <div class="category-card">
          <div class="row items-center justify-between q-mb-md">
            <div class="row items-center no-wrap">
              <q-avatar size="38px" class="bg-primary-ghost text-primary q-mr-sm" :icon="getCategoryIcon(category)" />
              <div>
                <div class="text-subtitle2 text-weight-bold">{{ category }}</div>
                <div class="text-caption text-grey-6">
                  {{ getDocsByCategory(category).length }} documento(s)
                </div>
              </div>
            </div>

            <div class="row items-center q-gutter-sm">
              <q-chip
                v-if="getCategoryMeta(category)?.required"
                dense
                square
                color="orange-1"
                text-color="orange-9"
                class="text-weight-medium"
              >
                Obligatoria
              </q-chip>
              <q-chip
                dense
                square
                :color="getCategoryStatusColor(category)"
                text-color="white"
                class="text-weight-medium"
              >
                {{ getCategoryStatusLabel(category) }}
              </q-chip>
            </div>
          </div>

          <div v-if="getCategoryMeta(category)?.description" class="text-caption text-grey-6 q-mb-md">
            {{ getCategoryMeta(category)?.description }}
          </div>

          <div v-if="getDocsByCategory(category).length === 0" class="category-card__empty">
            No hay documentos registrados en esta categoría.
          </div>

          <div v-else class="column q-gutter-sm">
            <div
              v-for="doc in getDocsByCategory(category)"
              :key="doc.id_documento"
              class="document-row"
            >
              <div class="row items-start justify-between no-wrap q-col-gutter-sm">
                <div class="col row items-start no-wrap">
                  <q-avatar
                    size="42px"
                    class="bg-indigo-1 text-indigo-8 q-mr-sm"
                    :icon="getFileIcon(doc.tipo_mime)"
                  />

                  <div class="col">
                    <div class="text-body2 text-weight-bold break-word">{{ doc.nombre_archivo }}</div>
                    <div class="text-caption text-grey-6 q-mt-xs">
                      {{ formatDate(doc.created_at) }} · {{ formatSize(doc.tamanio) }}
                    </div>
                    <div class="row items-center q-gutter-sm q-mt-sm">
                      <q-badge
                        outline
                        color="primary"
                        :label="doc.estado || 'Registrado'"
                      />
                      <q-badge
                        v-if="doc.observaciones"
                        color="grey-2"
                        text-color="grey-8"
                        :label="doc.observaciones"
                      />
                    </div>
                  </div>
                </div>

                <div class="col-auto row q-gutter-xs">
                  <q-btn
                    flat
                    round
                    dense
                    icon="visibility"
                    color="primary"
                    @click="openDocument(doc)"
                  >
                    <q-tooltip>Ver documento</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="canDeleteDocument(doc)"
                    flat
                    round
                    dense
                    icon="delete"
                    color="negative"
                    @click="confirmDelete(doc)"
                  >
                    <q-tooltip>Eliminar documento</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="showUploadDialog" persistent>
      <q-card class="legajo-dialog">
        <q-card-section class="row items-center justify-between bg-primary text-white">
          <div class="text-h6">Subir documento al legajo</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <q-form class="q-gutter-md" @submit="handleUpload">
            <q-select
              v-model="uploadData.categoria"
              :options="uploadCategoryOptions"
              label="Categoría"
              outlined
              dense
              rounded
              :rules="[val => !!val || 'Selecciona una categoría']"
            />

            <q-file
              v-model="uploadData.file"
              label="Archivo (PDF o imagen)"
              outlined
              dense
              rounded
              accept=".pdf,.jpg,.jpeg,.png"
              max-file-size="5242880"
              @rejected="onFileRejected"
              :rules="[val => !!val || 'Selecciona un archivo']"
            >
              <template #prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <div class="row justify-end q-gutter-sm q-mt-lg">
              <q-btn flat color="grey-7" label="Cancelar" no-caps v-close-popup :disable="uploading" />
              <q-btn
                unelevated
                color="primary"
                label="Subir archivo"
                no-caps
                rounded
                class="q-px-lg"
                type="submit"
                :loading="uploading"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card class="legajo-dialog legajo-dialog--small">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-negative">Eliminar documento</div>
        </q-card-section>

        <q-card-section class="q-pt-sm">
          ¿Seguro que deseas eliminar
          <span class="text-weight-bold text-primary">{{ docToDelete?.nombre_archivo }}</span>?
          Esta acción no se puede deshacer.
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat color="grey-7" label="Cancelar" no-caps v-close-popup />
          <q-btn
            unelevated
            color="negative"
            label="Eliminar"
            no-caps
            rounded
            class="q-px-lg"
            :loading="deleting"
            @click="handleDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { api } from 'boot/axios'
import { usePersonalStore } from 'src/stores/personalStore'
import { useNotify } from 'src/shared/composables/useNotify'

const props = defineProps<{
  idEmpleado: number
}>()

const personalStore = usePersonalStore()
const notify = useNotify()

const loading = ref(false)
const uploading = ref(false)
const deleting = ref(false)
const documents = ref<any[]>([])
const legajoSummary = ref({
  total_documentos: 0,
  generated_signed_count: 0,
  categorias_activas: 0,
  required_total: 0,
  required_completed: 0,
  required_missing: 0,
  coverage_percentage: 0,
  status: 'Crítico',
})
const categoryMeta = ref<any[]>([])

const showUploadDialog = ref(false)
const showDeleteDialog = ref(false)
const docToDelete = ref<any | null>(null)

const baseCategories = [
  'Contrato',
  'Contrato generado',
  'Contrato firmado',
  'Memorándum',
  'Identidad',
  'Educación',
  'Otros',
]

const uploadData = ref({
  categoria: 'Contrato',
  file: null as File | null,
})

const uploadCategoryOptions = computed(() => baseCategories)

const visibleCategories = computed(() => {
  const categories = new Set<string>(baseCategories)

  categoryMeta.value.forEach((item) => {
    if (item?.nombre) categories.add(item.nombre)
  })

  documents.value.forEach((doc) => {
    if (doc.categoria) categories.add(doc.categoria)
  })

  return Array.from(categories)
})

async function fetchDocuments() {
  loading.value = true
  const payload = await personalStore.getLegajo(props.idEmpleado)
  documents.value = Array.isArray(payload) ? payload : (payload?.documentos || [])
  legajoSummary.value = payload?.resumen || legajoSummary.value
  categoryMeta.value = payload?.categorias || []
  loading.value = false
}

function getDocsByCategory(category: string) {
  return documents.value
    .filter((doc) => (doc.categoria || 'Otros') === category)
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
}

function getCategoryMeta(category: string) {
  return categoryMeta.value.find((item) => item.nombre === category) || null
}

function getCategoryStatusLabel(category: string) {
  return getCategoryMeta(category)?.status || (getDocsByCategory(category).length ? 'Registrado' : 'Opcional')
}

function getCategoryStatusColor(category: string) {
  const status = getCategoryStatusLabel(category)

  if (status === 'Completo' || status === 'Registrado') return 'positive'
  if (status === 'Pendiente') return 'negative'
  return 'grey-6'
}

function getSummaryStatusColor(status?: string) {
  if (status === 'Completo') return 'positive'
  if (status === 'En proceso') return 'warning'
  return 'negative'
}

async function handleUpload() {
  if (!uploadData.value.file || !uploadData.value.categoria) {
    return
  }

  uploading.value = true

  const result = await personalStore.uploadDocument(
    props.idEmpleado,
    uploadData.value.file,
    uploadData.value.categoria,
  )

  if (result) {
    showUploadDialog.value = false
    uploadData.value = {
      categoria: uploadData.value.categoria,
      file: null,
    }
    await fetchDocuments()
  }

  uploading.value = false
}

function confirmDelete(doc: any) {
  docToDelete.value = doc
  showDeleteDialog.value = true
}

function canDeleteDocument(doc: any) {
  return !String(doc?.id_documento || '').startsWith('persona_')
}

async function handleDelete() {
  if (!docToDelete.value) {
    return
  }

  deleting.value = true
  const success = await personalStore.deleteDocument(docToDelete.value.id_documento)

  if (success) {
    showDeleteDialog.value = false
    await fetchDocuments()
  }

  deleting.value = false
  docToDelete.value = null
}

function openDocument(doc: any) {
  const url = resolveDocumentUrl(doc?.ruta_archivo)
  if (!url) {
    notify.error('No se pudo abrir el documento.')
    return
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}

function resolveDocumentUrl(path?: string | null) {
  const clean = stripFilePath(path)
  if (!clean) return ''
  const base = api.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:8000'
  const encodedPath = clean
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  return `${String(base).replace(/\/+$/, '')}/api/portal/archivo/${encodedPath}`
}

function stripFilePath(raw?: string | null) {
  if (!raw) return ''
  let value = String(raw).trim().replace(/\\/g, '/')
  if (!value) return ''

  if (/^https?:\/\//i.test(value)) {
    try {
      value = new URL(value).pathname
    } catch {
      value = value.replace(/^https?:\/\/[^/]+\//i, '')
    }
  }

  value = value
    .replace(/^\/+api\/v1\/portal\/archivo\//i, '')
    .replace(/^\/+api\/portal\/archivo\//i, '')
    .replace(/^\/+storage\//i, '')
    .replace(/^storage\//i, '')
    .replace(/^\/+/, '')

  return value
}

function getCategoryIcon(category: string) {
  const icons: Record<string, string> = {
    Contrato: 'description',
    'Contrato generado': 'article',
    'Contrato firmado': 'verified',
    Memorándum: 'assignment',
    Identidad: 'badge',
    Educación: 'school',
    Otros: 'folder',
  }

  return icons[category] || 'folder'
}

function getFileIcon(mime: string | null) {
  if (mime?.includes('pdf')) return 'picture_as_pdf'
  if (mime?.includes('image')) return 'image'
  if (mime?.includes('word')) return 'description'
  return 'insert_drive_file'
}

function formatDate(date?: string | null) {
  if (!date) {
    return '-'
  }

  return new Date(date).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatSize(bytes?: number | null) {
  if (!bytes) {
    return '-'
  }

  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const index = Math.floor(Math.log(bytes) / Math.log(1024))
  if (index === -Infinity) {
    return '0 Bytes'
  }

  return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${sizes[index]}`
}

function onFileRejected() {
  notify.error('Archivo demasiado grande o formato inválido. Máximo 5 MB en PDF o imagen.')
}

onMounted(fetchDocuments)
</script>

<style lang="scss" scoped>
.legajo-shell__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef2ff;
}

.letter-spacing-1 {
  letter-spacing: 1px;
}

.legajo-stat {
  padding: 18px 20px;
  border-radius: 16px;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
}

.legajo-loading,
.legajo-empty {
  padding: 56px 20px;
  text-align: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
}

.category-card {
  height: 100%;
  padding: 22px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
}

.category-card__empty {
  padding: 24px 16px;
  text-align: center;
  border-radius: 14px;
  border: 1px dashed #cbd5e1;
  color: #64748b;
  background: #f8fafc;
  font-size: 13px;
}

.document-row {
  padding: 14px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.bg-primary-ghost {
  background: #ede9fe;
}

.break-word {
  word-break: break-word;
}

.legajo-dialog {
  width: 480px;
  max-width: 92vw;
  border-radius: 18px;
}

.legajo-dialog--small {
  width: 420px;
}
</style>
