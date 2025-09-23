-- Script para agregar columnas faltantes a la tabla sucursales
-- Este script agrega todos los campos que estaban en el formulario original

-- Agregar columnas de información de empresa (que no están en empresas)
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS RazonSocial character varying;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS NombreComercial character varying;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS RNC character varying;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS Presidente character varying;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS CedulaPresidente character varying;

-- Agregar columnas de información legal
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS Abogado character varying;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS EstadoCivilAbogado integer DEFAULT 1;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS CedulaAbogado character varying;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS DireccionAbogado character varying;

-- Agregar columnas de testigos
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS PrimerTestigo character varying;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS SegundoTestigo character varying;

-- Agregar columna de alguacil
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS Alguacil character varying;

-- Agregar columnas bancarias
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS Banco character varying;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS NumeroCuenta character varying;

-- Agregar columnas de configuración de préstamos
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS TipoRecibo character varying;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS Tasa numeric DEFAULT 0;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS Mora numeric DEFAULT 0;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS Cuotas integer DEFAULT 12;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS GastoCierre numeric DEFAULT 0;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS PagoMinimoVencido numeric DEFAULT 0;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS PenalidadAbono numeric DEFAULT 0;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS MaxAbonoCapital numeric DEFAULT 1;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS MinAbonoCapital numeric DEFAULT 0;

-- Agregar columnas adicionales del gerente
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS CedulaGerente character varying;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS DireccionGerente character varying;

-- Agregar columnas de configuración adicional
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS ProcesoLegalAutomatico boolean DEFAULT false;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS CostoBasico numeric DEFAULT 0;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS CuotasVencidas integer DEFAULT 0;
ALTER TABLE public.sucursales ADD COLUMN IF NOT EXISTS DiasTransacciones integer DEFAULT 0;

-- Comentarios para documentar las columnas
COMMENT ON COLUMN public.sucursales.RazonSocial IS 'Razón social específica de la sucursal';
COMMENT ON COLUMN public.sucursales.NombreComercial IS 'Nombre comercial específico de la sucursal';
COMMENT ON COLUMN public.sucursales.RNC IS 'RNC específico de la sucursal si aplica';
COMMENT ON COLUMN public.sucursales.Presidente IS 'Presidente o representante de la sucursal';
COMMENT ON COLUMN public.sucursales.CedulaPresidente IS 'Cédula del presidente de la sucursal';
COMMENT ON COLUMN public.sucursales.Abogado IS 'Abogado asignado a la sucursal';
COMMENT ON COLUMN public.sucursales.EstadoCivilAbogado IS 'Estado civil del abogado (1=Soltero, 2=Casado, etc.)';
COMMENT ON COLUMN public.sucursales.CedulaAbogado IS 'Cédula del abogado';
COMMENT ON COLUMN public.sucursales.DireccionAbogado IS 'Dirección del abogado';
COMMENT ON COLUMN public.sucursales.PrimerTestigo IS 'Primer testigo para documentos legales';
COMMENT ON COLUMN public.sucursales.SegundoTestigo IS 'Segundo testigo para documentos legales';
COMMENT ON COLUMN public.sucursales.Alguacil IS 'Alguacil asignado a la sucursal';
COMMENT ON COLUMN public.sucursales.Banco IS 'Banco principal de la sucursal';
COMMENT ON COLUMN public.sucursales.NumeroCuenta IS 'Número de cuenta bancaria de la sucursal';
COMMENT ON COLUMN public.sucursales.TipoRecibo IS 'Tipo de recibo utilizado por la sucursal';
COMMENT ON COLUMN public.sucursales.Tasa IS 'Tasa de interés por defecto de la sucursal';
COMMENT ON COLUMN public.sucursales.Mora IS 'Tasa de mora por defecto de la sucursal';
COMMENT ON COLUMN public.sucursales.Cuotas IS 'Número de cuotas por defecto';
COMMENT ON COLUMN public.sucursales.GastoCierre IS 'Gasto de cierre por defecto';
COMMENT ON COLUMN public.sucursales.PagoMinimoVencido IS 'Pago mínimo cuando está vencido';
COMMENT ON COLUMN public.sucursales.PenalidadAbono IS 'Penalidad por abono';
COMMENT ON COLUMN public.sucursales.MaxAbonoCapital IS 'Máximo abono sobre capital permitido';
COMMENT ON COLUMN public.sucursales.MinAbonoCapital IS 'Mínimo abono sobre capital requerido';
COMMENT ON COLUMN public.sucursales.CedulaGerente IS 'Cédula del gerente de la sucursal';
COMMENT ON COLUMN public.sucursales.DireccionGerente IS 'Dirección del gerente';
COMMENT ON COLUMN public.sucursales.ProcesoLegalAutomatico IS 'Si el proceso legal es automático';
COMMENT ON COLUMN public.sucursales.CostoBasico IS 'Costo básico de operaciones';
COMMENT ON COLUMN public.sucursales.CuotasVencidas IS 'Número de cuotas vencidas permitidas';
COMMENT ON COLUMN public.sucursales.DiasTransacciones IS 'Días para procesar transacciones';