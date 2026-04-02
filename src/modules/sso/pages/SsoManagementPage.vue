<template>
  <q-page class="q-pa-lg">
    <!-- Header Hero -->
    <div class="row items-center q-mb-xl animate-fade-in">
      <div class="col">
        <div class="row items-center q-gutter-x-md">
          <q-icon name="admin_panel_settings" size="48px" class="text-primary icon-glow" />
          <div class="column">
            <h1 class="text-h4 text-weight-bolder brand-text q-my-none">Gestión SSO & Accesos</h1>
            <p class="text-subtitle1 text-grey-7 q-mb-none font-medium">Control unificado de SIGETH, SISPO y SIGVA</p>
          </div>
        </div>
      </div>
      
      <div class="col-auto">
        <q-btn 
          v-if="tab === 'systems'"
          label="Nuevo Sistema" 
          icon="add" 
          class="btn-gradient-portal rounded-12 q-px-lg shadow-lift shadow-indigo" 
          @click="openSystemDialog()"
        />
        <q-btn 
          v-if="tab === 'roles'"
          label="Nuevo Rol" 
          icon="add_moderator" 
          class="btn-gradient-portal rounded-12 q-px-lg shadow-lift shadow-indigo" 
          @click="openRoleDialog()"
        />
      </div>
    </div>

    <!-- Main Content Tabs -->
    <div class="q-gutter-y-lg animate-slide-up">
      <q-card class="glass-card shadow-soft rounded-24 overflow-hidden border-glass">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey-7 bg-grey-1 q-pa-sm"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
          :breakpoint="0"
        >
          <q-tab name="systems" icon="apps" label="Aplicaciones" class="rounded-12 q-mx-xs transition-hover" />
          <q-tab name="roles" icon="verified_user" label="Roles y Permisos" class="rounded-12 q-mx-xs transition-hover" />
          <q-tab name="users" icon="group" label="Asignación a Usuarios" class="rounded-12 q-mx-xs transition-hover" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated class="bg-transparent">
          <!-- Systems Panel -->
          <q-tab-panel name="systems" class="q-pa-xl">
            <div class="row q-col-gutter-lg">
              <div v-for="sys in ssoStore.systems" :key="sys.id_sistema" class="col-12 col-md-4 col-sm-6">
                <q-card class="system-card overflow-hidden transition-3d shadow-sm hover-shadow-lg">
                  <div class="card-gradient-top"></div>
                  <q-card-section class="q-pt-xl q-pb-lg text-center">
                    <q-avatar size="100px" class="system-avatar shadow-lg q-mb-md">
                      <span class="text-h3 text-weight-bold text-gradient">{{ sys.sistema.charAt(0) }}</span>
                    </q-avatar>
                    
                    <div class="text-h5 text-weight-bold text-grey-9">{{ sys.sistema }}</div>
                    <div class="text-caption text-primary text-weight-medium q-mb-md letter-spacing-1 truncate">{{ sys.url_sistema }}</div>
                    
                    <q-chip outline color="primary" dense icon="security" class="q-px-md font-bold">
                      {{ sys.roles_count }} Roles | {{ sys.permissions_count }} Permisos
                    </q-chip>
                  </q-card-section>
                  
                  <q-separator inset opacity-30 />
                  
                  <q-card-actions align="center" class="q-py-md">
                    <q-btn flat round color="grey-6" icon="edit" @click="openSystemDialog(sys)" class="hover-primary" />
                    <q-btn flat round color="red-4" icon="delete_outline" @click="confirmDeleteSystem(sys)" />
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </q-tab-panel>

          <!-- Roles Panel -->
          <q-tab-panel name="roles" class="q-pa-xl">
             <q-table
              :rows="ssoStore.roles"
              :columns="roleColumns"
              row-key="id_rol"
              class="management-table no-shadow no-border bg-transparent"
              :loading="ssoStore.loading"
            >
              <template v-slot:body-cell-sistema="props">
                <q-td :props="props">
                  <q-chip dense color="indigo-1" text-color="indigo-9" class="text-weight-bold">
                    {{ props.row.sistema?.sistema }}
                  </q-chip>
                </q-td>
              </template>
              
              <template v-slot:body-cell-permissions="props">
                <q-td :props="props">
                  <div class="row q-gutter-xs">
                    <q-chip 
                      v-for="p in props.row.permissions" 
                      :key="p.id_permision"
                      dense 
                      size="sm" 
                      color="teal-1" 
                      text-color="teal-9"
                    >
                      {{ p.nombres }}
                    </q-chip>
                    <q-chip v-if="props.row.permissions.length === 0" dense size="sm" label="Sin permisos" outline color="grey-4" />
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="text-center">
                  <q-btn flat round dense icon="tune" color="primary" @click="openRoleDialog(props.row)" />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>

          <!-- Users Panel -->
          <q-tab-panel name="users" class="q-pa-xl">
            <q-table
              :rows="ssoStore.users"
              :columns="userColumns"
              row-key="id_user"
              class="management-table no-shadow no-border bg-transparent"
              :loading="ssoStore.loading"
            >
              <template v-slot:body-cell-roles="props">
                <q-td :props="props">
                  <div class="row q-gutter-xs">
                    <q-chip 
                      v-for="r in props.row.roles" 
                      :key="r.id_rol"
                      dense 
                      size="sm" 
                      class="role-chip glow-indigo"
                    >
                      <q-avatar color="indigo" text-color="white" size="xs">
                        {{ r.sistema?.sistema.charAt(0) }}
                      </q-avatar>
                      {{ r.nombres }}
                    </q-chip>
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="text-center">
                  <q-btn flat round dense icon="group_add" color="secondary" @click="openUserRolesDialog(props.row)" />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>

    <!-- DIALOGS -->

    <!-- System Dialog -->
    <q-dialog v-model="systemDialog.show" persistent>
      <q-card class="modern-dialog rounded-24" style="width: 500px">
        <q-card-section class="bg-gradient-portal text-white q-py-lg">
          <div class="text-h6 font-bold">{{ systemDialog.data.id_sistema ? 'Editar Aplicación' : 'Nueva Aplicación SISPO/SIGVA' }}</div>
        </q-card-section>
        
        <q-card-section class="q-pa-xl">
          <q-form @submit="saveSystem" class="q-gutter-y-lg">
            <q-input
              v-model="systemDialog.data.sistema"
              label="Nombre del Sistema"
              outlined
              class="modern-input"
              lazy-rules
              :rules="[val => !!val || 'Requerido']"
            />
            <q-input
              v-model="systemDialog.data.url_sistema"
              label="URL Base (Frontend/SSO)"
              outlined
              class="modern-input"
              placeholder="http://localhost:3000"
              lazy-rules
              :rules="[val => !!val || 'Requerido']"
            />
            
            <div class="row justify-end q-gutter-x-md q-mt-xl">
              <q-btn flat label="Cancelar" color="grey-7" v-close-popup class="rounded-12" />
              <q-btn label="Guardar" type="submit" class="btn-gradient-portal rounded-12 q-px-xl" :loading="ssoStore.loading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Role Dialog (with permissions) -->
    <q-dialog v-model="roleDialog.show" persistent>
      <q-card class="modern-dialog rounded-24" style="width: 700px; max-width: 90vw;">
        <q-card-section class="bg-gradient-indigo text-white q-py-lg">
          <div class="text-h6 font-bold">Configurar Rol y Permisos</div>
        </q-card-section>
        
        <q-card-section class="q-pa-xl">
          <q-form @submit="saveRole" class="q-gutter-y-lg">
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="roleDialog.data.nombres"
                  label="Nombre del Rol"
                  outlined
                  class="modern-input"
                  lazy-rules
                  :rules="[val => !!val || 'Requerido']"
                />
              </div>
              <div class="col-12 col-md-6">
                 <q-select
                    v-model="roleDialog.data.sistema_id"
                    :options="ssoStore.systems"
                    option-label="sistema"
                    option-value="id_sistema"
                    label="Sistema Destino"
                    outlined
                    emit-value
                    map-options
                    class="modern-input"
                    @update:model-value="onRoleSystemChange"
                  />
              </div>
            </div>

            <div class="q-mt-lg">
              <div class="text-subtitle1 text-weight-bold q-mb-md">Permisos para este sistema</div>
              <div v-if="!roleDialog.data.sistema_id" class="text-grey-6 text-italic">
                Seleccione un sistema para cargar los permisos disponibles.
              </div>
              <div v-else class="row q-col-gutter-sm permissions-container">
                <div v-for="p in availablePermissions" :key="p.id_permision" class="col-12 col-sm-6">
                   <q-checkbox 
                    v-model="roleDialog.data.permission_ids" 
                    :val="p.id_permision" 
                    :label="p.nombres" 
                    class="permission-check rounded-12 transition-hover"
                  />
                </div>
                <!-- Mini form to add new permission to this system -->
                <div class="col-12 q-mt-md">
                   <div class="row q-gutter-x-sm items-center no-wrap bg-indigo-1 q-pa-sm rounded-12">
                      <q-input 
                        v-model="newPermName" 
                        dense 
                        borderless 
                        placeholder="Agregar nuevo permiso..." 
                        class="col"
                        @keyup.enter="addPermissionToSystem"
                      />
                      <q-btn round flat icon="add" color="indigo" @click="addPermissionToSystem" />
                   </div>
                </div>
              </div>
            </div>
            
            <div class="row justify-end q-gutter-x-md q-mt-xl">
              <q-btn flat label="Cancelar" color="grey-7" v-close-popup class="rounded-12" />
              <q-btn label="Guardar Configuración" type="submit" class="btn-gradient-portal rounded-12 q-px-xl" :loading="ssoStore.loading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- User Roles Assignment Dialog -->
    <q-dialog v-model="userDialog.show" persistent>
      <q-card class="modern-dialog rounded-24" style="width: 600px;">
        <q-card-section class="bg-gradient-teal text-white q-py-lg">
           <div class="row items-center no-wrap">
             <q-avatar size="50px" color="white" text-color="teal" class="q-mr-md font-bold">
               {{ userDialog.data.username?.charAt(0).toUpperCase() }}
             </q-avatar>
             <div class="column">
               <div class="text-h6 font-bold">Asignar Roles a Usuario</div>
               <div class="text-caption opacity-80">{{ userDialog.data.username }}</div>
             </div>
           </div>
        </q-card-section>
        
        <q-card-section class="q-pa-xl">
           <div class="text-subtitle1 text-weight-bold q-mb-md">Seleccione los roles permitidos</div>
           
           <div class="user-roles-grid">
              <div v-for="sys in ssoStore.systems" :key="sys.id_sistema" class="sys-group q-mb-lg">
                 <div class="text-caption text-weight-bolder text-grey-6 q-mb-xs letter-spacing-1">{{ sys.sistema.toUpperCase() }}</div>
                 <div class="row q-gutter-sm">
                    <q-checkbox 
                      v-for="r in getRolesBySystem(sys.id_sistema)" 
                      :key="r.id_rol"
                      v-model="userDialog.data.role_ids"
                      :val="r.id_rol"
                      :label="r.nombres"
                      class="role-check-mini rounded-8"
                    />
                 </div>
              </div>
           </div>

           <div class="row justify-end q-gutter-x-md q-mt-xl">
              <q-btn flat label="Cancelar" color="grey-7" v-close-popup class="rounded-12" />
              <q-btn label="Guardar Cambios" class="btn-gradient-teal rounded-12 q-px-xl text-white" @click="saveUserRoles" :loading="ssoStore.loading" />
            </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useSsoStore } from '../stores/useSsoStore'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const ssoStore = useSsoStore()

const tab = ref('systems')
const newPermName = ref('')

// Table Columns
const roleColumns: any[] = [
  { name: 'nombres', label: 'Rol', align: 'left', field: 'nombres', sortable: true },
  { name: 'sistema', label: 'Sistema Destino', align: 'left', field: 'sistema', sortable: true },
  { name: 'permissions', label: 'Permisos', align: 'left', field: 'permissions' },
  { name: 'actions', label: 'Gestionar', align: 'center', field: 'actions' },
]

const userColumns: any[] = [
  { name: 'username', label: 'Usuario', align: 'left', field: 'username', sortable: true },
  { name: 'roles', label: 'Roles Asignados (Multi-System)', align: 'left', field: 'roles' },
  { name: 'actions', label: 'Acciones', align: 'center', field: 'actions' },
]

// Dialogs state
const systemDialog = reactive({ show: false, data: { id_sistema: null, sistema: '', url_sistema: '' } })
const roleDialog = reactive({ show: false, data: { id_rol: null, nombres: '', sistema_id: null, permission_ids: [] as number[] } })
const userDialog = reactive({ show: false, data: { id_user: null, username: '', role_ids: [] as number[] } })

onMounted(async () => {
  await Promise.all([
    ssoStore.fetchSystems(),
    ssoStore.fetchRoles(),
    ssoStore.fetchUsers()
  ])
})

// Logic Methods
const openSystemDialog = (item?: any) => {
  systemDialog.data = item ? { ...item } : { id_sistema: null, sistema: '', url_sistema: '' }
  systemDialog.show = true
}

const saveSystem = async () => {
  try {
    await ssoStore.saveSystem(systemDialog.data)
    $q.notify({ type: 'positive', message: 'Sistema guardado con éxito' })
    systemDialog.show = false
  } catch {
    $q.notify({ type: 'negative', message: 'Error al guardar sistema' })
  }
}

const confirmDeleteSystem = (sys: any) => {
  $q.dialog({
    title: 'Confirmar Eliminación',
    message: `¿Estás seguro de eliminar el sistema ${sys.sistema}? Se perderán todos sus roles asociados.`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await ssoStore.removeSystem(sys.id_sistema)
    $q.notify({ type: 'warning', icon: 'delete', message: 'Sistema eliminado' })
  })
}

const openRoleDialog = async (item?: any) => {
  if (item) {
    roleDialog.data = {
      id_rol: item.id_rol,
      nombres: item.nombres,
      sistema_id: item.sistema_id,
      permission_ids: item.permissions.map((p: any) => p.id_permision)
    }
    await onRoleSystemChange(item.sistema_id)
  } else {
    roleDialog.data = { id_rol: null, nombres: '', sistema_id: null, permission_ids: [] }
  }
  roleDialog.show = true
}

const onRoleSystemChange = async (sistemaId: number) => {
  if (sistemaId) {
    await ssoStore.fetchPermissions(sistemaId)
  }
}

const saveRole = async () => {
  try {
    await ssoStore.saveRole(roleDialog.data)
    $q.notify({ type: 'positive', message: 'Rol configurado correctamente' })
    roleDialog.show = false
    await ssoStore.fetchUsers() // Refresh users as roles might have changed
  } catch {
    $q.notify({ type: 'negative', message: 'Error al guardar rol' })
  }
}

const addPermissionToSystem = async () => {
  if (!newPermName.value || !roleDialog.data.sistema_id) return
  
  try {
    await ssoStore.savePermission({
      nombres: newPermName.value,
      sistema_id: roleDialog.data.sistema_id
    })
    newPermName.value = ''
    $q.notify({ position: 'top-right', color: 'indigo', message: 'Permiso agregado' })
  } catch {
    $q.notify({ type: 'negative', message: 'Error' })
  }
}

const availablePermissions = computed(() => ssoStore.permissions)

const openUserRolesDialog = (user: any) => {
  userDialog.data = {
    id_user: user.id_user,
    username: user.username,
    role_ids: user.roles.map((r: any) => r.id_rol)
  }
  userDialog.show = true
}

const getRolesBySystem = (sistemaId: number) => {
  return ssoStore.roles.filter(r => r.sistema_id === sistemaId)
}

const saveUserRoles = async () => {
  try {
    await ssoStore.assignRolesToUser(userDialog.data.id_user as any, userDialog.data.role_ids)
    $q.notify({ type: 'positive', message: 'Roles de usuario actualizados' })
    userDialog.show = false
  } catch {
    $q.notify({ type: 'negative', message: 'Error al asignar roles' })
  }
}
</script>

<style lang="scss" scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.border-glass {
  border: 1px solid rgba(255, 255, 255, 0.5);
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

.rounded-12 { border-radius: 12px !important; }
.rounded-24 { border-radius: 24px !important; }

.system-card {
  border-radius: 20px;
  position: relative;
  background: white;
  
  .card-gradient-top {
    height: 80px;
    background: linear-gradient(135deg, #6A37A3 0%, #00968B 100%);
    opacity: 0.1;
    position: absolute;
    top: 0; left: 0; right: 0;
  }
}

.system-avatar {
  background: white;
  border: 2px solid #6A37A3;
  .text-gradient {
    background: linear-gradient(135deg, #6A37A3 0%, #00968B 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.shadow-soft { box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
.shadow-indigo { box-shadow: 0 10px 20px rgba(106, 55, 163, 0.2); }

.bg-gradient-indigo { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); }
.bg-gradient-teal { background: linear-gradient(135deg, #0d9488 0%, #00A99D 100%); }

.modern-input {
  :deep(.q-field__control) {
    border-radius: 12px !important;
    background: rgba(244, 246, 248, 0.8) !important;
  }
}

.transition-hover:hover {
  background: rgba(0,0,0,0.02);
}

.transition-3d:hover {
  transform: translateY(-8px);
}

.management-table {
  :deep(thead th) {
    font-weight: 800;
    text-transform: uppercase;
    font-size: 11px;
    color: #64748b;
    letter-spacing: 1px;
    padding: 16px;
  }
  
  :deep(tbody td) {
    padding: 16px;
    font-size: 14px;
  }
}

.permissions-container {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
}

.permission-check {
  border: 1px solid #f1f5f9;
  padding: 4px;
  &:hover {
    background: #f8fafc;
  }
}

.role-chip {
  background: #f1f5f9;
  color: #1e293b;
  font-weight: 700;
  border: 1px solid #e2e8f0;
}

.glow-indigo {
  &:hover {
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
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

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
