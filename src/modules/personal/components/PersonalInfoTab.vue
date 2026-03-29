<template>
  <div class="row q-col-gutter-lg q-pt-lg">
    
    <!-- LEFT COLUMN (8): DATOS PERSONALES -->
    <div class="col-12 col-md-8">
      <q-card flat class="card-premium q-pa-lg">
        <div class="card-title row items-center q-mb-xl">
          <div class="card-title__icon bg-primary-soft q-mr-md">
            <q-icon name="person" color="primary" size="24px" />
          </div>
          <div class="text-subtitle1 text-weight-bold text-grey-9 text-uppercase" style="letter-spacing: 1px">Datos Personales</div>
        </div>

        <div class="row q-col-gutter-xl">
          <div class="col-12 col-sm-6">
            <div class="attribute-group">
              <div class="attribute-label">CÉDULA DE IDENTIDAD</div>
              <div class="attribute-value">{{ persona.ci }} {{ persona.expedido?.codigo_expedido || '' }}</div>
            </div>
          </div>
          <div class="col-12 col-sm-6">
            <div class="attribute-group">
              <div class="attribute-label">SEXO</div>
              <div class="attribute-value">{{ persona.sexo?.sexo || 'N/R' }}</div>
            </div>
          </div>
          <div class="col-12 col-sm-6">
            <div class="attribute-group">
              <div class="attribute-label">FECHA DE NACIMIENTO</div>
              <div class="attribute-value">{{ persona.fecha_nacimiento }} ({{ calculateAge(persona.fecha_nacimiento) }} años)</div>
            </div>
          </div>
          <div class="col-12 col-sm-6">
            <div class="attribute-group">
              <div class="attribute-label">NACIONALIDAD</div>
              <div class="attribute-value">{{ persona.nacionalidad?.gentilicio || 'Boliviana' }}</div>
            </div>
          </div>
          <div class="col-12">
            <div class="attribute-group">
              <div class="attribute-label">DIRECCIÓN DE DOMICILIO</div>
              <div class="attribute-value">{{ persona.direccion_domicilio || 'No especificada' }}</div>
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <!-- RIGHT COLUMN (4): CONTACT & SOCIAL SECURITY -->
    <div class="col-12 col-md-4 column q-gutter-y-lg">
      
      <!-- CONTACT CARD -->
      <q-card flat class="card-premium sidebar-card q-pa-lg border-left-primary">
        <div class="row items-center q-mb-lg">
           <q-icon name="alternate_email" color="primary" size="28px" />
           <div class="text-subtitle1 text-weight-bold q-ml-sm text-uppercase" style="letter-spacing: 1px">Contacto</div>
        </div>
        <div class="column q-gutter-y-md">
           <div class="contact-item row no-wrap items-center">
              <div class="contact-item__icon bg-slate-50 q-mr-md">
                 <q-icon name="phone" color="slate-600" size="20px" />
              </div>
              <div class="column">
                 <span class="text-caption text-grey-6 text-uppercase text-weight-bold" style="font-size: 9px">TELÉFONO</span>
                 <span class="text-weight-bold text-grey-9">{{ persona.celular_personal }}</span>
              </div>
           </div>
           <div class="contact-item row no-wrap items-center">
              <div class="contact-item__icon bg-slate-50 q-mr-md">
                 <q-icon name="email" color="slate-600" size="20px" />
              </div>
              <div class="column">
                 <span class="text-caption text-grey-6 text-uppercase text-weight-bold" style="font-size: 9px">EMAIL CORPORATIVO</span>
                 <span class="text-weight-bold text-grey-9">{{ correo_institucional || 'N/A' }}</span>
              </div>
           </div>
        </div>
      </q-card>

      <!-- SOCIAL SECURITY CARD -->
      <q-card flat class="card-premium q-pa-lg bg-slate-50 border-none shadow-none">
        <div class="row items-center q-mb-lg">
           <q-icon name="verified_user" color="primary" size="24px" />
           <div class="text-subtitle2 text-weight-bold q-ml-sm text-uppercase" style="letter-spacing: 1px">Seguridad Social</div>
        </div>
        
        <div class="column q-gutter-y-sm">
           <div class="social-item bg-white q-pa-md rounded-12 row items-center justify-between shadow-sm">
              <div class="column">
                 <span class="attribute-label" style="font-size: 9px">CAJA DE SALUD</span>
                 <span class="text-weight-bold text-grey-9 text-caption text-uppercase">{{ caja?.nombre || 'Pendiente' }}</span>
              </div>
              <q-icon name="medical_services" color="blue-2" size="22px" />
           </div>
           <div class="social-item bg-white q-pa-md rounded-12 row items-center justify-between shadow-sm">
              <div class="column">
                 <span class="attribute-label" style="font-size: 9px">AFP ADMINISTRADORA</span>
                 <span class="text-weight-bold text-grey-9 text-caption text-uppercase">{{ pensiones?.nombre || 'Aduana Previsión' }}</span>
              </div>
              <q-icon name="account_balance_wallet" color="indigo-2" size="22px" />
           </div>
        </div>
      </q-card>

    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  persona: any;
  correo_institucional?: string;
  caja?: any;
  pensiones?: any;
}

defineProps<Props>()

const calculateAge = (birthday: string) => {
  if (!birthday) return '0'
  const ageDifMs = Date.now() - new Date(birthday).getTime()
  const ageDate = new Date(ageDifMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}
</script>

<style lang="scss" scoped>
.card-premium {
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;
}

.border-left-primary { border-left: 6px solid #6A37A3; }

.card-title__icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}

.bg-primary-soft { background: rgba(106, 55, 163, 0.08); }
.bg-slate-50 { background: #f8fafc; }

.attribute-group {
  .attribute-label { font-size: 10px; font-weight: 800; color: #64748b; margin-bottom: 6px; letter-spacing: 1px; }
  .attribute-value { font-size: 16px; font-weight: 700; color: #1e293b; }
}

.contact-item__icon {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.bg-slate-50 { background: #f8fafc; }
.rounded-12 { border-radius: 12px; }
</style>
