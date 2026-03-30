<template>
  <q-page class="sigeth-page">
    <!-- Page Hero -->
    <div class="page-hero">
      <div class="page-hero__left">
        <div class="page-hero__title">Mi Perfil</div>
        <div class="page-hero__subtitle">
          Gestión de tu cuenta y preferencias
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="profile-grid">
      <!-- Profile Card -->
      <div class="sigeth-card profile-card">
        <div class="profile-header">
          <q-avatar size="80px" color="primary" text-color="white" class="q-mb-md">
            <span class="text-h4 text-weight-bold">{{ userInitials }}</span>
          </q-avatar>
          <div class="profile-name">{{ authStore.user?.username }}</div>
          <q-chip
            :label="activeRole"
            color="secondary"
            text-color="white"
            size="sm"
            class="q-mt-sm"
          />
        </div>

        <q-separator class="q-my-md" />

        <!-- User Info -->
        <div class="profile-info">
          <div class="info-item">
            <q-icon name="badge" color="primary" size="20px" />
            <div>
              <div class="info-label">Usuario</div>
              <div class="info-value">{{ authStore.user?.username }}</div>
            </div>
          </div>

          <div class="info-item">
            <q-icon name="shield" color="primary" size="20px" />
            <div>
              <div class="info-label">Roles</div>
              <div class="info-value">
                <q-chip
                  v-for="role in authStore.userRoles"
                  :key="role"
                  :label="role"
                  outline
                  color="primary"
                  size="sm"
                  class="q-mr-xs"
                />
              </div>
            </div>
          </div>

          <div class="info-item">
            <q-icon name="check_circle" color="positive" size="20px" />
            <div>
              <div class="info-label">Estado</div>
              <div class="info-value">
                <q-badge color="positive" label="Activo" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Permissions Card -->
      <div class="sigeth-card">
        <div class="card-section-header">
          <q-icon name="vpn_key" color="primary" size="20px" />
          <span>Permisos del Sistema</span>
        </div>

        <q-separator class="q-mb-md" />

        <div class="permissions-grid">
          <q-chip
            v-for="permission in authStore.userPermissions"
            :key="permission"
            :label="permission"
            outline
            color="secondary"
            size="sm"
            class="q-ma-xs"
          />
        </div>

        <div v-if="!authStore.userPermissions?.length" class="text-grey text-center q-py-md">
          No tienes permisos asignados
        </div>
      </div>

      <!-- Security Card -->
      <div class="sigeth-card">
        <div class="card-section-header">
          <q-icon name="security" color="primary" size="20px" />
          <span>Seguridad</span>
        </div>

        <q-separator class="q-mb-md" />

        <div class="q-gutter-y-sm">
          <q-btn
            flat
            no-caps
            icon="lock"
            label="Cambiar contraseña"
            color="primary"
            class="full-width justify-start"
            disable
          >
            <q-tooltip>Próximamente</q-tooltip>
          </q-btn>

          <q-btn
            flat
            no-caps
            icon="devices"
            label="Sesiones activas"
            color="primary"
            class="full-width justify-start"
            disable
          >
            <q-tooltip>Próximamente</q-tooltip>
          </q-btn>
        </div>
      </div>

      <!-- Quick Actions Card -->
      <div class="sigeth-card">
        <div class="card-section-header">
          <q-icon name="flash_on" color="primary" size="20px" />
          <span>Acciones Rápidas</span>
        </div>

        <q-separator class="q-mb-md" />

        <div class="q-gutter-y-sm">
          <q-btn
            flat
            no-caps
            icon="edit"
            label="Editar mi información"
            color="primary"
            class="full-width justify-start"
            disable
          >
            <q-tooltip>Próximamente</q-tooltip>
          </q-btn>

          <q-btn
            flat
            no-caps
            icon="logout"
            label="Cerrar sesión"
            color="negative"
            class="full-width justify-start"
            @click="handleLogout"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const userInitials = computed(() => {
  const username = authStore.user?.username || ''
  return username.substring(0, 2).toUpperCase()
})

const activeRole = computed(() => {
  const roles = authStore.user?.roles || []
  return roles.length > 0 ? roles[0] : 'Sin rol'
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.profile-card {
  grid-column: span 1;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.profile-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-label {
  font-size: 11px;
  color: var(--text-hint);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  color: var(--text-primary);
  margin-top: 2px;
}

.card-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--text-primary);
}

.permissions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

@media (min-width: 768px) {
  .profile-card {
    grid-column: span 2;
  }
}
</style>
