<template>
  <div class="geo-location-selector">
    <!-- País -->
    <GeoSelectPais
      v-model="selectedPais"
      :label="paisLabel"
      :rules="paisRequired ? [val => !!val || 'El país es requerido'] : undefined"
    />

    <!-- Departamento -->
    <GeoSelectDepartamento
      v-model="selectedDepartamento"
      :pais-id="selectedPais"
      :label="departamentoLabel"
      :rules="departamentoRequired ? [val => !!val || 'El departamento es requerido'] : undefined"
    />

    <!-- Ciudad -->
    <GeoSelectCiudad
      v-model="selectedCiudad"
      :departamento-id="selectedDepartamento"
      :label="ciudadLabel"
      :rules="ciudadRequired ? [val => !!val || 'La ciudad es requerida'] : undefined"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import GeoSelectPais from './GeoSelectPais.vue'
import GeoSelectDepartamento from './GeoSelectDepartamento.vue'
import GeoSelectCiudad from './GeoSelectCiudad.vue'

const props = withDefaults(defineProps<{
  paisId?: number | null
  departamentoId?: number | null
  ciudadId?: number | null
  paisLabel?: string
  departamentoLabel?: string
  ciudadLabel?: string
  paisRequired?: boolean
  departamentoRequired?: boolean
  ciudadRequired?: boolean
}>(), {
  paisId: null,
  departamentoId: null,
  ciudadId: null,
  paisLabel: 'País',
  departamentoLabel: 'Departamento',
  ciudadLabel: 'Ciudad',
  paisRequired: false,
  departamentoRequired: false,
  ciudadRequired: false,
})

const emit = defineEmits<{
  'update:paisId': [value: number | null]
  'update:departamentoId': [value: number | null]
  'update:ciudadId': [value: number | null]
  'change': [location: { paisId: number | null; departamentoId: number | null; ciudadId: number | null }]
}>()

// Local state
const selectedPais = ref<number | null>(props.paisId)
const selectedDepartamento = ref<number | null>(props.departamentoId)
const selectedCiudad = ref<number | null>(props.ciudadId)

// Watch for external changes
watch(() => props.paisId, (val) => { selectedPais.value = val })
watch(() => props.departamentoId, (val) => { selectedDepartamento.value = val })
watch(() => props.ciudadId, (val) => { selectedCiudad.value = val })

// Emit changes
watch([selectedPais, selectedDepartamento, selectedCiudad], ([pais, depto, ciudad]) => {
  emit('update:paisId', pais)
  emit('update:departamentoId', depto)
  emit('update:ciudadId', ciudad)
  emit('change', { paisId: pais, departamentoId: depto, ciudadId: ciudad })
})
</script>

<style lang="scss" scoped>
.geo-location-selector {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
