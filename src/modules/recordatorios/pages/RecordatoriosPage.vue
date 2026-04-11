<template>
  <q-page class="sigeth-page">
    <!-- Header Hero -->
    <div class="row items-center q-mb-lg animate-fade-in">
      <div class="col">
        <div class="row items-center q-gutter-x-md">
          <q-icon name="notifications_active" size="38px" class="text-primary icon-glow" />
          <div class="column">
            <h1 class="text-h5 text-weight-bolder brand-text q-my-none">Recordatorios</h1>
            <p class="text-caption text-grey-7 q-mb-none font-medium">Cumpleaños, aniversarios laborales y seguimiento de contratos</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="q-gutter-y-lg animate-slide-up">
      <q-card class="glass-card shadow-soft rounded-24 overflow-hidden border-glass">
        <q-card-section class="q-pa-md">
          <div class="row items-center justify-between q-mb-sm">
            <div class="column">
              <div class="text-subtitle2 font-bold text-indigo-9">Filtros de Búsqueda</div>
              <div class="text-caption text-grey-7" style="font-size: 11px">Refina la agenda por mes, sede o área</div>
            </div>
            <div class="row q-gutter-x-sm">
              <q-btn
                label="Aplicar"
                icon="search"
                dense
                class="btn-gradient-portal rounded-12 q-px-md text-white shadow-soft"
                style="font-size: 11px"
                :loading="store.loading"
                @click="applyFilters"
              />
              <q-btn
                flat
                dense
                color="primary"
                icon="restart_alt"
                label="Limpiar"
                class="rounded-12"
                style="font-size: 11px"
                :disable="store.loading"
                @click="resetFilters"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-4">
              <q-select
                v-model="localFilters.mes"
                label="Mes"
                outlined
                dense
                emit-value
                map-options
                :options="catalogos.meses"
                class="modern-input"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="localFilters.id_sede"
                label="Sede"
                outlined
                dense
                emit-value
                map-options
                clearable
                :options="catalogos.sedes"
                class="modern-input"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="localFilters.id_area"
                label="Área"
                outlined
                dense
                emit-value
                map-options
                clearable
                :options="catalogos.areas"
                class="modern-input"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="row q-col-gutter-sm q-mt-sm animate-slide-up" style="animation-delay: 0.1s">
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="glass-card shadow-soft rounded-24 overflow-hidden border-glass bg-gradient-purple-light">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between">
              <div class="column">
                <div class="text-caption text-indigo-9 font-bold text-uppercase" style="font-size: 9px">Cumpleaños Hoy</div>
                <div class="text-h5 font-black text-indigo-9">{{ resumen.cumpleanios.hoy.length }}</div>
              </div>
              <q-icon name="cake" size="30px" class="opacity-40 text-indigo" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="glass-card shadow-soft rounded-24 overflow-hidden border-glass bg-gradient-brand-light">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between">
              <div class="column">
                <div class="text-caption text-primary font-bold text-uppercase" style="font-size: 9px">Cumpleaños Mes</div>
                <div class="text-h5 font-black text-primary">{{ resumen.cumpleanios.mes.length }}</div>
              </div>
              <q-icon name="calendar_month" size="30px" class="opacity-40 text-primary" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="glass-card shadow-soft rounded-24 overflow-hidden border-glass bg-gradient-success-light">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between">
              <div class="column">
                <div class="text-caption text-green-9 font-bold text-uppercase" style="font-size: 9px">Aniversarios Mes</div>
                <div class="text-h5 font-black text-green-9">{{ resumen.aniversarios.mes.length }}</div>
              </div>
              <q-icon name="celebration" size="30px" class="opacity-40 text-green" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card class="glass-card shadow-soft rounded-24 overflow-hidden border-glass bg-gradient-warning-light">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between">
              <div class="column">
                <div class="text-caption text-orange-9 font-bold text-uppercase" style="font-size: 9px">Contratos Vencer</div>
                <div class="text-h5 font-black text-orange-9">{{ resumen.contratos_por_vencer.mes.length }}</div>
              </div>
              <q-icon name="event_busy" size="30px" class="opacity-40 text-orange" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="q-gutter-y-lg q-mt-lg animate-slide-up" style="animation-delay: 0.2s">
      <q-card class="glass-card shadow-soft rounded-24 overflow-hidden border-glass">
        <q-tabs
          v-model="tab"
          class="text-grey-7 bg-grey-1 q-pa-sm"
          active-color="white"
          indicator-color="transparent"
          active-class="bg-gradient-portal shadow-md text-white font-bold"
          align="left"
          no-caps
          :breakpoint="0"
        >
          <q-tab name="cumpleanios" icon="cake" label="Cumpleaños" class="rounded-16 q-mx-xs transition-hover text-weight-bold" style="min-height: 48px" />
          <q-tab name="aniversarios" icon="celebration" label="Aniversarios" class="rounded-16 q-mx-xs transition-hover text-weight-bold" style="min-height: 48px" />
          <q-tab name="contratos" icon="event_busy" label="Contratos" class="rounded-16 q-mx-xs transition-hover text-weight-bold" style="min-height: 48px" />
          <q-tab name="enviados" icon="mail" label="Historial" class="rounded-16 q-mx-xs transition-hover text-weight-bold" style="min-height: 48px" />
        </q-tabs>

        <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="cumpleanios">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-3">
              <RecordatorioListCard
                title="Hoy"
                subtitle="Personas que cumplen hoy"
                icon="today"
                :items="resumen.cumpleanios.hoy"
                empty-message="No hay cumpleaños para hoy."
                :formatter="formatCumpleanios"
                action-label="Enviar felicitación"
                :disable-action="store.sending"
                :show-action="canSendBirthday"
                :on-action="handleSendBirthday"
              />
            </div>
            <div class="col-12 col-md-3">
              <RecordatorioListCard
                title="Semana"
                subtitle="Próximos 7 días"
                icon="date_range"
                :items="resumen.cumpleanios.semana"
                empty-message="No hay cumpleaños en los próximos 7 días."
                :formatter="formatCumpleanios"
                action-label="Enviar felicitación"
                :disable-action="store.sending"
                :show-action="canSendBirthday"
                :on-action="handleSendBirthday"
              />
            </div>
            <div class="col-12 col-md-3">
              <RecordatorioListCard
                title="Mes"
                subtitle="Cumpleaños del mes seleccionado"
                icon="calendar_month"
                :items="resumen.cumpleanios.mes"
                empty-message="No hay cumpleaños en este mes."
                :formatter="formatCumpleanios"
                action-label="Enviar felicitación"
                :disable-action="store.sending"
                :show-action="canSendBirthday"
                :on-action="handleSendBirthday"
              />
            </div>
            <div class="col-12 col-md-3">
              <RecordatorioListCard
                title="Próximos"
                subtitle="Siguientes cumpleaños registrados"
                icon="upcoming"
                :items="resumen.cumpleanios.proximos"
                empty-message="No hay cumpleaños próximos registrados."
                :formatter="formatCumpleanios"
                action-label="Enviar felicitación"
                :disable-action="store.sending"
                :show-action="canSendBirthday"
                :on-action="handleSendBirthday"
              />
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="aniversarios">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-4">
              <RecordatorioListCard
                title="Hoy"
                subtitle="Aniversarios laborales de hoy"
                icon="workspace_premium"
                :items="resumen.aniversarios.hoy"
                empty-message="No hay aniversarios laborales para hoy."
                :formatter="formatAniversarios"
              />
            </div>
            <div class="col-12 col-md-4">
              <RecordatorioListCard
                title="Mes"
                subtitle="Aniversarios del mes seleccionado"
                icon="business_center"
                :items="resumen.aniversarios.mes"
                empty-message="No hay aniversarios laborales en este mes."
                :formatter="formatAniversarios"
              />
            </div>
            <div class="col-12 col-md-4">
              <RecordatorioListCard
                title="Próximos"
                subtitle="Siguientes aniversarios laborales"
                icon="event_available"
                :items="resumen.aniversarios.proximos"
                empty-message="No hay aniversarios laborales próximos."
                :formatter="formatAniversarios"
              />
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="contratos">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-3">
              <RecordatorioListCard
                title="7 días"
                subtitle="Contratos más urgentes"
                icon="priority_high"
                :items="resumen.contratos_por_vencer['7_dias']"
                empty-message="No hay contratos por vencer en 7 días."
                :formatter="formatContratos"
              />
            </div>
            <div class="col-12 col-md-3">
              <RecordatorioListCard
                title="30 días"
                subtitle="Contratos por vencer en 30 días"
                icon="schedule"
                :items="resumen.contratos_por_vencer['30_dias']"
                empty-message="No hay contratos por vencer en 30 días."
                :formatter="formatContratos"
              />
            </div>
            <div class="col-12 col-md-3">
              <RecordatorioListCard
                title="Mes"
                subtitle="Contratos del mes seleccionado"
                icon="event_note"
                :items="resumen.contratos_por_vencer.mes"
                empty-message="No hay contratos en este mes."
                :formatter="formatContratos"
              />
            </div>
            <div class="col-12 col-md-3">
              <RecordatorioListCard
                title="Próximos"
                subtitle="Siguientes contratos registrados"
                icon="article"
                :items="resumen.contratos_por_vencer.proximos"
                empty-message="No hay contratos próximos registrados."
                :formatter="formatContratos"
              />
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="enviados">
          <q-card flat bordered class="history-card">
            <q-card-section class="history-card__header">
              <div>
                <div class="history-card__title">Historial de envíos</div>
                <div class="history-card__subtitle">
                  Registro de felicitaciones y recordatorios institucionales enviados.
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section v-if="resumen.recordatorios_enviados.length" class="q-pa-none">
              <div
                v-for="item in resumen.recordatorios_enviados"
                :key="item.id_recordatorio"
                class="history-item"
              >
                <div class="history-item__body">
                  <div class="history-item__title">{{ getHistoryTitle(item) }}</div>
                  <div class="history-item__meta">{{ getHistoryMeta(item) }}</div>
                  <div v-if="item.error" class="history-item__error">{{ item.error }}</div>
                  <q-btn
                    v-if="canRetryHistory(item)"
                    flat
                    dense
                    color="primary"
                    icon="refresh"
                    label="Reenviar"
                    class="q-mt-sm"
                    :loading="store.sending"
                    @click="handleRetry(item)"
                  />
                </div>

                <div class="history-item__side">
                  <q-badge
                    :color="item.estado === 'enviado' ? 'positive' : 'negative'"
                    text-color="white"
                    class="q-mb-sm"
                  >
                    {{ item.estado === 'enviado' ? 'Enviado' : 'Fallido' }}
                  </q-badge>
                  <div class="history-item__type">{{ item.tipo }}</div>
                  <div class="history-item__channel">
                    {{ item.automatico ? 'Automático' : 'Manual' }}
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-card-section v-else class="text-center q-py-xl">
              <q-icon name="mail_lock" size="56px" color="grey-5" />
              <div class="text-h6 q-mt-md text-grey-8">Sin envíos registrados</div>
              <div class="text-body2 text-grey-6 q-mt-sm">
                Cuando se envíen felicitaciones o recordatorios, aparecerán aquí.
              </div>
            </q-card-section>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</q-page>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, reactive, ref } from 'vue'
import { Notify } from 'quasar'
import { useRecordatoriosStore } from '../stores/useRecordatoriosStore'

type RecordatorioItem = {
  id_empleado?: number
  id_contrato?: number
  nombre_completo?: string
  fecha_evento_legible?: string
  fecha_fin_legible?: string
  edad_que_cumple?: number
  anios_que_cumple?: number
  dias_restantes?: number
  cargo?: string
  area?: string
  sede?: string
  tipo_contrato?: string
}

type HistoryItem = {
  id_recordatorio: number
  id_empleado?: number
  tipo: string
  destinatario?: string | null
  asunto?: string | null
  fecha_evento?: string | null
  enviado_en?: string | null
  estado: string
  automatico: boolean
  payload?: {
    nombre_completo?: string
  } | null
  error?: string | null
}

const store = useRecordatoriosStore()
const tab = ref('cumpleanios')

const resumen = computed(() => store.resumen)
const catalogos = computed(() => resumen.value.catalogos ?? { meses: [], sedes: [], areas: [] })

const localFilters = reactive({
  mes: store.filtros.mes,
  id_sede: store.filtros.id_sede,
  id_area: store.filtros.id_area,
})

const formatCumpleanios = (item: RecordatorioItem) => ({
  title: item.nombre_completo ?? 'Sin nombre',
  caption: [item.cargo, item.area, item.sede].filter(Boolean).join(' - ') || 'Sin datos laborales',
  meta: `${item.fecha_evento_legible ?? '--/--'} · ${item.edad_que_cumple ?? 0} años`,
  badge: item.dias_restantes === 0 ? 'Hoy' : `En ${item.dias_restantes ?? 0} días`,
})

const formatAniversarios = (item: RecordatorioItem) => ({
  title: item.nombre_completo ?? 'Sin nombre',
  caption: [item.cargo, item.area, item.sede].filter(Boolean).join(' - ') || 'Sin datos laborales',
  meta: `${item.fecha_evento_legible ?? '--/--'} · ${item.anios_que_cumple ?? 0} años`,
  badge: item.dias_restantes === 0 ? 'Hoy' : `En ${item.dias_restantes ?? 0} días`,
})

const formatContratos = (item: RecordatorioItem) => ({
  title: item.nombre_completo ?? 'Sin nombre',
  caption: [item.cargo, item.area, item.sede].filter(Boolean).join(' - ') || 'Sin datos laborales',
  meta: `${item.fecha_fin_legible ?? '--/--/----'} · ${item.tipo_contrato || 'Sin tipo'}`,
  badge: `${item.dias_restantes ?? 0} días`,
})

const canSendBirthday = (item: RecordatorioItem) => (item.dias_restantes ?? -1) === 0

const applyFilters = async () => {
  store.setFiltro('mes', localFilters.mes)
  store.setFiltro('id_sede', localFilters.id_sede)
  store.setFiltro('id_area', localFilters.id_area)
  await store.fetchResumen()
}

const resetFilters = async () => {
  store.clearFiltros()
  localFilters.mes = store.filtros.mes
  localFilters.id_sede = store.filtros.id_sede
  localFilters.id_area = store.filtros.id_area
  await store.fetchResumen()
}

const handleSendBirthday = async (item: RecordatorioItem) => {
  if (!item.id_empleado) {
    Notify.create({
      type: 'negative',
      message: 'No se pudo identificar al empleado para enviar la felicitación.',
    })
    return
  }

  try {
    const response = await store.sendCumpleanios(item.id_empleado)
    Notify.create({
      type: response.success ? 'positive' : 'negative',
      message: response.message || 'Se procesó el recordatorio.',
    })
    tab.value = 'enviados'
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error?.response?.data?.message || 'No se pudo enviar la felicitación institucional.',
    })
  }
}

const canRetryHistory = (item: HistoryItem) => item.tipo === 'cumpleanios' && !!item.id_empleado

const handleRetry = async (item: HistoryItem) => {
  if (!item.id_empleado) return

  try {
    const response = await store.sendCumpleanios(item.id_empleado, true)
    Notify.create({
      type: response.success ? 'positive' : 'negative',
      message: response.message || 'Se procesó el reenvío.',
    })
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error?.response?.data?.message || 'No se pudo reenviar la felicitación.',
    })
  }
}

const getHistoryTitle = (item: HistoryItem) =>
  item.payload?.nombre_completo || item.asunto || 'Recordatorio institucional'

const getHistoryMeta = (item: HistoryItem) => {
  const parts = [
    item.destinatario,
    item.fecha_evento ? `Evento: ${formatDate(item.fecha_evento)}` : null,
    item.enviado_en ? `Enviado: ${formatDateTime(item.enviado_en)}` : null,
  ].filter(Boolean)

  return parts.join(' · ')
}

const formatDate = (value?: string | null) => {
  if (!value) return '--/--/----'

  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

const formatDateTime = (value?: string | null) => {
  if (!value) return '--/--/---- --:--'

  const normalized = value.replace(' ', 'T')
  const date = new Date(normalized)

  if (Number.isNaN(date.getTime())) return value

  return `${date.toLocaleDateString('es-BO')} ${date.toLocaleTimeString('es-BO', {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}

const RecordatorioListCard = defineComponent({
  name: 'RecordatorioListCard',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    icon: { type: String, required: true },
    items: { type: Array, required: true },
    emptyMessage: { type: String, required: true },
    formatter: { type: Function, required: true },
    actionLabel: { type: String, default: '' },
    disableAction: { type: Boolean, default: false },
    showAction: { type: Function, default: null },
    onAction: { type: Function, default: null },
  },
  setup(props) {
    return () =>
      h('div', { class: 'recordatorio-card' }, [
        h('div', { class: 'recordatorio-card__header' }, [
          h('div', { class: 'row items-center q-gutter-sm' }, [
            h('i', { class: 'q-icon notranslate material-icons text-primary', style: 'font-size: 22px;' }, props.icon),
            h('div', [
              h('div', { class: 'recordatorio-card__title' }, props.title),
              h('div', { class: 'recordatorio-card__subtitle' }, props.subtitle),
            ]),
          ]),
        ]),
        props.items.length
          ? h(
              'div',
              { class: 'recordatorio-card__list' },
              props.items.map((raw: any) => {
                const item = (props.formatter as any)(raw)
                const shouldShowAction = typeof props.showAction === 'function' ? props.showAction(raw) : false

                return h('div', { class: 'recordatorio-item', key: raw.id_empleado || raw.id_contrato || raw.nombre_completo }, [
                  h('div', { class: 'recordatorio-item__body' }, [
                    h('div', { class: 'recordatorio-item__name' }, item.title),
                    h('div', { class: 'recordatorio-item__caption' }, item.caption),
                    h('div', { class: 'recordatorio-item__meta' }, item.meta),
                    shouldShowAction && props.actionLabel && props.onAction
                      ? h(
                          'button',
                          {
                            class: 'recordatorio-item__action',
                            disabled: props.disableAction,
                            onClick: () => props.onAction(raw),
                          },
                          props.disableAction ? 'Enviando...' : props.actionLabel
                        )
                      : null,
                  ]),
                  h('div', { class: 'recordatorio-item__badge' }, item.badge),
                ])
              })
            )
          : h('div', { class: 'recordatorio-card__empty' }, props.emptyMessage),
      ])
  },
})

onMounted(async () => {
  await store.fetchResumen()
  localFilters.mes = store.filtros.mes
  localFilters.id_sede = store.filtros.id_sede
  localFilters.id_area = store.filtros.id_area
})
</script>

<style scoped lang="scss">
.border-glass {
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.brand-text {
  background: linear-gradient(90deg, #6A37A3 0%, #00A99D 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1px;
}

.icon-glow {
  filter: drop-shadow(0 0 10px rgba(106, 55, 163, 0.3));
}

.font-bold { font-weight: 700; }
.font-medium { font-weight: 500; }
.font-black { font-weight: 900; }

.rounded-12 { border-radius: 12px !important; }
.rounded-16 { border-radius: 16px !important; }
.rounded-24 { border-radius: 24px !important; }

.shadow-soft { box-shadow: 0 10px 30px rgba(0,0,0,0.03); }

/* Custom Gradients for Summary Cards */
.bg-gradient-purple-light { background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); }
.bg-gradient-brand-light { background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%); }
.bg-gradient-success-light { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); }
.bg-gradient-warning-light { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); }

/* Para forzar el ícono arriba y centrado en las pestañas */
:deep(.q-tab__content) {
  flex-direction: column !important;
  padding: 12px 24px;
}

.modern-input {
  :deep(.q-field__control) {
    border-radius: 12px !important;
    background: rgba(244, 246, 248, 0.8) !important;
  }
}

/* History Styles */
.history-item {
  transition: all 0.3s ease;
  &:hover {
    background: rgba(106, 55, 163, 0.03);
  }
}

// Animations
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Scoped adjustments for components inside defineComponent */
:deep(.recordatorio-card) {
  border-radius: 16px;
  border: 1px solid rgba(106, 55, 163, 0.1);
  ov  .recordatorio-card__header {
    background: #f8fafc;
    padding: 8px 12px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .recordatorio-card__title {
    font-weight: 800;
    color: #1e293b;
    font-size: 13px;
  }
  
  .recordatorio-card__subtitle {
    font-size: 9px;
    color: #64748b;
  }
  
  .recordatorio-item {
    padding: 8px 12px;
    border-bottom: 1px solid #f1f5f9;
    background: white;
    transition: all 0.2s ease;
    
    &:hover {
      background: #fdfbff;
    }
    
    .recordatorio-item__name {
      font-weight: 700;
      color: #0f172a;
      font-size: 12px;
    }
    
    .recordatorio-item__caption {
      font-size: 10px;
      line-height: 1.2;
    }

    .recordatorio-item__meta {
      font-size: 10px;
    }

    .recordatorio-item__badge {
      background: #f1f5f9;
      padding: 1px 8px;
      border-radius: 20px;
      font-size: 9px;
      font-weight: 800;
      color: #64748b;
    }

    .recordatorio-item__action {
      margin-top: 4px;
      width: 100%;
      border: none;
      border-radius: 6px;
      background: linear-gradient(135deg, #6A37A3 0%, #00A99D 100%);
      color: white;
      padding: 3px;
      font-weight: 700;
      cursor: pointer;
      font-size: 10px;
      transition: transform 0.2s;
      &:hover { transform: translateY(-2px); }
    }
  }
}
</style>
