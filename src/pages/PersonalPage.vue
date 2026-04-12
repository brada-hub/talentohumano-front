<template>
  <q-page class="sigeth-page">
    
    <!-- Header Hero -->
    <div class="row items-center q-mb-lg animate-fade-in">
      <div class="col">
        <div class="row items-center q-gutter-x-md">
          <q-icon name="group" size="38px" class="text-primary icon-glow" />
          <div class="column">
            <h1 class="text-h5 text-weight-bolder brand-text q-my-none">Gestión de Personal</h1>
            <p class="text-caption text-grey-7 q-mb-none font-medium">Listado oficial de funcionarios, contratos y legajo digital</p>
          </div>
        </div>
      </div>
      <div class="col-auto row items-center q-gutter-sm">
        <div class="onboarding-status-pill row items-center q-pa-xs q-pr-sm rounded-24 glass-card border-glass shadow-soft">
          <q-toggle
            v-model="onboardingEnabled"
            color="positive"
            keep-color
            dense
            @update:model-value="togglePortal"
            class="text-weight-bold"
          />
          <div class="column q-ml-xs">
            <div class="text-overline leading-tight" style="font-size: 7px">Portal Onboarding</div>
            <div class="text-caption text-weight-bold font-bold leading-tight" style="font-size: 10px" :class="onboardingEnabled ? 'text-positive' : 'text-grey-7'">
              {{ onboardingEnabled ? 'ACTIVO' : 'DESACTIVADO' }}
            </div>
          </div>
        </div>

        <q-btn
          flat
          round
          color="primary"
          icon="link"
          size="sm"
          @click="copiarLinkPublico"
          class="glass-card shadow-soft"
        >
          <q-tooltip>Copiar Link Público</q-tooltip>
        </q-btn>

        <q-btn 
          label="Nuevo Registro" 
          icon="person_add" 
          dense
          class="btn-gradient-portal rounded-12 q-px-md text-white shadow-lift" 
          @click="showDialog = true" 
        />
      </div>
    </div>

    <!-- 2. MAIN CONTENT AREA -->
    <div class="q-gutter-y-md animate-slide-up">
      <q-card class="glass-card shadow-soft rounded-24 overflow-hidden border-glass">
        <div class="table-toolbar row items-center q-pa-md bg-grey-1/30">
          <q-input
            v-model="filter"
            placeholder="Buscar funcionario..."
            outlined
            dense
            class="col-grow q-mr-md modern-input"
          >
            <template #prepend>
              <q-icon name="search" color="primary" />
            </template>
          </q-input>
          <q-btn flat round icon="refresh" color="primary" size="sm" class="glass-card shadow-soft" @click="loadEmployees" :loading="loading">
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
          dense
          class="management-table no-shadow no-border bg-transparent"
        >
          <!-- Slot: Nombre y CI -->
          <template v-slot:body-cell-nombre="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-avatar size="36px" class="q-mr-sm avatar-employee">
                  <img :src="`https://ui-avatars.com/api/?name=${props.row.persona.primer_apellido}+${props.row.persona.nombres}&background=6A37A3&color=fff&bold=true`" />
                </q-avatar>
                <div class="column">
                  <span class="text-weight-bold text-indigo-10" style="font-size: 13px">
                    {{ [props.row.persona.primer_apellido, props.row.persona.segundo_apellido, props.row.persona.nombres].filter(Boolean).join(' ') }}
                  </span>
                  <div class="row items-center q-gutter-x-xs text-grey-6" style="font-size: 11px">
                    <q-icon name="badge" size="12px" />
                    <span class="font-medium">CI: {{ props.row.persona.ci }}</span>
                  </div>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Slot: Cargo y Unidad -->
          <template v-slot:body-cell-cargo="props">
            <q-td :props="props" style="font-size: 13px">
              <template v-if="props.row.contrato_activo">
                <div class="text-weight-bold text-grey-9 truncate" style="max-width: 200px">{{ props.row.contrato_activo.cargo.nombre_cargo }}</div>
                <div class="text-caption text-indigo-7 font-bold">{{ props.row.contrato_activo.area.nombre_area }}</div>
              </template>
              <span v-else class="text-grey-5 text-italic">Sin contrato</span>
            </q-td>
          </template>

          <!-- Slot: Estado -->
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                :color="props.row.estado_laboral === 'Activo' ? 'green-1' : 'grey-1'"
                :text-color="props.row.estado_laboral === 'Activo' ? 'green-9' : 'grey-9'"
                size="sm"
                class="text-weight-bold"
              >
                <q-icon :name="props.row.estado_laboral === 'Activo' ? 'check_circle' : 'pause_circle'" size="16px" class="q-mr-xs" />
                {{ props.row.estado_laboral || 'INACTIVO' }}
              </q-chip>
            </q-td>
          </template>

          <!-- Slot: Acciones -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" auto-width>
              <div class="row no-wrap q-gutter-xs justify-end">
                <q-btn unelevated rounded dense class="btn-gradient-portal text-white q-px-sm shadow-lift" icon="person_search" @click="openQuickView(props.row, 'info')">
                  <q-tooltip>Vista Rápida</q-tooltip>
                </q-btn>
                
                <q-btn-dropdown flat round dense color="grey-7" dropdown-icon="more_vert" no-icon-animation class="glass-card shadow-soft">
                  <q-list style="min-width: 240px" class="q-py-sm">
                    <q-item-label header class="text-uppercase font-black text-grey-5" style="font-size: 10px; letter-spacing: 1.5px">Operaciones Senior</q-item-label>
                    
                    <q-item clickable v-close-popup @click="openQuickView(props.row, 'cv')" class="q-py-md">
                      <q-item-section avatar>
                        <q-avatar color="red-1" text-color="red-8" icon="picture_as_pdf" size="40px" />
                      </q-item-section>
                      <q-item-section>
                        <div class="text-weight-bold">Hoja de Vida (CV)</div>
                        <div class="text-caption">Generar y descargar PDF</div>
                      </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="openQuickView(props.row, 'contracts')" class="q-py-md">
                      <q-item-section avatar>
                        <q-avatar color="indigo-1" text-color="indigo-8" icon="history" size="40px" />
                      </q-item-section>
                      <q-item-section>
                        <div class="text-weight-bold">Historial Laboral</div>
                        <div class="text-caption">Revisar contratos y ascensos</div>
                      </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="openQuickView(props.row, 'legajo')" class="q-py-md">
                      <q-item-section avatar>
                        <q-avatar color="orange-1" text-color="orange-8" icon="folder_shared" size="40px" />
                      </q-item-section>
                      <q-item-section>
                        <div class="text-weight-bold">Legajo Digital</div>
                        <div class="text-caption">Expediente personal completo</div>
                      </q-item-section>
                    </q-item>

                    <q-separator spaced />

                    <q-item clickable v-close-popup @click="generarOnboarding(props.row.persona.id)" class="q-py-md">
                      <q-item-section avatar>
                        <q-avatar color="purple-1" text-color="purple-8" icon="auto_fix_high" size="40px" />
                      </q-item-section>
                      <q-item-section>
                        <div class="text-weight-bold text-purple-9">Acceso Onboarding</div>
                        <div class="text-caption text-purple-7">Habilitar registro clave</div>
                      </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="confirmDelete(props.row)" class="text-negative q-py-md hover-red">
                      <q-item-section avatar>
                        <q-avatar color="red-1" text-color="red-8" icon="delete_forever" size="40px" />
                      </q-item-section>
                      <q-item-section>
                        <div class="text-weight-bold">Eliminar Funcionario</div>
                        <div class="text-caption">Acción irreversible</div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>
            </q-td>
          </template>

          <!-- Estado vacío -->
          <template v-slot:no-data>
            <div class="full-width row flex-center text-grey-4 q-gutter-sm q-pa-xl column">
              <q-icon name="person_off" size="80px" class="opacity-20" />
              <span class="text-h6 font-bold">No se encontraron funcionarios</span>
              <p class="text-body2">Intenta ajustar tus criterios de búsqueda</p>
            </div>
          </template>
        </q-table>
      </q-card>
    </div>

    <!-- Quick View Dialog STATIC HEADER LOCK -->
    <q-dialog v-model="quickView.show" maximized persistent transition-show="slide-up" transition-hide="slide-down">
      <q-card v-if="quickView.employee" class="bg-grey-1 quick-view-card">
        <q-toolbar class="bg-gradient-portal text-white q-px-lg" style="height: 80px; min-height: 80px; max-height: 80px">
          <div class="row items-center no-wrap full-width">
            <!-- PROFILE SECTION (RIGID 300px) -->
            <div class="row items-center no-wrap q-mr-lg" style="width: 300px; min-width: 300px; max-width: 300px">
              <q-avatar size="50px" class="shadow-lift border-glass q-mr-md shrink-0">
                 <img :src="`https://ui-avatars.com/api/?name=${quickView.employee.persona.primer_apellido}+${quickView.employee.persona.nombres}&background=fff&color=6A37A3&bold=true`" />
              </q-avatar>
              
              <div class="column overflow-hidden">
                <div class="text-weight-black text-h6 line-height-tight truncate" style="font-size: 1.1rem">
                  {{ quickView.employee.persona.primer_apellido }} {{ quickView.employee.persona.nombres }}
                </div>
                <div class="row items-center q-gutter-x-sm">
                  <div class="text-caption opacity-80 font-bold">CI: {{ quickView.employee.persona.ci }}</div>
                  <q-badge dense outline color="white" class="text-bold" style="font-size: 10px; padding: 1px 6px">
                    {{ quickView.employee.estado_laboral }}
                  </q-badge>
                </div>
              </div>
            </div>

            <!-- NAVIGATION SECTION (RIGID 710px) -->
            <div style="width: 710px; min-width: 710px; max-width: 710px">
              <q-tabs
                v-model="quickView.tab"
                class="text-white bg-transparent"
                active-color="white"
                indicator-color="white"
                active-class="text-weight-bolder"
                no-caps
                dense
                :breakpoint="0"
                style="height: 50px"
              >
                <q-tab name="info" label="Info" icon="person" class="compact-tab-locked" />
                <q-tab name="academico" label="Académico" icon="school" class="compact-tab-locked" />
                <q-tab name="beneficios" label="Familia" icon="groups" class="compact-tab-locked" />
                <q-tab name="cv" label="Hoja de Vida" icon="description" class="compact-tab-locked" />
                <q-tab name="contracts" label="Contratos" icon="history" class="compact-tab-locked" />
                <q-tab name="legajo" label="Legajo" icon="folder_shared" class="compact-tab-locked" />
              </q-tabs>
            </div>

            <q-space />
            
            <q-btn flat round dense icon="close" v-close-popup class="bg-white/10 hover-rotate shrink-0" />
          </div>
        </q-toolbar>

        <q-linear-progress v-if="quickView.loading" indeterminate color="amber" size="4px" />
        
        <q-separator />

        <q-card-section class="q-pa-none quick-view-body bg-grey-2">
          <q-tab-panels v-model="quickView.tab" animated class="bg-transparent quick-view-panels">
            <q-tab-panel name="info" class="q-pa-none quick-view-panel-scroll">
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
              <ContratosManagerTab
                :contratos="quickView.employee.contratos || []"
                :empleado-id="quickView.employee.id_empleado"
                :empleado-nombre="`${quickView.employee.persona.primer_apellido} ${quickView.employee.persona.nombres}`"
                @refresh="refreshQuickViewContracts"
              />
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
import { getSigethPublicBaseUrl } from 'shared/config/runtime'

// Sub-componentes para el modal
import PersonalInfoTab from '../modules/personal/components/PersonalInfoTab.vue'
import PersonalCvTab from '../modules/personal/components/PersonalCvTabV2.vue'
import AcademicoManagerTab from 'src/modules/academico/components/AcademicoManagerTab.vue'
import BeneficiariosTab from 'src/modules/beneficios/components/BeneficiariosTab.vue'
import ContratosManagerTab from 'src/modules/contratos/components/ContratosManagerTab.vue'
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

const apiBaseUrl = getSigethPublicBaseUrl()

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
    message: 'Link público copiado al portapapeles',
    icon: 'content_paste'
  })
}

const openQuickView = async (employee: any, tab: string = 'info') => {
  quickView.value.employee = JSON.parse(JSON.stringify(employee))
  quickView.value.tab = tab
  quickView.value.academicProfile = null
  quickView.value.academicLoading = false
  quickView.value.show = true
  quickView.value.loading = true
  
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

const refreshQuickViewContracts = async () => {
  const empleadoId = quickView.value.employee?.id_empleado
  if (!empleadoId) return

  try {
    quickView.value.loading = true
    const details = await personalStore.fetchEmployeeById(empleadoId)
    if (details) {
      quickView.value.employee = details
    }
  } finally {
    quickView.value.loading = false
  }
}

const buildCvPersona = (employee: any, academicProfile: any) => {
  const persona = employee?.persona || {}
  if (!academicProfile) return persona

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
    Loading.show({ message: 'Generando CV PDF completo...' })
    const response = await api.get(`/v1/talento-humano/cv/${persona.id}/descargar`, {
      responseType: 'blob',
      timeout: 60000 
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CV_${persona.nombres}_${persona.primer_apellido}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    $q.notify({ type: 'positive', message: 'CV descargado correctamente', icon: 'download' })
  } catch (error) {
    console.error('Error downloading CV', error);
    $q.notify({ type: 'negative', message: 'No se pudo generar el CV PDF' })
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
      message: 'Link de registro copiado al portapapeles',
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
  personalStore.fetchCatalogs()
})
</script>

<style lang="scss" scoped>
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
.shadow-lift { box-shadow: 0 4px 15px rgba(106, 55, 163, 0.3); transition: transform 0.2s; &:hover { transform: translateY(-2px); } }

.avatar-employee {
  border: 2px solid rgba(255, 255, 255, 1);
  box-shadow: 0 4px 12px rgba(106, 55, 163, 0.15);
}

.shrink-0 { flex-shrink: 0 !important; flex-grow: 0 !important; }

.modern-input {
  :deep(.q-field__control) {
    border-radius: 12px !important;
    background: rgba(244, 246, 248, 0.8) !important;
  }
}

.management-table {
  :deep(thead th) {
    font-weight: 800;
    text-transform: uppercase;
    font-size: 11px;
    color: #64748b;
    letter-spacing: 1.2px;
    padding: 24px 16px;
    background: #f8fafc;
  }
  
  :deep(tbody td) {
    padding: 16px;
    font-size: 14px;
    color: #1e293b;
    border-bottom: 1px solid #f1f5f9;
  }

  :deep(tbody tr) {
    transition: all 0.3s ease;
    &:hover {
      background: #f1f5f9 !important;
      transform: scale(1.002);
    }
  }
}

.quick-view-card {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.quick-view-body {
  flex-grow: 1;
  overflow: hidden;
}

.quick-view-panels {
  height: 100%;
}

.quick-view-panel-scroll {
  height: 100%;
  overflow: auto;
}

.transition-hover {
  transition: all 0.3s ease;
  &:hover {
    background: rgba(106, 55, 163, 0.05);
  }
}

.compact-tab-locked {
  height: 50px;
  width: 115px; /* Locked width to prevent jumps */
  min-width: 115px;
  max-width: 115px;
  font-size: 11px;
  opacity: 0.85;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 1;
    background: rgba(255,255,255,0.1);
  }
}

.line-height-tight { line-height: 1.1; }
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.hover-rotate:hover { transform: rotate(90deg); transition: transform 0.4s; }

/* Para forzar el ícono al lado del texto en modo compacto */
:deep(.compact-tab-locked .q-tab__content) {
  flex-direction: row !important;
  gap: 6px;
  padding: 0 4px !important;
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

.leading-tight { line-height: 1.25; }

.onboarding-status-pill {
  transition: all 0.3s ease;
  &:hover {
    background: white;
  }
}
</style>
