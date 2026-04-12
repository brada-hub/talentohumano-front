<template>
  <div class="row q-col-gutter-lg q-mt-lg">
    <div class="col-12 col-xl-5">
      <div class="card-premium q-pa-xl">
        <div class="row items-center justify-between q-mb-xl">
          <div class="text-h6 text-weight-bold text-grey-9 row items-center">
            <q-icon name="work_history" color="primary" class="q-mr-sm" />
            Historial de Contratos
          </div>

          <q-btn
            unelevated
            color="primary"
            icon="add"
            label="Nuevo contrato"
            no-caps
            @click="openCreateDialog"
          />
        </div>

        <div v-if="!contratos.length" class="empty-contracts rounded-16 q-pa-xl text-center text-grey-7">
          <q-icon name="description_off" size="40px" color="grey-5" class="q-mb-md" />
          <div class="text-subtitle1 text-weight-medium">No hay contratos registrados todavia</div>
          <div class="text-caption q-mt-sm">
            Registra el primer contrato del funcionario y luego podras generar su version formal.
          </div>
        </div>

        <div v-else class="contract-table-wrap">
          <table class="contract-table">
            <thead>
              <tr>
                <th>Periodo</th>
                <th>Cargo</th>
                <th>Área</th>
                <th>Sede</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Salario</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="contract in chronologicalContracts" :key="contract.id_contrato">
                <tr
                  class="contract-table__row"
                  :class="{ 'contract-table__row--selected': Number(contract.id_contrato) === selectedContractId }"
                  @click="selectedContractId = Number(contract.id_contrato)"
                >
                  <td>{{ buildContractSubtitle(contract) }}</td>
                  <td class="text-weight-bold">{{ contract.cargo?.nombre_cargo || 'Contrato laboral' }}</td>
                  <td>{{ contract.area?.nombre_area || 'Sin área' }}</td>
                  <td>{{ contract.sede?.nombre || 'Sin sede' }}</td>
                  <td>{{ resolveContractTypeLabel(contract) }}</td>
                  <td>
                    <q-badge
                      :color="contract.estado_contrato === 'Activo' ? 'green-2' : 'grey-3'"
                      :text-color="contract.estado_contrato === 'Activo' ? 'green-9' : 'grey-8'"
                      class="text-weight-bold"
                    >
                      {{ contract.estado_contrato }}
                    </q-badge>
                  </td>
                  <td>{{ formatSalaryBadge(contract.salario) }}</td>
                  <td class="text-right">
                    <div class="row justify-end q-gutter-xs no-wrap">
                      <q-btn outline color="primary" icon="edit" label="Editar" no-caps dense @click.stop="openEditDialog(contract)" />
                      <q-btn outline color="accent" icon="content_copy" label="Renovar" no-caps dense @click.stop="openRenewDialog(contract)" />
                      <q-btn outline color="secondary" icon="upload_file" label="Firmado" no-caps dense @click.stop="openUploadSignedDialog(contract)" />
                      <q-btn
                        v-if="contract.estado_contrato === 'Activo'"
                        outline
                        color="negative"
                        icon="event_busy"
                        label="Finalizar"
                        no-caps
                        dense
                        @click.stop="confirmFinalize(contract)"
                      />
                    </div>
                  </td>
                </tr>
                <tr class="contract-table__detail">
                  <td colspan="8">
                    <div class="text-caption text-grey-7 q-mb-xs">Versiones registradas</div>
                    <div v-if="versionsLoading[contract.id_contrato]" class="text-caption text-grey-6">
                      Cargando versiones...
                    </div>
                    <div v-else-if="!(contractVersions[contract.id_contrato] || []).length" class="text-caption text-grey-6">
                      Aún no hay contratos firmados subidos para este contrato.
                    </div>
                    <div v-else class="column q-gutter-xs">
                      <div
                        v-for="version in contractVersions[contract.id_contrato]"
                        :key="version.id_documento"
                        class="row items-center justify-between version-row"
                      >
                        <div class="column">
                          <div class="text-caption text-weight-bold">Versión {{ version.version }}</div>
                          <div class="text-caption text-grey-7">
                            {{ version.nombre_archivo }} · {{ formatDate(version.created_at) }}
                          </div>
                        </div>
                        <q-btn flat round dense icon="visibility" color="primary" @click.stop="openVersion(version)" />
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="col-12 col-xl-7">
      <div class="card-premium q-pa-xl">
        <div class="row items-start justify-between q-col-gutter-md q-mb-lg">
          <div class="col-12 col-md">
            <div class="text-h6 text-weight-bold text-grey-9 row items-center">
              <q-icon name="description" color="primary" class="q-mr-sm" />
              Generador de Contrato
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Usa un contrato existente como base. Puedes generar una plantilla de plazo fijo o indefinido desde el mismo flujo.
            </div>
          </div>

          <div class="col-12 col-md-auto">
            <q-btn
              outline
              color="primary"
              icon="refresh"
              label="Restablecer sugeridos"
              no-caps
              :disable="!selectedContract"
              @click="applySuggestedValues(selectedContract)"
            />
          </div>
        </div>

        <div v-if="!contratos.length" class="empty-contracts rounded-16 q-pa-xl text-center text-grey-7">
          <q-icon name="description_off" size="40px" color="grey-5" class="q-mb-md" />
          <div class="text-subtitle1 text-weight-medium">No hay contratos base todavia</div>
          <div class="text-caption q-mt-sm">
            Primero registra un contrato y luego podras generar automaticamente su version en PDF.
          </div>
        </div>

        <template v-else>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                v-model="selectedTemplate"
                :options="templateOptions"
                label="Plantilla contractual"
                outlined
                dense
                emit-value
                map-options
                class="q-mb-md"
              />
            </div>

            <div class="col-12">
              <q-select
                v-model="selectedContractId"
                :options="contractOptions"
                label="Contrato base"
                outlined
                dense
                emit-value
                map-options
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input v-model="form.fechaInicio" label="Fecha de inicio" outlined dense type="date" />
            </div>
            <div v-if="requiresEndDate" class="col-12 col-md-6">
              <q-input v-model="form.fechaFin" label="Fecha de fin" outlined dense type="date" />
            </div>

            <div v-if="requiresEndDate" class="col-12 col-md-6">
              <q-input :model-value="computedDuracionLiteral" label="Duracion calculada" outlined dense readonly />
            </div>
            <div v-else class="col-12 col-md-6">
              <q-input model-value="Tiempo indefinido" label="Vigencia" outlined dense readonly />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.lugarTrabajo" label="Lugar de trabajo" outlined dense />
            </div>

            <div class="col-12 col-md-6">
              <q-input v-model="form.cargaHorariaNumeral" label="Carga horaria semanal" outlined dense type="number" />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.salarioNumeral" label="Remuneracion (Bs.)" outlined dense type="number" />
            </div>

            <div class="col-12">
              <q-input :model-value="computedSalarioLiteral" label="Remuneracion literal" outlined dense readonly />
            </div>

            <div class="col-12 col-md-6">
              <q-input v-model="form.ciudadFirma" label="Ciudad de firma" outlined dense />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                :model-value="form.fechaFirma"
                label="Fecha de firma"
                hint="Se usa automaticamente la misma fecha de inicio del contrato"
                outlined
                dense
                type="date"
                readonly
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="form.remuneracionTexto"
                label="Texto adicional de remuneracion"
                outlined
                dense
                type="textarea"
                autogrow
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="form.notaHoraria"
                label="Nota horaria adicional"
                outlined
                dense
                type="textarea"
                autogrow
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.horariosText"
                label="Horarios"
                hint="Una linea por horario"
                outlined
                dense
                type="textarea"
                autogrow
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.funcionesText"
                label="Funciones especificas"
                hint="Una linea por funcion"
                outlined
                dense
                type="textarea"
                autogrow
              />
            </div>
          </div>

          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn
              outline
              color="primary"
              icon="visibility"
              label="Vista previa"
              no-caps
              :loading="previewLoading"
              :disable="!selectedContract"
              @click="generatePreview"
            />
            <q-btn
              unelevated
              color="primary"
              icon="download"
              label="Descargar PDF"
              no-caps
              :loading="downloadLoading"
              :disable="!selectedContract"
              @click="downloadPdf"
            />
          </div>
        </template>
      </div>
    </div>
  </div>

  <q-dialog v-model="contractDialog" persistent>
    <q-card class="contract-dialog">
      <q-card-section class="row items-center justify-between bg-primary text-white">
        <div class="text-h6">{{ editingContract ? 'Editar contrato' : renewalSourceContract ? 'Renovar contrato' : 'Nuevo contrato' }}</div>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select
              v-model="contractForm.id_tipo_contrato"
              :options="tipoContratoOptions"
              label="Tipo de contrato"
              outlined
              dense
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              v-model="contractForm.estado_contrato"
              :options="estadoContratoOptions"
              label="Estado"
              outlined
              dense
              emit-value
              map-options
            />
          </div>

          <div class="col-12 col-md-6">
            <q-select
              v-model="contractForm.id_area"
              :options="areaOptions"
              label="Area"
              outlined
              dense
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              v-model="contractForm.id_cargo"
              :options="cargoOptions"
              label="Cargo"
              outlined
              dense
              emit-value
              map-options
            />
          </div>

          <div class="col-12 col-md-6">
            <q-select
              v-model="contractForm.id_sede"
              :options="sedeOptions"
              label="Sede"
              outlined
              dense
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="contractForm.salario" label="Salario" outlined dense type="number" />
          </div>

          <div class="col-12 col-md-6">
            <q-input v-model="contractForm.fecha_inicio" label="Fecha de inicio" outlined dense type="date" />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="contractForm.fecha_fin" label="Fecha de fin" outlined dense type="date" />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-lg">
        <q-btn flat color="grey-7" label="Cancelar" no-caps v-close-popup />
        <q-btn
          unelevated
          color="primary"
          :label="editingContract ? 'Guardar cambios' : renewalSourceContract ? 'Registrar renovación' : 'Registrar contrato'"
          no-caps
          :loading="savingContract"
          @click="saveContract"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="signedDialog" persistent>
    <q-card class="contract-dialog">
      <q-card-section class="row items-center justify-between bg-secondary text-white">
        <div class="text-h6">Subir contrato firmado</div>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <div class="text-caption text-grey-7 q-mb-md">
          El archivo firmado quedara ligado al contrato seleccionado y se registrara una nueva version en el legajo.
        </div>

        <q-file
          v-model="signedFile"
          label="Contrato firmado (PDF o imagen)"
          outlined
          dense
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </q-card-section>

      <q-card-actions align="right" class="q-pa-lg">
        <q-btn flat color="grey-7" label="Cancelar" no-caps v-close-popup />
        <q-btn unelevated color="secondary" label="Subir firmado" no-caps :loading="uploadingSigned" @click="uploadSignedContract" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="previewDialog" maximized>
    <q-card class="preview-dialog">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>
          Vista previa del contrato {{ selectedTemplate === 'indefinido' ? 'indefinido' : 'a plazo fijo' }}
          <div class="text-caption text-white">
            {{ empleadoNombre || 'Funcionario' }}
          </div>
        </q-toolbar-title>
        <q-btn
          flat
          dense
          icon="download"
          label="Descargar PDF"
          no-caps
          :loading="downloadLoading"
          @click="downloadPdf"
        />
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section class="preview-dialog__body q-pa-none">
        <iframe
          v-if="previewHtml"
          :srcdoc="previewHtml"
          class="preview-dialog__frame"
          title="Vista previa del contrato"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { usePersonalStore } from 'src/stores/personalStore'
import contratosService from 'src/modules/contratos/services/contratos.service'
import { buildSigethPortalFileUrl } from 'src/shared/config/runtime'

interface Props {
  contratos: any[]
  empleadoId: number
  empleadoNombre?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['refresh'])
const $q = useQuasar()
const personalStore = usePersonalStore()

const selectedContractId = ref<number | null>(null)
const selectedTemplate = ref<'plazo-fijo' | 'indefinido'>('plazo-fijo')
const previewDialog = ref(false)
const previewLoading = ref(false)
const downloadLoading = ref(false)
const previewHtml = ref('')
const signedDialog = ref(false)
const signedFile = ref<File | null>(null)
const uploadingSigned = ref(false)
const selectedSignedContract = ref<any | null>(null)
const contractVersions = ref<Record<number, any[]>>({})
const versionsLoading = ref<Record<number, boolean>>({})

const contractDialog = ref(false)
const savingContract = ref(false)
const editingContract = ref<any | null>(null)
const renewalSourceContract = ref<any | null>(null)

const form = reactive({
  fechaInicio: '',
  fechaFin: '',
  lugarTrabajo: '',
  cargaHorariaNumeral: '48',
  salarioNumeral: '',
  remuneracionTexto: '',
  ciudadFirma: '',
  fechaFirma: '',
  notaHoraria: '',
  horariosText: '',
  funcionesText: '',
})

const contractForm = reactive({
  id_tipo_contrato: null as number | null,
  id_area: null as number | null,
  id_cargo: null as number | null,
  salario: '',
  fecha_inicio: '',
  fecha_fin: '',
  id_sede: null as number | null,
  estado_contrato: 'Activo',
})

const computedDuracionLiteral = computed(() => buildDuracionLiteral(form.fechaInicio, form.fechaFin))
const computedSalarioLiteral = computed(() => buildSalaryLiteral(form.salarioNumeral))
const requiresEndDate = computed(() => selectedTemplate.value === 'plazo-fijo')
const todayIso = computed(() => new Date().toISOString().slice(0, 10))
const hasActiveContract = computed(() => props.contratos.some((contract) => contract.estado_contrato === 'Activo'))
const chronologicalContracts = computed(() =>
  [...props.contratos].sort((left, right) => {
    const leftStart = left.fecha_inicio ? new Date(left.fecha_inicio).getTime() : 0
    const rightStart = right.fecha_inicio ? new Date(right.fecha_inicio).getTime() : 0
    return leftStart - rightStart
  }),
)
const templateOptions = [
  { label: 'Contrato a plazo fijo', value: 'plazo-fijo' },
  { label: 'Contrato indefinido', value: 'indefinido' },
]

const contractOptions = computed(() =>
  props.contratos.map((contract) => ({
    label: [
      contract.cargo?.nombre_cargo || 'Contrato',
      resolveContractTypeLabel(contract),
      buildContractSubtitle(contract),
    ].filter(Boolean).join(' · '),
    value: Number(contract.id_contrato),
  })),
)

const tipoContratoOptions = computed(() =>
  (personalStore.catalogs.tipo_contrato || []).map((item: any) => ({
    label: item.nombre_tipo_contrato || item.nombre || `Tipo ${item.id_tipo_contrato}`,
    value: Number(item.id_tipo_contrato),
  })),
)

const areaOptions = computed(() =>
  (personalStore.catalogs.areas || []).map((item: any) => ({
    label: item.nombre_area || item.nombre || `Area ${item.id_area}`,
    value: Number(item.id_area),
  })),
)

const cargoOptions = computed(() =>
  (personalStore.catalogs.cargos || []).map((item: any) => ({
    label: item.nombre_cargo || item.nombre || `Cargo ${item.id_cargo}`,
    value: Number(item.id_cargo),
  })),
)

const sedeOptions = computed(() =>
  (personalStore.catalogs.sedes || []).map((item: any) => ({
    label: item.nombre || `Sede ${item.id_sede}`,
    value: Number(item.id_sede),
  })),
)

const estadoContratoOptions = [
  { label: 'Activo', value: 'Activo' },
  { label: 'Borrador', value: 'Borrador' },
  { label: 'Finalizado', value: 'Finalizado' },
  { label: 'Vencido', value: 'Vencido' },
]

const selectedContract = computed(() =>
  props.contratos.find((contract) => Number(contract.id_contrato) === selectedContractId.value) || null,
)

watch(
  () => props.contratos,
  async (contracts) => {
    if (!contracts.length) {
      selectedContractId.value = null
      return
    }

    const currentStillExists = contracts.some((contract) => Number(contract.id_contrato) === selectedContractId.value)
    if (!currentStillExists) {
      const preferred = contracts.find((contract) => contract.estado_contrato === 'Activo') || chronologicalContracts.value.at(-1) || contracts[0]
      selectedContractId.value = Number(preferred.id_contrato)
    }

    await Promise.all(
      contracts
        .map((contract) => Number(contract.id_contrato))
        .filter((contratoId) => !Object.prototype.hasOwnProperty.call(contractVersions.value, contratoId))
        .map((contratoId) => loadVersions(contratoId)),
    )
  },
  { immediate: true },
)

watch(
  selectedContract,
  (contract) => {
    if (contract) {
      selectedTemplate.value = inferTemplateFromContract(contract)
      applySuggestedValues(contract)
    }
  },
  { immediate: true },
)

watch(
  () => form.fechaInicio,
  (value) => {
    form.fechaFirma = value || ''
  },
)

watch(selectedTemplate, (value) => {
  if (value === 'indefinido') {
    form.fechaFin = ''
  } else if (!form.fechaFin && selectedContract.value?.fecha_fin) {
    form.fechaFin = selectedContract.value.fecha_fin
  }
})

watch(contractDialog, (isOpen) => {
  if (!isOpen) {
    editingContract.value = null
    renewalSourceContract.value = null
  }
})

onMounted(async () => {
  if (!personalStore.catalogs.tipo_contrato.length) {
    await personalStore.fetchCatalogs()
  }

  await Promise.all(props.contratos.map((contract) => loadVersions(contract.id_contrato)))
})

function buildContractSubtitle(contract: any) {
  const inicio = formatDateOnly(contract.fecha_inicio) || 'Sin inicio'
  const fin = formatDateOnly(contract.fecha_fin) || 'Presente'
  return `${inicio} - ${fin}`
}

function normalizeNumericId(value: unknown) {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null
}

function resolveCatalogLabel(options: Array<{ label: string; value: number }>, value: unknown) {
  const normalizedValue = normalizeNumericId(value)
  if (!normalizedValue) {
    return ''
  }

  return options.find((item) => item.value === normalizedValue)?.label || ''
}

function resolveContractTypeLabel(contract: any) {
  return (
    contract?.tipo?.nombre_tipo_contrato
    || contract?.tipo?.nombre
    || resolveCatalogLabel(tipoContratoOptions.value, contract?.id_tipo_contrato)
    || 'Sin tipo de contrato'
  )
}

function formatSalaryBadge(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return 'Sin salario'
  }

  return `${Number(value).toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} Bs.`
}

function buildDuracionLiteral(fechaInicio?: string | null, fechaFin?: string | null) {
  if (!fechaInicio || !fechaFin) {
    return ''
  }

  const start = new Date(`${fechaInicio}T00:00:00`)
  const end = new Date(`${fechaFin}T00:00:00`)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return ''
  }

  const inclusiveEnd = new Date(end)
  inclusiveEnd.setDate(inclusiveEnd.getDate() + 1)

  let months = 0
  const cursor = new Date(start)

  while (true) {
    const next = new Date(cursor)
    next.setMonth(next.getMonth() + 1)

    if (next <= inclusiveEnd) {
      months += 1
      cursor.setMonth(cursor.getMonth() + 1)
    } else {
      break
    }
  }

  const diffMs = inclusiveEnd.getTime() - cursor.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const parts: string[] = []

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'mes' : 'meses'}`)
  }

  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'dia' : 'dias'}`)
  }

  return parts.join(' y ') || '0 dias'
}

function getContractDurationDays(fechaInicio?: string | null, fechaFin?: string | null) {
  if (!fechaInicio || !fechaFin) {
    return 0
  }

  const start = new Date(`${fechaInicio}T00:00:00`)
  const end = new Date(`${fechaFin}T00:00:00`)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return 0
  }

  const diffMs = end.getTime() - start.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1
}

function buildSalaryLiteral(value?: string | number | null) {
  if (value === null || value === undefined || value === '') {
    return ''
  }

  const amount = Number(value)
  if (Number.isNaN(amount) || amount <= 0) {
    return ''
  }

  const integer = Math.floor(amount)
  const decimals = Math.round((amount - integer) * 100)
  const literal = numberToWords(integer)

  return `(${capitalize(literal)} ${String(decimals).padStart(2, '0')}/100 Bolivianos)`
}

function numberToWords(number: number): string {
  const units: Record<number, string> = {
    0: 'cero', 1: 'un', 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco', 6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve',
    10: 'diez', 11: 'once', 12: 'doce', 13: 'trece', 14: 'catorce', 15: 'quince', 16: 'dieciseis', 17: 'diecisiete',
    18: 'dieciocho', 19: 'diecinueve', 20: 'veinte', 21: 'veintiun', 22: 'veintidos', 23: 'veintitres', 24: 'veinticuatro',
    25: 'veinticinco', 26: 'veintiseis', 27: 'veintisiete', 28: 'veintiocho', 29: 'veintinueve',
  }
  const tens: Record<number, string> = {
    30: 'treinta', 40: 'cuarenta', 50: 'cincuenta', 60: 'sesenta', 70: 'setenta', 80: 'ochenta', 90: 'noventa',
  }
  const hundreds: Record<number, string> = {
    100: 'cien', 200: 'doscientos', 300: 'trescientos', 400: 'cuatrocientos', 500: 'quinientos',
    600: 'seiscientos', 700: 'setecientos', 800: 'ochocientos', 900: 'novecientos',
  }

  if (number < 30) return units[number]
  if (number < 100) {
    const ten = Math.floor(number / 10) * 10
    const rest = number % 10
    return rest === 0 ? tens[ten] : `${tens[ten]} y ${numberToWords(rest)}`
  }
  if (number < 1000) {
    if (number === 100) return 'cien'
    const hundred = Math.floor(number / 100) * 100
    const rest = number % 100
    const prefix = hundred === 100 ? 'ciento' : hundreds[hundred]
    return rest === 0 ? prefix : `${prefix} ${numberToWords(rest)}`
  }
  if (number < 1000000) {
    const thousands = Math.floor(number / 1000)
    const rest = number % 1000
    const prefix = thousands === 1 ? 'mil' : `${numberToWords(thousands)} mil`
    return rest === 0 ? prefix : `${prefix} ${numberToWords(rest)}`
  }
  if (number < 1000000000) {
    const millions = Math.floor(number / 1000000)
    const rest = number % 1000000
    const prefix = millions === 1 ? 'un millon' : `${numberToWords(millions)} millones`
    return rest === 0 ? prefix : `${prefix} ${numberToWords(rest)}`
  }

  return String(number)
}

function capitalize(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : ''
}

function buildLugarTrabajo(contract: any) {
  const sede = contract?.sede?.nombre
  if (!sede) return ''
  return sede.toLowerCase().startsWith('campus') ? `el ${sede}` : `la ciudad de ${sede}`
}

function inferTemplateFromContract(contract: any): 'plazo-fijo' | 'indefinido' {
  const tipoNombre = String(resolveContractTypeLabel(contract)).toLowerCase()
  return tipoNombre.includes('indefin') ? 'indefinido' : 'plazo-fijo'
}

function splitMultiline(value: string) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean)
}

function applySuggestedValues(contract: any) {
  form.fechaInicio = normalizeDateInput(contract.fecha_inicio)
  form.fechaFin = inferTemplateFromContract(contract) === 'indefinido' ? '' : normalizeDateInput(contract.fecha_fin)
  form.lugarTrabajo = buildLugarTrabajo(contract)
  form.cargaHorariaNumeral = '48'
  form.salarioNumeral = String(contract.salario ?? '')
  form.remuneracionTexto = ''
  form.ciudadFirma = contract?.sede?.nombre || 'Cochabamba'
  form.fechaFirma = normalizeDateInput(contract.fecha_inicio)
  form.notaHoraria = 'Toda vez que existen cuatro (4) horas adicionales, estas seran utilizadas durante cada semana previo acuerdo de partes y bajo supervision e instruccion de su inmediato superior.'
  form.horariosText = ['De lunes a viernes de 07:45 a 12:30 y de 14:30 a 18:30', 'Sabados de 08:15 a 12:30.'].join('\n')
  form.funcionesText = ['Planificacion de la gestion academica.', 'Seguimiento de la gestion planificada.', 'Cumplir con las demas funciones que sean asignadas por su inmediato superior.'].join('\n')
}

function buildPreviewPayload() {
  return {
    id_contrato: selectedContractId.value,
    overrides: {
      contrato: {
        fecha_inicio: form.fechaInicio || null,
        fecha_fin: requiresEndDate.value ? (form.fechaFin || null) : null,
        lugar_trabajo: form.lugarTrabajo || null,
        carga_horaria_numeral: Number(form.cargaHorariaNumeral || 48),
        horarios: splitMultiline(form.horariosText),
        nota_horaria: form.notaHoraria || null,
        salario_numeral: Number(form.salarioNumeral || 0),
        remuneracion_detalle: form.remuneracionTexto || null,
        ciudad_firma: form.ciudadFirma || null,
        fecha_firma: form.fechaFirma || null,
      },
      funciones: splitMultiline(form.funcionesText),
    },
  }
}

function buildDownloadFilename() {
  const kind = selectedTemplate.value === 'indefinido' ? 'contrato_indefinido' : 'contrato_plazo_fijo'
  return `${kind}_${props.empleadoId}.pdf`
}

function resetContractForm() {
  contractForm.id_tipo_contrato = null
  contractForm.id_area = null
  contractForm.id_cargo = null
  contractForm.salario = ''
  contractForm.fecha_inicio = ''
  contractForm.fecha_fin = ''
  contractForm.id_sede = null
  contractForm.estado_contrato = hasActiveContract.value ? 'Vencido' : 'Activo'
}

function addDaysToIsoDate(value?: string | null, days = 1) {
  const normalized = normalizeDateInput(value)
  if (!normalized) return ''

  const [year, month, day] = normalized.split('-').map(Number)
  const date = new Date(year, (month || 1) - 1, day || 1)
  date.setDate(date.getDate() + days)

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function resolveRenewalDefaultState(baseContract: any) {
  const hasAnotherActive = props.contratos.some((item) =>
    Number(item.id_contrato) !== Number(baseContract?.id_contrato) && item.estado_contrato === 'Activo',
  )

  if (baseContract?.estado_contrato === 'Activo' || hasAnotherActive) {
    return 'Borrador'
  }

  return 'Activo'
}

async function loadVersions(contratoId: number) {
  versionsLoading.value = {
    ...versionsLoading.value,
    [contratoId]: true,
  }

  try {
    const items = await contratosService.getVersiones(props.empleadoId, Number(contratoId))
    contractVersions.value = {
      ...contractVersions.value,
      [contratoId]: items,
    }
  } catch {
    contractVersions.value = {
      ...contractVersions.value,
      [contratoId]: [],
    }
  } finally {
    versionsLoading.value = {
      ...versionsLoading.value,
      [contratoId]: false,
    }
  }
}

function openCreateDialog() {
  editingContract.value = null
  renewalSourceContract.value = null
  resetContractForm()

  const activeContract = props.contratos.find((item) => item.estado_contrato === 'Activo')
  if (activeContract) {
    contractForm.id_tipo_contrato = normalizeNumericId(activeContract.id_tipo_contrato)
    contractForm.id_area = normalizeNumericId(activeContract.id_area)
    contractForm.id_cargo = normalizeNumericId(activeContract.id_cargo)
    contractForm.id_sede = normalizeNumericId(activeContract.id_sede)
    contractForm.salario = activeContract.salario ? String(activeContract.salario) : ''
  }

  contractDialog.value = true
}

function openEditDialog(contract: any) {
  editingContract.value = contract
  renewalSourceContract.value = null
  contractForm.id_tipo_contrato = normalizeNumericId(contract.id_tipo_contrato)
  contractForm.id_area = normalizeNumericId(contract.id_area)
  contractForm.id_cargo = normalizeNumericId(contract.id_cargo)
  contractForm.salario = contract.salario ? String(contract.salario) : ''
  contractForm.fecha_inicio = normalizeDateInput(contract.fecha_inicio)
  contractForm.fecha_fin = normalizeDateInput(contract.fecha_fin)
  contractForm.id_sede = normalizeNumericId(contract.id_sede)
  contractForm.estado_contrato = contract.estado_contrato || 'Activo'
  contractDialog.value = true
}

function openRenewDialog(contract: any) {
  editingContract.value = null
  renewalSourceContract.value = contract
  resetContractForm()

  contractForm.id_tipo_contrato = normalizeNumericId(contract.id_tipo_contrato)
  contractForm.id_area = normalizeNumericId(contract.id_area)
  contractForm.id_cargo = normalizeNumericId(contract.id_cargo)
  contractForm.id_sede = normalizeNumericId(contract.id_sede)
  contractForm.salario = contract.salario ? String(contract.salario) : ''
  contractForm.fecha_inicio = addDaysToIsoDate(contract.fecha_fin || contract.fecha_inicio, 1)
  contractForm.fecha_fin = contract.fecha_fin
    ? addDaysToIsoDate(contract.fecha_fin, Math.max(1, getContractDurationDays(contract.fecha_inicio, contract.fecha_fin)))
    : ''
  contractForm.estado_contrato = resolveRenewalDefaultState(contract)
  contractDialog.value = true
}

function buildContractPayload() {
  const normalizedState = normalizeContractState(
    contractForm.estado_contrato,
    contractForm.fecha_inicio,
    contractForm.fecha_fin,
  )

  return {
    id_tipo_contrato: contractForm.id_tipo_contrato,
    id_area: contractForm.id_area,
    id_cargo: contractForm.id_cargo,
    salario: contractForm.salario === '' ? null : Number(contractForm.salario),
    fecha_inicio: contractForm.fecha_inicio,
    fecha_fin: contractForm.fecha_fin || null,
    id_sede: contractForm.id_sede,
    estado_contrato: normalizedState,
  }
}

function normalizeContractState(currentState: string, fechaInicio?: string | null, fechaFin?: string | null) {
  if (currentState === 'Borrador' || currentState === 'Finalizado') {
    return currentState
  }

  if (fechaFin && fechaFin < todayIso.value) {
    return 'Vencido'
  }

  if (!hasActiveContract.value && currentState !== 'Vencido') {
    return 'Activo'
  }

  return currentState || 'Borrador'
}

async function saveContract() {
  if (!contractForm.id_tipo_contrato || !contractForm.id_area || !contractForm.id_cargo || !contractForm.id_sede || !contractForm.fecha_inicio) {
    $q.notify({ type: 'warning', message: 'Completa tipo, area, cargo, sede y fecha de inicio' })
    return
  }

  savingContract.value = true

  try {
    const payload = buildContractPayload()

    if (editingContract.value) {
      await contratosService.updateContrato(props.empleadoId, Number(editingContract.value.id_contrato), payload)
      $q.notify({ type: 'positive', message: 'Contrato actualizado correctamente' })
    } else {
      await contratosService.createContrato(props.empleadoId, payload)
      $q.notify({
        type: 'positive',
        message: renewalSourceContract.value ? 'Renovación registrada correctamente' : 'Contrato registrado correctamente',
      })
    }

    contractDialog.value = false
    renewalSourceContract.value = null
    editingContract.value = null
    emit('refresh')
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'No se pudo guardar el contrato',
    })
  } finally {
    savingContract.value = false
  }
}

function confirmFinalize(contract: any) {
  $q.dialog({
    title: 'Finalizar contrato',
    message: `Se marcara como finalizado el contrato de ${contract.cargo?.nombre_cargo || 'este funcionario'}.`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await contratosService.finalizarContrato(props.empleadoId, Number(contract.id_contrato), {
        fecha_fin: new Date().toISOString().slice(0, 10),
      })
      $q.notify({ type: 'positive', message: 'Contrato finalizado correctamente' })
      emit('refresh')
    } catch (error: any) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'No se pudo finalizar el contrato',
      })
    }
  })
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

function buildPortalPath(raw?: string | null) {
  return buildSigethPortalFileUrl(stripFilePath(raw))
}

function openVersion(version: any) {
  const url = buildPortalPath(version?.ruta_archivo)
  if (!url) {
    $q.notify({ type: 'negative', message: 'No se pudo abrir la versión del contrato' })
    return
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}

function openUploadSignedDialog(contract: any) {
  selectedSignedContract.value = contract
  signedFile.value = null
  signedDialog.value = true
}

async function uploadSignedContract() {
  if (!selectedSignedContract.value || !signedFile.value) {
    $q.notify({ type: 'warning', message: 'Selecciona un archivo firmado para continuar' })
    return
  }

  uploadingSigned.value = true

  try {
    await contratosService.uploadFirmado(props.empleadoId, Number(selectedSignedContract.value.id_contrato), signedFile.value)
    $q.notify({ type: 'positive', message: 'Contrato firmado subido y versionado correctamente' })
    signedDialog.value = false
    await loadVersions(Number(selectedSignedContract.value.id_contrato))
    emit('refresh')
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'No se pudo subir el contrato firmado',
    })
  } finally {
    uploadingSigned.value = false
  }
}

async function generatePreview() {
  if (!selectedContractId.value) return

  previewLoading.value = true
  try {
    const result = selectedTemplate.value === 'indefinido'
      ? await contratosService.previewIndefinido(props.empleadoId, buildPreviewPayload())
      : await contratosService.previewPlazoFijo(props.empleadoId, buildPreviewPayload())
    previewHtml.value = result.html
    previewDialog.value = true
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'No se pudo generar la vista previa del contrato',
    })
  } finally {
    previewLoading.value = false
  }
}

async function downloadPdf() {
  if (!selectedContractId.value) return

  downloadLoading.value = true
  try {
    const response = selectedTemplate.value === 'indefinido'
      ? await contratosService.descargarIndefinido(props.empleadoId, buildPreviewPayload())
      : await contratosService.descargarPlazoFijo(props.empleadoId, buildPreviewPayload())
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.download = buildDownloadFilename()
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    $q.notify({
      type: 'positive',
      message: 'Contrato generado y guardado en su historial y legajo digital',
    })
    await loadVersions(Number(selectedContractId.value))
    emit('refresh')
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'No se pudo descargar el contrato',
    })
  } finally {
    downloadLoading.value = false
  }
}

function formatDate(value?: string | null) {
  if (!value) return ''
  return new Date(value).toLocaleString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateOnly(value?: string | null) {
  const normalized = normalizeDateInput(value)
  if (!normalized) return ''
  const [year, month, day] = normalized.split('-')
  return `${day}/${month}/${year}`
}

function normalizeDateInput(value?: string | null) {
  if (!value) return ''
  const raw = String(value).trim()
  const isoMatch = raw.match(/^(\d{4}-\d{2}-\d{2})/)
  if (isoMatch) {
    return isoMatch[1]
  }

  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) {
    return ''
  }

  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.card-premium {
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;
}

.bg-slate-50 { background: #f8fafc; }
.rounded-12 { border-radius: 12px; }
.rounded-16 { border-radius: 16px; }
.text-primary { color: #6A37A3 !important; }

.empty-contracts {
  border: 1px dashed #cbd5e1;
  background: #f8fafc;
}

.contract-card-compact {
  border: 1px solid #e2e8f0;
}

.contract-table-wrap {
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}

.contract-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 980px;
  background: #fff;
}

.contract-table th,
.contract-table td {
  padding: 12px 14px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
  text-align: left;
}

.contract-table th {
  background: #f8fafc;
  color: #475569;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.contract-table__row {
  cursor: pointer;
}

.contract-table__row:hover {
  background: #faf5ff;
}

.contract-table__row--selected {
  background: #f5f3ff;
}

.contract-table__detail td {
  background: #fcfcff;
}

.version-row {
  padding: 8px 10px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
}

.contract-dialog {
  width: 760px;
  max-width: 92vw;
  border-radius: 20px;
}

.preview-dialog {
  height: 92vh;
  display: flex;
  flex-direction: column;
}

.preview-dialog__body {
  flex: 1;
  min-height: 0;
}

.preview-dialog__frame {
  width: 100%;
  height: 100%;
  border: 0;
  background: #f8fafc;
}
</style>
