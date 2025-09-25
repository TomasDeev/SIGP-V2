# SIGP - Referencia Completa de Base de Datos

## 📋 Índice
- [Esquemas](#esquemas)
- [Tablas Principales](#tablas-principales)
- [Relaciones Clave](#relaciones-clave)
- [Campos Importantes](#campos-importantes)
- [Convenciones](#convenciones)

## 🗂️ Esquemas

### `public` - Esquema Principal
Contiene todas las tablas principales del sistema de gestión de préstamos.

### `almacen` - Esquema de Almacén
Contiene tablas de respaldo y almacenamiento histórico.

### `dealer` - Esquema de Concesionarios
Gestión de concesionarios y vehículos.

### `tran` - Esquema de Transacciones
Movimientos financieros y transacciones.

---

## 🏢 Tablas Principales

### 1. **Empresas** (`public.Empresas`)
**Propósito**: Entidades principales del sistema
```sql
IdEmpresa (PK) - integer IDENTITY
RazonSocial - varchar(64) NOT NULL
NombreComercial - varchar(64) NOT NULL
RNC - varchar(20) NOT NULL
Direccion - varchar(128) NOT NULL
Presidente - varchar(64) NOT NULL
CedulaPresidente - varchar(32) NOT NULL
Tasa - numeric(8,4) NOT NULL
Mora - numeric(8,4) NOT NULL
Cuotas - integer NOT NULL
GastoCierre - numeric(8,4) NOT NULL
Activo - boolean NOT NULL
ApiKey - uuid DEFAULT gen_random_uuid()
RegID - uuid DEFAULT gen_random_uuid()
```

### 2. **Carteras** (`public.Carteras`)
**Propósito**: Carteras de préstamos por empresa
```sql
IdCartera (PK) - integer IDENTITY
IdEmpresa (FK) - integer NOT NULL → Empresas.IdEmpresa
RazonSocial - varchar(64) NOT NULL
NombreComercial - varchar(64) NOT NULL
RNC - varchar(20) NOT NULL
Tasa - numeric(8,4) NOT NULL
Mora - numeric(8,4) NOT NULL
Cuotas - integer NOT NULL
ContadorCuentas - integer NOT NULL
ContadorPrestamos - integer NOT NULL
ContadorRecibos - integer NOT NULL
Activo - boolean NOT NULL
RegID - uuid DEFAULT gen_random_uuid()
```

### 3. **Usuarios** (`public.Usuarios`)
**Propósito**: Usuarios del sistema
```sql
IdUsuario (PK) - integer IDENTITY
UserId - uuid NOT NULL (Supabase Auth ID)
Nombre - varchar(50)
Direccion - varchar(128)
Telefono - varchar(20)
IdCartera (FK) - integer NOT NULL → Carteras.IdCartera
CarteraPrincipal - varchar(64)
CajaAbierta - boolean NOT NULL
HoraInicio - integer NOT NULL
HoraFinal - integer NOT NULL
FechaExpiracionClave - timestamptz NOT NULL
IdPerfil (FK) - integer → Perfiles.IdPerfil
RegID - uuid DEFAULT gen_random_uuid()
```

### 4. **Cuentas** (`public.Cuentas`)
**Propósito**: Clientes del sistema
```sql
IdCuenta (PK) - integer IDENTITY
IdCartera (FK) - integer NOT NULL → Carteras.IdCartera
Codigo - text COMPUTED (Prefijo + CuentaNo)
Prefijo - varchar(16) NOT NULL
CuentaNo - integer NOT NULL
UsuarioId (FK) - integer NOT NULL → Usuarios.IdUsuario
Nombres - varchar(128) NOT NULL
Apellidos - varchar(128) NOT NULL
Identificacion - varchar(32) NOT NULL
FechaNacimiento - timestamptz NOT NULL
Sexo - char(1) NOT NULL
Correo - varchar(128)
EstadoCivil - char(1) NOT NULL
Nacionalidad - varchar(128) NOT NULL
Ingresos - numeric(18,2) NOT NULL
EstaEnListaNegra - boolean NOT NULL
Bloqueado - boolean NOT NULL
RegID - uuid DEFAULT gen_random_uuid()
```

### 5. **Prestamos** (`public.Prestamos`)
**Propósito**: Préstamos otorgados
```sql
IdPrestamo (PK) - integer IDENTITY
Codigo - text COMPUTED (Prefijo + PrestamoNo)
Prefijo - varchar(16) NOT NULL
PrestamoNo - integer NOT NULL
IdCartera (FK) - integer NOT NULL → Carteras.IdCartera
UsuarioId (FK) - integer NOT NULL → Usuarios.IdUsuario
IdCuenta (FK) - integer NOT NULL → Cuentas.IdCuenta
IdTipoPrestamo (FK) - integer NOT NULL → PrestamoTipos.IdPrestamoTipo
IdClasePrestamo (FK) - integer NOT NULL → PrestamoClases.IdPrestamoClase
IdEstado (FK) - integer NOT NULL → Estados.IdEstado
FechaCreacion - timestamptz DEFAULT now()
FechaPrimerPago - timestamptz NOT NULL
CapitalPrestado - numeric(18,2) NOT NULL
Interes - numeric(9,6) NOT NULL
InteresMora - numeric(9,6) NOT NULL
FrecuenciaPago - integer NOT NULL
Cuotas - integer NOT NULL
DiasGraciaMora - integer NOT NULL
GastoCierre - numeric(18,2) NOT NULL
GastoSeguro - numeric(18,2) NOT NULL
Moneda - integer NOT NULL
EnLegal - boolean NOT NULL
Castigada - boolean NOT NULL
RegID - uuid DEFAULT gen_random_uuid()
```

### 6. **Amortizaciones** (`tran.Amortizaciones`)
**Propósito**: Tabla de pagos de préstamos
```sql
IdAmortizacion (PK) - integer IDENTITY
IdPrestamo (FK) - integer NOT NULL → Prestamos.IdPrestamo
OrdenPago - integer NOT NULL
Vencimiento - timestamptz NOT NULL
Capital - numeric(18,2) NOT NULL
Interes - numeric(18,2) NOT NULL
Mora - numeric(18,2) NOT NULL
GastoCierre - numeric(18,2) NOT NULL
Seguro - numeric(18,2) NOT NULL
PagoFecha - timestamptz
EstaPago - boolean NOT NULL
DetenerMora - boolean NOT NULL
RegID - uuid DEFAULT gen_random_uuid()
```

---

## 🔗 Relaciones Clave

### Jerarquía Principal
```
Empresas (1) → Carteras (N)
Carteras (1) → Usuarios (N)
Carteras (1) → Cuentas (N)
Cuentas (1) → Prestamos (N)
Prestamos (1) → Amortizaciones (N)
Prestamos (1) → Garantias (N)
```

### Relaciones de Autenticación
```
auth.users.id → Usuarios.UserId (uuid)
Usuarios.IdUsuario → Prestamos.UsuarioId
Usuarios.IdCartera → Carteras.IdCartera
```

### Relaciones Geográficas
```
Paises (1) → Provincias (N)
Provincias (1) → Municipios (N)
Municipios (1) → Localizaciones (N)
Cuentas (1) → Localizaciones (N)
```

---

## 📊 Campos Importantes

### Campos de Auditoría (Presentes en todas las tablas)
- `RegID` - uuid DEFAULT gen_random_uuid() - Identificador único de registro
- `FechaCreacion` - timestamptz DEFAULT now() - Fecha de creación (donde aplique)

### Campos de Estado
- `Activo` - boolean - Indica si el registro está activo
- `Bloqueado` - boolean - Indica si está bloqueado (Cuentas)
- `EstaPago` - boolean - Indica si está pagado (Amortizaciones)
- `Castigada` - boolean - Indica si está castigada (Prestamos)

### Campos Calculados
- `Codigo` - Campos computados que concatenan Prefijo + Número
- `DescripcionResumida` - Descripciones generadas automáticamente
- `DireccionCompleta` - Direcciones concatenadas

### Campos de Moneda
- Todos los campos monetarios son `numeric(18,2)`
- Tasas e intereses son `numeric(9,6)` o `numeric(8,4)`

---

## 📝 Convenciones

### Nomenclatura
- **Tablas**: PascalCase (ej: `Prestamos`, `Cuentas`)
- **Campos**: PascalCase con comillas (ej: `"IdPrestamo"`, `"Nombres"`)
- **Primary Keys**: Siempre `Id + NombreTabla` (ej: `IdPrestamo`, `IdCuenta`)
- **Foreign Keys**: `Id + NombreTablaReferenciada` (ej: `IdCartera`, `IdUsuario`)

### Tipos de Datos Estándar
- **IDs**: `integer IDENTITY` para PKs, `integer` para FKs
- **Texto corto**: `varchar(n)` con límites específicos
- **Texto largo**: `text` para descripciones y notas
- **Fechas**: `timestamptz` (timestamp with timezone)
- **Booleanos**: `boolean` con valores DEFAULT
- **UUIDs**: `uuid` con `gen_random_uuid()`
- **Dinero**: `numeric(18,2)`
- **Tasas**: `numeric(9,6)` o `numeric(8,4)`

### Estados Comunes
- **Estados de Préstamo**: 1=Activo, 2=Pagado, 3=Vencido, etc.
- **Estados Civiles**: 1=Soltero, 2=Casado, 3=Divorciado, etc.
- **Tipos de Documento**: 1=Cédula, 2=Pasaporte, etc.
- **Monedas**: 1=Peso Dominicano, 2=Dólar, etc.

### Prefijos Estándar
- **Prestamos**: "P-" + número secuencial
- **Cuentas**: Prefijo configurable + número secuencial
- **Carteras**: Sufijo configurable

---

## ⚠️ Notas Importantes

1. **Supabase Integration**: La tabla `Usuarios` se conecta con `auth.users` via `UserId`
2. **Row Level Security**: Implementado en tablas principales
3. **Soft Deletes**: Se usa campo `Activo` en lugar de eliminar registros
4. **Auditoría**: Todas las tablas tienen `RegID` para trazabilidad
5. **Computed Fields**: Varios campos son calculados automáticamente
6. **Constraints**: Múltiples restricciones de integridad referencial

---

*Última actualización: $(Get-Date)*
*Versión del esquema: sigp_complete_schema.sql*