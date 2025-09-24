-- Script para solucionar el problema de RLS en la tabla usuarios
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Deshabilitar RLS temporalmente en la tabla usuarios
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;

-- 2. Insertar usuarios de prueba
INSERT INTO public.usuarios (
  UserId,
  Email,
  NombreUsuario,
  Nombres,
  Apellidos,
  Activo,
  FechaCreacion
) VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'admin@sigp.com',
    'admin',
    'Administrador',
    'Sistema',
    true,
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    'usuario@sigp.com',
    'usuario',
    'Usuario',
    'Prueba',
    true,
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    'test@example.com',
    'test',
    'Test',
    'User',
    true,
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004',
    'manager@sigp.com',
    'manager',
    'Gerente',
    'General',
    true,
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005',
    'operador@sigp.com',
    'operador',
    'Operador',
    'Sistema',
    true,
    NOW()
  )
ON CONFLICT (Email) DO NOTHING;

-- 3. Crear políticas RLS más permisivas
-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "usuarios_select_policy" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_insert_policy" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_update_policy" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_delete_policy" ON public.usuarios;

-- Crear nuevas políticas más permisivas
CREATE POLICY "usuarios_select_policy" ON public.usuarios
  FOR SELECT USING (true);

CREATE POLICY "usuarios_insert_policy" ON public.usuarios
  FOR INSERT WITH CHECK (true);

CREATE POLICY "usuarios_update_policy" ON public.usuarios
  FOR UPDATE USING (true);

CREATE POLICY "usuarios_delete_policy" ON public.usuarios
  FOR DELETE USING (true);

-- 4. Rehabilitar RLS con las nuevas políticas
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- 5. Verificar que los usuarios se insertaron correctamente
SELECT 
  IdUsuario,
  UserId,
  Email,
  NombreUsuario,
  Nombres,
  Apellidos,
  Activo,
  FechaCreacion
FROM public.usuarios
ORDER BY FechaCreacion DESC;

-- 6. Verificar que el trigger existe y está activo
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 7. Verificar que la función existe
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_name = 'handle_new_auth_user';

-- Mensaje de confirmación
SELECT 'Script ejecutado correctamente. Verifica que los usuarios aparezcan en la consulta anterior.' as mensaje;