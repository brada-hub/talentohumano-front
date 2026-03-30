<template>
  <q-select
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
    :options="options"
    :label="label"
    :loading="loading"
    :disable="disable || !paisId"
    outlined
    color="primary"
    emit-value
    map-options
    clearable
    :rules="rules"
  >
    <template #prepend>
      <q-icon name="map" color="primary" />
    </template>
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          {{ paisId ? 'No hay departamentos' : 'Selecciona un país primero' }}
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { watch, computed, onMounted } from 'vue'
import { useGeoStore } from '../stores/useGeoStore'

const props = defineProps<{
  modelValue: number | null
  paisId: number | null
  label?: string
  disable?: boolean
  rules?: any[]
}>()

const emit = defineEmits<{
  'update:model-value': [value: number | null]
}>()

const geoStore = useGeoStore()
const loading = computed(() => geoStore.loading)

const options = computed(() => 
  geoStore.departamentos.map(d => ({
    label: d.nombre,
    value: d.id_departamento
  }))
)

// Load departamentos when paisId changes
watch(() => props.paisId, async (newPaisId, oldPaisId) => {
  // Only clear selection if pais actually changed (not initial mount)
  if (oldPaisId !== undefined && newPaisId !== oldPaisId) {
    emit('update:model-value', null)
  }
  
  if (newPaisId) {
    await geoStore.fetchDepartamentos(newPaisId)
  }
})

// Load on mount if paisId is already set
onMounted(async () => {
  if (props.paisId) {
    await geoStore.fetchDepartamentos(props.paisId)
  }
})
</script>
