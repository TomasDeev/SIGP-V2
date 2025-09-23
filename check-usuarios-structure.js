import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Leer variables del archivo .env
const envContent = fs.readFileSync('.env', 'utf8');
const envLines = envContent.split('\n');
const envVars = {};

envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim().replace(/['"]/g, '');
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsuariosStructure() {
  console.log('🔍 Verificando estructura de tablas de usuarios...\n');

  try {
    // Verificar tabla usuarios (minúscula)
    console.log('📋 Verificando tabla "usuarios" (minúscula):');
    const { data: usuariosData, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .limit(1);
    
    if (usuariosError) {
      console.log('❌ Error con tabla "usuarios":', usuariosError.message);
    } else {
      console.log('✅ Tabla "usuarios" existe');
      console.log('📊 Estructura:', Object.keys(usuariosData[0] || {}));
    }

    // Verificar tabla Usuarios (mayúscula)
    console.log('\n📋 Verificando tabla "Usuarios" (mayúscula):');
    const { data: UsuariosData, error: UsuariosError } = await supabase
      .from('Usuarios')
      .select('*')
      .limit(1);
    
    if (UsuariosError) {
      console.log('❌ Error con tabla "Usuarios":', UsuariosError.message);
    } else {
      console.log('✅ Tabla "Usuarios" existe');
      console.log('📊 Estructura:', Object.keys(UsuariosData[0] || {}));
    }

    // Verificar auth.users
    console.log('\n👤 Verificando usuarios en auth.users:');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('❌ Error accediendo auth.users:', authError.message);
    } else {
      console.log('✅ Usuarios en auth.users:', authUsers.users.length);
      authUsers.users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email} (ID: ${user.id})`);
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar verificación
checkUsuariosStructure().then(() => {
  console.log('\n✅ Verificación completada');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error ejecutando verificación:', error);
  process.exit(1);
});