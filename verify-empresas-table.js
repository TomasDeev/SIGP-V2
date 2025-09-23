import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qanuxayxehaimiknxvlw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyEmpresasTable() {
  console.log('🔍 Verificando la tabla empresas en Supabase...\n');
  
  try {
    // 1. Verificar si podemos hacer SELECT en la tabla
    console.log('1️⃣ Probando SELECT en la tabla empresas...');
    const { data: selectData, error: selectError } = await supabase
      .from('empresas')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.log('❌ Error en SELECT:', selectError);
      console.log('🔍 Código:', selectError.code);
      console.log('📝 Mensaje:', selectError.message);
      
      if (selectError.code === 'PGRST106') {
        console.log('💡 La tabla "empresas" no existe o no es accesible');
        
        // Intentar con 'Empresas' (mayúscula)
        console.log('\n2️⃣ Probando con "Empresas" (mayúscula)...');
        const { data: selectDataCap, error: selectErrorCap } = await supabase
          .from('Empresas')
          .select('*')
          .limit(1);
        
        if (selectErrorCap) {
          console.log('❌ Error con "Empresas":', selectErrorCap);
        } else {
          console.log('✅ ¡La tabla se llama "Empresas" (con mayúscula)!');
          console.log('📊 Datos encontrados:', selectDataCap);
        }
      }
    } else {
      console.log('✅ SELECT exitoso en tabla "empresas"');
      console.log('📊 Datos encontrados:', selectData);
    }
    
    // 3. Verificar la estructura de la tabla
    console.log('\n3️⃣ Verificando estructura de la tabla...');
    
    // Intentar obtener información de columnas usando una consulta que falle intencionalmente
    const { data: structureData, error: structureError } = await supabase
      .from('empresas')
      .select('IdEmpresa, RazonSocial, NombreComercial, RNC')
      .limit(1);
    
    if (structureError) {
      console.log('❌ Error verificando estructura:', structureError);
      
      // Si falla, intentar con nombres de columnas en minúsculas
      console.log('\n4️⃣ Probando con nombres de columnas en minúsculas...');
      const { data: lowerData, error: lowerError } = await supabase
        .from('empresas')
        .select('idempresa, razonsocial, nombrecomercial, rnc')
        .limit(1);
      
      if (lowerError) {
        console.log('❌ Error con minúsculas:', lowerError);
      } else {
        console.log('✅ Las columnas están en minúsculas');
        console.log('📊 Datos:', lowerData);
      }
    } else {
      console.log('✅ Estructura verificada - columnas con mayúsculas');
      console.log('📊 Datos:', structureData);
    }
    
    // 4. Intentar un INSERT de prueba
    console.log('\n5️⃣ Probando INSERT de prueba...');
    
    const testData = {
      RazonSocial: "Test Empresa Verificación",
      NombreComercial: "Test Verificación",
      RNC: "999999999",
      Telefono: "809-000-0000",
      Direccion: "Dirección de Prueba",
      Presidente: "Presidente Test",
      CedulaPresidente: "001-0000000-0",
      Abogado: "Abogado Test",
      EstadoCivilAbogado: 1,
      CedulaAbogado: "001-1111111-1",
      DireccionAbogado: "Dirección Abogado",
      Alguacil: "Alguacil Test",
      Banco: "Banco Test",
      NoCuenta: "000000000",
      Tasa: 10.0,
      Mora: 2.0,
      Cuotas: 12,
      GastoCierre: 0.0,
      Penalidad: 0,
      MaxAbonoSobreCapital: 1.0,
      MinAbonoSobreCapital: 0.0,
      Activo: true,
      UrlLogo: ""
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('empresas')
      .insert([testData])
      .select()
      .single();
    
    if (insertError) {
      console.log('❌ Error en INSERT:', insertError);
      console.log('🔍 Código:', insertError.code);
      console.log('📝 Mensaje:', insertError.message);
      
      if (insertError.code === '42501') {
        console.log('💡 Error de Row-Level Security - usuario no autenticado');
      } else if (insertError.code === '42703') {
        console.log('💡 Columna no existe - problema de estructura');
      }
    } else {
      console.log('✅ ¡INSERT exitoso!');
      console.log('🏢 Empresa creada:', insertData);
      
      // Limpiar - eliminar la empresa de prueba
      console.log('\n6️⃣ Limpiando empresa de prueba...');
      const { error: deleteError } = await supabase
        .from('empresas')
        .delete()
        .eq('IdEmpresa', insertData.IdEmpresa);
      
      if (deleteError) {
        console.log('⚠️ No se pudo eliminar la empresa de prueba:', deleteError);
      } else {
        console.log('✅ Empresa de prueba eliminada');
      }
    }
    
  } catch (error) {
    console.log('❌ Error general:', error);
  }
}

verifyEmpresasTable();