import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Leer variables de entorno
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugPostLogin() {
  console.log('🔍 DEBUGGING POST-LOGIN STATE...\n');

  try {
    // 1. Intentar login
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
    console.log('📧 Email:', authData.user.email);
    console.log('🆔 User ID:', authData.user.id);
    console.log('🔑 Access Token:', authData.session.access_token ? 'Presente' : 'Ausente');

    // 2. Verificar sesión actual
    console.log('\n2️⃣ Verificando sesión actual...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Error obteniendo sesión:', sessionError.message);
    } else if (sessionData.session) {
      console.log('✅ Sesión activa encontrada');
      console.log('👤 Usuario en sesión:', sessionData.session.user.email);
    } else {
      console.log('❌ No hay sesión activa');
    }

    // 3. Buscar usuario en tabla usuarios
    console.log('\n3️⃣ Buscando usuario en tabla usuarios...');
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('UserId', authData.user.id)
      .single();

    if (usuarioError) {
      console.error('❌ Error buscando usuario:', usuarioError.message);
    } else {
      console.log('✅ Usuario encontrado en tabla usuarios:');
      console.log('📝 Datos:', {
        IdUsuario: usuarioData.IdUsuario,
        Nombres: usuarioData.Nombres,
        Email: usuarioData.Email,
        IdEmpresa: usuarioData.IdEmpresa
      });
    }

    // 4. Buscar empresa
    if (usuarioData && usuarioData.IdEmpresa) {
      console.log('\n4️⃣ Buscando empresa...');
      const { data: empresaData, error: empresaError } = await supabase
        .from('empresas')
        .select('*')
        .eq('IdEmpresa', usuarioData.IdEmpresa)
        .single();

      if (empresaError) {
        console.error('❌ Error buscando empresa:', empresaError.message);
      } else {
        console.log('✅ Empresa encontrada:');
        console.log('🏢 Datos:', {
          IdEmpresa: empresaData.IdEmpresa,
          RazonSocial: empresaData.RazonSocial,
          NombreComercial: empresaData.NombreComercial
        });
      }
    }

    // 5. Simular estructura de cookie auth-user
    console.log('\n5️⃣ Estructura esperada de cookie auth-user:');
    const expectedCookie = {
      user: authData.user,
      usuario: usuarioData,
      empresa: usuarioData ? await supabase
        .from('empresas')
        .select('*')
        .eq('IdEmpresa', usuarioData.IdEmpresa)
        .single()
        .then(res => res.data) : null
    };
    
    console.log('🍪 Cookie esperada:', JSON.stringify(expectedCookie, null, 2));

    // 6. Verificar que useAuthenticatedUser funcionaría
    console.log('\n6️⃣ Verificando que useAuthenticatedUser funcionaría...');
    
    if (authData.user && usuarioData && expectedCookie.empresa) {
      console.log('✅ Todos los datos necesarios están presentes');
      console.log('✅ useAuthenticatedUser debería funcionar correctamente');
      
      // Simular lo que devolvería useAuthenticatedUser
      const mockResult = {
        user: authData.user,
        usuario: usuarioData,
        empresa: expectedCookie.empresa,
        loading: false,
        error: null
      };
      
      console.log('📊 Resultado esperado de useAuthenticatedUser:', JSON.stringify(mockResult, null, 2));
    } else {
      console.log('❌ Faltan datos para useAuthenticatedUser');
      console.log('🔍 Datos faltantes:');
      if (!authData.user) console.log('  - Usuario de Supabase Auth');
      if (!usuarioData) console.log('  - Usuario en tabla usuarios');
      if (!expectedCookie.empresa) console.log('  - Empresa');
    }

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

debugPostLogin();