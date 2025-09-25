import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qanuxayxehaimiknxvlw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAuthAndCookies() {
  console.log('🔍 Debugging Auth and Cookies...\n');

  try {
    // 1. Intentar hacer login
    console.log('1️⃣ Intentando login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'jeiselperdomo@gmail.com',
      password: '12345678'
    });

    if (authError) {
      console.error('❌ Error en login:', authError.message);
      return;
    }

    console.log('✅ Login exitoso');
    console.log('📝 Auth User:', JSON.stringify(authData.user, null, 2));
    console.log('📝 Session:', JSON.stringify(authData.session, null, 2));

    // 2. Verificar la sesión actual
    console.log('\n2️⃣ Verificando sesión actual...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Error obteniendo sesión:', sessionError.message);
    } else {
      console.log('✅ Sesión actual:', sessionData.session ? 'Existe' : 'No existe');
      if (sessionData.session) {
        console.log('📝 User ID:', sessionData.session.user.id);
        console.log('📝 Email:', sessionData.session.user.email);
      }
    }

    // 3. Buscar usuario en tabla usuarios
    console.log('\n3️⃣ Buscando usuario en tabla usuarios...');
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('UserId', authData.user.id);

    if (usuariosError) {
      console.error('❌ Error buscando usuario:', usuariosError.message);
    } else {
      console.log('✅ Usuarios encontrados:', usuarios.length);
      if (usuarios.length > 0) {
        console.log('📝 Usuario:', JSON.stringify(usuarios[0], null, 2));
      }
    }

    // 4. Simular la estructura de cookie que debería existir
    console.log('\n4️⃣ Estructura de cookie que debería existir:');
    const cookieStructure = {
      user: authData.user,
      session: authData.session
    };
    console.log('📝 Cookie structure:', JSON.stringify(cookieStructure, null, 2));

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

debugAuthAndCookies();