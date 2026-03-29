<template>
  <q-page class="sigeth-page">
    <!-- PAGE HERO -->
    <div class="page-hero">
      <div class="page-hero__left">
        <div class="page-hero__title">Registrar Persona</div>
        <div class="page-hero__subtitle">Información base para el expediente de talento humano</div>
      </div>
      <div class="page-hero__actions">
        <q-btn flat color="grey-7" label="Cancelar" @click="$router.back()" />
      </div>
    </div>

    <!-- FORM AREA -->
    <q-form @submit="onSubmit" class="sigeth-form q-mx-auto">
      <!-- SECCION 1: DATOS PERSONALES -->
      <div class="form-section">
        <div class="form-section__header">
          <div class="form-section__icon" style="background: #EDE7F6">
            <q-icon name="person" color="primary" size="20px" />
          </div>
          <div>
            <div class="form-section__title">Identidad y Nombre</div>
            <div class="form-section__subtitle">Datos oficiales del documento legal</div>
          </div>
        </div>

        <div class="form-grid">
          <q-input 
            v-model="form.primerApellido" 
            outlined label="Primer Apellido" 
            color="primary"
            class="form-field"
            :rules="[val => !!val || 'Requerido']"
          >
            <template #prepend><q-icon name="badge" color="grey-5" /></template>
          </q-input>

          <q-input 
            v-model="form.segundoApellido" 
            outlined label="Segundo Apellido" 
            color="primary"
            class="form-field"
          >
            <template #prepend><q-icon name="badge" color="grey-5" /></template>
          </q-input>

          <q-input 
            v-model="form.nombres" 
            outlined label="Nombres" 
            color="primary"
            class="form-field"
            :rules="[val => !!val || 'Requerido']"
          >
            <template #prepend><q-icon name="person_outline" color="grey-5" /></template>
          </q-input>

          <q-input 
            v-model="form.ci" 
            outlined label="Carnet de Identidad" 
            color="primary"
            class="form-field"
            mask="#########"
            unmasked-value
            :rules="[val => !!val || 'Requerido', val => /^\d{5,10}$/.test(val) || '5 a 10 dígitos']"
          >
            <template #prepend><q-icon name="fingerprint" color="grey-5" /></template>
          </q-input>

          <q-select
            v-model="form.idCiExpedido"
            :options="catalogs.departamentos"
            outlined label="Expedido en"
            color="primary"
            class="form-field"
            emit-value map-options
            :loading="loadingCatalogs"
          >
            <template #prepend><q-icon name="location_city" color="grey-5" /></template>
          </q-select>

          <q-select
            v-model="form.idSexo"
            :options="catalogs.sexos"
            outlined label="Género"
            color="primary"
            class="form-field"
            emit-value map-options
          >
            <template #prepend><q-icon name="wc" color="grey-5" /></template>
          </q-select>
        </div>
      </div>

      <q-separator class="q-my-lg" />

      <!-- SECCION 2: CONTACTO Y UBICACION -->
      <div class="form-section">
        <div class="form-section__header">
          <div class="form-section__icon" style="background: #E0F2F1">
            <q-icon name="alternate_email" color="secondary" size="20px" />
          </div>
          <div>
            <div class="form-section__title">Contacto y Ubicación</div>
            <div class="form-section__subtitle">Canales de comunicación y domicilio</div>
          </div>
        </div>

        <div class="form-grid">
          <q-input 
            v-model="form.correoPersonal" 
            outlined label="Correo Electrónico" 
            placeholder="ejemplo@email.com"
            color="primary"
            class="form-field"
            :rules="[val => !!val || 'Requerido', val => /.+@.+\..+/.test(val) || 'Formato inválido']"
          >
            <template #prepend><q-icon name="email" color="grey-5" /></template>
          </q-input>

          <q-input 
            v-model="form.celularPersonal" 
            outlined label="Celular Personal" 
            color="primary"
            class="form-field"
            mask="########"
            hint="Prefijo 6 o 7 (Bolivia)"
            :rules="[val => !!val || 'Requerido', val => /^[67]\d{7}$/.test(val) || 'Formato boliviano inválido']"
          >
            <template #prepend><q-icon name="smartphone" color="grey-5" /></template>
          </q-input>

          <q-select
            v-model="form.idNacionalidad"
            :options="catalogs.nacionalidades"
            outlined label="Nacionalidad"
            color="primary"
            class="form-field"
            emit-value map-options
          >
            <template #prepend><q-icon name="public" color="grey-5" /></template>
          </q-select>

           <q-input 
            v-model="form.direccionDomicilio" 
            outlined label="Dirección de Domicilio" 
            color="primary"
            class="form-field full-width"
          >
            <template #prepend><q-icon name="home" color="grey-5" /></template>
          </q-input>
        </div>
      </div>

      <q-separator class="q-my-xl" />

      <div class="form-actions">
        <q-btn 
          unelevated 
          color="primary" 
          label="Registrar Persona" 
          icon-right="save" 
          type="submit"
          :loading="store.loading"
          class="q-px-xl" 
        >
          <template #loading>
            <q-spinner-dots color="white" size="1em" />
          </template>
        </q-btn>
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePersonaStore } from '../stores/usePersonaStore'
import { useNotify } from 'src/shared/composables/useNotify'
import { useRouter } from 'vue-router'
import { CreatePersonaData } from '../types/persona.types'

const store = usePersonaStore()
const notify = useNotify()
const router = useRouter()

const loadingCatalogs = ref(false)

const form = ref<CreatePersonaData>({
  primerApellido:    '',
  segundoApellido:   '',
  nombres:           '',
  ci:                '',
  idCiExpedido:      '1', // Valores por defecto para demo
  idSexo:            '1',
  celularPersonal:   '',
  correoPersonal:    '',
  estadoCivil:       'SOLTERO',
  idNacionalidad:    '1',
  idCiudad:          '1',
  idPais:            '1',
  direccionDomicilio: ''
})

const catalogs = ref({
  departamentos:  [{ label: 'Chuquisaca', value: '1' }, { label: 'La Paz', value: '2' }, { label: 'Santa Cruz', value: '3' }],
  sexos:          [{ label: 'Masculino', value: '1' }, { label: 'Femenino', value: '2' }],
  nacionalidades: [{ label: 'Boliviana', value: '1' }, { label: 'Extranjera', value: '2' }],
})

async function onSubmit() {
  try {
    await store.registerPersona(form.value)
    notify.success('Persona registrada correctamente')
    router.push({ name: 'personal.list' })
  } catch (err: any) {
    notify.error('Error al registrar: ' + (err.response?.data?.message || 'Revisa los campos e intenta de nuevo'))
  }
}

onMounted(() => {
  // Aquí cargaríamos catálogos reales desde el backend
})
</script>

<style lang="scss" scoped>
.form-section {
  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }
  &__icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__title {
    font-size: 17px;
    font-weight: 600;
    color: var(--text-primary);
  }
  &__subtitle {
    font-size: 13px;
    color: var(--text-secondary);
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 40px;
}
</style>
