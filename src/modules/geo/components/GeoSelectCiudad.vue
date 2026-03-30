<template>
  <q-select
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
    :options="options"
    :label="label"
    :loading="loading"
    :disable="disable || !departamentoId"
    outlined
    color="primary"
    emit-value
    map-options
    clearable
    :rules="rules"
    use-input
    input-debounce="300"
    @filter="filterFn"
  >
    <template #prepend>
      <q-icon name="location_city" color="primary" />
    </template>
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          {{ departamentoId ? 'Escribe para buscar...' : 'Selecciona un departamento primero' }}
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useGeoStore } from '../stores/useGeoStore'

const props = defineProps<{
  modelValue: number | null
  departamentoId: number | null
  label?: string
  disable?: boolean
  rules?: any[]
}>()

const emit = defineEmits<{
  'update:model-value': [value: number | null]
}>()

const geoStore = useGeoStore()
const loading = computed(() => geoStore.loading)
const localOptions = ref<{ label: string; value: number }[]>([])

const options = computed(() => 
  localOptions.value.length > 0 ? localOptions.value : geoStore.ciudades.map(c => ({
    label: c.nombre,
    value: c.id_ciudad
  }))
)

// Filter function for search
async function filterFn(val: string, update: (callback: () => void) => void) {
  if (!props.departamentoId) {
    update(() => { localOptions.value = [] })
    return
  }

  if (val.length < 2) {
    // Show all cities from departamento
    update(() => {
      localOptions.value = geoStore.ciudades.map(c => ({
        label: c.nombre,
        value: c.id_ciudad
      }))
    })
    return
  }

  // Could implement search here if needed
  update(() => {
    const needle = val.toLowerCase()
    localOptions.value = geoStore.ciudades
      .filter(c => c.nombre.toLowerCase().includes(needle))
      .map(c => ({ label: c.nombre, value: c.id_ciudad }))
  })
}

// Load ciudades when departamentoId changes
watch(() => props.departamentoId, async (newDeptoId, oldDeptoId) => {
  // Only clear selection if depto actually changed
  if (oldDeptoId !== undefined && newDeptoId !== oldDeptoId) {
    emit('update:model-value', null)
    localOptions.value = []
  }
  
  if (newDeptoId) {
    await geoStore.fetchCiudades(newDeptoId)
  }
})

// Load on mount if departamentoId is already set
onMounted(async () => {
  if (props.departamentoId) {
    await geoStore.fetchCiudades(props.departamentoId)
  }
})
</script>
