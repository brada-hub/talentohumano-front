<template>
  <q-page class="sigeth-page">
    <div class="page-hero">
      <div class="page-hero__left">
        <div class="page-hero__title">Recordatorios</div>
        <div class="page-hero__subtitle">
          Cumpleaños, aniversarios laborales, contratos por vencer y seguimiento de envíos.
        </div>
      </div>
    </div>

    <q-card flat bordered class="filters-card q-mt-md">
      <q-card-section class="filters-card__section">
        <div class="filters-card__header">
          <div>
            <div class="filters-card__title">Filtros</div>
            <div class="filters-card__subtitle">
              Refina la agenda por mes, sede o área para revisar eventos específicos.
            </div>
          </div>
          <div class="filters-card__actions">
            <q-btn
              unelevated
              color="primary"
              icon="search"
              label="Aplicar"
              :loading="store.loading"
              @click="applyFilters"
            />
            <q-btn
              flat
              color="primary"
              icon="restart_alt"
              label="Limpiar"
              :disable="store.loading"
              @click="resetFilters"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mt-sm">
          <div class="col-12 col-md-4">
            <q-select
              v-model="localFilters.mes"
              label="Mes de referencia"
              outlined
              emit-value
              map-options
              :options="catalogos.meses"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="localFilters.id_sede"
              label="Sede"
              outlined
              emit-value
              map-options
              clearable
              :options="catalogos.sedes"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="localFilters.id_area"
              label="Área"
              outlined
              emit-value
              map-options
              clearable
              :options="catalogos.areas"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12 col-sm-6 col-lg-3">
        <q-card flat bordered class="summary-card">
          <q-card-section>
            <div class="summary-card__label">Cumpleaños de hoy</div>
            <div class="summary-card__value">{{ resumen.cumpleanios.hoy.length }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card flat bordered class="summary-card">
          <q-card-section>
            <div class="summary-card__label">Cumpleaños del mes</div>
            <div class="summary-card__value">{{ resumen.cumpleanios.mes.length }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card flat bordered class="summary-card">
          <q-card-section>
            <div class="summary-card__label">Aniversarios del mes</div>
            <div class="summary-card__value">{{ resumen.aniversarios.mes.length }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <q-card flat bordered class="summary-card">
          <q-card-section>
            <div class="summary-card__label">Contratos del mes</div>
            <div class="summary-card__value">{{ resumen.contratos_por_vencer.mes.length }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="q-mt-lg">
      <q-tabs v-model="tab" align="left" class="text-primary">
        <q-tab name="cumpleanios" icon="cake" label="Cumpleaños" />
        <q-tab name="aniversarios" icon="celebration" label="Aniversarios" />
        <q-tab name="contratos" icon="event_busy" label="Contratos por vencer" />
        <q-tab name="enviados" icon="mail" label="Historial de envíos" />
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

<style scoped>
.filters-card,
.summary-card,
.recordatorio-card,
.history-card {
  border-radius: 18px;
}

.filters-card__section {
  padding: 18px 20px;
}

.filters-card__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.filters-card__title {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
}

.filters-card__subtitle {
  margin-top: 4px;
  font-size: 13px;
  color: #64748b;
}

.filters-card__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.summary-card {
  background: linear-gradient(180deg, #ffffff 0%, #faf7ff 100%);
}

.summary-card__label {
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
}

.summary-card__value {
  margin-top: 8px;
  color: #6a37a3;
  font-size: 34px;
  font-weight: 800;
  line-height: 1;
}

.recordatorio-card {
  height: 100%;
  border: 1px solid #e9e3f4;
  background: #fff;
  overflow: hidden;
}

.recordatorio-card__header {
  padding: 18px 18px 14px;
  border-bottom: 1px solid #f1edf7;
}

.recordatorio-card__title {
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
}

.recordatorio-card__subtitle {
  font-size: 12px;
  color: #64748b;
}

.recordatorio-card__list {
  display: flex;
  flex-direction: column;
}

.recordatorio-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-top: 1px solid #f8f4fc;
}

.recordatorio-item__body {
  min-width: 0;
}

.recordatorio-item__name {
  font-weight: 700;
  color: #0f172a;
}

.recordatorio-item__caption,
.recordatorio-item__meta {
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
}

.recordatorio-item__badge {
  align-self: center;
  white-space: nowrap;
  background: #f3eff8;
  color: #6a37a3;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 12px;
  border-radius: 999px;
}

.recordatorio-item__action {
  margin-top: 10px;
  padding: 8px 12px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, #6a37a3 0%, #22c1d6 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.recordatorio-item__action:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.recordatorio-card__empty {
  padding: 36px 20px;
  color: #94a3b8;
  text-align: center;
  font-size: 13px;
}

.history-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.history-card__title {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
}

.history-card__subtitle {
  margin-top: 4px;
  font-size: 13px;
  color: #64748b;
}

.history-item {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 20px;
  border-top: 1px solid #f1edf7;
}

.history-item__body {
  min-width: 0;
}

.history-item__title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.history-item__meta {
  margin-top: 6px;
  font-size: 12px;
  color: #64748b;
}

.history-item__error {
  margin-top: 6px;
  font-size: 12px;
  color: #dc2626;
}

.history-item__side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 120px;
}

.history-item__type,
.history-item__channel {
  font-size: 12px;
  color: #64748b;
}

@media (max-width: 1023px) {
  .filters-card__header,
  .recordatorio-item,
  .history-item {
    flex-direction: column;
  }

  .recordatorio-item__badge,
  .history-item__side {
    align-self: flex-start;
  }
}
</style>
