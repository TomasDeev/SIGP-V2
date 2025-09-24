-- Verificar y crear restricción de unicidad en UserId si no existe
DO $$ 
BEGIN
    -- Verificar si la restricción única existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'usuarios_userid_unique' 
        AND table_name = 'usuarios'
    ) THEN
        -- Agregar restricción única en UserId
        ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_userid_unique UNIQUE ("UserId");
    END IF;
END $$;

-- Ahora sincronizar usuarios de auth.users a public.usuarios
INSERT INTO public.usuarios (
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
  au.id as "UserId",
  1 as "IdEmpresa",
  COALESCE(au.raw_user_meta_data->>'username', split_part(au.email, '@', 1)) as "NombreUsuario",
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'first_name', split_part(au.email, '@', 1)) as "Nombres",
  COALESCE(au.raw_user_meta_data->>'last_name', '') as "Apellidos",
  au.email as "Email",
  true as "Activo",
  au.created_at as "FechaCreacion"
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.usuarios u WHERE u."UserId" = au.id
)
ON CONFLICT ("UserId") DO UPDATE SET
  "Email" = EXCLUDED."Email",
  "NombreUsuario" = EXCLUDED."NombreUsuario",
  "Nombres" = EXCLUDED."Nombres",
  "Apellidos" = EXCLUDED."Apellidos";

-- Verificar resultados
SELECT COUNT(*) as usuarios_sincronizados FROM public.usuarios;