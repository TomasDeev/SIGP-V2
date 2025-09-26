import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Leer variables de entorno
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

console.log('🔧 CREANDO USUARIO DE PRUEBA COMPLETO');
console.log('====================================');

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUserComplete() {
  try {
    const testEmail = 'test@sigp.com';
    const testPassword = 'test123456';

    // 1. Crear usuario en Supabase Auth
    console.log('\n1️⃣ CREANDO USUARIO EN SUPABASE AUTH...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          nombres: 'Usuario',
          apellidos: 'Prueba'
        }
      }
    });

    if (signUpError) {
      console.log('⚠️ Error en signup (puede que ya exista):', signUpError.message);
      
      // Intentar login si ya existe
      console.log('\n🔄 INTENTANDO LOGIN CON USUARIO EXISTENTE...');
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });

      if (loginError) {
        console.error('❌ Error en login:', loginError.message);
        return;
      }

      console.log('✅ Login exitoso con usuario existente');
      console.log('🆔 User ID:', loginData.user.id);
      
      // Verificar si ya existe en tabla usuarios
      const { data: existingUser, error: existingError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('UserId', loginData.user.id)
        .single();

      if (existingError) {
        console.log('📝 Usuario no existe en tabla usuarios, creando...');
        
        // Crear en tabla usuarios
        const { data: newUsuario, error: insertError } = await supabase
          .from('usuarios')
          .upsert({
            UserId: loginData.user.id,
            Email: testEmail,
            Nombres: 'Usuario',
            Apellidos: 'Prueba',
            NombreUsuario: 'usuarioprueba',
            IdEmpresa: 1,
            Activo: true
          })
          .select()
          .single();

        if (insertError) {
          console.error('❌ Error insertando usuario:', insertError.message);
          return;
        }

        console.log('✅ Usuario creado en tabla usuarios:', newUsuario);
      } else {
        console.log('✅ Usuario ya existe en tabla usuarios:', existingUser);
      }

    } else {
      console.log('✅ Usuario creado en Supabase Auth');
      console.log('🆔 User ID:', signUpData.user.id);
      console.log('📧 Email:', signUpData.user.email);

      // 2. Crear usuario en tabla usuarios
      console.log('\n2️⃣ CREANDO USUARIO EN TABLA USUARIOS...');
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .upsert({
          UserId: signUpData.user.id,
          Email: testEmail,
          Nombres: 'Usuario',
          Apellidos: 'Prueba',
          NombreUsuario: 'usuarioprueba',
          IdEmpresa: 1,
          Activo: true
        })
        .select()
        .single();

      if (usuarioError) {
        console.error('❌ Error creando usuario en tabla:', usuarioError.message);
        return;
      }

      console.log('✅ Usuario creado en tabla usuarios:', usuarioData);
    }

    // 3. Verificar que la empresa existe
    console.log('\n3️⃣ VERIFICANDO EMPRESA...');
    const { data: empresaData, error: empresaError } = await supabase
      .from('empresas')
      .select('*')
      .eq('IdEmpresa', 1)
      .single();

    if (empresaError) {
      console.log('⚠️ Empresa no encontrada, creando empresa de prueba...');
      
      const { data: newEmpresa, error: newEmpresaError } = await supabase
        .from('empresas')
        .upsert({
          IdEmpresa: 1,
          RazonSocial: 'Empresa de Prueba SIGP',
          NombreComercial: 'SIGP Test',
          RNC: '123456789',
          Direccion: 'Dirección de Prueba',
          Presidente: 'Presidente Prueba',
          CedulaPresidente: '12345678901',
          Abogado: 'Abogado Prueba',
          CedulaAbogado: '12345678902',
          DireccionAbogado: 'Dirección Abogado',
          Alguacil: 'Alguacil Prueba',
          Activo: true
        })
        .select()
        .single();

      if (newEmpresaError) {
        console.error('❌ Error creando empresa:', newEmpresaError.message);
      } else {
        console.log('✅ Empresa creada:', newEmpresa);
      }
    } else {
      console.log('✅ Empresa encontrada:', empresaData.RazonSocial);
    }

    // 4. Hacer login final para verificar
    console.log('\n4️⃣ VERIFICACIÓN FINAL - LOGIN...');
    const { data: finalLogin, error: finalError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (finalError) {
      console.error('❌ Error en login final:', finalError.message);
    } else {
      console.log('✅ ¡LOGIN FINAL EXITOSO!');
      console.log('📧 Email:', finalLogin.user.email);
      console.log('🆔 User ID:', finalLogin.user.id);
      console.log('🔑 Token presente:', !!finalLogin.session.access_token);
      
      console.log('\n🎉 ¡USUARIO DE PRUEBA LISTO!');
      console.log('📝 Credenciales para usar:');
      console.log(`   Email: ${testEmail}`);
      console.log(`   Password: ${testPassword}`);
      console.log('\n💡 Ahora puedes hacer login en la aplicación con estas credenciales.');
    }

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

createTestUserComplete();