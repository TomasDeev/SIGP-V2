import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qanuxayxehaimiknxvlw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugUserSearch() {
  console.log('🔍 Buscando usuario específico...\n');

  const userId = '17dcbe83-108a-4bca-9f6d-89b2d17bee85';

  try {
    // Buscar usuario en tabla usuarios
    console.log('📋 Buscando en tabla usuarios...');
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('UserId', userId);

    if (usuariosError) {
      console.error('❌ Error buscando usuario:', usuariosError.message);
      console.error('📝 Error details:', usuariosError);
    } else {
      console.log('✅ Usuarios encontrados:', usuarios.length);
      if (usuarios.length > 0) {
        console.log('📝 Usuario encontrado:', JSON.stringify(usuarios[0], null, 2));
      } else {
        console.log('⚠️ No se encontró usuario con UserId:', userId);
      }
    }

    // Buscar todos los usuarios para ver qué hay
    console.log('\n📋 Listando todos los usuarios...');
    const { data: allUsers, error: allUsersError } = await supabase
      .from('usuarios')
      .select('IdUsuario, NombreUsuario, Nombres, Apellidos, Email, UserId, IdEmpresa')
      .limit(10);

    if (allUsersError) {
      console.error('❌ Error listando usuarios:', allUsersError.message);
    } else {
      console.log('✅ Total usuarios encontrados:', allUsers.length);
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.Nombres} ${user.Apellidos} (${user.Email}) - UserId: ${user.UserId}`);
      });
    }

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

debugUserSearch();