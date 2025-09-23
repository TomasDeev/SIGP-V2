import { createClient } from '@supabase/supabase-js';

// Usar las mismas credenciales que la aplicación
const supabaseUrl = 'https://qanuxayxehaimiknxvlw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable() {
  console.log('🔍 Inspeccionando estructura de la tabla empresas...');
  
  try {
    // Intentar hacer una consulta simple para ver qué columnas están disponibles
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error consultando tabla empresas:', error);
      
      // Intentar con diferentes nombres de tabla
      console.log('🔄 Probando con diferentes nombres de tabla...');
      
      const tableNames = ['Empresas', 'empresa', 'Empresa'];
      
      for (const tableName of tableNames) {
        console.log(`🔍 Probando tabla: ${tableName}`);
        const { data: testData, error: testError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (!testError) {
          console.log(`✅ Tabla encontrada: ${tableName}`);
          console.log('📊 Estructura de datos:', testData);
          return;
        } else {
          console.log(`❌ Error con ${tableName}:`, testError.message);
        }
      }
      
      return;
    }
    
    console.log('✅ Tabla empresas encontrada');
    console.log('📊 Datos de ejemplo:', data);
    
    if (data && data.length > 0) {
      console.log('🔑 Columnas disponibles:', Object.keys(data[0]));
    } else {
      console.log('📝 Tabla vacía, intentando insertar un registro mínimo para ver la estructura...');
      
      // Intentar insertar solo campos básicos
      const minimalData = {
        RazonSocial: "Test",
        NombreComercial: "Test"
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('empresas')
        .insert([minimalData])
        .select();
      
      if (insertError) {
        console.error('❌ Error insertando datos mínimos:', insertError);
        console.log('💡 Esto nos ayuda a entender qué campos son requeridos');
      } else {
        console.log('✅ Inserción exitosa con datos mínimos:', insertData);
        console.log('🔑 Columnas disponibles:', Object.keys(insertData[0]));
      }
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar la inspección
inspectTable().then(() => {
  console.log('🏁 Inspección completada');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Error ejecutando inspección:', error);
  process.exit(1);
});