/**
 * SIGP Database Types
 * Tipos TypeScript generados desde el esquema de base de datos
 * Última actualización: $(Get-Date)
 */

// ============================================================================
// TIPOS BASE
// ============================================================================

export type UUID = string;
export type Timestamp = string; // ISO 8601 timestamp
export type Decimal = number;

// ============================================================================
// ENUMS Y CONSTANTES
// ============================================================================

export enum EstadoPrestamo {
  ACTIVO = 1,
  PAGADO = 2,
  VENCIDO = 3,
  CANCELADO = 4,
  EN_LEGAL = 5
}

export enum EstadoCivil {
  SOLTERO = 1,
  CASADO = 2,
  DIVORCIADO = 3,
  VIUDO = 4,
  UNION_LIBRE = 5
}

export enum TipoDocumento {
  CEDULA = 1,
  PASAPORTE = 2,
  LICENCIA = 3
}

export enum Moneda {
  PESO_DOMINICANO = 1,
  DOLAR = 2,
  EURO = 3
}

export enum Sexo {
  MASCULINO = 'M',
  FEMENINO = 'F'
}

export enum GarantiaTipo {
  VEHICULO = 1,
  INMUEBLE = 2,
  OTROS = 3
}

// ============================================================================
// INTERFACES PRINCIPALES
// ============================================================================

export interface Empresa {
  IdEmpresa: number;
  FechaCreacion: Timestamp;
  RazonSocial: string;
  NombreComercial: string;
  RNC: string;
  Direccion: string;
  Telefono?: string;
  Presidente: string;
  CedulaPresidente: string;
  Abogado: string;
  EstadoCivilAbogado: EstadoCivil;
  CedulaAbogado: string;
  DireccionAbogado: string;
  Alguacil: string;
  Tasa: Decimal;
  Mora: Decimal;
  Cuotas: number;
  GastoCierre: Decimal;
  UrlLogo: string;
  Banco: string;
  NoCuenta: string;
  RegID: UUID;
  Activo: boolean;
  Penalidad: Decimal;
  MaxAbonoSobreCapital: Decimal;
  MinAbonoSobreCapital: Decimal;
  ApiKey: UUID;
  AutoAsignarNcf: boolean;
  EcfApikey?: string;
  EmailEmpresa?: string;
  CertificacionDgii: boolean;
  FechaCertificacion?: Timestamp;
}

export interface Cartera {
  IdCartera: number;
  IdEmpresa: number;
  FechaCreacion: Timestamp;
  RazonSocial: string;
  NombreComercial: string;
  NombreParaMostrar?: string;
  RNC: string;
  Direccion: string;
  Telefono?: string;
  Presidente: string;
  CedulaPresidente: string;
  Abogado: string;
  EstadoCivilAbogado: EstadoCivil;
  CedulaAbogado: string;
  DireccionAbogado: string;
  Alguacil: string;
  Tasa: Decimal;
  Mora: Decimal;
  Cuotas: number;
  GastoCierre: Decimal;
  UrlLogo: string;
  ContadorCuentas: number;
  ContadorPrestamos: number;
  ContadorRecibos: number;
  SufijoCartera: string;
  Banco: string;
  NoCuenta: string;
  RegID: UUID;
  PorcientoPagoMinimo: Decimal;
  Penalidad: Decimal;
  MaxAbonoSobreCapital: Decimal;
  MinAbonoSobreCapital: Decimal;
  Activo: boolean;
}

export interface Usuario {
  IdUsuario: number;
  UserId: UUID; // Supabase Auth ID
  Nombre?: string;
  Direccion?: string;
  Telefono?: string;
  IdCartera: number;
  CarteraPrincipal?: string;
  CajaAbierta: boolean;
  HoraInicio: number;
  HoraFinal: number;
  DiasSemanas: string;
  HorarioSemanal: string;
  FechaExpiracionClave: Timestamp;
  RegID: UUID;
  IdPerfil?: number;
}

export interface Cuenta {
  IdCuenta: number;
  IdCartera: number;
  Codigo: string; // Computed: Prefijo + CuentaNo
  Prefijo: string;
  CuentaNo: number;
  EstaEnListaNegra: boolean;
  UsuarioId: number;
  Nombres: string;
  Apellidos: string;
  Apodo?: string;
  Identificacion: string;
  FechaNacimiento: Timestamp;
  Sexo: Sexo;
  Correo?: string;
  EstadoCivil: Sexo;
  NombreConyugue?: string;
  IdentificacionConyugue?: string;
  Empresa?: string;
  DireccionEmpresa?: string;
  Cargo?: string;
  NombreJefe?: string;
  CantidadHijos: number;
  AceptarCheque: boolean;
  Bloqueado: boolean;
  BloquearCobro: boolean;
  Descontar: boolean;
  Nacionalidad: string;
  Ingresos: Decimal;
  TipoDocumento: TipoDocumento;
  Profesion?: string;
  Ocupacion: number;
  TipoRecidencia: number;
  LugarTrabajoConyugue?: string;
  DireccionLugarTrabajoConyugue?: string;
  TelefonoTrabajoConyugue?: string;
  CelularConyugue?: string;
  RegID: UUID;
}

export interface Prestamo {
  IdPrestamo: number;
  Referencia?: string;
  Codigo: string; // Computed: Prefijo + PrestamoNo
  Prefijo: string;
  PrestamoNo: number;
  IdCartera: number;
  UsuarioId: number;
  IdCuenta: number;
  IdFiador: number;
  IdTipoPrestamo: number;
  IdClasePrestamo: number;
  Riesgo: number;
  FechaCreacion: Timestamp;
  FechaPrimerPago: Timestamp;
  CapitalPrestado: Decimal;
  Interes: Decimal;
  InteresMora: Decimal;
  FrecuenciaPago: number;
  Cuotas: number;
  DiasGraciaMora: number;
  TasaDescuento: Decimal;
  DiasAnticipadoDescuento: number;
  IdEstado: EstadoPrestamo;
  GastoCierre: Decimal;
  GastoSeguro: Decimal;
  GastoSeguroEnCuotas: number;
  EnviarBuro: boolean;
  MontoSan: Decimal;
  EnLegal: boolean;
  IdRepresentante: number;
  Ingresos: Decimal;
  IngresosOtros: Decimal;
  Gastos: Decimal;
  Castigada: boolean;
  NotasDepuracion?: string;
  Moneda: Moneda;
  NombreFiador?: string;
  CedulaFiador?: string;
  DireccionFiador?: string;
  TelefonoFiador?: string;
  ComoPagaraPrestamo?: string;
  RequisitoDeLaSolicitud: number;
  EnviarLegal: boolean;
  PagarGastoSeguroDesde: number;
  MontoVenta?: Decimal;
  FechaVenda?: Timestamp;
  CapitalVenta?: Decimal;
  BalanceVenta?: Decimal;
  RegID: UUID;
  GastoGps: Decimal;
  GastoGpsEnCuotas: number;
  PagarGastoGpsDesde: number;
  Penalidad: Decimal;
  MaxAbonoSobreCapital: Decimal;
  AccesoAppMobile: boolean;
  NumeroSEGM?: string;
  TipoComprobante?: number;
}

export interface Amortizacion {
  IdAmortizacion: number;
  IdPrestamo: number;
  OrdenPago: number;
  Vencimiento: Timestamp;
  GastoCierre: Decimal;
  Seguro: Decimal;
  Interes: Decimal;
  InteresMora: Decimal;
  Capital: Decimal;
  GastoCierreAcumulado: Decimal;
  SeguroAcumulado: Decimal;
  InteresAcumulado: Decimal;
  CapitalAcumulado: Decimal;
  MoraAcumulado: Decimal;
  DiasGraciaMora: number;
  DetenerMora: boolean;
  Frecuencia: number;
  FechaFinMora?: Timestamp;
  PagoFecha?: Timestamp;
  Mora: Decimal;
  RegID: UUID;
  Gps: Decimal;
  GpsAcumulado: Decimal;
}

export interface Garantia {
  IdGarantia: number;
  IdPrestamo: number;
  GarantiaTipo: GarantiaTipo;
  Placa?: string;
  Matricula?: string;
  FechaMatricula?: Timestamp;
  IdModelo: number;
  Pasajeros?: number;
  Color?: string;
  FabricacionFecha?: number;
  NumeroMotor?: string;
  NumeroChasis?: string;
  PlacaAnterior?: string;
  IdAseguradora: number;
  NumeroPoliza?: string;
  CreacionSeguro?: Timestamp;
  VencimientoSeguro?: Timestamp;
  SeguroEndozadoA?: string;
  NumeroLocalizadorSeguridad?: string;
  VencimientoLocalizador?: Timestamp;
  Descripcion?: string;
  GPS?: string;
  NombreAseguradora?: string;
  NombreModelo?: string;
  NombreMarca?: string;
  Tipo?: string;
  Estilo?: string;
  FotoFrente?: string;
  FotoTrasero?: string;
  FotoDerecha?: string;
  FotoIzquierda?: string;
  IdVehiculoEstilo: number;
  IdVehiculoTipo: number;
  ValorGarantia: Decimal;
  IdGPS: number;
  RegID: UUID;
  DescripcionResumida: string; // Computed
  DescripcionDetallada: string; // Computed
}

// ============================================================================
// TIPOS DE INSERCIÓN (SIN CAMPOS AUTOGENERADOS)
// ============================================================================

export type EmpresaInsert = Omit<Empresa, 'IdEmpresa' | 'FechaCreacion' | 'RegID' | 'ApiKey'>;
export type CarteraInsert = Omit<Cartera, 'IdCartera' | 'FechaCreacion' | 'RegID'>;
export type UsuarioInsert = Omit<Usuario, 'IdUsuario' | 'RegID'>;
export type CuentaInsert = Omit<Cuenta, 'IdCuenta' | 'Codigo' | 'RegID'>;
export type PrestamoInsert = Omit<Prestamo, 'IdPrestamo' | 'Codigo' | 'FechaCreacion' | 'RegID'>;
export type AmortizacionInsert = Omit<Amortizacion, 'IdAmortizacion' | 'RegID'>;
export type GarantiaInsert = Omit<Garantia, 'IdGarantia' | 'RegID' | 'DescripcionResumida' | 'DescripcionDetallada'>;

// ============================================================================
// TIPOS DE ACTUALIZACIÓN (TODOS LOS CAMPOS OPCIONALES)
// ============================================================================

export type EmpresaUpdate = Partial<EmpresaInsert>;
export type CarteraUpdate = Partial<CarteraInsert>;
export type UsuarioUpdate = Partial<UsuarioInsert>;
export type CuentaUpdate = Partial<CuentaInsert>;
export type PrestamoUpdate = Partial<PrestamoInsert>;
export type AmortizacionUpdate = Partial<AmortizacionInsert>;
export type GarantiaUpdate = Partial<GarantiaInsert>;

// ============================================================================
// TIPOS DE RESPUESTA CON RELACIONES
// ============================================================================

export interface PrestamoConRelaciones extends Prestamo {
  cuenta?: Cuenta;
  cartera?: Cartera;
  empresa?: Empresa;
  usuario?: Usuario;
  amortizaciones?: Amortizacion[];
  garantias?: Garantia[];
}

export interface CuentaConRelaciones extends Cuenta {
  cartera?: Cartera;
  prestamos?: Prestamo[];
  localizaciones?: any[]; // TODO: Definir tipo Localizacion
}

export interface UsuarioConRelaciones extends Usuario {
  cartera?: Cartera;
  empresa?: Empresa;
}

// ============================================================================
// TIPOS DE FILTROS Y BÚSQUEDAS
// ============================================================================

export interface FiltrosPrestamo {
  IdCartera?: number;
  IdEstado?: EstadoPrestamo;
  UsuarioId?: number;
  FechaDesde?: string;
  FechaHasta?: string;
  MontoMinimo?: number;
  MontoMaximo?: number;
  EnLegal?: boolean;
  Castigada?: boolean;
}

export interface FiltrosCuenta {
  IdCartera?: number;
  EstaEnListaNegra?: boolean;
  Bloqueado?: boolean;
  Nacionalidad?: string;
  EstadoCivil?: EstadoCivil;
}

// ============================================================================
// TIPOS DE RESPUESTA DE API
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================================================
// TIPOS DE SUPABASE
// ============================================================================

export interface Database {
  public: {
    Tables: {
      Empresas: {
        Row: Empresa;
        Insert: EmpresaInsert;
        Update: EmpresaUpdate;
      };
      Carteras: {
        Row: Cartera;
        Insert: CarteraInsert;
        Update: CarteraUpdate;
      };
      Usuarios: {
        Row: Usuario;
        Insert: UsuarioInsert;
        Update: UsuarioUpdate;
      };
      Cuentas: {
        Row: Cuenta;
        Insert: CuentaInsert;
        Update: CuentaUpdate;
      };
      Prestamos: {
        Row: Prestamo;
        Insert: PrestamoInsert;
        Update: PrestamoUpdate;
      };
      Garantias: {
        Row: Garantia;
        Insert: GarantiaInsert;
        Update: GarantiaUpdate;
      };
    };
  };
  tran: {
    Tables: {
      Amortizaciones: {
        Row: Amortizacion;
        Insert: AmortizacionInsert;
        Update: AmortizacionUpdate;
      };
    };
  };
}