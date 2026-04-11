<template>
  <div class="row q-col-gutter-lg q-mt-lg">
    <div class="col-12 col-xl-5">
      <div class="card-premium q-pa-xl">
        <div class="text-h6 q-mb-xl text-weight-bold text-grey-9 row items-center">
          <q-icon name="work_history" color="primary" class="q-mr-sm" />
          Historial de Contrataciones
        </div>

        <q-timeline color="primary">
          <q-timeline-entry
            v-for="contract in contratos"
            :key="contract.id_contrato"
            :title="contract.cargo?.nombre_cargo || 'Investigador / Funcionario'"
            :subtitle="buildContractSubtitle(contract)"
            :color="contract.estado_contrato === 'Activo' ? 'positive' : 'grey-5'"
            icon="history_edu"
          >
            <div class="contract-card-compact bg-slate-50 q-pa-md rounded-12 row items-center">
              <div class="column col">
                <div class="text-weight-bold text-primary">{{ contract.area?.nombre_area || 'Sin area' }}</div>
                <div class="text-caption text-grey-7">{{ contract.sede?.nombre || 'Sin sede' }}</div>
              </div>
              <div class="column items-end">
                <q-badge
                  :color="contract.estado_contrato === 'Activo' ? 'green-2' : 'grey-3'"
                  :text-color="contract.estado_contrato === 'Activo' ? 'green-9' : 'grey-8'"
                  class="q-pa-sm text-weight-bold"
                >
                  {{ contract.estado_contrato }}
                </q-badge>
                <div class="text-caption text-weight-bold text-grey-9 q-mt-xs">
                  {{ formatSalaryBadge(contract.salario) }}
                </div>
              </div>
            </div>
          </q-timeline-entry>
        </q-timeline>
      </div>
    </div>

    <div class="col-12 col-xl-7">
      <div class="card-premium q-pa-xl">
        <div class="row items-start justify-between q-col-gutter-md q-mb-lg">
          <div class="col-12 col-md">
            <div class="text-h6 text-weight-bold text-grey-9 row items-center">
              <q-icon name="description" color="primary" class="q-mr-sm" />
              Generador de Contrato a Plazo Fijo
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Usa un contrato existente como base. Aqui eliges fechas y remuneracion numerica, y el sistema arma la parte literal.
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
          <div class="text-subtitle1 text-weight-medium">No hay contratos registrados todavia</div>
          <div class="text-caption q-mt-sm">
            Cuando el funcionario tenga contratos cargados, aqui podras generar automaticamente el contrato de plazo fijo.
          </div>
        </div>

        <template v-else>
          <div class="row q-col-gutter-md">
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
            <div class="col-12 col-md-6">
              <q-input v-model="form.fechaFin" label="Fecha de fin" outlined dense type="date" />
            </div>

            <div class="col-12 col-md-6">
              <q-input :model-value="computedDuracionLiteral" label="Duracion calculada" outlined dense readonly />
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
              <q-input
                :model-value="computedSalarioLiteral"
                label="Remuneracion literal"
                outlined
                dense
                readonly
              />
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
                label="Texto de remuneracion"
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

  <q-dialog v-model="previewDialog" maximized>
    <q-card class="preview-dialog">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>
          Vista previa del contrato
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
import { computed, reactive, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import contratosService from 'src/modules/contratos/services/contratos.service'

interface Props {
  contratos: any[]
  empleadoId: number
  empleadoNombre?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['refresh'])
const $q = useQuasar()

const selectedContractId = ref<number | null>(null)
const previewDialog = ref(false)
const previewLoading = ref(false)
const downloadLoading = ref(false)
const previewHtml = ref('')

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

const computedDuracionLiteral = computed(() => buildDuracionLiteral(form.fechaInicio, form.fechaFin))
const computedSalarioLiteral = computed(() => buildSalaryLiteral(form.salarioNumeral))

const contractOptions = computed(() =>
  props.contratos.map((contract) => ({
    label: [
      contract.cargo?.nombre_cargo || 'Contrato',
      contract.tipo_contrato?.nombre_tipo_contrato || contract.estado_contrato || '',
      buildContractSubtitle(contract),
    ]
      .filter(Boolean)
      .join(' · '),
    value: Number(contract.id_contrato),
  })),
)

const selectedContract = computed(() =>
  props.contratos.find((contract) => Number(contract.id_contrato) === selectedContractId.value) || null,
)

watch(
  () => props.contratos,
  (contracts) => {
    if (!contracts.length) {
      selectedContractId.value = null
      return
    }

    const currentStillExists = contracts.some(
      (contract) => Number(contract.id_contrato) === selectedContractId.value,
    )

    if (!currentStillExists) {
      const preferred = contracts.find((contract) => contract.estado_contrato === 'Activo') || contracts[0]
      selectedContractId.value = Number(preferred.id_contrato)
    }
  },
  { immediate: true },
)

watch(
  selectedContract,
  (contract) => {
    if (contract) {
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

function buildContractSubtitle(contract: any) {
  const inicio = contract.fecha_inicio || 'Sin inicio'
  const fin = contract.fecha_fin || 'Presente'
  return `${inicio} - ${fin}`
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

  let months = 0
  const cursor = new Date(start)

  while (true) {
    const next = new Date(cursor)
    next.setMonth(next.getMonth() + 1)

    if (next <= end) {
      months += 1
      cursor.setMonth(cursor.getMonth() + 1)
    } else {
      break
    }
  }

  const diffMs = end.getTime() - cursor.getTime()
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
    0: 'cero',
    1: 'un',
    2: 'dos',
    3: 'tres',
    4: 'cuatro',
    5: 'cinco',
    6: 'seis',
    7: 'siete',
    8: 'ocho',
    9: 'nueve',
    10: 'diez',
    11: 'once',
    12: 'doce',
    13: 'trece',
    14: 'catorce',
    15: 'quince',
    16: 'dieciseis',
    17: 'diecisiete',
    18: 'dieciocho',
    19: 'diecinueve',
    20: 'veinte',
    21: 'veintiun',
    22: 'veintidos',
    23: 'veintitres',
    24: 'veinticuatro',
    25: 'veinticinco',
    26: 'veintiseis',
    27: 'veintisiete',
    28: 'veintiocho',
    29: 'veintinueve',
  }

  const tens: Record<number, string> = {
    30: 'treinta',
    40: 'cuarenta',
    50: 'cincuenta',
    60: 'sesenta',
    70: 'setenta',
    80: 'ochenta',
    90: 'noventa',
  }

  const hundreds: Record<number, string> = {
    100: 'cien',
    200: 'doscientos',
    300: 'trescientos',
    400: 'cuatrocientos',
    500: 'quinientos',
    600: 'seiscientos',
    700: 'setecientos',
    800: 'ochocientos',
    900: 'novecientos',
  }

  if (number < 30) {
    return units[number]
  }

  if (number < 100) {
    const ten = Math.floor(number / 10) * 10
    const rest = number % 10
    return rest === 0 ? tens[ten] : `${tens[ten]} y ${numberToWords(rest)}`
  }

  if (number < 1000) {
    if (number === 100) {
      return 'cien'
    }

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
  if (!value) {
    return ''
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}

function buildLugarTrabajo(contract: any) {
  const sede = contract?.sede?.nombre
  if (!sede) {
    return ''
  }

  return sede.toLowerCase().startsWith('campus') ? `el ${sede}` : `la ciudad de ${sede}`
}

function splitMultiline(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function applySuggestedValues(contract: any) {
  form.fechaInicio = contract.fecha_inicio || ''
  form.fechaFin = contract.fecha_fin || ''
  form.lugarTrabajo = buildLugarTrabajo(contract)
  form.cargaHorariaNumeral = '48'
  form.salarioNumeral = String(contract.salario ?? '')
  form.remuneracionTexto = ''
  form.ciudadFirma = contract?.sede?.nombre || 'Cochabamba'
  form.fechaFirma = contract.fecha_inicio || ''
  form.notaHoraria =
    'Toda vez que existen cuatro (4) horas adicionales, estas seran utilizadas durante cada semana previo acuerdo de partes y bajo supervision e instruccion de su inmediato superior.'
  form.horariosText = [
    'De lunes a viernes de 07:45 a 12:30 y de 14:30 a 18:30',
    'Sabados de 08:15 a 12:30.',
  ].join('\n')
  form.funcionesText = [
    'Planificacion de la gestion academica.',
    'Seguimiento de la gestion planificada.',
    'Cumplir con las demas funciones que sean asignadas por su inmediato superior.',
  ].join('\n')
}

function buildPayload() {
  return {
    id_contrato: selectedContractId.value,
    overrides: {
      contrato: {
        fecha_inicio: form.fechaInicio || null,
        fecha_fin: form.fechaFin || null,
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

async function generatePreview() {
  if (!selectedContractId.value) {
    return
  }

  previewLoading.value = true

  try {
    const result = await contratosService.previewPlazoFijo(props.empleadoId, buildPayload())
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
  if (!selectedContractId.value) {
    return
  }

  downloadLoading.value = true

  try {
    const response = await contratosService.descargarPlazoFijo(props.empleadoId, buildPayload())
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `contrato_plazo_fijo_${props.empleadoId}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    $q.notify({
      type: 'positive',
      message: 'Contrato generado y guardado en su Historial y Legajo Digital'
    })
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
