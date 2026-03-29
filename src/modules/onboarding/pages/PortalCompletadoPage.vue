<template>
  <q-page class="flex flex-center bg-grey-1">
    <div class="column items-center q-pa-xl bg-white rounded-32 shadow-10 text-center animate-fade" style="max-width: 500px">
      <q-icon name="check_circle" color="positive" size="120px" class="q-mb-md animate-bounce" />
      <div class="text-h4 text-weight-bold text-primary q-mb-sm">¡Registro Completado!</div>
      <p class="text-subtitle1 text-grey-7 q-mb-xl">
        Tu información ha sido enviada correctamente al Departamento de Talento Humano de <strong>UNITEPC</strong>. 
        Te contactaremos pronto para finalizar tu legajo digital.
      </p>
      
      <q-btn 
        unelevated 
        rounded 
        color="primary" 
        padding="12px 40px" 
        label="Volver al Inicio" 
        to="/portal/verificar" 
        no-caps 
        class="text-weight-bold"
      />
    </div>
  </q-page>
</template>

<style scoped>
.animate-fade {
  animation: fadeIn 0.8s ease-out;
}
.animate-bounce {
  animation: bounce 2s infinite;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
</style>
