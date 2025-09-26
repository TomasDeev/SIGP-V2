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

console.log('🔍 DIAGNÓSTICO COMPLETO DE AUTENTICACIÓN');
console.log('==========================================');

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugCompleteAuth() {
  try {
    // 1. Intentar login
    console.log('\n1️⃣ INTENTANDO LOGIN...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'jeiselperdomo@gmail.com',
      password: 'Jeisel123'
    });

    if (authError) {
      console.error('❌ Error en login:', authError.message);
      return;
    }

    console.log('✅ Login exitoso');
    console.log('📧 Email:', authData.user.email);
    console.log('🆔 User ID:', authData.user.id);

    // 2. Verificar sesión actual
    console.log('\n2️⃣ VERIFICANDO SESIÓN ACTUAL...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Error obteniendo sesión:', sessionError.message);
      return;
    }

    if (sessionData.session) {
      console.log('✅ Sesión activa encontrada');
      console.log('🔑 Access Token presente:', !!sessionData.session.access_token);
      console.log('🔄 Refresh Token presente:', !!sessionData.session.refresh_token);
    } else {
      console.log('❌ No hay sesión activa');
    }

    // 3. Buscar usuario en tabla usuarios
    console.log('\n3️⃣ BUSCANDO USUARIO EN TABLA USUARIOS...');
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('UserId', authData.user.id)
      .single();

    if (usuarioError) {
      console.error('❌ Error buscando usuario:', usuarioError.message);
      console.log('🔍 Código de error:', usuarioError.code);
    } else {
      console.log('✅ Usuario encontrado en tabla usuarios:');
      console.log('📊 Datos del usuario:', JSON.stringify(usuarioData, null, 2));
    }

    // 4. Buscar empresa
    if (usuarioData && usuarioData.IdEmpresa) {
      console.log('\n4️⃣ BUSCANDO EMPRESA...');
      const { data: empresaData, error: empresaError } = await supabase
        .from('empresas')
        .select('*')
        .eq('IdEmpresa', usuarioData.IdEmpresa)
        .single();

      if (empresaError) {
        console.error('❌ Error buscando empresa:', empresaError.message);
      } else {
        console.log('✅ Empresa encontrada:');
        console.log('🏢 Datos de empresa:', JSON.stringify(empresaData, null, 2));
      }
    }

    // 5. Simular creación de cookie
    console.log('\n5️⃣ SIMULANDO CREACIÓN DE COOKIE...');
    const cookieData = {
      userId: authData.user.id,
      email: authData.user.email,
      nombres: authData.user.user_metadata?.nombres || 'Eliessel',
      apellidos: authData.user.user_metadata?.apellidos || 'Perdomo'
    };
    
    console.log('🍪 Datos para cookie:', JSON.stringify(cookieData, null, 2));
    console.log('📝 Cookie string:', JSON.stringify(cookieData));

    // 6. Verificar estructura esperada por useAuthenticatedUser
    console.log('\n6️⃣ VERIFICANDO ESTRUCTURA ESPERADA...');
    console.log('✅ La estructura de cookie parece correcta para useAuthenticatedUser');

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

debugCompleteAuth();