<template>
  <q-page class="reportes-page q-pa-lg">
    <div class="page-hero q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-primary">Reportes</div>
        <div class="text-grey-7 q-mt-xs">
          Vista ejecutiva de personal, contratos, beneficiarios, formación, legajo y recordatorios.
        </div>
      </div>

      <div class="row q-gutter-sm">
        <q-btn
          outline
          color="secondary"
          icon="table_view"
          label="Excel"
          no-caps
          :loading="exporting && exportFormat === 'excel'"
          @click="downloadReport('excel')"
        />
        <q-btn
          outline
          color="accent"
          icon="description"
          label="Word"
          no-caps
          :loading="exporting && exportFormat === 'word'"
          @click="downloadReport('word')"
        />
        <q-btn
          outline
          color="negative"
          icon="picture_as_pdf"
          label="PDF"
          no-caps
          :loading="exporting && exportFormat === 'pdf'"
          @click="downloadReport('pdf')"
        />
        <q-btn outline color="primary" icon="refresh" label="Actualizar" no-caps :loading="loading" @click="reload" />
      </div>
    </div>

    <div class="reportes-card q-pa-md q-mb-lg">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-select
            v-model="filters.mes"
            :options="monthOptions"
            label="Mes"
            outlined
            dense
            emit-value
            map-options
            @update:model-value="reload"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-select
            v-model="filters.id_sede"
            :options="sedeOptions"
            label="Sede"
            outlined
            dense
            clearable
            emit-value
            map-options
            @update:model-value="reload"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-select
            v-model="filters.id_area"
            :options="areaOptions"
            label="Área"
            outlined
            dense
            clearable
            emit-value
            map-options
            @update:model-value="reload"
          />
        </div>
      </div>

      <div class="row items-center justify-between q-mt-md q-gutter-sm">
        <div class="row q-gutter-sm">
          <q-chip dense color="primary" text-color="white">
            {{ currentTabTitle }}: {{ currentTabCount }} registro(s)
          </q-chip>
          <q-chip dense outline color="secondary">
            {{ filtersLabel }}
          </q-chip>
        </div>

        <q-btn flat color="grey-7" icon="filter_alt_off" label="Limpiar filtros" no-caps @click="resetFilters" />
      </div>
    </div>

    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-sm-6 col-xl-2" v-for="item in statCards" :key="item.label">
        <div class="reportes-stat-card">
          <div class="text-caption text-uppercase text-grey-7">{{ item.label }}</div>
          <div class="text-h4 text-weight-bold text-primary q-mt-sm">{{ item.value }}</div>
        </div>
      </div>
    </div>

    <q-tabs
      v-model="tab"
      dense
      align="left"
      class="text-primary q-mb-md"
      active-color="primary"
      indicator-color="primary"
    >
      <q-tab name="sedes" label="Personal por sede" icon="apartment" />
      <q-tab name="contratos" label="Contratos vigentes" icon="description" />
      <q-tab name="beneficiarios" label="Beneficiarios" icon="groups" />
      <q-tab name="academico" label="Académico" icon="school" />
      <q-tab name="legajo" label="Documentos faltantes" icon="folder_open" />
      <q-tab name="recordatorios" label="Recordatorios" icon="notifications_active" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated class="bg-transparent">
      <q-tab-panel name="sedes" class="q-pa-none">
        <div class="reportes-card">
          <div class="table-header">Resumen de personal activo por sede</div>
          <q-table
            flat
            :rows="dashboard?.personal_por_sede || []"
            :columns="sedeColumns"
            row-key="id_sede"
            :pagination="{ rowsPerPage: 10 }"
          />
        </div>
      </q-tab-panel>

      <q-tab-panel name="contratos" class="q-pa-none">
        <div class="column q-gutter-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <div class="reportes-mini-stat">
                <div class="mini-label">Contratos vigentes</div>
                <div class="mini-value">{{ contratosStats.total }}</div>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="reportes-mini-stat">
                <div class="mini-label">Vencen en 30 días</div>
                <div class="mini-value text-negative">{{ contratosStats.porVencer }}</div>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="reportes-mini-stat">
                <div class="mini-label">Salario promedio</div>
                <div class="mini-value">{{ contratosStats.salarioPromedio }}</div>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="reportes-mini-stat">
                <div class="mini-label">Sedes cubiertas</div>
                <div class="mini-value">{{ contratosStats.sedes }}</div>
              </div>
            </div>
          </div>

          <div class="reportes-card">
            <div class="table-header">Contratos vigentes con filtros aplicados</div>
            <q-table
              flat
              :rows="dashboard?.contratos_vigentes || []"
              :columns="contratosColumns"
              row-key="id_contrato"
              :pagination="{ rowsPerPage: 10 }"
            >
              <template #body-cell-vigencia="props">
                <q-td :props="props">
                  <q-badge
                    :color="contratoVigenciaColor(props.row.dias_restantes)"
                    text-color="white"
                    class="text-weight-medium"
                  >
                    {{ contratoVigenciaLabel(props.row.dias_restantes) }}
                  </q-badge>
                </q-td>
              </template>
              <template #body-cell-salario="props">
                <q-td :props="props" class="text-weight-bold">
                  {{ formatCurrency(props.row.salario) }}
                </q-td>
              </template>
              <template #body-cell-fecha_inicio="props">
                <q-td :props="props">{{ formatDate(props.row.fecha_inicio) }}</q-td>
              </template>
              <template #body-cell-fecha_fin="props">
                <q-td :props="props">{{ formatDate(props.row.fecha_fin) }}</q-td>
              </template>
              <template #body-cell-correo_institucional="props">
                <q-td :props="props">
                  <span class="text-caption">{{ props.row.correo_institucional || 'Sin correo institucional' }}</span>
                </q-td>
              </template>
            </q-table>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="beneficiarios" class="q-pa-none">
        <div class="reportes-card">
          <div class="table-header">Resumen de beneficiarios por funcionario</div>
          <q-table
            flat
            :rows="dashboard?.beneficiarios || []"
            :columns="beneficiariosColumns"
            row-key="id_empleado"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template #body-cell-beneficiarios="props">
              <q-td :props="props">
                <div class="column q-gutter-xs">
                  <div v-for="item in props.row.beneficiarios" :key="`${props.row.id_empleado}-${item.nombre_completo}`">
                    <q-badge color="primary" outline>
                      {{ item.parentesco }}: {{ item.nombre_completo }}
                    </q-badge>
                  </div>
                </div>
              </q-td>
            </template>
          </q-table>
        </div>
      </q-tab-panel>

      <q-tab-panel name="academico" class="q-pa-none">
        <div class="reportes-card">
          <div class="table-header">Carga académica y méritos registrados</div>
          <q-table
            flat
            :rows="dashboard?.academico || []"
            :columns="academicoColumns"
            row-key="id_empleado"
            :pagination="{ rowsPerPage: 10 }"
          />
        </div>
      </q-tab-panel>

      <q-tab-panel name="legajo" class="q-pa-none">
        <div class="column q-gutter-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <div class="reportes-mini-stat">
                <div class="mini-label">Con observaciones</div>
                <div class="mini-value">{{ legajoStats.total }}</div>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="reportes-mini-stat">
                <div class="mini-label">Severidad alta</div>
                <div class="mini-value text-negative">{{ legajoStats.alta }}</div>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="reportes-mini-stat">
                <div class="mini-label">Severidad media</div>
                <div class="mini-value text-warning">{{ legajoStats.media }}</div>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="reportes-mini-stat">
                <div class="mini-label">Cobertura promedio</div>
                <div class="mini-value">{{ legajoStats.coberturaPromedio }}</div>
              </div>
            </div>
          </div>

          <div class="reportes-card">
            <div class="table-header">Categorías faltantes del legajo</div>
            <q-table
              flat
              :rows="dashboard?.documentos_faltantes || []"
              :columns="legajoColumns"
              row-key="id_empleado"
              :pagination="{ rowsPerPage: 10 }"
            >
              <template #body-cell-severidad="props">
                <q-td :props="props">
                  <q-badge
                    :color="legajoSeverityColor(props.row.severidad)"
                    text-color="white"
                    class="text-weight-medium"
                  >
                    {{ props.row.severidad }}
                  </q-badge>
                </q-td>
              </template>
              <template #body-cell-cobertura_porcentaje="props">
                <q-td :props="props">
                  <div class="row items-center no-wrap q-gutter-sm">
                    <div class="text-weight-bold">{{ props.row.cobertura_porcentaje }}%</div>
                    <q-linear-progress
                      rounded
                      size="8px"
                      :value="(props.row.cobertura_porcentaje || 0) / 100"
                      :color="legajoCoverageColor(props.row.cobertura_porcentaje)"
                      class="legajo-progress"
                    />
                  </div>
                </q-td>
              </template>
              <template #body-cell-total_faltantes="props">
                <q-td :props="props" class="text-weight-bold">
                  {{ props.row.total_faltantes }}/{{ props.row.total_requeridas }}
                </q-td>
              </template>
              <template #body-cell-categorias_faltantes="props">
                <q-td :props="props">
                  <div class="row q-gutter-xs">
                    <q-chip
                      v-for="item in props.row.categorias_faltantes"
                      :key="`${props.row.id_empleado}-${item}`"
                      dense
                      :color="legajoSeverityColor(props.row.severidad)"
                      text-color="white"
                    >
                      {{ item }}
                    </q-chip>
                  </div>
                </q-td>
              </template>
            </q-table>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="recordatorios" class="q-pa-none">
        <div class="column q-gutter-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <div class="reportes-mini-stat">
                <div class="mini-label">Eventos próximos</div>
                <div class="mini-value">{{ recordatoriosStats.total }}</div>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="reportes-mini-stat">
                <div class="mini-label">En 7 días</div>
                <div class="mini-value text-primary">{{ recordatoriosStats.proximosSiete }}</div>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="reportes-mini-stat">
                <div class="mini-label">Cumpleaños</div>
                <div class="mini-value">{{ recordatoriosStats.cumpleanios }}</div>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="reportes-mini-stat">
                <div class="mini-label">Aniversarios</div>
                <div class="mini-value">{{ recordatoriosStats.aniversarios }}</div>
              </div>
            </div>
          </div>

          <div class="recordatorio-banner reportes-card q-pa-md">
            <div class="text-subtitle1 text-weight-bold text-primary">Próximo evento institucional</div>
            <div v-if="recordatoriosStats.proximoEvento" class="q-mt-sm">
              <div class="text-h6 text-weight-bold">{{ recordatoriosStats.proximoEvento.nombre_completo }}</div>
              <div class="text-grey-7">
                {{ recordatoriosStats.proximoEvento.tipo }} · {{ recordatoriosStats.proximoEvento.sede || 'Sin sede' }} ·
                {{ formatDate(recordatoriosStats.proximoEvento.proxima_fecha) }}
              </div>
              <div class="text-caption q-mt-xs">
                Faltan {{ recordatoriosStats.proximoEvento.dias_restantes }} día(s)
              </div>
            </div>
            <div v-else class="text-grey-6 q-mt-sm">No hay eventos próximos en los siguientes 30 días.</div>
          </div>

          <div class="row q-col-gutter-lg">
            <div class="col-12 col-lg-6">
              <div class="reportes-card q-pa-md fill-height">
                <div class="text-subtitle1 text-weight-bold q-mb-md">Cumpleaños próximos</div>
                <q-list separator v-if="(dashboard?.recordatorios?.cumpleanios || []).length">
                  <q-item v-for="item in dashboard?.recordatorios?.cumpleanios || []" :key="`cumple-${item.id_empleado}`">
                    <q-item-section avatar>
                      <q-avatar color="primary" text-color="white" icon="cake" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold">{{ item.nombre_completo }}</q-item-label>
                      <q-item-label caption>{{ item.sede || 'Sin sede' }} · {{ formatDate(item.proxima_fecha) }}</q-item-label>
                      <q-item-label caption>Cumple {{ item.edad_cumplida }} año(s)</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                      <q-badge color="primary">{{ item.dias_restantes }} días</q-badge>
                    </q-item-section>
                  </q-item>
                </q-list>
                <div v-else class="text-grey-6">No hay cumpleaños próximos en 30 días.</div>
              </div>
            </div>

            <div class="col-12 col-lg-6">
              <div class="reportes-card q-pa-md fill-height">
                <div class="text-subtitle1 text-weight-bold q-mb-md">Aniversarios laborales</div>
                <q-list separator v-if="(dashboard?.recordatorios?.aniversarios || []).length">
                  <q-item v-for="item in dashboard?.recordatorios?.aniversarios || []" :key="`aniv-${item.id_empleado}`">
                    <q-item-section avatar>
                      <q-avatar color="secondary" text-color="white" icon="workspace_premium" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold">{{ item.nombre_completo }}</q-item-label>
                      <q-item-label caption>{{ item.sede || 'Sin sede' }} · {{ formatDate(item.proxima_fecha) }}</q-item-label>
                      <q-item-label caption>{{ item.anios_cumplidos }} año(s) de servicio</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                      <q-badge color="secondary">{{ item.dias_restantes }} días</q-badge>
                    </q-item-section>
                  </q-item>
                </q-list>
                <div v-else class="text-grey-6">No hay aniversarios próximos en 30 días.</div>
              </div>
            </div>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { useNotify } from 'src/shared/composables/useNotify'
import { useReportesStore } from 'src/modules/reportes/stores/useReportesStore'
import type { ReporteFormat, ReporteSection } from 'src/modules/reportes/services/reportes.service'

const reportesStore = useReportesStore()
const { success } = useNotify()
const tab = ref<ReporteSection>('sedes')
const exportFormat = ref<ReporteFormat | null>(null)

const filters = reactive({
  mes: new Date().getMonth() + 1,
  id_sede: null as number | null,
  id_area: null as number | null,
})

const dashboard = computed(() => reportesStore.dashboard)
const loading = computed(() => reportesStore.loading)
const exporting = computed(() => reportesStore.exporting)

const monthOptions = [
  { label: 'Enero', value: 1 },
  { label: 'Febrero', value: 2 },
  { label: 'Marzo', value: 3 },
  { label: 'Abril', value: 4 },
  { label: 'Mayo', value: 5 },
  { label: 'Junio', value: 6 },
  { label: 'Julio', value: 7 },
  { label: 'Agosto', value: 8 },
  { label: 'Septiembre', value: 9 },
  { label: 'Octubre', value: 10 },
  { label: 'Noviembre', value: 11 },
  { label: 'Diciembre', value: 12 },
]

const sedeOptions = computed(() => dashboard.value?.catalogs?.sedes || [])
const areaOptions = computed(() => dashboard.value?.catalogs?.areas || [])

const tabLabels: Record<ReporteSection, string> = {
  sedes: 'Personal por sede',
  contratos: 'Contratos vigentes',
  beneficiarios: 'Beneficiarios',
  academico: 'Académico',
  legajo: 'Documentos faltantes',
  recordatorios: 'Recordatorios',
}

const statCards = computed(() => {
  const stats = dashboard.value?.stats || {}
  return [
    { label: 'Empleados activos', value: stats.empleados_activos || 0 },
    { label: 'Contratos activos', value: stats.contratos_activos || 0 },
    { label: 'Beneficiarios', value: stats.beneficiarios_registrados || 0 },
    { label: 'Empleados con legajo', value: stats.empleados_con_legajo || 0 },
    { label: 'Cumpleaños del mes', value: stats.cumpleanios_mes || 0 },
    { label: 'Aniversarios del mes', value: stats.aniversarios_mes || 0 },
  ]
})

const currentTabTitle = computed(() => tabLabels[tab.value])
const currentTabCount = computed(() => {
  switch (tab.value) {
    case 'sedes':
      return dashboard.value?.personal_por_sede?.length || 0
    case 'contratos':
      return dashboard.value?.contratos_vigentes?.length || 0
    case 'beneficiarios':
      return dashboard.value?.beneficiarios?.length || 0
    case 'academico':
      return dashboard.value?.academico?.length || 0
    case 'legajo':
      return dashboard.value?.documentos_faltantes?.length || 0
    case 'recordatorios':
      return (dashboard.value?.recordatorios?.cumpleanios?.length || 0) + (dashboard.value?.recordatorios?.aniversarios?.length || 0)
  }
})

const contratosStats = computed(() => {
  const rows = dashboard.value?.contratos_vigentes || []
  const total = rows.length
  const porVencer = rows.filter((item: any) => typeof item.dias_restantes === 'number' && item.dias_restantes >= 0 && item.dias_restantes <= 30).length
  const salarios = rows.map((item: any) => Number(item.salario || 0)).filter((value: number) => value > 0)
  const salarioPromedio = salarios.length ? formatCurrency(salarios.reduce((acc: number, value: number) => acc + value, 0) / salarios.length) : 'Bs. 0,00'
  const sedes = new Set(rows.map((item: any) => item.sede).filter(Boolean)).size

  return { total, porVencer, salarioPromedio, sedes }
})

const legajoStats = computed(() => {
  const rows = dashboard.value?.documentos_faltantes || []
  const total = rows.length
  const alta = rows.filter((item: any) => item.severidad === 'Alto').length
  const media = rows.filter((item: any) => item.severidad === 'Medio').length
  const coberturas = rows.map((item: any) => Number(item.cobertura_porcentaje || 0))
  const promedio = coberturas.length ? Math.round(coberturas.reduce((acc: number, value: number) => acc + value, 0) / coberturas.length) : 0

  return {
    total,
    alta,
    media,
    coberturaPromedio: `${promedio}%`,
  }
})

const recordatoriosStats = computed(() => {
  const cumpleanios = dashboard.value?.recordatorios?.cumpleanios || []
  const aniversarios = dashboard.value?.recordatorios?.aniversarios || []
  const todos = [...cumpleanios.map((item: any) => ({ ...item, tipo: 'Cumpleaños' })), ...aniversarios.map((item: any) => ({ ...item, tipo: 'Aniversario' }))]
  const proximosSiete = todos.filter((item: any) => typeof item.dias_restantes === 'number' && item.dias_restantes >= 0 && item.dias_restantes <= 7).length
  const proximoEvento = [...todos].sort((a: any, b: any) => (a.dias_restantes || 0) - (b.dias_restantes || 0))[0] || null

  return {
    total: todos.length,
    proximosSiete,
    cumpleanios: cumpleanios.length,
    aniversarios: aniversarios.length,
    proximoEvento,
  }
})

const filtersLabel = computed(() => {
  const month = monthOptions.find((item) => item.value === filters.mes)?.label || 'Todos los meses'
  const sede = sedeOptions.value.find((item: any) => item.value === filters.id_sede)?.label || 'Todas las sedes'
  const area = areaOptions.value.find((item: any) => item.value === filters.id_area)?.label || 'Todas las áreas'
  return `${month} · ${sede} · ${area}`
})

const sedeColumns: QTableColumn[] = [
  { name: 'nombre', label: 'Sede', field: 'nombre', align: 'left' },
  { name: 'total', label: 'Personal activo', field: 'total', align: 'right' },
]

const contratosColumns: QTableColumn[] = [
  { name: 'nombre_completo', label: 'Funcionario', field: 'nombre_completo', align: 'left' },
  { name: 'tipo_contrato', label: 'Tipo', field: 'tipo_contrato', align: 'left' },
  { name: 'cargo', label: 'Cargo', field: 'cargo', align: 'left' },
  { name: 'area', label: 'Área', field: 'area', align: 'left' },
  { name: 'sede', label: 'Sede', field: 'sede', align: 'left' },
  { name: 'fecha_inicio', label: 'Inicio', field: 'fecha_inicio', align: 'left' },
  { name: 'fecha_fin', label: 'Fin', field: 'fecha_fin', align: 'left' },
  { name: 'vigencia', label: 'Vigencia', field: 'dias_restantes', align: 'center' },
  { name: 'salario', label: 'Salario', field: 'salario', align: 'right' },
  { name: 'correo_institucional', label: 'Correo institucional', field: 'correo_institucional', align: 'left' },
]

const beneficiariosColumns: QTableColumn[] = [
  { name: 'nombre_completo', label: 'Funcionario', field: 'nombre_completo', align: 'left' },
  { name: 'total_beneficiarios', label: 'Total', field: 'total_beneficiarios', align: 'center' },
  { name: 'beneficiarios', label: 'Detalle', field: 'beneficiarios', align: 'left' },
]

const academicoColumns: QTableColumn[] = [
  { name: 'nombre_completo', label: 'Funcionario', field: 'nombre_completo', align: 'left' },
  { name: 'pregrado', label: 'Pregrado', field: 'pregrado', align: 'center' },
  { name: 'postgrado', label: 'Postgrado', field: 'postgrado', align: 'center' },
  { name: 'docencia', label: 'Docencia', field: 'docencia', align: 'center' },
  { name: 'experiencia_profesional', label: 'Exp. profesional', field: 'experiencia_profesional', align: 'center' },
  { name: 'capacitaciones', label: 'Capacitaciones', field: 'capacitaciones', align: 'center' },
  { name: 'total_registros', label: 'Total', field: 'total_registros', align: 'center' },
]

const legajoColumns: QTableColumn[] = [
  { name: 'nombre_completo', label: 'Funcionario', field: 'nombre_completo', align: 'left' },
  { name: 'total_faltantes', label: 'Faltantes', field: 'total_faltantes', align: 'center' },
  { name: 'cobertura_porcentaje', label: 'Cobertura', field: 'cobertura_porcentaje', align: 'left' },
  { name: 'severidad', label: 'Severidad', field: 'severidad', align: 'center' },
  { name: 'categorias_faltantes', label: 'Categorías faltantes', field: 'categorias_faltantes', align: 'left' },
]

function triggerDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

function formatDate(value: string | null | undefined) {
  if (!value) return '---'
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}

function formatCurrency(value: number | string | null | undefined) {
  const numeric = Number(value || 0)
  return `Bs. ${numeric.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function contratoVigenciaLabel(days: number | null | undefined) {
  if (days === null || days === undefined || Number.isNaN(days)) return 'Sin fecha fin'
  if (days < 0) return `Vencido ${Math.abs(days)} día(s)`
  if (days === 0) return 'Vence hoy'
  if (days <= 30) return `Vence en ${days} día(s)`
  return `${days} día(s) vigentes`
}

function contratoVigenciaColor(days: number | null | undefined) {
  if (days === null || days === undefined || Number.isNaN(days)) return 'secondary'
  if (days < 0) return 'negative'
  if (days <= 30) return 'warning'
  return 'positive'
}

function legajoSeverityColor(severity: string | null | undefined) {
  switch (severity) {
    case 'Alto':
      return 'negative'
    case 'Medio':
      return 'warning'
    case 'Bajo':
      return 'primary'
    default:
      return 'positive'
  }
}

function legajoCoverageColor(percentage: number | null | undefined) {
  const value = Number(percentage || 0)
  if (value < 40) return 'negative'
  if (value < 80) return 'warning'
  return 'positive'
}

async function reload() {
  await reportesStore.fetchDashboard({ ...filters })
}

async function downloadReport(format: ReporteFormat) {
  exportFormat.value = format

  try {
    const result = await reportesStore.exportReport(tab.value, format)
    triggerDownload(result.blob, result.filename)
    success(`Reporte exportado en ${format === 'excel' ? 'Excel' : format === 'word' ? 'Word' : 'PDF'}`)
  } finally {
    exportFormat.value = null
  }
}

async function resetFilters() {
  filters.mes = new Date().getMonth() + 1
  filters.id_sede = null
  filters.id_area = null
  await reload()
}

onMounted(async () => {
  await reload()
})
</script>

<style lang="scss" scoped>
.reportes-page {
  background: #f8fafc;
}

.page-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.reportes-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
}

.reportes-stat-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 20px;
  min-height: 120px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
}

.reportes-mini-stat {
  background: linear-gradient(180deg, #ffffff 0%, #faf7ff 100%);
  border: 1px solid #e6ddf3;
  border-radius: 16px;
  padding: 16px 18px;
  min-height: 104px;
  box-shadow: 0 4px 16px rgba(106, 55, 163, 0.06);
}

.mini-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #64748b;
}

.mini-value {
  margin-top: 10px;
  font-size: 24px;
  font-weight: 800;
  color: #4A148C;
}

.legajo-progress {
  width: 120px;
}

.recordatorio-banner {
  background: linear-gradient(135deg, #f8fbff 0%, #f7f0ff 100%);
  border: 1px solid #e1d5f4;
}

.table-header {
  padding: 18px 20px 0;
  font-size: 15px;
  font-weight: 700;
  color: #334155;
}

.fill-height {
  height: 100%;
}
</style>
