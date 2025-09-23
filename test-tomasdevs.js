import { createClient } from '@supabase/supabase-js';

// Variables de entorno (usando las mismas credenciales que la aplicación)
const supabaseUrl = 'https://qanuxayxehaimiknxvlw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ No configurada');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Configurada' : '❌ No configurada');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTomasDevs() {
  console.log('🔍 Buscando empresa TomasDevs...');
  
  try {
    // Buscar todas las empresas
    const { data: allCompanies, error: allError } = await supabase
      .from('empresas')
      .select('*');
    
    if (allError) {
      console.error('❌ Error obteniendo todas las empresas:', allError);
      return;
    }
    
    console.log('📊 Total de empresas en la base de datos:', allCompanies?.length || 0);
    
    if (allCompanies && allCompanies.length > 0) {
      console.log('📋 Lista de empresas:');
      allCompanies.forEach((empresa, index) => {
        console.log(`${index + 1}. ${empresa.RazonSocial || empresa.NombreComercial} (ID: ${empresa.IdEmpresa})`);
      });
    }
    
    // Buscar específicamente TomasDevs
    const tomasDevsVariations = [
      'TomasDevs',
      'Tomas Devs',
      'TOMASDEVS',
      'tomas devs',
      'tomasdevs'
    ];
    
    for (const variation of tomasDevsVariations) {
      const { data: tomasDevs, error: tomasError } = await supabase
        .from('empresas')
        .select('*')
        .or(`RazonSocial.ilike.%${variation}%,NombreComercial.ilike.%${variation}%`);
      
      if (tomasError) {
        console.error(`❌ Error buscando ${variation}:`, tomasError);
        continue;
      }
      
      if (tomasDevs && tomasDevs.length > 0) {
        console.log(`✅ Encontrada empresa con variación "${variation}":`, tomasDevs);
        return tomasDevs;
      }
    }
    
    console.log('❌ No se encontró ninguna empresa con el nombre TomasDevs o variaciones');
    
    // Verificar las últimas empresas creadas
    const { data: recentCompanies, error: recentError } = await supabase
      .from('empresas')
      .select('*')
      .order('FechaCreacion', { ascending: false })
      .limit(5);
    
    if (recentError) {
      console.error('❌ Error obteniendo empresas recientes:', recentError);
      return;
    }
    
    console.log('🕒 Últimas 5 empresas creadas:');
    recentCompanies?.forEach((empresa, index) => {
      console.log(`${index + 1}. ${empresa.RazonSocial || empresa.NombreComercial} - ${empresa.FechaCreacion}`);
    });
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar la prueba
testTomasDevs().then(() => {
  console.log('🏁 Prueba completada');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Error ejecutando prueba:', error);
  process.exit(1);
});