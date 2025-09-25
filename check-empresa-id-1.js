import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://qanuxayxehaimiknxvlw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEmpresa() {
  console.log('🔍 Verificando empresa con ID 1...\n');

  try {
    // Buscar empresa con ID 1
    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .select('*')
      .eq('IdEmpresa', 1)
      .single();

    if (empresaError) {
      console.log('❌ Error buscando empresa ID 1:', empresaError);
      
      // Buscar todas las empresas para ver qué IDs existen
      console.log('\n🔍 Buscando todas las empresas disponibles...');
      const { data: allEmpresas, error: allError } = await supabase
        .from('empresas')
        .select('IdEmpresa, RazonSocial, NombreComercial, Activo')
        .limit(10);

      if (allError) {
        console.log('❌ Error buscando todas las empresas:', allError);
      } else {
        console.log('📋 Empresas disponibles:');
        allEmpresas.forEach(emp => {
          console.log(`  - ID: ${emp.IdEmpresa}, Razón Social: ${emp.RazonSocial}, Activo: ${emp.Activo}`);
        });
      }
    } else {
      console.log('✅ Empresa encontrada:');
      console.log('📝 Datos:', empresa);
    }

  } catch (error) {
    console.log('❌ Error general:', error);
  }
}

checkEmpresa();