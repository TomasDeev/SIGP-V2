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

async function finalInsertUsuario() {
  console.log('🎯 Inserción final del usuario jdiaz@clavoservices.com...\n');

  try {
    // 1. Primero crear el usuario en auth.users si no existe
    console.log('1. Verificando/creando usuario en auth.users...');
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'jdiaz@clavoservices.com',
      password: 'TempPassword123!', // Contraseña temporal
      options: {
        data: {
          nombres: 'José',
          apellidos: 'Díaz',
          nombreusuario: 'jdiaz'
        }
      }
    });

    if (signUpError && !signUpError.message.includes('already registered')) {
      console.log('❌ Error creando usuario en auth:', signUpError.message);
    } else {
      console.log('✅ Usuario en auth.users:', signUpData.user ? 'creado/existente' : 'verificado');
    }

    // 2. Intentar autenticar para obtener sesión
    console.log('\n2. Intentando autenticar para obtener sesión...');
    
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'jdiaz@clavoservices.com',
      password: 'TempPassword123!'
    });

    let isAuthenticated = false;
    if (signInError) {
      console.log('❌ No se pudo autenticar:', signInError.message);
      console.log('🔄 Continuando sin autenticación...');
    } else {
      console.log('✅ Usuario autenticado exitosamente');
      isAuthenticated = true;
    }

    // 3. Preparar datos del usuario para la tabla usuarios
    console.log('\n3. Preparando datos para insertar en tabla usuarios...');
    
    const userData = {
      IdEmpresa: 1,
      NombreUsuario: 'jdiaz',
      Nombres: 'José',
      Apellidos: 'Díaz',
      Email: 'jdiaz@clavoservices.com',
      Activo: true
    };

    // Si tenemos usuario autenticado, agregar UserId
    if (signInData?.user?.id) {
      userData.UserId = signInData.user.id;
    }

    console.log('📝 Datos a insertar:', userData);

    // 4. Intentar insertar en la tabla usuarios
    console.log('\n4. Insertando en tabla usuarios...');
    
    const { data: insertData, error: insertError } = await supabase
      .from('usuarios')
      .insert(userData)
      .select();

    if (insertError) {
      console.log('❌ Error insertando:', insertError.message);
      
      // Si falla, intentar upsert
      console.log('🔄 Intentando upsert...');
      const { data: upsertData, error: upsertError } = await supabase
        .from('usuarios')
        .upsert(userData, { 
          onConflict: 'Email',
          ignoreDuplicates: false 
        })
        .select();
      
      if (upsertError) {
        console.log('❌ Error con upsert:', upsertError.message);
        
        // Último intento: update si existe
        console.log('🔄 Intentando update si existe...');
        const { data: updateData, error: updateError } = await supabase
          .from('usuarios')
          .update(userData)
          .eq('Email', userData.Email)
          .select();
        
        if (updateError) {
          console.log('❌ Error con update:', updateError.message);
        } else {
          console.log('✅ Usuario actualizado:', updateData);
        }
      } else {
        console.log('✅ Usuario insertado con upsert:', upsertData);
      }
    } else {
      console.log('✅ Usuario insertado exitosamente:', insertData);
    }

    // 5. Verificar resultado final
    console.log('\n5. Verificando resultado final...');
    const { data: finalData, error: finalError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('Email', 'jdiaz@clavoservices.com');

    if (finalError) {
      console.log('❌ Error verificando usuario:', finalError.message);
    } else {
      if (finalData && finalData.length > 0) {
        console.log('🎯 ¡Usuario encontrado en la tabla!');
        console.log(JSON.stringify(finalData[0], null, 2));
      } else {
        console.log('⚠️ Usuario no encontrado en la tabla');
      }
    }

    // 6. Verificar total de usuarios
    console.log('\n6. Verificando total de usuarios en la tabla...');
    const { data: allUsers, error: allError } = await supabase
      .from('usuarios')
      .select('*');

    if (allError) {
      console.log('❌ Error obteniendo todos los usuarios:', allError.message);
    } else {
      console.log(`📊 Total de usuarios en la tabla: ${allUsers.length}`);
      if (allUsers.length > 0) {
        console.log('\n👥 Usuarios en la tabla:');
        allUsers.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.Email} - ${user.Nombres} ${user.Apellidos} (ID: ${user.IdUsuario})`);
        });
      }
    }

    // 7. Cerrar sesión si estaba autenticado
    if (isAuthenticated) {
      console.log('\n7. Cerrando sesión...');
      await supabase.auth.signOut();
      console.log('✅ Sesión cerrada');
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
    console.error('📝 Stack trace:', error.stack);
  }
}

// Ejecutar inserción final
finalInsertUsuario().then(() => {
  console.log('\n✅ Proceso de inserción final completado');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error ejecutando inserción final:', error);
  process.exit(1);
});