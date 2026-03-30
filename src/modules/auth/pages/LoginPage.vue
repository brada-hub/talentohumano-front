<template>
  <q-page class="login-page">
    <!-- Background with exact portal gradient -->
    <div class="login-bg"></div>

    <!-- Login Card -->
    <div class="login-container">
      <q-card class="login-card">
        <!-- Logo Section -->
        <q-card-section class="text-center q-pb-none">
          <q-img src="/unitepc_escudo.png" width="80px" class="q-mb-md" />
          <div class="text-h5 text-weight-bolder">
            <span class="text-white">UNITE</span><span class="text-white">PC</span>
          </div>
          <div class="text-caption text-white q-mt-xs">
            Sistema de Gestión de Talento Humano
          </div>
        </q-card-section>

        <!-- Form Section -->
        <q-card-section class="q-pt-lg">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="loginForm.username"
              outlined
              color="primary"
              label="Nombre de usuario"
              autocomplete="username"
              :rules="[val => !!val || 'El usuario es requerido']"
              bg-color="white"
            >
              <template #prepend>
                <q-icon name="person" color="primary" />
              </template>
            </q-input>

            <q-input
              v-model="loginForm.password"
              outlined
              color="primary"
              label="Contraseña"
              autocomplete="current-password"
              :type="showPassword ? 'text' : 'password'"
              :rules="[val => !!val || 'La contraseña es requerida']"
              bg-color="white"
            >
              <template #prepend>
                <q-icon name="lock" color="primary" />
              </template>
              <template #append>
                <q-btn
                  flat
                  round
                  dense
                  :icon="showPassword ? 'visibility_off' : 'visibility'"
                  @click="showPassword = !showPassword"
                  color="grey-6"
                  size="sm"
                />
              </template>
            </q-input>

            <q-btn
              label="Acceder al Sistema"
              type="submit"
              class="full-width q-py-md text-weight-bold btn-gradient-portal"
              rounded
              :loading="authStore.loading"
              :disable="authStore.loading"
            >
              <template #loading>
                <q-spinner-dots color="white" size="1em" />
              </template>
            </q-btn>
          </q-form>
        </q-card-section>

        <!-- Footer -->
        <q-card-section class="text-center q-pt-sm">
          <q-btn flat color="secondary" label="¿Olvidaste tu contraseña?" size="sm" no-caps />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'
import { useNotify } from 'src/shared/composables/useNotify'

const router = useRouter()
const authStore = useAuthStore()
const { success, error: notifyError } = useNotify()

const showPassword = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const onSubmit = async () => {
  if (authStore.loading) return

  try {
    await authStore.login(loginForm)
    success('Bienvenido al sistema SIGETH')
    router.push('/')
  } catch (error) {
    notifyError(error as string)
  }
}
</script>

<style lang="scss" scoped>
// ═══ Login Page - Exact Portal Gradient ═══
.login-page {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

// Background - EXACT portal gradient (no changes)
.login-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #6A37A3 0%, #00A99D 100%);
  z-index: 0;
}

// Centered container
.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

// Login card
.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
