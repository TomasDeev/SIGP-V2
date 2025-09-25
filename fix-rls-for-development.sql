-- Script para deshabilitar RLS temporalmente en desarrollo
-- IMPORTANTE: Solo para desarrollo, no usar en producción

-- Deshabilitar RLS en las tablas principales del onboarding
ALTER TABLE public.cuentas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestamos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.referenciaspersonales DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.garantias DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas DISABLE ROW LEVEL SECURITY;

-- Verificar el estado de RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('cuentas', 'prestamos', 'referenciaspersonales', 'garantias', 'empresas')
ORDER BY tablename;

-- Comentarios sobre las tablas:
-- cuentas: Necesaria para crear clientes
-- prestamos: Necesaria para crear solicitudes de préstamo
-- referenciaspersonales: Necesaria para referencias del cliente
-- garantias: Necesaria para garantías del préstamo
-- empresas: Necesaria para asociar datos con la empresa