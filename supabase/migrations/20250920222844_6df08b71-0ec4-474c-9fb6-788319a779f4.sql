create extension if not exists pgcrypto;
create schema if not exists almacen;
create schema if not exists dealer;
create schema if not exists public;
create schema if not exists tran;
;

create table if not exists almacen.AlmacenTablaAmortizaciones(
	"IdTablaAmortizacion" integer NOT NULL,
	"IdPrestamo" integer NOT NULL,
	"OrdenPago" integer NOT NULL,
	"Vencimiento" timestamptz NOT NULL,
	"PagoCierre" numeric(18,2) NOT NULL,
	"PagoSeguro" numeric(18,2) NOT NULL,
	"PagoCapital" numeric(18,2) NOT NULL,
	"PagoInteres" numeric(18,2) NOT NULL,
	"DescuentoInteres" numeric(18,2) NOT NULL,
	"DescuentoCierre" numeric(18,2) NOT NULL,
	"DescuentoSeguro" numeric(18,2) NOT NULL,
	"DescuentoCapital" numeric(18,2) NOT NULL,
	"PagoFecha" timestamptz NULL,
	"FechaFinMora" timestamptz NULL,
	"EstaPago" boolean NOT NULL,
	"DetenerMora" boolean NOT NULL,
	"SanAcumulado" numeric(18,2) NOT NULL,
	"Nota" text NULL,
	"Descuento" numeric(18,2) NULL,
	"Reversar" boolean NOT NULL,
	"InteresMora" numeric(9,6) NOT NULL,
	"DiasGraciaMora" integer NOT NULL,
	"DescuentoMora" numeric(18,2) NOT NULL,
	"Mora" numeric(18,2) NOT NULL
)
;
;

create table if not exists almacen.Amortizaciones(
	"IdAmortizacion" integer NOT NULL,
	"IdPrestamo" integer NOT NULL,
	"OrdenPago" integer NOT NULL,
	"Vencimiento" timestamptz NOT NULL,
	"GastoCierre" numeric(18,2) NOT NULL,
	"Seguro" numeric(18,2) NOT NULL,
	"Interes" numeric(18,2) NOT NULL,
	"InteresMora" numeric(18,6) NOT NULL,
	"Capital" numeric(18,2) NOT NULL,
	"GastoCierreAcumulado" numeric(18,2) NOT NULL,
	"SeguroAcumulado" numeric(18,2) NOT NULL,
	"InteresAcumulado" numeric(18,2) NOT NULL,
	"CapitalAcumulado" numeric(18,2) NOT NULL,
	"MoraAcumulado" numeric(18,2) NOT NULL,
	"DiasGraciaMora" integer NOT NULL,
	"DetenerMora" boolean NOT NULL,
	"Frecuencia" integer NOT NULL,
	"FechaFinMora" timestamptz NULL,
	"PagoFecha" timestamptz NULL,
	"Mora" numeric(18,2) NOT NULL,
	"RegID" uuid default gen_random_uuid() NOT NULL,
	"Gps" numeric(18,2) NOT NULL,
	"GpsAcumulado" numeric(18,2) NOT NULL,
 constraint "PK_AlmacenAmortizaciones" primary key 
(
	"IdAmortizacion" ASC
)
)