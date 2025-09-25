-- Agregar columna Foto a la tabla cuentas para almacenar URLs de fotos de clientes
ALTER TABLE public.cuentas 
ADD COLUMN IF NOT EXISTS "Foto" text;

-- Agregar comentario para documentar la columna
COMMENT ON COLUMN public.cuentas."Foto" IS 'URL de la foto del cliente almacenada en Supabase Storage';