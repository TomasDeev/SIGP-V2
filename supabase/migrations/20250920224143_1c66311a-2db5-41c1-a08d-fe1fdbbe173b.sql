-- Agregar políticas faltantes para las tablas recién creadas
CREATE POLICY "ReferenciaPersonalTipos visibles para todos" ON public.ReferenciaPersonalTipos FOR SELECT USING (true);

CREATE POLICY "ReferenciasPersonales visibles para usuarios autenticados" ON public.ReferenciasPersonales FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Usuarios pueden crear referencias personales" ON public.ReferenciasPersonales FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Usuarios pueden actualizar referencias personales" ON public.ReferenciasPersonales FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Representantes visibles para usuarios autenticados" ON public.Representantes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Usuarios pueden crear representantes" ON public.Representantes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Tasaciones visibles para usuarios autenticados" ON public.Tasaciones FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Usuarios pueden crear tasaciones" ON public.Tasaciones FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Telefonos visibles para usuarios autenticados" ON public.Telefonos FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Usuarios pueden crear telefonos" ON public.Telefonos FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Traspasos visibles para usuarios autenticados" ON public.Traspasos FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Usuarios pueden crear traspasos" ON public.Traspasos FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "VehiculoTipos visibles para todos" ON public.VehiculoTipos FOR SELECT USING (true);
CREATE POLICY "VehiculoEstilos visibles para todos" ON public.VehiculoEstilos FOR SELECT USING (true);

CREATE POLICY "Variables visibles para usuarios autenticados" ON public.Variables FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Usuarios pueden crear variables" ON public.Variables FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Relaciones adicionales
ALTER TABLE public.ReferenciasPersonales ADD CONSTRAINT "FK_ReferenciasPersonales_Cuentas" 
  FOREIGN KEY ("IdCuenta") REFERENCES public.Cuentas ("IdCuenta") ON DELETE CASCADE;

ALTER TABLE public.ReferenciasPersonales ADD CONSTRAINT "FK_ReferenciasPersonales_Tipos" 
  FOREIGN KEY ("IdTipoReferenciaPersonal") REFERENCES public.ReferenciaPersonalTipos ("IdTipoReferenciaPersonal");

ALTER TABLE public.Tasaciones ADD CONSTRAINT "FK_Tasaciones_Modelos" 
  FOREIGN KEY ("IdModelo") REFERENCES public.Modelos ("IdModelo");

ALTER TABLE public.Telefonos ADD CONSTRAINT "FK_Telefonos_Cuentas" 
  FOREIGN KEY ("IdCuenta") REFERENCES public.Cuentas ("IdCuenta") ON DELETE CASCADE;

ALTER TABLE public.Traspasos ADD CONSTRAINT "FK_Traspasos_Prestamos" 
  FOREIGN KEY ("IdPrestamo") REFERENCES public.Prestamos ("IdPrestamo") ON DELETE CASCADE;

ALTER TABLE public.Traspasos ADD CONSTRAINT "FK_Traspasos_Cuentas" 
  FOREIGN KEY ("IdCuenta") REFERENCES public.Cuentas ("IdCuenta");