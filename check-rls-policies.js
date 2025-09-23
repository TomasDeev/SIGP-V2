import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qanuxayxehaimiknxvlw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRLSPolicies() {
  console.log('🔍 Verificando políticas RLS para la tabla empresas...\n');
  
  try {
    // Verificar si RLS está habilitado
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('check_table_rls', { table_name: 'empresas' })
      .single();
    
    if (tableError) {
      console.log('⚠️ No se pudo verificar RLS directamente, intentando otra forma...');
    } else {
      console.log('📊 Información de la tabla:', tableInfo);
    }
    
    // Intentar obtener información del usuario actual
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('❌ Error obteniendo usuario:', userError);
      console.log('🔑 Usuario no autenticado - esto puede ser la causa del problema RLS');
    } else {
      console.log('✅ Usuario autenticado:', user?.email || 'Sin email');
      console.log('🆔 User ID:', user?.id || 'Sin ID');
    }
    
    // Intentar una consulta simple para ver qué pasa
    console.log('\n🧪 Probando consulta SELECT...');
    const { data: selectData, error: selectError } = await supabase
      .from('empresas')
      .select('count(*)')
      .single();
    
    if (selectError) {
      console.log('❌ Error en SELECT:', selectError);
    } else {
      console.log('✅ SELECT exitoso:', selectData);
    }
    
    // Verificar si hay alguna política que permita INSERT
    console.log('\n🔐 Intentando verificar políticas...');
    
    // Intentar insertar con datos mínimos
    console.log('\n🧪 Probando INSERT con datos mínimos...');
    const { data: insertData, error: insertError } = await supabase
      .from('empresas')
      .insert([{ 
        RazonSocial: 'Test Minimal',
        Activo: true 
      }])
      .select();
    
    if (insertError) {
      console.log('❌ Error en INSERT mínimo:', insertError);
      
      if (insertError.code === '42501') {
        console.log('\n💡 Soluciones posibles:');
        console.log('1. Autenticarse como usuario válido');
        console.log('2. Deshabilitar RLS temporalmente');
        console.log('3. Crear políticas RLS que permitan INSERT');
        console.log('4. Usar service_role key en lugar de anon key');
      }
    } else {
      console.log('✅ INSERT exitoso:', insertData);
    }
    
  } catch (error) {
    console.log('❌ Error general:', error);
  }
}

checkRLSPolicies();