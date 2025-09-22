export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alertas: {
        Row: {
          Descripcion: string
          Fecha: string
          IdAlerta: number
          IdUsuario: number
          RegID: string
          Restringir: boolean
        }
        Insert: {
          Descripcion: string
          Fecha?: string
          IdAlerta?: number
          IdUsuario: number
          RegID?: string
          Restringir?: boolean
        }
        Update: {
          Descripcion?: string
          Fecha?: string
          IdAlerta?: number
          IdUsuario?: number
          RegID?: string
          Restringir?: boolean
        }
        Relationships: []
      }
      alertasdetalles: {
        Row: {
          IdAlerta: number
          IdAlertaDetalle: number
          IdRestriccion: number
          RegID: string
          Valor: string
        }
        Insert: {
          IdAlerta: number
          IdAlertaDetalle?: number
          IdRestriccion: number
          RegID?: string
          Valor: string
        }
        Update: {
          IdAlerta?: number
          IdAlertaDetalle?: number
          IdRestriccion?: number
          RegID?: string
          Valor?: string
        }
        Relationships: []
      }
      amortizaciones: {
        Row: {
          Capital: number
          EstaPagado: boolean
          GastoCierre: number
          IdAmortizacion: number
          IdPrestamo: number
          Interes: number
          MontoPagado: number
          Mora: number
          OrdenPago: number
          PagoFecha: string | null
          RegID: string
          Seguro: number
          Vencimiento: string
        }
        Insert: {
          Capital?: number
          EstaPagado?: boolean
          GastoCierre?: number
          IdAmortizacion?: number
          IdPrestamo: number
          Interes?: number
          MontoPagado?: number
          Mora?: number
          OrdenPago: number
          PagoFecha?: string | null
          RegID?: string
          Seguro?: number
          Vencimiento: string
        }
        Update: {
          Capital?: number
          EstaPagado?: boolean
          GastoCierre?: number
          IdAmortizacion?: number
          IdPrestamo?: number
          Interes?: number
          MontoPagado?: number
          Mora?: number
          OrdenPago?: number
          PagoFecha?: string | null
          RegID?: string
          Seguro?: number
          Vencimiento?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_Amortizaciones_Prestamos"
            columns: ["IdPrestamo"]
            isOneToOne: false
            referencedRelation: "prestamos"
            referencedColumns: ["IdPrestamo"]
          },
        ]
      }
      aseguradoras: {
        Row: {
          Direccion: string | null
          IdAseguradora: number
          Nombre: string
          RegID: string
          Telefono: string | null
        }
        Insert: {
          Direccion?: string | null
          IdAseguradora?: number
          Nombre: string
          RegID?: string
          Telefono?: string | null
        }
        Update: {
          Direccion?: string | null
          IdAseguradora?: number
          Nombre?: string
          RegID?: string
          Telefono?: string | null
        }
        Relationships: []
      }
      auditorias: {
        Row: {
          Fecha: string
          IDAuditoria: number
          IP: string
          Logs: string
          TerminalDom: string
          Transaccion: string
          UsuarioApp: string
          UsuarioDom: string
        }
        Insert: {
          Fecha: string
          IDAuditoria?: number
          IP: string
          Logs: string
          TerminalDom: string
          Transaccion: string
          UsuarioApp: string
          UsuarioDom: string
        }
        Update: {
          Fecha?: string
          IDAuditoria?: number
          IP?: string
          Logs?: string
          TerminalDom?: string
          Transaccion?: string
          UsuarioApp?: string
          UsuarioDom?: string
        }
        Relationships: []
      }
      bancos: {
        Row: {
          IdBanco: number
          imgUrl: string
          isNotLock: boolean
          Nombre: string
          RegID: string
        }
        Insert: {
          IdBanco?: number
          imgUrl?: string
          isNotLock?: boolean
          Nombre: string
          RegID?: string
        }
        Update: {
          IdBanco?: number
          imgUrl?: string
          isNotLock?: boolean
          Nombre?: string
          RegID?: string
        }
        Relationships: []
      }
      carteras: {
        Row: {
          Activo: boolean
          Banco: string
          CedulaPresidente: string
          ContadorCuentas: number
          ContadorPrestamos: number
          ContadorRecibos: number
          Cuotas: number
          Direccion: string
          FechaCreacion: string
          GastoCierre: number
          IdCartera: number
          IdEmpresa: number
          MaxAbonoSobreCapital: number
          MinAbonoSobreCapital: number
          Mora: number
          NoCuenta: string
          NombreComercial: string
          NombreParaMostrar: string | null
          Penalidad: number
          PorcientoPagoMinimo: number
          Presidente: string
          RazonSocial: string
          RegID: string
          RNC: string
          SufijoCartera: string
          Tasa: number
          Telefono: string | null
        }
        Insert: {
          Activo?: boolean
          Banco?: string
          CedulaPresidente: string
          ContadorCuentas?: number
          ContadorPrestamos?: number
          ContadorRecibos?: number
          Cuotas?: number
          Direccion: string
          FechaCreacion?: string
          GastoCierre?: number
          IdCartera?: number
          IdEmpresa: number
          MaxAbonoSobreCapital?: number
          MinAbonoSobreCapital?: number
          Mora?: number
          NoCuenta?: string
          NombreComercial: string
          NombreParaMostrar?: string | null
          Penalidad?: number
          PorcientoPagoMinimo?: number
          Presidente: string
          RazonSocial: string
          RegID?: string
          RNC: string
          SufijoCartera?: string
          Tasa?: number
          Telefono?: string | null
        }
        Update: {
          Activo?: boolean
          Banco?: string
          CedulaPresidente?: string
          ContadorCuentas?: number
          ContadorPrestamos?: number
          ContadorRecibos?: number
          Cuotas?: number
          Direccion?: string
          FechaCreacion?: string
          GastoCierre?: number
          IdCartera?: number
          IdEmpresa?: number
          MaxAbonoSobreCapital?: number
          MinAbonoSobreCapital?: number
          Mora?: number
          NoCuenta?: string
          NombreComercial?: string
          NombreParaMostrar?: string | null
          Penalidad?: number
          PorcientoPagoMinimo?: number
          Presidente?: string
          RazonSocial?: string
          RegID?: string
          RNC?: string
          SufijoCartera?: string
          Tasa?: number
          Telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_Carteras_Empresas"
            columns: ["IdEmpresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["IdEmpresa"]
          },
        ]
      }
      categorias: {
        Row: {
          IdCategoria: number
          Nombre: string
          RegID: string
        }
        Insert: {
          IdCategoria?: number
          Nombre: string
          RegID?: string
        }
        Update: {
          IdCategoria?: number
          Nombre?: string
          RegID?: string
        }
        Relationships: []
      }
      cotizaciones: {
        Row: {
          Capital: number
          Cuotas: number
          DescripcionGarantia: string
          Fecha: string
          FrecuenciaPago: number
          GastoCierre: number
          IdCotizacion: number
          IdTipoPrestamo: number
          IdUsuario: number
          Interes: number
          RegID: string
        }
        Insert: {
          Capital: number
          Cuotas: number
          DescripcionGarantia: string
          Fecha: string
          FrecuenciaPago: number
          GastoCierre: number
          IdCotizacion?: number
          IdTipoPrestamo: number
          IdUsuario: number
          Interes: number
          RegID?: string
        }
        Update: {
          Capital?: number
          Cuotas?: number
          DescripcionGarantia?: string
          Fecha?: string
          FrecuenciaPago?: number
          GastoCierre?: number
          IdCotizacion?: number
          IdTipoPrestamo?: number
          IdUsuario?: number
          Interes?: number
          RegID?: string
        }
        Relationships: []
      }
      cuentas: {
        Row: {
          Activo: boolean
          Apellidos: string
          Cedula: string
          Celular: string | null
          Direccion: string | null
          DireccionTrabajo: string | null
          Email: string | null
          EstadoCivil: number
          FechaIngreso: string
          FechaNacimiento: string | null
          IdCuenta: number
          IdEmpresa: number
          Ingresos: number
          LugarNacimiento: string | null
          LugarTrabajo: string | null
          Nacionalidad: string
          Nombres: string
          Observaciones: string | null
          Profesion: string | null
          RegID: string
          Sector: string | null
          Telefono: string | null
          TelefonoTrabajo: string | null
          TiempoTrabajo: string | null
        }
        Insert: {
          Activo?: boolean
          Apellidos: string
          Cedula: string
          Celular?: string | null
          Direccion?: string | null
          DireccionTrabajo?: string | null
          Email?: string | null
          EstadoCivil?: number
          FechaIngreso?: string
          FechaNacimiento?: string | null
          IdCuenta?: number
          IdEmpresa: number
          Ingresos?: number
          LugarNacimiento?: string | null
          LugarTrabajo?: string | null
          Nacionalidad?: string
          Nombres: string
          Observaciones?: string | null
          Profesion?: string | null
          RegID?: string
          Sector?: string | null
          Telefono?: string | null
          TelefonoTrabajo?: string | null
          TiempoTrabajo?: string | null
        }
        Update: {
          Activo?: boolean
          Apellidos?: string
          Cedula?: string
          Celular?: string | null
          Direccion?: string | null
          DireccionTrabajo?: string | null
          Email?: string | null
          EstadoCivil?: number
          FechaIngreso?: string
          FechaNacimiento?: string | null
          IdCuenta?: number
          IdEmpresa?: number
          Ingresos?: number
          LugarNacimiento?: string | null
          LugarTrabajo?: string | null
          Nacionalidad?: string
          Nombres?: string
          Observaciones?: string | null
          Profesion?: string | null
          RegID?: string
          Sector?: string | null
          Telefono?: string | null
          TelefonoTrabajo?: string | null
          TiempoTrabajo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_Cuentas_Empresas"
            columns: ["IdEmpresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["IdEmpresa"]
          },
        ]
      }
      documentofisicotipos: {
        Row: {
          IdDocumentoFisicoTipo: number
          Nombre: string
          RegID: string
        }
        Insert: {
          IdDocumentoFisicoTipo?: number
          Nombre: string
          RegID?: string
        }
        Update: {
          IdDocumentoFisicoTipo?: number
          Nombre?: string
          RegID?: string
        }
        Relationships: []
      }
      documentosfisicos: {
        Row: {
          Descripcion: string | null
          IdDocumentoFisico: number
          IdDocumentoFisicoTipo: number
          Identificacion: string
          Nombre: string
          RegID: string
        }
        Insert: {
          Descripcion?: string | null
          IdDocumentoFisico?: number
          IdDocumentoFisicoTipo: number
          Identificacion: string
          Nombre: string
          RegID?: string
        }
        Update: {
          Descripcion?: string | null
          IdDocumentoFisico?: number
          IdDocumentoFisicoTipo?: number
          Identificacion?: string
          Nombre?: string
          RegID?: string
        }
        Relationships: []
      }
      documentosfisicosengaratia: {
        Row: {
          IdDocumentoFisico: number
          IdGarantia: number
        }
        Insert: {
          IdDocumentoFisico: number
          IdGarantia: number
        }
        Update: {
          IdDocumentoFisico?: number
          IdGarantia?: number
        }
        Relationships: []
      }
      documentosfisicosenlistanegra: {
        Row: {
          IdDocumentoFisico: number
          IdListaNegra: number
        }
        Insert: {
          IdDocumentoFisico: number
          IdListaNegra: number
        }
        Update: {
          IdDocumentoFisico?: number
          IdListaNegra?: number
        }
        Relationships: []
      }
      documentosfisicosenprestamo: {
        Row: {
          IdDocumentoFisico: number
          IdPrestamo: number
        }
        Insert: {
          IdDocumentoFisico: number
          IdPrestamo: number
        }
        Update: {
          IdDocumentoFisico?: number
          IdPrestamo?: number
        }
        Relationships: []
      }
      elmah_error: {
        Row: {
          AllXml: string
          Application: string
          ErrorId: string
          Host: string
          Message: string
          Sequence: number
          Source: string
          StatusCode: number
          TimeUtc: string
          Type: string
          User: string
        }
        Insert: {
          AllXml: string
          Application: string
          ErrorId?: string
          Host: string
          Message: string
          Sequence?: number
          Source: string
          StatusCode: number
          TimeUtc?: string
          Type: string
          User: string
        }
        Update: {
          AllXml?: string
          Application?: string
          ErrorId?: string
          Host?: string
          Message?: string
          Sequence?: number
          Source?: string
          StatusCode?: number
          TimeUtc?: string
          Type?: string
          User?: string
        }
        Relationships: []
      }
      empresas: {
        Row: {
          Abogado: string
          Activo: boolean
          Alguacil: string
          ApiKey: string
          Banco: string
          CedulaAbogado: string
          CedulaPresidente: string
          Cuotas: number
          Direccion: string
          DireccionAbogado: string
          EstadoCivilAbogado: number
          FechaCreacion: string
          GastoCierre: number
          IdEmpresa: number
          MaxAbonoSobreCapital: number
          MinAbonoSobreCapital: number
          Mora: number
          NoCuenta: string
          NombreComercial: string
          Penalidad: number
          Presidente: string
          RazonSocial: string
          RegID: string
          RNC: string
          Tasa: number
          Telefono: string | null
          UrlLogo: string
        }
        Insert: {
          Abogado: string
          Activo?: boolean
          Alguacil: string
          ApiKey?: string
          Banco?: string
          CedulaAbogado: string
          CedulaPresidente: string
          Cuotas?: number
          Direccion: string
          DireccionAbogado: string
          EstadoCivilAbogado?: number
          FechaCreacion?: string
          GastoCierre?: number
          IdEmpresa?: number
          MaxAbonoSobreCapital?: number
          MinAbonoSobreCapital?: number
          Mora?: number
          NoCuenta?: string
          NombreComercial: string
          Penalidad?: number
          Presidente: string
          RazonSocial: string
          RegID?: string
          RNC: string
          Tasa?: number
          Telefono?: string | null
          UrlLogo?: string
        }
        Update: {
          Abogado?: string
          Activo?: boolean
          Alguacil?: string
          ApiKey?: string
          Banco?: string
          CedulaAbogado?: string
          CedulaPresidente?: string
          Cuotas?: number
          Direccion?: string
          DireccionAbogado?: string
          EstadoCivilAbogado?: number
          FechaCreacion?: string
          GastoCierre?: number
          IdEmpresa?: number
          MaxAbonoSobreCapital?: number
          MinAbonoSobreCapital?: number
          Mora?: number
          NoCuenta?: string
          NombreComercial?: string
          Penalidad?: number
          Presidente?: string
          RazonSocial?: string
          RegID?: string
          RNC?: string
          Tasa?: number
          Telefono?: string | null
          UrlLogo?: string
        }
        Relationships: []
      }
      empresasdeservicios: {
        Row: {
          Calle: string | null
          Contacto: string | null
          IdEmpresaDeServicio: number
          IdMunicipio: number
          Nombre: string
          RegID: string
          RNC: string
          Sector: string | null
          Telefono1: string
          Telefono2: string | null
          TipoEmpresaDeServicio: number
        }
        Insert: {
          Calle?: string | null
          Contacto?: string | null
          IdEmpresaDeServicio?: number
          IdMunicipio: number
          Nombre: string
          RegID?: string
          RNC: string
          Sector?: string | null
          Telefono1: string
          Telefono2?: string | null
          TipoEmpresaDeServicio?: number
        }
        Update: {
          Calle?: string | null
          Contacto?: string | null
          IdEmpresaDeServicio?: number
          IdMunicipio?: number
          Nombre?: string
          RegID?: string
          RNC?: string
          Sector?: string | null
          Telefono1?: string
          Telefono2?: string | null
          TipoEmpresaDeServicio?: number
        }
        Relationships: []
      }
      empresaserviciosenempresas: {
        Row: {
          IdEmpresa: number
          IdEmpresaDeServicio: number
        }
        Insert: {
          IdEmpresa: number
          IdEmpresaDeServicio: number
        }
        Update: {
          IdEmpresa?: number
          IdEmpresaDeServicio?: number
        }
        Relationships: []
      }
      estados: {
        Row: {
          IdEstado: number
          Nombre: string
        }
        Insert: {
          IdEstado: number
          Nombre: string
        }
        Update: {
          IdEstado?: number
          Nombre?: string
        }
        Relationships: []
      }
      garantias: {
        Row: {
          Color: string | null
          Descripcion: string | null
          FabricacionFecha: number | null
          FechaMatricula: string | null
          GarantiaTipo: number
          IdGarantia: number
          IdPrestamo: number
          Marca: string | null
          Matricula: string | null
          Modelo: string | null
          NumeroChasis: string | null
          NumeroMotor: string | null
          Placa: string | null
          RegID: string
          Tipo: string | null
          ValorGarantia: number
        }
        Insert: {
          Color?: string | null
          Descripcion?: string | null
          FabricacionFecha?: number | null
          FechaMatricula?: string | null
          GarantiaTipo?: number
          IdGarantia?: number
          IdPrestamo: number
          Marca?: string | null
          Matricula?: string | null
          Modelo?: string | null
          NumeroChasis?: string | null
          NumeroMotor?: string | null
          Placa?: string | null
          RegID?: string
          Tipo?: string | null
          ValorGarantia?: number
        }
        Update: {
          Color?: string | null
          Descripcion?: string | null
          FabricacionFecha?: number | null
          FechaMatricula?: string | null
          GarantiaTipo?: number
          IdGarantia?: number
          IdPrestamo?: number
          Marca?: string | null
          Matricula?: string | null
          Modelo?: string | null
          NumeroChasis?: string | null
          NumeroMotor?: string | null
          Placa?: string | null
          RegID?: string
          Tipo?: string | null
          ValorGarantia?: number
        }
        Relationships: [
          {
            foreignKeyName: "FK_Garantias_Prestamos"
            columns: ["IdPrestamo"]
            isOneToOne: false
            referencedRelation: "prestamos"
            referencedColumns: ["IdPrestamo"]
          },
        ]
      }
      gps: {
        Row: {
          IdGPS: number
          Nombre: string
          Precio: number
          RegID: string
        }
        Insert: {
          IdGPS?: number
          Nombre: string
          Precio?: number
          RegID?: string
        }
        Update: {
          IdGPS?: number
          Nombre?: string
          Precio?: number
          RegID?: string
        }
        Relationships: []
      }
      grupos: {
        Row: {
          IDGrupo: number
          NombreGrupo: string
          RegID: string
        }
        Insert: {
          IDGrupo?: number
          NombreGrupo: string
          RegID?: string
        }
        Update: {
          IDGrupo?: number
          NombreGrupo?: string
          RegID?: string
        }
        Relationships: []
      }
      gruposroles: {
        Row: {
          IDGrupo: number
          IDGrupoRol: number
          NombreRol: string
          RegID: string
        }
        Insert: {
          IDGrupo: number
          IDGrupoRol?: number
          NombreRol: string
          RegID?: string
        }
        Update: {
          IDGrupo?: number
          IDGrupoRol?: number
          NombreRol?: string
          RegID?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_GruposRoles_Grupos"
            columns: ["IDGrupo"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["IDGrupo"]
          },
        ]
      }
      listasnegras: {
        Row: {
          Descripcion: string
          Fecha: string
          IdListaNegra: number
          IdUsuario: number
          RegID: string
        }
        Insert: {
          Descripcion: string
          Fecha: string
          IdListaNegra?: number
          IdUsuario: number
          RegID?: string
        }
        Update: {
          Descripcion?: string
          Fecha?: string
          IdListaNegra?: number
          IdUsuario?: number
          RegID?: string
        }
        Relationships: []
      }
      llaves: {
        Row: {
          Accion: number
          Activo: boolean
          FechaCreacion: string
          FechaExpiracion: string
          IDLLave: number
          IDReg: string | null
          NombreUsuario: string | null
          Referencia: string | null
          UserNameSupervisor: string
          UserNameUsuario: string | null
          ValorDecimal: number | null
        }
        Insert: {
          Accion: number
          Activo?: boolean
          FechaCreacion?: string
          FechaExpiracion: string
          IDLLave?: number
          IDReg?: string | null
          NombreUsuario?: string | null
          Referencia?: string | null
          UserNameSupervisor: string
          UserNameUsuario?: string | null
          ValorDecimal?: number | null
        }
        Update: {
          Accion?: number
          Activo?: boolean
          FechaCreacion?: string
          FechaExpiracion?: string
          IDLLave?: number
          IDReg?: string | null
          NombreUsuario?: string | null
          Referencia?: string | null
          UserNameSupervisor?: string
          UserNameUsuario?: string | null
          ValorDecimal?: number | null
        }
        Relationships: []
      }
      localizaciones: {
        Row: {
          Calle: string | null
          IdCuenta: number
          IdLocalizacion: number
          IdMunicipio: number
          Latitud: number | null
          Longitud: number | null
          ReferenciaLocalidad: string | null
          RegID: string
          Sector: string | null
          SubSector: string | null
        }
        Insert: {
          Calle?: string | null
          IdCuenta: number
          IdLocalizacion?: number
          IdMunicipio: number
          Latitud?: number | null
          Longitud?: number | null
          ReferenciaLocalidad?: string | null
          RegID?: string
          Sector?: string | null
          SubSector?: string | null
        }
        Update: {
          Calle?: string | null
          IdCuenta?: number
          IdLocalizacion?: number
          IdMunicipio?: number
          Latitud?: number | null
          Longitud?: number | null
          ReferenciaLocalidad?: string | null
          RegID?: string
          Sector?: string | null
          SubSector?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_Localizaciones_Cuentas"
            columns: ["IdCuenta"]
            isOneToOne: false
            referencedRelation: "cuentas"
            referencedColumns: ["IdCuenta"]
          },
          {
            foreignKeyName: "FK_Localizaciones_Municipios"
            columns: ["IdMunicipio"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["IdMunicipio"]
          },
        ]
      }
      marcas: {
        Row: {
          IdMarca: number
          Nombre: string
          RegID: string
        }
        Insert: {
          IdMarca?: number
          Nombre: string
          RegID?: string
        }
        Update: {
          IdMarca?: number
          Nombre?: string
          RegID?: string
        }
        Relationships: []
      }
      modelos: {
        Row: {
          IdMarca: number
          IdModelo: number
          Nombre: string
          RegID: string
        }
        Insert: {
          IdMarca: number
          IdModelo?: number
          Nombre: string
          RegID?: string
        }
        Update: {
          IdMarca?: number
          IdModelo?: number
          Nombre?: string
          RegID?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_Modelos_Marcas"
            columns: ["IdMarca"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["IdMarca"]
          },
        ]
      }
      municipios: {
        Row: {
          IdMunicipio: number
          IdProvincia: number
          Nombre: string
          RegID: string
        }
        Insert: {
          IdMunicipio?: number
          IdProvincia: number
          Nombre: string
          RegID?: string
        }
        Update: {
          IdMunicipio?: number
          IdProvincia?: number
          Nombre?: string
          RegID?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_Municipios_Provincias"
            columns: ["IdProvincia"]
            isOneToOne: false
            referencedRelation: "provincias"
            referencedColumns: ["IdProvincia"]
          },
        ]
      }
      ncfasignaciones: {
        Row: {
          IdDetalleNcf: number
          IdMovimiento: number
        }
        Insert: {
          IdDetalleNcf: number
          IdMovimiento: number
        }
        Update: {
          IdDetalleNcf?: number
          IdMovimiento?: number
        }
        Relationships: []
      }
      ncfdetalles: {
        Row: {
          Activo: boolean
          AlertasDgii: string | null
          CodigoSeguridad: string | null
          Disponible: boolean
          Errores: string | null
          EstadoDgii: number | null
          Fecha: string
          FechaAsignacion: string | null
          FechaFirma: string | null
          IdDetalleNcf: number
          IdRangoNcf: number
          Monto: number | null
          NCF: string
          NCFModificado: string | null
          QrCode: string | null
          RegID: string
          RNC: string
          Secuencia: number
          SecuenciaUtilizadaDgii: boolean | null
        }
        Insert: {
          Activo?: boolean
          AlertasDgii?: string | null
          CodigoSeguridad?: string | null
          Disponible?: boolean
          Errores?: string | null
          EstadoDgii?: number | null
          Fecha?: string
          FechaAsignacion?: string | null
          FechaFirma?: string | null
          IdDetalleNcf?: number
          IdRangoNcf: number
          Monto?: number | null
          NCF: string
          NCFModificado?: string | null
          QrCode?: string | null
          RegID?: string
          RNC: string
          Secuencia: number
          SecuenciaUtilizadaDgii?: boolean | null
        }
        Update: {
          Activo?: boolean
          AlertasDgii?: string | null
          CodigoSeguridad?: string | null
          Disponible?: boolean
          Errores?: string | null
          EstadoDgii?: number | null
          Fecha?: string
          FechaAsignacion?: string | null
          FechaFirma?: string | null
          IdDetalleNcf?: number
          IdRangoNcf?: number
          Monto?: number | null
          NCF?: string
          NCFModificado?: string | null
          QrCode?: string | null
          RegID?: string
          RNC?: string
          Secuencia?: number
          SecuenciaUtilizadaDgii?: boolean | null
        }
        Relationships: []
      }
      ncfrangos: {
        Row: {
          FechaCreacion: string
          FechaModificacion: string | null
          Fin: number
          IdEmpresa: number
          IdRangoNcf: number
          Inicio: number
          RegID: string
          Tipo: number
          UsuarioCreacion: string
          UsuarioModificacion: string | null
          Vencimiento: string | null
        }
        Insert: {
          FechaCreacion?: string
          FechaModificacion?: string | null
          Fin: number
          IdEmpresa: number
          IdRangoNcf?: number
          Inicio: number
          RegID?: string
          Tipo?: number
          UsuarioCreacion: string
          UsuarioModificacion?: string | null
          Vencimiento?: string | null
        }
        Update: {
          FechaCreacion?: string
          FechaModificacion?: string | null
          Fin?: number
          IdEmpresa?: number
          IdRangoNcf?: number
          Inicio?: number
          RegID?: string
          Tipo?: number
          UsuarioCreacion?: string
          UsuarioModificacion?: string | null
          Vencimiento?: string | null
        }
        Relationships: []
      }
      notaslistasnegras: {
        Row: {
          Descripcion: string
          Fecha: string
          IdListaNegra: number
          IdNotaListaNegra: number
          IdUsuario: number
          RegID: string
          TipoDescripcion: number
        }
        Insert: {
          Descripcion: string
          Fecha: string
          IdListaNegra: number
          IdNotaListaNegra?: number
          IdUsuario: number
          RegID?: string
          TipoDescripcion: number
        }
        Update: {
          Descripcion?: string
          Fecha?: string
          IdListaNegra?: number
          IdNotaListaNegra?: number
          IdUsuario?: number
          RegID?: string
          TipoDescripcion?: number
        }
        Relationships: [
          {
            foreignKeyName: "FK_NotasListasNegras_ListasNegras"
            columns: ["IdListaNegra"]
            isOneToOne: false
            referencedRelation: "listasnegras"
            referencedColumns: ["IdListaNegra"]
          },
        ]
      }
      ofertas: {
        Row: {
          Activo: boolean
          Descripcion: string
          FechaFin: string
          FechaInicio: string
          IdEmpresa: number
          IdOferta: number
          Nombre: string
          RegID: string
        }
        Insert: {
          Activo?: boolean
          Descripcion: string
          FechaFin: string
          FechaInicio: string
          IdEmpresa: number
          IdOferta?: number
          Nombre: string
          RegID?: string
        }
        Update: {
          Activo?: boolean
          Descripcion?: string
          FechaFin?: string
          FechaInicio?: string
          IdEmpresa?: number
          IdOferta?: number
          Nombre?: string
          RegID?: string
        }
        Relationships: []
      }
      paises: {
        Row: {
          IdPais: number
          Nombre: string
        }
        Insert: {
          IdPais: number
          Nombre: string
        }
        Update: {
          IdPais?: number
          Nombre?: string
        }
        Relationships: []
      }
      prestamoclases: {
        Row: {
          Descripcion: string | null
          IdClasePrestamo: number
          Nombre: string
          RegID: string
        }
        Insert: {
          Descripcion?: string | null
          IdClasePrestamo?: number
          Nombre: string
          RegID?: string
        }
        Update: {
          Descripcion?: string | null
          IdClasePrestamo?: number
          Nombre?: string
          RegID?: string
        }
        Relationships: []
      }
      prestamohistorias: {
        Row: {
          Contactado: number
          Descripcion: string
          Fecha: string
          IdPrestamo: number
          IdPrestamoHistoria: number
          IdUsuario: number
          RegID: string
          TipoHistoria: number
        }
        Insert: {
          Contactado?: number
          Descripcion: string
          Fecha?: string
          IdPrestamo: number
          IdPrestamoHistoria?: number
          IdUsuario: number
          RegID?: string
          TipoHistoria?: number
        }
        Update: {
          Contactado?: number
          Descripcion?: string
          Fecha?: string
          IdPrestamo?: number
          IdPrestamoHistoria?: number
          IdUsuario?: number
          RegID?: string
          TipoHistoria?: number
        }
        Relationships: []
      }
      prestamos: {
        Row: {
          CapitalPrestado: number
          Cuotas: number
          DiasGraciaMora: number
          FechaCreacion: string
          FechaPrimerPago: string
          FrecuenciaPago: number
          GastoCierre: number
          GastoSeguro: number
          IdCuenta: number
          IdEmpresa: number
          IdEstado: number
          IdPrestamo: number
          IdTipoPrestamo: number
          Interes: number
          InteresMora: number
          Moneda: number
          Observaciones: string | null
          Prefijo: string
          PrestamoNo: number
          RegID: string
        }
        Insert: {
          CapitalPrestado: number
          Cuotas: number
          DiasGraciaMora?: number
          FechaCreacion?: string
          FechaPrimerPago: string
          FrecuenciaPago?: number
          GastoCierre?: number
          GastoSeguro?: number
          IdCuenta: number
          IdEmpresa: number
          IdEstado?: number
          IdPrestamo?: number
          IdTipoPrestamo?: number
          Interes?: number
          InteresMora?: number
          Moneda?: number
          Observaciones?: string | null
          Prefijo?: string
          PrestamoNo: number
          RegID?: string
        }
        Update: {
          CapitalPrestado?: number
          Cuotas?: number
          DiasGraciaMora?: number
          FechaCreacion?: string
          FechaPrimerPago?: string
          FrecuenciaPago?: number
          GastoCierre?: number
          GastoSeguro?: number
          IdCuenta?: number
          IdEmpresa?: number
          IdEstado?: number
          IdPrestamo?: number
          IdTipoPrestamo?: number
          Interes?: number
          InteresMora?: number
          Moneda?: number
          Observaciones?: string | null
          Prefijo?: string
          PrestamoNo?: number
          RegID?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_Prestamos_Cuentas"
            columns: ["IdCuenta"]
            isOneToOne: false
            referencedRelation: "cuentas"
            referencedColumns: ["IdCuenta"]
          },
          {
            foreignKeyName: "FK_Prestamos_Empresas"
            columns: ["IdEmpresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["IdEmpresa"]
          },
          {
            foreignKeyName: "FK_Prestamos_Estados"
            columns: ["IdEstado"]
            isOneToOne: false
            referencedRelation: "estados"
            referencedColumns: ["IdEstado"]
          },
          {
            foreignKeyName: "FK_Prestamos_Tipos"
            columns: ["IdTipoPrestamo"]
            isOneToOne: false
            referencedRelation: "prestamotipos"
            referencedColumns: ["IdPrestamoTipo"]
          },
        ]
      }
      prestamotipos: {
        Row: {
          Descripcion: string | null
          IdPrestamoTipo: number
          Nombre: string
          RegID: string
        }
        Insert: {
          Descripcion?: string | null
          IdPrestamoTipo: number
          Nombre: string
          RegID?: string
        }
        Update: {
          Descripcion?: string | null
          IdPrestamoTipo?: number
          Nombre?: string
          RegID?: string
        }
        Relationships: []
      }
      procesolegaltipos: {
        Row: {
          IdProcesoLegalTipo: number
          Nombre: string
          RegID: string
        }
        Insert: {
          IdProcesoLegalTipo?: number
          Nombre: string
          RegID?: string
        }
        Update: {
          IdProcesoLegalTipo?: number
          Nombre?: string
          RegID?: string
        }
        Relationships: []
      }
      procesoslegales: {
        Row: {
          Cerrado: boolean
          Costo: number
          FechaFinal: string | null
          FechaInicio: string
          IdPrestamo: number
          IdProcesoLegal: number
          IdProcesoLegalTipo: number
          NombreEncargado: string
          Notas: string | null
          Recibido: boolean
          RegID: string
        }
        Insert: {
          Cerrado?: boolean
          Costo?: number
          FechaFinal?: string | null
          FechaInicio: string
          IdPrestamo: number
          IdProcesoLegal?: number
          IdProcesoLegalTipo: number
          NombreEncargado: string
          Notas?: string | null
          Recibido?: boolean
          RegID?: string
        }
        Update: {
          Cerrado?: boolean
          Costo?: number
          FechaFinal?: string | null
          FechaInicio?: string
          IdPrestamo?: number
          IdProcesoLegal?: number
          IdProcesoLegalTipo?: number
          NombreEncargado?: string
          Notas?: string | null
          Recibido?: boolean
          RegID?: string
        }
        Relationships: []
      }
      proveedores: {
        Row: {
          Direccion: string
          FechaIngreso: string
          IdEmpresa: number
          Identificacion: string | null
          IdProveedor: number
          Nombre: string
          RegID: string
          TasaComision: number
          Telefono: string
        }
        Insert: {
          Direccion: string
          FechaIngreso?: string
          IdEmpresa: number
          Identificacion?: string | null
          IdProveedor?: number
          Nombre: string
          RegID?: string
          TasaComision?: number
          Telefono: string
        }
        Update: {
          Direccion?: string
          FechaIngreso?: string
          IdEmpresa?: number
          Identificacion?: string | null
          IdProveedor?: number
          Nombre?: string
          RegID?: string
          TasaComision?: number
          Telefono?: string
        }
        Relationships: []
      }
      provincias: {
        Row: {
          IdPais: number
          IdProvincia: number
          Nombre: string
          RegID: string
        }
        Insert: {
          IdPais?: number
          IdProvincia?: number
          Nombre: string
          RegID?: string
        }
        Update: {
          IdPais?: number
          IdProvincia?: number
          Nombre?: string
          RegID?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_Provincias_Paises"
            columns: ["IdPais"]
            isOneToOne: false
            referencedRelation: "paises"
            referencedColumns: ["IdPais"]
          },
        ]
      }
      recibos: {
        Row: {
          Concepto: string
          FechaPago: string
          IdPrestamo: number
          IdRecibo: number
          MontoPagado: number
          NumeroRecibo: string
          Observaciones: string | null
          RecibidoPor: string
          RegID: string
        }
        Insert: {
          Concepto: string
          FechaPago?: string
          IdPrestamo: number
          IdRecibo?: number
          MontoPagado: number
          NumeroRecibo: string
          Observaciones?: string | null
          RecibidoPor: string
          RegID?: string
        }
        Update: {
          Concepto?: string
          FechaPago?: string
          IdPrestamo?: number
          IdRecibo?: number
          MontoPagado?: number
          NumeroRecibo?: string
          Observaciones?: string | null
          RecibidoPor?: string
          RegID?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_Recibos_Prestamos"
            columns: ["IdPrestamo"]
            isOneToOne: false
            referencedRelation: "prestamos"
            referencedColumns: ["IdPrestamo"]
          },
        ]
      }
      recibosendepositos: {
        Row: {
          IdDeposito: number
          IdRecibo: number
        }
        Insert: {
          IdDeposito: number
          IdRecibo: number
        }
        Update: {
          IdDeposito?: number
          IdRecibo?: number
        }
        Relationships: []
      }
      referenciapersonaltipos: {
        Row: {
          IdTipoReferenciaPersonal: number
          Nombre: string
          RegID: string
        }
        Insert: {
          IdTipoReferenciaPersonal?: number
          Nombre: string
          RegID?: string
        }
        Update: {
          IdTipoReferenciaPersonal?: number
          Nombre?: string
          RegID?: string
        }
        Relationships: []
      }
      referenciaspersonales: {
        Row: {
          Direccion: string | null
          IdCuenta: number
          IdReferenciaPersonal: number
          IdTipoReferenciaPersonal: number
          Nombre: string
          RegID: string
          Telefono: string | null
        }
        Insert: {
          Direccion?: string | null
          IdCuenta: number
          IdReferenciaPersonal?: number
          IdTipoReferenciaPersonal: number
          Nombre: string
          RegID?: string
          Telefono?: string | null
        }
        Update: {
          Direccion?: string | null
          IdCuenta?: number
          IdReferenciaPersonal?: number
          IdTipoReferenciaPersonal?: number
          Nombre?: string
          RegID?: string
          Telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_ReferenciasPersonales_Cuentas"
            columns: ["IdCuenta"]
            isOneToOne: false
            referencedRelation: "cuentas"
            referencedColumns: ["IdCuenta"]
          },
          {
            foreignKeyName: "FK_ReferenciasPersonales_Tipos"
            columns: ["IdTipoReferenciaPersonal"]
            isOneToOne: false
            referencedRelation: "referenciapersonaltipos"
            referencedColumns: ["IdTipoReferenciaPersonal"]
          },
        ]
      }
      representantes: {
        Row: {
          Activo: boolean
          Direccion: string
          Identificacion: string | null
          IdProveedor: number
          IdRepresentante: number
          Nombre: string
          RegID: string
          Telefono: string
        }
        Insert: {
          Activo?: boolean
          Direccion: string
          Identificacion?: string | null
          IdProveedor: number
          IdRepresentante?: number
          Nombre: string
          RegID?: string
          Telefono: string
        }
        Update: {
          Activo?: boolean
          Direccion?: string
          Identificacion?: string | null
          IdProveedor?: number
          IdRepresentante?: number
          Nombre?: string
          RegID?: string
          Telefono?: string
        }
        Relationships: []
      }
      restricciones: {
        Row: {
          IdRestriccion: number
          Nombre: string
          RegID: string
        }
        Insert: {
          IdRestriccion?: number
          Nombre: string
          RegID?: string
        }
        Update: {
          IdRestriccion?: number
          Nombre?: string
          RegID?: string
        }
        Relationships: []
      }
      tasaciones: {
        Row: {
          IdModelo: number
          IdTasacion: number
          PrecioMercadoActual: number
          RegID: string
          Year: number
        }
        Insert: {
          IdModelo: number
          IdTasacion?: number
          PrecioMercadoActual: number
          RegID?: string
          Year: number
        }
        Update: {
          IdModelo?: number
          IdTasacion?: number
          PrecioMercadoActual?: number
          RegID?: string
          Year?: number
        }
        Relationships: [
          {
            foreignKeyName: "FK_Tasaciones_Modelos"
            columns: ["IdModelo"]
            isOneToOne: false
            referencedRelation: "modelos"
            referencedColumns: ["IdModelo"]
          },
        ]
      }
      telefonos: {
        Row: {
          IdCuenta: number
          IdTelefono: number
          Numero: string
          RegID: string
          TipoTelefono: string
        }
        Insert: {
          IdCuenta: number
          IdTelefono?: number
          Numero: string
          RegID?: string
          TipoTelefono?: string
        }
        Update: {
          IdCuenta?: number
          IdTelefono?: number
          Numero?: string
          RegID?: string
          TipoTelefono?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_Telefonos_Cuentas"
            columns: ["IdCuenta"]
            isOneToOne: false
            referencedRelation: "cuentas"
            referencedColumns: ["IdCuenta"]
          },
        ]
      }
      traspasos: {
        Row: {
          Fecha: string
          IdCuenta: number
          IdPrestamo: number
          IdTraspaso: number
          Nota: string
          RegID: string
        }
        Insert: {
          Fecha: string
          IdCuenta: number
          IdPrestamo: number
          IdTraspaso?: number
          Nota: string
          RegID?: string
        }
        Update: {
          Fecha?: string
          IdCuenta?: number
          IdPrestamo?: number
          IdTraspaso?: number
          Nota?: string
          RegID?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_Traspasos_Cuentas"
            columns: ["IdCuenta"]
            isOneToOne: false
            referencedRelation: "cuentas"
            referencedColumns: ["IdCuenta"]
          },
          {
            foreignKeyName: "FK_Traspasos_Prestamos"
            columns: ["IdPrestamo"]
            isOneToOne: false
            referencedRelation: "prestamos"
            referencedColumns: ["IdPrestamo"]
          },
        ]
      }
      usersincarteras: {
        Row: {
          IdCartera: number
          IdUsuario: number
        }
        Insert: {
          IdCartera: number
          IdUsuario: number
        }
        Update: {
          IdCartera?: number
          IdUsuario?: number
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          Activo: boolean
          Apellidos: string
          Email: string
          FechaCreacion: string
          IdEmpresa: number
          IdUsuario: number
          Nombres: string
          NombreUsuario: string
          RegID: string
          UserId: string | null
        }
        Insert: {
          Activo?: boolean
          Apellidos: string
          Email: string
          FechaCreacion?: string
          IdEmpresa: number
          IdUsuario?: number
          Nombres: string
          NombreUsuario: string
          RegID?: string
          UserId?: string | null
        }
        Update: {
          Activo?: boolean
          Apellidos?: string
          Email?: string
          FechaCreacion?: string
          IdEmpresa?: number
          IdUsuario?: number
          Nombres?: string
          NombreUsuario?: string
          RegID?: string
          UserId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_Usuarios_Empresas"
            columns: ["IdEmpresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["IdEmpresa"]
          },
        ]
      }
      usuariosengrupos: {
        Row: {
          IDGrupo: number
          IDUsuario: number
        }
        Insert: {
          IDGrupo: number
          IDUsuario: number
        }
        Update: {
          IDGrupo?: number
          IDUsuario?: number
        }
        Relationships: []
      }
      variables: {
        Row: {
          Descripcion: string | null
          IdVariable: number
          Nombre: string
          RegID: string
          Tipo: number
          Valor: number
        }
        Insert: {
          Descripcion?: string | null
          IdVariable?: number
          Nombre: string
          RegID?: string
          Tipo?: number
          Valor: number
        }
        Update: {
          Descripcion?: string | null
          IdVariable?: number
          Nombre?: string
          RegID?: string
          Tipo?: number
          Valor?: number
        }
        Relationships: []
      }
      vehiculoestilos: {
        Row: {
          IdVehiculoEstilo: number
          Nombre: string
          RegID: string
        }
        Insert: {
          IdVehiculoEstilo?: number
          Nombre: string
          RegID?: string
        }
        Update: {
          IdVehiculoEstilo?: number
          Nombre?: string
          RegID?: string
        }
        Relationships: []
      }
      vehiculotipos: {
        Row: {
          IdVehiculoTipo: number
          Nombre: string
        }
        Insert: {
          IdVehiculoTipo?: number
          Nombre: string
        }
        Update: {
          IdVehiculoTipo?: number
          Nombre?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
