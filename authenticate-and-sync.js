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

async function authenticateAndSync() {
  console.log('🔐 Autenticando usuario y sincronizando...\n');

  try {
    // 1. Intentar autenticar al usuario
    console.log('1. Intentando autenticar usuario...');
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'jdiaz@clavoservices.com',
      password: 'TempPassword123!'
    });

    if (authError) {
      console.log('❌ Error autenticando:', authError.message);
      
      // Si no puede autenticar, intentar crear el usuario de nuevo
      console.log('🔄 Intentando crear usuario de nuevo...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'jdiaz@clavoservices.com',
        password: 'TempPassword123!',
        options: {
          data: {
            username: 'jdiaz',
            first_name: 'José',
            last_name: 'Díaz',
            full_name: 'José Díaz'
          }
        }
      });
      
      if (signUpError) {
        console.log('❌ Error creando usuario:', signUpError.message);
      } else {
        console.log('✅ Usuario creado:', signUpData.user?.email);
      }
    } else {
      console.log('✅ Usuario autenticado:', authData.user?.email);
    }

    // 2. Verificar usuario actual
    console.log('\n2. Verificando usuario actual...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('❌ Error obteniendo usuario:', userError.message);
    } else if (user) {
      console.log('✅ Usuario actual:', user.email);
      console.log('🆔 User ID:', user.id);
      
      // 3. Ahora intentar insertar en la tabla usuarios con el usuario autenticado
      console.log('\n3. Insertando en tabla usuarios con usuario autenticado...');
      
      const userData = {
        UserId: user.id, // Usar el ID real del usuario autenticado
        IdEmpresa: 1,
        NombreUsuario: user.user_metadata?.username || 'jdiaz',
        Nombres: user.user_metadata?.first_name || 'José',
        Apellidos: user.user_metadata?.last_name || 'Díaz',
        Email: user.email,
        Activo: true
      };

      console.log('📝 Datos a insertar:', userData);

      const { data: insertData, error: insertError } = await supabase
        .from('usuarios')
        .insert(userData)
        .select();

      if (insertError) {
        console.log('❌ Error insertando:', insertError.message);
        
        // Intentar upsert
        console.log('🔄 Intentando upsert...');
        const { data: upsertData, error: upsertError } = await supabase
          .from('usuarios')
          .upsert(userData, { onConflict: 'UserId' })
          .select();
        
        if (upsertError) {
          console.log('❌ Error con upsert:', upsertError.message);
          
          // Intentar update si ya existe
          console.log('🔄 Intentando update...');
          const { data: updateData, error: updateError } = await supabase
            .from('usuarios')
            .update({
              NombreUsuario: userData.NombreUsuario,
              Nombres: userData.Nombres,
              Apellidos: userData.Apellidos,
              Email: userData.Email,
              Activo: userData.Activo
            })
            .eq('UserId', userData.UserId)
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
    } else {
      console.log('❌ No hay usuario autenticado');
    }

    // 4. Verificar resultado final
    console.log('\n4. Verificando resultado final...');
    const { data: finalData, error: finalError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('Email', 'jdiaz@clavoservices.com');

    if (finalError) {
      console.log('❌ Error verificando:', finalError.message);
    } else {
      console.log('✅ Usuarios encontrados:', finalData.length);
      if (finalData.length > 0) {
        finalData.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.Email} - ${user.Nombres} ${user.Apellidos} (ID: ${user.IdUsuario})`);
        });
      }
    }

    // 5. Cerrar sesión
    console.log('\n5. Cerrando sesión...');
    await supabase.auth.signOut();
    console.log('✅ Sesión cerrada');

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar autenticación y sincronización
authenticateAndSync().then(() => {
  console.log('\n✅ Proceso completado');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error ejecutando proceso:', error);
  process.exit(1);
});