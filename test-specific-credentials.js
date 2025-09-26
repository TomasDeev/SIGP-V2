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

console.log('🔐 PROBANDO CREDENCIALES ESPECÍFICAS');
console.log('===================================');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSpecificCredentials() {
  const email = 'jeiselperdomo@gmail.com';
  const password = '12345678';

  try {
    console.log(`\n🔐 Probando: ${email} / ${password}`);
    
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (loginError) {
      console.log(`❌ Error en login: ${loginError.message}`);
      return;
    }

    console.log(`✅ ¡LOGIN EXITOSO!`);
    console.log('🆔 User ID:', loginData.user.id);
    console.log('📧 Email:', loginData.user.email);
    console.log('🔑 Token presente:', !!loginData.session.access_token);
    console.log('👤 Metadata:', JSON.stringify(loginData.user.user_metadata, null, 2));
    
    // Verificar usuario en tabla usuarios
    console.log('\n📊 VERIFICANDO USUARIO EN TABLA USUARIOS...');
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('UserId', loginData.user.id)
      .single();

    if (usuarioError) {
      console.log('❌ Usuario NO encontrado en tabla usuarios:', usuarioError.message);
    } else {
      console.log('✅ Usuario encontrado en tabla usuarios');
      console.log('📊 Datos completos:', JSON.stringify(usuarioData, null, 2));
    }

    // Verificar empresa
    if (usuarioData && usuarioData.IdEmpresa) {
      console.log('\n🏢 VERIFICANDO EMPRESA...');
      const { data: empresaData, error: empresaError } = await supabase
        .from('empresas')
        .select('*')
        .eq('IdEmpresa', usuarioData.IdEmpresa)
        .single();

      if (empresaError) {
        console.log('❌ Empresa NO encontrada:', empresaError.message);
      } else {
        console.log('✅ Empresa encontrada');
        console.log('🏢 Datos de empresa:', JSON.stringify(empresaData, null, 2));
      }
    }

    // Simular la estructura de cookie que se creará
    console.log('\n🍪 ESTRUCTURA DE COOKIE QUE SE CREARÁ:');
    const cookieStructure = {
      token: loginData.session.access_token,
      email: loginData.user.email,
      user: loginData.user,
      session: loginData.session
    };
    
    console.log('📝 Cookie data (primeros 200 caracteres):');
    const cookieString = JSON.stringify(cookieStructure);
    console.log(cookieString.substring(0, 200) + '...');

    console.log('\n🎉 ¡CREDENCIALES VÁLIDAS CONFIRMADAS!');
    console.log('💡 Ahora puedes hacer login en la aplicación web con:');
    console.log(`   📧 Email: ${email}`);
    console.log(`   🔑 Password: ${password}`);

  } catch (error) {
    console.log(`💥 Error: ${error.message}`);
  }
}

testSpecificCredentials();