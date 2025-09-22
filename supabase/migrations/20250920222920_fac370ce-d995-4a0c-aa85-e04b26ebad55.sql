-- SIGP Sistema Integrado de Gestión de Préstamos
-- Esquema inicial corregido para PostgreSQL/Supabase

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Esquemas del sistema
CREATE SCHEMA IF NOT EXISTS almacen;
CREATE SCHEMA IF NOT EXISTS dealer;
CREATE SCHEMA IF NOT EXISTS tran;

-- Tablas del esquema almacen
CREATE TABLE IF NOT EXISTS almacen.AlmacenTablaAmortizaciones(
	"IdTablaAmortizacion" integer NOT NULL,
	"IdPrestamo" integer NOT NULL,
	"OrdenPago" integer NOT NULL,
	"Vencimiento" timestamptz NOT NULL,
	"PagoCierre" numeric(18,2) NOT NULL DEFAULT 0,
	"PagoSeguro" numeric(18,2) NOT NULL DEFAULT 0,
	"PagoCapital" numeric(18,2) NOT NULL DEFAULT 0,
	"PagoInteres" numeric(18,2) NOT NULL DEFAULT 0,
	"DescuentoInteres" numeric(18,2) NOT NULL DEFAULT 0,
	"DescuentoCierre" numeric(18,2) NOT NULL DEFAULT 0,
	"DescuentoSeguro" numeric(18,2) NOT NULL DEFAULT 0,
	"DescuentoCapital" numeric(18,2) NOT NULL DEFAULT 0,
	"PagoFecha" timestamptz NULL,
	"FechaFinMora" timestamptz NULL,
	"EstaPago" boolean NOT NULL DEFAULT false,
	"DetenerMora" boolean NOT NULL DEFAULT false,
	"SanAcumulado" numeric(18,2) NOT NULL DEFAULT 0,
	"Nota" text NULL,
	"Descuento" numeric(18,2) NULL DEFAULT 0,
	"Reversar" boolean NOT NULL DEFAULT false,
	"InteresMora" numeric(9,6) NOT NULL DEFAULT 0,
	"DiasGraciaMora" integer NOT NULL DEFAULT 0,
	"DescuentoMora" numeric(18,2) NOT NULL DEFAULT 0,
	"Mora" numeric(18,2) NOT NULL DEFAULT 0,
	CONSTRAINT "PK_AlmacenTablaAmortizaciones" PRIMARY KEY ("IdTablaAmortizacion")
);

CREATE TABLE IF NOT EXISTS almacen.Amortizaciones(
	"IdAmortizacion" integer NOT NULL,
	"IdPrestamo" integer NOT NULL,
	"OrdenPago" integer NOT NULL,
	"Vencimiento" timestamptz NOT NULL,
	"GastoCierre" numeric(18,2) NOT NULL DEFAULT 0,
	"Seguro" numeric(18,2) NOT NULL DEFAULT 0,
	"Interes" numeric(18,2) NOT NULL DEFAULT 0,
	"InteresMora" numeric(18,6) NOT NULL DEFAULT 0,
	"Capital" numeric(18,2) NOT NULL DEFAULT 0,
	"GastoCierreAcumulado" numeric(18,2) NOT NULL DEFAULT 0,
	"SeguroAcumulado" numeric(18,2) NOT NULL DEFAULT 0,
	"InteresAcumulado" numeric(18,2) NOT NULL DEFAULT 0,
	"CapitalAcumulado" numeric(18,2) NOT NULL DEFAULT 0,
	"MoraAcumulado" numeric(18,2) NOT NULL DEFAULT 0,
	"DiasGraciaMora" integer NOT NULL DEFAULT 0,
	"DetenerMora" boolean NOT NULL DEFAULT false,
	"Frecuencia" integer NOT NULL DEFAULT 1,
	"FechaFinMora" timestamptz NULL,
	"PagoFecha" timestamptz NULL,
	"Mora" numeric(18,2) NOT NULL DEFAULT 0,
	"RegID" uuid DEFAULT gen_random_uuid() NOT NULL,
	"Gps" numeric(18,2) NOT NULL DEFAULT 0,
	"GpsAcumulado" numeric(18,2) NOT NULL DEFAULT 0,
	CONSTRAINT "PK_AlmacenAmortizaciones" PRIMARY KEY ("IdAmortizacion")
);