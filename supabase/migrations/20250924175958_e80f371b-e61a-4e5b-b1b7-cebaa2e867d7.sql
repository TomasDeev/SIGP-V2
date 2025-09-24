-- Eliminar políticas restrictivas existentes
DROP POLICY IF EXISTS "Usuarios pueden ver usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios pueden actualizar usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios pueden crear usuarios" ON public.usuarios;

-- Crear nuevas políticas que permitan ver todos los usuarios a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden ver todos los usuarios" 
ON public.usuarios 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden crear usuarios" 
ON public.usuarios 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden actualizar usuarios" 
ON public.usuarios 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);