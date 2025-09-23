-- Script para sincronizar auth.users con public.Usuarios
-- Ejecutar en el editor SQL de Supabase

-- 1. Crear función para sincronizar usuarios de auth con Usuarios
CREATE OR REPLACE FUNCTION public.sync_auth_user_to_usuarios()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar nuevo usuario en public.Usuarios cuando se crea en auth.users
  INSERT INTO public.Usuarios (
    "UserId",
    "IdEmpresa", 
    "NombreUsuario",
    "Nombres",
    "Apellidos", 
    "Email",
    "Activo",
    "FechaCreacion"
  ) VALUES (
    NEW.id,
    1, -- IdEmpresa por defecto (ajustar según necesidad)
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'first_name', 'Sin nombre'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    true,
    NEW.created_at
  )
  ON CONFLICT ("UserId") DO UPDATE SET
    "Email" = EXCLUDED."Email",
    "NombreUsuario" = EXCLUDED."NombreUsuario",
    "Nombres" = EXCLUDED."Nombres",
    "Apellidos" = EXCLUDED."Apellidos";
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Crear trigger para nuevos usuarios
DROP TRIGGER IF EXISTS on_auth_user_created_sync_usuarios ON auth.users;
CREATE TRIGGER on_auth_user_created_sync_usuarios
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_auth_user_to_usuarios();

-- 3. Migrar usuarios existentes de auth.users a public.Usuarios
INSERT INTO public.Usuarios (
  "UserId",
  "IdEmpresa",
  "NombreUsuario", 
  "Nombres",
  "Apellidos",
  "Email",
  "Activo",
  "FechaCreacion"
)
SELECT 
  au.id,
  1 as "IdEmpresa", -- IdEmpresa por defecto
  COALESCE(au.raw_user_meta_data->>'username', split_part(au.email, '@', 1)) as "NombreUsuario",
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'first_name', 'Sin nombre') as "Nombres",
  COALESCE(au.raw_user_meta_data->>'last_name', '') as "Apellidos",
  au.email as "Email",
  (au.banned_until IS NULL) as "Activo",
  au.created_at as "FechaCreacion"
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.Usuarios u WHERE u."UserId" = au.id
);

-- 4. Verificar resultados
SELECT 
  'auth.users' as tabla,
  COUNT(*) as total_usuarios
FROM auth.users
UNION ALL
SELECT 
  'public.Usuarios' as tabla,
  COUNT(*) as total_usuarios  
FROM public.Usuarios;

-- 5. Mostrar usuarios sincronizados
SELECT 
  u."IdUsuario",
  u."UserId",
  u."NombreUsuario",
  u."Email",
  u."Activo",
  u."FechaCreacion"
FROM public.Usuarios u
ORDER BY u."FechaCreacion" DESC;