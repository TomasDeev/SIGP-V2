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

async function directInsertUsuarios() {
  console.log('🎯 Insertando directamente en tabla usuarios...\n');

  try {
    // Basándome en la estructura de la base de datos proporcionada,
    // voy a intentar insertar usando diferentes enfoques
    
    console.log('1. Verificando estructura de la tabla usuarios...');
    
    // Primero verificar qué columnas tiene la tabla
    const { data: testData, error: testError } = await supabase
      .from('usuarios')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.log('❌ Error accediendo tabla usuarios:', testError.message);
      return;
    }
    
    console.log('✅ Tabla usuarios accesible');
    
    // 2. Intentar insertar con diferentes estructuras de datos
    console.log('\n2. Intentando insertar usuario...');
    
    // Estructura basada en el esquema de la base de datos proporcionado
    const userData = {
      idusuario: null, // GENERATED ALWAYS AS IDENTITY
      idempresa: 1,
      nombreusuario: 'jdiaz',
      nombres: 'José',
      apellidos: 'Díaz',
      email: 'jdiaz@clavoservices.com',
      activo: true,
      fechacreacion: new Date().toISOString(),
      regid: null // DEFAULT gen_random_uuid()
    };

    console.log('📝 Intentando con estructura minúscula:', userData);
    
    let { data: insertData, error: insertError } = await supabase
      .from('usuarios')
      .insert(userData)
      .select();

    if (insertError) {
      console.log('❌ Error con estructura minúscula:', insertError.message);
      
      // Intentar con estructura de mayúsculas
      const userDataCaps = {
        IdUsuario: null,
        IdEmpresa: 1,
        NombreUsuario: 'jdiaz',
        Nombres: 'José',
        Apellidos: 'Díaz',
        Email: 'jdiaz@clavoservices.com',
        Activo: true,
        FechaCreacion: new Date().toISOString(),
        RegID: null
      };

      console.log('📝 Intentando con estructura mayúscula:', userDataCaps);
      
      const { data: insertData2, error: insertError2 } = await supabase
        .from('usuarios')
        .insert(userDataCaps)
        .select();

      if (insertError2) {
        console.log('❌ Error con estructura mayúscula:', insertError2.message);
        
        // Intentar sin campos auto-generados
        const userDataSimple = {
          idempresa: 1,
          nombreusuario: 'jdiaz',
          nombres: 'José',
          apellidos: 'Díaz',
          email: 'jdiaz@clavoservices.com',
          activo: true
        };

        console.log('📝 Intentando con estructura simple:', userDataSimple);
        
        const { data: insertData3, error: insertError3 } = await supabase
          .from('usuarios')
          .insert(userDataSimple)
          .select();

        if (insertError3) {
          console.log('❌ Error con estructura simple:', insertError3.message);
          
          // Intentar con estructura mixta
          const userDataMixed = {
            IdEmpresa: 1,
            nombreusuario: 'jdiaz',
            nombres: 'José',
            apellidos: 'Díaz',
            email: 'jdiaz@clavoservices.com',
            activo: true
          };

          console.log('📝 Intentando con estructura mixta:', userDataMixed);
          
          const { data: insertData4, error: insertError4 } = await supabase
            .from('usuarios')
            .insert(userDataMixed)
            .select();

          if (insertError4) {
            console.log('❌ Error con estructura mixta:', insertError4.message);
            
            // Último intento: usar SQL raw si está disponible
            console.log('🔧 Último intento con SQL directo...');
            try {
              const { data: sqlData, error: sqlError } = await supabase
                .rpc('exec_sql', {
                  sql: `
                    INSERT INTO public.usuarios (idempresa, nombreusuario, nombres, apellidos, email, activo)
                    VALUES (1, 'jdiaz', 'José', 'Díaz', 'jdiaz@clavoservices.com', true)
                    RETURNING *;
                  `
                });
              
              if (sqlError) {
                console.log('❌ Error con SQL directo:', sqlError.message);
              } else {
                console.log('✅ Usuario insertado con SQL directo:', sqlData);
              }
            } catch (sqlErr) {
              console.log('❌ Error ejecutando SQL:', sqlErr.message);
            }
          } else {
            console.log('✅ Usuario insertado con estructura mixta:', insertData4);
          }
        } else {
          console.log('✅ Usuario insertado con estructura simple:', insertData3);
        }
      } else {
        console.log('✅ Usuario insertado con estructura mayúscula:', insertData2);
      }
    } else {
      console.log('✅ Usuario insertado con estructura minúscula:', insertData);
    }

    // 3. Verificar resultado final
    console.log('\n3. Verificando resultado final...');
    const { data: finalData, error: finalError } = await supabase
      .from('usuarios')
      .select('*');

    if (finalError) {
      console.log('❌ Error verificando usuarios:', finalError.message);
    } else {
      console.log('✅ Total de usuarios en la tabla:', finalData.length);
      if (finalData.length > 0) {
        console.log('\n👥 Usuarios encontrados:');
        finalData.forEach((user, index) => {
          const email = user.email || user.Email;
          const nombres = user.nombres || user.Nombres;
          const apellidos = user.apellidos || user.Apellidos;
          const id = user.idusuario || user.IdUsuario;
          console.log(`  ${index + 1}. ${email} - ${nombres} ${apellidos} (ID: ${id})`);
        });
        
        // Buscar específicamente nuestro usuario
        const targetUser = finalData.find(u => 
          (u.email || u.Email) === 'jdiaz@clavoservices.com'
        );
        
        if (targetUser) {
          console.log('\n🎯 ¡Usuario objetivo encontrado!');
          console.log(JSON.stringify(targetUser, null, 2));
        } else {
          console.log('\n⚠️ Usuario objetivo NO encontrado en la tabla');
        }
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar inserción directa
directInsertUsuarios().then(() => {
  console.log('\n✅ Proceso de inserción directa completado');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error ejecutando inserción directa:', error);
  process.exit(1);
});