<template>
  <div class="row q-col-gutter-lg q-pt-lg">
    
    <!-- LEFT COLUMN (8): DATOS PERSONALES -->
    <div class="col-12 col-md-8 column q-gutter-y-lg">
      
      <!-- CARD 1: IDENTIDAD -->
      <q-card flat class="card-premium q-pa-lg">
        <div class="card-title row items-center q-mb-xl">
          <div class="card-title__icon bg-primary-soft q-mr-md">
            <q-icon name="person" color="primary" size="24px" />
          </div>
          <div class="text-subtitle1 text-weight-bold text-grey-9 text-uppercase" style="letter-spacing: 1px">Identidad y Origen</div>
          <q-space />
          <q-btn v-if="!isEditing" flat round color="primary" icon="edit" @click="startEdit"><q-tooltip>Editar Información</q-tooltip></q-btn>
          <div v-else class="row q-gutter-x-sm">
            <q-btn flat round color="grey-6" icon="close" @click="cancelEdit" />
            <q-btn flat round color="positive" icon="check" @click="saveEdit" :loading="saving" />
          </div>
        </div>

        <div class="row q-col-gutter-xl">
          <div class="col-12 col-sm-4 flex flex-center">
            <div class="avatar-wrapper shadow-10">
              <q-avatar size="160px" class="bordered-avatar">
                <q-img v-if="localPersona.foto" :src="localPersona.foto.startsWith('data:') ? localPersona.foto : (baseUrl + localPersona.foto)" ratio="1" spinner-color="primary" />
                <q-icon v-else name="person" size="80px" color="grey-3" />
                <q-btn v-if="isEditing" round color="primary" icon="photo_camera" size="sm" class="absolute-bottom-right shadow-5 btn-cam" @click="onCamClick" />
              </q-avatar>
              <input type="file" ref="fileRef" class="hidden" accept="image/*" @change="onPhotoChange" />
            </div>
          </div>

          <div class="col-12 col-sm-8">
            <div class="row q-col-gutter-lg">
              <div class="col-12">
                <div class="attribute-group" v-if="!isEditing">
                  <div class="attribute-label">NOMBRES Y APELLIDOS</div>
                  <div class="attribute-value">{{ persona.nombres }} {{ persona.primer_apellido }} {{ persona.segundo_apellido }}</div>
                </div>
                <div v-else class="row q-col-gutter-sm">
                   <div class="col-12"><q-input v-model="localPersona.nombres" label="Nombres" outlined dense stack-label /></div>
                   <div class="col-6"><q-input v-model="localPersona.primer_apellido" label="Primer Apellido" outlined dense stack-label /></div>
                   <div class="col-6"><q-input v-model="localPersona.segundo_apellido" label="Segundo Apellido" outlined dense stack-label /></div>
                </div>
              </div>

              <div class="col-12 col-sm-6">
                <div class="attribute-group" v-if="!isEditing">
                  <div class="attribute-label">CÉDULA DE IDENTIDAD</div>
                  <div class="attribute-value">{{ persona.ci }} {{ persona.expedido?.codigo_expedido || '' }}</div>
                </div>
                <div v-else class="row q-col-gutter-xs">
                   <q-input v-model="localPersona.ci" label="CI" outlined dense stack-label class="col-8" />
                   <q-select v-model="localPersona.id_ci_expedido" :options="expedidos" emit-value map-options label="Exp." outlined dense stack-label class="col-4" />
                </div>
              </div>

              <div class="col-12 col-sm-6">
                <div class="attribute-group" v-if="!isEditing">
                  <div class="attribute-label">SEXO</div>
                  <div class="attribute-value">{{ persona.sexo?.sexo || 'N/R' }}</div>
                </div>
                <q-select v-else v-model="localPersona.id_sexo" :options="sexos" emit-value map-options label="Sexo" outlined dense stack-label />
              </div>

              <div class="col-12 col-sm-6">
                <div class="attribute-group" v-if="!isEditing">
                  <div class="attribute-label">FECHA DE NACIMIENTO</div>
                  <div class="attribute-value">{{ persona.fecha_nacimiento }} ({{ calculateAge(persona.fecha_nacimiento) }} años)</div>
                </div>
                <q-input v-else v-model="localPersona.fecha_nacimiento" type="date" label="F. Nacimiento" outlined dense stack-label />
              </div>

              <div class="col-12 col-sm-6">
                <div class="attribute-group" v-if="!isEditing">
                  <div class="attribute-label">NACIONALIDAD</div>
                  <div class="attribute-value">{{ persona.nacionalidad?.gentilicio || 'Boliviana' }}</div>
                </div>
                <q-select v-else v-model="localPersona.id_nacionalidad" :options="nacionalidades" emit-value map-options label="Nacionalidad" outlined dense stack-label />
              </div>

              <div class="col-12 shadow-sm q-pa-md rounded-12 bg-slate-50">
                 <div class="attribute-group" v-if="!isEditing">
                    <div class="attribute-label">ESTADO CIVIL</div>
                    <div class="attribute-value text-primary">{{ persona.estado_civil || 'No especificado' }}</div>
                 </div>
                 <q-select v-else v-model="localPersona.estado_civil" :options="['Soltero(a)', 'Casado(a)', 'Divorciado(a)', 'Viudo(a)']" label="Estado Civil" outlined dense stack-label bg-color="white" />
              </div>
            </div>
          </div>
        </div>
      </q-card>

      <!-- CARD 2: UBICACIÓN Y DOMICILIO -->
      <q-card flat class="card-premium q-pa-lg">
        <div class="card-title row items-center q-mb-lg">
          <div class="card-title__icon bg-blue-soft q-mr-md">
            <q-icon name="home_work" color="blue-7" size="24px" />
          </div>
          <div class="text-subtitle1 text-weight-bold text-grey-9 text-uppercase" style="letter-spacing: 1px">Residencia y Domicilio</div>
        </div>

        <div class="row q-col-gutter-lg">
           <div class="col-12 col-sm-4">
              <div class="attribute-group" v-if="!isEditing">
                 <div class="attribute-label">PAÍS</div>
                 <div class="attribute-value">{{ persona.pais?.nombre || 'Bolivia' }}</div>
              </div>
              <q-select v-else v-model="localPersona.id_pais" :options="paisesCatalogo" emit-value map-options label="País" outlined dense stack-label />
           </div>
           <div class="col-12 col-sm-4">
              <div class="attribute-group" v-if="!isEditing">
                 <div class="attribute-label">DEPARTAMENTO</div>
                 <div class="attribute-value">{{ persona.departamento?.nombre || 'N/A' }}</div>
              </div>
              <q-select v-else v-model="localPersona.id_depto_residencia" :options="deptosCatalogo" emit-value map-options label="Departamento" outlined dense stack-label />
           </div>
           <div class="col-12 col-sm-4">
              <div class="attribute-group" v-if="!isEditing">
                 <div class="attribute-label">CIUDAD / MUNICIPIO</div>
                 <div class="attribute-value">{{ persona.ciudad?.nombre || 'N/A' }}</div>
              </div>
              <q-select v-else v-model="localPersona.id_ciudad" :options="ciudadesCatalogo" emit-value map-options label="Ciudad" outlined dense stack-label />
           </div>
           <div class="col-12">
              <div class="attribute-group" v-if="!isEditing">
                 <div class="attribute-label">DIRECCIÓN DETALLADA</div>
                 <div class="attribute-value">{{ persona.direccion_domicilio || 'No especificada' }}</div>
              </div>
              <q-input v-else v-model="localPersona.direccion_domicilio" label="Dirección / Calle / Nro" outlined dense stack-label />
           </div>
        </div>
      </q-card>
    </div>

    <!-- RIGHT COLUMN (4): CONTACT & SOCIAL SECURITY -->
    <div class="col-12 col-md-4 column q-gutter-y-lg">
      
      <!-- CONTACT CARD -->
      <q-card flat class="card-premium sidebar-card q-pa-lg border-left-primary">
        <div class="row items-center q-mb-lg">
           <q-icon name="alternate_email" color="primary" size="28px" />
           <div class="text-subtitle1 text-weight-bold q-ml-sm text-uppercase" style="letter-spacing: 1px">Contacto</div>
        </div>
        <div class="column q-gutter-y-md">
           <div class="contact-item row no-wrap items-center">
              <div class="contact-item__icon bg-slate-50 q-mr-md">
                 <q-icon name="phone" color="slate-600" size="20px" />
              </div>
              <div class="column full-width">
                 <span class="text-caption text-grey-6 text-uppercase text-weight-bold" style="font-size: 9px">TELÉFONO PERSONAL</span>
                 <div v-if="!isEditing" class="text-weight-bold text-grey-9 text-body1">{{ persona.celular_personal }}</div>
                 <q-input v-else v-model="localPersona.celular_personal" outlined dense bg-color="white" />
              </div>
           </div>
           <div class="contact-item row no-wrap items-center">
              <div class="contact-item__icon bg-slate-50 q-mr-md">
                 <q-icon name="phone_android" color="slate-600" size="20px" />
              </div>
              <div class="column full-width">
                 <span class="text-caption text-grey-6 text-uppercase text-weight-bold" style="font-size: 9px">TELÉFONO INSTITUCIONAL</span>
                 <div v-if="!isEditing" class="text-weight-bold text-grey-9 text-body1">{{ persona.empleado?.celular_institucional || 'N/A' }}</div>
                 <q-input v-else v-model="localEmpleado.celular_institucional" outlined dense bg-color="white" />
              </div>
           </div>
           <div class="contact-item row no-wrap items-center">
              <div class="contact-item__icon bg-slate-50 q-mr-md">
                 <q-icon name="mail" color="slate-600" size="20px" />
              </div>
              <div class="column full-width">
                 <span class="text-caption text-grey-6 text-uppercase text-weight-bold" style="font-size: 9px">EMAIL PERSONAL</span>
                 <div v-if="!isEditing" class="text-weight-bold text-grey-9 text-body1">{{ persona.correo_personal || 'N/A' }}</div>
                 <q-input v-else v-model="localPersona.correo_personal" outlined dense bg-color="white" />
              </div>
           </div>
           <div class="contact-item row no-wrap items-center">
              <div class="contact-item__icon bg-slate-50 q-mr-md">
                 <q-icon name="business_center" color="slate-600" size="20px" />
              </div>
              <div class="column full-width">
                 <span class="text-caption text-grey-6 text-uppercase text-weight-bold" style="font-size: 9px">EMAIL CORPORATIVO</span>
                 <div v-if="!isEditing" class="text-weight-bold text-grey-9 text-body1">{{ correo_institucional || 'N/A' }}</div>
                 <q-input v-else v-model="localEmpleado.correo_institucional" outlined dense bg-color="white" />
              </div>
           </div>
        </div>
      </q-card>

      <!-- SOCIAL SECURITY CARD -->
      <q-card flat class="card-premium q-pa-lg bg-slate-50 border-none shadow-none">
        <div class="row items-center q-mb-lg">
           <q-icon name="verified_user" color="primary" size="24px" />
           <div class="text-subtitle2 text-weight-bold q-ml-sm text-uppercase" style="letter-spacing: 1px">Seguridad Social</div>
        </div>
        
        <div class="column q-gutter-y-md">
           <div class="row q-col-gutter-sm">
             <div class="col-12">
                <span class="attribute-label block q-mb-xs" style="font-size: 9px">CAJA DE SALUD</span>
                <div v-if="!isEditing" class="social-box row items-center justify-between">
                  <div class="column">
                     <span class="text-weight-bold text-grey-9 text-caption text-uppercase">{{ caja?.nombre || 'Pendiente' }}</span>
                     <span class="text-grey-6 text-caption text-weight-bold">MAT: {{ persona.empleado?.nro_matricula_seguro || '---' }}</span>
                  </div>
                  <q-icon name="medical_services" color="blue-2" size="22px" />
                </div>
                <div v-else class="column q-gutter-y-xs">
                   <q-select v-model="localEmpleado.id_caja" :options="cajas" emit-value map-options outlined dense bg-color="white" />
                   <q-input v-model="localEmpleado.nro_matricula_seguro" label="Matrícula" outlined dense bg-color="white" />
                </div>
             </div>

             <div class="col-12">
                <span class="attribute-label block q-mb-xs" style="font-size: 9px">AFP ADMINISTRADORA</span>
                <div v-if="!isEditing" class="social-box row items-center justify-between">
                  <div class="column">
                     <span class="text-weight-bold text-grey-9 text-caption text-uppercase">{{ pensiones?.nombre || 'S/D' }}</span>
                     <span class="text-grey-6 text-caption text-weight-bold">NUA/CUA: {{ persona.empleado?.nro_nua_cua || '---' }}</span>
                  </div>
                  <q-icon name="account_balance_wallet" color="indigo-2" size="22px" />
                </div>
                <div v-else class="column q-gutter-y-xs">
                   <q-select v-model="localEmpleado.id_entidad_pensiones" :options="pensionesCatalogo" emit-value map-options outlined dense bg-color="white" />
                   <q-input v-model="localEmpleado.nro_nua_cua" label="Nº NUA / CUA" outlined dense bg-color="white" />
                </div>
             </div>
           </div>
        </div>
      </q-card>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { usePersonalStore } from 'src/stores/personalStore'

interface Props {
  persona: any;
  empleadoId?: number;
  correo_institucional?: string;
  caja?: any;
  pensiones?: any;
  baseUrl: string;
}

const props = defineProps<Props>()
const emit = defineEmits(['updated'])
const personalStore = usePersonalStore()

const isEditing = ref(false)
const saving = ref(false)
const localPersona = ref<any>({})
const localEmpleado = ref<any>({})
const fileRef = ref<HTMLInputElement | null>(null)

// Catálogos
const expedidos = computed(() => personalStore.catalogs.departamentos.map((d: any) => ({ label: d.nombre, value: d.id_departamento })))
const sexos = computed(() => personalStore.catalogs.sexos.map((s: any) => ({ label: s.sexo, value: s.id_sexo })))
const nacionalidades = computed(() => personalStore.catalogs.nacionalidades.map((n: any) => ({ label: n.gentilicio, value: n.id_nacionalidad })))
const cajas = computed(() => personalStore.catalogs.caja_salud.map((c: any) => ({ label: c.nombre, value: c.id_caja })))
const pensionesCatalogo = computed(() => personalStore.catalogs.entidad_pensiones.map((p: any) => ({ label: p.nombre, value: p.id_entidad_pensiones })))
const paisesCatalogo = computed(() => personalStore.catalogs.paises.map((p: any) => ({ label: p.nombre, value: p.id_pais })))
const deptosCatalogo = computed(() => personalStore.catalogs.departamentos.map((d: any) => ({ label: d.nombre, value: d.id_departamento })))
const ciudadesCatalogo = computed(() => personalStore.catalogs.ciudades.map((c: any) => ({ label: c.nombre, value: c.id_ciudad })))

const startEdit = () => {
  // Asegurar que los IDs sean números para que el q-select los mapee correctamente
  localPersona.value = { 
    ...props.persona,
    id_ci_expedido: props.persona.id_ci_expedido ? Number(props.persona.id_ci_expedido) : null,
    id_sexo: props.persona.id_sexo ? Number(props.persona.id_sexo) : null,
    id_nacionalidad: props.persona.id_nacionalidad ? Number(props.persona.id_nacionalidad) : null,
    id_pais: props.persona.id_pais ? Number(props.persona.id_pais) : null,
    id_depto_residencia: props.persona.id_depto_residencia ? Number(props.persona.id_depto_residencia) : null,
    id_ciudad: props.persona.id_ciudad ? Number(props.persona.id_ciudad) : null
  }
  
  localEmpleado.value = {
    id_caja: props.caja?.id_caja || props.persona.empleado?.id_caja || null,
    id_entidad_pensiones: props.pensiones?.id_entidad_pensiones || props.persona.empleado?.id_entidad_pensiones || null,
    correo_institucional: props.correo_institucional || props.persona.empleado?.correo_institucional || '',
    celular_institucional: props.persona.empleado?.celular_institucional || '',
    nro_matricula_seguro: props.persona.empleado?.nro_matricula_seguro || '',
    nro_nua_cua: props.persona.empleado?.nro_nua_cua || ''
  }

  // Convertir IDs del empleado a número también
  if (localEmpleado.value.id_caja) localEmpleado.value.id_caja = Number(localEmpleado.value.id_caja)
  if (localEmpleado.value.id_entidad_pensiones) localEmpleado.value.id_entidad_pensiones = Number(localEmpleado.value.id_entidad_pensiones)
  
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
}

const saveEdit = async () => {
  saving.value = true
  try {
     const payload = {
       persona: localPersona.value,
       empleado: localEmpleado.value
     }
     const updatedData = await personalStore.updateEmployee(props.empleadoId || props.persona.id_empleado, payload)
     if (updatedData) {
       emit('updated', updatedData)
       isEditing.value = false
     }
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

const onCamClick = () => fileRef.value?.click()
const onPhotoChange = (e: any) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event: any) => {
      localPersona.value.foto = event.target.result
    }
    reader.readAsDataURL(file)
  }
}

const calculateAge = (birthday: string) => {
  if (!birthday) return '---'
  const ageDifMs = Date.now() - new Date(birthday).getTime()
  const ageDate = new Date(ageDifMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

onMounted(() => {
  personalStore.fetchCatalogs()
})

watch(() => props.persona, (val) => {
  if (!isEditing.value && val) localPersona.value = { ...val }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.card-premium {
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;
}

.border-left-primary { border-left: 6px solid #6A37A3; }

.card-title__icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}

.bg-primary-soft { background: rgba(106, 55, 163, 0.08); }
.bg-blue-soft { background: rgba(37, 99, 235, 0.08); }
.bg-slate-50 { background: #f8fafc; }

.attribute-group {
  .attribute-label { font-size: 10px; font-weight: 800; color: #64748b; margin-bottom: 6px; letter-spacing: 1px; }
  .attribute-value { font-size: 16px; font-weight: 700; color: #1e293b; }
}

.contact-item__icon {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}

.social-box {
  background: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f1f5f9;
}

.avatar-wrapper {
  position: relative;
  padding: 8px;
  background: white;
  border-radius: 50%;
}

.bordered-avatar {
  border: 4px solid #f8fafc;
}

.btn-cam {
  border: 2px solid white;
  &:hover { transform: scale(1.1); }
}

.rounded-12 { border-radius: 12px; }
</style>
