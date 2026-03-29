<template>
  <div class="card-premium q-pa-xl q-mt-lg">
    <div class="text-h6 q-mb-xl text-weight-bold text-grey-9 row items-center">
      <q-icon name="work_history" color="primary" class="q-mr-sm" />
      Historial de Contrataciones
    </div>
    
    <q-timeline color="primary">
      <q-timeline-entry
        v-for="contract in contratos" :key="contract.id_contrato"
        :title="contract.cargo?.nombre_cargo || 'Investigador / Funcionario'"
        :subtitle="contract.fecha_inicio + ' — ' + (contract.fecha_fin || 'PRESENTE')"
        :color="contract.estado_contrato === 'Activo' ? 'positive' : 'grey-5'"
        icon="history_edu"
      >
        <div class="contract-card-compact bg-slate-50 q-pa-md rounded-12 row items-center">
          <div class="column col">
            <div class="text-weight-bold text-primary">{{ contract.area?.nombre_area }}</div>
            <div class="text-caption text-grey-7">{{ contract.sede?.nombre }}</div>
          </div>
          <div class="column items-end">
            <q-badge :color="contract.estado_contrato === 'Activo' ? 'green-2' : 'grey-3'" :text-color="contract.estado_contrato === 'Activo' ? 'green-9' : 'grey-8'" class="q-pa-sm text-weight-bold">
              {{ contract.estado_contrato }}
            </q-badge>
            <div class="text-caption text-weight-bold text-grey-9 q-mt-xs">{{ contract.salario }} Bs.</div>
          </div>
        </div>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script setup lang="ts">
interface Props {
  contratos: any[];
}
defineProps<Props>()
</script>

<style lang="scss" scoped>
.card-premium {
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;
}
.bg-slate-50 { background: #f8fafc; }
.rounded-12 { border-radius: 12px; }
.text-primary { color: #6A37A3 !important; }
</style>
