<template>
  <div class="cv-main-wrapper">
    <!-- STATIC ACTION BAR -->
    <div class="cv-action-bar row justify-between items-center no-print">
      <div class="row items-center q-gutter-sm">
        <q-icon name="o_verified" color="primary" size="xs" />
        <span class="text-caption text-weight-bold text-grey-8">VISTA DE EXPEDIENTE DIGITAL</span>
        <q-badge color="grey-2" text-color="grey-9" class="rounded-4 text-weight-medium">v3.1</q-badge>
      </div>
      <div>
        <q-btn 
          no-caps
          color="primary"
          class="rounded-pill shadow-2"
          icon="download" 
          label="Descargar Informe Completo (PDF)" 
          @click="$emit('download')" 
          :loading="isGeneratingPdf" 
          dense
          padding="xs md"
        />
      </div>
    </div>

    <!-- SPLIT LAYOUT -->
    <div class="cv-split-layout">
      
      <!-- LEFT side (50%): CV content with independent scroll -->
      <div class="cv-left-panel">
        <div id="expediente-carta" class="reporte-container shadow-2">
          
          <div class="seccion-reporte text-center q-mb-xl">
            <h1 class="header-title">UNITEPC</h1>
            <h2 class="header-subtitle text-uppercase">Universidad Técnica Privada Cosmos</h2>
            <div class="q-mt-md">
              <span class="header-cv">CURRICULUM VITAE NORMALIZADO</span>
            </div>
            <h4 class="header-selection q-mt-sm">{{ cargo || 'LEGAJO INSTITUCIONAL' }}</h4>
          </div>

          <!-- PHOTO & LOGO -->
          <div class="seccion-reporte row items-center no-wrap q-mb-xl q-px-md">
            <div class="col-4 flex justify-start">
              <img src="/unitepc_escudo.png" style="height: 120px; width: auto;" alt="Escudo" />
            </div>
            <div class="col-8 flex items-center justify-end">
              <div class="row no-wrap items-center q-gutter-lg">
                <div class="text-right">
                  <div class="text-weight-bold" style="font-size: 13px; color: #6A37A3; line-height: 1.2;">
                    FOTOGRAFÍA<br/>PERSONAL:
                  </div>
                </div>
                <div class="photo-box-header">
                  <img v-if="persona.foto" :src="getFileUrl(persona.foto)" style="height: 140px; width: 110px; object-fit: cover; border: 1px solid #6A37A3;" />
                  <div v-else class="flex flex-center bg-grey-2" style="height: 140px; width: 110px; border: 1px solid #6A37A3;">
                    <q-icon name="person" color="grey-4" size="xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- I. DATOS PERSONALES -->
          <div class="seccion-reporte q-mb-xl">
            <div class="section-header">I. DATOS PERSONALES</div>
            <table class="data-table">
              <tr>
                <td class="label">NOMBRE COMPLETO:</td>
                <td class="value text-weight-bold" style="font-size: 16px; color: #6A37A3;">{{ persona.nombres }} {{ persona.primer_apellido }} {{ persona.segundo_apellido }}</td>
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

          <!-- II. FORMACIÓN ACADÉMICA -->
          <div v-if="persona.formacion_pregrado?.length" class="seccion-reporte q-mb-xl">
            <div class="section-header">II. FORMACIÓN ACADÉMICA</div>
            <div class="text-caption text-grey-6 italic q-mb-xs" style="font-size: 10px;">(TÍTULOS DE PREGRADO)</div>
            
            <table class="grid-table">
              <thead>
                <tr>
                  <th>NIVEL ACADÉMICO</th>
                  <th>UNIVERSIDAD / INSTITUCIÓN</th>
                  <th>CARRERA / PROFESIÓN</th>
                  <th>DEPARTAMENTO</th>
                  <th>PAÍS</th>
                  <th>FECHA DIPLOMA</th>
                  <th>DIPLOMA ACADÉMICO</th>
                  <th>FECHA TÍTULO</th>
                  <th>TÍTULO EN PROVISIÓN NACIONAL</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in persona.formacion_pregrado" :key="item.id">
                  <td class="text-uppercase text-weight-bold">{{ item.nivel || 'LICENCIATURAS' }}</td>
                  <td class="text-uppercase">{{ item.institucion || 'N/R' }}</td>
                  <td class="text-uppercase">{{ item.carrera || 'N/R' }}</td>
                  <td class="text-uppercase text-center">{{ item.depto?.nombre || 'N/R' }}</td>
                  <td class="text-uppercase text-center text-grey-7">{{ item.depto?.pais?.nombre || 'BOLIVIA' }}</td>
                  <td class="text-center">{{ formatDate(item.fecha_diploma) }}</td>
                  <td class="text-center bg-white">
                      <div v-if="item.archivo_diploma" class="column items-center">
                        <img :src="getDocQrUrl(item.archivo_diploma)" style="width: 50px; height: 50px;" class="q-mb-xs" />
                        <q-btn flat dense round color="primary" icon="visibility" @click="previewFile(item.archivo_diploma)" />
                      </div>
                  </td>
                  <td class="text-center">{{ formatDate(item.fecha_titulo) }}</td>
                  <td class="text-center bg-white">
                      <div v-if="item.archivo_titulo" class="column items-center">
                        <img :src="getDocQrUrl(item.archivo_titulo)" style="width: 50px; height: 50px;" class="q-mb-xs" />
                        <q-btn flat dense round color="primary" icon="visibility" @click="previewFile(item.archivo_titulo)" />
                      </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- III. FORMACIÓN EN POSGRADO -->
          <div v-if="persona.formacion_postgrado?.length" class="seccion-reporte q-mb-xl">
            <div class="section-header">III. FORMACIÓN EN POSGRADO</div>
            <div class="text-caption text-grey-6 italic q-mb-xs" style="font-size: 10px;">(DIPLOMADOS, MAESTRÍAS, DOCTORADOS)</div>
            
            <table class="grid-table">
              <thead>
                <tr>
                  <th>TIPO DE POSGRADO</th>
                  <th>NOMBRE DEL PROGRAMA</th>
                  <th>FECHA DE CERTIFICACIÓN</th>
                  <th>INSTITUCIÓN</th>
                  <th>DEPARTAMENTO</th>
                  <th>PAÍS</th>
                  <th>CERTIFICADO DE POSGRADO</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in persona.formacion_postgrado" :key="item.id">
                  <td class="text-uppercase text-weight-bold">{{ item.tipo || 'N/R' }}</td>
                  <td class="text-uppercase">{{ item.nombre_programa || 'N/R' }}</td>
                  <td class="text-center">{{ formatDate(item.fecha_certificacion || item.fecha_diploma) }}</td>
                  <td class="text-uppercase">{{ item.institucion || 'N/R' }}</td>
                  <td class="text-uppercase text-center">{{ item.depto?.nombre || 'N/R' }}</td>
                  <td class="text-uppercase text-center text-grey-7">{{ item.depto?.pais?.nombre || 'BOLIVIA' }}</td>
                  <td class="text-center bg-white">
                      <div v-if="item.archivo_respaldo" class="column items-center">
                        <img :src="getDocQrUrl(item.archivo_respaldo)" style="width: 50px; height: 50px;" class="q-mb-xs" />
                        <q-btn flat dense round color="primary" icon="visibility" @click="previewFile(item.archivo_respaldo)" />
                      </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- IV. EXPERIENCIA DOCENCIA -->
          <div v-if="persona.experiencia_docente?.length" class="seccion-reporte q-mb-xl">
            <div class="section-header">IV. EXPERIENCIA DOCENCIA</div>
            <div class="text-caption text-grey-6 italic q-mb-xs" style="font-size: 10px;">(EXPERIENCIA COMO DOCENTE UNIVERSITARIO)</div>
            
            <table class="grid-table">
              <thead>
                <tr>
                  <th>UNIVERSIDAD</th>
                  <th>CARRERA</th>
                  <th>DEPARTAMENTO</th>
                  <th>PAÍS</th>
                  <th>ASIGNATURAS</th>
                  <th>GESTIÓN/PERIODO</th>
                  <th>RESPALDO DOCUMENTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in persona.experiencia_docente" :key="item.id">
                  <td class="text-uppercase">{{ item.institucion || 'N/R' }}</td>
                  <td class="text-uppercase">{{ item.carrera || 'N/R' }}</td>
                  <td class="text-uppercase text-center">{{ item.depto?.nombre || 'COCHABAMBA' }}</td>
                  <td class="text-uppercase text-center text-grey-7">{{ item.depto?.pais?.nombre || 'BOLIVIA' }}</td>
                  <td class="text-uppercase">{{ item.materia || item.asignaturas || 'N/R' }}</td>
                  <td class="text-center">{{ item.gestion_periodo || formatDateRange(item.fecha_inicio, item.fecha_fin) }}</td>
                  <td class="text-center bg-white">
                      <div v-if="item.archivo_respaldo" class="column items-center">
                        <img :src="getDocQrUrl(item.archivo_respaldo)" style="width: 50px; height: 50px;" class="q-mb-xs" />
                        <q-btn flat dense round color="primary" icon="visibility" @click="previewFile(item.archivo_respaldo)" />
                      </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- V. EXPERIENCIA PROFESIONAL -->
          <div v-if="persona.experiencia_profesional?.length" class="seccion-reporte q-mb-xl">
            <div class="section-header">V. EXPERIENCIA PROFESIONAL</div>
            <div class="text-caption text-grey-6 italic q-mb-xs" style="font-size: 10px;">(EXPERIENCIA LABORAL GENERAL)</div>
            
            <table class="grid-table">
              <thead>
                <tr>
                  <th>CARGO DESEMPEÑADO</th>
                  <th>EMPRESA/INSTITUCIÓN</th>
                  <th>DEPARTAMENTO</th>
                  <th>PAÍS</th>
                  <th>FECHA INICIO</th>
                  <th>FECHA FIN</th>
                  <th>CERTIFICADO DE TRABAJO</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in persona.experiencia_profesional" :key="item.id">
                  <td class="text-uppercase text-weight-bold">{{ item.cargo || 'N/R' }}</td>
                  <td class="text-uppercase">{{ item.empresa || 'N/R' }}</td>
                  <td class="text-uppercase text-center">{{ item.depto?.nombre || 'COCHABAMBA' }}</td>
                  <td class="text-uppercase text-center text-grey-7">{{ item.depto?.pais?.nombre || 'BOLIVIA' }}</td>
                  <td class="text-center">{{ formatDate(item.fecha_inicio) }}</td>
                  <td class="text-center">{{ formatDate(item.fecha_fin, 'A la fecha') }}</td>
                  <td class="text-center bg-white">
                      <div v-if="item.archivo_respaldo" class="column items-center">
                        <img :src="getDocQrUrl(item.archivo_respaldo)" style="width: 50px; height: 50px;" class="q-mb-xs" />
                        <q-btn flat dense round color="primary" icon="visibility" @click="previewFile(item.archivo_respaldo)" />
                      </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- VI. CAPACITACIONES Y CURSOS -->
          <div v-if="persona.capacitaciones?.length" class="seccion-reporte q-mb-xl">
            <div class="section-header">VI. CAPACITACIONES Y CURSOS</div>
             <table class="grid-table">
                <thead>
                  <tr>
                    <th>NOMBRE DEL CURSO/TALLER</th>
                    <th>INSTITUCIÓN ORGANIZADORA</th>
                    <th>DEPARTAMENTO</th>
                    <th>PAÍS</th>
                    <th>DURACIÓN (HRS)</th>
                    <th>FECHA CERTIFICADO</th>
                    <th>RESPALDO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in persona.capacitaciones" :key="item.id">
                    <td class="text-uppercase text-weight-bold">{{ item.nombre_curso || 'N/R' }}</td>
                    <td class="text-uppercase">{{ item.institucion || 'N/R' }}</td>
                    <td class="text-uppercase text-center">{{ item.depto?.nombre || 'COCHABAMBA' }}</td>
                    <td class="text-uppercase text-center text-grey-7">{{ item.depto?.pais?.nombre || 'BOLIVIA' }}</td>
                    <td class="text-center">{{ item.horas_academicas || item.carga_horaria || 'N/R' }}</td>
                    <td class="text-center">{{ formatDate(item.fecha_certificado || item.fecha) }}</td>
                    <td class="text-center bg-white">
                       <div v-if="item.archivo_respaldo" class="column items-center">
                          <img :src="getDocQrUrl(item.archivo_respaldo)" style="width: 50px; height: 50px;" class="q-mb-xs" />
                          <q-btn flat dense round color="primary" icon="visibility" @click="previewFile(item.archivo_respaldo)" />
                       </div>
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>

          <!-- VII. PRODUCCIÓN INTELECTUAL -->
          <div v-if="persona.produccion_intelectual?.length" class="seccion-reporte q-mb-xl">
            <div class="section-header">VII. PRODUCCIÓN INTELECTUAL</div>
            <table class="grid-table">
                <thead>
                  <tr>
                    <th>TÍTULO DE LA OBRA/ARTÍCULO</th>
                    <th>TIPO DE PUBLICACIÓN</th>
                    <th>EDITORIAL O REVISTA</th>
                    <th>DEPARTAMENTO</th>
                    <th>PAÍS</th>
                    <th>AÑO</th>
                    <th>DESCARGAR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in persona.produccion_intelectual" :key="item.id">
                    <td class="text-uppercase text-weight-bold">{{ item.titulo || 'N/R' }}</td>
                    <td class="text-uppercase">{{ item.tipo_produccion || item.tipo || 'N/R' }}</td>
                    <td class="text-uppercase">{{ item.editorial || 'N/R' }}</td>
                    <td class="text-uppercase text-center">{{ item.depto?.nombre || 'COCHABAMBA' }}</td>
                    <td class="text-uppercase text-center text-grey-7">{{ item.depto?.pais?.nombre || 'BOLIVIA' }}</td>
                    <td class="text-center">{{ item.anio || item.fecha || 'N/R' }}</td>
                    <td class="text-center bg-white">
                       <div v-if="item.archivo_respaldo" class="column items-center">
                          <img :src="getDocQrUrl(item.archivo_respaldo)" style="width: 50px; height: 50px;" class="q-mb-xs" />
                          <q-btn flat dense round color="primary" icon="visibility" @click="previewFile(item.archivo_respaldo)" />
                       </div>
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>

          <!-- VIII. RECONOCIMIENTOS -->
          <div v-if="persona.reconocimientos?.length" class="seccion-reporte q-mb-xl">
            <div class="section-header">VIII. RECONOCIMIENTOS</div>
            <table class="grid-table">
                <thead>
                  <tr>
                    <th>TÍTULO DEL RECONOCIMIENTO/PREMIO</th>
                    <th>INSTITUCIÓN OTORGANTE</th>
                    <th>FECHA</th>
                    <th>RESPALDO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in persona.reconocimientos" :key="item.id">
                    <td class="text-uppercase text-weight-bold">{{ item.titulo_premio }}</td>
                    <td class="text-uppercase">{{ item.institucion_otorgante }}</td>
                    <td class="text-center">{{ formatDate(item.fecha) }}</td>
                    <td class="text-center bg-white">
                       <div v-if="item.archivo_respaldo" class="column items-center">
                          <img :src="getDocQrUrl(item.archivo_respaldo)" style="width: 50px; height: 50px;" class="q-mb-xs" />
                          <q-btn flat dense round color="primary" icon="visibility" @click="previewFile(item.archivo_respaldo)" />
                       </div>
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>

          <!-- IX. IDIOMAS -->
          <div v-if="persona.idiomas?.length" class="seccion-reporte q-mb-xl">
            <div class="section-header">IX. IDIOMAS</div>
             <table class="grid-table">
                <thead>
                  <tr>
                    <th>IDIOMA</th>
                    <th>NIVEL HABLA</th>
                    <th>NIVEL ESCRITURA</th>
                    <th>NIVEL LECTURA</th>
                    <th>CERTIFICADOS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in persona.idiomas" :key="item.id">
                    <td class="text-uppercase text-weight-bold">{{ item.idioma }}</td>
                    <td class="text-uppercase text-center">{{ item.nivel_habla }}</td>
                    <td class="text-uppercase text-center">{{ item.nivel_escritura }}</td>
                    <td class="text-uppercase text-center">{{ item.nivel_lee }}</td>
                    <td class="text-center bg-white">
                       <div v-if="item.archivo_respaldo" class="column items-center">
                          <img :src="getDocQrUrl(item.archivo_respaldo)" style="width: 50px; height: 50px;" class="q-mb-xs" />
                          <q-btn flat dense round color="primary" icon="visibility" @click="previewFile(item.archivo_respaldo)" />
                       </div>
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>

          <!-- FINAL QR -->
          <div class="seccion-reporte q-mt-xl text-center" style="page-break-inside: avoid; border-top: 2px dashed #eee; padding-top: 40px;">
            <div style="border: 2px solid #6A37A3; display: inline-block; padding: 12px; border-radius: 8px;">
               <img :src="qrUrl" alt="QR Code" style="width: 140px; height: 140px;" />
            </div>
            <div class="text-indigo-9 q-mt-md text-weight-bold" style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">
               VERIFICACIÓN DIGITAL INSTITUCIONAL · SIGETH UNITEPC
            </div>
            <div class="text-grey-6" style="font-size: 9px;">Documento generado el {{ formatDate(new Date().toISOString()) }}</div>
          </div>
          
        </div>
      </div>

      <!-- RIGHT side (50%): Fixed document viewer -->
      <div class="cv-right-panel">
        <q-btn 
          v-if="currentFileUrl"
          icon="close" flat round dense 
          @click="currentFile = null" 
          color="white" 
          class="visor-close-btn"
        />

        <div class="visor-content">
          <iframe
            v-if="currentFileUrl && isPdf(currentFileUrl)"
            :src="currentFileUrl"
            class="full-width full-height"
            style="border: none;"
          ></iframe>
          <div v-else-if="currentFileUrl" class="full-width full-height flex flex-center q-pa-md overflow-auto scroll-dark">
            <img :src="currentFileUrl" style="max-width: 100%; max-height: 100%; border: 4px solid rgba(255,255,255,0.1); border-radius: 8px;" />
          </div>
          <div v-else class="text-center q-pa-xl" style="color: rgba(255,255,255,0.15)">
            <q-icon name="o_folder_open" size="6rem" class="q-mb-md" />
            <div class="text-h6 text-weight-bold text-uppercase" style="letter-spacing: 4px;">Sin Evidencia</div>
            <p class="text-caption q-mt-sm" style="opacity: 0.5;">Haz clic en el icono "OJO" en la tabla para previsualizar el documento original.</p>
          </div>
        </div>

        <div class="visor-footer">
           <span class="text-grey-6" style="font-size: 9px;">Powered by SIGETH Document Engine v2.0</span>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

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
  const data = encodeURIComponent(`http://sigeth.unitepc.edu/verify/${props.persona?.id}`)
  return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&color=222222&data=${data}`
})

const getDocQrUrl = (path: string) => {
  const fullLink = getFileUrl(path)
  return `https://api.qrserver.com/v1/create-qr-code/?size=60x60&color=000000&data=${encodeURIComponent(fullLink)}`
}

const formatDateRange = (start: string | null, end: string | null) => {
  if (!start) return 'N/A'
  const s = new Date(start).getFullYear()
  const e = end ? new Date(end).getFullYear() : 'Presente'
  return `${s} / ${e}`
}
const formatDate = (dateStr: string | null | undefined, fallback = 'N/R') => {
  if (!dateStr) return fallback
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr // Por si ya viene formateada o es un año solo
    return d.toLocaleDateString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    })
  } catch {
    return fallback
  }
}
</script>

<style lang="scss" scoped>
/* Contenedor principal del tab */
.cv-main-wrapper {
  background: white;
  width: 100%;
  /* Restamos aproximadamente la altura del header global y tabs (aprox 140px) */
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
}

/* Barra de acciones (Descargar PDF) */
.cv-action-bar {
  padding: 12px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0; /* No debe encogerse */
}

/* El area dividida ocupa el resto del espacio vertical */
.cv-split-layout {
  display: flex;
  flex: 1; /* Ocupa el espacio restante del contenedor */
  overflow: hidden; /* Cero scroll en el contenedor padre */
}

/* Mitad izquierda: el CV. Aquí va el scroll */
.cv-left-panel {
  flex: 0 0 50%; /* Ocupa exactamente el 50% */
  height: 100%;
  overflow-y: auto; /* Scroll vertical SOLO en esta mitad */
  background: #f1f5f9;
  padding: 40px 20px;
  border-right: 1px solid #e2e8f0;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
}

/* Mitad derecha: Visor oscuro. Cero scroll. */
.cv-right-panel {
  flex: 0 0 50%; /* Ocupa exactamente el 50% restante */
  height: 100%;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  position: relative; /* Para el boton de cerrar */
  overflow: hidden;
}

.visor-close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(4px);
}

.visor-content {
  flex: 1; /* Ocupa todo el espacio de la mitad derecha, menos el footer */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Prevenir scroll */
}

.visor-footer {
  background: #020617; /* Slate más oscuro */
  text-align: center;
  padding: 6px;
  flex-shrink: 0;
}

/* -------- Estilos de impresion y PDF -------- */
.reporte-container {
  background: white;
  width: 100%;
  max-width: 850px;
  padding: 25mm 20mm;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  border-radius: 8px;
}

.header-title { font-size: 56px; font-weight: 900; color: #1e293b; margin-bottom: 0; letter-spacing: -2px; }
.header-subtitle { font-size: 18px; color: #64748b; margin-top: -10px; font-weight: 500; letter-spacing: 4px; }
.header-cv { background: #6A37A3; color: white; padding: 8px 24px; display: inline-block; font-size: 18px; font-weight: 800; border-radius: 4px; letter-spacing: 2px; }
.section-header { border-bottom: 3px solid #6A37A3; color: #6A37A3; font-weight: 900; font-size: 14px; margin-top: 40px; margin-bottom: 20px; letter-spacing: 1px; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
.data-table .label { width: 35%; font-weight: 700; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
.data-table .value { color: #1e293b; }

.photo-box-header { border: 2px solid #6A37A3; padding: 6px; border-radius: 8px; background: white; box-shadow: 0 10px 25px rgba(106, 55, 163, 0.15); }

.grid-table {
  width: 100%;
  border-collapse: collapse;
  border: 4px solid #6A37A3;
  font-size: 11px;
}
.grid-table th {
  background: #f8fafc;
  color: #6A37A3;
  padding: 8px 4px;
  border: 1px solid #6A37A3;
  text-transform: uppercase;
  font-weight: 900;
  text-align: center;
}
.grid-table td {
  padding: 8px 6px;
  border: 1px solid #6A37A3;
  color: #1e293b;
  line-height: 1.2;
}

.scroll-dark::-webkit-scrollbar { width: 8px; }
.scroll-dark::-webkit-scrollbar-track { background: #0f172a; }
.scroll-dark::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }

.rounded-4 { border-radius: 4px; }

.no-print {
  @media print {
    display: none !important;
  }
}
</style>
