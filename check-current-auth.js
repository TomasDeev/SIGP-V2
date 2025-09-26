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

console.log('🔍 VERIFICANDO ESTADO ACTUAL DE AUTENTICACIÓN');
console.log('=============================================');

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCurrentAuth() {
  try {
    // 1. Verificar si hay una sesión activa
    console.log('\n1️⃣ VERIFICANDO SESIÓN ACTUAL...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Error obteniendo sesión:', sessionError.message);
    } else if (sessionData.session) {
      console.log('✅ Sesión activa encontrada');
      console.log('📧 Email:', sessionData.session.user.email);
      console.log('🆔 User ID:', sessionData.session.user.id);
      console.log('👤 Metadata:', JSON.stringify(sessionData.session.user.user_metadata, null, 2));
    } else {
      console.log('❌ No hay sesión activa');
    }

    // 2. Intentar diferentes credenciales conocidas
    console.log('\n2️⃣ PROBANDO CREDENCIALES CONOCIDAS...');
    
    const credenciales = [
      { email: 'jeiselperdomo@gmail.com', password: 'Jeisel123' },
      { email: 'jeiselperdomo@gmail.com', password: 'jeisel123' },
      { email: 'admin@sigp.com', password: 'admin123' },
      { email: 'test@test.com', password: 'test123' }
    ];

    for (const cred of credenciales) {
      console.log(`\n🔐 Probando: ${cred.email}`);
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword(cred);
      
      if (authError) {
        console.log(`❌ Falló: ${authError.message}`);
      } else {
        console.log(`✅ ¡ÉXITO! Login con ${cred.email}`);
        console.log('🆔 User ID:', authData.user.id);
        console.log('👤 Metadata:', JSON.stringify(authData.user.user_metadata, null, 2));
        
        // Verificar usuario en tabla usuarios
        const { data: usuarioData, error: usuarioError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('UserId', authData.user.id)
          .single();

        if (usuarioError) {
          console.log('❌ Usuario NO encontrado en tabla usuarios:', usuarioError.message);
        } else {
          console.log('✅ Usuario encontrado en tabla usuarios');
          console.log('📊 Datos:', JSON.stringify(usuarioData, null, 2));
        }
        
        break; // Salir del loop si encontramos credenciales válidas
      }
    }

    // 3. Listar todos los usuarios en tabla usuarios
    console.log('\n3️⃣ LISTANDO USUARIOS EN TABLA USUARIOS...');
    const { data: allUsuarios, error: allUsuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .limit(10);

    if (allUsuariosError) {
      console.error('❌ Error listando usuarios:', allUsuariosError.message);
    } else {
      console.log(`✅ Encontrados ${allUsuarios.length} usuarios en tabla:`);
      allUsuarios.forEach((usuario, index) => {
        console.log(`${index + 1}. ID: ${usuario.IdUsuario}, Email: ${usuario.Email}, UserId: ${usuario.UserId}`);
      });
    }

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

checkCurrentAuth();