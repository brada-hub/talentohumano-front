<template>
  <div class="header-mockup shadow-2 overflow-hidden">
    <div class="header-mockup__content q-pa-md row no-wrap items-center relative-position">
      
      <!-- Photo Profile (Minimal) -->
      <div class="relative-position">
        <q-avatar size="60px" class="profile-avatar border-glow-teal">
          <img :src="avatarUrl" />
        </q-avatar>
        <div class="status-dot"></div>
      </div>

      <!-- Compact Name and Info -->
      <div class="row no-wrap items-center q-ml-md full-width">
        <div class="column">
          <div class="row items-center q-gutter-md">
            <h1 class="text-h6 text-weight-bolder q-ma-none text-white text-uppercase letter-spacing-1">{{ name }}</h1>
            <q-badge color="teal-9" class="q-pa-xs px-2 rounded-4 text-weight-bold opacity-80" outline>CI: {{ id }}</q-badge>
          </div>
          <div class="text-caption text-weight-medium text-grey-4 row items-center">
            {{ role }}
            <span class="q-mx-sm opacity-30">|</span>
            {{ area }}
            <span v-if="location" class="q-mx-sm opacity-30">|</span>
            <span v-if="location" class="row items-center"><q-icon name="location_on" size="12px" /> {{ location }}</span>
          </div>
        </div>
        
        <q-space />

        <!-- Minimal Actions -->
        <div class="row q-gutter-xs">
          <q-btn flat round color="white" icon="o_edit" size="sm" class="opacity-60 hover-opacity-100" />
          <q-btn flat round color="white" icon="o_settings" size="sm" class="opacity-60 hover-opacity-100" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
defineProps<Props>()
</script>

<style lang="scss" scoped>
.header-mockup {
  border-radius: 12px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  position: relative;
  
  &__content {
    background-image: radial-gradient(circle at top right, rgba(0, 169, 157, 0.1), transparent 70%);
  }
}

.profile-avatar {
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
  &:hover { border-color: #00A99D; }
}

.border-glow-teal { box-shadow: 0 0 15px rgba(0, 169, 157, 0.3); }

.status-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #10b981;
  border-radius: 50%;
  border: 2px solid #0f172a;
}

.letter-spacing-1 { letter-spacing: 0.5px; }
.opacity-30 { opacity: 0.3; }
.opacity-60 { opacity: 0.6; }
.hover-opacity-100:hover { opacity: 1; }
.rounded-4 { border-radius: 4px; }
</style>
