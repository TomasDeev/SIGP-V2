import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = "https://qanuxayxehaimiknxvlw.supabase.co";

// NOTA: Esta es una service role key de ejemplo - necesitas obtener la real desde tu dashboard
// Ve a: https://supabase.com/dashboard/project/[tu-proyecto]/settings/api
// En la sección "Project API keys", copia la "service_role" key
const serviceRoleKey = "NECESITAS_OBTENER_LA_SERVICE_ROLE_KEY_REAL_DESDE_EL_DASHBOARD";

// Cliente con service role (bypassa RLS)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Datos de prueba mínimos
const testData = {
  onboardingData: {
    empresaId: 1, // Asumiendo que existe una empresa con ID 1
    personalInfo: {
      nombres: "Juan",
      apellidos: "Pérez",
      cedula: "00112345678",
      telefono: "809-555-0123",
      email: "juan.perez@test.com",
      direccion: "Calle Test 123",
      fechaNacimiento: "1990-01-01",
      estadoCivil: "Soltero",
      nacionalidad: "Dominicana"
    },
    workInfo: {
      profesion: "Ingeniero",
      lugarTrabajo: "Empresa Test",
      ingresos: 50000,
      tiempoTrabajo: "2 años"
    },
    loanInfo: {
      monto: 100000,
      cuotas: 12,
      tipoPrestamo: "Personal",
      descripcionGarantia: "Garantía de prueba"
    }
  }
};

async function testServiceRoleInsert() {
  console.log('🧪 Probando inserción con service role key...');
  
  try {
    // Verificar conexión
    console.log('🔗 Verificando conexión...');
    const { data: testConnection, error: connectionError } = await supabaseAdmin
      .from('empresas')
      .select('IdEmpresa')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Error de conexión:', connectionError);
      return;
    }
    
    console.log('✅ Conexión exitosa');
    
    // Intentar insertar en cuentas
    console.log('📝 Intentando crear cuenta de cliente...');
    const clientData = {
      IdEmpresa: testData.onboardingData.empresaId,
      Nombres: testData.onboardingData.personalInfo.nombres,
      Apellidos: testData.onboardingData.personalInfo.apellidos,
      Cedula: testData.onboardingData.personalInfo.cedula,
      Telefono: testData.onboardingData.personalInfo.telefono,
      Email: testData.onboardingData.personalInfo.email,
      Direccion: testData.onboardingData.personalInfo.direccion,
      FechaNacimiento: testData.onboardingData.personalInfo.fechaNacimiento,
      EstadoCivil: 1, // Soltero
      Nacionalidad: testData.onboardingData.personalInfo.nacionalidad,
      Profesion: testData.onboardingData.workInfo.profesion,
      LugarTrabajo: testData.onboardingData.workInfo.lugarTrabajo,
      Ingresos: testData.onboardingData.workInfo.ingresos,
      TiempoTrabajo: testData.onboardingData.workInfo.tiempoTrabajo
    };
    
    const { data: clientResult, error: clientError } = await supabaseAdmin
      .from('cuentas')
      .insert(clientData)
      .select()
      .single();
    
    if (clientError) {
      console.error('❌ Error creando cliente:', clientError);
      return;
    }
    
    console.log('✅ Cliente creado exitosamente:', clientResult.IdCliente);
    
    // Limpiar datos de prueba
    console.log('🧹 Limpiando datos de prueba...');
    await supabaseAdmin
      .from('cuentas')
      .delete()
      .eq('IdCliente', clientResult.IdCliente);
    
    console.log('✅ Datos de prueba limpiados');
    console.log('🎉 ¡El service role key funciona correctamente!');
    
  } catch (error) {
    console.error('💥 Error inesperado:', error);
  }
}

// Verificar si tenemos la service role key real
if (serviceRoleKey === "NECESITAS_OBTENER_LA_SERVICE_ROLE_KEY_REAL_DESDE_EL_DASHBOARD") {
  console.log('⚠️  NECESITAS OBTENER LA SERVICE ROLE KEY REAL');
  console.log('');
  console.log('📋 Pasos para obtener la service role key:');
  console.log('1. Ve a: https://supabase.com/dashboard/project/qanuxayxehaimiknxvlw/settings/api');
  console.log('2. En la sección "Project API keys", busca "service_role"');
  console.log('3. Copia la key que empieza con "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."');
  console.log('4. Reemplaza la variable serviceRoleKey en este archivo');
  console.log('5. Ejecuta el script nuevamente');
} else {
  testServiceRoleInsert();
}