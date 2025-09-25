-- Migración para corregir la inconsistencia del nombre de la tabla cuentas
-- La tabla se define como 'Cuentas' (mayúsculas) pero el código la usa como 'cuentas' (minúsculas)

-- Primero, verificar si existe la tabla con mayúsculas y crear un alias/vista si es necesario
-- O renombrar la tabla para que coincida con el uso en el código

-- Opción 1: Renombrar la tabla de Cuentas a cuentas (recomendado)
DO $$
BEGIN
    -- Verificar si existe la tabla Cuentas (mayúsculas)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Cuentas') THEN
        -- Verificar si ya existe cuentas (minúsculas)
        IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cuentas') THEN
            -- Renombrar la tabla de Cuentas a cuentas
            ALTER TABLE public.Cuentas RENAME TO cuentas;
            
            -- Actualizar las políticas RLS para usar el nuevo nombre
            -- Primero eliminar las políticas existentes
            DROP POLICY IF EXISTS "Cuentas visibles para usuarios autenticados" ON public.cuentas;
            DROP POLICY IF EXISTS "Usuarios pueden crear cuentas" ON public.cuentas;
            DROP POLICY IF EXISTS "Usuarios pueden actualizar cuentas" ON public.cuentas;
            DROP POLICY IF EXISTS "Cuentas_select_policy" ON public.cuentas;
            DROP POLICY IF EXISTS "Cuentas_insert_policy" ON public.cuentas;
            DROP POLICY IF EXISTS "Cuentas_update_policy" ON public.cuentas;
            DROP POLICY IF EXISTS "Cuentas_delete_policy" ON public.cuentas;
            
            -- Crear nuevas políticas RLS para la tabla cuentas (minúsculas)
            CREATE POLICY "cuentas_select_policy" ON public.cuentas
                FOR SELECT USING (auth.uid() IS NOT NULL);
                
            CREATE POLICY "cuentas_insert_policy" ON public.cuentas
                FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
                
            CREATE POLICY "cuentas_update_policy" ON public.cuentas
                FOR UPDATE USING (auth.uid() IS NOT NULL);
                
            CREATE POLICY "cuentas_delete_policy" ON public.cuentas
                FOR DELETE USING (auth.uid() IS NOT NULL);
            
            -- Asegurar que RLS esté habilitado
            ALTER TABLE public.cuentas ENABLE ROW LEVEL SECURITY;
            
            RAISE NOTICE 'Tabla Cuentas renombrada a cuentas y políticas RLS actualizadas';
        ELSE
            RAISE NOTICE 'La tabla cuentas (minúsculas) ya existe, no se puede renombrar';
        END IF;
    ELSE
        RAISE NOTICE 'La tabla Cuentas (mayúsculas) no existe';
    END IF;
END $$;

-- Opción 2: Si la tabla ya existe como cuentas (minúsculas), solo asegurar las políticas RLS
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cuentas') THEN
        -- Eliminar políticas existentes que puedan estar mal nombradas
        DROP POLICY IF EXISTS "Cuentas visibles para usuarios autenticados" ON public.cuentas;
        DROP POLICY IF EXISTS "Usuarios pueden crear cuentas" ON public.cuentas;
        DROP POLICY IF EXISTS "Usuarios pueden actualizar cuentas" ON public.cuentas;
        DROP POLICY IF EXISTS "Cuentas_select_policy" ON public.cuentas;
        DROP POLICY IF EXISTS "Cuentas_insert_policy" ON public.cuentas;
        DROP POLICY IF EXISTS "Cuentas_update_policy" ON public.cuentas;
        DROP POLICY IF EXISTS "Cuentas_delete_policy" ON public.cuentas;
        DROP POLICY IF EXISTS "cuentas_select_policy" ON public.cuentas;
        DROP POLICY IF EXISTS "cuentas_insert_policy" ON public.cuentas;
        DROP POLICY IF EXISTS "cuentas_update_policy" ON public.cuentas;
        DROP POLICY IF EXISTS "cuentas_delete_policy" ON public.cuentas;
        
        -- Crear políticas RLS correctas para la tabla cuentas
        CREATE POLICY "cuentas_select_policy" ON public.cuentas
            FOR SELECT USING (auth.uid() IS NOT NULL);
            
        CREATE POLICY "cuentas_insert_policy" ON public.cuentas
            FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
            
        CREATE POLICY "cuentas_update_policy" ON public.cuentas
            FOR UPDATE USING (auth.uid() IS NOT NULL);
            
        CREATE POLICY "cuentas_delete_policy" ON public.cuentas
            FOR DELETE USING (auth.uid() IS NOT NULL);
        
        -- Asegurar que RLS esté habilitado
        ALTER TABLE public.cuentas ENABLE ROW LEVEL SECURITY;
        
        RAISE NOTICE 'Políticas RLS actualizadas para la tabla cuentas (minúsculas)';
    END IF;
END $$;