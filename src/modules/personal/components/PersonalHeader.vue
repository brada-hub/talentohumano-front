<template>
  <div class="header-mockup shadow-12 overflow-hidden">
    <div class="header-mockup__content q-pa-xl row no-wrap items-center relative-position">
      
      <!-- Photo Profile with Status Badge -->
      <div class="relative-position">
        <q-avatar size="140px" class="profile-avatar-square shadow-10">
          <img :src="avatarUrl" />
        </q-avatar>
        <div class="status-badge-absolute flex flex-center">
          <span class="dot-active q-mr-xs"></span>
          <span class="text-caption text-weight-bolder">{{ status?.toUpperCase() || 'ACTIVO' }}</span>
        </div>
      </div>

      <!-- Name and Main Info -->
      <div class="column q-ml-xl text-white full-width">
        <div class="row justify-between items-start no-wrap">
          <div class="column">
            <h1 class="text-h3 text-weight-bolder q-ma-none text-uppercase">{{ name }}</h1>
            <div class="text-h6 text-weight-medium opacity-80 row items-center">
              {{ role }}
              <span class="q-mx-sm opacity-50">•</span>
              {{ area }}
            </div>
          </div>
          <!-- Action Buttons Top Right -->
          <div class="row q-gutter-sm">
            <q-btn round flat color="white" icon="edit" class="bg-white-10"><q-tooltip>Editar Perfil</q-tooltip></q-btn>
            <q-btn round flat color="white" icon="person_off" class="bg-white-10"><q-tooltip>Desactivar Cuenta</q-tooltip></q-btn>
          </div>
        </div>

        <!-- Chips Info Row -->
        <div class="row q-gutter-md q-mt-lg items-center">
          <div class="header-info-chip" v-for="chip in infoChips" :key="chip.label">
            <q-icon :name="chip.icon" size="20px" class="q-mr-sm" :class="chip.iconClass" />
            <div class="column">
              <span class="chip-label">{{ chip.label }}</span>
              <span class="chip-value">{{ chip.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string;
  role: string;
  area: string;
  status: string;
  id: string | number;
  location?: string;
  birthDate?: string;
  avatarUrl?: string;
}

const props = defineProps<Props>()

const infoChips = computed(() => [
  { label: 'ID LEGAJO', value: `EMP-${String(props.id).padStart(4, '0')}`, icon: 'badge', iconClass: 'text-primary' },
  { label: 'SEDE ORIGEN', value: props.location || 'Cochabamba, Bolivia', icon: 'location_on', iconClass: 'text-red-5' },
  { label: 'NACIMIENTO', value: props.birthDate || 'Feb 24, 1995', icon: 'cake', iconClass: 'text-indigo-5' }
])
</script>

<style lang="scss" scoped>
.header-mockup {
  border-radius: 24px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  position: relative;
  
  &__content {
    background-image: url('data:image/svg+xml,<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" opacity="0.03"/></svg>');
    background-position: right bottom;
    background-repeat: no-repeat;
  }
}

.profile-avatar-square {
  border-radius: 20px;
  border: 4px solid rgba(255, 255, 255, 0.1);
}

.status-badge-absolute {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #10b981;
  color: white;
  padding: 4px 12px;
  border-radius: 100px;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.4);
}

.dot-active {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 8px white;
}

.header-info-chip {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  backdrop-filter: blur(5px);
  
  .chip-label { font-size: 8px; font-weight: 800; color: rgba(255, 255, 255, 0.4); letter-spacing: 1px; }
  .chip-value { font-size: 13px; font-weight: 700; color: white; }
}

.bg-white-10 {
  background: rgba(255, 255, 255, 0.1);
  &:hover { background: rgba(255, 255, 255, 0.2); }
}
</style>
