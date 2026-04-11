<template>
  <q-page class="q-pa-lg">
    <!-- Header Hero -->
    <div class="row items-center q-mb-lg animate-fade-in">
      <div class="col">
        <div class="row items-center q-gutter-x-md">
          <q-icon name="admin_panel_settings" size="38px" class="text-primary icon-glow" />
          <div class="column">
            <h1 class="text-h5 text-weight-bolder brand-text q-my-none">Gestión SSO & Accesos</h1>
            <p class="text-caption text-grey-7 q-mb-none font-medium">Control unificado de SIGETH, SISPO y SIGVA</p>
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
        <q-btn 
          v-if="tab === 'users'"
          label="Nuevo Usuario" 
          icon="person_add" 
          class="btn-gradient-portal rounded-12 q-px-lg shadow-lift shadow-indigo" 
          @click="openNewUserDialog()"
        />
      </div>
    </div>

    <!-- Main Content Tabs -->
    <div class="q-gutter-y-lg animate-slide-up">
      <q-card class="glass-card shadow-soft rounded-24 overflow-hidden border-glass">
        <q-tabs
          v-model="tab"
          class="text-grey-7 bg-grey-1 q-pa-md"
          active-color="white"
          indicator-color="transparent"
          active-class="bg-gradient-portal shadow-md text-white font-bold"
          align="left"
          no-caps
          dense
          :breakpoint="0"
        >
          <q-tab name="systems" icon="apps" label="Aplicaciones" class="rounded-12 q-mx-xs q-px-lg transition-hover text-weight-bold" no-caps />
          <q-tab name="roles" icon="admin_panel_settings" label="Roles y Permisos" class="rounded-12 q-mx-xs q-px-lg transition-hover text-weight-bold" no-caps />
          <q-tab name="users" icon="manage_accounts" label="Asignación a Usuarios" class="rounded-12 q-mx-xs q-px-lg transition-hover text-weight-bold" no-caps />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated class="bg-transparent">
          <!-- Systems Panel -->
          <q-tab-panel name="systems" class="q-pa-lg">
            <div class="row q-col-gutter-lg">
              <div v-for="sys in ssoStore.systems" :key="sys.id_sistema" class="col-12 col-md-4 col-sm-6">
                <q-card class="system-card overflow-hidden transition-3d shadow-sm hover-shadow-lg">
                   <div class="card-gradient-top"></div>
                  <q-card-section class="q-pt-lg q-pb-md text-center">
                    <q-avatar size="80px" class="system-avatar shadow-lg q-mb-md">
                      <span class="text-h4 text-weight-bold text-gradient">{{ sys.sistema.charAt(0) }}</span>
                    </q-avatar>
                    
                    <div class="text-h6 text-weight-bold text-grey-9">{{ sys.sistema }}</div>
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
          <q-tab-panel name="roles" class="q-pa-lg">
             <q-table
              :rows="ssoStore.roles"
              :columns="roleColumns"
              row-key="id_rol"
              dense
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
          <q-tab-panel name="users" class="q-pa-lg">
            <q-table
              :rows="ssoStore.users"
              :columns="userColumns"
              row-key="id_user"
              dense
              class="management-table no-shadow no-border bg-transparent"
              :loading="ssoStore.loading"
            >
              <!-- ESTATUS -->
              <template v-slot:body-cell-activo="props">
                <q-td :props="props" class="text-center">
                  <q-toggle
                    v-model="props.row.activo"
                    color="teal"
                    @update:model-value="toggleStatus(props.row)"
                  />
                </q-td>
              </template>

              <!-- SEDE -->
              <template v-slot:body-cell-sede="props">
                <q-td :props="props">
                  <div v-if="props.row.id_sede_scope" class="text-indigo text-weight-bold">
                     <q-icon name="location_on" size="xs" /> {{ getSedeName(props.row.id_sede_scope) }}
                  </div>
                  <div v-else class="text-grey-6 italic">Alcance Nacional</div>
                </q-td>
              </template>

              <template v-slot:body-cell-roles="props">
                <q-td :props="props">
                  <div class="row q-gutter-xs">
                    <q-chip 
                      v-for="r in props.row.roles" 
                      :key="r.id_rol"
                      dense 
                      size="sm" 
                      class="role-chip glow-indigo shadow-1"
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
                  <div class="row no-wrap items-center justify-center q-gutter-x-sm">
                    <q-btn flat round dense icon="settings_suggest" color="indigo-7" @click="openAccessDialog(props.row)">
                      <q-tooltip>Gestionar Accesos y Alcance</q-tooltip>
                    </q-btn>
                    <q-btn flat round dense icon="lock_reset" color="orange-8" @click="resetPwd(props.row)">
                      <q-tooltip>Reiniciar Contraseña a CI</q-tooltip>
                    </q-btn>
                  </div>
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
        <q-card-section class="bg-gradient-portal text-white q-py-lg">
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
    <!-- GESTION DE ACCESOS Y ALCANCE (DIÁLOGO AVANZADO) -->
    <q-dialog v-model="userDialog.show" persistent>
      <q-card class="modern-dialog rounded-24 shadow-24" style="width: 750px; max-width: 95vw;">
        <q-card-section class="bg-gradient-portal text-white q-py-lg">
          <div class="row items-center no-wrap justify-between">
            <div class="row items-center no-wrap">
              <q-icon name="manage_accounts" size="md" class="q-mr-md" />
              <div class="column">
                <div class="text-h6 font-bold">Configuración de Seguridad y Alcance</div>
                <div class="text-caption opacity-80">Usuario: {{ userDialog.data.username }}</div>
              </div>
            </div>
            <!-- SWITCH DE ESTADO EN EL HEADER DEL DIÁLOGO -->
            <div class="column items-center">
               <q-toggle
                 v-model="userDialog.data.activo"
                 color="white"
                 keep-color
                 label="ACCESO HABILITADO"
                 left-label
                 class="text-weight-bold"
               />
            </div>
          </div>
        </q-card-section>
        
        <q-card-section class="q-pa-xl scroll" style="max-height: 60vh">
          <q-form id="accessForm" @submit="saveUserAccess" class="q-gutter-y-xl">
            
            <!-- ALCANCE POR SEDE -->
            <div class="config-section">
               <div class="text-subtitle1 font-bold text-indigo-9 q-mb-sm row items-center">
                 <q-icon name="location_searching" class="q-mr-sm" /> Alcance de Visibilidad por Sede
               </div>
               <q-select
                 v-model="userDialog.data.id_sede_scope"
                 :options="geoStore.sedes"
                 option-label="nombre"
                 option-value="id_sede"
                 label="Restringir a una Sede específica (Opcional)"
                 outlined
                 emit-value
                 map-options
                 class="modern-input"
                 clearable
               >
                 <template v-slot:prepend><q-icon name="apartment" color="indigo" /></template>
               </q-select>
               <div class="q-pa-md bg-indigo-1 rounded-12 q-mt-sm border-indigo-2" v-if="!userDialog.data.id_sede_scope">
                 <div class="text-caption text-indigo-9 italic row items-center">
                   <q-icon name="public" size="xs" class="q-mr-sm" />
                   Este usuario tiene <strong>Acceso Nacional</strong>. Puede gestionar datos de todas las sedes.
                 </div>
               </div>
            </div>

            <!-- ROLES ASIGNADOS (POR SISTEMA) -->
            <div class="config-section">
               <div class="text-subtitle1 font-bold text-teal-9 q-mb-md row items-center">
                 <q-icon name="admin_panel_settings" class="q-mr-sm" /> Roles y Sistemas
               </div>
               <div class="row q-gutter-md">
                 <div v-for="sys in ssoStore.systems" :key="sys.id_sistema" class="col-12 col-sm-5 q-pa-md bg-grey-1 rounded-12 border-grey-2 shadow-sm">
                    <div class="text-caption text-weight-bolder text-grey-8 q-mb-sm uppercase">{{ sys.sistema }}</div>
                    <div class="column q-gutter-y-xs">
                       <q-checkbox 
                        v-for="r in getRolesBySystem(sys.id_sistema)" 
                        :key="r.id_rol"
                        v-model="userDialog.data.role_ids"
                        :val="r.id_rol"
                        :label="r.nombres"
                        color="teal"
                        dense
                        class="text-caption"
                      />
                    </div>
                 </div>
               </div>
            </div>

          </q-form>
        </q-card-section>

        <!-- FOOTER: BOTONES FIJOS -->
        <q-separator />
        <q-card-actions align="right" class="q-pa-lg">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup class="rounded-12 q-px-lg" />
          <q-btn 
            label="Guardar Configuración" 
            form="accessForm"
            type="submit" 
            class="btn-gradient-portal rounded-12 q-px-xl text-white shadow-lift" 
            :loading="ssoStore.loading" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- NEW USER DIALOG -->
    <q-dialog v-model="newUserDialog.show" persistent>
      <q-card class="modern-dialog rounded-24" style="width: 500px">
        <q-card-section class="bg-gradient-portal text-white q-py-md">
          <div class="text-h6 font-bold">Habilitar Acceso al Sistema</div>
        </q-card-section>
        
        <q-card-section class="q-pa-lg">
          <q-form @submit="saveNewUser" class="q-gutter-y-md">
            <div class="text-caption text-grey-7 q-mb-md">Seleccione un funcionario que aún no tenga cuenta de acceso.</div>
            
            <q-select
              v-model="newUserDialog.data.id_persona"
              :options="ssoStore.personasWithoutUser"
              option-label="nombres"
              option-value="id"
              label="Funcionario / Empleado"
              outlined
              emit-value
              map-options
              class="modern-input"
              lazy-rules
              :rules="[val => !!val || 'Requerido']"
              @update:model-value="onPersonaForUserSelected"
            >
               <template v-slot:option="scope">
                 <q-item v-bind="scope.itemProps">
                   <q-item-section>
                     <q-item-label>{{ scope.opt.primer_apellido }} {{ scope.opt.nombres }}</q-item-label>
                     <q-item-label caption>CI: {{ scope.opt.ci }}</q-item-label>
                   </q-item-section>
                 </q-item>
               </template>
            </q-select>

            <q-input
              v-model="newUserDialog.data.username"
              label="Nombre de Usuario (Username)"
              outlined
              class="modern-input"
              placeholder="Ej: 13260003"
              lazy-rules
              :rules="[val => !!val || 'Requerido']"
            >
              <template #append>
                <q-btn flat dense icon="auto_fix_high" color="primary" @click="suggestUsername" />
              </template>
            </q-input>

            <q-input
              v-model="newUserDialog.data.password"
              :type="isNewUserPwd ? 'password' : 'text'"
              label="Contraseña"
              outlined
              class="modern-input"
              lazy-rules
              :rules="[val => !!val || 'Requerido', val => val.length >= 4 || 'Mín. 4 caracteres']"
            >
              <template v-slot:append>
                <q-icon
                  :name="isNewUserPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isNewUserPwd = !isNewUserPwd"
                />
              </template>
            </q-input>

            <div class="text-subtitle2 q-mt-md">Roles Iniciales:</div>
            <div class="row q-gutter-sm">
                <q-checkbox 
                  v-for="r in ssoStore.roles" 
                  :key="r.id_rol"
                  v-model="newUserDialog.data.role_ids"
                  :val="r.id_rol"
                  :label="`${r.sistema?.sistema}: ${r.nombres}`"
                  class="role-check-mini"
                />
            </div>

            <div class="row justify-end q-gutter-x-md q-mt-lg">
              <q-btn flat label="Cancelar" color="grey-7" v-close-popup class="rounded-12" />
              <q-btn label="Crear Cuenta" type="submit" class="btn-gradient-portal rounded-12 q-px-xl text-white" :loading="ssoStore.loading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useSsoStore } from '../stores/useSsoStore'
import { useGeoStore } from '../../geo/stores/useGeoStore'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const ssoStore = useSsoStore()
const geoStore = useGeoStore()

const tab = ref('systems')
const isNewUserPwd = ref(true)
const newPermName = ref('')

// Table Columns
const roleColumns: any[] = [
  { name: 'nombres', label: 'Rol', align: 'left', field: 'nombres', sortable: true },
  { name: 'sistema', label: 'Sistema Destino', align: 'left', field: 'sistema', sortable: true },
  { name: 'permissions', label: 'Permisos', align: 'left', field: 'permissions' },
  { name: 'actions', label: 'Gestionar', align: 'center', field: 'actions' },
]

const userColumns: any[] = [
  { name: 'activo', label: 'Estatus', align: 'center', field: 'activo' },
  { name: 'username', label: 'Usuario', align: 'left', field: 'username', sortable: true },
  { name: 'sede', label: 'Sede/Alcance', align: 'left', field: 'sede' },
  { name: 'roles', label: 'Accesos Habilitados', align: 'left', field: 'roles' },
  { name: 'actions', label: 'Acciones', align: 'center', field: 'actions' },
]

const sedeColumns: any[] = [
  { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre', sortable: true },
  { name: 'sigla', label: 'Sigla', align: 'left', field: 'sigla', sortable: true },
  { name: 'tipo', label: 'Nivel', align: 'left', field: 'id_sede_padre' },
  { name: 'padre', label: 'Dependencia', align: 'left', field: 'padre' },
  { name: 'status', label: 'Activo', align: 'center', field: 'activo' },
  { name: 'actions', label: 'Acciones', align: 'center', field: 'actions' },
]

// Dialogs state
const systemDialog = reactive({ show: false, data: { id_sistema: null, sistema: '', url_sistema: '' } })
const roleDialog = reactive({ show: false, data: { id_rol: null, nombres: '', sistema_id: null, permission_ids: [] as number[] } })
const userDialog = reactive({ show: false, data: { id_user: null, username: '', role_ids: [] as number[], id_sede_scope: null, activo: true } })
const newUserDialog = reactive({ show: false, data: { id_persona: null, username: '', password: '', role_ids: [] as number[] } })


onMounted(async () => {
  await Promise.all([
    ssoStore.fetchSystems(),
    ssoStore.fetchRoles(),
    ssoStore.fetchPermissions(),
    ssoStore.fetchUsers(),
    geoStore.fetchSedes()
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

const openAccessDialog = (user: any) => {
  userDialog.data = {
    id_user: user.id_user,
    username: user.username,
    role_ids: user.roles.map((r: any) => r.id_rol),
    id_sede_scope: user.id_sede_scope,
    activo: user.activo
  }
  userDialog.show = true
}

const getRolesBySystem = (sistemaId: number) => {
  return ssoStore.roles.filter(r => r.sistema_id === sistemaId)
}

const saveUserAccess = async () => {
  try {
    // 1. Update general access (roles and scope)
    await ssoStore.updateAccess(userDialog.data.id_user as any, {
      role_ids: userDialog.data.role_ids,
      id_sede_scope: userDialog.data.id_sede_scope
    })
    
    // 2. Check if status changed
    const userInStore = ssoStore.users.find(u => u.id_user === userDialog.data.id_user)
    if (userInStore && userInStore.activo !== userDialog.data.activo) {
       await ssoStore.toggleUserStatus(userDialog.data.id_user as any)
    }

    $q.notify({ type: 'positive', message: 'Configuración de seguridad actualizada' })
    userDialog.show = false
  } catch {
    $q.notify({ type: 'negative', message: 'Error al actualizar accesos' })
  }
}

const toggleStatus = async (user: any) => {
  try {
    const originalStatus = user.activo
    await ssoStore.toggleUserStatus(user.id_user)
    $q.notify({ 
      type: originalStatus ? 'warning' : 'positive', 
      message: originalStatus ? 'Usuario deshabilitado' : 'Usuario habilitado' 
    })
  } catch {
    user.activo = !user.activo // Revert visually
    $q.notify({ type: 'negative', message: 'Error al cambiar estatus' })
  }
}

const resetPwd = (user: any) => {
  $q.dialog({
    title: 'Confirmar Re-inicio',
    message: `¿Estás seguro de resetear la contraseña de ${user.username} a su número de CI? Deberá cambiarla al ingresar.`,
    cancel: true,
    persistent: true,
    ok: { label: 'SI, RESETEAR', color: 'orange-8', unelevated: true }
  }).onOk(async () => {
    try {
      await ssoStore.resetUserPassword(user.id_user)
      $q.notify({ type: 'positive', message: 'Contraseña restablecida correctamente' })
    } catch {
      $q.notify({ type: 'negative', message: 'Error al resetear contraseña' })
    }
  })
}

const getSedeName = (id: number) => {
  return geoStore.sedes.find(s => s.id_sede === id)?.nombre || id
}

// User Creation
const openNewUserDialog = async () => {
  newUserDialog.data = { id_persona: null, username: '', password: '', role_ids: [] }
  await ssoStore.fetchPersonasWithoutUser()
  newUserDialog.show = true
}

const onPersonaForUserSelected = (id: string) => {
  if (!id) return
  const persona = ssoStore.personasWithoutUser.find(p => p.id === id)
  if (persona) {
    newUserDialog.data.username = persona.ci
    newUserDialog.data.password = persona.ci // Predeterminado CI
  }
}

const suggestUsername = () => {
  onPersonaForUserSelected(newUserDialog.data.id_persona as any)
}

const saveNewUser = async () => {
  try {
    await ssoStore.createUser(newUserDialog.data)
    $q.notify({ type: 'positive', message: 'Usuario creado y habilitado correctamente' })
    newUserDialog.show = false
  } catch (err: any) {
    $q.notify({ 
      type: 'negative', 
      message: err.response?.data?.message || 'Error al crear usuario' 
    })
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
