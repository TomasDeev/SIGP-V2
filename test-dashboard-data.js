import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = "https://qanuxayxehaimiknxvlw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDashboardData() {
  console.log('🔍 Probando obtención de datos para el dashboard...\n');

  try {
    // Simular un usuario autenticado (usar un IdEmpresa existente)
    const testIdEmpresa = 1; // Asumiendo que existe una empresa con ID 1

    console.log('📊 Probando obtención de información de empresa...');
    
    // Obtener información de la empresa
    const { data: empresaData, error: empresaError } = await supabase
      .from('empresas')
      .select(`
        IdEmpresa,
        RazonSocial,
        NombreComercial,
        RNC,
        Direccion,
        Telefono,
        Presidente,
        CedulaPresidente,
        Logo,
        Activo
      `)
      .eq('IdEmpresa', testIdEmpresa)
      .eq('Activo', true)
      .single();

    if (empresaError) {
      console.error('❌ Error obteniendo empresa:', empresaError);
    } else {
      console.log('✅ Empresa obtenida:', empresaData);
    }

    console.log('\n👥 Probando conteo de usuarios...');
    
    // Contar usuarios activos de la empresa
    const { count: usuariosCount, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true })
      .eq('IdEmpresa', testIdEmpresa)
      .eq('Activo', true);

    if (usuariosError) {
      console.error('❌ Error contando usuarios:', usuariosError);
    } else {
      console.log('✅ Total usuarios:', usuariosCount);
    }

    console.log('\n👤 Probando conteo de clientes...');
    
    // Contar clientes de la empresa
    const { count: clientesCount, error: clientesError } = await supabase
      .from('cuentas')
      .select('*', { count: 'exact', head: true })
      .eq('IdEmpresa', testIdEmpresa)
      .eq('Activo', true);

    if (clientesError) {
      console.error('❌ Error contando clientes:', clientesError);
    } else {
      console.log('✅ Total clientes:', clientesCount);
    }

    console.log('\n💰 Probando conteo de préstamos...');
    
    // Contar préstamos activos
    const { count: prestamosCount, error: prestamosError } = await supabase
      .from('prestamos')
      .select('*', { count: 'exact', head: true })
      .eq('IdEmpresa', testIdEmpresa)
      .in('IdEstado', [1, 2, 3]); // Estados activos

    if (prestamosError) {
      console.error('❌ Error contando préstamos:', prestamosError);
    } else {
      console.log('✅ Total préstamos:', prestamosCount);
    }

    console.log('\n🔍 Verificando estructura de tabla usuarios...');
    
    // Obtener un usuario para ver la estructura
    const { data: sampleUser, error: sampleError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('IdEmpresa', testIdEmpresa)
      .limit(1)
      .single();

    if (sampleError) {
      console.error('❌ Error obteniendo usuario de muestra:', sampleError);
    } else {
      console.log('✅ Estructura de usuario:', Object.keys(sampleUser));
      console.log('📋 Usuario de muestra:', sampleUser);
    }

    console.log('\n👥 Probando obtención de miembros del equipo...');
    
    // Obtener usuarios de la empresa (sin IDGrupo por ahora)
    const { data: usuariosData, error: usuariosDataError } = await supabase
      .from('usuarios')
      .select(`
        IdUsuario,
        Nombres,
        Apellidos,
        Email,
        Telefono,
        Activo,
        FechaCreacion
      `)
      .eq('IdEmpresa', testIdEmpresa)
      .eq('Activo', true)
      .order('FechaCreacion', { ascending: false })
      .limit(5);

    if (usuariosDataError) {
      console.error('❌ Error obteniendo miembros:', usuariosDataError);
    } else {
      console.log('✅ Miembros obtenidos:', usuariosData?.length || 0);
      usuariosData?.forEach((usuario, index) => {
        console.log(`   ${index + 1}. ${usuario.Nombres} ${usuario.Apellidos} - ${usuario.Email}`);
      });
    }

    console.log('\n🎉 Prueba completada exitosamente!');

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar la prueba
testDashboardData();