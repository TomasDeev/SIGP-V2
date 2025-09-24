-- Create function to sync new auth users to usuarios table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (
    UserId,
    NombreUsuario,
    Nombres,
    Apellidos,
    Email,
    Activo,
    FechaCreacion
  )
  VALUES (
    NEW.id,
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

-- Create trigger to sync new users automatically
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();