<template>
  <q-page class="sigeth-page bg-page">
    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="employee" class="profile-container animate-fade q-pa-md lg:q-pa-lg">
      
      <!-- 1. HEADER (ORCHESTRATED COMPONENT) -->
      <PersonalHeader 
        :name="`${employee.persona.nombres} ${employee.persona.primer_apellido}`"
        :role="employee.contrato_activo?.cargo?.nombre_cargo || 'Investigador / Funcionario'"
        :area="employee.contrato_activo?.area?.nombre_area || 'Sin Departamento'"
        :status="employee.estado_laboral"
        :id="employee.id_empleado"
        :location="employee.contrato_activo?.sede?.nombre"
        :birth-date="employee.persona.fecha_nacimiento"
        :avatar-url="getAvatarUrl(employee.persona)"
      />

      <!-- 2. TABS NAVIGATION -->
      <div class="tabs-container q-mt-lg">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey-7"
          active-color="primary"
          indicator-color="primary"
          align="left"
          no-caps
          inline-label
        >
          <q-tab name="info" label="INFORMACIÓN GENERAL" />
          <q-tab name="cv" label="CV NORMALIZADO" />
          <q-tab name="contracts" label="HISTORIAL LABORAL" />
        </q-tabs>
        <q-separator color="grey-3" />
      </div>

      <!-- 3. CONTENT PANELS (ORCHESTRATED COMPONENTS) -->
      <q-tab-panels v-model="tab" animated class="bg-transparent">
        
        <!-- INFO TAB -->
        <q-tab-panel name="info" class="q-pa-none">
          <PersonalInfoTab 
            :persona="employee.persona"
            :correo_institucional="employee.correo_institucional"
            :caja="employee.caja"
            :pensiones="employee.pensiones"
          />
        </q-tab-panel>

        <!-- CV TAB -->
        <q-tab-panel name="cv" class="q-pa-none">
          <PersonalCvTab 
            :persona="employee.persona"
            :cargo="employee.contrato_activo?.cargo?.nombre_cargo"
            :area="employee.contrato_activo?.area?.nombre_area"
            :base-url="apiBaseUrl"
            :is-generating-pdf="isGeneratingPdf"
            @download="downloadCvPdf"
          />
        </q-tab-panel>

        <!-- HISTORY TAB -->
        <q-tab-panel name="contracts" class="q-pa-none">
          <PersonalHistoryTab :contratos="employee.contratos" />
        </q-tab-panel>

      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePersonalStore } from 'stores/personalStore'
import { api } from 'boot/axios'

// ══ Import Sub-Components (DDD/Separation of concerns) ══
import PersonalHeader from '../modules/personal/components/PersonalHeader.vue'
import PersonalInfoTab from '../modules/personal/components/PersonalInfoTab.vue'
import PersonalCvTab from '../modules/personal/components/PersonalCvTab.vue'
import PersonalHistoryTab from '../modules/personal/components/PersonalHistoryTab.vue'

const route = useRoute()
const personalStore = usePersonalStore()

// State
const loading = ref(true)
const employee = ref<any>(null)
const tab = ref('info')
const isGeneratingPdf = ref(false)

// Utils
const apiBaseUrl = api.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:8000'

const getAvatarUrl = (persona: any) => {
  return `https://ui-avatars.com/api/?name=${persona.primer_apellido}+${persona.nombres}&background=6A37A3&color=fff&bold=true`
}

const downloadCvPdf = async () => {
  if (!employee.value?.persona) return
  
  try {
    isGeneratingPdf.value = true;
    const response = await api.get(`/v1/talento-humano/cv/${employee.value.persona.id}/descargar`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CV_${employee.value.persona.nombres}_${employee.value.persona.primer_apellido}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading CV', error);
  } finally {
    isGeneratingPdf.value = false;
  }
}

onMounted(async () => {
  const id = route.params.id as string
  employee.value = await personalStore.fetchEmployeeById(id)
  loading.value = false
})
</script>

<style lang="scss" scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

.tabs-container {
  :deep(.q-tab__label) {
    font-weight: 800; letter-spacing: 1.5px; font-size: 11px;
  }
}

.bg-page { background: #f8fafc; }

.animate-fade {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
