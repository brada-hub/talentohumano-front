<template>
  <q-select
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
    :options="options"
    :label="label"
    :loading="loading"
    :disable="disable"
    outlined
    color="primary"
    emit-value
    map-options
    clearable
    :rules="rules"
  >
    <template #prepend>
      <q-icon name="public" color="primary" />
    </template>
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          No hay países disponibles
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGeoStore } from '../stores/useGeoStore'

const props = defineProps<{
  modelValue: number | null
  label?: string
  disable?: boolean
  rules?: any[]
}>()

defineEmits<{
  'update:model-value': [value: number | null]
}>()

const geoStore = useGeoStore()
const loading = computed(() => geoStore.loading)

const options = computed(() => 
  geoStore.paises.map(p => ({
    label: p.nombre,
    value: p.id_pais
  }))
)

onMounted(() => {
  geoStore.fetchPaises()
})
</script>
