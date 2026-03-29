<template>
  <q-page class="sigeth-page">
    <div v-if="loading" class="flex flex-center q-pa-xl"><q-spinner-dots color="primary" size="40px" /></div>

    <div v-else-if="employee" class="profile-container animate-fade">
      <!-- HEADER SISPO STYLE -->
      <div class="profile-header q-pa-lg">
        <div class="row items-end no-wrap q-gutter-md content-area">
          <q-avatar size="110px" class="profile-avatar border-white shadow-10">
            <img :src="`https://ui-avatars.com/api/?name=${employee.persona.primer_apellido}+${employee.persona.nombres}&background=6A37A3&color=fff&bold=true`" />
          </q-avatar>
          <div class="column text-white q-pb-sm">
            <div class="text-h4 text-weight-bold">{{ employee.persona.nombres }} {{ employee.persona.primer_apellido }}</div>
            <div class="row items-center q-gutter-sm">
              <q-badge :color="employee.estado_laboral === 'Activo' ? 'positive' : 'grey-7'">{{ employee.estado_laboral }}</q-badge>
              <span class="text-subtitle1 opacity-80">{{ employee.contrato_activo?.cargo?.nombre_cargo || 'Sin Cargo' }}</span>
            </div>
          </div>
        </div>
      </div>

      <q-tabs v-model="tab" dense class="text-grey-7 q-mt-md" active-color="primary" indicator-color="primary" align="left" no-caps>
        <q-tab name="info" label="Información General" icon="contact_page" />
        <q-tab name="cv" label="CV Normalizado" icon="school" />
        <q-tab name="contracts" label="Historial Laboral" icon="history_edu" />
      </q-tabs>
      <q-separator />

      <q-tab-panels v-model="tab" animated class="bg-transparent">
        <!-- INFO PANEL -->
        <q-tab-panel name="info" class="q-pa-none q-pt-md">
           <div class="row q-col-gutter-md">
            <div class="col-12 col-md-8">
              <q-card flat bordered class="rounded-16">
                <q-card-section class="text-overline text-primary">Datos Personales</q-card-section>
                <q-card-section class="row q-col-gutter-md">
                  <div class="col-6"><div class="row no-wrap items-center q-gutter-sm"><q-icon name="badge" color="primary" size="20px"/><div class="column"><span class="text-caption text-grey-7">CI</span><span class="text-weight-bold">{{ employee.persona.ci }} {{ employee.persona.expedido?.codigo_expedido || '' }}</span></div></div></div>
                  <div class="col-6"><div class="row no-wrap items-center q-gutter-sm"><q-icon name="person" color="primary" size="20px"/><div class="column"><span class="text-caption text-grey-7">Sexo</span><span class="text-weight-bold">{{ employee.persona.sexo?.sexo || 'N/R' }}</span></div></div></div>
                  <div class="col-6"><div class="row no-wrap items-center q-gutter-sm"><q-icon name="cake" color="primary" size="20px"/><div class="column"><span class="text-caption text-grey-7">Fecha de Nacimiento</span><span class="text-weight-bold">{{ employee.persona.fecha_nacimiento || 'N/R' }}</span></div></div></div>
                  <div class="col-6"><div class="row no-wrap items-center q-gutter-sm"><q-icon name="flag" color="primary" size="20px"/><div class="column"><span class="text-caption text-grey-7">Nacionalidad</span><span class="text-weight-bold">{{ employee.persona.nacionalidad?.gentilicio || 'N/R' }}</span></div></div></div>
                  <div class="col-12"><div class="row no-wrap items-center q-gutter-sm"><q-icon name="location_on" color="primary" size="20px"/><div class="column"><span class="text-caption text-grey-7">Dirección</span><span class="text-weight-bold">{{ employee.persona.direccion_domicilio || 'No especificada' }}</span></div></div></div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="rounded-16 q-mt-md">
                <q-card-section class="q-py-sm row items-center">
                  <q-icon name="security" color="primary" size="sm" class="q-mr-sm" />
                  <div class="text-overline text-primary">Seguridad Social y Beneficios</div>
                </q-card-section>
                <q-card-section class="row q-col-gutter-md">
                   <div class="col-12 col-md-6">
                      <q-input :model-value="employee.caja?.nombre || 'Pendiente'" label="Caja de Salud" readonly dense filled class="rounded-8" />
                   </div>
                   <div class="col-12 col-md-3">
                      <q-input :model-value="employee.nro_matricula_seguro || '—'" label="Matrícula" readonly dense filled class="rounded-8" />
                   </div>
                   <div class="col-12 col-md-6">
                      <q-input :model-value="employee.pensiones?.nombre || 'Pendiente'" label="Entidad Previsional (AFP)" readonly dense filled class="rounded-8" />
                   </div>
                   <div class="col-12 col-md-4">
                      <q-input :model-value="employee.nro_nua_cua || '—'" label="NUA / CUA" readonly dense filled class="rounded-8" />
                   </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-4">
              <q-card flat bordered class="rounded-16">
                <q-card-section class="text-overline text-primary">Contacto</q-card-section>
                <q-card-section class="column q-gutter-sm">
                  <q-item class="bg-page rounded-16"><q-item-section avatar><q-icon name="phone" color="blue"/></q-item-section><q-item-section><q-item-label>{{ employee.persona.celular_personal }}</q-item-label><q-item-label caption>Celular</q-item-label></q-item-section></q-item>
                  <q-item class="bg-page rounded-16"><q-item-section avatar><q-icon name="email" color="purple"/></q-item-section><q-item-section><q-item-label>{{ employee.persona.correo_personal }}</q-item-label><q-item-label caption>Email</q-item-label></q-item-section></q-item>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-tab-panel>

        <!-- CV NORMALIZADO PANEL (SISPO STYLE) -->
        <q-tab-panel name="cv" class="q-pa-none">
          <div class="row q-pa-sm justify-end bg-grey-3" style="border-bottom: 1px solid #ddd;">
            <q-btn color="primary" icon="picture_as_pdf" label="Descargar CV en PDF" @click="downloadCvPdf" :loading="isGeneratingPdf" class="q-mr-md q-my-sm shadow-3" rounded />
          </div>
          <div class="row no-wrap full-width" style="height: calc(100vh - 260px);">
            
            <!-- LEFT: EXPEDIENTE VIEW -->
            <div class="col-12 col-md-7 scroll flex justify-center bg-grey-4 q-pa-lg border-right">
              <div id="expediente-carta" class="reporte-container print-content shadow-2">
                <div class="seccion-reporte text-center q-mb-md">
                  <h1 class="header-title">UNITEPC</h1>
                  <h2 class="header-subtitle">UNIVERSIDAD TÉCNICA PRIVADA COSMOS</h2>
                  <h3 class="header-cv">CURRICULUM VITAE NORMALIZADO</h3>
                  <h4 class="header-selection">{{ employee.contrato_activo?.cargo?.nombre_cargo || 'LEGAJO INSTITUCIONAL' }}</h4>
                </div>

                <!-- PHOTO & LOGO -->
                <div class="seccion-reporte row items-center no-wrap q-mb-lg q-px-md">
                  <div class="col-4 flex justify-start">
                    <img src="/unitepc_escudo.png" style="height: 90px; width: auto;" alt="Escudo" />
                  </div>
                  <div class="col-8 flex items-center justify-end">
                    <div class="row no-wrap items-center q-gutter-md">
                      <div class="text-right">
                        <div class="text-weight-bold" style="font-size: 11px; color: #6A37A3; line-height: 1.2;">
                          FOTOGRAFÍA<br/>PERSONAL:
                        </div>
                        <a v-if="employee.persona.foto" @click="previewFile(employee.persona.foto)" class="text-indigo-8 text-weight-bold cursor-pointer" style="text-decoration: underline; font-size: 9px; text-transform: uppercase;">
                          VER AQUÍ
                        </a>
                      </div>
                      <div class="photo-box-header">
                        <img v-if="employee.persona.foto" :src="getFileUrl(employee.persona.foto)" style="height: 100px; width: 85px; object-fit: cover; border: 1px solid #6A37A3;" />
                        <div v-else class="flex flex-center bg-grey-2" style="height: 100px; width: 85px; border: 1px border #6A37A3;">
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
                      <td class="value text-weight-bold" style="font-size: 14px; color: #6A37A3;">{{ employee.persona.nombres }} {{ employee.persona.primer_apellido }} {{ employee.persona.segundo_apellido }}</td>
                    </tr>
                    <tr>
                      <td class="label">CARGO INSTITUCIONAL:</td>
                      <td class="value text-uppercase text-weight-bold">
                        {{ employee.contrato_activo?.cargo?.nombre_cargo || 'Sin Cargo' }}
                        <span style="color: #6A37A3; margin-left: 5px; font-weight: normal;">({{ employee.contrato_activo?.area?.nombre_area || 'Sin Unidad' }})</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="label">Nº DE CÉDULA DE IDENTIDAD:</td>
                      <td class="value">{{ employee.persona.ci }} {{ employee.persona.ci_expedido?.codigo_expedido || '' }}</td>
                    </tr>
                    <tr>
                      <td class="label">NACIONALIDAD:</td>
                      <td class="value text-uppercase">{{ employee.persona.nacionalidad?.gentilicio || 'N/R' }}</td>
                    </tr>
                    <tr>
                      <td class="label">DIRECCIÓN DE DOMICILIO:</td>
                      <td class="value">{{ employee.persona.direccion_domicilio }}</td>
                    </tr>
                    <tr>
                      <td class="label">TELÉFONO DE CONTACTO:</td>
                      <td class="value">{{ employee.persona.celular_personal }}</td>
                    </tr>
                    <tr>
                      <td class="label">CORREO PERSONAL:</td>
                      <td class="value text-indigo-8" style="text-decoration: underline">{{ employee.persona.correo_personal }}</td>
                    </tr>
                    <tr v-if="employee.correo_institucional">
                      <td class="label">CORREO INSTITUCIONAL:</td>
                      <td class="value text-weight-bold" style="color: #6A37A3;">{{ employee.correo_institucional }}</td>
                    </tr>
                  </table>
                </div>

                <!-- II. FORMACIÓN ACADÉMICA (PREGRADO) -->
                <div class="seccion-reporte q-mb-lg">
                  <div class="section-header">II. FORMACIÓN ACADÉMICA (PREGRADO)</div>
                  <table class="merit-table" v-if="employee.persona.formacion_pregrado?.length > 0">
                    <thead>
                      <tr>
                        <th>Nivel</th>
                        <th>Carrera / Profesión</th>
                        <th>Universidad / Institución</th>
                        <th>Fecha Diploma</th>
                        <th>Fecha Título</th>
                        <th>Departamento</th>
                        <th style="width: 30mm">Comprobante</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in employee.persona.formacion_pregrado" :key="item.id">
                        <td class="text-center text-uppercase">{{ item.nivel || '—' }}</td>
                        <td class="text-center text-uppercase text-weight-bold">{{ item.carrera || '—' }}</td>
                        <td class="text-center text-uppercase">{{ item.institucion || '—' }}</td>
                        <td class="text-center">{{ item.fecha_diploma ? item.fecha_diploma.substring(0,10) : '—' }}</td>
                        <td class="text-center">{{ item.fecha_titulo ? item.fecha_titulo.substring(0,10) : '—' }}</td>
                        <td class="text-center">{{ item.depto?.nombre || '—' }}</td>
                        <td class="text-center">
                          <a v-if="item.archivo_titulo" @click="previewFile(item.archivo_titulo)" class="text-indigo-8 text-weight-bold cursor-pointer" style="text-decoration: underline; font-size: 9px; text-transform: uppercase;">VER TÍTULO</a>
                          <br v-if="item.archivo_titulo && item.archivo_diploma" />
                          <a v-if="item.archivo_diploma" @click="previewFile(item.archivo_diploma)" class="text-indigo-8 text-weight-bold cursor-pointer" style="text-decoration: underline; font-size: 9px; text-transform: uppercase;">VER DIPLOMA</a>
                          <span v-if="!item.archivo_titulo && !item.archivo_diploma">—</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else class="text-center text-grey-7 q-py-sm" style="font-size: 10px; font-style: italic;">Sin registros de formación de pregrado.</div>
                </div>

                <!-- III. FORMACIÓN ACADÉMICA (POSTGRADO) -->
                <div class="seccion-reporte q-mb-lg">
                  <div class="section-header">III. FORMACIÓN ACADÉMICA (POSTGRADO)</div>
                  <table class="merit-table" v-if="employee.persona.formacion_postgrado?.length > 0">
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Programa</th>
                        <th>Institución</th>
                        <th>Fecha Diploma</th>
                        <th>Departamento</th>
                        <th style="width: 30mm">Comprobante</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in employee.persona.formacion_postgrado" :key="item.id">
                        <td class="text-center text-uppercase">{{ item.tipo || '—' }}</td>
                        <td class="text-center text-uppercase text-weight-bold">{{ item.nombre_programa || '—' }}</td>
                        <td class="text-center text-uppercase">{{ item.institucion || '—' }}</td>
                        <td class="text-center">{{ item.fecha_diploma ? item.fecha_diploma.substring(0,10) : '—' }}</td>
                        <td class="text-center">{{ item.depto?.nombre || '—' }}</td>
                        <td class="text-center">
                          <a v-if="item.archivo_respaldo" @click="previewFile(item.archivo_respaldo)" class="text-indigo-8 text-weight-bold cursor-pointer" style="text-decoration: underline; font-size: 9px; text-transform: uppercase;">VER AQUÍ</a>
                          <span v-else>—</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else class="text-center text-grey-7 q-py-sm" style="font-size: 10px; font-style: italic;">Sin registros de formación de postgrado.</div>
                </div>

                <!-- IV. EXPERIENCIA PROFESIONAL -->
                <div class="seccion-reporte q-mb-lg">
                  <div class="section-header">IV. EXPERIENCIA PROFESIONAL</div>
                  <table class="merit-table" v-if="employee.persona.experiencia_profesional?.length > 0">
                    <thead>
                      <tr>
                        <th>Cargo</th>
                        <th>Empresa / Institución</th>
                        <th>Desde - Hasta</th>
                        <th>Departamento</th>
                        <th style="width: 30mm">Comprobante</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in employee.persona.experiencia_profesional" :key="item.id">
                        <td class="text-center text-uppercase text-weight-bold">{{ item.cargo || '—' }}</td>
                        <td class="text-center text-uppercase">{{ item.empresa || '—' }}</td>
                        <td class="text-center">
                          {{ item.fecha_inicio ? item.fecha_inicio.substring(0,10) : '—' }} / 
                          {{ item.fecha_fin ? item.fecha_fin.substring(0,10) : 'Actualidad' }}
                        </td>
                        <td class="text-center">{{ item.depto?.nombre || '—' }}</td>
                        <td class="text-center">
                          <a v-if="item.archivo_respaldo" @click="previewFile(item.archivo_respaldo)" class="text-indigo-8 text-weight-bold cursor-pointer" style="text-decoration: underline; font-size: 9px; text-transform: uppercase;">VER AQUÍ</a>
                          <span v-else>—</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else class="text-center text-grey-7 q-py-sm" style="font-size: 10px; font-style: italic;">Sin registros de experiencia profesional.</div>
                </div>

                <!-- V. EXPERIENCIA DOCENTE -->
                <div class="seccion-reporte q-mb-lg">
                  <div class="section-header">V. EXPERIENCIA DOCENTE</div>
                  <table class="merit-table" v-if="employee.persona.experiencia_docente?.length > 0">
                    <thead>
                      <tr>
                        <th>Institución</th>
                        <th>Carrera</th>
                        <th>Asignaturas</th>
                        <th>Gestión / Periodo</th>
                        <th>Departamento</th>
                        <th style="width: 30mm">Comprobante</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in employee.persona.experiencia_docente" :key="item.id">
                        <td class="text-center text-uppercase text-weight-bold">{{ item.institucion || '—' }}</td>
                        <td class="text-center text-uppercase">{{ item.carrera || '—' }}</td>
                        <td class="text-center text-uppercase" style="text-align: left;">{{ item.asignaturas || '—' }}</td>
                        <td class="text-center">{{ item.gestion_periodo || '—' }}</td>
                        <td class="text-center">{{ item.depto?.nombre || '—' }}</td>
                        <td class="text-center">
                          <a v-if="item.archivo_respaldo" @click="previewFile(item.archivo_respaldo)" class="text-indigo-8 text-weight-bold cursor-pointer" style="text-decoration: underline; font-size: 9px; text-transform: uppercase;">VER AQUÍ</a>
                          <span v-else>—</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else class="text-center text-grey-7 q-py-sm" style="font-size: 10px; font-style: italic;">Sin registros de experiencia docente.</div>
                </div>

                <!-- VI. CAPACITACIONES Y CURSOS -->
                <div class="seccion-reporte q-mb-lg">
                  <div class="section-header">VI. CAPACITACIONES Y CURSOS</div>
                  <table class="merit-table" v-if="employee.persona.capacitaciones?.length > 0">
                    <thead>
                      <tr>
                        <th>Nombre del Evento / Curso</th>
                        <th>Institución</th>
                        <th>Fecha</th>
                        <th>Carga Horaria</th>
                        <th>Departamento</th>
                        <th style="width: 30mm">Comprobante</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in employee.persona.capacitaciones" :key="item.id">
                        <td class="text-center text-uppercase text-weight-bold">{{ item.nombre_curso || '—' }}</td>
                        <td class="text-center text-uppercase">{{ item.institucion || '—' }}</td>
                        <td class="text-center">{{ item.fecha ? item.fecha.substring(0,10) : '—' }}</td>
                        <td class="text-center">{{ item.carga_horaria || 0 }} hrs</td>
                        <td class="text-center">{{ item.depto?.nombre || '—' }}</td>
                        <td class="text-center">
                          <a v-if="item.archivo_respaldo" @click="previewFile(item.archivo_respaldo)" class="text-indigo-8 text-weight-bold cursor-pointer" style="text-decoration: underline; font-size: 9px; text-transform: uppercase;">VER AQUÍ</a>
                          <span v-else>—</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else class="text-center text-grey-7 q-py-sm" style="font-size: 10px; font-style: italic;">Sin registros de capacitaciones y cursos.</div>
                </div>

                <!-- VII. PRODUCCIÓN INTELECTUAL -->
                <div class="seccion-reporte q-mb-lg">
                  <div class="section-header">VII. PRODUCCIÓN INTELECTUAL</div>
                  <table class="merit-table" v-if="employee.persona.produccion_intelectual?.length > 0">
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Título de la Obra</th>
                        <th>Fecha</th>
                        <th>Editorial</th>
                        <th>Departamento</th>
                        <th style="width: 30mm">Comprobante</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in employee.persona.produccion_intelectual" :key="item.id">
                        <td class="text-center text-uppercase">{{ item.tipo || '—' }}</td>
                        <td class="text-center text-uppercase text-weight-bold" style="text-align: left;">{{ item.titulo || '—' }}</td>
                        <td class="text-center">{{ item.fecha ? item.fecha.substring(0,10) : '—' }}</td>
                        <td class="text-center text-uppercase">{{ item.editorial || '—' }}</td>
                        <td class="text-center">{{ item.depto?.nombre || '—' }}</td>
                        <td class="text-center">
                          <a v-if="item.archivo_respaldo" @click="previewFile(item.archivo_respaldo)" class="text-indigo-8 text-weight-bold cursor-pointer" style="text-decoration: underline; font-size: 9px; text-transform: uppercase;">VER AQUÍ</a>
                          <span v-else>—</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else class="text-center text-grey-7 q-py-sm" style="font-size: 10px; font-style: italic;">Sin registros de producción intelectual.</div>
                </div>

                <!-- VIII. RECONOCIMIENTOS Y PREMIOS -->
                <div class="seccion-reporte q-mb-lg">
                  <div class="section-header">VIII. RECONOCIMIENTOS Y PREMIOS</div>
                  <table class="merit-table" v-if="employee.persona.reconocimientos?.length > 0">
                    <thead>
                      <tr>
                        <th>Título del Reconocimiento</th>
                        <th>Institución Otorgante</th>
                        <th>Fecha</th>
                        <th>Lugar</th>
                        <th style="width: 30mm">Comprobante</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in employee.persona.reconocimientos" :key="item.id">
                        <td class="text-center text-uppercase text-weight-bold">{{ item.titulo_premio || '—' }}</td>
                        <td class="text-center text-uppercase">{{ item.institucion_otorgante || '—' }}</td>
                        <td class="text-center">{{ item.fecha ? item.fecha.substring(0,10) : '—' }}</td>
                        <td class="text-center">{{ item.lugar || '—' }}</td>
                        <td class="text-center">
                          <a v-if="item.archivo_respaldo" @click="previewFile(item.archivo_respaldo)" class="text-indigo-8 text-weight-bold cursor-pointer" style="text-decoration: underline; font-size: 9px; text-transform: uppercase;">VER AQUÍ</a>
                          <span v-else>—</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else class="text-center text-grey-7 q-py-sm" style="font-size: 10px; font-style: italic;">Sin registros de reconocimientos y premios.</div>
                </div>

                <!-- IX. IDIOMAS -->
                <div class="seccion-reporte q-mb-lg">
                  <div class="section-header">IX. IDIOMAS</div>
                  <table class="merit-table" v-if="employee.persona.idiomas?.length > 0">
                    <thead>
                      <tr>
                        <th>Idioma</th>
                        <th>Habla</th>
                        <th>Lectura</th>
                        <th>Escritura</th>
                        <th style="width: 30mm">Comprobante</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in employee.persona.idiomas" :key="item.id">
                        <td class="text-center text-uppercase text-weight-bold">{{ item.idioma }}</td>
                        <td class="text-center text-uppercase">{{ item.nivel_habla || '—' }}</td>
                        <td class="text-center text-uppercase">{{ item.nivel_lee || '—' }}</td>
                        <td class="text-center text-uppercase">{{ item.nivel_escritura || '—' }}</td>
                        <td class="text-center">
                          <a v-if="item.archivo_respaldo" @click="previewFile(item.archivo_respaldo)" class="text-indigo-8 text-weight-bold cursor-pointer" style="text-decoration: underline; font-size: 9px; text-transform: uppercase;">VER AQUÍ</a>
                          <span v-else>—</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else class="text-center text-grey-7 q-py-sm" style="font-size: 10px; font-style: italic;">Sin registros de idiomas.</div>
                </div>

                <!-- QR DE VERIFICACIÓN (WEB PREVIEW) -->
                <div class="seccion-reporte q-mt-lg text-center" style="page-break-inside: avoid;">
                  <div style="border: 1px solid #ddd; display: inline-block; padding: 8px;">
                     <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=120x120&color=222222&data=${encodeURIComponent((api.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:8000') + '/api/v1/cv/verificar/' + employee.persona.id)}`" alt="QR Code" style="width: 120px; height: 120px;" />
                  </div>
                  <div class="text-grey-7 q-mt-sm" style="font-size: 9px; text-transform: uppercase;">
                     CÓDIGO QR DE VERIFICACIÓN INSTITUCIONAL<br/>
                     ID DE LEGAJO: {{ employee.persona.id }}
                  </div>
                </div>


                <!-- FOOTER -->
                <div class="seccion-reporte q-mt-xl q-pt-md" style="border-top: 2px solid #6A37A3; text-align: center;">
                  <div class="text-weight-black text-uppercase" style="font-size: 10px; color: #6A37A3; letter-spacing: 2px;">
                    SISTEMA DE GESTIÓN DE TALENTO HUMANO (SIGETH)
                  </div>
                  <div class="text-grey-7 q-mt-xs" style="font-size: 9px;">
                    Documento institucional generado digitalmente. Funcionario ID #{{ employee.id_empleado }} 
                  </div>
                </div>

              </div>
            </div>

            <!-- RIGHT: DOCUMENT PREVIEWER -->
            <div class="col-12 col-md-5 bg-grey-10 flex column no-wrap" style="box-shadow: inset 5px 0 15px rgba(0,0,0,0.5);">
              <div class="q-pa-md row justify-between items-center" style="background: rgba(0,0,0,0.6); border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div class="row items-center q-gutter-sm text-white">
                  <q-icon name="visibility" color="amber-5" size="sm" />
                  <span class="text-weight-bold text-caption text-uppercase" style="letter-spacing: 2px;">Visor de Evidencias</span>
                </div>
                <q-btn v-if="currentFileUrl" flat round dense icon="open_in_new" color="white" size="sm" @click="openFileNewTab" />
              </div>

              <div class="col flex flex-center relative-position overflow-hidden">
                <iframe
                  v-if="currentFileUrl && isPdf(currentFileUrl)"
                  :src="currentFileUrl"
                  class="full-width full-height border-none"
                  style="border: none"
                ></iframe>
                <div v-else-if="currentFileUrl && !isPdf(currentFileUrl)" class="full-width full-height flex flex-center q-pa-md overflow-auto">
                  <img :src="currentFileUrl" class="shadow-10 rounded-borders" style="max-width: 100%; max-height: 100%;" />
                </div>
                <div v-else class="text-center q-pa-xl" style="color: rgba(255,255,255,0.2)">
                  <q-icon name="description" size="8rem" class="q-mb-md opacity-50" />
                  <div class="text-h6 text-weight-bold text-uppercase" style="letter-spacing: 0.2em;">Visor de Evidencias</div>
                  <p class="text-caption q-mt-sm">Haga clic en 'VER AQUÍ' dentro del documento impreso para previsualizarlo.</p>
                </div>
              </div>
            </div>

          </div>
        </q-tab-panel>

        <!-- CONTRACTS PANEL -->
        <q-tab-panel name="contracts" class="q-pa-none q-pt-md">
          <div class="q-pa-md">
            <q-timeline color="primary">
              <q-timeline-entry heading>Historial Laboral - UNITEPC</q-timeline-entry>

              <q-timeline-entry
                v-for="contract in employee.contratos" :key="contract.id_contrato"
                :title="contract.cargo?.nombre_cargo || 'Sin Cargo'"
                :subtitle="contract.fecha_inicio + ' a ' + (contract.fecha_fin || 'Presente')"
                :color="contract.estado_contrato === 'Activo' ? 'positive' : 'grey-7'"
                icon="history_edu"
              >
                <div class="row q-col-gutter-sm">
                   <div class="col-12">
                      <div class="text-subtitle2 text-weight-bold uppercase">{{ contract.tipo?.nombre || 'Contrato' }}</div>
                      <div class="row items-center q-gutter-sm text-grey-7">
                        <q-icon name="apartment" size="xs" />
                        <span>{{ contract.area?.nombre_area || 'Área no especificada' }}</span>
                        <q-icon name="location_on" size="xs" />
                        <span>{{ contract.sede?.nombre || 'Sede no especificada' }}</span>
                      </div>
                      <div class="q-mt-xs row items-center q-gutter-sm">
                        <q-badge color="purple-2" text-color="purple-9" class="q-pa-xs">Salario: {{ contract.salario }} Bs.</q-badge>
                        <q-badge :color="contract.estado_contrato === 'Activo' ? 'green-2' : 'grey-3'" :text-color="contract.estado_contrato === 'Activo' ? 'green-9' : 'grey-8'">{{ contract.estado_contrato }}</q-badge>
                      </div>
                   </div>
                </div>
              </q-timeline-entry>
            </q-timeline>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePersonalStore } from 'stores/personalStore'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const personalStore = usePersonalStore()
const loading = ref(true)
const employee = ref<any>(null)
const tab = ref('info')
const isGeneratingPdf = ref(false)
// View states
const currentFile = ref<string | null>(null)

const getFileUrl = (path: string) => {
  if (!path) return ''
  const baseUrl = api.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:8000'
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
}

const currentFileUrl = computed(() => currentFile.value ? getFileUrl(currentFile.value) : null)

const previewFile = (path: string) => { currentFile.value = path }
const isPdf = (path: string) => path.toLowerCase().endsWith('.pdf')
const openFileNewTab = () => { if (currentFileUrl.value) window.open(currentFileUrl.value, '_blank') }

const downloadCvPdf = async () => {
  if (employee.value && employee.value.persona) {
    try {
      isGeneratingPdf.value = true;
      const response = await api.get(`/v1/talento-humano/cv/${employee.value.persona.id}/descargar`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CV_${employee.value.persona.nombres}_${employee.value.persona.primer_apellido}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CV', error);
      if ($q && $q.notify) $q.notify({ type: 'negative', message: 'Error al generar el CV en PDF' });
    } finally {
      isGeneratingPdf.value = false;
    }
  }
}

onMounted(async () => {
  const id = route.params.id as string
  employee.value = await personalStore.fetchEmployeeById(id)
  loading.value = false
})
</script>

<style lang="scss" scoped>
.profile-container { max-width: 1400px; margin: 0 auto; }
.profile-header {
  border-radius: 20px;
  background: linear-gradient(135deg, #6A37A3 0%, #4a2775 100%);
}
.rounded-16 { border-radius: 16px; }
.bg-page { background: #f8f9fa; }
.animate-fade { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Estilos de CV Normalizado (Clon de SISPO) */
.border-right { border-right: 1px solid #ddd; }
.reporte-container {
  background: white;
  width: 259mm;
  padding: 15mm;
  margin: 0 auto;
  font-family: 'Times New Roman', Times, serif;
  color: #000;
}
.seccion-reporte { width: 100%; }
.header-title { font-size: 42px; font-weight: 800; margin: 0; line-height: 1; }
.header-subtitle { font-size: 24px; font-weight: 700; margin: 0; }
.header-cv { font-size: 18px; font-weight: 700; margin: 10px 0 0 0; }
.header-selection { font-size: 18px; font-weight: 700; color: #6A37A3; margin: 0; }
.section-header { 
  background: transparent; color: #000; font-size: 16px; font-weight: 900; 
  border-bottom: none; padding: 5px 0; text-transform: uppercase; 
}
.data-table, .merit-table { width: 100%; border-collapse: collapse; border: 2px solid #6A37A3; }
.data-table td, .merit-table td { padding: 6px 12px; border: 1px solid #6A37A3; font-size: 12px; }
.merit-table th { 
  background-color: #f3efff; color: #6A37A3; font-weight: 900; font-size: 10px; 
  padding: 8px 4px; border: 1px solid #6A37A3; text-transform: uppercase; 
}
.data-table .label { 
  width: 35%; font-weight: 900; color: #6A37A3; text-align: right; background-color: #f3efff; 
}
.photo-box-header { border: 1px solid #6A37A3; padding: 2px; background: white; width: auto; display: inline-block; }
.scroll::-webkit-scrollbar { width: 8px; }
.scroll::-webkit-scrollbar-track { background: #f1f1f1; }
.scroll::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
.scroll::-webkit-scrollbar-thumb:hover { background: #555; }
</style>
