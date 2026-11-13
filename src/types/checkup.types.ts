// ==========================================
// 1. Taggeo y Prospecto
// ==========================================
export interface TaggeoReporte {
  idParticipante?: string;
  canal?: string;
  perfil?: string;
  plataforma?: string;
  correoProspecto?: string;
  nombreProspecto?: string;
}

export interface ProspectoCuestionarioDto {
  idProspecto: string;
  idAsignacion?: string;
  idCuestionario?: string;
}

// ==========================================
// 2. Headers y Estatus General
// ==========================================
export interface ReporteHeaders {
  titulo: string;
  subtitulo: string;
  urlImgFondo?: string;
  urlImgLogo?: string;
}

export interface EstatusDetalle {
  nombre: string;
  urlImgEstatus?: string;
}

export interface EstatusSalud {
  fraseEstatusSalud?: string;
  fraseEstatusAgente?: string;
  tipoRadar?: number;
  procentajeRedondeado?: number;
  procentaje: number;
  color?: string;
  estatus: EstatusDetalle;
}

// ==========================================
// 3. Intermediario y Cliente
// ==========================================
export interface Intermediario {
  etiquetaIntermediario?: string;
  nombreIntermediario: string;
  cedula?: string;
  fechaAnalisis: string | Date;
}

export interface InfoPersonalCliente {
  nombre: string;
  sexo: string;
  edad: string | number;
  direccion?: string;
  codigoPostal?: string;
}

export interface ContactoCliente {
  celular?: string;
  correo?: string;
  direccion?: string;
}

export interface ConyugeCliente {
  estadiCivil?: string;
  edad?: string | number;
  genero?: string;
}

export interface HijoCliente {
  edad?: string | number;
  genero?: string;
}

export interface EstiloVidaCliente {
  enfermedadesPadecimientos?: string;
  ejercicioDeporte?: string;
}

export interface ClienteReporte {
  infoPersonal: InfoPersonalCliente;
  contacto?: ContactoCliente;
  conyuge?: ConyugeCliente;
  hijos?: HijoCliente[];
  estiloVida?: EstiloVidaCliente;
}

// ==========================================
// 4. Indicadores Destacados y Nivel Protección
// ==========================================
export interface IndicadorDestacadoItem {
  nombreIndicador: string;
  valor: string;
  cveIndcador?: number;
  indicador?: number;
}

export interface IndicadoresDestacados {
  indDestacados: IndicadorDestacadoItem[];
}

export interface IndicadorProteccionItem {
  clave: string;
  nombre: string;
  valor: number;
}

export interface NivelProteccion {
  indicadoresProteccion: IndicadorProteccionItem[];
  urlAvatar?: string;
}

// ==========================================
// 5. Comparativa de Perfil
// ==========================================
export interface ComparativaIndPerfil {
  valorComparativa: number;
  totalComparativa: number;
  tituloComparativa: string;
  descripcionComparativa: string;
}

export interface ComparativaIndicadorItem {
  tipoIndicador: string;
  porcentajeGrafica?: number;
  descripcion: string;
  valor?: string;
  valorIndicador?: number;
}

export interface ComparativaPerfil {
  comparativaIndPerfil: ComparativaIndPerfil;
  comparativasIndicadores: ComparativaIndicadorItem[];
  perfilSimilar: string;
}

// ==========================================
// 6. Recomendaciones y Estadísticas
// ==========================================
export interface RecomendacionesReporte {
  tituloRecomenacion: string;
  recomenadciones: string[];
}

export interface DetalleEstadisticaItem {
  nombreEstadistica: string;
  descripcion?: string;
  valor?: string;
  valorGrafica?: number;
  valorIndicador?: number;
}

export interface EstadisticasReporte {
  tituloDescripcion: string;
  detalleEstadisiticas: DetalleEstadisticaItem[];
  fuentesInformacion?: string;
}

export interface DespedidaReporte {
  despedidaAutomatica?: boolean;
  mensaje: string;
}

// ==========================================
// 7. Gráficas Dinámicas (indGraficos)
// ==========================================
export interface GraficaDatoItem {
  clave: string;
  valor: number;
}

export interface TipoDatoGrafica {
  claveTipoDatoGrafica: string;
  nombreTipoDatoGrafica: string;
  tituloGrafica: string;
  datos: GraficaDatoItem[];
}

export interface SubGraficaItem {
  claveSubGrafica: string;
  nombreSubGrafica: string;
  tipoDato: TipoDatoGrafica[];
}

export interface GraficaPrincipalItem {
  claveTipoGraficoEst: string;
  nombreTipoGraficoEst: string;
  estiloGrafica?: string;
  subGrafica: SubGraficaItem[];
}

export interface IndicadorGraficoContenedor {
  grafica: GraficaPrincipalItem[];
}

// ==========================================
// 8. Seguros y Pólizas
// ==========================================
export interface SeguroContratadoItem {
  valorRespuesta: string;
  numeroPolizas?: string | number;
  sumaAsegurada?: string | number;
  seleccionado: boolean;
}


// ==========================================
// 9. Riesgos Locales y Vehicular/Hogar
// ==========================================
export interface NivelRiesgoUbicacion {
  idNivelRiesgo: string;
  estadosRepublicaMexicana: string;
  nombreNivelRiesgo: string;
}

export interface TipoRiesgoLocalidad {
  idTipoRiesgo: string;
  nombreTipoRiesgo: string;
  fraseTipoRiesgo: string;
  activo: boolean;
  idAdminReporte?: string;
  nivelRiesgos: NivelRiesgoUbicacion[];
}

export interface DetalleRiesgoVehicular {
  estado: string | null;
  marca: string | null;
  submarca: string | null;
  nivelRiesgo: string | null;
  idCuestionario: string | null;
  idProspecto: string | null;
  idAsignacion: string | null;
  idPregunta: string | null;
  porcentajeNivelRiesgo: number | null;
}

export interface RiesgosRoboDanios {
  robo: DetalleRiesgoVehicular;
  danios: DetalleRiesgoVehicular;
}

// ==========================================
// 10. PAYLOAD PRINCIPAL DEL CHECKUP
// ==========================================
export interface CheckupPayloadGNP {
  taggeo?: TaggeoReporte;
  headers: ReporteHeaders;
  estatusSaud: EstatusSalud;
  intermediario: Intermediario;
  cliente: ClienteReporte;
  indDestacados: IndicadoresDestacados;
  nivelProteccion: NivelProteccion;
  comparativaPerfil: ComparativaPerfil;
  recomendaciones: RecomendacionesReporte;
  estadisticas: EstadisticasReporte;
  despedida?: DespedidaReporte;
  descargarReporte?: boolean;
  indGraficos: IndicadorGraficoContenedor[];
  segurosContratadosPorTuEmpresa: SeguroContratadoItem[];
  segurosContratadosPorTuCuenta: SeguroContratadoItem[];
  tipoRiesgo: TipoRiesgoLocalidad[];
  riesgosRoboDanios?: RiesgosRoboDanios;
  prospectoCuestionarioDto?: ProspectoCuestionarioDto;
}