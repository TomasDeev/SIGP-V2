import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = "https://qanuxayxehaimiknxvlw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Datos de prueba simulando un onboarding completo
const testOnboardingData = {
  datosPersonales: {
    nombres: "Juan Carlos",
    apellidos: "Pérez García",
    cedula: "001-1234567-8",
    telefono: "809-555-1234",
    celular: "829-555-5678",
    email: "juan.perez@test.com",
    direccion: "Calle Principal #123",
    sector: "Bella Vista",
    nacionalidad: "Dominicana",
    lugarNacimiento: "Santo Domingo",
    fechaNacimiento: "1985-05-15",
    estadoCivil: "casado",
    profesion: "Ingeniero"
  },
  informacionLaboral: {
    lugarTrabajo: "Empresa Test S.A.",
    direccionTrabajo: "Av. Independencia #456",
    telefonoTrabajo: "809-555-9999",
    ingresos: "75000",
    tiempoTrabajo: "5 años"
  },
  loanCalculation: {
    capital: "500000",
    cantidadCuotas: "24",
    tasaInteres: "18",
    gastoCierre: "5000",
    montoSeguro: "2500",
    fechaPrimerPago: "2024-02-01"
  },
  cheques: {
    tipoPrestamo: "personal"
  },
  referenciasPersonales: [
    {
      nombres: "María",
      apellidos: "González",
      telefono: "809-555-1111",
      direccion: "Calle Secundaria #789",
      tipo: "familiar",
      parentesco: "hermana",
      tiempoConocerlo: "toda la vida"
    },
    {
      nombres: "Pedro",
      apellidos: "Martínez",
      telefono: "809-555-2222",
      direccion: "Av. Principal #321",
      tipo: "laboral",
      parentesco: "compañero de trabajo",
      tiempoConocerlo: "3 años"
    }
  ]
};

// Función para mapear estado civil
function mapEstadoCivil(estadoCivil) {
  const mapping = {
    'soltero': 1,
    'casado': 2,
    'divorciado': 3,
    'viudo': 4,
    'union_libre': 5
  };
  return mapping[estadoCivil?.toLowerCase()] || 1;
}

// Función para mapear tipo de préstamo
function mapTipoPrestamo(tipoPrestamo) {
  const mapping = {
    'vehicular': 1,
    'personal': 2,
    'hipotecario': 3,
    'préstamo vehicular': 1,
    'préstamo personal': 2,
    'préstamo hipotecario': 3
  };
  return mapping[tipoPrestamo?.toLowerCase()] || 2;
}

// Función para mapear tipo de referencia
function mapTipoReferencia(tipo) {
  const mapping = {
    'familiar': 1,
    'laboral': 2,
    'personal': 3,
    'comercial': 4
  };
  return mapping[tipo?.toLowerCase()] || 3;
}

// Función para obtener el siguiente número de préstamo
async function getNextPrestamoNumber(empresaId) {
  try {
    const { data, error } = await supabase
      .from('prestamos')
      .select('PrestamoNo')
      .eq('IdEmpresa', empresaId)
      .order('PrestamoNo', { ascending: false })
      .limit(1);

    if (error) throw error;
    
    const lastNumber = data && data.length > 0 ? data[0].PrestamoNo : 0;
    return lastNumber + 1;
  } catch (error) {
    console.error('Error obteniendo número de préstamo:', error);
    return 1;
  }
}

// Función principal de prueba
async function testOnboardingSave() {
  console.log('🧪 Iniciando prueba de guardado de onboarding...\n');

  try {
    // 1. Probar conexión a Supabase
    console.log('1. Probando conexión a Supabase...');
    const { data: testConnection, error: connectionError } = await supabase
      .from('empresas')
      .select('IdEmpresa')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Error de conexión:', connectionError);
      return;
    }
    console.log('✅ Conexión exitosa a Supabase');

    // 2. Crear cuenta del cliente
    console.log('\n2. Creando cuenta del cliente...');
    const clientData = {
      IdEmpresa: 1,
      Nombres: testOnboardingData.datosPersonales.nombres,
      Apellidos: testOnboardingData.datosPersonales.apellidos,
      Cedula: testOnboardingData.datosPersonales.cedula,
      Telefono: testOnboardingData.datosPersonales.telefono,
      Celular: testOnboardingData.datosPersonales.celular,
      Email: testOnboardingData.datosPersonales.email,
      Direccion: testOnboardingData.datosPersonales.direccion,
      Sector: testOnboardingData.datosPersonales.sector,
      Nacionalidad: testOnboardingData.datosPersonales.nacionalidad,
      LugarNacimiento: testOnboardingData.datosPersonales.lugarNacimiento,
      FechaNacimiento: testOnboardingData.datosPersonales.fechaNacimiento,
      EstadoCivil: mapEstadoCivil(testOnboardingData.datosPersonales.estadoCivil),
      Profesion: testOnboardingData.datosPersonales.profesion,
      LugarTrabajo: testOnboardingData.informacionLaboral.lugarTrabajo,
      DireccionTrabajo: testOnboardingData.informacionLaboral.direccionTrabajo,
      TelefonoTrabajo: testOnboardingData.informacionLaboral.telefonoTrabajo,
      Ingresos: parseFloat(testOnboardingData.informacionLaboral.ingresos),
      TiempoTrabajo: testOnboardingData.informacionLaboral.tiempoTrabajo,
      Activo: true
    };

    const { data: clientResult, error: clientError } = await supabase
      .from('cuentas')
      .insert([clientData])
      .select()
      .single();

    if (clientError) {
      console.error('❌ Error creando cliente:', clientError);
      return;
    }
    console.log('✅ Cliente creado exitosamente:', clientResult.IdCliente);

    // 3. Crear préstamo
    console.log('\n3. Creando préstamo...');
    const prestamoNumber = await getNextPrestamoNumber(1);
    const loanData = {
      IdCuenta: clientResult.IdCliente,
      IdEmpresa: 1,
      CapitalPrestado: parseFloat(testOnboardingData.loanCalculation.capital),
      Cuotas: parseInt(testOnboardingData.loanCalculation.cantidadCuotas),
      Interes: parseFloat(testOnboardingData.loanCalculation.tasaInteres),
      GastoCierre: parseFloat(testOnboardingData.loanCalculation.gastoCierre),
      GastoSeguro: parseFloat(testOnboardingData.loanCalculation.montoSeguro),
      FechaPrimerPago: testOnboardingData.loanCalculation.fechaPrimerPago,
      FrecuenciaPago: 1,
      IdTipoPrestamo: mapTipoPrestamo(testOnboardingData.cheques.tipoPrestamo),
      IdEstado: 1,
      Moneda: 1,
      DiasGraciaMora: 0,
      InteresMora: 0,
      Prefijo: 'PR',
      PrestamoNo: prestamoNumber
    };

    const { data: loanResult, error: loanError } = await supabase
      .from('prestamos')
      .insert([loanData])
      .select()
      .single();

    if (loanError) {
      console.error('❌ Error creando préstamo:', loanError);
      return;
    }
    console.log('✅ Préstamo creado exitosamente:', loanResult.IdPrestamo);

    // 4. Crear referencias personales
    console.log('\n4. Creando referencias personales...');
    const referencesData = testOnboardingData.referenciasPersonales.map(ref => ({
      IdCuenta: clientResult.IdCliente,
      Nombres: ref.nombres,
      Apellidos: ref.apellidos,
      Telefono: ref.telefono,
      Direccion: ref.direccion,
      IdTipoReferenciaPersonal: mapTipoReferencia(ref.tipo),
      Parentesco: ref.parentesco,
      TiempoConocerlo: ref.tiempoConocerlo
    }));

    const { data: referencesResult, error: referencesError } = await supabase
      .from('referenciaspersonales')
      .insert(referencesData)
      .select();

    if (referencesError) {
      console.error('❌ Error creando referencias:', referencesError);
    } else {
      console.log('✅ Referencias creadas exitosamente:', referencesResult.length, 'referencias');
    }

    console.log('\n🎉 ¡Prueba completada exitosamente!');
    console.log('📊 Resumen:');
    console.log(`   - Cliente ID: ${clientResult.IdCliente}`);
    console.log(`   - Préstamo ID: ${loanResult.IdPrestamo}`);
    console.log(`   - Referencias: ${referencesResult?.length || 0}`);

  } catch (error) {
    console.error('❌ Error general en la prueba:', error);
  }
}

// Ejecutar la prueba
testOnboardingSave();