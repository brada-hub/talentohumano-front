<template>
  <q-page class="bg-page flex flex-center">
    <q-card class="unitepc-card login-card q-pa-lg">
      <q-card-section class="text-center">
        <div class="q-mb-md">
          <!-- Logo Placeholder -->
          <div class="text-h4 text-weight-bolder">
            <span class="text-primary">UNITE</span><span class="text-secondary">PC</span>
          </div>
          <div class="text-subtitle2 text-secondary">SISTEMA GESTIÓN TALENTO HUMANO</div>
        </div>
        <div class="text-h6 text-primary q-mt-md">Iniciar Sesión</div>
        <div class="text-caption text-hint">Ingresa tus credenciales para acceder</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="loginForm.username"
            outlined
            color="primary"
            label="Nombre de usuario"
            stack-label
            :rules="[val => !!val || 'El usuario es requerido']"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>

          <q-input
            v-model="loginForm.password"
            outlined
            color="primary"
            label="Contraseña"
            stack-label
            :type="showPassword ? 'text' : 'password'"
            :rules="[val => !!val || 'La contraseña es requerida']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="primary" />
            </template>
            <template v-slot:append>
              <q-btn
                flat
                round
                dense
                :icon="showPassword ? 'visibility_off' : 'visibility'"
                @click="showPassword = !showPassword"
                color="primary"
              />
            </template>
          </q-input>

          <div class="q-mt-xl">
            <q-btn
              label="Acceder al Sistema"
              type="submit"
              color="primary"
              class="full-width q-py-sm"
              unelevated
              :loading="authStore.loading"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pt-none">
        <q-btn flat color="secondary" label="¿Olvidaste tu contraseña?" size="sm" />
      </q-card-section>
    </q-card>
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
.bg-page {
  background-color: var(--bg-page);
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-top: 5px solid var(--color-primary);
}

.unitepc-card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}
</style>
