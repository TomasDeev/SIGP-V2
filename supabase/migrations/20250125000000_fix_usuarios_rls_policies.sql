-- Migración para corregir las políticas de RLS de la tabla Usuarios
-- Fecha: 2025-01-25
-- Propósito: Permitir que los administradores vean todos los usuarios en el sistema

-- Eliminar las políticas restrictivas existentes (tanto con mayúsculas como minúsculas por compatibilidad)
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON public.Usuarios;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.Usuarios;
DROP POLICY IF EXISTS "Usuarios pueden ver usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios pueden actualizar usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios pueden crear usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver todos los usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar usuarios" ON public.usuarios;

-- Crear nuevas políticas más flexibles para administración en la tabla correcta (Usuarios con U mayúscula)

-- Política para SELECT: Permitir que usuarios autenticados vean todos los usuarios
CREATE POLICY "Usuarios autenticados pueden ver todos los usuarios" ON public.Usuarios
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Política para INSERT: Permitir que usuarios autenticados creen usuarios
CREATE POLICY "Usuarios autenticados pueden crear usuarios" ON public.Usuarios
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Política para UPDATE: Permitir que usuarios autenticados actualicen usuarios
CREATE POLICY "Usuarios autenticados pueden actualizar usuarios" ON public.Usuarios
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Política para DELETE: Permitir que usuarios autenticados eliminen usuarios
CREATE POLICY "Usuarios autenticados pueden eliminar usuarios" ON public.Usuarios
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Comentarios explicativos
COMMENT ON POLICY "Usuarios autenticados pueden ver todos los usuarios" ON public.Usuarios 
IS 'Permite que cualquier usuario autenticado vea todos los usuarios del sistema para funciones administrativas';

COMMENT ON POLICY "Usuarios autenticados pueden crear usuarios" ON public.Usuarios 
IS 'Permite que usuarios autenticados creen nuevos usuarios en el sistema';

COMMENT ON POLICY "Usuarios autenticados pueden actualizar usuarios" ON public.Usuarios 
IS 'Permite que usuarios autenticados actualicen información de usuarios, incluyendo asignación de empresa y sucursal';

COMMENT ON POLICY "Usuarios autenticados pueden eliminar usuarios" ON public.Usuarios 
IS 'Permite que usuarios autenticados eliminen usuarios del sistema';

-- Verificar que RLS esté habilitado en la tabla correcta
ALTER TABLE public.Usuarios ENABLE ROW LEVEL SECURITY;