<template>
  <div :class="['cv-shell', { 'cv-shell--embedded': props.embedded }]">
    <div class="cv-toolbar row items-center justify-end no-wrap no-print">
      <q-btn
        no-caps
        color="primary"
        class="cv-download-btn"
        icon="download"
        label="Descargar Informe Completo (PDF)"
        :loading="isGeneratingPdf"
        @click="$emit('download')"
      />
    </div>

    <div class="cv-body">
      <div class="cv-sheet-panel">
        <div class="cv-sheet shadow-2">
          <table class="cv-header-table">
            <tr>
              <td colspan="3" class="cv-header-title">
                <div class="cv-line-1">UNIVERSIDAD TECNICA PRIVADA COSMOS</div>
                <div class="cv-line-2">UNITEPC</div>
                <div class="cv-line-3">CURRICULUM VITAE</div>
              </td>
            </tr>
            <tr>
              <td class="cv-logo-cell">
                <img src="/unitepc_escudo.png" alt="Logo UNITEPC" class="cv-logo" />
              </td>
              <td class="cv-header-spacer"></td>
              <td class="cv-photo-cell">
                <div class="cv-photo-caption">Fotografia personal</div>
                <div class="cv-photo-box">
                  <img v-if="photoUrl" :src="photoUrl" alt="Fotografia personal" class="cv-photo" />
                  <div v-else class="cv-photo-placeholder">FOTOGRAFIA<br />PERSONAL</div>
                </div>
              </td>
            </tr>
          </table>

          <div class="cv-section-title">I. Datos Personales</div>
          <table class="cv-data-table">
            <tr>
              <td class="cv-label">Nombre completo</td>
              <td class="cv-value" colspan="3">{{ fullName || '---' }}</td>
            </tr>
            <tr>
              <td class="cv-label">Documento de identidad</td>
              <td class="cv-value">{{ displayCi }}</td>
              <td class="cv-label">Sexo</td>
              <td class="cv-value">{{ sexoLabel }}</td>
            </tr>
            <tr>
              <td class="cv-label">Fecha de nacimiento</td>
              <td class="cv-value">{{ formatDate(persona?.fecha_nacimiento, '---') }}</td>
              <td class="cv-label">Nacionalidad</td>
              <td class="cv-value">{{ nationalityLabel }}</td>
            </tr>
            <tr>
              <td class="cv-label">Pais</td>
              <td class="cv-value">{{ countryLabel }}</td>
              <td class="cv-label">Telefono personal</td>
              <td class="cv-value">{{ persona?.celular_personal || '---' }}</td>
            </tr>
            <tr>
              <td class="cv-label">Ciudad / sede de origen</td>
              <td class="cv-value" colspan="3">{{ originLabel }}</td>
            </tr>
            <tr>
              <td class="cv-label">Direccion de domicilio</td>
              <td class="cv-value" colspan="3">{{ persona?.direccion_domicilio || '---' }}</td>
            </tr>
            <tr>
              <td class="cv-label">Correo electronico personal</td>
              <td class="cv-value cv-value--normal" colspan="3">{{ persona?.correo_personal || '---' }}</td>
            </tr>
          </table>

          <div class="cv-section-title">II. Formacion Academica</div>
          <div class="cv-sub-title">A. Estudios de pregrado</div>
          <template v-if="persona?.formacion_pregrado?.length">
            <div v-for="(item, index) in persona.formacion_pregrado" :key="`pre-${item.id ?? index}`" class="cv-record-block">
              <table class="cv-record-table">
                <tr>
                  <td class="cv-record-title-cell">{{ Number(index) + 1 }}</td>
                  <td class="cv-record-main" colspan="5">{{ item.carrera || item.titulo || '---' }}</td>
                </tr>
                <tr>
                  <td class="cv-meta-label">Institucion</td>
                  <td class="cv-meta-value" colspan="2">{{ item.institucion || '---' }}</td>
                  <td class="cv-meta-label">Nivel academico</td>
                  <td class="cv-meta-value" colspan="2">{{ item.nivel || '---' }}</td>
                </tr>
                <tr>
                  <td class="cv-meta-label">Departamento</td>
                  <td class="cv-meta-value">{{ getDepartmentName(item) }}</td>
                  <td class="cv-meta-label">Pais</td>
                  <td class="cv-meta-value">{{ getCountryName(item) }}</td>
                  <td class="cv-meta-label">Fecha diploma</td>
                  <td class="cv-meta-value">{{ formatDate(item.fecha_diploma, '---') }}</td>
                </tr>
                <tr>
                  <td class="cv-meta-label">Fecha titulo</td>
                  <td class="cv-meta-value">{{ formatDate(item.fecha_titulo, '---') }}</td>
                  <td class="cv-meta-label">Diploma academico</td>
                  <td class="cv-evidence-cell">
                    <button v-if="item.archivo_diploma" type="button" class="cv-evidence-button" @click="previewFile(item.archivo_diploma)">Ver respaldo</button>
                    <span v-else class="cv-evidence-text">Sin respaldo</span>
                  </td>
                  <td class="cv-meta-label">Titulo provision nacional</td>
                  <td class="cv-evidence-cell">
                    <button v-if="item.archivo_titulo" type="button" class="cv-evidence-button" @click="previewFile(item.archivo_titulo)">Ver respaldo</button>
                    <span v-else class="cv-evidence-text">Sin respaldo</span>
                  </td>
                </tr>
              </table>
            </div>
          </template>
          <table v-else class="cv-record-table">
            <tr><td class="cv-value cv-empty-row">SIN REGISTROS DE PREGRADO</td></tr>
          </table>

          <div class="cv-sub-title">B. Estudios de postgrado</div>
          <template v-if="persona?.formacion_postgrado?.length">
            <div v-for="(item, index) in persona.formacion_postgrado" :key="`post-${item.id ?? index}`" class="cv-record-block">
              <table class="cv-record-table">
                <tr>
                  <td class="cv-record-title-cell">{{ Number(index) + 1 }}</td>
                  <td class="cv-record-main" colspan="5">{{ item.nombre_programa || '---' }}</td>
                </tr>
                <tr>
                  <td class="cv-meta-label">Tipo</td>
                  <td class="cv-meta-value">{{ item.tipo || '---' }}</td>
                  <td class="cv-meta-label">Institucion</td>
                  <td class="cv-meta-value" colspan="3">{{ item.institucion || '---' }}</td>
                </tr>
                <tr>
                  <td class="cv-meta-label">Departamento</td>
                  <td class="cv-meta-value">{{ getDepartmentName(item) }}</td>
                  <td class="cv-meta-label">Pais</td>
                  <td class="cv-meta-value">{{ getCountryName(item) }}</td>
                  <td class="cv-meta-label">Fecha certificacion</td>
                  <td class="cv-meta-value">{{ formatDate(item.fecha_certificacion || item.fecha_emision || item.fecha_diploma, '---') }}</td>
                </tr>
                <tr>
                  <td class="cv-meta-label">Respaldo de postgrado</td>
                  <td class="cv-evidence-cell" colspan="5">
                    <button v-if="item.archivo_respaldo" type="button" class="cv-evidence-button" @click="previewFile(item.archivo_respaldo)">Ver respaldo</button>
                    <span v-else class="cv-evidence-text">Sin respaldo</span>
                  </td>
                </tr>
              </table>
            </div>
          </template>
          <table v-else class="cv-record-table">
            <tr><td class="cv-value cv-empty-row">SIN REGISTROS DE POSTGRADO</td></tr>
          </table>

          <div class="cv-section-title">III. Trayectoria Academica y Profesional</div>
          <div class="cv-sub-title">A. Docencia universitaria</div>
          <template v-if="persona?.experiencia_docente?.length">
            <div v-for="(item, index) in persona.experiencia_docente" :key="`doc-${item.id ?? index}`" class="cv-record-block">
              <table class="cv-record-table">
                <tr>
                  <td class="cv-record-title-cell">{{ Number(index) + 1 }}</td>
                  <td class="cv-record-main" colspan="5">{{ item.institucion || '---' }}</td>
                </tr>
                <tr>
                  <td class="cv-meta-label">Carrera / facultad</td>
                  <td class="cv-meta-value" colspan="2">{{ item.carrera || '---' }}</td>
                  <td class="cv-meta-label">Gestion / periodo</td>
                  <td class="cv-meta-value" colspan="2">{{ item.gestion_periodo || formatDateRange(item.fecha_inicio, item.fecha_fin) }}</td>
                </tr>
                <tr>
                  <td class="cv-meta-label">Departamento</td>
                  <td class="cv-meta-value">{{ getDepartmentName(item) }}</td>
                  <td class="cv-meta-label">Pais</td>
                  <td class="cv-meta-value">{{ getCountryName(item) }}</td>
                  <td class="cv-meta-label">Respaldo</td>
                  <td class="cv-evidence-cell">
                    <button v-if="item.archivo_respaldo" type="button" class="cv-evidence-button" @click="previewFile(item.archivo_respaldo)">Ver respaldo</button>
                    <span v-else class="cv-evidence-text">Sin respaldo</span>
                  </td>
                </tr>
                <tr>
                  <td class="cv-meta-label">Asignaturas desarrolladas</td>
                  <td class="cv-note" colspan="5">{{ item.materia || item.asignaturas || '---' }}</td>
                </tr>
              </table>
            </div>
          </template>
          <table v-else class="cv-record-table">
            <tr><td class="cv-value cv-empty-row">SIN EXPERIENCIA DOCENTE REGISTRADA</td></tr>
          </table>
          <div class="cv-sub-title">B. Ejercicio profesional</div>
          <template v-if="persona?.experiencia_profesional?.length">
            <div v-for="(item, index) in persona.experiencia_profesional" :key="`prof-${item.id ?? index}`" class="cv-record-block">
              <table class="cv-record-table">
                <tr>
                  <td class="cv-record-title-cell">{{ Number(index) + 1 }}</td>
                  <td class="cv-record-main" colspan="5">{{ item.empresa || '---' }}</td>
                </tr>
                <tr>
                  <td class="cv-meta-label">Cargo desempenado</td>
                  <td class="cv-meta-value" colspan="2">{{ item.cargo || '---' }}</td>
                  <td class="cv-meta-label">Periodo</td>
                  <td class="cv-meta-value" colspan="2">{{ formatDate(item.fecha_inicio, '---') }} a {{ item.fecha_fin ? formatDate(item.fecha_fin, '---') : 'ACTUAL' }}</td>
                </tr>
                <tr>
                  <td class="cv-meta-label">Departamento</td>
                  <td class="cv-meta-value">{{ getDepartmentName(item) }}</td>
                  <td class="cv-meta-label">Pais</td>
                  <td class="cv-meta-value">{{ getCountryName(item) }}</td>
                  <td class="cv-meta-label">Respaldo</td>
                  <td class="cv-evidence-cell">
                    <button v-if="item.archivo_respaldo" type="button" class="cv-evidence-button" @click="previewFile(item.archivo_respaldo)">Ver respaldo</button>
                    <span v-else class="cv-evidence-text">Sin respaldo</span>
                  </td>
                </tr>
              </table>
            </div>
          </template>
          <table v-else class="cv-record-table">
            <tr><td class="cv-value cv-empty-row">SIN EXPERIENCIA PROFESIONAL REGISTRADA</td></tr>
          </table>

          <div class="cv-section-title">IV. Capacitaciones y Cursos Recientes</div>
          <template v-if="persona?.capacitaciones?.length">
            <div v-for="(item, index) in persona.capacitaciones" :key="`cap-${item.id ?? index}`" class="cv-record-block">
              <table class="cv-record-table">
                <tr>
                  <td class="cv-record-title-cell">{{ Number(index) + 1 }}</td>
                  <td class="cv-record-main" colspan="5">{{ item.nombre_curso || '---' }}</td>
                </tr>
                <tr>
                  <td class="cv-meta-label">Institucion</td>
                  <td class="cv-meta-value" colspan="2">{{ item.institucion || '---' }}</td>
                  <td class="cv-meta-label">Horas</td>
                  <td class="cv-meta-value">{{ item.horas_academicas || item.carga_horaria || 'N/R' }}</td>
                  <td class="cv-evidence-cell" rowspan="2">
                    <button v-if="item.archivo_respaldo" type="button" class="cv-evidence-button" @click="previewFile(item.archivo_respaldo)">Ver respaldo</button>
                    <span v-else class="cv-evidence-text">Sin respaldo</span>
                  </td>
                </tr>
                <tr>
                  <td class="cv-meta-label">Ubicacion</td>
                  <td class="cv-meta-value" colspan="2">{{ getDepartmentName(item) }} / {{ getCountryName(item) }}</td>
                  <td class="cv-meta-label">Fecha</td>
                  <td class="cv-meta-value">{{ formatDate(item.fecha_certificado || item.fecha, '---') }}</td>
                </tr>
              </table>
            </div>
          </template>
          <table v-else class="cv-record-table">
            <tr><td class="cv-value cv-empty-row">SIN CAPACITACIONES REGISTRADAS</td></tr>
          </table>

          <div class="cv-section-title">V. Produccion Intelectual</div>
          <template v-if="persona?.produccion_intelectual?.length">
            <div v-for="(item, index) in persona.produccion_intelectual" :key="`prod-${item.id ?? index}`" class="cv-record-block">
              <table class="cv-record-table">
                <tr>
                  <td class="cv-record-title-cell">{{ Number(index) + 1 }}</td>
                  <td class="cv-record-main" colspan="5">{{ item.titulo || '---' }}</td>
                </tr>
                <tr>
                  <td class="cv-meta-label">Tipo</td>
                  <td class="cv-meta-value">{{ item.tipo_produccion || item.tipo || '---' }}</td>
                  <td class="cv-meta-label">Editorial / medio</td>
                  <td class="cv-meta-value" colspan="3">{{ item.editorial || '---' }}</td>
                </tr>
                <tr>
                  <td class="cv-meta-label">Ubicacion</td>
                  <td class="cv-meta-value" colspan="2">{{ getDepartmentName(item) }} / {{ getCountryName(item) }}</td>
                  <td class="cv-meta-label">Fecha / ano</td>
                  <td class="cv-meta-value">{{ item.fecha ? formatDate(item.fecha, '---') : item.anio || '---' }}</td>
                  <td class="cv-evidence-cell">
                    <button v-if="item.archivo_respaldo" type="button" class="cv-evidence-button" @click="previewFile(item.archivo_respaldo)">Ver respaldo</button>
                    <span v-else class="cv-evidence-text">Sin respaldo</span>
                  </td>
                </tr>
              </table>
            </div>
          </template>
          <table v-else class="cv-record-table">
            <tr><td class="cv-value cv-empty-row">SIN PRODUCCION INTELECTUAL REGISTRADA</td></tr>
          </table>

          <div class="cv-section-title">VI. Reconocimientos y Distinciones</div>
          <template v-if="persona?.reconocimientos?.length">
            <div v-for="(item, index) in persona.reconocimientos" :key="`rec-${item.id ?? index}`" class="cv-record-block">
              <table class="cv-record-table">
                <tr>
                  <td class="cv-record-title-cell">{{ Number(index) + 1 }}</td>
                  <td class="cv-record-main" colspan="3">{{ item.titulo_premio || '---' }}</td>
                </tr>
                <tr>
                  <td class="cv-meta-label">Institucion otorgante</td>
                  <td class="cv-meta-value">{{ item.institucion_otorgante || '---' }}</td>
                  <td class="cv-meta-label">Fecha</td>
                  <td class="cv-meta-value">{{ formatDate(item.fecha, '---') }}</td>
                </tr>
                <tr>
                  <td class="cv-meta-label">Respaldo</td>
                  <td class="cv-evidence-cell" colspan="3">
                    <button v-if="item.archivo_respaldo" type="button" class="cv-evidence-button" @click="previewFile(item.archivo_respaldo)">Ver respaldo</button>
                    <span v-else class="cv-evidence-text">Sin respaldo</span>
                  </td>
                </tr>
              </table>
            </div>
          </template>
          <table v-else class="cv-record-table">
            <tr><td class="cv-value cv-empty-row">SIN RECONOCIMIENTOS REGISTRADOS</td></tr>
          </table>

          <div class="cv-section-title">VII. Conocimiento de Idiomas</div>
          <table class="cv-languages-table">
            <tr>
              <th>Idioma</th>
              <th>Lectura</th>
              <th>Escritura</th>
              <th>Habla</th>
            </tr>
            <template v-if="persona?.idiomas?.length">
              <tr v-for="item in persona.idiomas" :key="`idi-${item.id}`">
                <td class="cv-value">{{ item.idioma || '---' }}</td>
                <td class="cv-value">{{ item.nivel_lee || '---' }}</td>
                <td class="cv-value">{{ item.nivel_escritura || '---' }}</td>
                <td class="cv-value">{{ item.nivel_habla || '---' }}</td>
              </tr>
            </template>
            <tr v-else>
              <td class="cv-value cv-empty-row" colspan="4">SIN IDIOMAS REGISTRADOS</td>
            </tr>
          </table>

          <table class="cv-footer-table">
            <tr>
              <td class="cv-footer-cell">
                <div class="cv-signature-line"></div>
                <div class="cv-footer-label">Firma del interesado</div>
              </td>
              <td class="cv-footer-cell">
                <img :src="qrUrl" alt="Codigo QR" class="cv-footer-qr" />
                <div class="cv-footer-label">Verificacion digital</div>
              </td>
              <td class="cv-footer-cell">
                <div class="cv-footer-date">Fecha de emision: {{ generationDate }}</div>
              </td>
            </tr>
          </table>
          <div class="cv-footer-brand">SIGETH - UNITEPC</div>
        </div>
      </div>

      <div class="cv-preview-panel">
        <q-btn v-if="currentFileUrl" icon="close" flat round dense color="white" class="cv-preview-close" @click="clearPreview" />
        <div class="cv-preview-content">
          <iframe v-if="currentFileUrl && isPdfPreview" :src="pdfPreviewUrl" class="cv-preview-frame" />
          <div v-else-if="currentFileUrl" class="cv-preview-image-wrap">
            <img :src="currentFileUrl" alt="Documento adjunto" class="cv-preview-image" />
          </div>
          <div v-else class="cv-preview-empty">
            <q-icon name="o_folder_open" size="72px" />
            <div class="cv-preview-empty__title">Sin evidencia seleccionada</div>
            <div class="cv-preview-empty__text">Pulsa en "Ver respaldo" dentro de cualquier registro para visualizar el archivo aqui.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

interface Props {
  persona: any
  cargo?: string
  area?: string
  baseUrl: string
  isGeneratingPdf: boolean
  embedded?: boolean
}

const emit = defineEmits(['download'])
const props = defineProps<Props>()
const $q = useQuasar()
const persona = computed(() => props.persona ?? {})

const currentFilePath = ref<string | null>(null)
const currentFileUrl = ref<string | null>(null)
const currentFileMime = ref('')
const photoUrl = ref<string | null>(null)
const objectUrls = new Set<string>()

const fullName = computed(() => [props.persona?.primer_apellido, props.persona?.segundo_apellido, props.persona?.nombres].filter(Boolean).join(' '))
const displayCi = computed(() => {
  const ci = props.persona?.ci || '---'
  const expedido = props.persona?.ci_expedido?.sigla || props.persona?.ci_expedido?.codigo_expedido || props.persona?.expedido?.sigla || ''
  return expedido ? `${ci} ${expedido}` : ci
})
const sexoLabel = computed(() => {
  const raw = String(props.persona?.sexo?.sexo || props.persona?.sexo?.nombre || props.persona?.sexo || '').toUpperCase()
  if (raw.includes('MASCUL')) return 'MASCULINO'
  if (raw.includes('FEMEN')) return 'FEMENINO'
  return '---'
})
const nationalityLabel = computed(() => props.persona?.nacionalidad?.nombre || props.persona?.nacionalidad?.gentilicio || props.persona?.pais?.nombre || '---')
const countryLabel = computed(() => props.persona?.pais?.nombre || '---')
const originLabel = computed(() => {
  const origin = props.persona?.ci_expedido?.nombre || props.persona?.expedido?.nombre || props.persona?.ciudad?.departamento?.nombre || '---'
  const city = props.persona?.ciudad?.nombre || '---'
  return `${origin} / ${city}`
})
const generationDate = computed(() => formatDate(new Date().toISOString(), '---'))
const isPdfPreview = computed(() => currentFileMime.value.includes('pdf'))
const pdfPreviewUrl = computed(() => {
  if (!currentFileUrl.value) return ''
  return `${currentFileUrl.value}#view=FitH&zoom=page-width`
})
const qrUrl = computed(() => buildFakeQrDataUrl(`${window.location.origin}/#/personal/${props.persona?.id || ''}`))

function formatDate(value?: string | null, fallback = '---') {
  if (!value) return fallback
  const normalized = String(value).trim()
  if (!normalized) return fallback
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(normalized)) return normalized
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) return fallback
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

function formatDateRange(start?: string | null, end?: string | null) {
  const from = formatDate(start, '---')
  const to = end ? formatDate(end, '---') : 'ACTUAL'
  return `${from} a ${to}`
}

function getDepartmentName(item: any) {
  return item?.depto?.nombre || '---'
}

function getCountryName(item: any) {
  return (
    item?.depto?.pais?.nombre ||
    item?.pais?.nombre ||
    item?.pais_nombre ||
    item?.depto?.pais_nombre ||
    '---'
  )
}

function stripFilePath(raw?: string | null) {
  if (!raw) return ''
  let value = String(raw).trim().replace(/\\/g, '/')
  if (!value) return ''

  if (/^https?:\/\//i.test(value)) {
    try {
      value = new URL(value).pathname
    } catch {
      value = value.replace(/^https?:\/\/[^/]+\//i, '')
    }
  }

  value = value
    .replace(/^\/+api\/v1\/portal\/archivo\//i, '')
    .replace(/^\/+api\/portal\/archivo\//i, '')
    .replace(/^\/+storage\//i, '')
    .replace(/^storage\//i, '')
    .replace(/^\/+/, '')

  return value
}

function buildPortalPath(raw?: string | null) {
  const clean = stripFilePath(raw)
  if (!clean) return ''
  const base = String(props.baseUrl || window.location.origin).replace(/\/+$/, '')
  return `${base}/api/portal/archivo/${clean}`
}

function buildFakeQrDataUrl(text: string) {
  const safe = text.replace(/[<&>]/g, '')
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <rect width="96" height="96" fill="#ffffff"/>
      <rect x="6" y="6" width="24" height="24" fill="#4A148C"/>
      <rect x="12" y="12" width="12" height="12" fill="#ffffff"/>
      <rect x="66" y="6" width="24" height="24" fill="#4A148C"/>
      <rect x="72" y="12" width="12" height="12" fill="#ffffff"/>
      <rect x="6" y="66" width="24" height="24" fill="#4A148C"/>
      <rect x="12" y="72" width="12" height="12" fill="#ffffff"/>
      <rect x="40" y="14" width="8" height="8" fill="#4A148C"/>
      <rect x="52" y="14" width="8" height="8" fill="#4A148C"/>
      <rect x="40" y="26" width="8" height="8" fill="#4A148C"/>
      <rect x="52" y="26" width="8" height="8" fill="#4A148C"/>
      <rect x="38" y="40" width="10" height="10" fill="#4A148C"/>
      <rect x="52" y="40" width="18" height="10" fill="#4A148C"/>
      <rect x="38" y="54" width="10" height="10" fill="#4A148C"/>
      <rect x="52" y="54" width="10" height="10" fill="#4A148C"/>
      <rect x="66" y="54" width="10" height="10" fill="#4A148C"/>
      <text x="48" y="92" text-anchor="middle" font-size="7" fill="#4A148C" font-family="Arial">SIGETH</text>
      <title>${safe}</title>
    </svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function revokeObjectUrl(url?: string | null) {
  if (!url) return
  if (objectUrls.has(url)) {
    URL.revokeObjectURL(url)
    objectUrls.delete(url)
  }
}

async function fetchBlobUrl(rawPath?: string | null) {
  const url = buildPortalPath(rawPath)
  if (!url) return { url: null, mime: '' }
  const response = await api.get(url, { responseType: 'blob' })
  const blobUrl = URL.createObjectURL(response.data)
  objectUrls.add(blobUrl)
  return { url: blobUrl, mime: response.data.type || guessMimeType(rawPath) }
}

function guessMimeType(path?: string | null) {
  const value = String(path || '').toLowerCase()
  if (value.endsWith('.pdf')) return 'application/pdf'
  if (value.endsWith('.png')) return 'image/png'
  if (value.endsWith('.jpg') || value.endsWith('.jpeg')) return 'image/jpeg'
  if (value.endsWith('.webp')) return 'image/webp'
  return 'application/octet-stream'
}

async function loadPhoto() {
  revokeObjectUrl(photoUrl.value)
  photoUrl.value = null
  if (!props.persona?.foto) return
  try {
    const resource = await fetchBlobUrl(props.persona.foto)
    photoUrl.value = resource.url
  } catch {
    photoUrl.value = null
  }
}

async function previewFile(rawPath?: string | null) {
  if (!rawPath) return
  try {
    revokeObjectUrl(currentFileUrl.value)
    currentFilePath.value = rawPath
    currentFileUrl.value = null
    currentFileMime.value = ''
    const resource = await fetchBlobUrl(rawPath)
    currentFileUrl.value = resource.url
    currentFileMime.value = resource.mime
  } catch (error: any) {
    currentFilePath.value = null
    currentFileUrl.value = null
    currentFileMime.value = ''
    $q.notify({
      type: 'negative',
      message: 'No se pudo visualizar el archivo adjunto.',
      caption: error?.response?.data?.message || error?.message || undefined,
    })
  }
}

function clearPreview() {
  revokeObjectUrl(currentFileUrl.value)
  currentFilePath.value = null
  currentFileUrl.value = null
  currentFileMime.value = ''
}

watch(() => props.persona?.foto, () => {
  void loadPhoto()
}, { immediate: true })

watch(() => props.persona?.id, () => {
  clearPreview()
})

onBeforeUnmount(() => {
  revokeObjectUrl(photoUrl.value)
  revokeObjectUrl(currentFileUrl.value)
})
</script>

<style scoped>
.cv-shell {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  min-height: 0;
}

.cv-toolbar {
  padding: 0 12px;
}

.cv-download-btn {
  border-radius: 999px;
  box-shadow: 0 6px 16px rgba(74, 20, 140, 0.28);
}

.cv-body {
  display: flex;
  flex: 1;
  gap: 18px;
  align-items: stretch;
  min-height: 0;
  overflow: hidden;
}

.cv-sheet-panel {
  flex: 0 0 52%;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  padding-right: 6px;
}

.cv-sheet {
  background: #ffffff;
  border-radius: 16px;
  padding: 28px 28px 34px;
  font-family: 'Times New Roman', Times, serif;
  color: #1a1a1a;
}

.cv-header-table,
.cv-data-table,
.cv-record-table,
.cv-languages-table,
.cv-footer-table {
  width: 100%;
  border-collapse: collapse;
}

.cv-header-table {
  margin-bottom: 14px;
}

.cv-header-title {
  text-align: center;
  color: #4a148c;
  padding-bottom: 12px;
}

.cv-line-1 {
  font-size: 22px;
  font-weight: 700;
  text-decoration: underline;
}

.cv-line-2 {
  margin-top: 6px;
  font-size: 18px;
  font-weight: 700;
}

.cv-line-3 {
  margin-top: 10px;
  font-size: 20px;
  font-weight: 700;
  text-decoration: underline;
}

.cv-logo-cell {
  width: 22%;
  vertical-align: middle;
}

.cv-logo {
  width: 112px;
  display: block;
}

.cv-header-spacer {
  width: 56%;
}

.cv-photo-cell {
  width: 22%;
  vertical-align: top;
}

.cv-photo-caption {
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
  color: #4a148c;
}

.cv-photo-box {
  width: 112px;
  height: 140px;
  border: 2px solid #4a148c;
  margin-left: auto;
  background: #f5f4f9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cv-photo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.cv-photo-placeholder {
  text-align: center;
  font-size: 11px;
  font-style: italic;
  color: #777;
  line-height: 1.35;
}

.cv-section-title {
  margin: 16px 0 8px;
  padding: 6px 10px;
  border: 1px solid #4a148c;
  background: #f3eff8;
  color: #4a148c;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
}

.cv-sub-title {
  margin: 10px 0 8px;
  color: #4a148c;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: underline;
}

.cv-data-table,
.cv-record-table,
.cv-languages-table {
  border: 1.5px solid #4a148c;
  margin-bottom: 12px;
}

.cv-data-table td,
.cv-record-table td,
.cv-languages-table td,
.cv-languages-table th {
  border: 1px solid #4a148c;
  padding: 8px 9px;
  vertical-align: top;
}

.cv-label,
.cv-meta-label,
.cv-languages-table th {
  background: #fbf9fe;
  color: #4a148c;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.cv-label {
  width: 19%;
}

.cv-value,
.cv-meta-value {
  background: #fff;
  color: #000;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
}

.cv-value--normal,
.cv-note {
  text-transform: none;
}

.cv-record-block {
  margin-bottom: 12px;
}

.cv-record-title-cell {
  width: 12%;
  background: #f6f1fb;
  color: #4a148c;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

.cv-record-main {
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
}

.cv-meta-label {
  width: 16%;
  text-align: center;
}

.cv-meta-value {
  text-align: center;
}

.cv-note {
  background: #fff;
  font-size: 13px;
  font-style: italic;
  line-height: 1.4;
}

.cv-evidence-cell {
  text-align: center;
  vertical-align: middle;
  background: #fff;
}

.cv-evidence-button {
  border: 1px solid #4a148c;
  background: #f3eff8;
  color: #4a148c;
  font-weight: 700;
  font-size: 12px;
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
}

.cv-evidence-button:hover {
  background: #ebe2f7;
}

.cv-evidence-text {
  color: #777;
  font-size: 12px;
  font-style: italic;
}

.cv-empty-row {
  text-align: center;
}

.cv-footer-table {
  margin-top: 22px;
}

.cv-footer-cell {
  width: 33.33%;
  text-align: center;
  vertical-align: bottom;
  padding: 0 8px;
}

.cv-signature-line {
  width: 180px;
  margin: 0 auto 6px;
  border-top: 1px solid #4a148c;
}

.cv-footer-label {
  color: #4a148c;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.cv-footer-qr {
  width: 92px;
  height: 92px;
  display: block;
  margin: 0 auto 6px;
}

.cv-footer-date {
  margin-top: 46px;
  color: #4a148c;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.cv-footer-brand {
  margin-top: 18px;
  text-align: center;
  font-size: 10px;
  color: #8c8c8c;
  font-style: italic;
  text-transform: uppercase;
}

.cv-preview-panel {
  position: sticky;
  top: 0;
  align-self: flex-start;
  flex: 0 0 48%;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  min-height: 720px;
  background: #121a31;
  border-radius: 16px;
  overflow: hidden;
}

.cv-preview-close {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}

.cv-preview-content {
  flex: 1;
  min-height: 0;
}

.cv-preview-frame,
.cv-preview-image-wrap,
.cv-preview-image {
  width: 100%;
  height: 100%;
}

.cv-preview-frame {
  display: block;
  border: 0;
  background: #fff;
}

.cv-preview-image-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.cv-preview-image {
  object-fit: contain;
}

.cv-preview-empty {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px;
  color: #ffffff;
  text-align: center;
}

.cv-preview-empty__title {
  font-size: 18px;
  font-weight: 700;
}

.cv-preview-empty__text {
  max-width: 340px;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.78);
}

.cv-shell--embedded .cv-toolbar {
  padding-inline: 0;
}

.cv-shell--embedded .cv-body {
  height: 100%;
}

@media (max-width: 1080px) {
  .cv-body {
    flex-direction: column;
    overflow: visible;
  }

  .cv-sheet-panel,
  .cv-preview-panel {
    flex-basis: auto;
    width: 100%;
  }

  .cv-sheet-panel {
    overflow: visible;
    padding-right: 0;
  }

  .cv-preview-panel {
    position: static;
    height: auto;
    min-height: 520px;
  }

  .cv-preview-content,
  .cv-preview-empty {
    min-height: 520px;
  }
}
</style>
