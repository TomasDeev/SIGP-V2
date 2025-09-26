// Script para probar el guardado completo del onboarding
import { createClient } from '@supabase/supabase-js';

// Obtener las variables de entorno directamente del archivo .env
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Datos de prueba completos
const testData = {
  loanCalculation: {
    capital: 50000,
    tasaInteres: 15,
    cantidadCuotas: 12,
    gastoCierre: 1000,
    fechaPrimerPago: '2024-02-01',
    montoSeguro: 500,
    montoGps: 200,
    agente: 'Agente Test',
    suplidor: 'Suplidor Test'
  },
  datosPersonales: {
    nombres: 'Juan',
    apellidos: 'Pérez Test',
    cedula: '001-1234567-8',
    fechaNacimiento: '1990-01-01',
    sexo: 'masculino',
    email: 'juan@test.com',
    nacionalidad: 'Dominicana',
    lugarNacimiento: 'Santo Domingo',
    estadoCivil: 'soltero',
    profesion: 'Ingeniero',
    telefono: '809-123-4567',
    celular: '809-987-6543'
  },
  direccion: {
    calle: 'Calle Principal #123',
    subsector: 'Ensanche La Fe',
    sector: 'Los Prados',
    pais: 'República Dominicana',
    provincia: 'Santo Domingo',
    municipio: 'Santo Domingo Norte',
    referenciaUbicacion: 'Frente al parque'
  },
  informacionLaboral: {
    empresa: 'Empresa XYZ SRL',
    cargo: 'Gerente de Proyectos',
    supervisor: 'Carlos Rodríguez',
    ingresosMes: 45000,
    ingresos: 45000,
    direccionEmpresa: 'Av. Lope de Vega #99',
    telefonoTrabajo: '809-555-1234',
    tiempoTrabajo: '3 años',
    quienPagara: 'Empleador'
  },
  referenciasPersonales: [
    {
      nombres: 'María',
      apellidos: 'Gómez',
      telefono: '809-111-2222',
      direccion: 'Calle A #45',
      tipo: 'familiar',
      parentesco: 'Hermana',
      tiempoConocerlo: '25 años'
    }
  ],
  cheques: {
    tipoPrestamo: 'vehicular',
    banco: 'Banco Popular',
    numeroCuenta: '1234567890',
    tipoGarantia: 'vehiculo',
    descripcionGarantia: 'Toyota Corolla 2020'
  }
};

async function testSave() {
  try {
    console.log('🧪 Iniciando prueba de guardado completo...');
    
    // Buscar un cliente de prueba existente
    const { data: existingClient } = await supabase
      .from('cuentas')
      .select('IdCliente')
      .eq('Cedula', testData.datosPersonales.cedula)
      .single();

    if (existingClient) {
      console.log('📋 Cliente existente encontrado, actualizando...');
      
      // Actualizar cliente
      const { data: updateData, error: updateError } = await supabase
        .from('cuentas')
        .update({
          Nombres: testData.datosPersonales.nombres,
          Apellidos: testData.datosPersonales.apellidos,
          Direccion: testData.direccion.calle,
          Sector: testData.direccion.sector,
          LugarTrabajo: testData.informacionLaboral.empresa,
          DireccionTrabajo: testData.informacionLaboral.direccionEmpresa,
          TelefonoTrabajo: testData.informacionLaboral.telefonoTrabajo,
          Ingresos: testData.informacionLaboral.ingresos,
          Observaciones: `Cargo: ${testData.informacionLaboral.cargo}. Supervisor: ${testData.informacionLaboral.supervisor}. Método de pago: ${testData.informacionLaboral.quienPagara}. Subsector: ${testData.direccion.subsector}. Municipio: ${testData.direccion.municipio}. Provincia: ${testData.direccion.provincia}. País: ${testData.direccion.pais}. Referencia ubicación: ${testData.direccion.referenciaUbicacion}.`
        })
        .eq('IdCliente', existingClient.IdCliente)
        .select();

      if (updateError) {
        console.error('❌ Error actualizando cliente:', updateError);
      } else {
        console.log('✅ Cliente actualizado exitosamente:', updateData);
      }
    } else {
      console.log('📋 Creando nuevo cliente...');
      
      // Crear nuevo cliente
      const { data: newClient, error: createError } = await supabase
        .from('cuentas')
        .insert([{
          IdEmpresa: 1,
          Nombres: testData.datosPersonales.nombres,
          Apellidos: testData.datosPersonales.apellidos,
          Cedula: testData.datosPersonales.cedula,
          Telefono: testData.datosPersonales.telefono,
          Celular: testData.datosPersonales.celular,
          Email: testData.datosPersonales.email,
          Direccion: testData.direccion.calle,
          Sector: testData.direccion.sector,
          Nacionalidad: testData.datosPersonales.nacionalidad,
          LugarNacimiento: testData.datosPersonales.lugarNacimiento,
          FechaNacimiento: testData.datosPersonales.fechaNacimiento,
          EstadoCivil: 1,
          Profesion: testData.datosPersonales.profesion,
          LugarTrabajo: testData.informacionLaboral.empresa,
          DireccionTrabajo: testData.informacionLaboral.direccionEmpresa,
          TelefonoTrabajo: testData.informacionLaboral.telefonoTrabajo,
          Ingresos: testData.informacionLaboral.ingresos,
          TiempoTrabajo: testData.informacionLaboral.tiempoTrabajo,
          Observaciones: `Cargo: ${testData.informacionLaboral.cargo}. Supervisor: ${testData.informacionLaboral.supervisor}. Método de pago: ${testData.informacionLaboral.quienPagara}. Subsector: ${testData.direccion.subsector}. Municipio: ${testData.direccion.municipio}. Provincia: ${testData.direccion.provincia}. País: ${testData.direccion.pais}. Referencia ubicación: ${testData.direccion.referenciaUbicacion}.`,
          Activo: true
        }])
        .select();

      if (createError) {
        console.error('❌ Error creando cliente:', createError);
      } else {
        console.log('✅ Cliente creado exitosamente:', newClient);
      }
    }

    console.log('\n📊 Resumen de datos guardados:');
    console.log('- Dirección completa:', testData.direccion);
    console.log('- Información laboral completa:', testData.informacionLaboral);
    console.log('- Observaciones incluyen todos los campos adicionales');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

testSave();