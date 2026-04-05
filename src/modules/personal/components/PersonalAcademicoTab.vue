<template>
  <div class="academico-tab">
    <div v-if="loading" class="loading-state">
      <q-spinner-dots color="primary" size="38px" />
      <div class="text-grey-7 q-mt-sm">Cargando perfil academico...</div>
    </div>

    <div v-else-if="!profile" class="empty-state">
      <q-icon name="school" size="56px" color="grey-5" />
      <div class="empty-title">Sin perfil academico disponible</div>
      <div class="empty-subtitle">Todavia no se encontro informacion academica para esta persona.</div>
    </div>

    <div v-else class="content-grid">
      <section
        v-for="section in sections"
        :key="section.key"
        class="academico-card"
      >
        <div class="academico-card__header">
          <div class="academico-card__icon">
            <q-icon :name="section.icon" color="primary" size="20px" />
          </div>
          <div>
            <div class="academico-card__title">{{ section.title }}</div>
            <div class="academico-card__subtitle">{{ section.items.length }} registro(s)</div>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <div v-if="section.items.length" class="academico-list">
          <div
            v-for="(item, index) in section.items"
            :key="`${section.key}-${index}`"
            class="academico-item"
          >
            <div class="academico-item__title">{{ section.getTitle(item) }}</div>
            <div v-if="section.getSubtitle(item)" class="academico-item__subtitle">
              {{ section.getSubtitle(item) }}
            </div>
            <div v-if="section.getMeta(item)" class="academico-item__meta">
              {{ section.getMeta(item) }}
            </div>
          </div>
        </div>

        <div v-else class="academico-empty">
          No hay registros en esta seccion.
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  profile: any | null
  loading: boolean
}>()

const formatDate = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-BO')
}

const sections = computed(() => {
  const data = props.profile || {}

  return [
    {
      key: 'pregrado',
      title: 'Formacion Pregrado',
      icon: 'workspace_premium',
      items: data.formacion_pregrado || [],
      getTitle: (item: any) => item.carrera || item.nivel || 'Registro de pregrado',
      getSubtitle: (item: any) => [item.institucion, item.nivel].filter(Boolean).join(' · '),
      getMeta: (item: any) => [formatDate(item.fecha_diploma), formatDate(item.fecha_titulo)].filter(Boolean).join(' / ')
    },
    {
      key: 'postgrado',
      title: 'Formacion Postgrado',
      icon: 'school',
      items: data.formacion_postgrado || [],
      getTitle: (item: any) => item.nombre_programa || item.tipo || 'Registro de postgrado',
      getSubtitle: (item: any) => [item.institucion, item.tipo].filter(Boolean).join(' · '),
      getMeta: (item: any) => [formatDate(item.fecha_diploma), formatDate(item.fecha_certificacion)].filter(Boolean).join(' / ')
    },
    {
      key: 'exp_docente',
      title: 'Experiencia Docente',
      icon: 'co_present',
      items: data.experiencia_docente || [],
      getTitle: (item: any) => item.institucion || 'Experiencia docente',
      getSubtitle: (item: any) => [item.carrera, item.asignaturas].filter(Boolean).join(' · '),
      getMeta: (item: any) => item.gestion_periodo || ''
    },
    {
      key: 'exp_profesional',
      title: 'Experiencia Profesional',
      icon: 'business_center',
      items: data.experiencia_profesional || [],
      getTitle: (item: any) => item.cargo || 'Experiencia profesional',
      getSubtitle: (item: any) => item.empresa || '',
      getMeta: (item: any) => [formatDate(item.fecha_inicio), formatDate(item.fecha_fin)].filter(Boolean).join(' - ')
    },
    {
      key: 'capacitaciones',
      title: 'Capacitaciones',
      icon: 'menu_book',
      items: data.capacitaciones || [],
      getTitle: (item: any) => item.nombre_curso || 'Capacitacion',
      getSubtitle: (item: any) => item.institucion || '',
      getMeta: (item: any) => [formatDate(item.fecha), item.carga_horaria ? `${item.carga_horaria} hrs` : ''].filter(Boolean).join(' · ')
    },
    {
      key: 'produccion',
      title: 'Produccion Intelectual',
      icon: 'auto_stories',
      items: data.produccion_intelectual || [],
      getTitle: (item: any) => item.titulo || 'Produccion intelectual',
      getSubtitle: (item: any) => [item.tipo, item.editorial].filter(Boolean).join(' · '),
      getMeta: (item: any) => formatDate(item.fecha)
    },
    {
      key: 'reconocimientos',
      title: 'Reconocimientos',
      icon: 'military_tech',
      items: data.reconocimientos || [],
      getTitle: (item: any) => item.titulo_premio || 'Reconocimiento',
      getSubtitle: (item: any) => item.institucion_otorgante || '',
      getMeta: (item: any) => [formatDate(item.fecha), item.lugar].filter(Boolean).join(' · ')
    },
    {
      key: 'idiomas',
      title: 'Idiomas',
      icon: 'translate',
      items: data.idiomas || [],
      getTitle: (item: any) => item.idioma || 'Idioma',
      getSubtitle: (item: any) => `Habla: ${item.nivel_habla || '-'} · Escribe: ${item.nivel_escritura || '-'} · Lee: ${item.nivel_lee || '-'}`,
      getMeta: () => ''
    }
  ]
})
</script>

<style scoped lang="scss">
.academico-tab {
  padding: 12px 0;
}

.loading-state,
.empty-state {
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: #334155;
  margin-top: 14px;
}

.empty-subtitle {
  font-size: 13px;
  color: #64748b;
  margin-top: 6px;
  max-width: 420px;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 18px;
}

.academico-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.academico-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.academico-card__icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.academico-card__title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.academico-card__subtitle {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.academico-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.academico-item {
  padding: 12px 14px;
  border-radius: 12px;
  background: #f8fafc;
}

.academico-item__title {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.academico-item__subtitle {
  font-size: 12px;
  color: #475569;
  margin-top: 4px;
}

.academico-item__meta {
  font-size: 12px;
  color: #7c3aed;
  margin-top: 5px;
  font-weight: 600;
}

.academico-empty {
  color: #94a3b8;
  font-size: 13px;
  padding: 10px 0 4px;
}
</style>
