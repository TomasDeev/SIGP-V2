-- Habilitar Row Level Security en todas las tablas públicas
ALTER TABLE public.Empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.Estados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.PrestamoTipos ENABLE ROW LEVEL SECURITY;

-- Políticas básicas para las tablas de configuración (solo lectura para usuarios autenticados)
CREATE POLICY "Estados son visibles para usuarios autenticados" ON public.Estados
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "PrestamoTipos son visibles para usuarios autenticados" ON public.PrestamoTipos
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Políticas para Empresas (los usuarios solo pueden ver/editar las empresas que les pertenecen)
-- Nota: Esto requerirá una tabla de usuarios/empresas para relacionar usuarios con empresas
CREATE POLICY "Empresas son visibles para usuarios autenticados" ON public.Empresas
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Solo usuarios autenticados pueden crear empresas" ON public.Empresas
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Solo usuarios autenticados pueden actualizar empresas" ON public.Empresas
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Comentarios explicativos
COMMENT ON TABLE public.Empresas IS 'Tabla de empresas prestamistas del sistema SIGP';
COMMENT ON TABLE public.Estados IS 'Estados posibles para los préstamos: Activo, Pagado, Vencido, etc.';
COMMENT ON TABLE public.PrestamoTipos IS 'Tipos de préstamos: Vehicular, Personal, Hipotecario';