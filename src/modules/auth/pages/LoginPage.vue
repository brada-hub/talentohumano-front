<template>
  <q-page class="login-page">
    <!-- Background with exact portal gradient and grid pattern -->
    <div class="login-bg sso-grid"></div>

    <!-- Login Card -->
    <div class="login-container">
      <q-card class="login-card">
        <!-- Logo Section -->
        <q-card-section class="text-center q-pb-none">
          <q-img src="/unitepc_escudo.png" width="90px" class="q-mb-md logo-float" />
          <div class="text-h4 text-weight-bolder brand-text">
            UNITEPC
          </div>
          <div class="text-subtitle2 text-secondary q-mt-xs text-weight-medium">
            Sistema de Gestión de Talento Humano
          </div>
        </q-card-section>

        <!-- Form Section -->
        <q-card-section class="q-pt-xl">
          <q-form @submit="onSubmit" class="q-gutter-y-lg">
            <q-input
              v-model="loginForm.username"
              outlined
              label="Nombre de usuario"
              autocomplete="username"
              :rules="[val => !!val || 'El usuario es requerido']"
              class="modern-input"
            >
              <template #prepend>
                <q-icon name="person" class="text-primary" />
              </template>
            </q-input>

            <q-input
              v-model="loginForm.password"
              outlined
              label="Contraseña"
              autocomplete="current-password"
              :type="showPassword ? 'text' : 'password'"
              :rules="[val => !!val || 'La contraseña es requerida']"
              class="modern-input"
            >
              <template #prepend>
                <q-icon name="lock" class="text-primary" />
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
              class="full-width q-py-md text-weight-bold btn-gradient-portal modern-btn"
              rounded
              unelevated
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
        <q-card-section class="text-center q-pt-md">
          <q-btn flat color="secondary" label="¿Olvidaste tu contraseña?" size="sm" no-caps class="hover-underline" />
        </q-card-section>
      </q-card>
      
      <div class="text-center q-mt-lg text-white opacity-60 text-caption">
        &copy; {{ new Date().getFullYear() }} UNITEPC - Todos los derechos reservados
      </div>
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
      
      // Si debe cambiar password, lo mandamos directo al perfil con un flag
      if (authStore.user?.debe_cambiar_password) {
        success('Debes actualizar tu contraseña por seguridad')
        router.push('/perfil?forceChange=1')
        return
      }

      success('Bienvenido al sistema SIGETH')
      
      // Si viene de un sistema externo por SSO
      if (router.currentRoute.value.query.returnTo) {
      const returnTo = router.currentRoute.value.query.returnTo as string;
      const tokenStr = authStore.token;
      const userStr = btoa(unescape(encodeURIComponent(JSON.stringify(authStore.user))));
      const separator = returnTo.includes('?') ? '&' : '?';
      window.location.href = `${returnTo}${separator}token=${tokenStr}&user=${userStr}`;
    } else {
      router.push('/')
    }
  } catch (error) {
    notifyError(error as string)
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #6A37A3 0%, #00A99D 100%);
  z-index: 0;
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  padding: 24px;
}

.login-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
}

.brand-text {
  background: linear-gradient(90deg, #6A37A3 0%, #00A99D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
}

.logo-float {
  filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.modern-input {
  :deep(.q-field__control) {
    border-radius: 12px !important;
    background: rgba(255, 255, 255, 0.5) !important;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.8) !important;
    }
    
    &::before {
      border-color: rgba(0, 0, 0, 0.05) !important;
    }
  }
  
  :deep(.q-field--focused .q-field__control) {
    box-shadow: 0 0 0 3px rgba(106, 55, 163, 0.1);
  }
}

.modern-btn {
  height: 54px;
  font-size: 16px;
  letter-spacing: 0.5px;
  box-shadow: 0 10px 20px -5px rgba(106, 55, 163, 0.4) !important;
}

.hover-underline {
  &:hover {
    text-decoration: underline;
  }
}

.opacity-60 {
  opacity: 0.6;
}
</style>
