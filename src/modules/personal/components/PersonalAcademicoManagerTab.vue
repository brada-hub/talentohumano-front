<template>
  <AcademicoManagerTab
    :profile="profile"
    :loading="loading"
    :persona-id="personaId"
    :editable="editable"
    @refresh="$emit('refresh')"
  />
</template>

<script setup lang="ts">
import AcademicoManagerTab from 'src/modules/academico/components/AcademicoManagerTab.vue'

withDefaults(defineProps<{
  profile: any | null
  loading: boolean
  personaId?: string | null
  editable?: boolean
}>(), {
  personaId: null,
  editable: true,
})

defineEmits<{
  (e: 'refresh'): void
}>()
</script>
