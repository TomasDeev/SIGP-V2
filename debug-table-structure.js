import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Leer variables de entorno del archivo .env
const envContent = fs.readFileSync('.env', 'utf8');
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

async function debugTableStructure() {
  console.log('🔍 Verificando estructura de la tabla empresas...');
  
  try {
    // Primero, intentar obtener la estructura actual
    console.log('\n1. Obteniendo estructura actual de la tabla empresas:');
    const { data: existingData, error: selectError } = await supabase
      .from('empresas')
      .select('*')
      .limit(1);

    if (selectError) {
      console.log('❌ Error al consultar:', selectError.message);
      return;
    }

    console.log('✅ Tabla "empresas" accesible');
    console.log('Datos existentes:', existingData);

    // Probar inserción con diferentes combinaciones de campos
    console.log('\n2. Probando inserción con campos básicos:');
    
    // Intentar con campos en minúscula
    let testData = {
      "razon_social": "Test Company S.A.",
      "nombre_comercial": "Test Company",
      "rnc": "123456789",
      "direccion": "Calle Test 123",
      "telefono": "809-555-0123"
    };

    let { data: insertData, error: insertError } = await supabase
      .from('empresas')
      .insert(testData)
      .select()
      .single();

    if (insertError) {
      console.log('❌ Error con campos en minúscula:', insertError.message);
      
      // Intentar con campos en PascalCase
      console.log('\n3. Probando con campos en PascalCase:');
      testData = {
        "RazonSocial": "Test Company S.A.",
        "NombreComercial": "Test Company",
        "RNC": "123456789",
        "Direccion": "Calle Test 123",
        "Telefono": "809-555-0123"
      };

      const result2 = await supabase
        .from('empresas')
        .insert(testData)
        .select()
        .single();

      insertData = result2.data;
      insertError = result2.error;
    }

    if (!insertError) {
      console.log('✅ Inserción exitosa');
      console.log('Datos insertados:', insertData);
      
      // Limpiar datos de prueba
      const idField = insertData.id || insertData.IdEmpresa || insertData.ID;
      if (idField) {
        await supabase
          .from('empresas')
          .delete()
          .eq('id', idField);
        console.log('\n🧹 Datos de prueba eliminados');
      }
    } else {
      console.log('❌ Error en inserción final:', insertError.message);
      console.log('Detalles del error:', insertError);
    }

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

debugTableStructure();