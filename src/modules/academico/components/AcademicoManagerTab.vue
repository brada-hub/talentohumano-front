<template>
  <div class="academico-tab">
    <div v-if="loading" class="loading-state">
      <q-spinner-dots color="primary" size="38px" />
      <div class="text-grey-7 q-mt-sm">Cargando perfil acadÃ©mico...</div>
    </div>

    <div v-else-if="!profile" class="empty-state">
      <q-icon name="school" size="56px" color="grey-5" />
      <div class="empty-title">Sin perfil acadÃ©mico disponible</div>
      <div class="empty-subtitle">TodavÃ­a no se encontrÃ³ informaciÃ³n acadÃ©mica para esta persona.</div>
    </div>

    <div v-else>
      <div class="formation-grid">
        <section class="academico-card">
          <div class="academico-card__header academico-card__header--action">
            <div class="academico-card__icon">
              <q-icon name="workspace_premium" color="primary" size="20px" />
            </div>
            <div>
              <div class="academico-card__title">FormaciÃ³n Pregrado</div>
              <div class="academico-card__subtitle">{{ pregradoList.length }} registro(s)</div>
            </div>
            <q-space />
            <q-btn
              v-if="editable"
              unelevated
              color="primary"
              icon="add"
              label="Nuevo"
              no-caps
              rounded
              @click="openPregradoDialog()"
            />
          </div>

          <q-separator class="q-my-md" />

          <div v-if="pregradoList.length" class="academico-list">
            <div v-for="item in pregradoList" :key="`pre-${item.id}`" class="academico-item academico-item--action">
              <div>
                <div class="academico-item__title">{{ item.carrera || 'Registro de pregrado' }}</div>
                <div class="academico-item__subtitle">{{ [item.institucion, item.nivel].filter(Boolean).join(' Â· ') }}</div>
                <div class="academico-item__meta">
                  {{ [departmentName(item.id_depto), formatDate(item.fecha_diploma), formatDate(item.fecha_titulo)].filter(Boolean).join(' / ') }}
                </div>
              </div>
              <div v-if="editable" class="row q-gutter-xs">
                <q-btn flat round dense color="grey-7" icon="edit" @click="openPregradoDialog(item)" />
                <q-btn flat round dense color="negative" icon="delete" @click="confirmDelete('pregrado', item)" />
              </div>
            </div>
          </div>

          <div v-else class="academico-empty">
            No hay registros de pregrado.
          </div>
        </section>

        <section class="academico-card">
          <div class="academico-card__header academico-card__header--action">
            <div class="academico-card__icon">
              <q-icon name="school" color="primary" size="20px" />
            </div>
            <div>
              <div class="academico-card__title">FormaciÃ³n Postgrado</div>
              <div class="academico-card__subtitle">{{ postgradoList.length }} registro(s)</div>
            </div>
            <q-space />
            <q-btn
              v-if="editable"
              unelevated
              color="teal"
              icon="add"
              label="Nuevo"
              no-caps
              rounded
              @click="openPostgradoDialog()"
            />
          </div>

          <q-separator class="q-my-md" />

          <div v-if="postgradoList.length" class="academico-list">
            <div v-for="item in postgradoList" :key="`post-${item.id}`" class="academico-item academico-item--action">
              <div>
                <div class="academico-item__title">{{ item.nombre_programa || 'Registro de postgrado' }}</div>
                <div class="academico-item__subtitle">{{ [item.institucion, item.tipo].filter(Boolean).join(' Â· ') }}</div>
                <div class="academico-item__meta">
                  {{ [departmentName(item.id_depto), formatDate(item.fecha_diploma), formatDate(item.fecha_certificacion)].filter(Boolean).join(' / ') }}
                </div>
              </div>
              <div v-if="editable" class="row q-gutter-xs">
                <q-btn flat round dense color="grey-7" icon="edit" @click="openPostgradoDialog(item)" />
                <q-btn flat round dense color="negative" icon="delete" @click="confirmDelete('postgrado', item)" />
              </div>
            </div>
          </div>

          <div v-else class="academico-empty">
            No hay registros de postgrado.
          </div>
        </section>
      </div>

      <div class="formation-grid q-mt-lg">
        <section class="academico-card">
          <div class="academico-card__header academico-card__header--action">
            <div class="academico-card__icon">
              <q-icon name="co_present" color="primary" size="20px" />
            </div>
            <div>
              <div class="academico-card__title">Experiencia Docente</div>
              <div class="academico-card__subtitle">{{ docenteList.length }} registro(s)</div>
            </div>
            <q-space />
            <q-btn
              v-if="editable"
              unelevated
              color="blue"
              icon="add"
              label="Nuevo"
              no-caps
              rounded
              @click="openDocenteDialog()"
            />
          </div>

          <q-separator class="q-my-md" />

          <div v-if="docenteList.length" class="academico-list">
            <div v-for="item in docenteList" :key="`doc-${item.id}`" class="academico-item academico-item--action">
              <div>
                <div class="academico-item__title">{{ item.institucion || 'Experiencia docente' }}</div>
                <div class="academico-item__subtitle">{{ [item.carrera, item.asignaturas].filter(Boolean).join(' Â· ') }}</div>
                <div class="academico-item__meta">
                  {{ [departmentName(item.id_depto), item.gestion_periodo].filter(Boolean).join(' / ') }}
                </div>
              </div>
              <div v-if="editable" class="row q-gutter-xs">
                <q-btn flat round dense color="grey-7" icon="edit" @click="openDocenteDialog(item)" />
                <q-btn flat round dense color="negative" icon="delete" @click="confirmDeleteExperience('docente', item)" />
              </div>
            </div>
          </div>

          <div v-else class="academico-empty">
            No hay registros de experiencia docente.
          </div>
        </section>

        <section class="academico-card">
          <div class="academico-card__header academico-card__header--action">
            <div class="academico-card__icon">
              <q-icon name="business_center" color="primary" size="20px" />
            </div>
            <div>
              <div class="academico-card__title">Experiencia Profesional</div>
              <div class="academico-card__subtitle">{{ profesionalList.length }} registro(s)</div>
            </div>
            <q-space />
            <q-btn
              v-if="editable"
              unelevated
              color="deep-orange"
              icon="add"
              label="Nuevo"
              no-caps
              rounded
              @click="openProfesionalDialog()"
            />
          </div>

          <q-separator class="q-my-md" />

          <div v-if="profesionalList.length" class="academico-list">
            <div v-for="item in profesionalList" :key="`pro-${item.id}`" class="academico-item academico-item--action">
              <div>
                <div class="academico-item__title">{{ item.cargo || 'Experiencia profesional' }}</div>
                <div class="academico-item__subtitle">{{ item.empresa || '' }}</div>
                <div class="academico-item__meta">
                  {{ [departmentName(item.id_depto), formatDate(item.fecha_inicio), formatDate(item.fecha_fin)].filter(Boolean).join(' / ') }}
                </div>
              </div>
              <div v-if="editable" class="row q-gutter-xs">
                <q-btn flat round dense color="grey-7" icon="edit" @click="openProfesionalDialog(item)" />
                <q-btn flat round dense color="negative" icon="delete" @click="confirmDeleteExperience('profesional', item)" />
              </div>
            </div>
          </div>

          <div v-else class="academico-empty">
            No hay registros de experiencia profesional.
          </div>
        </section>
      </div>

      <div class="formation-grid q-mt-lg">
        <section class="academico-card">
          <div class="academico-card__header academico-card__header--action">
            <div class="academico-card__icon"><q-icon name="menu_book" color="primary" size="20px" /></div>
            <div>
              <div class="academico-card__title">Capacitaciones</div>
              <div class="academico-card__subtitle">{{ capacitacionList.length }} registro(s)</div>
            </div>
            <q-space />
            <q-btn v-if="editable" unelevated color="positive" icon="add" label="Nuevo" no-caps rounded @click="openCapacitacionDialog()" />
          </div>
          <q-separator class="q-my-md" />
          <div v-if="capacitacionList.length" class="academico-list">
            <div v-for="item in capacitacionList" :key="`cap-${item.id}`" class="academico-item academico-item--action">
              <div>
                <div class="academico-item__title">{{ item.nombre_curso }}</div>
                <div class="academico-item__subtitle">{{ item.institucion }}</div>
                <div class="academico-item__meta">{{ [departmentName(item.id_depto), formatDate(item.fecha), item.carga_horaria ? `${item.carga_horaria} hrs` : ''].filter(Boolean).join(' / ') }}</div>
              </div>
              <div v-if="editable" class="row q-gutter-xs">
                <q-btn flat round dense color="grey-7" icon="edit" @click="openCapacitacionDialog(item)" />
                <q-btn flat round dense color="negative" icon="delete" @click="confirmDeleteOther('capacitaciones', item)" />
              </div>
            </div>
          </div>
          <div v-else class="academico-empty">No hay capacitaciones registradas.</div>
        </section>

        <section class="academico-card">
          <div class="academico-card__header academico-card__header--action">
            <div class="academico-card__icon"><q-icon name="translate" color="primary" size="20px" /></div>
            <div>
              <div class="academico-card__title">Idiomas</div>
              <div class="academico-card__subtitle">{{ idiomaList.length }} registro(s)</div>
            </div>
            <q-space />
            <q-btn v-if="editable" unelevated color="cyan-7" icon="add" label="Nuevo" no-caps rounded @click="openIdiomaDialog()" />
          </div>
          <q-separator class="q-my-md" />
          <div v-if="idiomaList.length" class="academico-list">
            <div v-for="item in idiomaList" :key="`idi-${item.id}`" class="academico-item academico-item--action">
              <div>
                <div class="academico-item__title">{{ item.idioma }}</div>
                <div class="academico-item__subtitle">Habla: {{ item.nivel_habla }} Â· Escribe: {{ item.nivel_escritura }} Â· Lee: {{ item.nivel_lee }}</div>
              </div>
              <div v-if="editable" class="row q-gutter-xs">
                <q-btn flat round dense color="grey-7" icon="edit" @click="openIdiomaDialog(item)" />
                <q-btn flat round dense color="negative" icon="delete" @click="confirmDeleteOther('idiomas', item)" />
              </div>
            </div>
          </div>
          <div v-else class="academico-empty">No hay idiomas registrados.</div>
        </section>
      </div>

      <div class="formation-grid q-mt-lg">
        <section class="academico-card">
          <div class="academico-card__header academico-card__header--action">
            <div class="academico-card__icon"><q-icon name="auto_stories" color="primary" size="20px" /></div>
            <div>
              <div class="academico-card__title">ProducciÃ³n Intelectual</div>
              <div class="academico-card__subtitle">{{ produccionList.length }} registro(s)</div>
            </div>
            <q-space />
            <q-btn v-if="editable" unelevated color="purple-7" icon="add" label="Nuevo" no-caps rounded @click="openProduccionDialog()" />
          </div>
          <q-separator class="q-my-md" />
          <div v-if="produccionList.length" class="academico-list">
            <div v-for="item in produccionList" :key="`prod-${item.id}`" class="academico-item academico-item--action">
              <div>
                <div class="academico-item__title">{{ item.titulo }}</div>
                <div class="academico-item__subtitle">{{ [item.tipo, item.editorial].filter(Boolean).join(' Â· ') }}</div>
                <div class="academico-item__meta">{{ [departmentName(item.id_depto), formatDate(item.fecha)].filter(Boolean).join(' / ') }}</div>
              </div>
              <div v-if="editable" class="row q-gutter-xs">
                <q-btn flat round dense color="grey-7" icon="edit" @click="openProduccionDialog(item)" />
                <q-btn flat round dense color="negative" icon="delete" @click="confirmDeleteOther('produccion-intelectual', item)" />
              </div>
            </div>
          </div>
          <div v-else class="academico-empty">No hay producciÃ³n intelectual registrada.</div>
        </section>

        <section class="academico-card">
          <div class="academico-card__header academico-card__header--action">
            <div class="academico-card__icon"><q-icon name="military_tech" color="primary" size="20px" /></div>
            <div>
              <div class="academico-card__title">Reconocimientos</div>
              <div class="academico-card__subtitle">{{ reconocimientoList.length }} registro(s)</div>
            </div>
            <q-space />
            <q-btn v-if="editable" unelevated color="amber-8" icon="add" label="Nuevo" no-caps rounded @click="openReconocimientoDialog()" />
          </div>
          <q-separator class="q-my-md" />
          <div v-if="reconocimientoList.length" class="academico-list">
            <div v-for="item in reconocimientoList" :key="`rec-${item.id}`" class="academico-item academico-item--action">
              <div>
                <div class="academico-item__title">{{ item.titulo_premio }}</div>
                <div class="academico-item__subtitle">{{ item.institucion_otorgante }}</div>
                <div class="academico-item__meta">{{ [formatDate(item.fecha), item.lugar].filter(Boolean).join(' / ') }}</div>
              </div>
              <div v-if="editable" class="row q-gutter-xs">
                <q-btn flat round dense color="grey-7" icon="edit" @click="openReconocimientoDialog(item)" />
                <q-btn flat round dense color="negative" icon="delete" @click="confirmDeleteOther('reconocimientos', item)" />
              </div>
            </div>
          </div>
          <div v-else class="academico-empty">No hay reconocimientos registrados.</div>
        </section>
      </div>

      <div class="content-grid q-mt-lg">
        <section v-for="section in sections" :key="section.key" class="academico-card">
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
            <div v-for="(item, index) in section.items" :key="`${section.key}-${index}`" class="academico-item">
              <div class="academico-item__title">{{ section.getTitle(item) }}</div>
              <div v-if="section.getSubtitle(item)" class="academico-item__subtitle">{{ section.getSubtitle(item) }}</div>
              <div v-if="section.getMeta(item)" class="academico-item__meta">{{ section.getMeta(item) }}</div>
            </div>
          </div>

          <div v-else class="academico-empty">No hay registros en esta secciÃ³n.</div>
        </section>
      </div>
    </div>

    <q-dialog v-model="pregradoDialog">
      <q-card class="academico-dialog rounded-24 overflow-hidden">
        <q-card-section class="academico-dialog__header row items-center q-py-md">
          <div class="text-h6">{{ pregradoForm.id ? 'Editar pregrado' : 'Nuevo pregrado' }}</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-select v-model="pregradoForm.nivel" :options="pregradoLevels" label="Nivel acadÃ©mico" outlined dense />
          </div>
          <div class="col-12 col-md-8">
            <q-select v-model="pregradoForm.id_pais" :options="countryOptions" emit-value map-options label="PaÃ­s de titulaciÃ³n" outlined dense @update:model-value="onDialogCountryChange($event, pregradoForm)" />
          </div>
          <div class="col-12 col-md-8">
            <q-input v-model="pregradoForm.institucion" label="InstituciÃ³n / Universidad" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-select v-model="pregradoForm.id_depto" :options="dialogDepartmentOptions" emit-value map-options label="Departamento / Estado" outlined dense />
          </div>
          <div class="col-12">
            <q-input v-model="pregradoForm.titulo" label="Nombre del tÃ­tulo en provisiÃ³n nacional" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="pregradoForm.fecha_emision_diploma" type="date" stack-label label="Fecha de emisiÃ³n del diploma" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="pregradoForm.fecha_emision" type="date" stack-label label="Fecha de emisiÃ³n del tÃ­tulo" outlined dense />
          </div>
          <div class="col-12">
            <q-file v-model="pregradoForm.archivo_diploma" :display-value="pregradoForm.archivo_diploma ? pregradoForm.archivo_diploma.name : getExistingFileLabel(pregradoForm.archivo_diploma_actual)" label="Subir diploma acadÃ©mico" outlined dense accept=".pdf,.jpg,.jpeg,.png" />
          </div>
          <div class="col-12">
            <q-file v-model="pregradoForm.archivo_titulo" :display-value="pregradoForm.archivo_titulo ? pregradoForm.archivo_titulo.name : getExistingFileLabel(pregradoForm.archivo_titulo_actual)" label="Subir tÃ­tulo en provisiÃ³n nacional" outlined dense accept=".pdf,.jpg,.jpeg,.png" />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="academico-dialog__actions q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated color="primary" :loading="saving" label="Guardar en legajo" rounded no-caps class="q-px-lg" @click="savePregrado" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="postgradoDialog">
      <q-card class="academico-dialog rounded-24 overflow-hidden">
        <q-card-section class="academico-dialog__header row items-center q-py-md">
          <div class="text-h6">{{ postgradoForm.id ? 'Editar postgrado' : 'Nuevo postgrado' }}</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-select v-model="postgradoForm.tipo" :options="postgradoLevels" label="Tipo de postgrado" outlined dense />
          </div>
          <div class="col-12 col-md-8">
            <q-select v-model="postgradoForm.id_pais" :options="countryOptions" emit-value map-options label="PaÃ­s" outlined dense @update:model-value="onDialogCountryChange($event, postgradoForm)" />
          </div>
          <div class="col-12">
            <q-input v-model="postgradoForm.titulo" label="Nombre del postgrado / tesis" outlined dense />
          </div>
          <div class="col-12">
            <q-input v-model="postgradoForm.institucion" label="InstituciÃ³n / Universidad" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-select v-model="postgradoForm.id_depto" :options="dialogDepartmentOptions" emit-value map-options label="Departamento / Estado" outlined dense />
          </div>
          <div class="col-12 col-md-8">
            <q-input v-model="postgradoForm.fecha_emision" type="date" stack-label label="Fecha de emisiÃ³n" outlined dense />
          </div>
          <div class="col-12">
            <q-file v-model="postgradoForm.archivo_respaldo" :display-value="postgradoForm.archivo_respaldo ? postgradoForm.archivo_respaldo.name : getExistingFileLabel(postgradoForm.archivo_respaldo_actual)" label="Subir tÃ­tulo escaneado" outlined dense accept=".pdf,.jpg,.jpeg,.png" />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="academico-dialog__actions q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated color="teal" :loading="saving" label="Guardar en legajo" rounded no-caps class="q-px-lg" @click="savePostgrado" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="docenteDialog">
      <q-card class="academico-dialog rounded-24 overflow-hidden">
        <q-card-section class="academico-dialog__header row items-center q-py-md">
          <div class="text-h6">{{ docenteForm.id ? 'Editar experiencia docente' : 'Nueva experiencia docente' }}</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12">
            <q-input v-model="docenteForm.institucion" label="InstituciÃ³n / Universidad" outlined dense />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="docenteForm.carrera" label="Carrera o Facultad" outlined dense />
          </div>
          <div class="col-12 col-md-6">
            <q-select v-model="docenteForm.id_pais" :options="countryOptions" emit-value map-options label="PaÃ­s" outlined dense @update:model-value="onDialogCountryChange($event, docenteForm)" />
          </div>
          <div class="col-12 col-md-6">
            <q-select v-model="docenteForm.id_depto" :options="dialogDepartmentOptions" emit-value map-options label="Departamento / Estado" outlined dense />
          </div>
          <div class="col-12"><div class="text-subtitle2 text-grey-6 q-mb-xs">Gestiones / perÃ­odos dictados</div></div>
          <div class="col-12 col-md-6">
            <q-select v-model="quickGestion.semestre" :options="semestreOptions" label="Periodo" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="quickGestion.anio" label="AÃ±o" outlined dense mask="####" />
          </div>
          <div class="col-12 col-md-2">
            <q-btn unelevated color="blue" label="AÃ±adir" class="full-width" @click="addGestionToDocenteList" />
          </div>
          <div class="col-12">
            <div class="bg-grey-1 q-pa-sm" style="border-radius: 12px">
              <q-chip v-for="(gestion, index) in docenteForm.gestion_list" :key="`${gestion}-${index}`" removable color="blue-1" text-color="blue-9" @remove="docenteForm.gestion_list.splice(index, 1)">
                {{ gestion }}
              </q-chip>
              <div v-if="!docenteForm.gestion_list.length" class="text-caption text-grey-5">Sin periodos aÃ±adidos.</div>
            </div>
          </div>
          <div class="col-12">
            <q-select v-model="docenteForm.asignaturas_list" use-input use-chips multiple new-value-mode="add-unique" label="Asignaturas dictadas" outlined dense />
          </div>
          <div class="col-12">
            <q-file v-model="docenteForm.archivo_respaldo" :display-value="docenteForm.archivo_respaldo ? docenteForm.archivo_respaldo.name : getExistingFileLabel(docenteForm.archivo_respaldo_actual)" label="Certificado de trabajo docente" outlined dense accept=".pdf,.jpg,.jpeg,.png" />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="academico-dialog__actions q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated color="blue" :loading="saving" label="Guardar en legajo" rounded no-caps class="q-px-lg" @click="saveDocente" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="profesionalDialog">
      <q-card class="academico-dialog rounded-24 overflow-hidden">
        <q-card-section class="academico-dialog__header row items-center q-py-md">
          <div class="text-h6">{{ profesionalForm.id ? 'Editar experiencia profesional' : 'Nueva experiencia profesional' }}</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input v-model="profesionalForm.cargo" label="Cargo o puesto" outlined dense />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="profesionalForm.empresa" label="Empresa / InstituciÃ³n" outlined dense />
          </div>
          <div class="col-12 col-md-6">
            <q-select v-model="profesionalForm.id_pais" :options="countryOptions" emit-value map-options label="PaÃ­s" outlined dense @update:model-value="onDialogCountryChange($event, profesionalForm)" />
          </div>
          <div class="col-12 col-md-6">
            <q-select v-model="profesionalForm.id_depto" :options="dialogDepartmentOptions" emit-value map-options label="Departamento / Estado" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="profesionalForm.fecha_inicio" type="date" stack-label label="Fecha de inicio" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="profesionalForm.fecha_fin" type="date" stack-label label="Fecha de conclusiÃ³n" outlined dense />
          </div>
          <div class="col-12">
            <q-file v-model="profesionalForm.archivo_respaldo" :display-value="profesionalForm.archivo_respaldo ? profesionalForm.archivo_respaldo.name : getExistingFileLabel(profesionalForm.archivo_respaldo_actual)" label="Certificado / contrato" outlined dense accept=".pdf,.jpg,.jpeg,.png" />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="academico-dialog__actions q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated color="deep-orange" :loading="saving" label="Guardar en legajo" rounded no-caps class="q-px-lg" @click="saveProfesional" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="capacitacionDialog">
      <q-card class="academico-dialog rounded-24 overflow-hidden">
        <q-card-section class="academico-dialog__header row items-center q-py-md"><div class="text-h6">{{ capacitacionForm.id ? 'Editar capacitaciÃ³n' : 'Nueva capacitaciÃ³n' }}</div><q-space /><q-btn flat round dense icon="close" v-close-popup /></q-card-section>
        <q-separator />
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12 col-md-8"><q-input v-model="capacitacionForm.nombre_curso" label="Curso" outlined dense /></div>
          <div class="col-12 col-md-4"><q-input v-model="capacitacionForm.carga_horaria" label="Carga horaria" outlined dense /></div>
          <div class="col-12 col-md-8"><q-input v-model="capacitacionForm.institucion" label="InstituciÃ³n" outlined dense /></div>
          <div class="col-12 col-md-4"><q-select v-model="capacitacionForm.id_pais" :options="countryOptions" emit-value map-options label="PaÃ­s" outlined dense @update:model-value="onDialogCountryChange($event, capacitacionForm)" /></div>
          <div class="col-12 col-md-8"><q-select v-model="capacitacionForm.id_depto" :options="dialogDepartmentOptions" emit-value map-options label="Departamento / Estado" outlined dense /></div>
          <div class="col-12 col-md-6"><q-input v-model="capacitacionForm.fecha" type="date" stack-label label="Fecha" outlined dense /></div>
          <div class="col-12"><q-file v-model="capacitacionForm.archivo_respaldo" :display-value="capacitacionForm.archivo_respaldo ? capacitacionForm.archivo_respaldo.name : getExistingFileLabel(capacitacionForm.archivo_respaldo_actual)" label="Certificado" outlined dense accept=".pdf,.jpg,.jpeg,.png" /></div>
        </q-card-section>
        <q-card-actions align="right" class="academico-dialog__actions q-pa-md"><q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps /><q-btn unelevated color="positive" :loading="saving" label="Guardar en legajo" rounded no-caps class="q-px-lg" @click="saveCapacitacion" /></q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="idiomaDialog">
      <q-card class="academico-dialog rounded-24 overflow-hidden">
        <q-card-section class="academico-dialog__header row items-center q-py-md"><div class="text-h6">{{ idiomaForm.id ? 'Editar idioma' : 'Nuevo idioma' }}</div><q-space /><q-btn flat round dense icon="close" v-close-popup /></q-card-section>
        <q-separator />
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12 col-md-6"><q-select v-model="idiomaForm.idioma" :options="languageOptions" label="Idioma" outlined dense /></div>
          <div class="col-12 col-md-6"><q-select v-model="idiomaForm.nivel_habla" :options="nivelOptions" label="Nivel habla" outlined dense /></div>
          <div class="col-12 col-md-6"><q-select v-model="idiomaForm.nivel_escritura" :options="nivelOptions" label="Nivel escritura" outlined dense /></div>
          <div class="col-12 col-md-6"><q-select v-model="idiomaForm.nivel_lee" :options="nivelOptions" label="Nivel lee" outlined dense /></div>
          <div class="col-12"><q-file v-model="idiomaForm.archivo_respaldo" :display-value="idiomaForm.archivo_respaldo ? idiomaForm.archivo_respaldo.name : getExistingFileLabel(idiomaForm.archivo_respaldo_actual)" label="Archivo respaldo" outlined dense accept=".pdf,.jpg,.jpeg,.png" /></div>
        </q-card-section>
        <q-card-actions align="right" class="academico-dialog__actions q-pa-md"><q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps /><q-btn unelevated color="cyan-7" :loading="saving" label="Guardar en legajo" rounded no-caps class="q-px-lg" @click="saveIdioma" /></q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="produccionDialog">
      <q-card class="academico-dialog rounded-24 overflow-hidden">
        <q-card-section class="academico-dialog__header row items-center q-py-md"><div class="text-h6">{{ produccionForm.id ? 'Editar producciÃ³n intelectual' : 'Nueva producciÃ³n intelectual' }}</div><q-space /><q-btn flat round dense icon="close" v-close-popup /></q-card-section>
        <q-separator />
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12 col-md-4"><q-select v-model="produccionForm.tipo" :options="productionTypes" label="Tipo" outlined dense /></div>
          <div class="col-12 col-md-4"><q-select v-model="produccionForm.id_pais" :options="countryOptions" emit-value map-options label="PaÃ­s" outlined dense @update:model-value="onDialogCountryChange($event, produccionForm)" /></div>
          <div class="col-12 col-md-4"><q-select v-model="produccionForm.id_depto" :options="dialogDepartmentOptions" emit-value map-options label="Departamento / Estado" outlined dense /></div>
          <div class="col-12 col-md-8"><q-input v-model="produccionForm.titulo" label="TÃ­tulo" outlined dense /></div>
          <div class="col-12 col-md-6"><q-input v-model="produccionForm.editorial" label="Editorial" outlined dense /></div>
          <div class="col-12 col-md-6"><q-input v-model="produccionForm.fecha" type="date" stack-label label="Fecha" outlined dense /></div>
          <div class="col-12"><q-file v-model="produccionForm.archivo_respaldo" :display-value="produccionForm.archivo_respaldo ? produccionForm.archivo_respaldo.name : getExistingFileLabel(produccionForm.archivo_respaldo_actual)" label="Caratula o comprobante" outlined dense accept=".pdf,.jpg,.jpeg,.png" /></div>
        </q-card-section>
        <q-card-actions align="right" class="academico-dialog__actions q-pa-md"><q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps /><q-btn unelevated color="purple-7" :loading="saving" label="Guardar en legajo" rounded no-caps class="q-px-lg" @click="saveProduccion" /></q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="reconocimientoDialog">
      <q-card class="academico-dialog rounded-24 overflow-hidden">
        <q-card-section class="academico-dialog__header row items-center q-py-md"><div class="text-h6">{{ reconocimientoForm.id ? 'Editar reconocimiento' : 'Nuevo reconocimiento' }}</div><q-space /><q-btn flat round dense icon="close" v-close-popup /></q-card-section>
        <q-separator />
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12 col-md-6"><q-input v-model="reconocimientoForm.titulo_premio" label="TÃ­tulo del premio" outlined dense /></div>
          <div class="col-12 col-md-6"><q-input v-model="reconocimientoForm.institucion_otorgante" label="InstituciÃ³n otorgante" outlined dense /></div>
          <div class="col-12 col-md-6"><q-input v-model="reconocimientoForm.fecha" type="date" stack-label label="Fecha" outlined dense /></div>
          <div class="col-12 col-md-6"><q-input v-model="reconocimientoForm.lugar" label="Lugar" outlined dense /></div>
          <div class="col-12"><q-file v-model="reconocimientoForm.archivo_respaldo" :display-value="reconocimientoForm.archivo_respaldo ? reconocimientoForm.archivo_respaldo.name : getExistingFileLabel(reconocimientoForm.archivo_respaldo_actual)" label="Archivo respaldo" outlined dense accept=".pdf,.jpg,.jpeg,.png" /></div>
        </q-card-section>
        <q-card-actions align="right" class="academico-dialog__actions q-pa-md"><q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps /><q-btn unelevated color="amber-8" :loading="saving" label="Guardar en legajo" rounded no-caps class="q-px-lg" @click="saveReconocimiento" /></q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useGeoStore } from 'src/modules/geo/stores/useGeoStore'
import { usePersonalStore } from 'src/stores/personalStore'
import { getFileSizeError, sanitizeAlphanumeric, sanitizeLetters, sanitizeNumbers } from 'src/shared/utils/formValidators'

const props = withDefaults(defineProps<{
  profile: any | null
  loading: boolean
  personaId?: string | null
  editable?: boolean
}>(), {
  personaId: null,
  editable: true
})

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const $q = useQuasar()
const personalStore = usePersonalStore()
const geoStore = useGeoStore()

const saving = ref(false)
const pregradoDialog = ref(false)
const postgradoDialog = ref(false)
const docenteDialog = ref(false)
const profesionalDialog = ref(false)

const pregradoLevels = ['TÃ©cnico Medio', 'TÃ©cnico Superior', 'Licenciatura']
const postgradoLevels = ['Diplomado', 'EspecializaciÃ³n', 'MaestrÃ­a', 'Doctorado']
const nivelOptions = ['BÃ¡sico', 'Intermedio', 'Avanzado', 'Nativo']
const productionTypes = ['Libro', 'ArtÃ­culo', 'InvestigaciÃ³n', 'Revista']
const languageOptions = ['ESPAÃ‘OL', 'INGLÃ‰S', 'PORTUGUÃ‰S', 'FRANCÃ‰S', 'ITALIANO', 'ALEMÃN', 'MANDARÃN', 'QUECHUA', 'AYMARA', 'GUARANÃ', 'OTRO']
const semestreOptions = ['I', 'II', 'Verano', 'Invierno']
const dialogDepartmentOptions = ref<{ label: string; value: number }[]>([])
const quickGestion = ref({ semestre: 'I', anio: String(new Date().getFullYear()) })

const getDefaultCountryId = () => {
  const bolivia = (personalStore.catalogs.paises || []).find((item: any) => String(item.nombre || '').trim().toUpperCase() === 'BOLIVIA')
  return bolivia?.id_pais ? Number(bolivia.id_pais) : null
}

const ensureDialogDepartments = async (countryId?: number | null) => {
  const targetCountryId = countryId || getDefaultCountryId()

  if (!targetCountryId) {
    dialogDepartmentOptions.value = departmentOptions.value
    return
  }

  try {
    const departamentos = await geoStore.fetchDepartamentos(Number(targetCountryId))
    dialogDepartmentOptions.value = departamentos.map((item: any) => ({
      label: item.nombre,
      value: item.id_departamento ?? item.id_depto ?? item.id,
    }))
  } catch (error) {
    console.error('Error loading dialog departments', error)
    dialogDepartmentOptions.value = departmentOptions.value
  }
}

const onDialogCountryChange = async (countryId: number | null, target: { id_depto: number | null }) => {
  target.id_depto = null
  await ensureDialogDepartments(countryId)
}

const forceUpperValue = (value?: string | null) => (value || '').toUpperCase()
const normalizeLetters = (value?: string | null) => forceUpperValue(sanitizeLetters(value))
const normalizeNumbers = (value?: string | null) => sanitizeNumbers(value)
const normalizeMixed = (value?: string | null) => forceUpperValue(sanitizeAlphanumeric(value))

const validateFiles = (files: Array<File | null | undefined>) => {
  for (const file of files) {
    const fileError = getFileSizeError(file)
    if (fileError) {
      $q.notify({ color: 'negative', message: fileError })
      return false
    }
  }
  return true
}

const validateRequiredText = (label: string, value?: string | null) => {
  if (!String(value || '').trim()) {
    $q.notify({ color: 'warning', message: `${label} es obligatorio.` })
    return false
  }
  return true
}

const validateYearEntries = (values: string[]) => {
  for (const value of values) {
    if (!/^(I|II|VERANO|INVIERNO)-\d{4}$/i.test(String(value || '').trim())) {
      $q.notify({ color: 'warning', message: 'Las gestiones deben tener formato PERIODO-AÃ‘O, por ejemplo I-2025.' })
      return false
    }
  }
  return true
}

const addGestionToDocenteList = () => {
  if (!quickGestion.value.anio) return
  quickGestion.value.anio = normalizeNumbers(quickGestion.value.anio)
  const value = `${quickGestion.value.semestre}-${quickGestion.value.anio}`
  if (!docenteForm.value.gestion_list.includes(value)) {
    docenteForm.value.gestion_list.push(value)
  }
}

const emptyPregrado = () => ({
  id: null as number | null,
  nivel: '',
  id_pais: null as number | null,
  institucion: '',
  titulo: '',
  id_depto: null as number | null,
  fecha_emision_diploma: '',
  fecha_emision: '',
  archivo_diploma: null as File | null,
  archivo_titulo: null as File | null,
  archivo_diploma_actual: '',
  archivo_titulo_actual: '',
})

const emptyPostgrado = () => ({
  id: null as number | null,
  tipo: '',
  id_pais: null as number | null,
  titulo: '',
  institucion: '',
  id_depto: null as number | null,
  fecha_emision: '',
  archivo_respaldo: null as File | null,
  archivo_respaldo_actual: '',
})

const pregradoForm = ref(emptyPregrado())
const postgradoForm = ref(emptyPostgrado())
const docenteForm = ref({
  id: null as number | null,
  institucion: '',
  carrera: '',
  id_pais: null as number | null,
  asignaturas_list: [] as string[],
  gestion_list: [] as string[],
  id_depto: null as number | null,
  archivo_respaldo: null as File | null,
  archivo_respaldo_actual: '',
})
const profesionalForm = ref({
  id: null as number | null,
  cargo: '',
  empresa: '',
  id_pais: null as number | null,
  fecha_inicio: '',
  fecha_fin: '',
  id_depto: null as number | null,
  archivo_respaldo: null as File | null,
  archivo_respaldo_actual: '',
})
const capacitacionDialog = ref(false)
const idiomaDialog = ref(false)
const produccionDialog = ref(false)
const reconocimientoDialog = ref(false)
const capacitacionForm = ref({
  id: null as number | null,
  nombre_curso: '',
  institucion: '',
  fecha: '',
  carga_horaria: '',
  id_pais: null as number | null,
  id_depto: null as number | null,
  archivo_respaldo: null as File | null,
  archivo_respaldo_actual: '',
})
const idiomaForm = ref({
  id: null as number | null,
  idioma: '',
  nivel_habla: '',
  nivel_escritura: '',
  nivel_lee: '',
  archivo_respaldo: null as File | null,
  archivo_respaldo_actual: '',
})
const produccionForm = ref({
  id: null as number | null,
  tipo: '',
  titulo: '',
  fecha: '',
  editorial: '',
  id_pais: null as number | null,
  id_depto: null as number | null,
  archivo_respaldo: null as File | null,
  archivo_respaldo_actual: '',
})
const reconocimientoForm = ref({
  id: null as number | null,
  titulo_premio: '',
  institucion_otorgante: '',
  fecha: '',
  lugar: '',
  archivo_respaldo: null as File | null,
  archivo_respaldo_actual: '',
})

const formatDate = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-BO')
}

const departmentOptions = computed(() =>
  (personalStore.catalogs.departamentos || []).map((item: any) => ({
    label: item.nombre,
    value: item.id_departamento ?? item.id_depto ?? item.id,
  }))
)

const countryOptions = computed(() =>
  (personalStore.catalogs.paises || []).map((item: any) => ({
    label: item.nombre,
    value: item.id_pais ?? item.id,
  }))
)

const departmentName = (id?: number | string | null) =>
  departmentOptions.value.find((item) => Number(item.value) === Number(id))?.label || ''

const getCountryIdFromItem = (item?: any) => {
  const countryId = item?.id_pais ?? item?.depto?.pais_id ?? item?.depto?.pais?.id_pais ?? null
  return countryId ? Number(countryId) : getDefaultCountryId()
}

const getExistingFileLabel = (path?: string | null) => {
  if (!path) return ''
  const cleanPath = String(path).split('?')[0]
  const parts = cleanPath.split('/')
  return parts[parts.length - 1] || cleanPath
}

const normalizeId = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

const pregradoList = computed(() => props.profile?.formacion_pregrado || [])
const postgradoList = computed(() => props.profile?.formacion_postgrado || [])
const docenteList = computed(() => props.profile?.experiencia_docente || [])
const profesionalList = computed(() => props.profile?.experiencia_profesional || [])
const capacitacionList = computed(() => props.profile?.capacitaciones || [])
const idiomaList = computed(() => props.profile?.idiomas || [])
const produccionList = computed(() => props.profile?.produccion_intelectual || [])
const reconocimientoList = computed(() => props.profile?.reconocimientos || [])

const sections = computed(() => [])

onMounted(async () => {
  if (!personalStore.catalogs.departamentos.length || !personalStore.catalogs.paises.length) {
    await personalStore.fetchCatalogs()
  }
  await ensureDialogDepartments(getDefaultCountryId())
})

const buildPregradoPayload = () => {
  pregradoForm.value.institucion = normalizeLetters(pregradoForm.value.institucion)
  pregradoForm.value.titulo = normalizeMixed(pregradoForm.value.titulo)
  const payload = new FormData()
  payload.append('nivel', pregradoForm.value.nivel)
  payload.append('institucion', pregradoForm.value.institucion)
  payload.append('carrera', pregradoForm.value.titulo)
  payload.append('id_depto', String(pregradoForm.value.id_depto || ''))
  payload.append('fecha_diploma', pregradoForm.value.fecha_emision_diploma || '')
  payload.append('fecha_titulo', pregradoForm.value.fecha_emision || '')
  if (pregradoForm.value.archivo_diploma) payload.append('archivo_diploma', pregradoForm.value.archivo_diploma)
  if (pregradoForm.value.archivo_titulo) payload.append('archivo_titulo', pregradoForm.value.archivo_titulo)
  return payload
}

const buildPostgradoPayload = () => {
  postgradoForm.value.institucion = normalizeLetters(postgradoForm.value.institucion)
  postgradoForm.value.titulo = normalizeMixed(postgradoForm.value.titulo)
  const payload = new FormData()
  payload.append('tipo', postgradoForm.value.tipo)
  payload.append('institucion', postgradoForm.value.institucion)
  payload.append('nombre_programa', postgradoForm.value.titulo)
  payload.append('id_depto', String(postgradoForm.value.id_depto || ''))
  payload.append('fecha_diploma', '')
  payload.append('fecha_certificacion', postgradoForm.value.fecha_emision || '')
  if (postgradoForm.value.archivo_respaldo) payload.append('archivo_respaldo', postgradoForm.value.archivo_respaldo)
  return payload
}

const openPregradoDialog = async (item?: any) => {
  pregradoForm.value = item ? {
    id: item.id,
    nivel: item.nivel || '',
    id_pais: getCountryIdFromItem(item),
    institucion: item.institucion || '',
    titulo: item.carrera || '',
    id_depto: normalizeId(item.id_depto),
    fecha_emision_diploma: item.fecha_diploma || '',
    fecha_emision: item.fecha_titulo || '',
    archivo_diploma: null,
    archivo_titulo: null,
    archivo_diploma_actual: item.archivo_diploma || '',
    archivo_titulo_actual: item.archivo_titulo || '',
  } : emptyPregrado()
  if (!pregradoForm.value.id_pais) pregradoForm.value.id_pais = getDefaultCountryId()
  await ensureDialogDepartments(pregradoForm.value.id_pais)
  pregradoDialog.value = true
}

const openPostgradoDialog = async (item?: any) => {
  postgradoForm.value = item ? {
    id: item.id,
    tipo: item.tipo || '',
    id_pais: getCountryIdFromItem(item),
    titulo: item.nombre_programa || '',
    institucion: item.institucion || '',
    id_depto: normalizeId(item.id_depto),
    fecha_emision: item.fecha_certificacion || item.fecha_emision || item.fecha_diploma || '',
    archivo_respaldo: null,
    archivo_respaldo_actual: item.archivo_respaldo || '',
  } : emptyPostgrado()
  if (!postgradoForm.value.id_pais) postgradoForm.value.id_pais = getDefaultCountryId()
  await ensureDialogDepartments(postgradoForm.value.id_pais)
  postgradoDialog.value = true
}

const savePregrado = async () => {
  if (!props.personaId) return
if (!validateRequiredText('InstituciÃ³n / Universidad', pregradoForm.value.institucion)) return
if (!validateRequiredText('Nombre del tÃ­tulo', pregradoForm.value.titulo)) return
  if (!validateFiles([pregradoForm.value.archivo_diploma, pregradoForm.value.archivo_titulo])) return
  saving.value = true
  const payload = buildPregradoPayload()
  const result = pregradoForm.value.id
    ? await personalStore.updateAcademicRecord('pregrado', pregradoForm.value.id, payload)
    : await personalStore.createAcademicRecord(props.personaId, 'pregrado', payload)
  saving.value = false
  if (result) {
    pregradoDialog.value = false
    emit('refresh')
  }
}

const savePostgrado = async () => {
  if (!props.personaId) return
if (!validateRequiredText('InstituciÃ³n / Universidad', postgradoForm.value.institucion)) return
  if (!validateRequiredText('Nombre del postgrado / tesis', postgradoForm.value.titulo)) return
  if (!validateFiles([postgradoForm.value.archivo_respaldo])) return
  saving.value = true
  const payload = buildPostgradoPayload()
  const result = postgradoForm.value.id
    ? await personalStore.updateAcademicRecord('postgrado', postgradoForm.value.id, payload)
    : await personalStore.createAcademicRecord(props.personaId, 'postgrado', payload)
  saving.value = false
  if (result) {
    postgradoDialog.value = false
    emit('refresh')
  }
}

const confirmDelete = (type: 'pregrado' | 'postgrado', item: any) => {
  $q.dialog({
    title: 'Eliminar registro',
message: `Se eliminarÃ¡ el registro acadÃ©mico "${item.carrera || item.nombre_programa || item.tipo}".`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const deleted = await personalStore.deleteAcademicRecord(type, item.id)
    if (deleted) emit('refresh')
  })
}

const buildDocentePayload = () => {
  docenteForm.value.institucion = normalizeLetters(docenteForm.value.institucion)
  docenteForm.value.carrera = normalizeMixed(docenteForm.value.carrera)
  docenteForm.value.asignaturas_list = (docenteForm.value.asignaturas_list || []).map((item: string) => normalizeMixed(item)).filter(Boolean)
  docenteForm.value.gestion_list = (docenteForm.value.gestion_list || []).map((item: string) => normalizeMixed(item)).filter(Boolean)
  const payload = new FormData()
  payload.append('institucion', docenteForm.value.institucion)
  payload.append('carrera', docenteForm.value.carrera)
  payload.append('asignaturas', (docenteForm.value.asignaturas_list || []).join(', '))
  payload.append('gestion_periodo', (docenteForm.value.gestion_list || []).join(', '))
  payload.append('id_depto', String(docenteForm.value.id_depto || ''))
  if (docenteForm.value.archivo_respaldo) payload.append('archivo_respaldo', docenteForm.value.archivo_respaldo)
  return payload
}

const buildProfesionalPayload = () => {
  profesionalForm.value.cargo = normalizeLetters(profesionalForm.value.cargo)
  profesionalForm.value.empresa = normalizeLetters(profesionalForm.value.empresa)
  const payload = new FormData()
  payload.append('cargo', profesionalForm.value.cargo)
  payload.append('empresa', profesionalForm.value.empresa)
  payload.append('fecha_inicio', profesionalForm.value.fecha_inicio)
  payload.append('fecha_fin', profesionalForm.value.fecha_fin || '')
  payload.append('id_depto', String(profesionalForm.value.id_depto || ''))
  if (profesionalForm.value.archivo_respaldo) payload.append('archivo_respaldo', profesionalForm.value.archivo_respaldo)
  return payload
}

const openDocenteDialog = async (item?: any) => {
  docenteForm.value = item ? {
    id: item.id,
    institucion: item.institucion || '',
    carrera: item.carrera || '',
    id_pais: getCountryIdFromItem(item),
    asignaturas_list: item.asignaturas ? String(item.asignaturas).split(', ').filter(Boolean) : [],
    gestion_list: item.gestion_periodo ? String(item.gestion_periodo).split(', ').filter(Boolean) : [],
    id_depto: normalizeId(item.id_depto),
    archivo_respaldo: null,
    archivo_respaldo_actual: item.archivo_respaldo || '',
  } : {
    id: null,
    institucion: '',
    carrera: '',
    id_pais: getDefaultCountryId(),
    asignaturas_list: [],
    gestion_list: [],
    id_depto: null,
    archivo_respaldo: null,
    archivo_respaldo_actual: '',
  }
  await ensureDialogDepartments(docenteForm.value.id_pais)
  docenteDialog.value = true
}

const openProfesionalDialog = async (item?: any) => {
  profesionalForm.value = item ? {
    id: item.id,
    cargo: item.cargo || '',
    empresa: item.empresa || '',
    id_pais: getCountryIdFromItem(item),
    fecha_inicio: item.fecha_inicio || '',
    fecha_fin: item.fecha_fin || '',
    id_depto: normalizeId(item.id_depto),
    archivo_respaldo: null,
    archivo_respaldo_actual: item.archivo_respaldo || '',
  } : {
    id: null,
    cargo: '',
    empresa: '',
    id_pais: getDefaultCountryId(),
    fecha_inicio: '',
    fecha_fin: '',
    id_depto: null,
    archivo_respaldo: null,
    archivo_respaldo_actual: '',
  }
  await ensureDialogDepartments(profesionalForm.value.id_pais)
  profesionalDialog.value = true
}

const saveDocente = async () => {
  if (!props.personaId) return
if (!validateRequiredText('InstituciÃ³n / Universidad', docenteForm.value.institucion)) return
  if (!validateRequiredText('Carrera o Facultad', docenteForm.value.carrera)) return
  if (!validateYearEntries(docenteForm.value.gestion_list || [])) return
  if (!validateFiles([docenteForm.value.archivo_respaldo])) return
  saving.value = true
  const payload = buildDocentePayload()
  const result = docenteForm.value.id
    ? await personalStore.updateAcademicExperience('docente', docenteForm.value.id, payload)
    : await personalStore.createAcademicExperience(props.personaId, 'docente', payload)
  saving.value = false
  if (result) {
    docenteDialog.value = false
    emit('refresh')
  }
}

const saveProfesional = async () => {
  if (!props.personaId) return
  if (!validateRequiredText('Cargo o Puesto', profesionalForm.value.cargo)) return
if (!validateRequiredText('Empresa / InstituciÃ³n', profesionalForm.value.empresa)) return
  if (!validateFiles([profesionalForm.value.archivo_respaldo])) return
  saving.value = true
  const payload = buildProfesionalPayload()
  const result = profesionalForm.value.id
    ? await personalStore.updateAcademicExperience('profesional', profesionalForm.value.id, payload)
    : await personalStore.createAcademicExperience(props.personaId, 'profesional', payload)
  saving.value = false
  if (result) {
    profesionalDialog.value = false
    emit('refresh')
  }
}

const confirmDeleteExperience = (type: 'docente' | 'profesional', item: any) => {
  $q.dialog({
    title: 'Eliminar registro',
message: `Se eliminarÃ¡ el registro de experiencia "${item.institucion || item.cargo}".`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const deleted = await personalStore.deleteAcademicExperience(type, item.id)
    if (deleted) emit('refresh')
  })
}

const buildCapacitacionPayload = () => {
  capacitacionForm.value.nombre_curso = normalizeMixed(capacitacionForm.value.nombre_curso)
  capacitacionForm.value.institucion = normalizeLetters(capacitacionForm.value.institucion)
  capacitacionForm.value.carga_horaria = normalizeNumbers(capacitacionForm.value.carga_horaria)
  const payload = new FormData()
  payload.append('nombre_curso', capacitacionForm.value.nombre_curso)
  payload.append('institucion', capacitacionForm.value.institucion)
  payload.append('fecha', capacitacionForm.value.fecha || '')
  payload.append('carga_horaria', capacitacionForm.value.carga_horaria || '')
  payload.append('id_depto', String(capacitacionForm.value.id_depto || ''))
  if (capacitacionForm.value.archivo_respaldo) payload.append('archivo_respaldo', capacitacionForm.value.archivo_respaldo)
  return payload
}

const buildIdiomaPayload = () => {
  idiomaForm.value.idioma = normalizeLetters(idiomaForm.value.idioma)
  const payload = new FormData()
  payload.append('idioma', idiomaForm.value.idioma)
  payload.append('nivel_habla', idiomaForm.value.nivel_habla)
  payload.append('nivel_escritura', idiomaForm.value.nivel_escritura)
  payload.append('nivel_lee', idiomaForm.value.nivel_lee)
  if (idiomaForm.value.archivo_respaldo) payload.append('archivo_respaldo', idiomaForm.value.archivo_respaldo)
  return payload
}

const buildProduccionPayload = () => {
  produccionForm.value.titulo = normalizeMixed(produccionForm.value.titulo)
  produccionForm.value.editorial = normalizeMixed(produccionForm.value.editorial)
  const payload = new FormData()
  payload.append('tipo', produccionForm.value.tipo)
  payload.append('titulo', produccionForm.value.titulo)
  payload.append('fecha', produccionForm.value.fecha || '')
  payload.append('editorial', produccionForm.value.editorial || '')
  payload.append('id_depto', String(produccionForm.value.id_depto || ''))
  if (produccionForm.value.archivo_respaldo) payload.append('archivo_respaldo', produccionForm.value.archivo_respaldo)
  return payload
}

const buildReconocimientoPayload = () => {
  reconocimientoForm.value.titulo_premio = normalizeMixed(reconocimientoForm.value.titulo_premio)
  reconocimientoForm.value.institucion_otorgante = normalizeLetters(reconocimientoForm.value.institucion_otorgante)
  reconocimientoForm.value.lugar = normalizeMixed(reconocimientoForm.value.lugar)
  const payload = new FormData()
  payload.append('titulo_premio', reconocimientoForm.value.titulo_premio)
  payload.append('institucion_otorgante', reconocimientoForm.value.institucion_otorgante)
  payload.append('fecha', reconocimientoForm.value.fecha || '')
  payload.append('lugar', reconocimientoForm.value.lugar || '')
  if (reconocimientoForm.value.archivo_respaldo) payload.append('archivo_respaldo', reconocimientoForm.value.archivo_respaldo)
  return payload
}

const openCapacitacionDialog = async (item?: any) => {
  capacitacionForm.value = item ? {
    id: item.id, nombre_curso: item.nombre_curso || '', institucion: item.institucion || '', fecha: item.fecha || '',
    carga_horaria: item.carga_horaria || '', id_pais: getCountryIdFromItem(item), id_depto: normalizeId(item.id_depto), archivo_respaldo: null, archivo_respaldo_actual: item.archivo_respaldo || '',
  } : { id: null, nombre_curso: '', institucion: '', fecha: '', carga_horaria: '', id_pais: getDefaultCountryId(), id_depto: null, archivo_respaldo: null, archivo_respaldo_actual: '' }
  await ensureDialogDepartments(capacitacionForm.value.id_pais)
  capacitacionDialog.value = true
}

const openIdiomaDialog = (item?: any) => {
  idiomaForm.value = item ? {
    id: item.id, idioma: item.idioma || '', nivel_habla: item.nivel_habla || '', nivel_escritura: item.nivel_escritura || '',
    nivel_lee: item.nivel_lee || '', archivo_respaldo: null, archivo_respaldo_actual: item.archivo_respaldo || '',
  } : { id: null, idioma: '', nivel_habla: '', nivel_escritura: '', nivel_lee: '', archivo_respaldo: null, archivo_respaldo_actual: '' }
  idiomaDialog.value = true
}

const openProduccionDialog = async (item?: any) => {
  produccionForm.value = item ? {
    id: item.id, tipo: item.tipo || '', titulo: item.titulo || '', fecha: item.fecha || '',
    editorial: item.editorial || '', id_pais: getCountryIdFromItem(item), id_depto: normalizeId(item.id_depto), archivo_respaldo: null, archivo_respaldo_actual: item.archivo_respaldo || '',
  } : { id: null, tipo: '', titulo: '', fecha: '', editorial: '', id_pais: getDefaultCountryId(), id_depto: null, archivo_respaldo: null, archivo_respaldo_actual: '' }
  await ensureDialogDepartments(produccionForm.value.id_pais)
  produccionDialog.value = true
}

const openReconocimientoDialog = (item?: any) => {
  reconocimientoForm.value = item ? {
    id: item.id, titulo_premio: item.titulo_premio || '', institucion_otorgante: item.institucion_otorgante || '',
    fecha: item.fecha || '', lugar: item.lugar || '', archivo_respaldo: null, archivo_respaldo_actual: item.archivo_respaldo || '',
  } : { id: null, titulo_premio: '', institucion_otorgante: '', fecha: '', lugar: '', archivo_respaldo: null, archivo_respaldo_actual: '' }
  reconocimientoDialog.value = true
}

const saveCapacitacion = async () => {
  if (!props.personaId) return
  if (!validateRequiredText('Nombre del curso', capacitacionForm.value.nombre_curso)) return
if (!validateRequiredText('InstituciÃ³n', capacitacionForm.value.institucion)) return
  if (!validateFiles([capacitacionForm.value.archivo_respaldo])) return
  saving.value = true
  const payload = buildCapacitacionPayload()
  const result = capacitacionForm.value.id
    ? await personalStore.updateAcademicOther('capacitaciones', capacitacionForm.value.id, payload)
    : await personalStore.createAcademicOther(props.personaId, 'capacitaciones', payload)
  saving.value = false
  if (result) { capacitacionDialog.value = false; emit('refresh') }
}

const saveIdioma = async () => {
  if (!props.personaId) return
  if (!validateRequiredText('Idioma', idiomaForm.value.idioma)) return
  if (!validateFiles([idiomaForm.value.archivo_respaldo])) return
  saving.value = true
  const payload = buildIdiomaPayload()
  const result = idiomaForm.value.id
    ? await personalStore.updateAcademicOther('idiomas', idiomaForm.value.id, payload)
    : await personalStore.createAcademicOther(props.personaId, 'idiomas', payload)
  saving.value = false
  if (result) { idiomaDialog.value = false; emit('refresh') }
}

const saveProduccion = async () => {
  if (!props.personaId) return
if (!validateRequiredText('TÃ­tulo', produccionForm.value.titulo)) return
  if (!validateFiles([produccionForm.value.archivo_respaldo])) return
  saving.value = true
  const payload = buildProduccionPayload()
  const result = produccionForm.value.id
    ? await personalStore.updateAcademicOther('produccion-intelectual', produccionForm.value.id, payload)
    : await personalStore.createAcademicOther(props.personaId, 'produccion-intelectual', payload)
  saving.value = false
  if (result) { produccionDialog.value = false; emit('refresh') }
}

const saveReconocimiento = async () => {
  if (!props.personaId) return
if (!validateRequiredText('TÃ­tulo del premio', reconocimientoForm.value.titulo_premio)) return
if (!validateRequiredText('InstituciÃ³n otorgante', reconocimientoForm.value.institucion_otorgante)) return
  if (!validateFiles([reconocimientoForm.value.archivo_respaldo])) return
  saving.value = true
  const payload = buildReconocimientoPayload()
  const result = reconocimientoForm.value.id
    ? await personalStore.updateAcademicOther('reconocimientos', reconocimientoForm.value.id, payload)
    : await personalStore.createAcademicOther(props.personaId, 'reconocimientos', payload)
  saving.value = false
  if (result) { reconocimientoDialog.value = false; emit('refresh') }
}

const confirmDeleteOther = (type: 'capacitaciones' | 'idiomas' | 'produccion-intelectual' | 'reconocimientos', item: any) => {
  $q.dialog({
    title: 'Eliminar registro',
message: `Se eliminarÃ¡ el registro "${item.nombre_curso || item.idioma || item.titulo || item.titulo_premio}".`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const deleted = await personalStore.deleteAcademicOther(type, item.id)
    if (deleted) emit('refresh')
  })
}
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

.formation-grid,
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

.academico-card__header--action {
  flex-wrap: wrap;
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

.academico-item--action {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
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

.academico-dialog {
  width: 820px;
  max-width: 92vw;
  border-radius: 18px;
}

.academico-dialog__header {
  background: linear-gradient(135deg, #4f2789 0%, #00c2cb 100%);
  color: #ffffff;
}

.academico-dialog__header :deep(.q-btn) {
  color: #ffffff;
}

.academico-dialog__actions {
  background: #f8fafc;
}

.rounded-24 {
  border-radius: 24px !important;
}
</style>

