import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Leer variables de entorno del archivo .env
let supabaseUrl, supabaseKey;
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  const envLines = envContent.split('\n');
  
  for (const line of envLines) {
    if (line.startsWith('VITE_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim();
    }
  }
} catch (error) {
  console.error('❌ Error leyendo .env:', error.message);
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno faltantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAuthStatus() {
  console.log('🔍 Verificando estado de autenticación...\n');

  try {
    // 1. Verificar sesión actual
    console.log('1️⃣ Verificando sesión actual...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Error obteniendo sesión:', sessionError.message);
      return;
    }

    if (session) {
      console.log('✅ Hay una sesión activa');
      console.log('👤 Usuario:', session.user.email);
      console.log('🔑 Token presente:', !!session.access_token);
      console.log('⏰ Expira:', new Date(session.expires_at * 1000).toLocaleString());
      
      // Probar inserción con usuario autenticado
      console.log('\n2️⃣ Probando inserción con usuario autenticado...');
      const empresaData = {
        RazonSocial: 'Test Debug Auth',
        NombreComercial: 'Test Debug',
        Telefono: '123456789',
        Email: 'debug@test.com',
        Direccion: 'Test Address',
        EstadoId: 1
      };

      const { data: insertData, error: insertError } = await supabase
        .from('empresas')
        .insert([empresaData])
        .select();

      if (insertError) {
        console.log('❌ Error insertando empresa:', insertError);
        console.log('📝 Código:', insertError.code);
        console.log('💬 Mensaje:', insertError.message);
      } else {
        console.log('✅ Empresa insertada exitosamente');
        console.log('📊 Datos:', insertData);

        // Limpiar
        if (insertData && insertData[0]) {
          await supabase
            .from('empresas')
            .delete()
            .eq('IdEmpresa', insertData[0].IdEmpresa);
          console.log('🧹 Datos de prueba eliminados');
        }
      }
    } else {
      console.log('❌ No hay sesión activa');
      console.log('💡 El usuario no está autenticado');
      
      // Verificar si hay usuarios en auth.users
      console.log('\n2️⃣ Verificando usuarios existentes...');
      
      // Intentar hacer login con credenciales de prueba
      console.log('\n3️⃣ Intentando login con credenciales de prueba...');
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      });

      if (loginError) {
        console.log('❌ Error en login:', loginError.message);
        
        // Intentar registrar usuario
        console.log('\n4️⃣ Intentando registrar usuario de prueba...');
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: 'test@example.com',
          password: 'password123',
        });

        if (signupError) {
          console.log('❌ Error en registro:', signupError.message);
        } else {
          console.log('✅ Usuario registrado:', signupData.user?.email);
        }
      } else {
        console.log('✅ Login exitoso:', loginData.user?.email);
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

debugAuthStatus();