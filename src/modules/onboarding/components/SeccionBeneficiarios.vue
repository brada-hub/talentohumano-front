<template>
  <q-card flat class="rounded-32 bg-white card-shadow overflow-hidden q-mt-xl border-light">
    <q-card-section class="bg-unitepc-sso text-white row items-center q-pa-xl">
      <q-avatar size="56px" font-size="28px" color="white" text-color="primary" icon="groups" class="q-mr-md shadow-2" />
      <div>
        <div class="text-h5 text-weight-bolder tracking-tight">2. Beneficiarios</div>
        <div class="text-caption opacity-80 uppercase tracking-widest text-weight-medium">Máximo 2 beneficiarios por empleado</div>
      </div>
      <q-space />
      <q-btn
        unelevated
        color="white"
        text-color="primary"
        icon="add"
        label="Agregar"
        no-caps
        rounded
        :disable="beneficiarios.length >= 2"
        @click="openDialog()"
      />
    </q-card-section>

    <q-card-section class="q-pa-xl">
      <div v-if="!beneficiarios.length" class="beneficios-empty">
        No se registraron beneficiarios todavía.
      </div>

      <div v-else class="beneficios-list">
        <div v-for="(item, index) in beneficiarios" :key="index" class="beneficios-item">
          <div>
            <div class="beneficios-item__title">{{ fullName(item) }}</div>
            <div class="beneficios-item__subtitle">{{ parentescoLabel(item.id_parentesco) }}</div>
            <div class="beneficios-item__meta">
              {{ [item.ci, item.complemento, formatDate(item.fecha_nacimiento), expedidoLabel(item.id_ci_expedido)].filter(Boolean).join(' / ') }}
            </div>
          </div>
          <div class="row q-gutter-xs">
            <q-btn flat round dense color="grey-7" icon="edit" @click="openDialog(item, index)" />
            <q-btn flat round dense color="negative" icon="delete" @click="removeItem(index)" />
          </div>
        </div>
      </div>
    </q-card-section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="beneficios-dialog">
        <q-card-section class="bg-unitepc-sso text-white row items-center q-py-md">
          <div class="text-h6 text-weight-bold">{{ editingIndex === null ? 'Nuevo beneficiario' : 'Editar beneficiario' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="row q-col-gutter-md q-pa-lg">
          <div class="col-12 col-md-4">
            <q-input v-model="form.primer_apellido" @update:model-value="normalizeForm" label="Primer apellido" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="form.segundo_apellido" @update:model-value="normalizeForm" label="Segundo apellido" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="form.nombres" @update:model-value="normalizeForm" label="Nombres" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="form.ci" @update:model-value="normalizeForm" label="Documento / CI" outlined dense />
          </div>
          <div class="col-12 col-md-2">
            <q-input v-model="form.complemento" @update:model-value="normalizeForm" label="Comp." outlined dense />
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
          <q-btn unelevated color="primary" label="Guardar beneficiario" rounded no-caps @click="saveItem" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Notify } from 'quasar'
import { useOnboardingStore } from 'src/stores/onboardingStore'
import { sanitizeAlphanumeric, sanitizeLetters } from 'src/shared/utils/formValidators'

const onboardingStore = useOnboardingStore()
const dialog = ref(false)
const editingIndex = ref<number | null>(null)

const form = ref({
  primer_apellido: '',
  segundo_apellido: '',
  nombres: '',
  ci: '',
  complemento: '',
  id_ci_expedido: null as number | null,
  fecha_nacimiento: '',
  id_parentesco: null as number | null,
})

const beneficiarios = computed(() => onboardingStore.beneficiarios || [])
const expedidoOptions = computed(() => onboardingStore.expedidos)
const parentescoOptions = computed(() => onboardingStore.parentescos)

const emptyForm = () => ({
  primer_apellido: '',
  segundo_apellido: '',
  nombres: '',
  ci: '',
  complemento: '',
  id_ci_expedido: null as number | null,
  fecha_nacimiento: '',
  id_parentesco: null as number | null,
})

const asNumberOrNull = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

const normalizeForm = () => {
  form.value.primer_apellido = sanitizeLetters(form.value.primer_apellido).toUpperCase()
  form.value.segundo_apellido = sanitizeLetters(form.value.segundo_apellido).toUpperCase()
  form.value.nombres = sanitizeLetters(form.value.nombres).toUpperCase()
  form.value.ci = sanitizeAlphanumeric(form.value.ci).toUpperCase()
  form.value.complemento = sanitizeAlphanumeric(form.value.complemento).toUpperCase()
}

const fullName = (item: any) => [item.primer_apellido, item.segundo_apellido, item.nombres].filter(Boolean).join(' ')
const parentescoLabel = (value?: string | number | null) =>
  parentescoOptions.value.find((item: any) => item.value === Number(value))?.label || ''
const expedidoLabel = (value?: string | number | null) => expedidoOptions.value.find((item: any) => item.value === Number(value))?.label || ''

const formatDate = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-BO')
}

const openDialog = (item?: any, index?: string | number) => {
  if (!item && beneficiarios.value.length >= 2) {
    Notify.create({ color: 'warning', message: 'Solo puede registrar hasta 2 beneficiarios.' })
    return
  }
  form.value = item ? {
    ...item,
    id_ci_expedido: asNumberOrNull(item.id_ci_expedido),
    id_parentesco: asNumberOrNull(item.id_parentesco),
  } : emptyForm()
  editingIndex.value = index !== undefined ? Number(index) : null
  dialog.value = true
}

const saveItem = () => {
  normalizeForm()
  if (!form.value.primer_apellido || !form.value.nombres || !form.value.fecha_nacimiento || !form.value.id_parentesco) {
    Notify.create({ color: 'warning', message: 'Complete los campos obligatorios del beneficiario.' })
    return
  }

  if (editingIndex.value === null && beneficiarios.value.length >= 2) {
    Notify.create({ color: 'warning', message: 'Solo puede registrar hasta 2 beneficiarios.' })
    return
  }

  const item = {
    ...form.value,
    id_ci_expedido: asNumberOrNull(form.value.id_ci_expedido),
    id_parentesco: asNumberOrNull(form.value.id_parentesco),
  }
  if (editingIndex.value !== null) {
    onboardingStore.beneficiarios[editingIndex.value] = item
  } else {
    onboardingStore.beneficiarios.push(item)
  }
  onboardingStore.saveToLocal()
  dialog.value = false
  editingIndex.value = null
}

const removeItem = (index: string | number) => {
  onboardingStore.beneficiarios.splice(Number(index), 1)
  onboardingStore.saveToLocal()
}

onMounted(async () => {
  if (!onboardingStore.expedidos.length || !onboardingStore.parentescos.length) {
    await onboardingStore.fetchBeneficiarioCatalogs()
  }
})
</script>

<style scoped lang="scss">
.rounded-32 { border-radius: 32px !important; }
.card-shadow { box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05); }
.border-light { border: 1px solid rgba(225, 232, 240, 0.8); }

.beneficios-empty {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  background: #f8fafc;
  border-radius: 18px;
}

.beneficios-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.beneficios-item {
  padding: 14px;
  border-radius: 14px;
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

.beneficios-dialog {
  width: 820px;
  max-width: 92vw;
  border-radius: 18px;
}
</style>
