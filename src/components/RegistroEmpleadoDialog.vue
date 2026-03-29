<template>
  <q-dialog v-model="show" persistent maximized transition-show="slide-up" transition-hide="slide-down">
    <q-card class="dialog-card">
      <!-- Header -->
      <q-card-section class="dialog-header row items-center q-pb-none">
        <q-icon name="person_add" color="primary" size="28px" class="q-mr-sm" />
        <div class="text-h6 text-weight-bold">Registrar Nuevo Empleado</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeDialog" />
      </q-card-section>

      <q-separator class="q-mx-lg q-mt-sm" />

      <!-- Stepper -->
      <q-card-section class="q-pa-lg">
        <q-stepper v-model="step" ref="stepperRef" color="primary" animated flat class="stepper-clean">

          <!-- PASO 1: Datos Personales -->
          <q-step :name="1" title="Datos Personales" icon="person" :done="step > 1">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input v-model="form.primer_apellido" label="Primer Apellido *" outlined dense />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="form.segundo_apellido" label="Segundo Apellido" outlined dense />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="form.nombres" label="Nombres *" outlined dense />
              </div>
              <div class="col-12 col-md-3">
                <q-input v-model="form.ci" label="Cédula de Identidad *" outlined dense @keyup.enter="buscarCI">
                  <template v-slot:append>
                    <q-btn round dense flat icon="search" @click="buscarCI" color="primary" :loading="isSearching">
                      <q-tooltip>Buscar Onboarding</q-tooltip>
                    </q-btn>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-2">
                <q-input v-model="form.complemento" label="Complemento" outlined dense />
              </div>
              <div class="col-12 col-md-3">
                <q-select v-model="form.id_ci_expedido" :options="deptOptions" label="Expedido en *" outlined dense emit-value map-options />
              </div>
              <div class="col-12 col-md-4">
                <q-select v-model="form.id_sexo" :options="sexoOptions" label="Sexo *" outlined dense emit-value map-options />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="form.celular_personal" label="Celular Personal *" outlined dense mask="########" />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="form.correo_personal" label="Correo Personal *" outlined dense type="email" />
              </div>
              <div class="col-12 col-md-4">
                <q-select v-model="form.estado_civil" :options="estadoCivilOptions" label="Estado Civil *" outlined dense />
              </div>
              <div class="col-12 col-md-4">
                <q-select v-model="form.id_nacionalidad" :options="nacOptions" label="Nacionalidad *" outlined dense emit-value map-options />
              </div>
              <div class="col-12 col-md-4">
                <q-select v-model="form.id_pais" :options="paisOptions" label="País *" outlined dense emit-value map-options />
              </div>
              <div class="col-12 col-md-4">
                <q-select v-model="form.id_ciudad" :options="ciudadOptions" label="Ciudad *" outlined dense emit-value map-options />
              </div>
              <div class="col-12 col-md-8">
                <q-input v-model="form.direccion_domicilio" label="Dirección de Domicilio *" outlined dense />
              </div>
            </div>
          </q-step>

          <!-- PASO 2: Datos Laborales -->
          <q-step :name="2" title="Datos Laborales" icon="work" :done="step > 2">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-select v-model="form.id_cargo" :options="cargoOptions" label="Cargo (Opcional)" outlined dense emit-value map-options clearable />
              </div>
              <div class="col-12 col-md-6">
                <q-select v-model="form.id_area" :options="areaOptions" label="Área / Unidad (Opcional)" outlined dense emit-value map-options clearable />
              </div>
              <div class="col-12 col-md-4">
                <q-select v-model="form.id_tipo_contrato" :options="tipoContratoOptions" label="Tipo de Contrato (Opcional)" outlined dense emit-value map-options clearable />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="form.salario" label="Salario (Bs.) (Opcional)" outlined dense type="number" prefix="Bs." />
              </div>
              <div class="col-12 col-md-4">
                <q-select v-model="form.id_sede" :options="sedeOptions" label="Sede (Opcional)" outlined dense emit-value map-options clearable />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="form.fecha_inicio" label="Fecha de Inicio (Opcional)" outlined dense type="date" />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="form.fecha_fin" label="Fecha de Fin" outlined dense type="date" />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="form.celular_institucional" label="Celular Institucional" outlined dense />
              </div>
              <div class="col-12 col-md-8">
                <q-input v-model="form.correo_institucional" label="Correo Institucional" outlined dense type="email" />
              </div>
            </div>
          </q-step>

          <!-- PASO 3: Seguridad Social -->
          <q-step :name="3" title="Seguridad Social" icon="health_and_safety" :done="step > 3">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-select v-model="form.id_caja" :options="cajaOptions" label="Caja de Salud (Opcional)" outlined dense emit-value map-options clearable />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.nro_matricula_seguro" label="Nro. Matrícula Seguro (Opcional)" outlined dense />
              </div>
              <div class="col-12 col-md-6">
                <q-select v-model="form.id_entidad_pensiones" :options="pensionOptions" label="Entidad de Pensiones (Opcional)" outlined dense emit-value map-options clearable />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.nro_nua_cua" label="Nro. NUA / CUA (Opcional)" outlined dense />
              </div>
            </div>

            <!-- Resumen rápido -->
            <q-banner class="q-mt-lg bg-primary text-white rounded-borders">
              <template v-slot:avatar>
                <q-icon name="check_circle" />
              </template>
              <div class="text-weight-bold">Resumen del Registro</div>
              <div>{{ form.nombres }} {{ form.primer_apellido }} — CI: {{ form.ci }}</div>
            </q-banner>
          </q-step>

          <!-- Navigation Buttons -->
          <template v-slot:navigation>
            <q-stepper-navigation class="row justify-between q-mt-md">
              <q-btn v-if="step > 1" flat color="primary" label="Anterior" icon="arrow_back" @click="stepperRef?.previous()" />
              <q-space />
              <q-btn v-if="step < 3" unelevated color="primary" label="Siguiente" icon-right="arrow_forward" @click="stepperRef?.next()" />
              <q-btn v-else unelevated color="positive" label="Registrar Empleado" icon="save" :loading="saving" @click="submitForm" />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePersonalStore } from 'stores/personalStore'

const props = defineProps({
  modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const personalStore = usePersonalStore()
const stepperRef = ref(null as any)
const step = ref(1)

const show = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const saving = computed(() => personalStore.saving)
const isSearching = ref(false)

const form = ref({
  primer_apellido: '',
  segundo_apellido: '',
  nombres: '',
  ci: '',
  complemento: '',
  id_ci_expedido: null as number | null,
  id_sexo: null as number | null,
  celular_personal: '',
  correo_personal: '',
  estado_civil: '',
  id_nacionalidad: null as number | null,
  direccion_domicilio: '',
  id_ciudad: null as number | null,
  id_pais: null as number | null,
  id_tipo_contrato: null as number | null,
  id_area: null as number | null,
  id_cargo: null as number | null,
  salario: null as number | null,
  fecha_inicio: '',
  fecha_fin: '',
  id_sede: null as number | null,
  id_caja: null as number | null,
  id_entidad_pensiones: null as number | null,
  nro_matricula_seguro: '',
  nro_nua_cua: '',
  celular_institucional: '',
  correo_institucional: '',
})

const estadoCivilOptions = ['Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Unión Libre']

// Computed options from catalogs
const sexoOptions = computed(() => personalStore.catalogs.sexos.map((s: any) => ({ label: s.sexo, value: s.id_sexo })))
const deptOptions = computed(() => personalStore.catalogs.departamentos.map((d: any) => ({ label: d.nombre + ' (' + d.codigo_expedido + ')', value: d.id_departamento })))
const nacOptions = computed(() => personalStore.catalogs.nacionalidades.map((n: any) => ({ label: n.gentilicio, value: n.id_nacionalidad })))
const paisOptions = computed(() => personalStore.catalogs.paises.map((p: any) => ({ label: p.nombre, value: p.id_pais })))
const ciudadOptions = computed(() => personalStore.catalogs.ciudades.map((c: any) => ({ label: c.nombre, value: c.id_ciudad })))
const cargoOptions = computed(() => personalStore.catalogs.cargos.map((c: any) => ({ label: c.nombre_cargo, value: c.id_cargo })))
const areaOptions = computed(() => personalStore.catalogs.areas.map((a: any) => ({ label: a.nombre_area, value: a.id_area })))
const tipoContratoOptions = computed(() => personalStore.catalogs.tipo_contrato.map((t: any) => ({ label: t.nombre, value: t.id_tipo_contrato })))
const sedeOptions = computed(() => personalStore.catalogs.sedes.map((s: any) => ({ label: s.nombre, value: s.id_sede })))
const cajaOptions = computed(() => personalStore.catalogs.caja_salud.map((c: any) => ({ label: c.nombre, value: c.id_caja })))
const pensionOptions = computed(() => personalStore.catalogs.entidad_pensiones.map((e: any) => ({ label: e.nombre, value: e.id_entidad_pensiones })))

const resetForm = () => {
  step.value = 1
  form.value = {
    primer_apellido: '', segundo_apellido: '', nombres: '',
    ci: '', complemento: '', id_ci_expedido: null, id_sexo: null,
    celular_personal: '', correo_personal: '', estado_civil: '',
    id_nacionalidad: null, direccion_domicilio: '', id_ciudad: null, id_pais: null,
    id_tipo_contrato: null, id_area: null, id_cargo: null,
    salario: null, fecha_inicio: '', fecha_fin: '', id_sede: null,
    id_caja: null, id_entidad_pensiones: null,
    nro_matricula_seguro: '', nro_nua_cua: '',
    celular_institucional: '', correo_institucional: '',
  }
}

const closeDialog = () => {
  resetForm()
  show.value = false
}

const submitForm = async () => {
  const ok = await personalStore.createEmployee(form.value)
  if (ok) {
    closeDialog()
  }
}

const buscarCI = async () => {
  if (!form.value.ci) return
  isSearching.value = true
  const persona = await personalStore.buscarPersonaPorCI(form.value.ci)
  if (persona) {
    form.value.primer_apellido = persona.primer_apellido || ''
    form.value.segundo_apellido = persona.segundo_apellido || ''
    form.value.nombres = persona.nombres || ''
    form.value.complemento = persona.complemento || ''
    form.value.id_ci_expedido = persona.id_ci_expedido || null
    form.value.id_sexo = persona.id_sexo || null
    form.value.celular_personal = persona.celular_personal || ''
    form.value.correo_personal = persona.correo_personal || ''
    form.value.estado_civil = persona.estado_civil || ''
    form.value.id_nacionalidad = persona.id_nacionalidad || null
    form.value.id_pais = persona.id_pais || null
    form.value.id_ciudad = persona.id_ciudad || null
    form.value.direccion_domicilio = persona.direccion_domicilio || ''
  }
  isSearching.value = false
}

// Cargar catálogos cuando se abre el dialog
watch(show, (val) => {
  if (val && personalStore.catalogs.sexos.length === 0) {
    personalStore.fetchCatalogs()
  }
})
</script>

<style lang="scss" scoped>
.dialog-card {
  max-width: 900px;
  margin: auto;
}

.dialog-header {
  padding: 16px 24px;
}

.stepper-clean {
  background: transparent !important;
  box-shadow: none !important;
}
</style>
