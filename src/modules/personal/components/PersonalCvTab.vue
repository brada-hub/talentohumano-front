<template>
  <div>
    <div class="row q-pa-sm justify-between bg-white items-center q-px-lg" style="border-bottom: 1px solid #eef2f6;">
      <div class="text-caption text-grey-7 font-mono">ID: {{ persona.id }}</div>
      <q-btn color="primary" icon="picture_as_pdf" label="Descargar CV Normalizado" @click="$emit('download')" :loading="isGeneratingPdf" rounded unelevated class="q-px-lg" />
    </div>
    <div class="row no-wrap full-width" style="height: calc(100vh - 280px);">
      
      <!-- LEFT: EXPEDIENTE VIEW -->
      <div class="col-12 col-md-7 scroll flex justify-center bg-slate-100 q-pa-lg">
        <div id="expediente-carta" class="reporte-container shadow-20">
          <div class="seccion-reporte text-center q-mb-md">
            <h1 class="header-title">UNITEPC</h1>
            <h2 class="header-subtitle text-uppercase">Universidad Técnica Privada Cosmos</h2>
            <h3 class="header-cv">CURRICULUM VITAE NORMALIZADO</h3>
            <h4 class="header-selection">{{ cargo || 'LEGAJO INSTITUCIONAL' }}</h4>
          </div>

          <!-- PHOTO & LOGO -->
          <div class="seccion-reporte row items-center no-wrap q-mb-lg q-px-md">
            <div class="col-4 flex justify-start">
              <img src="/unitepc_escudo.png" style="height: 100px; width: auto;" alt="Escudo" />
            </div>
            <div class="col-8 flex items-center justify-end">
              <div class="row no-wrap items-center q-gutter-md">
                <div class="text-right">
                  <div class="text-weight-bold" style="font-size: 11px; color: #6A37A3; line-height: 1.2;">
                    FOTOGRAFÍA<br/>PERSONAL:
                  </div>
                  <a v-if="persona.foto" @click="previewFile(persona.foto)" class="text-indigo-8 text-weight-bold cursor-pointer" style="text-decoration: underline; font-size: 9px; text-transform: uppercase;">
                    VER AQUÍ
                  </a>
                </div>
                <div class="photo-box-header">
                  <img v-if="persona.foto" :src="getFileUrl(persona.foto)" style="height: 110px; width: 90px; object-fit: cover; border: 1px solid #6A37A3;" />
                  <div v-else class="flex flex-center bg-grey-2" style="height: 110px; width: 90px; border: 1px solid #6A37A3;">
                    <q-icon name="person" color="grey-4" size="lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- DATOS PERSONALES -->
          <div class="seccion-reporte q-mb-lg">
            <div class="section-header">I. DATOS PERSONALES</div>
            <table class="data-table">
              <tr>
                <td class="label">NOMBRE COMPLETO:</td>
                <td class="value text-weight-bold" style="font-size: 14px; color: #6A37A3;">{{ persona.nombres }} {{ persona.primer_apellido }} {{ persona.segundo_apellido }}</td>
              </tr>
              <tr>
                <td class="label">CARGO INSTITUCIONAL:</td>
                <td class="value text-uppercase text-weight-bold">
                  {{ cargo || 'Sin Cargo' }}
                  <span style="color: #6A37A3; margin-left: 5px; font-weight: normal;">({{ area || 'Sin Unidad' }})</span>
                </td>
              </tr>
              <tr>
                <td class="label">Nº DE CÉDULA DE IDENTIDAD:</td>
                <td class="value">{{ persona.ci }} {{ persona.ci_expedido?.codigo_expedido || '' }}</td>
              </tr>
              <tr>
                <td class="label">NACIONALIDAD:</td>
                <td class="value text-uppercase">{{ persona.nacionalidad?.gentilicio || 'N/R' }}</td>
              </tr>
              <tr>
                <td class="label">DIRECCIÓN DE DOMICILIO:</td>
                <td class="value">{{ persona.direccion_domicilio }}</td>
              </tr>
              <tr>
                <td class="label">TELÉFONO DE CONTACTO:</td>
                <td class="value">{{ persona.celular_personal }}</td>
              </tr>
              <tr>
                <td class="label">CORREO PERSONAL:</td>
                <td class="value text-indigo-8" style="text-decoration: underline">{{ persona.correo_personal }}</td>
              </tr>
            </table>
          </div>

          <!-- MÉRITOS PLACEHOLDER FOR COMPACTION -->
          <div class="text-caption text-grey-6 text-center q-mt-xl italic font-serif">
             ... Secciones de formación académica, experiencia y otros méritos disponibles en modo descarga PDF ...
          </div>

          <!-- QR DE VERIFICACIÓN -->
          <div class="seccion-reporte q-mt-xl text-center" style="page-break-inside: avoid;">
            <div style="border: 1px solid #ddd; display: inline-block; padding: 8px;">
               <img :src="qrUrl" alt="QR Code" style="width: 120px; height: 120px;" />
            </div>
            <div class="text-grey-7 q-mt-sm" style="font-size: 9px; text-transform: uppercase;">
               VERIFICACIÓN DIGITAL INSTITUCIONAL · SIGETH
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: DOCUMENT PREVIEWER -->
      <div class="col-12 col-md-5 bg-slate-900 flex column no-wrap">
        <div class="q-pa-md row justify-between items-center" style="background: rgba(0,0,0,0.3); border-bottom: 1px solid rgba(255,255,255,0.05);">
          <div class="row items-center q-gutter-sm text-white">
            <q-icon name="visibility" color="amber-5" size="sm" />
            <span class="text-weight-bold text-caption text-uppercase" style="letter-spacing: 2px;">Visor de Documentación</span>
          </div>
        </div>

        <div class="col flex flex-center relative-position overflow-hidden">
          <iframe
            v-if="currentFileUrl && isPdf(currentFileUrl)"
            :src="currentFileUrl"
            class="full-width full-height border-none"
            style="border: none"
          ></iframe>
          <div v-else-if="currentFileUrl" class="full-width full-height flex flex-center q-pa-md overflow-auto">
            <img :src="currentFileUrl" class="shadow-24 rounded-borders" style="max-width: 100%; max-height: 100%; border: 4px solid rgba(255,255,255,0.1)" />
          </div>
          <div v-else class="text-center q-pa-xl" style="color: rgba(255,255,255,0.1)">
            <q-icon name="folder_open" size="6rem" class="q-mb-md" />
            <div class="text-h6 text-weight-bold text-uppercase" style="letter-spacing: 0.2em;">Bandeja Vacía</div>
            <p class="text-caption q-mt-sm">Selecciona una evidencia en el CV para visualizarla aquí.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  persona: any;
  cargo?: string;
  area?: string;
  baseUrl: string;
  isGeneratingPdf: boolean;
}

const props = defineProps<Props>()
defineEmits(['download'])

const currentFile = ref<string | null>(null)

const getFileUrl = (path: string) => {
  if (!path) return ''
  return `${props.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
}

const currentFileUrl = computed(() => currentFile.value ? getFileUrl(currentFile.value) : null)
const previewFile = (path: string) => { currentFile.value = path }
const isPdf = (path: string) => path.toLowerCase().endsWith('.pdf')

const qrUrl = computed(() => {
  const data = encodeURIComponent(`http://sigeth.unitepc.edu/verify/${props.persona.id}`)
  return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&color=222222&data=${data}`
})
</script>

<style lang="scss" scoped>
.reporte-container {
  background: white;
  width: 259mm;
  padding: 15mm;
  margin: 0 auto;
  font-family: 'Times New Roman', Times, serif;
}
.header-title { font-size: 48px; font-weight: 900; color: #1e293b; margin-bottom: 0; }
.header-subtitle { font-size: 20px; color: #64748b; margin-top: 0; }
.header-cv { background: #6A37A3; color: white; padding: 4px 12px; display: inline-block; font-size: 16px; margin-top: 20px; }
.section-header { border-bottom: 2px solid #6A37A3; color: #6A37A3; font-weight: 900; margin-top: 25px; margin-bottom: 10px; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table td { padding: 8px; border-bottom: 1px solid #eee; font-size: 13px; }
.data-table .label { width: 40%; font-weight: bold; color: #64748b; }
.photo-box-header { border: 2px solid #6A37A3; padding: 4px; border-radius: 4px; }
.bg-slate-900 { background: #0f172a; }
.bg-slate-100 { background: #f1f5f9; }
.scroll::-webkit-scrollbar { width: 6px; }
.scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 10px; }
</style>
