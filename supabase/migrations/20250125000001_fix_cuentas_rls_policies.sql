-- Migración para corregir las políticas de RLS de la tabla Cuentas
-- Fecha: 2025-01-25
-- Propósito: Asegurar que las políticas RLS permitan operaciones CRUD en la tabla cuentas

-- Primero, verificar si la tabla existe con minúsculas o mayúsculas
-- y crear políticas para ambos casos por compatibilidad

-- Eliminar políticas existentes que puedan estar causando conflictos
DROP POLICY IF EXISTS "Cuentas visibles para usuarios autenticados" ON public.Cuentas;
DROP POLICY IF EXISTS "Usuarios pueden crear cuentas" ON public.Cuentas;
DROP POLICY IF EXISTS "Usuarios pueden actualizar cuentas" ON public.Cuentas;
DROP POLICY IF EXISTS "cuentas visibles para usuarios autenticados" ON public.cuentas;
DROP POLICY IF EXISTS "usuarios pueden crear cuentas" ON public.cuentas;
DROP POLICY IF EXISTS "usuarios pueden actualizar cuentas" ON public.cuentas;

-- Crear políticas más permisivas para la tabla Cuentas (mayúscula)
CREATE POLICY "Cuentas_select_policy" ON public.Cuentas
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Cuentas_insert_policy" ON public.Cuentas
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Cuentas_update_policy" ON public.Cuentas
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Cuentas_delete_policy" ON public.Cuentas
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Si existe la tabla con minúsculas, crear políticas también
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cuentas') THEN
    -- Habilitar RLS si no está habilitado
    EXECUTE 'ALTER TABLE public.cuentas ENABLE ROW LEVEL SECURITY';
    
    -- Crear políticas para la tabla con minúsculas
    EXECUTE 'CREATE POLICY "cuentas_select_policy" ON public.cuentas FOR SELECT USING (auth.uid() IS NOT NULL)';
    EXECUTE 'CREATE POLICY "cuentas_insert_policy" ON public.cuentas FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)';
    EXECUTE 'CREATE POLICY "cuentas_update_policy" ON public.cuentas FOR UPDATE USING (auth.uid() IS NOT NULL)';
    EXECUTE 'CREATE POLICY "cuentas_delete_policy" ON public.cuentas FOR DELETE USING (auth.uid() IS NOT NULL)';
  END IF;
END $$;

-- Asegurar que RLS esté habilitado en la tabla principal
ALTER TABLE public.Cuentas ENABLE ROW LEVEL SECURITY;

-- Comentarios explicativos
COMMENT ON POLICY "Cuentas_select_policy" ON public.Cuentas 
IS 'Permite que usuarios autenticados vean todas las cuentas';

COMMENT ON POLICY "Cuentas_insert_policy" ON public.Cuentas 
IS 'Permite que usuarios autenticados creen nuevas cuentas';

COMMENT ON POLICY "Cuentas_update_policy" ON public.Cuentas 
IS 'Permite que usuarios autenticados actualicen cuentas';

COMMENT ON POLICY "Cuentas_delete_policy" ON public.Cuentas 
IS 'Permite que usuarios autenticados eliminen cuentas';