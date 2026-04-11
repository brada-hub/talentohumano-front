<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-lg animate-fade-in">
      <div class="col">
        <div class="row items-center q-gutter-x-md">
          <q-icon name="apartment" size="38px" class="text-primary icon-glow" />
          <div class="column">
            <h1 class="text-h5 text-weight-bolder brand-text q-my-none">Infraestructura UNITEPC</h1>
            <p class="text-caption text-grey-7 q-mb-none font-medium">Administración de Sedes Nacionales y Campus Universitarios</p>
          </div>
        </div>
      </div>
      <div class="col-auto">
        <q-btn 
          v-if="tab === 'sedes'"
          label="Nueva Sede" 
          icon="add" 
          class="btn-gradient-portal rounded-12 q-px-lg shadow-lift shadow-indigo" 
          @click="openSedeDialog()"
        />
        <q-btn 
          v-if="tab === 'campus'"
          label="Nuevo Campus" 
          icon="add_business" 
          class="btn-gradient-portal rounded-12 q-px-lg shadow-lift shadow-teal" 
          @click="openCampusDialog()"
        />
      </div>
    </div>

    <div class="animate-slide-up">
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
          <q-tab name="sedes" icon="map" label="Sedes Nacionales" class="rounded-16 q-mx-xs transition-hover text-weight-bold" style="min-height: 60px" />
          <q-tab name="campus" icon="domain" label="Campus Universitarios" class="rounded-16 q-mx-xs transition-hover text-weight-bold" style="min-height: 60px" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated class="bg-transparent">
          <!-- PANEL: SEDES -->
          <q-tab-panel name="sedes" class="q-pa-none">
            <q-table
              :rows="geoStore.sedes"
              :columns="sedeColumns"
              row-key="id_sede"
              dense
              class="management-table no-shadow no-border bg-transparent"
              :loading="geoStore.loading"
            >
              <template v-slot:body-cell-departamento="props">
                <q-td :props="props">
                  <q-chip 
                    v-if="props.row.departamento"
                    color="indigo-1" 
                    text-color="indigo-9"
                    dense 
                    class="text-weight-bold"
                  >
                    {{ props.row.departamento.nombre }}
                  </q-chip>
                  <q-chip v-else color="grey-2" text-color="grey-7" dense class="text-weight-bold">NACIONAL</q-chip>
                </q-td>
              </template>

              <template v-slot:body-cell-status="props">
                <q-td :props="props" class="text-center">
                   <q-toggle v-model="props.row.activo" color="indigo" @update:model-value="toggleSedeStatus(props.row)" />
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="text-center">
                  <div class="row no-wrap items-center justify-center q-gutter-x-sm">
                    <q-btn flat round dense icon="edit" color="indigo" @click="openSedeDialog(props.row)" />
                    <q-btn flat round dense icon="delete_outline" color="red" @click="confirmDeleteSede(props.row)" />
                  </div>
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>

          <!-- PANEL: CAMPUS -->
          <q-tab-panel name="campus" class="q-pa-none">
            <q-table
              :rows="geoStore.campus"
              :columns="campusColumns"
              row-key="id_campus"
              dense
              class="management-table no-shadow no-border bg-transparent"
              :loading="geoStore.loading"
            >
              <template v-slot:body-cell-sede="props">
                <q-td :props="props">
                  <div class="row items-center no-wrap">
                    <q-avatar size="24px" color="teal-1" text-color="teal-9" icon="apartment" class="q-mr-sm" />
                    <div class="text-weight-bold text-teal-9">{{ props.row.sede?.nombre || 'Desconocido' }}</div>
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-status="props">
                <q-td :props="props" class="text-center">
                   <q-toggle v-model="props.row.activo" color="teal" @update:model-value="toggleCampusStatus(props.row)" />
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="text-center">
                  <div class="row no-wrap items-center justify-center q-gutter-x-sm">
                    <q-btn flat round dense icon="edit" color="teal" @click="openCampusDialog(props.row)" />
                    <q-btn flat round dense icon="delete_outline" color="red" @click="confirmDeleteCampus(props.row)" />
                  </div>
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>

    <!-- DIALOG: SEDE -->
    <q-dialog v-model="sedeDialog.show" persistent>
      <q-card class="modern-dialog rounded-24 shadow-24" style="width: 500px">
        <q-card-section class="bg-gradient-portal text-white q-py-lg">
          <div class="row items-center no-wrap">
            <q-icon name="map" size="md" class="q-mr-md" />
            <div class="column">
              <div class="text-h6 font-bold">{{ sedeDialog.data.id_sede ? 'Editar Sede' : 'Nueva Sede Nacional' }}</div>
              <div class="text-caption opacity-80">Las sedes principales representan departamentos</div>
            </div>
          </div>
        </q-card-section>
        
        <q-card-section class="q-pa-xl">
          <q-form @submit="saveSede" class="q-gutter-y-lg">
            <q-input v-model="sedeDialog.data.nombre" label="Nombre de la Sede" outlined class="modern-input" lazy-rules :rules="[val => !!val || 'Requerido']" />
            <q-input v-model="sedeDialog.data.sigla" label="Sigla (3 letras)" outlined class="modern-input" lazy-rules :rules="[val => !!val || 'Requerido']" />
            
            <q-select
              v-model="sedeDialog.data.id_departamento"
              :options="geoStore.departamentos"
              option-label="nombre"
              option-value="id_departamento"
              label="Departamento de Bolivia"
              outlined
              emit-value
              map-options
              class="modern-input"
              clearable
            >
               <template v-slot:prepend><q-icon name="location_on" color="indigo" /></template>
            </q-select>

            <div class="q-pa-md bg-grey-1 rounded-12">
               <q-toggle v-model="sedeDialog.data.activo" label="Habilitar Sede" color="indigo" class="text-weight-bold" />
            </div>

            <div class="row justify-end q-gutter-x-md q-mt-xl">
              <q-btn flat label="Cancelar" color="grey-7" v-close-popup class="rounded-12 q-px-lg" />
              <q-btn label="Guardar Sede" type="submit" class="btn-gradient-portal rounded-12 q-px-xl text-white shadow-lift shadow-indigo" :loading="geoStore.loading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- DIALOG: CAMPUS -->
    <q-dialog v-model="campusDialog.show" persistent>
      <q-card class="modern-dialog rounded-24 shadow-24" style="width: 500px">
        <q-card-section class="bg-gradient-portal text-white q-py-lg">
          <div class="row items-center no-wrap">
            <q-icon name="domain" size="md" class="q-mr-md" />
            <div class="column">
              <div class="text-h6 font-bold">{{ campusDialog.data.id_campus ? 'Editar Campus' : 'Nuevo Campus Universitario' }}</div>
              <div class="text-caption opacity-80">Configuración de establecimientos educativos</div>
            </div>
          </div>
        </q-card-section>
        
        <q-card-section class="q-pa-xl">
          <q-form @submit="saveCampus" class="q-gutter-y-lg">
            <q-input v-model="campusDialog.data.nombre" label="Nombre del Campus" outlined class="modern-input" lazy-rules :rules="[val => !!val || 'Requerido']" />
            <q-input v-model="campusDialog.data.sigla" label="Sigla" outlined class="modern-input" lazy-rules :rules="[val => !!val || 'Requerido']" />
            
            <q-select
              v-model="campusDialog.data.id_sede"
              :options="geoStore.sedes"
              option-label="nombre"
              option-value="id_sede"
              label="Pertenece a la Sede"
              outlined
              emit-value
              map-options
              class="modern-input"
              lazy-rules
              :rules="[val => !!val || 'Requerido']"
            >
               <template v-slot:prepend><q-icon name="apartment" color="teal" /></template>
            </q-select>

            <q-input v-model="campusDialog.data.direccion" label="Dirección / Ubicación Exacta" outlined class="modern-input" />

            <div class="q-pa-md bg-grey-1 rounded-12">
               <q-toggle v-model="campusDialog.data.activo" label="Campus Habilitado" color="teal" class="text-weight-bold" />
            </div>

            <div class="row justify-end q-gutter-x-md q-mt-xl">
              <q-btn flat label="Cancelar" color="grey-7" v-close-popup class="rounded-12 q-px-lg" />
              <q-btn label="Guardar Campus" type="submit" class="btn-gradient-portal rounded-12 q-px-xl text-white shadow-lift shadow-teal" :loading="geoStore.loading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useGeoStore } from '../stores/useGeoStore'
import { useQuasar, QTableColumn } from 'quasar'

const $q = useQuasar()
const geoStore = useGeoStore()

const tab = ref('sedes')

// Columns: Sedes
const sedeColumns: QTableColumn[] = [
  { name: 'nombre', label: 'Nombre Sede', align: 'left', field: 'nombre', sortable: true },
  { name: 'sigla', label: 'Sigla', align: 'left', field: 'sigla', sortable: true },
  { name: 'departamento', label: 'Departamento / Ubicación', align: 'left', field: 'id_departamento' },
  { name: 'status', label: 'Estado', align: 'center', field: 'activo' },
  { name: 'actions', label: 'Acciones', align: 'center', field: 'id_sede' },
]

// Columns: Campus
const campusColumns: QTableColumn[] = [
  { name: 'nombre', label: 'Nombre Campus', align: 'left', field: 'nombre', sortable: true },
  { name: 'sigla', label: 'Sigla', align: 'left', field: 'sigla', sortable: true },
  { name: 'sede', label: 'Sede Perteneciente', align: 'left', field: 'id_sede' },
  { name: 'direccion', label: 'Dirección', align: 'left', field: 'direccion' },
  { name: 'status', label: 'Estado', align: 'center', field: 'activo' },
  { name: 'actions', label: 'Acciones', align: 'center', field: 'id_campus' },
]

const sedeDialog = reactive({ show: false, data: { id_sede: null, nombre: '', sigla: '', id_departamento: null, activo: true } })
const campusDialog = reactive({ show: false, data: { id_campus: null, nombre: '', sigla: '', id_sede: null, direccion: '', activo: true } })

onMounted(async () => {
  await Promise.all([
    geoStore.fetchSedes(),
    geoStore.fetchCampus(),
    geoStore.fetchDepartamentos(2) // Bolivia ID confirmed is 2 from Tinker
  ])
})

// SEDE LOGIC
const openSedeDialog = (item?: any) => {
  if (item) {
    sedeDialog.data = { ...item }
  } else {
    sedeDialog.data = { id_sede: null, nombre: '', sigla: '', id_departamento: null, activo: true }
  }
  sedeDialog.show = true
}

const saveSede = async () => {
  await geoStore.saveSede(sedeDialog.data)
  $q.notify({ type: 'positive', message: 'Sede guardada' })
  sedeDialog.show = false
}

const toggleSedeStatus = async (item: any) => {
  await geoStore.saveSede({ id_sede: item.id_sede, activo: item.activo })
}

const confirmDeleteSede = (item: any) => {
  $q.dialog({
    title: 'Eliminar Sede',
    message: `¿Estás seguro de eliminar la sede "${item.nombre}"? Esto eliminará también sus campus.`,
    cancel: true,
    ok: { color: 'red-8', label: 'Eliminar' }
  }).onOk(async () => {
    await geoStore.deleteSede(item.id_sede)
    $q.notify({ type: 'positive', message: 'Sede eliminada' })
  })
}

// CAMPUS LOGIC
const openCampusDialog = (item?: any) => {
  if (item) {
    campusDialog.data = { ...item }
  } else {
    campusDialog.data = { id_campus: null, nombre: '', sigla: '', id_sede: null, direccion: '', activo: true }
  }
  campusDialog.show = true
}

const saveCampus = async () => {
  await geoStore.saveCampus(campusDialog.data)
  $q.notify({ type: 'positive', message: 'Campus guardado' })
  campusDialog.show = false
}

const toggleCampusStatus = async (item: any) => {
  await geoStore.saveCampus({ id_campus: item.id_campus, activo: item.activo })
}

const confirmDeleteCampus = (item: any) => {
  $q.dialog({
    title: 'Eliminar Campus',
    message: `¿Estás seguro de eliminar el campus "${item.nombre}"?`,
    cancel: true,
    ok: { color: 'red-8', label: 'Eliminar' }
  }).onOk(async () => {
    await geoStore.deleteCampus(item.id_campus)
    $q.notify({ type: 'positive', message: 'Campus eliminado' })
  })
}
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

.transition-hover:hover {
  background: rgba(0,0,0,0.02);
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
