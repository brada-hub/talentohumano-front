<template>
  <q-layout view="lHh Lpr lFf">

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { onMounted } from 'vue'

const $q = useQuasar()

onMounted(() => {
  // Siempre forzar modo claro para el Portal de Empleados
  // Aislándolo del resto del sistema SIGETH
  $q.dark.set(false)
})
</script>
