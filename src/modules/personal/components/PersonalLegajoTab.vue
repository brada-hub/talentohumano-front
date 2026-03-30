<template>
  <div class="sigeth-form q-mt-md">
    <!-- Header with Action -->
    <div class="row items-center justify-between q-mb-md">
      <div class="row items-center gap-md">
        <div class="form-section__icon">
          <q-icon name="folder_shared" color="primary" size="20px" />
        </div>
        <div>
          <div class="form-section__title text-uppercase font-bold letter-spacing-1">Legajo Digital</div>
          <div class="form-section__subtitle">Documentos oficiales y respaldo laboral</div>
        </div>
      </div>
      <q-btn
        unelevated
        rounded
        color="primary"
        icon="upload_file"
        label="Subir documento"
        @click="showUploadDialog = true"
        class="q-px-lg"
      />
    </div>

    <q-separator color="grey-2" class="q-mb-lg" />

    <!-- Content: Categorized Documents -->
    <div v-if="loading" class="q-pa-xl text-center">
      <q-spinner-dots color="primary" size="40px" />
      <div class="text-caption text-grey-6 q-mt-sm">Cargando legajo...</div>
    </div>

    <div v-else-if="documents.length === 0" class="empty-state">
      <q-icon name="cloud_off" size="64px" color="grey-3" />
      <div class="empty-state__title">Sin documentos</div>
      <div class="empty-state__subtitle">Aún no se han subido archivos al legajo de este personal</div>
    </div>

    <div v-else class="row q-col-gutter-lg">
      <div v-for="category in categories" :key="category" class="col-12 col-md-6">
        <div class="category-section">
          <div class="text-subtitle2 text-weight-bolder text-grey-9 q-mb-md flex items-center gap-xs">
            <q-icon :name="getCategoryIcon(category)" size="18px" color="primary" />
            {{ category.toUpperCase() }}
          </div>
          
          <div v-if="getDocsByCategory(category).length === 0" class="empty-state-small border-dashed">
             No hay documentos registrados
          </div>

          <q-list separator v-else class="bg-grey-1 rounded-8">
            <q-item v-for="doc in getDocsByCategory(category)" :key="doc.id_documento" class="q-py-md">
              <q-item-section avatar>
                <q-avatar color="indigo-1" text-color="indigo" :icon="getFileIcon(doc.tipo_mime)" size="md" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold" style="font-size: 13px;">{{ doc.nombre_archivo }}</q-item-label>
                <q-item-label caption>{{ formatDate(doc.created_at) }} · {{ formatSize(doc.tamanio) }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row q-gutter-x-xs">
                  <q-btn flat round dense icon="visibility" color="grey-7" :href="doc.ruta_archivo" target="_blank">
                    <q-tooltip>Ver documento</q-tooltip>
                  </q-btn>
                  <q-btn flat round dense icon="delete" color="negative" @click="confirmDelete(doc)">
                    <q-tooltip>Eliminar</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>

    <!-- Upload Dialog -->
    <q-dialog v-model="showUploadDialog" persistent>
      <q-card style="min-width: 450px; border-radius: 16px;">
        <q-separator color="primary" size="4px" />
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bolder">CARGAR AL LEGAJO</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit="handleUpload" class="q-gutter-md">
            <q-select
              v-model="uploadData.categoria"
              :options="categories"
              label="Seleccionar Categoría"
              outlined
              rounded
              dense
              :rules="[val => !!val || 'Requerido']"
            />
            
            <q-file
              v-model="uploadData.file"
              label="Seleccionar archivo (PDF o Imagen)"
              outlined
              rounded
              dense
              accept=".pdf,.jpg,.jpeg,.png"
              max-file-size="5242880"
              @rejected="onFileRejected"
              :rules="[val => !!val || 'Requerido']"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <div class="row justify-end q-gutter-x-md q-mt-xl">
              <q-btn label="Cancelar" flat color="grey-7" v-close-popup :disable="uploading" no-caps />
              <q-btn label="Subir archivo" type="submit" unelevated color="primary" :loading="uploading" rounded class="q-px-lg" no-caps />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card style="border-radius: 16px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-negative">Confirmar eliminación</div>
        </q-card-section>
        <q-card-section class="q-pt-sm">
          ¿Está seguro de que desea eliminar el documento <b class="text-primary">{{ docToDelete?.nombre_archivo }}</b>? Esta acción es irreversible.
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="No, Cancelar" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated label="Si, Eliminar" color="negative" @click="handleDelete" :loading="deleting" rounded class="q-px-lg" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

const showUploadDialog = ref(false)
const uploadData = ref({
  categoria: 'Contrato',
  file: null as File | null
})

const showDeleteDialog = ref(false)
const docToDelete = ref<any | null>(null)

const categories = ['Contrato', 'Memorándum', 'Identidad', 'Educación', 'Otros']

const fetchDocuments = async () => {
  loading.value = true
  documents.value = await personalStore.getLegajo(props.idEmpleado)
  loading.value = false
}

const getDocsByCategory = (category: string) => {
  return documents.value.filter(doc => doc.categoria === category)
}

const handleUpload = async () => {
  if (!uploadData.value.file || !uploadData.value.categoria) return

  uploading.value = true
  const res = await personalStore.uploadDocument(
    props.idEmpleado,
    uploadData.value.file,
    uploadData.value.categoria
  )
  
  if (res) {
    showUploadDialog.value = false
    uploadData.value.file = null
    await fetchDocuments()
  }
  uploading.value = false
}

const confirmDelete = (doc: any) => {
  docToDelete.value = doc
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!docToDelete.value) return
  
  deleting.value = true
  const success = await personalStore.deleteDocument(docToDelete.value.id_documento)
  if (success) {
    showDeleteDialog.value = false
    await fetchDocuments()
  }
  deleting.value = false
  docToDelete.value = null
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    'Contrato': 'description',
    'Memorándum': 'assignment',
    'Identidad': 'badge',
    'Educación': 'school',
    'Otros': 'article'
  }
  return icons[category] || 'folder'
}

const getFileIcon = (mime: string | null) => {
  if (mime?.includes('pdf')) return 'picture_as_pdf'
  if (mime?.includes('image')) return 'image'
  return 'insert_drive_file'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-BO', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const formatSize = (bytes: number | null) => {
  if (!bytes) return '-'
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  if (i === -Infinity) return '0 Bytes'
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i]
}

const onFileRejected = () => {
  notify.error('Archivo demasiado grande o formato inválido (Max 5MB PDF/Imagen)')
}

onMounted(fetchDocuments)
</script>

<style lang="scss" scoped>
.category-section {
  padding: 24px;
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  height: 100%;
}

.empty-state-small {
  padding: 20px;
  text-align: center;
  color: #94a3b8;
  font-size: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.border-dashed {
  border: 1px dashed #e2e8f0;
}

.gap-md { gap: 16px; }
.gap-xs { gap: 6px; }

.form-section {
  &__icon {
    width: 36px;
    height: 36px;
    background: #f1f5f9;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__title {
    font-size: 13px;
    color: #1e293b;
  }
  &__subtitle {
    font-size: 11px;
    color: #94a3b8;
  }
}

.letter-spacing-1 { letter-spacing: 1px; }

.empty-state {
  padding: 60px 20px;
  text-align: center;
  &__title { font-weight: bold; color: #64748b; margin-top: 10px; }
  &__subtitle { color: #94a3b8; font-size: 12px; }
}
</style>
