<template>
  <q-page class="sigeth-page">
    
    <!-- 1. CABECERA -->
    <div class="page-hero">
      <div class="page-hero__left">
        <div class="page-hero__title">Gestión de Personal</div>
        <div class="page-hero__subtitle">
          Listado oficial de funcionarios, contratos y legajo digital.
        </div>
      </div>
      <div class="page-hero__actions row items-center q-gutter-md">
        <q-btn
          flat
          round
          color="grey-7"
          icon="link"
          @click="copiarLinkPublico"
          class="q-mr-sm"
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
        <div class="q-mx-sm">|</div>
        <q-btn unelevated rounded color="primary" icon="person_add" label="Nuevo Registro" class="q-px-lg btn-glow" @click="showDialog = true" />
      </div>
    </div>

    <!-- 2. TABLA -->
    <div class="sigeth-table-wrap q-mt-md">
      <div class="table-toolbar row items-center q-pa-md">
        <q-input
          v-model="filter"
          placeholder="Buscar por nombre o CI..."
          outlined
          rounded
          dense
          class="col-grow q-mr-md search-input"
        >
          <template #prepend>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
        <q-btn flat round icon="refresh" color="grey-6" @click="loadEmployees" :loading="loading">
          <q-tooltip>Actualizar lista</q-tooltip>
        </q-btn>
      </div>

      <q-table
        :rows="employees"
        :columns="columns"
        row-key="id_empleado"
        :filter="filter"
        :loading="loading"
        flat
        class="sigeth-table"
      >
        <!-- Slot: Nombre y CI -->
        <template v-slot:body-cell-nombre="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <q-avatar size="34px" class="q-mr-sm avatar-employee">
                <img :src="`https://ui-avatars.com/api/?name=${props.row.persona.primer_apellido}+${props.row.persona.nombres}&background=6A37A3&color=fff&bold=true`" />
              </q-avatar>
              <div class="column">
                <span class="text-weight-bold">
                  {{ props.row.persona.primer_apellido }} {{ props.row.persona.segundo_apellido }}, {{ props.row.persona.nombres }}
                </span>
                <span class="text-caption text-grey-6">CI: {{ props.row.persona.ci }}</span>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Slot: Cargo y Unidad (usa contrato_activo en snake_case) -->
        <template v-slot:body-cell-cargo="props">
          <q-td :props="props">
            <template v-if="props.row.contrato_activo">
              <div class="text-weight-medium">{{ props.row.contrato_activo.cargo.nombre_cargo }}</div>
              <div class="text-caption text-secondary">{{ props.row.contrato_activo.area.nombre_area }}</div>
            </template>
            <span v-else class="text-caption text-grey-6 text-italic">Sin contrato activo</span>
          </q-td>
        </template>

        <!-- Slot: Estado -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              dense
              :color="props.row.estado_laboral === 'Activo' ? 'positive' : 'grey-7'"
              text-color="white"
              size="sm"
              class="text-weight-bold"
            >
              {{ props.row.estado_laboral || 'N/A' }}
            </q-chip>
          </q-td>
        </template>

        <!-- Slot: Acciones -->
        <!-- Slot: Acciones -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" auto-width>
            <q-btn flat round dense color="primary" icon="visibility" :to="`/personal/${props.row.id_empleado}`"><q-tooltip>Ver Detalle</q-tooltip></q-btn>
            <q-btn flat round dense color="deep-purple" icon="school" @click="generarOnboarding(props.row.persona.id)"><q-tooltip>Habilitar Registro (Onboarding)</q-tooltip></q-btn>
            <q-btn flat round dense color="negative" icon="delete" @click="confirmDelete(props.row)"><q-tooltip>Eliminar</q-tooltip></q-btn>
          </q-td>
        </template>

        <!-- Estado vacío -->
        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey-6 q-gutter-sm q-pa-xl">
            <q-icon name="people_outline" size="40px" />
            <span class="text-subtitle1">No hay funcionarios registrados</span>
          </div>
        </template>
      </q-table>
    </div>

    <!-- Dialog de Registro -->
    <RegistroEmpleadoDialog v-model="showDialog" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePersonalStore } from 'stores/personalStore'
import { QTableColumn } from 'quasar'
import { Loading, useQuasar, copyToClipboard } from 'quasar'
import RegistroEmpleadoDialog from 'components/RegistroEmpleadoDialog.vue'
import { api } from 'boot/axios'

const $q = useQuasar()
const personalStore = usePersonalStore()
const filter = ref('')
const showDialog = ref(false)
const loading = computed(() => personalStore.loading)
const employees = computed(() => personalStore.employees)
const onboardingEnabled = ref(false)

const columns: QTableColumn[] = [
  { name: 'nombre', label: 'Funcionario', field: 'id_empleado', align: 'left' },
  { name: 'cargo', label: 'Cargo / Unidad', field: 'id_empleado', align: 'left' },
  { name: 'status', label: 'Estado', field: 'estado_laboral', align: 'center' },
  { name: 'actions', label: 'Acciones', field: 'id_empleado', align: 'right' }
]

const loadEmployees = () => {
  personalStore.fetchEmployees()
}

const loadPortalStatus = async () => {
  try {
    const { data } = await api.get('/onboarding/status')
    onboardingEnabled.value = data.enabled
  } catch { console.error('Error cargando estado portal') }
}

const togglePortal = async (val: boolean) => {
  try {
    await api.post('/onboarding/toggle', { enabled: val })
    $q.notify({
      type: val ? 'positive' : 'warning',
      message: val ? '¡Portal de Onboarding Habilitado!' : '¡Portal de Onboarding DESACTIVADO!',
      position: 'top'
    })
  } catch {
    onboardingEnabled.value = !val // revertir si falla
    $q.notify({ type: 'negative', message: 'No se pudo cambiar el estado del portal.' })
  }
}

const copiarLinkPublico = async () => {
  const url = window.location.origin + '/#/portal/verificar'
  await copyToClipboard(url)
  $q.notify({
    type: 'positive',
    message: 'Link público copiado al portapapeles',
    icon: 'content_paste'
  })
}

const generarOnboarding = async (idPersona: string) => {
  Loading.show({ message: 'Generando acceso seguro...' })
  try {
    const { data } = await api.post('/onboarding/generar-token', { id_persona: idPersona })
    await copyToClipboard(data.url)
    $q.notify({
      type: 'positive',
      message: '¡Link de registro generado y copiado al portapapeles!',
      caption: 'Ya puedes enviárselo al funcionario.',
      icon: 'content_paste'
    })
  } catch {
    $q.notify({ type: 'negative', message: 'No se pudo generar el token.' })
  } finally {
    Loading.hide()
  }
}

const confirmDelete = (row: any) => {
  $q.dialog({
    title: 'Confirmar Eliminación',
    message: `¿Estás seguro de eliminar a ${row.persona.nombres}?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    // Lógica de eliminación...
  })
}

onMounted(() => {
  loadEmployees()
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

.search-input :deep(.q-field__control) {
  background: var(--bg-card) !important;
}

.search-input :deep(.q-field__native),
.search-input :deep(.q-field__input) {
  color: var(--text-primary) !important;
}
</style>

