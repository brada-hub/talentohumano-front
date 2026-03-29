<template>
  <q-page class="sigeth-page">
    <!-- PAGE HERO -->
    <div class="page-hero">
      <div class="page-hero__left">
        <div class="page-hero__title">Gestión de Personal</div>
        <div class="page-hero__subtitle">
          Listado oficial de funcionarios · <span class="text-secondary">{{ total }} registros</span>
        </div>
      </div>
      <div class="page-hero__actions row items-center q-gutter-sm">
        <!-- Onboarding Portal Toggle -->
        <q-btn
          flat round color="grey-7" icon="link"
          @click="copiarLinkPublico"
        >
          <q-tooltip>Copiar Link Público de Registro</q-tooltip>
        </q-btn>

        <q-toggle
          v-model="onboardingEnabled"
          :label="onboardingEnabled ? 'Portal Onboarding: ACTIVO' : 'Portal Onboarding: DESACTIVADO'"
          color="positive"
          keep-color
          @update:model-value="togglePortal"
          class="text-weight-bold"
        />

        <q-separator vertical inset class="q-mx-xs" />

        <q-btn outline color="secondary" icon="download" label="Exportar" />
        <q-btn unelevated color="primary" icon="person_add" label="Nuevo Registro" :to="{ name: 'personal.create' }" class="btn-glow" />
      </div>
    </div>

    <!-- TABLE AREA -->
    <div class="sigeth-table-wrap q-mt-md">
      <div class="table-toolbar">
        <q-input
          v-model="search"
          outlined dense
          placeholder="Buscar por nombre o CI..."
          class="table-search col-grow q-mr-md"
          debounce="300"
        >
          <template #prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>

        <div class="table-toolbar__actions">
          <q-btn flat round icon="refresh" color="primary" @click="fetchData(1)" :loading="loading">
            <q-tooltip>Actualizar lista</q-tooltip>
          </q-btn>
        </div>
      </div>

      <q-table
        :rows="personas"
        :columns="columns"
        :loading="loading"
        :filter="search"
        flat
        class="sigeth-table"
        row-key="id"
        v-model:pagination="pagination"
        @request="onRequest"
      >
        <!-- LOADING -->
        <template #loading>
          <q-inner-loading showing color="primary" />
        </template>

        <!-- NAME + CI -->
        <template #body-cell-nombre="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <q-avatar size="34px" class="q-mr-sm avatar-employee">
                <img :src="`https://ui-avatars.com/api/?name=${props.row.primer_apellido}+${props.row.nombres}&background=6B4FA0&color=fff&bold=true`" />
              </q-avatar>
              <div>
                <div class="text-weight-bold">
                  {{ props.row.primer_apellido }} {{ props.row.segundo_apellido }}, {{ props.row.nombres }}
                </div>
                <div class="text-caption text-grey-6">CI: {{ props.row.ci }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <!-- STATUS -->
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip
              dense
              :color="props.row.activo ? 'positive' : 'grey-7'"
              text-color="white"
              size="sm"
              class="text-weight-bold"
            >
              {{ props.row.activo ? 'Activo' : 'Inactivo' }}
            </q-chip>
          </q-td>
        </template>

        <!-- ACTIONS -->
        <template #body-cell-actions="props">
          <q-td :props="props" auto-width>
            <q-btn flat round dense color="primary" icon="visibility" :to="`/personal/${props.row.id}`">
              <q-tooltip>Ver Detalle</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="deep-purple" icon="school" @click="generarOnboarding(props.row.id)">
              <q-tooltip>Habilitar Registro (Onboarding)</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="negative" icon="delete" @click="confirmDelete(props.row)">
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <!-- EMPTY STATE -->
        <template #no-data>
          <div class="empty-state full-width">
            <q-icon name="group_off" size="64px" color="grey-4" />
            <div class="empty-state__title">Sin registros</div>
            <div class="empty-state__subtitle">No se encontraron personas registradas en el sistema</div>
            <q-btn unelevated color="primary" label="Registrar primera persona" icon="add" class="q-mt-md" :to="{ name: 'personal.create' }" />
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePersonaStore } from '../stores/usePersonaStore'
import { useNotify } from 'src/shared/composables/useNotify'
import { QTableColumn, useQuasar, copyToClipboard, Loading } from 'quasar'
import api from 'src/shared/api/axios.instance'

const $q = useQuasar()
const store = usePersonaStore()
const notify = useNotify()
const search = ref('')
const onboardingEnabled = ref(false)

const personas = computed(() => store.personas)
const total = computed(() => store.total)
const loading = computed(() => store.loading)

const pagination = ref({
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 0,
})

const columns: QTableColumn[] = [
  { name: 'nombre', label: 'Funcionario', field: 'primer_apellido', align: 'left', sortable: true },
  { name: 'ci', label: 'C.I.', field: 'ci', align: 'left', sortable: true },
  { name: 'correo', label: 'Correo', field: 'correo_personal', align: 'left' },
  { name: 'status', label: 'Estado', field: 'activo', align: 'center' },
  { name: 'actions', label: 'Acciones', field: 'id', align: 'right' },
]

// ─── DATA ───
async function fetchData(page = 1) {
  try {
    await store.fetchPersonas(page, pagination.value.rowsPerPage)
    pagination.value.page = store.page
    pagination.value.rowsNumber = store.total
  } catch (err: any) {
    notify.error('Error al cargar personas: ' + (err.response?.data?.message || 'Error desconocido'))
  }
}

function onRequest(props: any) {
  pagination.value = props.pagination
  fetchData(props.pagination.page)
}

// ─── ONBOARDING PORTAL ───
async function loadPortalStatus() {
  try {
    const { data } = await api.get('/onboarding/status')
    onboardingEnabled.value = data.enabled
  } catch {
    console.error('Error cargando estado portal')
  }
}

async function togglePortal(val: boolean) {
  try {
    await api.post('/onboarding/toggle', { enabled: val })
    notify.success(val ? '¡Portal de Onboarding Habilitado!' : '¡Portal de Onboarding DESACTIVADO!')
  } catch {
    onboardingEnabled.value = !val
    notify.error('No se pudo cambiar el estado del portal.')
  }
}

async function copiarLinkPublico() {
  const url = window.location.origin + '/#/portal/verificar'
  await copyToClipboard(url)
  notify.success('Link público copiado al portapapeles')
}

async function generarOnboarding(idPersona: string) {
  Loading.show({ message: 'Generando acceso seguro...' })
  try {
    const { data } = await api.post('/onboarding/generar-token', { id_persona: idPersona })
    await copyToClipboard(data.url)
    $q.notify({
      type: 'positive',
      message: '¡Link de registro generado y copiado!',
      caption: 'Ya puedes enviárselo al funcionario.',
      icon: 'content_paste',
      position: 'top-right',
    })
  } catch {
    notify.error('No se pudo generar el token.')
  } finally {
    Loading.hide()
  }
}

function confirmDelete(row: any) {
  $q.dialog({
    title: 'Confirmar Eliminación',
    message: `¿Estás seguro de eliminar a ${row.nombres} ${row.primer_apellido}?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    // TODO: lógica de eliminación
  })
}

onMounted(() => {
  fetchData()
  loadPortalStatus()
})
</script>

<style lang="scss" scoped>
.btn-glow {
  box-shadow: 0 4px 15px rgba(106, 55, 163, 0.4);
  transition: box-shadow 0.3s ease;
}

.avatar-employee {
  border: 2px solid rgba(106, 55, 163, 0.3);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  color: var(--text-hint);

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-top: 16px;
  }

  &__subtitle {
    font-size: 13px;
    margin-top: 6px;
  }
}
</style>
