<template>
  <q-page class="q-pa-lg">
    <!-- Header Hero -->
    <div class="row items-center q-mb-lg animate-fade-in">
      <div class="col">
        <div class="row items-center q-gutter-x-md">
          <q-icon name="explore" size="38px" class="text-primary icon-glow" />
          <div class="column">
            <h1 class="text-h5 text-weight-bolder brand-text q-my-none">Catálogos Geográficos</h1>
            <p class="text-caption text-grey-7 q-mb-none font-medium">Administración de la infraestructura geográfica</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Tabs -->
    <div class="q-gutter-y-lg animate-slide-up">
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
          <q-tab name="paises" icon="explore" label="Países" class="rounded-16 q-mx-xs transition-hover text-weight-bold" style="min-height: 60px" />
          <q-tab name="departamentos" icon="map" label="Departamentos" class="rounded-16 q-mx-xs transition-hover text-weight-bold" style="min-height: 60px" />
          <q-tab name="ciudades" icon="location_city" label="Ciudades" class="rounded-16 q-mx-xs transition-hover text-weight-bold" style="min-height: 60px" />
        </q-tabs>

        <q-separator />

      <q-tab-panels v-model="tab" animated>
        <!-- Países Panel -->
        <q-tab-panel name="paises">
          <div class="table-toolbar">
            <q-input
              v-model="searchPaises"
              outlined
              dense
              placeholder="Buscar país..."
              class="modern-input"
              debounce="300"
              style="max-width: 400px;"
            >
              <template #prepend>
                <q-icon name="search" color="primary" />
              </template>
            </q-input>
          </div>

          <q-table
            :rows="filteredPaises"
            :columns="paisesColumns"
            row-key="id_pais"
            flat
            class="management-table no-shadow no-border bg-transparent"
            :loading="geoStore.loading"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template #body-cell-activo="props">
              <q-td :props="props">
                <q-chip
                  :color="props.row.activo ? 'green-1' : 'red-1'"
                  :text-color="props.row.activo ? 'green-9' : 'red-9'"
                  class="text-weight-bold"
                  size="sm"
                >
                  <q-icon :name="props.row.activo ? 'check_circle' : 'cancel'" size="16px" class="q-mr-xs" />
                  {{ props.row.activo ? 'ACTIVO' : 'INACTIVO' }}
                </q-chip>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Departamentos Panel -->
        <q-tab-panel name="departamentos">
          <div class="table-toolbar">
            <GeoSelectPais
              v-model="selectedPaisFilter"
              label="Filtrar por país"
              style="max-width: 300px"
            />
          </div>

          <q-table
            :rows="filteredDepartamentos"
            :columns="departamentosColumns"
            row-key="id_departamento"
            flat
            class="management-table no-shadow no-border bg-transparent"
            :loading="geoStore.loading"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template #body-cell-pais_id="props">
              <q-td :props="props">
                <q-chip
                  outline
                  color="indigo-5"
                  size="sm"
                  class="text-weight-bold"
                  icon="public"
                >
                  {{ geoStore.getPaisById(props.row.pais_id)?.nombre || `ID: ${props.row.pais_id}` }}
                </q-chip>
              </q-td>
            </template>
            <template #body-cell-codigo_expedido="props">
              <q-td :props="props">
                <q-chip
                  v-if="props.row.codigo_expedido"
                  color="indigo-1"
                  text-color="indigo-9"
                  size="sm"
                  class="text-weight-bolder"
                  square
                  :label="props.row.codigo_expedido"
                />
                <span v-else class="text-grey">—</span>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Ciudades Panel -->
        <q-tab-panel name="ciudades">
          <div class="table-toolbar q-gutter-md row items-center">
            <GeoSelectPais
              v-model="selectedPaisFilter"
              label="País"
              style="min-width: 200px"
            />
            <GeoSelectDepartamento
              v-model="selectedDeptoFilter"
              :pais-id="selectedPaisFilter"
              label="Departamento"
              style="min-width: 200px"
            />
            <q-input
              v-model="searchCiudades"
              outlined
              dense
              placeholder="Buscar ciudad..."
              class="table-search"
              debounce="300"
              style="min-width: 200px"
            >
              <template #prepend>
                <q-icon name="search" color="primary" />
              </template>
            </q-input>
          </div>

          <q-table
            :rows="filteredCiudades"
            :columns="ciudadesColumns"
            row-key="id_ciudad"
            flat
            dense
            class="management-table no-shadow no-border bg-transparent"
            :loading="geoStore.loading"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template #body-cell-pais="props">
              <q-td :props="props">
                <q-chip
                  outline
                  color="indigo-5"
                  size="sm"
                  class="text-weight-bold"
                  icon="public"
                >
                  <template v-if="geoStore.getDepartamentoById(props.row.departamento_id)">
                    {{ geoStore.getPaisById(geoStore.getDepartamentoById(props.row.departamento_id).pais_id)?.nombre || '—' }}
                  </template>
                  <template v-else-if="selectedPaisFilter">
                     {{ geoStore.getPaisById(selectedPaisFilter)?.nombre || '—' }}
                  </template>
                  <span v-else>—</span>
                </q-chip>
              </q-td>
            </template>
            <template #body-cell-departamento="props">
              <q-td :props="props">
                <q-chip
                  outline
                  color="indigo-5"
                  size="sm"
                  class="text-weight-bold"
                  icon="map"
                >
                  {{ geoStore.getDepartamentoById(props.row.departamento_id)?.nombre || (selectedDeptoFilter ? geoStore.getDepartamentoById(selectedDeptoFilter)?.nombre : '—') }}
                </q-chip>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useGeoStore } from '../stores/useGeoStore'
import GeoSelectPais from '../components/GeoSelectPais.vue'
import GeoSelectDepartamento from '../components/GeoSelectDepartamento.vue'

const geoStore = useGeoStore()

const tab = ref('paises')
const searchPaises = ref('')
const searchCiudades = ref('')
const searchSedes = ref('')
const selectedPaisFilter = ref<number | null>(null)
const selectedDeptoFilter = ref<number | null>(null)

// Columns
const paisesColumns = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' as const, sortable: true },
  { name: 'iso2', label: 'ISO2', field: 'iso2', align: 'center' as const },
  { name: 'iso3', label: 'ISO3', field: 'iso3', align: 'center' as const },
  { name: 'prefijo_telefonico', label: 'Prefijo', field: 'prefijo_telefonico', align: 'center' as const },
  { name: 'activo', label: 'Estado', field: 'activo', align: 'center' as const },
]

const departamentosColumns = [
  { name: 'pais_id', label: 'País', field: 'pais_id', align: 'left' as const, sortable: true },
  { name: 'nombre', label: 'Departamento', field: 'nombre', align: 'left' as const, sortable: true },
  { name: 'codigo_expedido', label: 'Código', field: 'codigo_expedido', align: 'center' as const },
]

const ciudadesColumns = [
  { name: 'pais', label: 'País', field: (row: any) => row.departamento?.pais_id, align: 'left' as const },
  { name: 'departamento', label: 'Departamento', field: 'departamento', align: 'left' as const },
  { name: 'nombre', label: 'Ciudad', field: 'nombre', align: 'left' as const, sortable: true },
]

const sedesColumns = [
  { name: 'id_sede', label: 'ID', field: 'id_sede', align: 'center' as const, sortable: true },
  { name: 'nombre', label: 'Nombre Sede', field: 'nombre', align: 'left' as const, sortable: true },
  { name: 'sigla', label: 'Sigla', field: 'sigla', align: 'center' as const },
  { name: 'activo', label: 'Estado', field: 'activo', align: 'center' as const },
]

// Computed
const filteredPaises = computed(() => {
  if (!searchPaises.value) return geoStore.paises
  const search = searchPaises.value.toLowerCase()
  return geoStore.paises.filter(p => 
    p.nombre.toLowerCase().includes(search) ||
    p.iso2?.toLowerCase().includes(search) ||
    p.iso3?.toLowerCase().includes(search)
  )
})

const filteredDepartamentos = computed(() => {
  return geoStore.departamentos
})

const filteredCiudades = computed(() => {
  if (!searchCiudades.value) return geoStore.ciudades.slice(0, 100)
  const search = searchCiudades.value.toLowerCase()
  return geoStore.ciudades.filter(c => 
    c.nombre.toLowerCase().includes(search)
  )
})

const filteredSedes = computed(() => {
  if (!searchSedes.value) return geoStore.sedes
  const search = searchSedes.value.toLowerCase()
  return geoStore.sedes.filter(s => 
    s.nombre.toLowerCase().includes(search) || 
    s.sigla?.toLowerCase().includes(search)
  )
})

// Watch paisId to load departamentos (for Departamentos tab)
watch(selectedPaisFilter, async (paisId) => {
  // Reset depto filter when pais changes
  selectedDeptoFilter.value = null
  
  if (paisId) {
    await geoStore.fetchDepartamentos(paisId)
  }
})

// Watch deptoId to load ciudades (for Ciudades tab)
watch(selectedDeptoFilter, async (deptoId) => {
  if (deptoId) {
    await geoStore.fetchCiudades(deptoId)
  }
})

// Load data
onMounted(async () => {
  await Promise.all([
    geoStore.fetchPaises(),
    geoStore.fetchSedes()
  ])
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

.rounded-16 { border-radius: 16px !important; }
.rounded-24 { border-radius: 24px !important; }

.shadow-soft { box-shadow: 0 10px 30px rgba(0,0,0,0.03); }

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

.transition-hover:hover {
  background: rgba(0,0,0,0.02);
}

.management-table {
  :deep(thead th) {
    font-weight: 800;
    text-transform: uppercase;
    font-size: 11px;
    color: #64748b;
    letter-spacing: 1px;
    padding: 12px 16px;
  }
  
  :deep(tbody td) {
    padding: 8px 16px;
    font-size: 13px;
    color: #1e293b;
    border-bottom: 1px solid #f1f5f9;
  }

  :deep(tbody tr) {
    transition: all 0.2s ease;
    &:hover {
      background: #f8fafc !important;
      transform: scale(1.002);
    }
  }
}

// Animations
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
