<template>
  <q-card flat bordered class="rounded-16 q-mb-md hover-card overflow-hidden">
    <div class="row no-wrap items-center q-pa-md">
      <q-avatar :icon="icon" color="grey-2" text-color="primary" size="48px" />
      <div class="column q-ml-md flex-1">
        <div class="text-subtitle1 text-weight-bold">{{ title }}</div>
        <div class="text-caption text-grey-7">{{ subtitle }}</div>
      </div>
      <q-btn flat round color="primary" icon="edit" @click="$emit('edit')" />
      <q-btn flat round color="negative" icon="delete" @click="$emit('delete')" />
    </div>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  icon: string
}>()

defineEmits(['edit', 'delete'])
</script>

<style lang="scss" scoped>
.hover-card { transition: all 0.3s ease; &:hover { border-color: var(--q-primary); transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.05); } }
.flex-1 { flex: 1; }
</style>
