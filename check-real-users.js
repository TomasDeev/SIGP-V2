import { createClient } from '@supabase/supabase-js';

// Usar credenciales de Supabase del archivo .env
const supabaseUrl = 'https://qanuxayxehaimiknxvlw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRealUsers() {
  console.log('🔍 Verificando usuarios reales en la base de datos...\n');

  try {
    // Nota: No podemos acceder a auth.users con la clave anon
    console.log('📋 Usuarios en auth.users: (No accesible con clave anon)');

    console.log('\n📋 Usuarios en tabla usuarios (lowercase):');
    // Verificar usuarios en tabla usuarios (lowercase)
    const { data: usuariosData, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*');
    
    if (usuariosError) {
      console.error('❌ Error obteniendo usuarios de tabla usuarios:', usuariosError);
    } else {
      console.log(`✅ Total de usuarios en tabla usuarios: ${usuariosData.length}`);
      usuariosData.forEach((user, index) => {
        console.log(`   ${index + 1}. Email: ${user.Email}, Usuario: ${user.NombreUsuario}, ID: ${user.IdUsuario}`);
      });
    }

    console.log('\n📋 Usuarios en tabla Usuarios (uppercase):');
    // Verificar usuarios en tabla Usuarios (uppercase)
    const { data: UsuariosData, error: UsuariosError } = await supabase
      .from('Usuarios')
      .select('*');
    
    if (UsuariosError) {
      console.error('❌ Error obteniendo usuarios de tabla Usuarios:', UsuariosError);
    } else {
      console.log(`✅ Total de usuarios en tabla Usuarios: ${UsuariosData.length}`);
      UsuariosData.forEach((user, index) => {
        console.log(`   ${index + 1}. Email: ${user.Email}, Usuario: ${user.NombreUsuario}, ID: ${user.IdUsuario}`);
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkRealUsers();