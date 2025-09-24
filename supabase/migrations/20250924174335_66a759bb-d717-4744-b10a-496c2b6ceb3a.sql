-- Fix the trigger function with correct column casing
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert with explicit column names using correct casing
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
  VALUES (
    NEW.id,
    -- Use the first active company as default
    (SELECT "IdEmpresa" FROM public.empresas WHERE "Activo" = true ORDER BY "IdEmpresa" LIMIT 1),
    COALESCE(NEW.raw_user_meta_data->>'nombre_usuario', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'nombres', ''),
    COALESCE(NEW.raw_user_meta_data->>'apellidos', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'activo')::boolean, true),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;