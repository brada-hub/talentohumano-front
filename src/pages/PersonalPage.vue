<template>
  <q-page class="sigeth-page">
    
    <!-- 1. CABECERA -->
    <div class="page-hero">
      <div class="page-hero__left">
        <div class="page-hero__title">Gestion de Personal</div>
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
          <q-tooltip>Copiar Link Publico de Registro</q-tooltip>
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
                  {{ [props.row.persona.primer_apellido, props.row.persona.segundo_apellido, props.row.persona.nombres].filter(Boolean).join(' ') }}
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
            <div class="row no-wrap q-gutter-xs">
              <!-- Boton principal de vista rapida en modal -->
              <q-btn unelevated rounded dense color="indigo-7" icon="person_search" @click="openQuickView(props.row, 'info')" class="q-px-sm">
                <q-tooltip>Vista R?pida</q-tooltip>
              </q-btn>
              
              <q-btn-dropdown flat round dense color="grey-7" dropdown-icon="more_vert" no-icon-animation>
                <q-list style="min-width: 200px" class="q-py-sm">
                  <q-item clickable v-close-popup @click="openQuickView(props.row, 'cv')">
                    <q-item-section avatar><q-icon name="picture_as_pdf" color="red-8" /></q-item-section>
                    <q-item-section>Hoja de Vida (CV)</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="openQuickView(props.row, 'contracts')">
                    <q-item-section avatar><q-icon name="history" color="indigo-7" /></q-item-section>
                    <q-item-section>Historial Laboral</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="openQuickView(props.row, 'legajo')">
                    <q-item-section avatar><q-icon name="receipt_long" color="orange-8" /></q-item-section>
                    <q-item-section>Legajo Digital</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup @click="generarOnboarding(props.row.persona.id)">
                    <q-item-section avatar><q-icon name="school" color="deep-purple" /></q-item-section>
                    <q-item-section>Habilitar Onboarding</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="confirmDelete(props.row)" class="text-negative">
                    <q-item-section avatar><q-icon name="delete" /></q-item-section>
                    <q-item-section>Eliminar</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </q-td>
        </template>

        <!-- Estado vacio -->
        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey-6 q-gutter-sm q-pa-xl">
            <q-icon name="people_outline" size="40px" />
            <span class="text-subtitle1">No hay funcionarios registrados</span>
          </div>
        </template>
      </q-table>
    </div>

    <!-- Boton principal de vista rapida en modal -->
    <q-dialog v-model="quickView.show" maximized persistent>
      <q-card v-if="quickView.employee" class="bg-grey-1 quick-view-card">
        <q-toolbar class="bg-gradient-portal text-white q-py-md">
          <q-avatar size="48px" class="q-mr-md shadow-2" style="border: 2px solid rgba(255,255,255,0.3)">
             <img :src="`https://ui-avatars.com/api/?name=${quickView.employee.persona.primer_apellido}+${quickView.employee.persona.nombres}&background=fff&color=6A37A3&bold=true`" />
          </q-avatar>
          <q-toolbar-title>
            <div class="text-weight-bolder text-h6">{{ quickView.employee.persona.primer_apellido }} {{ quickView.employee.persona.nombres }}</div>
            <div class="text-caption opacity-90 text-weight-bold">CI: {{ quickView.employee.persona.ci }} | {{ quickView.employee.estado_laboral }}</div>
          </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup class="bg-white/10" />
        </q-toolbar>

        <q-linear-progress v-if="quickView.loading" indeterminate color="amber" size="3px" />

        <q-tabs
          v-model="quickView.tab"
          dense
          class="bg-white text-grey-7"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="info" label="Informacion" icon="person" />
          <q-tab name="academico" label="Academico" icon="school" />
          <q-tab name="beneficios" label="Beneficiarios" icon="groups" />
          <q-tab name="cv" label="Hoja de Vida" icon="description" />
          <q-tab name="contracts" label="Contratos" icon="history" />
          <q-tab name="legajo" label="Legajo" icon="folder_shared" />
        </q-tabs>
        <q-separator />

        <q-card-section class="q-pa-none quick-view-body">
          <q-tab-panels v-model="quickView.tab" animated class="bg-transparent quick-view-panels">
            <q-tab-panel name="info" class="q-pa-md quick-view-panel-scroll">
              <PersonalInfoTab 
                :persona="quickView.employee.persona"
                :correo_institucional="quickView.employee.correo_institucional"
                :caja="quickView.employee.caja"
                :pensiones="quickView.employee.pensiones"
                :base-url="apiBaseUrl"
                :empleado-id="quickView.employee.id_empleado"
                @updated="(data) => { quickView.employee = data; loadEmployees(); }"
              />
            </q-tab-panel>
            
            <q-tab-panel name="cv" class="q-pa-none quick-view-cv-panel">
              <PersonalCvTab 
                :persona="buildCvPersona(quickView.employee, quickView.academicProfile)"
                :cargo="quickView.employee.contrato_activo?.cargo?.nombre_cargo"
                :area="quickView.employee.contrato_activo?.area?.nombre_area"
                :base-url="apiBaseUrl"
                :is-generating-pdf="isGeneratingCv"
                embedded
                @download="downloadCvPdf(quickView.employee.persona)"
              />
            </q-tab-panel>

            <q-tab-panel name="academico" class="q-pa-md quick-view-panel-scroll">
              <AcademicoManagerTab
                :profile="quickView.academicProfile"
                :loading="quickView.academicLoading"
                :persona-id="quickView.employee.persona.id"
                @refresh="refreshQuickViewAcademic"
              />
            </q-tab-panel>

            <q-tab-panel name="beneficios" class="q-pa-md quick-view-panel-scroll">
              <BeneficiariosTab :empleado-id="quickView.employee.id_empleado" />
            </q-tab-panel>

            <q-tab-panel name="contracts" class="q-pa-md quick-view-panel-scroll">
              <PersonalHistoryTab :contratos="quickView.employee.contratos" />
            </q-tab-panel>

            <q-tab-panel name="legajo" class="q-pa-md quick-view-panel-scroll">
              <PersonalLegajoTab :id-empleado="quickView.employee.id_empleado" />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog de Registro -->
    <RegistroEmpleadoDialog v-model="showDialog" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePersonalStore } from 'src/stores/personalStore'
import { QTableColumn } from 'quasar'
import { Loading, useQuasar, copyToClipboard } from 'quasar'
import RegistroEmpleadoDialog from 'components/RegistroEmpleadoDialog.vue'
import { api } from 'boot/axios'

// Sub-componentes para el modal
import PersonalInfoTab from '../modules/personal/components/PersonalInfoTab.vue'
import PersonalCvTab from '../modules/personal/components/PersonalCvTabV2.vue'
import AcademicoManagerTab from 'src/modules/academico/components/AcademicoManagerTab.vue'
import BeneficiariosTab from 'src/modules/beneficios/components/BeneficiariosTab.vue'
import PersonalHistoryTab from '../modules/personal/components/PersonalHistoryTab.vue'
import PersonalLegajoTab from '../modules/personal/components/PersonalLegajoTab.vue'

const $q = useQuasar()
const personalStore = usePersonalStore()
const filter = ref('')
const showDialog = ref(false)
const loading = computed(() => personalStore.loading)
const employees = computed(() => personalStore.employees)
const onboardingEnabled = ref(false)

// Estado para la vista rapida
const quickView = ref({
  show: false,
  tab: 'info',
  employee: null as any,
  loading: false,
  academicProfile: null as any,
  academicLoading: false
})
const isGeneratingCv = ref(false)

const apiBaseUrl = api.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:8000'

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
      message: val ? 'Portal de Onboarding habilitado' : 'Portal de Onboarding desactivado',
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
    message: 'Link p?blico copiado al portapapeles',
    icon: 'content_paste'
  })
}

const openQuickView = async (employee: any, tab: string = 'info') => {
  // Mostramos lo basico mientras carga el resto
  quickView.value.employee = JSON.parse(JSON.stringify(employee))
  quickView.value.tab = tab
  quickView.value.academicProfile = null
  quickView.value.academicLoading = false
  quickView.value.show = true
  quickView.value.loading = true
  
  // Cargamos el detalle completo para que las pesta?as de CV e historial tengan toda la info
  try {
    const details = await personalStore.fetchEmployeeById(employee.id_empleado)
    if (details) {
      quickView.value.employee = details
      if (details.persona?.id) {
        quickView.value.academicLoading = true
        quickView.value.academicProfile = await personalStore.fetchAcademicProfile(details.persona.id)
        quickView.value.academicLoading = false
      }
    }
  } catch (err) {
    console.error('Error fetching full details', err)
    quickView.value.academicLoading = false
  } finally {
    quickView.value.loading = false
  }
}

const refreshQuickViewAcademic = async () => {
  const personaId = quickView.value.employee?.persona?.id
  if (!personaId) return
  quickView.value.academicLoading = true
  quickView.value.academicProfile = await personalStore.fetchAcademicProfile(personaId)
  quickView.value.academicLoading = false
}

const buildCvPersona = (employee: any, academicProfile: any) => {
  const persona = employee?.persona || {}

  if (!academicProfile) {
    return persona
  }

  return {
    ...persona,
    formacion_pregrado: academicProfile.formacion_pregrado ?? persona.formacion_pregrado ?? [],
    formacion_postgrado: academicProfile.formacion_postgrado ?? persona.formacion_postgrado ?? [],
    experiencia_docente: academicProfile.experiencia_docente ?? persona.experiencia_docente ?? [],
    experiencia_profesional: academicProfile.experiencia_profesional ?? persona.experiencia_profesional ?? [],
    capacitaciones: academicProfile.capacitaciones ?? persona.capacitaciones ?? [],
    produccion_intelectual: academicProfile.produccion_intelectual ?? persona.produccion_intelectual ?? [],
    reconocimientos: academicProfile.reconocimientos ?? persona.reconocimientos ?? [],
    idiomas: academicProfile.idiomas ?? persona.idiomas ?? [],
  }
}

const downloadCvPdf = async (persona: any) => {
  if (!persona) return
  
  try {
    isGeneratingCv.value = true
    Loading.show({ message: 'Generando CV PDF completo (incluyendo anexos)...' })
    const response = await api.get(`/v1/talento-humano/cv/${persona.id}/descargar`, {
      responseType: 'blob',
      timeout: 60000 // Aumentar timeout para procesos de PDF pesados
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CV_${persona.nombres}_${persona.primer_apellido}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    $q.notify({
      type: 'positive',
      message: 'CV descargado correctamente',
      icon: 'download'
    })
  } catch (error) {
    console.error('Error downloading CV', error);
    $q.notify({
      type: 'negative',
      message: 'No se pudo generar el CV PDF'
    })
  } finally {
    isGeneratingCv.value = false
    Loading.hide()
  }
}

const generarOnboarding = async (idPersona: string) => {
  Loading.show({ message: 'Generando acceso seguro...' })
  try {
    const { data } = await api.post('/onboarding/generar-token', { id_persona: idPersona })
    await copyToClipboard(data.url)
    $q.notify({
      type: 'positive',
      message: 'Link de registro generado y copiado al portapapeles',
      caption: 'Ya puedes envi?rselo al funcionario.',
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
    title: 'Confirmar Eliminaci?n',
    message: `?Est?s seguro de eliminar a ${row.persona.nombres}?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    // L?gica de eliminaci?n...
  })
}

onMounted(() => {
  loadEmployees()
  loadPortalStatus()
  personalStore.fetchCatalogs()
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

.quick-view-card {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.quick-view-body {
  height: calc(100vh - 120px);
  overflow: hidden;
}

.quick-view-panels {
  height: 100%;
  overflow: hidden;
}

.quick-view-panels :deep(.q-panel) {
  height: 100%;
}

.quick-view-panels :deep(.q-tab-panel) {
  box-sizing: border-box;
}

.quick-view-panel-scroll {
  height: 100%;
  overflow: auto;
}

.quick-view-cv-panel {
  height: 100%;
  overflow: hidden;
}
</style>



