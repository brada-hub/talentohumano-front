<template>
  <router-view />
</template>

<script setup lang="ts">
import { useDarkMode } from 'src/shared/composables/useDarkMode'

const { init } = useDarkMode()
init()
</script>
