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

async function inspectUsuariosSchema() {
  console.log('🔍 Inspeccionando esquema de la tabla usuarios...\n');

  try {
    // 1. Intentar obtener información de la tabla usando diferentes métodos
    console.log('1. Intentando obtener estructura con select vacío...');
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .limit(0);
    
    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log('✅ Select vacío exitoso');
    }

    // 2. Intentar insertar con datos mínimos para ver qué columnas faltan
    console.log('\n2. Probando inserción con datos mínimos...');
    
    const minimalData = {
      email: 'test@test.com'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('usuarios')
      .insert(minimalData)
      .select();
    
    if (insertError) {
      console.log('❌ Error inserción mínima:', insertError.message);
      console.log('📝 Detalles del error:', insertError);
    } else {
      console.log('✅ Inserción mínima exitosa:', insertData);
    }

    // 3. Intentar con diferentes combinaciones de campos
    console.log('\n3. Probando diferentes combinaciones de campos...');
    
    const testFields = [
      { email: 'test1@test.com' },
      { Email: 'test2@test.com' },
      { email: 'test3@test.com', nombre: 'Test' },
      { email: 'test4@test.com', nombres: 'Test' },
      { email: 'test5@test.com', Nombres: 'Test' },
      { email: 'test6@test.com', usuario: 'test6' },
      { email: 'test7@test.com', nombreusuario: 'test7' },
      { email: 'test8@test.com', NombreUsuario: 'test8' },
    ];

    for (let i = 0; i < testFields.length; i++) {
      const testData = testFields[i];
      console.log(`\n   Probando ${i + 1}: ${JSON.stringify(testData)}`);
      
      const { data: testInsert, error: testError } = await supabase
        .from('usuarios')
        .insert(testData)
        .select();
      
      if (testError) {
        console.log(`   ❌ Error: ${testError.message}`);
      } else {
        console.log(`   ✅ Éxito:`, testInsert);
        break; // Si uno funciona, salir del loop
      }
    }

    // 4. Verificar estado final
    console.log('\n4. Verificando estado final de la tabla...');
    const { data: finalData, error: finalError } = await supabase
      .from('usuarios')
      .select('*');

    if (finalError) {
      console.log('❌ Error verificando tabla:', finalError.message);
    } else {
      console.log('✅ Total de usuarios:', finalData.length);
      if (finalData.length > 0) {
        console.log('\n👥 Usuarios encontrados:');
        finalData.forEach((user, index) => {
          console.log(`  ${index + 1}.`, JSON.stringify(user, null, 2));
        });
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
    console.error('📝 Stack trace:', error.stack);
  }
}

// Ejecutar inspección
inspectUsuariosSchema().then(() => {
  console.log('\n✅ Inspección de esquema completada');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error ejecutando inspección:', error);
  process.exit(1);
});