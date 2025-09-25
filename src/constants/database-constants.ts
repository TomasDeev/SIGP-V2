/**
 * SIGP Database Constants
 * Constantes para estandarizar valores de base de datos
 */

// ============================================================================
// ESTADOS DE PRÉSTAMOS
// ============================================================================

export const ESTADOS_PRESTAMO = {
  ACTIVO: 1,
  PAGADO: 2,
  VENCIDO: 3,
  CANCELADO: 4,
  EN_LEGAL: 5,
  CASTIGADO: 6
} as const;

export const ESTADOS_PRESTAMO_LABELS = {
  [ESTADOS_PRESTAMO.ACTIVO]: 'Activo',
  [ESTADOS_PRESTAMO.PAGADO]: 'Pagado',
  [ESTADOS_PRESTAMO.VENCIDO]: 'Vencido',
  [ESTADOS_PRESTAMO.CANCELADO]: 'Cancelado',
  [ESTADOS_PRESTAMO.EN_LEGAL]: 'En Legal',
  [ESTADOS_PRESTAMO.CASTIGADO]: 'Castigado'
} as const;

// ============================================================================
// ESTADOS CIVILES
// ============================================================================

export const ESTADOS_CIVILES = {
  SOLTERO: 1,
  CASADO: 2,
  DIVORCIADO: 3,
  VIUDO: 4,
  UNION_LIBRE: 5
} as const;

export const ESTADOS_CIVILES_LABELS = {
  [ESTADOS_CIVILES.SOLTERO]: 'Soltero/a',
  [ESTADOS_CIVILES.CASADO]: 'Casado/a',
  [ESTADOS_CIVILES.DIVORCIADO]: 'Divorciado/a',
  [ESTADOS_CIVILES.VIUDO]: 'Viudo/a',
  [ESTADOS_CIVILES.UNION_LIBRE]: 'Unión Libre'
} as const;

// ============================================================================
// TIPOS DE DOCUMENTO
// ============================================================================

export const TIPOS_DOCUMENTO = {
  CEDULA: 1,
  PASAPORTE: 2,
  LICENCIA: 3,
  CARNET_EXTRANJERO: 4
} as const;

export const TIPOS_DOCUMENTO_LABELS = {
  [TIPOS_DOCUMENTO.CEDULA]: 'Cédula',
  [TIPOS_DOCUMENTO.PASAPORTE]: 'Pasaporte',
  [TIPOS_DOCUMENTO.LICENCIA]: 'Licencia',
  [TIPOS_DOCUMENTO.CARNET_EXTRANJERO]: 'Carnet de Extranjero'
} as const;

// ============================================================================
// SEXOS
// ============================================================================

export const SEXOS = {
  MASCULINO: 'M',
  FEMENINO: 'F'
} as const;

export const SEXOS_LABELS = {
  [SEXOS.MASCULINO]: 'Masculino',
  [SEXOS.FEMENINO]: 'Femenino'
} as const;

// ============================================================================
// MONEDAS
// ============================================================================

export const MONEDAS = {
  PESO_DOMINICANO: 1,
  DOLAR: 2,
  EURO: 3
} as const;

export const MONEDAS_LABELS = {
  [MONEDAS.PESO_DOMINICANO]: 'Peso Dominicano (DOP)',
  [MONEDAS.DOLAR]: 'Dólar Americano (USD)',
  [MONEDAS.EURO]: 'Euro (EUR)'
} as const;

export const MONEDAS_SIMBOLOS = {
  [MONEDAS.PESO_DOMINICANO]: 'RD$',
  [MONEDAS.DOLAR]: 'US$',
  [MONEDAS.EURO]: '€'
} as const;

// ============================================================================
// TIPOS DE GARANTÍA
// ============================================================================

export const TIPOS_GARANTIA = {
  VEHICULO: 1,
  INMUEBLE: 2,
  OTROS: 3,
  FIADOR: 4,
  HIPOTECA: 5
} as const;

export const TIPOS_GARANTIA_LABELS = {
  [TIPOS_GARANTIA.VEHICULO]: 'Vehículo',
  [TIPOS_GARANTIA.INMUEBLE]: 'Inmueble',
  [TIPOS_GARANTIA.OTROS]: 'Otros',
  [TIPOS_GARANTIA.FIADOR]: 'Fiador',
  [TIPOS_GARANTIA.HIPOTECA]: 'Hipoteca'
} as const;

// ============================================================================
// TIPOS DE PRÉSTAMO
// ============================================================================

export const TIPOS_PRESTAMO = {
  PERSONAL: 1,
  VEHICULAR: 2,
  HIPOTECARIO: 3,
  COMERCIAL: 4,
  MICROEMPRESA: 5
} as const;

export const TIPOS_PRESTAMO_LABELS = {
  [TIPOS_PRESTAMO.PERSONAL]: 'Personal',
  [TIPOS_PRESTAMO.VEHICULAR]: 'Vehicular',
  [TIPOS_PRESTAMO.HIPOTECARIO]: 'Hipotecario',
  [TIPOS_PRESTAMO.COMERCIAL]: 'Comercial',
  [TIPOS_PRESTAMO.MICROEMPRESA]: 'Microempresa'
} as const;

// ============================================================================
// CLASES DE PRÉSTAMO
// ============================================================================

export const CLASES_PRESTAMO = {
  NORMAL: 1,
  ESPECIAL_MENCION: 2,
  SUBNORMAL: 3,
  DUDOSO: 4,
  IRRECUPERABLE: 5
} as const;

export const CLASES_PRESTAMO_LABELS = {
  [CLASES_PRESTAMO.NORMAL]: 'Normal',
  [CLASES_PRESTAMO.ESPECIAL_MENCION]: 'Especial Mención',
  [CLASES_PRESTAMO.SUBNORMAL]: 'Subnormal',
  [CLASES_PRESTAMO.DUDOSO]: 'Dudoso',
  [CLASES_PRESTAMO.IRRECUPERABLE]: 'Irrecuperable'
} as const;

// ============================================================================
// FRECUENCIAS DE PAGO
// ============================================================================

export const FRECUENCIAS_PAGO = {
  SEMANAL: 7,
  QUINCENAL: 15,
  MENSUAL: 30,
  BIMESTRAL: 60,
  TRIMESTRAL: 90,
  SEMESTRAL: 180,
  ANUAL: 365
} as const;

export const FRECUENCIAS_PAGO_LABELS = {
  [FRECUENCIAS_PAGO.SEMANAL]: 'Semanal',
  [FRECUENCIAS_PAGO.QUINCENAL]: 'Quincenal',
  [FRECUENCIAS_PAGO.MENSUAL]: 'Mensual',
  [FRECUENCIAS_PAGO.BIMESTRAL]: 'Bimestral',
  [FRECUENCIAS_PAGO.TRIMESTRAL]: 'Trimestral',
  [FRECUENCIAS_PAGO.SEMESTRAL]: 'Semestral',
  [FRECUENCIAS_PAGO.ANUAL]: 'Anual'
} as const;

// ============================================================================
// OCUPACIONES
// ============================================================================

export const OCUPACIONES = {
  EMPLEADO_PUBLICO: 1,
  EMPLEADO_PRIVADO: 2,
  INDEPENDIENTE: 3,
  EMPRESARIO: 4,
  ESTUDIANTE: 5,
  JUBILADO: 6,
  AMA_DE_CASA: 7,
  DESEMPLEADO: 8
} as const;

export const OCUPACIONES_LABELS = {
  [OCUPACIONES.EMPLEADO_PUBLICO]: 'Empleado Público',
  [OCUPACIONES.EMPLEADO_PRIVADO]: 'Empleado Privado',
  [OCUPACIONES.INDEPENDIENTE]: 'Independiente',
  [OCUPACIONES.EMPRESARIO]: 'Empresario',
  [OCUPACIONES.ESTUDIANTE]: 'Estudiante',
  [OCUPACIONES.JUBILADO]: 'Jubilado',
  [OCUPACIONES.AMA_DE_CASA]: 'Ama de Casa',
  [OCUPACIONES.DESEMPLEADO]: 'Desempleado'
} as const;

// ============================================================================
// TIPOS DE RESIDENCIA
// ============================================================================

export const TIPOS_RESIDENCIA = {
  PROPIA: 1,
  ALQUILADA: 2,
  FAMILIAR: 3,
  PRESTADA: 4,
  OTROS: 5
} as const;

export const TIPOS_RESIDENCIA_LABELS = {
  [TIPOS_RESIDENCIA.PROPIA]: 'Propia',
  [TIPOS_RESIDENCIA.ALQUILADA]: 'Alquilada',
  [TIPOS_RESIDENCIA.FAMILIAR]: 'Familiar',
  [TIPOS_RESIDENCIA.PRESTADA]: 'Prestada',
  [TIPOS_RESIDENCIA.OTROS]: 'Otros'
} as const;

// ============================================================================
// TIPOS DE EMPRESA DE SERVICIO
// ============================================================================

export const TIPOS_EMPRESA_SERVICIO = {
  VERIFICACION_LABORAL: 1,
  VERIFICACION_RESIDENCIAL: 2,
  COBRANZA: 3,
  LEGAL: 4,
  TASACION: 5,
  SEGURO: 6
} as const;

export const TIPOS_EMPRESA_SERVICIO_LABELS = {
  [TIPOS_EMPRESA_SERVICIO.VERIFICACION_LABORAL]: 'Verificación Laboral',
  [TIPOS_EMPRESA_SERVICIO.VERIFICACION_RESIDENCIAL]: 'Verificación Residencial',
  [TIPOS_EMPRESA_SERVICIO.COBRANZA]: 'Cobranza',
  [TIPOS_EMPRESA_SERVICIO.LEGAL]: 'Legal',
  [TIPOS_EMPRESA_SERVICIO.TASACION]: 'Tasación',
  [TIPOS_EMPRESA_SERVICIO.SEGURO]: 'Seguro'
} as const;

// ============================================================================
// TIPOS DE PROCESO LEGAL
// ============================================================================

export const TIPOS_PROCESO_LEGAL = {
  INTIMACION: 1,
  DEMANDA: 2,
  EMBARGO: 3,
  REMATE: 4,
  SENTENCIA: 5
} as const;

export const TIPOS_PROCESO_LEGAL_LABELS = {
  [TIPOS_PROCESO_LEGAL.INTIMACION]: 'Intimación',
  [TIPOS_PROCESO_LEGAL.DEMANDA]: 'Demanda',
  [TIPOS_PROCESO_LEGAL.EMBARGO]: 'Embargo',
  [TIPOS_PROCESO_LEGAL.REMATE]: 'Remate',
  [TIPOS_PROCESO_LEGAL.SENTENCIA]: 'Sentencia'
} as const;

// ============================================================================
// TIPOS DE MOVIMIENTO
// ============================================================================

export const TIPOS_MOVIMIENTO = {
  DESEMBOLSO: 1,
  PAGO: 2,
  CARGO_MORA: 3,
  CARGO_SEGURO: 4,
  CARGO_GPS: 5,
  DESCUENTO: 6,
  REVERSO: 7,
  AJUSTE: 8
} as const;

export const TIPOS_MOVIMIENTO_LABELS = {
  [TIPOS_MOVIMIENTO.DESEMBOLSO]: 'Desembolso',
  [TIPOS_MOVIMIENTO.PAGO]: 'Pago',
  [TIPOS_MOVIMIENTO.CARGO_MORA]: 'Cargo por Mora',
  [TIPOS_MOVIMIENTO.CARGO_SEGURO]: 'Cargo de Seguro',
  [TIPOS_MOVIMIENTO.CARGO_GPS]: 'Cargo GPS',
  [TIPOS_MOVIMIENTO.DESCUENTO]: 'Descuento',
  [TIPOS_MOVIMIENTO.REVERSO]: 'Reverso',
  [TIPOS_MOVIMIENTO.AJUSTE]: 'Ajuste'
} as const;

// ============================================================================
// TIPOS DE DEPÓSITO
// ============================================================================

export const TIPOS_DEPOSITO = {
  EFECTIVO: 1,
  CHEQUE: 2,
  TRANSFERENCIA: 3,
  MIXTO: 4
} as const;

export const TIPOS_DEPOSITO_LABELS = {
  [TIPOS_DEPOSITO.EFECTIVO]: 'Efectivo',
  [TIPOS_DEPOSITO.CHEQUE]: 'Cheque',
  [TIPOS_DEPOSITO.TRANSFERENCIA]: 'Transferencia',
  [TIPOS_DEPOSITO.MIXTO]: 'Mixto'
} as const;

// ============================================================================
// LÍMITES Y CONFIGURACIONES
// ============================================================================

export const LIMITES = {
  MAX_TASA_INTERES: 0.60, // 60% anual
  MIN_TASA_INTERES: 0.01, // 1% anual
  MAX_TASA_MORA: 0.10, // 10% mensual
  MIN_TASA_MORA: 0.001, // 0.1% mensual
  MAX_CUOTAS: 360, // 30 años
  MIN_CUOTAS: 1,
  MAX_MONTO_PRESTAMO: 50000000, // 50 millones
  MIN_MONTO_PRESTAMO: 1000, // 1,000 pesos
  MAX_DIAS_GRACIA_MORA: 30,
  MIN_DIAS_GRACIA_MORA: 0
} as const;

// ============================================================================
// PREFIJOS ESTÁNDAR
// ============================================================================

export const PREFIJOS = {
  PRESTAMO: 'P-',
  CUENTA: 'C-',
  RECIBO: 'R-',
  FACTURA: 'F-',
  DEPOSITO: 'D-'
} as const;

// ============================================================================
// PATRONES DE VALIDACIÓN
// ============================================================================

export const PATRONES = {
  RNC: /^[0-9]{9}$|^[0-9]{11}$/,
  CEDULA: /^[0-9]{3}-?[0-9]{7}-?[0-9]{1}$/,
  TELEFONO: /^[0-9]{3}-?[0-9]{3}-?[0-9]{4}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PLACA: /^[A-Z]{1}[0-9]{6}$|^[A-Z]{2}[0-9]{5}$/,
  CODIGO_POSTAL: /^[0-9]{5}$/
} as const;

// ============================================================================
// MENSAJES DE ERROR ESTÁNDAR
// ============================================================================

export const MENSAJES_ERROR = {
  RNC_INVALIDO: 'El RNC debe tener 9 u 11 dígitos',
  CEDULA_INVALIDA: 'La cédula debe tener el formato XXX-XXXXXXX-X',
  EMAIL_INVALIDO: 'El formato del email no es válido',
  TELEFONO_INVALIDO: 'El teléfono debe tener el formato XXX-XXX-XXXX',
  MONTO_INVALIDO: 'El monto debe ser mayor a cero',
  TASA_INVALIDA: 'La tasa debe estar entre 0.1% y 60%',
  CUOTAS_INVALIDAS: 'Las cuotas deben estar entre 1 y 360',
  FECHA_INVALIDA: 'La fecha no es válida',
  CAMPO_REQUERIDO: 'Este campo es requerido',
  REGISTRO_NO_ENCONTRADO: 'Registro no encontrado',
  ACCESO_DENEGADO: 'No tiene permisos para realizar esta acción',
  ERROR_CONEXION: 'Error de conexión con la base de datos'
} as const;

// ============================================================================
// CONFIGURACIONES DE PAGINACIÓN
// ============================================================================

export const PAGINACION = {
  TAMAÑO_PAGINA_DEFAULT: 20,
  TAMAÑO_PAGINA_MAX: 100,
  TAMAÑO_PAGINA_MIN: 5,
  OPCIONES_TAMAÑO: [10, 20, 50, 100]
} as const;

// ============================================================================
// CONFIGURACIONES DE FORMATO
// ============================================================================

export const FORMATOS = {
  FECHA: 'DD/MM/YYYY',
  FECHA_HORA: 'DD/MM/YYYY HH:mm',
  MONEDA_DECIMALES: 2,
  TASA_DECIMALES: 4,
  PORCENTAJE_DECIMALES: 2
} as const;