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

async function insertUserFinal() {
  console.log('🚀 Insertando usuario en la tabla usuarios...\n');

  try {
    // Primero verificar qué tabla existe realmente
    console.log('🔍 Verificando tablas disponibles...');
    
    // Intentar con usuarios (minúscula)
    let tableName = 'usuarios';
    let { data: testData, error: testError } = await supabase
      .from('usuarios')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.log('❌ Tabla "usuarios" no accesible:', testError.message);
      
      // Intentar con Usuarios (mayúscula)
      tableName = 'Usuarios';
      const { data: testData2, error: testError2 } = await supabase
        .from('Usuarios')
        .select('*')
        .limit(1);
      
      if (testError2) {
        console.log('❌ Tabla "Usuarios" no accesible:', testError2.message);
        console.log('❌ No se puede acceder a ninguna tabla de usuarios');
        return;
      } else {
        console.log('✅ Usando tabla "Usuarios" (mayúscula)');
      }
    } else {
      console.log('✅ Usando tabla "usuarios" (minúscula)');
    }

    // Datos del usuario a insertar
    const userData = {
      IdEmpresa: 1, // ID de empresa por defecto
      NombreUsuario: 'jdiaz',
      Nombres: 'José',
      Apellidos: 'Díaz',
      Email: 'jdiaz@clavoservices.com',
      Activo: true
    };

    // Si es la tabla con mayúsculas, usar nombres con comillas
    if (tableName === 'Usuarios') {
      const userDataQuoted = {
        '"IdEmpresa"': userData.IdEmpresa,
        '"NombreUsuario"': userData.NombreUsuario,
        '"Nombres"': userData.Nombres,
        '"Apellidos"': userData.Apellidos,
        '"Email"': userData.Email,
        '"Activo"': userData.Activo
      };
      userData = userDataQuoted;
    }

    console.log('📝 Insertando usuario:', userData);

    // Intentar insertar el usuario
    const { data: insertData, error: insertError } = await supabase
      .from(tableName)
      .insert(userData)
      .select();

    if (insertError) {
      console.log('❌ Error insertando usuario:', insertError.message);
      
      // Si falla por RLS, intentar con upsert
      console.log('🔄 Intentando con upsert...');
      const { data: upsertData, error: upsertError } = await supabase
        .from(tableName)
        .upsert(userData, { onConflict: 'Email' })
        .select();
      
      if (upsertError) {
        console.log('❌ Error con upsert:', upsertError.message);
      } else {
        console.log('✅ Usuario insertado con upsert:', upsertData);
      }
    } else {
      console.log('✅ Usuario insertado exitosamente:', insertData);
    }

    // Verificar el resultado final
    console.log('\n🔍 Verificando usuarios en la tabla...');
    const { data: finalData, error: finalError } = await supabase
      .from(tableName)
      .select('*');

    if (finalError) {
      console.log('❌ Error verificando usuarios:', finalError.message);
    } else {
      console.log('📊 Usuarios en la tabla:', finalData.length);
      finalData.forEach((user, index) => {
        const email = user.Email || user.email;
        const nombres = user.Nombres || user.nombres || user.NombreUsuario || user.nombre_usuario;
        console.log(`  ${index + 1}. ${email} - ${nombres}`);
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar inserción
insertUserFinal().then(() => {
  console.log('\n✅ Proceso completado');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error ejecutando inserción:', error);
  process.exit(1);
});