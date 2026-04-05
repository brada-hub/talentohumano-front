<template>
  <div class="beneficios-tab">
    <section class="beneficios-card">
      <div class="beneficios-card__header">
        <div>
          <div class="beneficios-card__title">Beneficiarios</div>
          <div class="beneficios-card__subtitle">Derechohabientes, herederos o familiares vinculados al empleado.</div>
        </div>
        <q-space />
        <q-btn unelevated color="primary" icon="add" label="Nuevo beneficiario" no-caps rounded :disable="beneficiarios.length >= 2" @click="openDialog()" />
      </div>

      <q-separator class="q-my-md" />

      <div v-if="loading" class="beneficios-empty">
        <q-spinner-dots color="primary" size="32px" />
      </div>

      <div v-else-if="!beneficiarios.length" class="beneficios-empty">
        No hay beneficiarios registrados para este empleado.
      </div>

      <div v-else class="beneficios-list">
        <div v-for="item in beneficiarios" :key="item.id_beneficiario" class="beneficios-item">
          <div>
            <div class="beneficios-item__title">{{ fullName(item) }}</div>
            <div class="beneficios-item__subtitle">{{ item.parentesco?.nombre || 'Sin parentesco' }}</div>
            <div class="beneficios-item__meta">
              {{ [item.ci, item.complemento, formatDate(item.fecha_nacimiento), item.expedido?.nombre].filter(Boolean).join(' / ') }}
            </div>
          </div>
          <div class="row q-gutter-xs">
            <q-btn flat round dense color="grey-7" icon="edit" @click="openDialog(item)" />
            <q-btn flat round dense color="negative" icon="delete" @click="confirmDelete(item)" />
          </div>
        </div>
      </div>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="beneficios-dialog">
        <q-card-section class="beneficios-dialog__header row items-center q-py-md">
          <div class="text-h6">{{ form.id_beneficiario ? 'Editar beneficiario' : 'Nuevo beneficiario' }}</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-card-section class="row q-col-gutter-md q-pa-lg">
          <div class="col-12 col-md-4">
            <q-input v-model="form.primer_apellido" label="Primer apellido" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="form.segundo_apellido" label="Segundo apellido" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="form.nombres" label="Nombres" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="form.ci" label="Documento / CI" outlined dense />
          </div>
          <div class="col-12 col-md-2">
            <q-input v-model="form.complemento" label="Comp." outlined dense />
          </div>
          <div class="col-12 col-md-3">
            <q-select v-model="form.id_ci_expedido" :options="expedidoOptions" emit-value map-options label="Expedido" outlined dense />
          </div>
          <div class="col-12 col-md-3">
            <q-select v-model="form.id_parentesco" :options="parentescoOptions" emit-value map-options label="Parentesco" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="form.fecha_nacimiento" type="date" stack-label label="Fecha de nacimiento" outlined dense />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated color="primary" :loading="saving" label="Guardar beneficiario" rounded no-caps @click="saveBeneficiario" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { usePersonalStore } from 'src/stores/personalStore'
import { sanitizeAlphanumeric, sanitizeLetters } from 'src/shared/utils/formValidators'

const props = defineProps<{ empleadoId: number }>()

const $q = useQuasar()
const personalStore = usePersonalStore()
const loading = ref(false)
const saving = ref(false)
const dialog = ref(false)
const beneficiarios = ref<any[]>([])
const parentescos = ref<any[]>([])
const expedidos = ref<any[]>([])

const emptyForm = () => ({
  id_beneficiario: null as number | null,
  primer_apellido: '',
  segundo_apellido: '',
  nombres: '',
  ci: '',
  complemento: '',
  id_ci_expedido: null as number | null,
  fecha_nacimiento: '',
  id_parentesco: null as number | null,
})

const form = ref(emptyForm())

const parentescoOptions = computed(() =>
  parentescos.value.map((item: any) => ({ label: item.nombre, value: item.id_parentesco }))
)

const expedidoOptions = computed(() =>
  expedidos.value.map((item: any) => ({
    label: item.nombre,
    value: item.id_departamento ?? item.id,
  }))
)

const fullName = (item: any) => [item.primer_apellido, item.segundo_apellido, item.nombres].filter(Boolean).join(' ')

const formatDate = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-BO')
}

const loadData = async () => {
  loading.value = true
  if (!personalStore.catalogs.departamentos.length) {
    await personalStore.fetchCatalogs()
  }
  const [catalogs, records] = await Promise.all([
    personalStore.fetchBeneficiosCatalogs(),
    personalStore.fetchBeneficiarios(props.empleadoId),
  ])
  parentescos.value = catalogs?.parentescos || []
  expedidos.value = catalogs?.expedidos || []
  beneficiarios.value = records || []
  loading.value = false
}

const normalizeForm = () => {
  form.value.primer_apellido = sanitizeLetters(form.value.primer_apellido).toUpperCase()
  form.value.segundo_apellido = sanitizeLetters(form.value.segundo_apellido).toUpperCase()
  form.value.nombres = sanitizeLetters(form.value.nombres).toUpperCase()
  form.value.ci = sanitizeAlphanumeric(form.value.ci).toUpperCase()
  form.value.complemento = sanitizeAlphanumeric(form.value.complemento).toUpperCase()
}

const validateForm = () => {
  normalizeForm()
  if (!form.value.id_beneficiario && beneficiarios.value.length >= 2) {
    $q.notify({ color: 'warning', message: 'Solo se permiten 2 beneficiarios por empleado.' })
    return false
  }
  if (!form.value.primer_apellido || !form.value.nombres || !form.value.fecha_nacimiento || !form.value.id_parentesco) {
    $q.notify({ color: 'warning', message: 'Complete los campos obligatorios del beneficiario.' })
    return false
  }
  return true
}

const openDialog = (item?: any) => {
  if (!item && beneficiarios.value.length >= 2) {
    $q.notify({ color: 'warning', message: 'Solo se permiten 2 beneficiarios por empleado.' })
    return
  }
  form.value = item ? {
    id_beneficiario: item.id_beneficiario,
    primer_apellido: item.primer_apellido || '',
    segundo_apellido: item.segundo_apellido || '',
    nombres: item.nombres || '',
    ci: item.ci || '',
    complemento: item.complemento || '',
    id_ci_expedido: item.id_ci_expedido || null,
    fecha_nacimiento: item.fecha_nacimiento ? String(item.fecha_nacimiento).slice(0, 10) : '',
    id_parentesco: item.id_parentesco || null,
  } : emptyForm()
  dialog.value = true
}

const saveBeneficiario = async () => {
  if (!validateForm()) return
  saving.value = true
  const payload = { ...form.value }
  const result = form.value.id_beneficiario
    ? await personalStore.updateBeneficiario(form.value.id_beneficiario, payload)
    : await personalStore.createBeneficiario(props.empleadoId, payload)
  saving.value = false
  if (result) {
    dialog.value = false
    await loadData()
  }
}

const confirmDelete = (item: any) => {
  $q.dialog({
    title: 'Eliminar beneficiario',
    message: `Se eliminara a ${fullName(item)}.`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const deleted = await personalStore.deleteBeneficiario(item.id_beneficiario)
    if (deleted) await loadData()
  })
}

watch(() => props.empleadoId, () => {
  loadData()
})

onMounted(loadData)
</script>

<style scoped lang="scss">
.beneficios-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.beneficios-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.beneficios-card__title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.beneficios-card__subtitle {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.beneficios-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.beneficios-item {
  padding: 12px 14px;
  border-radius: 12px;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.beneficios-item__title {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.beneficios-item__subtitle,
.beneficios-item__meta {
  font-size: 12px;
  color: #475569;
  margin-top: 4px;
}

.beneficios-empty {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.beneficios-dialog {
  width: 820px;
  max-width: 92vw;
  border-radius: 18px;
}

.beneficios-dialog__header {
  background: linear-gradient(135deg, #4f2789 0%, #00c2cb 100%);
  color: #fff;
}
</style>
