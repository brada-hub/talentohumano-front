<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg q-col-gutter-md">
      <div class="col">
        <div class="text-h5 text-weight-bold brand-text">Estructura Institucional</div>
        <div class="text-caption text-grey-7">Gestiona grupos de personal, areas, cargos, funciones base y puestos con superiores.</div>
      </div>
      <div class="col-auto">
        <q-btn :label="actionLabel" icon="add" class="btn-gradient-portal text-white rounded-12 q-px-lg" @click="openByTab" />
      </div>
    </div>

    <q-card flat bordered class="rounded-20 overflow-hidden">
      <q-tabs v-model="tab" no-caps align="left" class="bg-grey-1 text-grey-7 q-pa-sm" active-color="white" indicator-color="transparent" active-class="bg-gradient-portal text-white rounded-16">
        <q-tab name="niveles" icon="stairs" label="Niveles" />
        <q-tab name="grupos" icon="groups" label="Grupos" />
        <q-tab name="areas" icon="schema" label="Areas" />
        <q-tab name="cargos" icon="badge" label="Cargos" />
        <q-tab name="puestos" icon="work_outline" label="Puestos" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="niveles" class="q-pa-none">
          <q-table :rows="store.niveles" :columns="nivelColumns" row-key="id_jerarquico" flat :loading="store.loading">
            <template #body-cell-activo="p"><q-td :props="p"><q-chip dense :color="p.row.activo ? 'green-1' : 'grey-3'" :text-color="p.row.activo ? 'green-9' : 'grey-8'">{{ p.row.activo ? 'Activo' : 'Inactivo' }}</q-chip></q-td></template>
            <template #body-cell-actions="p"><q-td :props="p" class="text-center"><q-btn flat round dense icon="edit" color="indigo" @click="openNivel(p.row)" /><q-btn flat round dense icon="delete_outline" color="red" @click="dropNivel(p.row)" /></q-td></template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="grupos" class="q-pa-none">
          <q-table :rows="store.grupos" :columns="grupoColumns" row-key="id_grupo_personal" flat :loading="store.loading">
            <template #body-cell-activo="p"><q-td :props="p"><q-chip dense :color="p.row.activo ? 'green-1' : 'grey-3'" :text-color="p.row.activo ? 'green-9' : 'grey-8'">{{ p.row.activo ? 'Activo' : 'Inactivo' }}</q-chip></q-td></template>
            <template #body-cell-actions="p"><q-td :props="p" class="text-center"><q-btn flat round dense icon="edit" color="teal" @click="openGrupo(p.row)" /><q-btn flat round dense icon="delete_outline" color="red" @click="dropGrupo(p.row)" /></q-td></template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="areas" class="q-pa-none">
          <q-table :rows="store.areas" :columns="areaColumns" row-key="id_area" flat :loading="store.loading">
            <template #body-cell-parent="p"><q-td :props="p"><q-chip v-if="p.row.parent?.nombre_area" dense color="indigo-1" text-color="indigo-9">{{ p.row.parent.nombre_area }}</q-chip><span v-else class="text-grey-6">Principal</span></q-td></template>
            <template #body-cell-activo="p"><q-td :props="p"><q-chip dense :color="p.row.activo ? 'green-1' : 'grey-3'" :text-color="p.row.activo ? 'green-9' : 'grey-8'">{{ p.row.activo ? 'Activo' : 'Inactivo' }}</q-chip></q-td></template>
            <template #body-cell-actions="p"><q-td :props="p" class="text-center"><q-btn flat round dense icon="edit" color="indigo" @click="openArea(p.row)" /><q-btn flat round dense icon="delete_outline" color="red" @click="dropArea(p.row)" /></q-td></template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="cargos" class="q-pa-none">
          <q-table :rows="store.cargos" :columns="cargoColumns" row-key="id_cargo" flat :loading="store.loading">
            <template #body-cell-nivel="p"><q-td :props="p"><q-chip v-if="nivelName(p.row)" dense color="teal-1" text-color="teal-9">{{ nivelName(p.row) }}</q-chip><span v-else class="text-grey-6">Sin nivel</span></q-td></template>
            <template #body-cell-funciones="p"><q-td :props="p"><q-chip dense color="purple-1" text-color="purple-9">{{ cargoFunctions(p.row).length }} funciones</q-chip></q-td></template>
            <template #body-cell-activo="p"><q-td :props="p"><q-chip dense :color="p.row.activo ? 'green-1' : 'grey-3'" :text-color="p.row.activo ? 'green-9' : 'grey-8'">{{ p.row.activo ? 'Activo' : 'Inactivo' }}</q-chip></q-td></template>
            <template #body-cell-actions="p"><q-td :props="p" class="text-center"><q-btn flat round dense icon="edit" color="teal" @click="openCargo(p.row)" /><q-btn flat round dense icon="delete_outline" color="red" @click="dropCargo(p.row)" /></q-td></template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel name="puestos" class="q-pa-none">
          <q-table :rows="store.puestos" :columns="puestoColumns" row-key="id_puesto" flat :loading="store.loading">
            <template #body-cell-area="p"><q-td :props="p"><div class="text-weight-medium">{{ p.row.area?.nombre_area || 'Sin area' }}</div><div v-if="p.row.area?.parent?.nombre_area" class="text-caption text-grey-6">Depende de {{ p.row.area.parent.nombre_area }}</div></q-td></template>
            <template #body-cell-cargo="p"><q-td :props="p"><div class="text-weight-medium">{{ p.row.cargo?.nombre_cargo || 'Sin cargo' }}</div><div class="text-caption text-grey-6">{{ nivelName(p.row.cargo) || 'Sin nivel' }}</div></q-td></template>
            <template #body-cell-grupo="p"><q-td :props="p"><q-chip dense color="blue-1" text-color="blue-9">{{ p.row.grupoPersonal?.nombre || 'Sin grupo' }}</q-chip></q-td></template>
            <template #body-cell-superiores="p"><q-td :props="p"><div v-if="p.row.superiores?.length" class="column q-gutter-xs"><q-chip v-for="s in p.row.superiores.slice(0, 2)" :key="s.id_puesto" dense color="orange-1" text-color="orange-9">{{ s.nombre_puesto }}</q-chip><span v-if="p.row.superiores.length > 2" class="text-caption text-grey-6">+{{ p.row.superiores.length - 2 }} superior(es)</span></div><span v-else class="text-grey-6">Sin superior</span></q-td></template>
            <template #body-cell-activo="p"><q-td :props="p"><q-chip dense :color="p.row.activo ? 'green-1' : 'grey-3'" :text-color="p.row.activo ? 'green-9' : 'grey-8'">{{ p.row.activo ? 'Activo' : 'Inactivo' }}</q-chip></q-td></template>
            <template #body-cell-actions="p"><q-td :props="p" class="text-center"><q-btn flat round dense icon="edit" color="deep-purple" @click="openPuesto(p.row)" /><q-btn flat round dense icon="delete_outline" color="red" @click="dropPuesto(p.row)" /></q-td></template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <q-dialog v-model="nivelDialog.show" persistent>
      <q-card style="width:460px">
        <q-card-section class="bg-gradient-portal text-white"><div class="text-h6">{{ nivelDialog.data.id_jerarquico ? 'Editar nivel' : 'Nuevo nivel' }}</div></q-card-section>
        <q-card-section><q-form @submit="saveNivel" class="q-gutter-md"><q-input v-model="nivelDialog.data.nombre" label="Nombre" outlined :rules="[requiredRule]" /><q-input v-model="nivelDialog.data.descripcion" label="Descripcion" outlined type="textarea" autogrow /><q-toggle v-model="nivelDialog.data.activo" label="Activo" color="primary" /><div class="row justify-end q-gutter-sm"><q-btn flat label="Cancelar" v-close-popup /><q-btn type="submit" label="Guardar" class="btn-gradient-portal text-white" :loading="store.loading" /></div></q-form></q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="grupoDialog.show" persistent>
      <q-card style="width:500px">
        <q-card-section class="bg-gradient-portal text-white"><div class="text-h6">{{ grupoDialog.data.id_grupo_personal ? 'Editar grupo' : 'Nuevo grupo' }}</div></q-card-section>
        <q-card-section><q-form @submit="saveGrupo" class="q-gutter-md"><q-input v-model="grupoDialog.data.nombre" label="Nombre" outlined :rules="[requiredRule]" /><q-input v-model="grupoDialog.data.descripcion" label="Descripcion" outlined type="textarea" autogrow /><q-toggle v-model="grupoDialog.data.activo" label="Activo" color="primary" /><div class="row justify-end q-gutter-sm"><q-btn flat label="Cancelar" v-close-popup /><q-btn type="submit" label="Guardar" class="btn-gradient-portal text-white" :loading="store.loading" /></div></q-form></q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="areaDialog.show" persistent>
      <q-card style="width:560px">
        <q-card-section class="bg-gradient-portal text-white"><div class="text-h6">{{ areaDialog.data.id_area ? 'Editar area' : 'Nueva area' }}</div></q-card-section>
        <q-card-section><q-form @submit="saveArea" class="q-gutter-md"><q-input v-model="areaDialog.data.nombre_area" label="Nombre del area" outlined :rules="[requiredRule]" /><q-select v-model="areaDialog.data.tipo_area" :options="tipoAreaOptions" label="Tipo de area" outlined :rules="[requiredRule]" /><q-select v-model="areaDialog.data.id_area_padre" :options="parentAreas" option-label="nombre_area" option-value="id_area" emit-value map-options clearable label="Area padre" outlined /><q-toggle v-model="areaDialog.data.activo" label="Activo" color="primary" /><div class="row justify-end q-gutter-sm"><q-btn flat label="Cancelar" v-close-popup /><q-btn type="submit" label="Guardar" class="btn-gradient-portal text-white" :loading="store.loading" /></div></q-form></q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="cargoDialog.show" persistent>
      <q-card style="width:720px;max-width:92vw">
        <q-card-section class="bg-gradient-portal text-white"><div class="text-h6">{{ cargoDialog.data.id_cargo ? 'Editar cargo' : 'Nuevo cargo' }}</div></q-card-section>
        <q-card-section><q-form @submit="saveCargo" class="q-gutter-md"><div class="row q-col-gutter-md"><div class="col-12 col-md-7"><q-input v-model="cargoDialog.data.nombre_cargo" label="Nombre del cargo" outlined :rules="[requiredRule]" /></div><div class="col-12 col-md-5"><q-select v-model="cargoDialog.data.id_nivel_jerarquico" :options="store.niveles" option-label="nombre" option-value="id_jerarquico" emit-value map-options label="Nivel jerarquico" outlined :rules="[requiredRule]" /></div></div><q-input v-model="cargoDialog.data.descripcion" label="Descripcion" outlined type="textarea" autogrow /><q-input v-model="cargoDialog.data.funciones_base_text" label="Funciones base" hint="Una funcion por linea" outlined type="textarea" autogrow /><q-toggle v-model="cargoDialog.data.activo" label="Activo" color="primary" /><div class="row justify-end q-gutter-sm"><q-btn flat label="Cancelar" v-close-popup /><q-btn type="submit" label="Guardar" class="btn-gradient-portal text-white" :loading="store.loading" /></div></q-form></q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="puestoDialog.show" persistent>
      <q-card style="width:860px;max-width:96vw">
        <q-card-section class="bg-gradient-portal text-white"><div class="text-h6">{{ puestoDialog.data.id_puesto ? 'Editar puesto' : 'Nuevo puesto' }}</div></q-card-section>
        <q-card-section><q-form @submit="savePuesto" class="q-gutter-md"><div class="row q-col-gutter-md"><div class="col-12 col-md-4"><q-input v-model="puestoDialog.data.codigo" label="Codigo" outlined /></div><div class="col-12 col-md-8"><q-input v-model="puestoDialog.data.nombre_puesto" label="Nombre del puesto" outlined :rules="[requiredRule]" /></div></div><div class="row q-col-gutter-md"><div class="col-12 col-md-4"><q-select v-model="puestoDialog.data.id_grupo_personal" :options="store.grupos" option-label="nombre" option-value="id_grupo_personal" emit-value map-options label="Grupo de personal" outlined :rules="[requiredRule]" /></div><div class="col-12 col-md-4"><q-select v-model="puestoDialog.data.id_area" :options="store.areas" option-label="nombre_area" option-value="id_area" emit-value map-options label="Area" outlined :rules="[requiredRule]" /></div><div class="col-12 col-md-4"><q-select v-model="puestoDialog.data.id_cargo" :options="store.cargos" option-label="nombre_cargo" option-value="id_cargo" emit-value map-options label="Cargo" outlined :rules="[requiredRule]" /></div></div><div class="row q-col-gutter-md"><div class="col-12 col-md-4"><q-select v-model="puestoDialog.data.id_sede" :options="sedes" option-label="nombre" option-value="id_sede" emit-value map-options clearable label="Sede" outlined /></div><div class="col-12 col-md-4"><q-select v-model="puestoDialog.data.plantilla_contractual" :options="plantillaOptions" label="Plantilla contractual" outlined clearable /></div><div class="col-12 col-md-4 flex items-center"><q-toggle v-model="puestoDialog.data.activo" label="Activo" color="primary" /></div></div><q-select v-model="puestoDialog.data.superiores" :options="superiorOptions" option-label="nombre_puesto" option-value="id_puesto" emit-value map-options multiple use-chips label="Inmediatos superiores" outlined hint="Puedes asignar uno o varios puestos superiores" /><q-input v-model="puestoDialog.data.descripcion" label="Descripcion del puesto" outlined type="textarea" autogrow /><q-banner v-if="selectedCargoFunctions.length" rounded class="bg-blue-1 text-blue-10"><div class="text-weight-bold q-mb-sm">Funciones base heredadas del cargo</div><div v-for="(f, i) in selectedCargoFunctions" :key="`${i}-${f}`">{{ i + 1 }}. {{ f }}</div></q-banner><div class="row justify-end q-gutter-sm"><q-btn flat label="Cancelar" v-close-popup /><q-btn type="submit" label="Guardar" class="btn-gradient-portal text-white" :loading="store.loading" /></div></q-form></q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { QTableColumn, useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { useEstructuraStore } from '../stores/useEstructuraStore'

type Row = Record<string, any>
const $q = useQuasar()
const store = useEstructuraStore()
const tab = ref('niveles')
const sedes = ref<Row[]>([])
const tipoAreaOptions = ['Administrativa', 'Academica', 'Operativa', 'Direccion', 'Institucional']
const plantillaOptions = ['plazo-fijo', 'indefinido', 'consultor']
const requiredRule = (v: unknown) => !!v || 'Requerido'
const nivelColumns: QTableColumn[] = [{ name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' }, { name: 'descripcion', label: 'Descripcion', field: 'descripcion', align: 'left' }, { name: 'activo', label: 'Estado', field: 'activo', align: 'left' }, { name: 'actions', label: 'Acciones', field: 'id_jerarquico', align: 'center' }]
const grupoColumns: QTableColumn[] = [{ name: 'nombre', label: 'Grupo', field: 'nombre', align: 'left' }, { name: 'descripcion', label: 'Descripcion', field: 'descripcion', align: 'left' }, { name: 'activo', label: 'Estado', field: 'activo', align: 'left' }, { name: 'actions', label: 'Acciones', field: 'id_grupo_personal', align: 'center' }]
const areaColumns: QTableColumn[] = [{ name: 'nombre_area', label: 'Area', field: 'nombre_area', align: 'left' }, { name: 'tipo_area', label: 'Tipo', field: 'tipo_area', align: 'left' }, { name: 'parent', label: 'Area padre', field: 'id_area_padre', align: 'left' }, { name: 'activo', label: 'Estado', field: 'activo', align: 'left' }, { name: 'actions', label: 'Acciones', field: 'id_area', align: 'center' }]
const cargoColumns: QTableColumn[] = [{ name: 'nombre_cargo', label: 'Cargo', field: 'nombre_cargo', align: 'left' }, { name: 'nivel', label: 'Nivel', field: 'id_nivel_jerarquico', align: 'left' }, { name: 'funciones', label: 'Funciones base', field: 'funcionesBase', align: 'left' }, { name: 'activo', label: 'Estado', field: 'activo', align: 'left' }, { name: 'actions', label: 'Acciones', field: 'id_cargo', align: 'center' }]
const puestoColumns: QTableColumn[] = [{ name: 'nombre_puesto', label: 'Puesto', field: 'nombre_puesto', align: 'left' }, { name: 'area', label: 'Area', field: 'area', align: 'left' }, { name: 'cargo', label: 'Cargo', field: 'cargo', align: 'left' }, { name: 'grupo', label: 'Grupo', field: 'grupoPersonal', align: 'left' }, { name: 'superiores', label: 'Superiores', field: 'superiores', align: 'left' }, { name: 'activo', label: 'Estado', field: 'activo', align: 'left' }, { name: 'actions', label: 'Acciones', field: 'id_puesto', align: 'center' }]
const nivelDialog = reactive({ show: false, data: { id_jerarquico: null as number | null, nombre: '', descripcion: '', activo: true } })
const grupoDialog = reactive({ show: false, data: { id_grupo_personal: null as number | null, nombre: '', descripcion: '', activo: true } })
const areaDialog = reactive({ show: false, data: { id_area: null as number | null, nombre_area: '', tipo_area: '', id_area_padre: null as number | null, activo: true } })
const cargoDialog = reactive({ show: false, data: { id_cargo: null as number | null, nombre_cargo: '', descripcion: '', id_nivel_jerarquico: null as number | null, activo: true, funciones_base_text: '' } })
const puestoDialog = reactive({ show: false, data: { id_puesto: null as number | null, codigo: '', nombre_puesto: '', id_area: null as number | null, id_cargo: null as number | null, id_grupo_personal: null as number | null, id_sede: null as number | null, plantilla_contractual: '', descripcion: '', activo: true, superiores: [] as number[] } })
const actionLabel = computed(() => tab.value === 'niveles' ? 'Nuevo nivel' : tab.value === 'grupos' ? 'Nuevo grupo' : tab.value === 'areas' ? 'Nueva area' : tab.value === 'cargos' ? 'Nuevo cargo' : 'Nuevo puesto')
const parentAreas = computed(() => store.areas.filter((area) => area.id_area !== areaDialog.data.id_area))
const superiorOptions = computed(() => store.puestos.filter((puesto) => puesto.id_puesto !== puestoDialog.data.id_puesto))
const selectedCargoFunctions = computed(() => cargoFunctions(store.cargos.find((item) => Number(item.id_cargo) === Number(puestoDialog.data.id_cargo))))
onMounted(async () => { await Promise.all([store.fetchAll(), loadSedes()]) })
async function loadSedes() { const response = await api.get('/v1/talento-humano/sedes'); sedes.value = response.data.data ?? [] }
function nivelName(item?: Row | null) { return item?.nivel_jerarquico?.nombre || item?.nivelJerarquico?.nombre || '' }
function cargoFunctions(item?: Row | null) { return ((item?.funcionesBase || item?.funciones_base || []) as any[]).map((f) => typeof f === 'string' ? f : f.descripcion).filter(Boolean) }
function parseFunctions(text: string) { return text.split('\n').map((line) => line.trim()).filter(Boolean) }
function openByTab() { if (tab.value === 'niveles') return openNivel(); if (tab.value === 'grupos') return openGrupo(); if (tab.value === 'areas') return openArea(); if (tab.value === 'cargos') return openCargo(); openPuesto() }
function openNivel(item?: Row) { nivelDialog.data = item ? { id_jerarquico: item.id_jerarquico, nombre: item.nombre || '', descripcion: item.descripcion || '', activo: item.activo ?? true } : { id_jerarquico: null, nombre: '', descripcion: '', activo: true }; nivelDialog.show = true }
function openGrupo(item?: Row) { grupoDialog.data = item ? { id_grupo_personal: item.id_grupo_personal, nombre: item.nombre || '', descripcion: item.descripcion || '', activo: item.activo ?? true } : { id_grupo_personal: null, nombre: '', descripcion: '', activo: true }; grupoDialog.show = true }
function openArea(item?: Row) { areaDialog.data = item ? { id_area: item.id_area, nombre_area: item.nombre_area || '', tipo_area: item.tipo_area || '', id_area_padre: item.id_area_padre ? Number(item.id_area_padre) : null, activo: item.activo ?? true } : { id_area: null, nombre_area: '', tipo_area: '', id_area_padre: null, activo: true }; areaDialog.show = true }
function openCargo(item?: Row) { cargoDialog.data = item ? { id_cargo: item.id_cargo, nombre_cargo: item.nombre_cargo || '', descripcion: item.descripcion || '', id_nivel_jerarquico: item.id_nivel_jerarquico ? Number(item.id_nivel_jerarquico) : null, activo: item.activo ?? true, funciones_base_text: cargoFunctions(item).join('\n') } : { id_cargo: null, nombre_cargo: '', descripcion: '', id_nivel_jerarquico: null, activo: true, funciones_base_text: '' }; cargoDialog.show = true }
function openPuesto(item?: Row) { puestoDialog.data = item ? { id_puesto: item.id_puesto, codigo: item.codigo || '', nombre_puesto: item.nombre_puesto || '', id_area: item.id_area ? Number(item.id_area) : Number(item.area?.id_area) || null, id_cargo: item.id_cargo ? Number(item.id_cargo) : Number(item.cargo?.id_cargo) || null, id_grupo_personal: item.id_grupo_personal ? Number(item.id_grupo_personal) : Number(item.grupoPersonal?.id_grupo_personal) || null, id_sede: item.id_sede ? Number(item.id_sede) : Number(item.sede?.id_sede) || null, plantilla_contractual: item.plantilla_contractual || '', descripcion: item.descripcion || '', activo: item.activo ?? true, superiores: (item.superiores || []).map((s: Row) => Number(s.id_puesto)).filter(Boolean) } : { id_puesto: null, codigo: '', nombre_puesto: '', id_area: null, id_cargo: null, id_grupo_personal: null, id_sede: null, plantilla_contractual: '', descripcion: '', activo: true, superiores: [] }; puestoDialog.show = true }
async function saveNivel() { await store.saveNivel(nivelDialog.data); $q.notify({ type: 'positive', message: 'Nivel guardado' }); nivelDialog.show = false }
async function saveGrupo() { await store.saveGrupo(grupoDialog.data); $q.notify({ type: 'positive', message: 'Grupo guardado' }); grupoDialog.show = false }
async function saveArea() { await store.saveArea(areaDialog.data); $q.notify({ type: 'positive', message: 'Area guardada' }); areaDialog.show = false }
async function saveCargo() { await store.saveCargo({ ...cargoDialog.data, funciones_base: parseFunctions(cargoDialog.data.funciones_base_text) }); $q.notify({ type: 'positive', message: 'Cargo guardado' }); cargoDialog.show = false }
async function savePuesto() { await store.savePuesto({ ...puestoDialog.data, plantilla_contractual: puestoDialog.data.plantilla_contractual || null, id_sede: puestoDialog.data.id_sede || null }); $q.notify({ type: 'positive', message: 'Puesto guardado' }); puestoDialog.show = false }
function confirmDelete(message: string, action: () => Promise<void>, successMessage: string) { $q.dialog({ title: 'Confirmar', message, cancel: true, ok: { color: 'red-8', label: 'Eliminar' } }).onOk(async () => { await action(); $q.notify({ type: 'positive', message: successMessage }) }) }
const dropNivel = (item: Row) => confirmDelete(`Eliminar nivel "${item.nombre}"?`, () => store.deleteNivel(item.id_jerarquico), 'Nivel eliminado')
const dropGrupo = (item: Row) => confirmDelete(`Eliminar grupo "${item.nombre}"?`, () => store.deleteGrupo(item.id_grupo_personal), 'Grupo eliminado')
const dropArea = (item: Row) => confirmDelete(`Eliminar area "${item.nombre_area}"?`, () => store.deleteArea(item.id_area), 'Area eliminada')
const dropCargo = (item: Row) => confirmDelete(`Eliminar cargo "${item.nombre_cargo}"?`, () => store.deleteCargo(item.id_cargo), 'Cargo eliminado')
const dropPuesto = (item: Row) => confirmDelete(`Eliminar puesto "${item.nombre_puesto}"?`, () => store.deletePuesto(item.id_puesto), 'Puesto eliminado')
</script>

<style scoped>
.brand-text { background: linear-gradient(90deg, #6a37a3 0%, #00a99d 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.icon-glow { filter: drop-shadow(0 0 10px rgba(106, 55, 163, 0.3)); }
.rounded-20 { border-radius: 20px; }
</style>
