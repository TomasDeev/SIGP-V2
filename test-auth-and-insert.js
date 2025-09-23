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

async function testAuthAndInsert() {
  console.log('🔐 Probando autenticación y inserción de empresa...\n');

  try {
    // 1. Registrar un usuario
    console.log('1️⃣ Registrando usuario...');
    const email = `test${Date.now()}@example.com`;
    const password = 'password123';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.log('❌ Error en registro:', signUpError.message);
      
      // Intentar hacer login si el usuario ya existe
      console.log('🔄 Intentando hacer login...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'test.user@example.com', // Usuario fijo para pruebas
        password: 'password123',
      });

      if (signInError) {
        console.log('❌ Error en login:', signInError.message);
        return;
      }
      
      console.log('✅ Login exitoso');
      console.log('👤 Usuario:', signInData.user?.email);
    } else {
      console.log('✅ Registro exitoso');
      console.log('👤 Usuario:', signUpData.user?.email);
    }

    // 2. Verificar sesión actual
    console.log('\n2️⃣ Verificando sesión...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Error obteniendo sesión:', sessionError.message);
      return;
    }

    if (!session) {
      console.log('❌ No hay sesión activa');
      return;
    }

    console.log('✅ Sesión activa');
    console.log('🔑 Token presente:', !!session.access_token);
    console.log('👤 Usuario ID:', session.user.id);

    // 3. Intentar insertar empresa
    console.log('\n3️⃣ Insertando empresa...');
    const empresaData = {
      Nombre: 'Empresa de Prueba',
      Descripcion: 'Descripción de prueba',
      Telefono: '123456789',
      Email: 'empresa@test.com',
      Direccion: 'Dirección de prueba',
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
      console.log('💡 Detalles:', insertError.details);
    } else {
      console.log('✅ Empresa insertada exitosamente');
      console.log('📊 Datos:', insertData);

      // 4. Limpiar - eliminar la empresa de prueba
      console.log('\n4️⃣ Limpiando datos de prueba...');
      const { error: deleteError } = await supabase
        .from('empresas')
        .delete()
        .eq('Id', insertData[0].Id);

      if (deleteError) {
        console.log('⚠️ Error limpiando:', deleteError.message);
      } else {
        console.log('✅ Datos de prueba eliminados');
      }
    }

    // 5. Cerrar sesión
    console.log('\n5️⃣ Cerrando sesión...');
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      console.log('❌ Error cerrando sesión:', signOutError.message);
    } else {
      console.log('✅ Sesión cerrada');
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testAuthAndInsert();