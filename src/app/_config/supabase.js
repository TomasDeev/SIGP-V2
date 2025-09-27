import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase usando variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://qanuxayxehaimiknxvlw.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs";

// Validación de variables de entorno
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltan las variables de entorno de Supabase. Verifica tu archivo .env');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Configurada' : '✗ Faltante');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Configurada' : '✗ Faltante');
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Función helper para verificar la conexión
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('empresas').select('IdEmpresa').limit(1);
    if (error) {
      console.error('Error de conexión con Supabase:', error);
      return false;
    }
    console.log('✓ Conexión con Supabase establecida correctamente');
    return true;
  } catch (error) {
    console.error('Error al conectar con Supabase:', error);
    return false;
  }
};

export default supabase;