<template>
  <q-page class="sigeth-page">
    <!-- Page Hero -->
    <div class="page-hero">
      <div class="page-hero__left">
        <div class="page-hero__title">Catálogos Geográficos</div>
        <div class="page-hero__subtitle">
          Administración de países, departamentos y ciudades
        </div>
      </div>
    </div>

    <!-- Tabs for different catalogs -->
    <q-card class="sigeth-card">
      <q-tabs v-model="tab" class="text-primary" align="left">
        <q-tab name="paises" icon="public" label="Países" />
        <q-tab name="departamentos" icon="map" label="Departamentos" />
        <q-tab name="ciudades" icon="location_city" label="Ciudades" />
        <q-tab name="sedes" icon="business" label="Sedes / Campi" />
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
              class="table-search"
              debounce="300"
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
            class="sigeth-table"
            :loading="geoStore.loading"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template #body-cell-activo="props">
              <q-td :props="props">
                <q-badge
                  :color="props.row.activo ? 'positive' : 'negative'"
                  :label="props.row.activo ? 'Activo' : 'Inactivo'"
                />
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
            class="sigeth-table"
            :loading="geoStore.loading"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template #body-cell-codigo_expedido="props">
              <q-td :props="props">
                <q-chip
                  v-if="props.row.codigo_expedido"
                  color="secondary"
                  text-color="white"
                  size="sm"
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
            class="sigeth-table"
            :loading="geoStore.loading"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template #body-cell-departamento="props">
              <q-td :props="props">
                <q-chip
                  v-if="props.row.departamento"
                  outline
                  color="primary"
                  size="sm"
                  :label="props.row.departamento.nombre"
                />
                <span v-else class="text-grey">—</span>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Sedes Panel -->
        <q-tab-panel name="sedes">
          <div class="table-toolbar row items-center q-gutter-x-md">
            <q-input
              v-model="searchSedes"
              outlined
              dense
              placeholder="Buscar sede (Cochabamba, La Paz...)"
              class="table-search col"
              debounce="300"
            >
              <template #prepend>
                <q-icon name="search" color="primary" />
              </template>
            </q-input>
            <q-chip outline color="secondary" icon="info">Estas sedes se sincronizan con SISPO/SIGVA</q-chip>
          </div>

          <q-table
            :rows="filteredSedes"
            :columns="sedesColumns"
            row-key="id_sede"
            flat
            class="sigeth-table"
            :loading="geoStore.loading"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template #body-cell-sigla="props">
              <q-td :props="props">
                <q-chip square color="indigo-1" text-color="indigo-9" class="text-weight-bold">
                  {{ props.row.sigla }}
                </q-chip>
              </q-td>
            </template>
            <template #body-cell-activo="props">
              <q-td :props="props">
                <q-badge
                  :color="props.row.activo ? 'positive' : 'negative'"
                  :label="props.row.activo ? 'ACTIVO' : 'INACTIVO'"
                />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
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
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' as const, sortable: true },
  { name: 'codigo_expedido', label: 'Código', field: 'codigo_expedido', align: 'center' as const },
  { name: 'pais_id', label: 'ID País', field: 'pais_id', align: 'center' as const },
]

const ciudadesColumns = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' as const, sortable: true },
  { name: 'departamento', label: 'Departamento', field: 'departamento', align: 'left' as const },
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
