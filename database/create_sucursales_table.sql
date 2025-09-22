-- Crear tabla Sucursales para el sistema SIGP
CREATE TABLE IF NOT EXISTS public.Sucursales (
    "IdSucursal" SERIAL PRIMARY KEY,
    "IdEmpresa" INTEGER NOT NULL,
    "Nombre" VARCHAR(100) NOT NULL,
    "Codigo" VARCHAR(20) NOT NULL,
    "Direccion" VARCHAR(200) NOT NULL,
    "Telefono" VARCHAR(20),
    "Email" VARCHAR(100),
    "Gerente" VARCHAR(100),
    "TelefonoGerente" VARCHAR(20),
    "EmailGerente" VARCHAR(100),
    "FechaCreacion" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "Activo" BOOLEAN DEFAULT TRUE NOT NULL,
    "RegID" UUID DEFAULT gen_random_uuid() NOT NULL,
    
    -- Restricciones
    CONSTRAINT "FK_Sucursales_Empresas" FOREIGN KEY ("IdEmpresa") 
        REFERENCES public.Empresas("IdEmpresa") ON DELETE CASCADE,
    CONSTRAINT "UQ_Sucursales_Codigo" UNIQUE ("Codigo"),
    CONSTRAINT "UQ_Sucursales_Email" UNIQUE ("Email")
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS "IX_Sucursales_IdEmpresa" ON public.Sucursales("IdEmpresa");
CREATE INDEX IF NOT EXISTS "IX_Sucursales_Activo" ON public.Sucursales("Activo");
CREATE INDEX IF NOT EXISTS "IX_Sucursales_Codigo" ON public.Sucursales("Codigo");

-- Comentarios para documentación
COMMENT ON TABLE public.Sucursales IS 'Tabla que almacena las sucursales de las empresas';
COMMENT ON COLUMN public.Sucursales."IdSucursal" IS 'Identificador único de la sucursal';
COMMENT ON COLUMN public.Sucursales."IdEmpresa" IS 'Referencia a la empresa propietaria';
COMMENT ON COLUMN public.Sucursales."Nombre" IS 'Nombre de la sucursal';
COMMENT ON COLUMN public.Sucursales."Codigo" IS 'Código único de la sucursal';
COMMENT ON COLUMN public.Sucursales."Direccion" IS 'Dirección física de la sucursal';
COMMENT ON COLUMN public.Sucursales."Telefono" IS 'Teléfono de contacto de la sucursal';
COMMENT ON COLUMN public.Sucursales."Email" IS 'Email de contacto de la sucursal';
COMMENT ON COLUMN public.Sucursales."Gerente" IS 'Nombre del gerente de la sucursal';
COMMENT ON COLUMN public.Sucursales."TelefonoGerente" IS 'Teléfono del gerente';
COMMENT ON COLUMN public.Sucursales."EmailGerente" IS 'Email del gerente';
COMMENT ON COLUMN public.Sucursales."FechaCreacion" IS 'Fecha de creación del registro';
COMMENT ON COLUMN public.Sucursales."Activo" IS 'Estado activo/inactivo de la sucursal';
COMMENT ON COLUMN public.Sucursales."RegID" IS 'Identificador único global del registro';

-- Insertar datos de ejemplo
INSERT INTO public.Sucursales ("IdEmpresa", "Nombre", "Codigo", "Direccion", "Telefono", "Email", "Gerente", "TelefonoGerente", "EmailGerente", "Activo") VALUES
(1, 'Sucursal Central', 'SUC001', 'Av. 27 de Febrero #123, Santo Domingo', '809-555-0101', 'central@empresa1.com', 'María González', '809-555-0102', 'maria.gonzalez@empresa1.com', true),
(1, 'Sucursal Norte', 'SUC002', 'Av. John F. Kennedy #456, Santo Domingo', '809-555-0201', 'norte@empresa1.com', 'Carlos Rodríguez', '809-555-0202', 'carlos.rodriguez@empresa1.com', true),
(2, 'Sucursal Santiago', 'SUC003', 'Calle del Sol #789, Santiago', '809-555-0301', 'santiago@empresa2.com', 'Ana Martínez', '809-555-0302', 'ana.martinez@empresa2.com', true),
(2, 'Sucursal La Vega', 'SUC004', 'Av. Pedro Henríquez Ureña #321, La Vega', '809-555-0401', 'lavega@empresa2.com', 'Luis Pérez', '809-555-0402', 'luis.perez@empresa2.com', false),
(3, 'Sucursal Este', 'SUC005', 'Av. España #654, Santo Domingo Este', '809-555-0501', 'este@empresa3.com', 'Carmen López', '809-555-0502', 'carmen.lopez@empresa3.com', true);