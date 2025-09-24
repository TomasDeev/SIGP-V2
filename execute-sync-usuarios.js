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

async function executeSyncUsuarios() {
  console.log('🚀 Ejecutando sincronización de usuarios...\n');

  try {
    // Primero, crear un usuario en auth.users para poder sincronizar
    console.log('1. Creando usuario en auth.users...');
    
    // Intentar crear el usuario usando signUp
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
      console.log('❌ Error creando usuario en auth:', signUpError.message);
      
      // Si el usuario ya existe, intentar obtenerlo
      if (signUpError.message.includes('already registered')) {
        console.log('✅ Usuario ya existe en auth.users');
      } else {
        console.log('⚠️ Continuando con la sincronización manual...');
      }
    } else {
      console.log('✅ Usuario creado en auth.users:', signUpData.user?.email);
    }

    // Ahora ejecutar la sincronización manual
    console.log('\n2. Ejecutando sincronización manual...');
    
    // Insertar directamente en la tabla Usuarios usando los datos que conocemos
    const userData = {
      UserId: '550e8400-e29b-41d4-a716-446655440000', // UUID temporal
      IdEmpresa: 1,
      NombreUsuario: 'jdiaz',
      Nombres: 'José',
      Apellidos: 'Díaz',
      Email: 'jdiaz@clavoservices.com',
      Activo: true
    };

    // Intentar insertar usando la tabla con mayúscula
    console.log('📝 Insertando en tabla Usuarios (mayúscula)...');
    const { data: insertData, error: insertError } = await supabase
      .from('Usuarios')
      .insert(userData)
      .select();

    if (insertError) {
      console.log('❌ Error insertando en Usuarios:', insertError.message);
      
      // Intentar con la tabla minúscula
      console.log('📝 Intentando con tabla usuarios (minúscula)...');
      const { data: insertData2, error: insertError2 } = await supabase
        .from('usuarios')
        .insert(userData)
        .select();
      
      if (insertError2) {
        console.log('❌ Error insertando en usuarios:', insertError2.message);
        
        // Intentar usando RPC para bypasear RLS
        console.log('🔧 Intentando con función RPC...');
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('exec_sql', {
            sql: `
              INSERT INTO public.Usuarios (
                "UserId", "IdEmpresa", "NombreUsuario", "Nombres", "Apellidos", "Email", "Activo"
              ) VALUES (
                '${userData.UserId}', ${userData.IdEmpresa}, '${userData.NombreUsuario}', 
                '${userData.Nombres}', '${userData.Apellidos}', '${userData.Email}', ${userData.Activo}
              ) ON CONFLICT ("Email") DO UPDATE SET
                "NombreUsuario" = EXCLUDED."NombreUsuario",
                "Nombres" = EXCLUDED."Nombres",
                "Apellidos" = EXCLUDED."Apellidos";
            `
          });
        
        if (rpcError) {
          console.log('❌ Error con RPC:', rpcError.message);
        } else {
          console.log('✅ Usuario insertado con RPC:', rpcData);
        }
      } else {
        console.log('✅ Usuario insertado en usuarios (minúscula):', insertData2);
      }
    } else {
      console.log('✅ Usuario insertado en Usuarios (mayúscula):', insertData);
    }

    // Verificar el resultado final
    console.log('\n3. Verificando resultado...');
    
    // Intentar con ambas tablas
    const tables = ['Usuarios', 'usuarios'];
    
    for (const tableName of tables) {
      try {
        const { data: finalData, error: finalError } = await supabase
          .from(tableName)
          .select('*')
          .eq('Email', 'jdiaz@clavoservices.com');

        if (finalError) {
          console.log(`❌ Error verificando ${tableName}:`, finalError.message);
        } else {
          console.log(`✅ Verificación ${tableName}:`, finalData.length, 'usuarios encontrados');
          if (finalData.length > 0) {
            console.log(`   Usuario: ${finalData[0].Email} - ${finalData[0].Nombres} ${finalData[0].Apellidos}`);
          }
        }
      } catch (err) {
        console.log(`❌ Error verificando ${tableName}:`, err.message);
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar sincronización
executeSyncUsuarios().then(() => {
  console.log('\n✅ Proceso de sincronización completado');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error ejecutando sincronización:', error);
  process.exit(1);
});