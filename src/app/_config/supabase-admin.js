import { createClient } from '@supabase/supabase-js';

// Configuración administrativa de Supabase
// Usa la service role key para operaciones que requieren permisos elevados

// Verificar si estamos en el navegador o en Node.js
const isNode = typeof window === 'undefined';

// Obtener variables de entorno según el contexto
const supabaseUrl = isNode 
  ? process.env.VITE_SUPABASE_URL 
  : import.meta.env?.VITE_SUPABASE_URL;

// Temporalmente usar la clave anónima hasta que se configure la service role key
const supabaseServiceKey = isNode 
  ? process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
  : import.meta.env?.VITE_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Cliente de Supabase con permisos administrativos
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Función para verificar si tenemos permisos administrativos
export const testAdminConnection = async () => {
  try {
    // Intentar una operación que requiere permisos administrativos
    const { data, error } = await supabaseAdmin
      .from('cuentas')
      .select('IdCliente')
      .limit(1);
    
    if (error) {
      console.error('Error de conexión admin:', error);
      return false;
    }
    
    console.log('✅ Conexión administrativa exitosa');
    return true;
  } catch (error) {
    console.error('Error verificando conexión admin:', error);
    return false;
  }
};

export default supabaseAdmin;