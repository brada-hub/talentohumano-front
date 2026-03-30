<template>
  <q-page class="sigeth-page bg-page">
    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="employee" class="profile-container animate-fade" :class="{ 'cv-mode': tab === 'cv' }">
      
      <!-- 1. HEADER -->
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

      <!-- 2. TABS -->
      <div class="tabs-container q-mt-sm">
        <q-tabs
          v-model="tab" dense narrow-indicator
          class="text-grey-7 custom-tabs"
          active-color="primary" indicator-color="primary"
          align="left" no-caps inline-label
        >
          <q-tab name="info" label="INFORMACIÓN" icon="o_person" />
          <q-tab name="cv" label="HOJA DE VIDA" icon="o_description" />
          <q-tab name="contracts" label="CONTRATOS" icon="o_history" />
          <q-tab name="legajo" label="LEGAJO" icon="o_folder" />
        </q-tabs>
        <q-separator color="grey-3" />
      </div>

      <!-- 3. PANELS -->
      <q-tab-panels v-model="tab" animated class="bg-transparent panel-wrapper" style="overflow: visible;">
        
        <q-tab-panel name="info" class="q-pa-none">
          <PersonalInfoTab 
            :persona="employee.persona"
            :correo_institucional="employee.correo_institucional"
            :caja="employee.caja"
            :pensiones="employee.pensiones"
            :base-url="apiBaseUrl"
            :empleado-id="employee.id_empleado"
            @updated="(data) => { employee = data; }"
          />
        </q-tab-panel>

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

        <q-tab-panel name="legajo" class="q-pa-none">
          <PersonalLegajoTab :id-empleado="employee.id_empleado" />
        </q-tab-panel>

        <q-tab-panel name="contracts" class="q-pa-none">
          <PersonalHistoryTab :contratos="employee.contratos" />
        </q-tab-panel>

      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePersonalStore } from 'src/stores/personalStore'
import { api } from 'boot/axios'

import PersonalHeader from '../modules/personal/components/PersonalHeader.vue'
import PersonalInfoTab from '../modules/personal/components/PersonalInfoTab.vue'
import PersonalCvTab from '../modules/personal/components/PersonalCvTab.vue'
import PersonalHistoryTab from '../modules/personal/components/PersonalHistoryTab.vue'
import PersonalLegajoTab from '../modules/personal/components/PersonalLegajoTab.vue'

const route = useRoute()
const personalStore = usePersonalStore()

const loading = ref(true)
const employee = ref<any>(null)
const tab = ref((route.query.tab as string) || 'info')
const isGeneratingPdf = ref(false)

const apiBaseUrl = api.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:8000'

const getAvatarUrl = (persona: any) => {
  return `https://ui-avatars.com/api/?name=${persona.primer_apellido}+${persona.nombres}&background=6A37A3&color=fff&bold=true`
}

// Bloquear scroll global cuando estamos en CV
watch(tab, (v) => {
  const qPage = document.querySelector('.q-page-container')
  if (v === 'cv') {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    if (qPage) (qPage as HTMLElement).style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    if (qPage) (qPage as HTMLElement).style.overflow = ''
  }
}, { immediate: true })

onUnmounted(() => {
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
  const qPage = document.querySelector('.q-page-container')
  if (qPage) (qPage as HTMLElement).style.overflow = ''
})

const downloadCvPdf = async () => {
  if (!employee.value?.persona) return
  try {
    isGeneratingPdf.value = true;
    const response = await api.get(`/v1/talento-humano/cv/${employee.value.persona.id}/descargar`, {
      responseType: 'blob',
      timeout: 120000 // 2 min para PDFs grandes con respaldos
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

const loadEmployee = async () => {
  const id = route.params.id as string
  employee.value = await personalStore.fetchEmployeeById(id)
  loading.value = false
}

onMounted(loadEmployee)
</script>

<style lang="scss" scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px;
}

// Cuando está en modo CV, expandimos a full width
.cv-mode {
  max-width: 100% !important;
  padding: 0 !important;
  
  // Forzar q-tab-panels a no expandir el scroll
  :deep(.q-tab-panels) {
    overflow: hidden !important;
  }
  :deep(.q-panel.scroll) {
    overflow: hidden !important;
  }
}

.tabs-container {
  :deep(.q-tab__label) {
    font-weight: 800; letter-spacing: 1px; font-size: 10px;
  }
  :deep(.q-tab) {
    min-height: 36px;
    padding: 0 16px;
  }
}

.custom-tabs {
  background: white;
  border-radius: 8px 8px 0 0;
}

.bg-page { background: #f1f5f9; }

.animate-fade {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
