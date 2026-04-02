<template>
  <q-page class="sigeth-page animate-fade">
    
    <!-- 1. HEADER -->
    <div class="page-hero q-mb-lg">
      <div class="page-hero__left">
        <div class="page-hero__title text-h4">Dashboard Principal</div>
        <div class="page-hero__subtitle text-grey-6">
          Gestión actualizada de <span class="text-primary text-weight-bold">Talento Humano</span>
        </div>
      </div>
      <div class="page-hero__actions">
        <q-btn unelevated rounded color="primary" icon="refresh" label="Sincronizar" @click="loadData" :loading="loading" class="btn-glow" />
      </div>
    </div>

    <!-- 1.5 MIS APLICACIONES (PORTAL) -->
    <div v-if="externalSystems.length > 0" class="q-mb-xl">
      <div class="text-h6 text-weight-bold q-mb-md row items-center">
        <q-icon name="apps" color="primary" class="q-mr-sm" size="28px" />
        Portal de Aplicaciones
        <q-space />
        <q-chip outline color="secondary" size="sm" icon="info">Sistemas externos autorizados</q-chip>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-4" v-for="sys in (externalSystems as any[])" :key="sys.sistema">
          <q-card class="app-card cursor-pointer" @click="goToSystem(sys.url)" v-ripple>
            <q-card-section class="row items-center no-wrap">
              <q-avatar size="56px" :color="getSysColor(sys.sistema)" text-color="white" class="shadow-3 q-mr-md text-weight-bolder text-h5">
                {{ sys.sistema.substring(0, 2).toUpperCase() }}
              </q-avatar>
              <div class="column">
                <div class="text-h6 text-weight-bolder" style="line-height: 1.2">{{ sys.sistema }}</div>
                <div class="text-caption text-grey-7 q-mt-xs text-weight-medium">
                  {{ sys.roles.length }} {{ sys.roles.length === 1 ? 'Rol' : 'Roles' }} &bull; 
                  {{ sys.permissions.length }} {{ sys.permissions.length === 1 ? 'Permiso' : 'Permisos' }}
                </div>
              </div>
              <q-space />
              <q-btn flat round dense icon="launch" color="grey-5" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- 2. RESUMEN DE TARJETAS (ESTADÍSTICAS REALES) -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <!-- Total Activos -->
      <div class="col-12 col-sm-6 col-md-3">
        <div class="stat-card">
          <div class="stat-card__icon-wrap bg-primary-light">
            <q-icon name="group" color="primary" size="28px" />
          </div>
          <div class="stat-card__value">{{ stats?.total_active || 0 }}</div>
          <div class="stat-card__label">Personal Activo</div>
        </div>
      </div>

      <!-- Tarjetas por Género (Dinámicas) -->
      <div class="col-12 col-sm-6 col-md-3" v-for="gender in stats?.genders" :key="gender.label">
        <div class="stat-card">
          <div class="stat-card__icon-wrap" :class="gender.label === 'Masculino' ? 'bg-blue-light' : 'bg-pink-light'">
            <q-icon :name="gender.label === 'Masculino' ? 'male' : 'female'" :color="gender.label === 'Masculino' ? 'blue' : 'pink'" size="28px" />
          </div>
          <div class="stat-card__value">{{ gender.value }}</div>
          <div class="stat-card__label">{{ gender.label }}</div>
        </div>
      </div>

      <!-- Alertas de Contrato (Fija para que se vea lleno) -->
      <div class="col-12 col-sm-6 col-md-3">
        <div class="stat-card">
          <div class="stat-card__icon-wrap bg-orange-light">
            <q-icon name="warning" color="orange" size="28px" />
          </div>
          <div class="stat-card__value">0</div>
          <div class="stat-card__label">Contratos por vencer</div>
        </div>
      </div>
    </div>

    <!-- 3. DETALLE DE DISTRIBUCIÓN -->
    <div class="row q-col-gutter-lg">
      <!-- Sedes -->
      <div class="col-12 col-md-6">
        <div class="sigeth-card">
          <div class="text-subtitle1 text-weight-bold q-mb-md row items-center">
            <q-icon name="location_city" color="primary" class="q-mr-sm" />
            Personal por Sede
          </div>
          <q-list separator>
            <q-item v-for="sede in stats?.sedes" :key="sede.label" class="q-py-md">
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ sede.label }}</q-item-label>
                <q-linear-progress 
                  :value="sede.value / (stats?.total_active || 1)" 
                  color="primary" 
                  class="q-mt-xs" 
                  rounded 
                  size="10px" 
                />
              </q-item-section>
              <q-item-section side>
                <q-badge color="primary" rounded class="q-pa-xs q-px-sm">{{ sede.value }}</q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <!-- Áreas -->
      <div class="col-12 col-md-6">
        <div class="sigeth-card">
          <div class="text-subtitle1 text-weight-bold q-mb-md row items-center">
            <q-icon name="hub" color="secondary" class="q-mr-sm" />
            Distribución por Área
          </div>
          <q-list separator>
            <q-item v-for="area in stats?.areas" :key="area.label" class="q-py-md">
              <q-item-section>
                <q-item-label class="text-weight-medium text-truncate" style="max-width: 250px">{{ area.label }}</q-item-label>
                <q-linear-progress 
                  :value="area.value / (stats?.total_active || 1)" 
                  color="secondary" 
                  class="q-mt-xs" 
                  rounded 
                  size="10px" 
                />
              </q-item-section>
              <q-item-section side>
                <q-badge color="secondary" rounded class="q-pa-xs q-px-sm">{{ area.value }}</q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <!-- Altas Recientes -->
      <div class="col-12 q-mt-md">
        <div class="sigeth-table-wrap">
          <div class="table-toolbar row items-center q-pa-md">
            <div class="text-subtitle1 text-weight-bold">Incorporaciones Recientes</div>
            <q-space />
            <q-btn flat rounded dense color="primary" label="Ver listado completo" to="/personal" no-caps icon-right="chevron_right" />
          </div>
          <q-table
            :rows="stats?.recent || []"
            :columns="recentColumns"
            flat
            hide-pagination
            class="sigeth-table"
          >
            <template v-slot:body-cell-nombre="props">
              <q-td :props="props">
                <div class="row items-center no-wrap">
                  <q-avatar size="32px" class="q-mr-sm shadow-1">
                    <img :src="`https://ui-avatars.com/api/?name=${props.row.persona.primer_apellido}+${props.row.persona.nombres}&background=6A37A3&color=fff&bold=true`" />
                  </q-avatar>
                  <div class="column">
                    <span class="text-weight-bold">{{ props.row.persona.primer_apellido }}, {{ props.row.persona.nombres }}</span>
                    <span class="text-caption text-grey-6">CI: {{ props.row.persona.ci }}</span>
                  </div>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-fecha="props">
              <q-td :props="props" class="text-grey-7">
                {{ new Date(props.row.created_at).toLocaleDateString() }}
              </q-td>
            </template>
            <template v-slot:body-cell-cargo="props">
              <q-td :props="props">
                <div class="text-weight-medium">{{ props.row.contrato_activo?.cargo?.nombre_cargo || 'Sin cargo' }}</div>
                <div class="text-caption text-secondary">{{ props.row.contrato_activo?.area?.nombre_area }}</div>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePersonalStore } from 'stores/personalStore'
import { useAuthStore } from 'src/modules/auth/stores/useAuthStore'
import { QTableColumn } from 'quasar'

const personalStore = usePersonalStore()
const authStore = useAuthStore()
const loading = ref(false)

const stats = computed(() => personalStore.stats)

// Extraer sistemas externos asignados al usuario actual
const externalSystems = computed(() => {
  const metadata = authStore.user?.access_metadata || {}
  return Object.values(metadata).filter((sys: any) => sys.url && sys.sistema.toUpperCase() !== 'SIGETH')
})

const goToSystem = (url: string) => {
  if (!url) return;

  // Si es un sistema hermano (SISPO o SIGVA), pasarle el token actual para login automático
  const token = authStore.token;
  const user = authStore.user;

  if (token && user) {
    const userStr = btoa(unescape(encodeURIComponent(JSON.stringify(user))));
    const isSispo = url.toLowerCase().includes(':9001') || url.toLowerCase().includes('sispo');
    const isSigva = url.toLowerCase().includes(':9002') || url.toLowerCase().includes('sigva');
    
    let finalUrl = '';
    const separator = url.includes('?') ? '&' : '?';

    if (isSispo) {
      finalUrl = `${url}/#/login?token=${token}&user=${userStr}`;
    } else if (isSigva) {
      finalUrl = `${url}/admin/login?token=${token}&user=${userStr}`;
    } else {
      finalUrl = `${url}${separator}token=${token}&user=${userStr}`;
    }
    
    window.open(finalUrl, '_blank');
  } else {
    window.open(url, '_blank');
  }
}

const getSysColor = (sistema: string) => {
  const s = sistema.toLowerCase()
  if (s.includes('sispo')) return 'deep-purple-9'
  if (s.includes('sigva')) return 'teal-7'
  return 'primary'
}

const recentColumns: QTableColumn[] = [
  { name: 'nombre', label: 'Funcionario', field: 'id_empleado', align: 'left' },
  { name: 'cargo', label: 'Cargo / Unidad', field: 'id_empleado', align: 'left' },
  { name: 'fecha', label: 'Fecha de Alta', field: 'created_at', align: 'right' },
]

const loadData = async () => {
  loading.value = true
  await personalStore.fetchStats()
  loading.value = false
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
// ESTILOS DE LAS TARJETAS (STAT CARDS)
.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 24px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
  }

  &__icon-wrap {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  &__value {
    font-size: 2.2rem;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 4px;
    color: var(--text-primary);
  }

  &__label {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

// COLORES DE FONDO PARA ICONOS
.bg-primary-light { background: rgba(106, 55, 163, 0.12); }
.bg-blue-light { background: rgba(21, 101, 192, 0.12); }
.bg-pink-light { background: rgba(216, 27, 96, 0.12); }
.bg-orange-light { background: rgba(255, 145, 0, 0.12); }

.sigeth-card {
  padding: 24px;
  border-radius: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  height: 100%;
}

.animate-fade {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// ESTILO PARA LAS TARJETAS DE APLICACIONES EXTERNAS
.app-card {
  border-radius: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.08);
    border-color: rgba(106, 55, 163, 0.3);
  }
}
</style>
