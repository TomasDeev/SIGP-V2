// Script para insertar datos de prueba usando la configuración administrativa
import { createClient } from '@supabase/supabase-js';

// Variables de Supabase
const supabaseUrl = "https://qanuxayxehaimiknxvlw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertSampleData() {
  console.log('🚀 Insertando datos de prueba...\n');

  try {
    // 1. Insertar cliente de prueba
    console.log('👤 Creando cliente de prueba...');
    const clientData = {
      IdEmpresa: 1,
      Nombres: 'Juan Carlos',
      Apellidos: 'Pérez García',
      Cedula: '001-1234567-8',
      Telefono: '809-555-0123',
      Celular: '829-555-0123',
      Email: 'juan.perez@email.com',
      Direccion: 'Calle Principal #123, Sector Los Jardines',
      Sector: 'Los Jardines',
      Nacionalidad: 'Dominicana',
      LugarNacimiento: 'Santo Domingo',
      FechaNacimiento: '1985-05-15',
      EstadoCivil: 1,
      Profesion: 'Ingeniero',
      LugarTrabajo: 'Empresa ABC',
      DireccionTrabajo: 'Av. 27 de Febrero #456',
      TelefonoTrabajo: '809-555-0456',
      Ingresos: 75000,
      TiempoTrabajo: '5 años',
      Observaciones: 'Cliente de prueba creado por script de verificación',
      Activo: true
    };

    const { data: cliente, error: clienteError } = await supabase
      .from('cuentas')
      .insert([clientData])
      .select()
      .single();

    if (clienteError) {
      console.error('❌ Error creando cliente:', clienteError.message);
      return;
    }

    console.log('✅ Cliente creado:', cliente.IdCliente, '-', cliente.Nombres, cliente.Apellidos);

    // 2. Insertar préstamo de prueba
    console.log('\n💰 Creando préstamo de prueba...');
    const loanData = {
      IdCuenta: cliente.IdCliente,
      IdEmpresa: 1,
      CapitalPrestado: 500000,
      Cuotas: 24,
      Interes: 18.5,
      GastoCierre: 5000,
      GastoSeguro: 2500,
      FechaPrimerPago: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días desde hoy
      FrecuenciaPago: 1, // Mensual
      IdTipoPrestamo: 1,
      IdEstado: 1,
      Moneda: 1,
      DiasGraciaMora: 5,
      InteresMora: 2.5,
      Prefijo: 'PR',
      PrestamoNo: Math.floor(Math.random() * 10000) + 1000,
      Observaciones: 'Préstamo de prueba creado por script de verificación'
    };

    const { data: prestamo, error: prestamoError } = await supabase
      .from('prestamos')
      .insert([loanData])
      .select()
      .single();

    if (prestamoError) {
      console.error('❌ Error creando préstamo:', prestamoError.message);
      return;
    }

    console.log('✅ Préstamo creado:', prestamo.IdPrestamo, '- Capital:', prestamo.CapitalPrestado);

    // 3. Crear garantía de prueba
    console.log('\n🏠 Creando garantía de prueba...');
    const garantiaData = {
      IdPrestamo: prestamo.IdPrestamo,
      GarantiaTipo: 1, // Tipo de garantía
      Descripcion: 'Vehículo Toyota Corolla 2020, color blanco',
      ValorGarantia: 800000,
      Placa: 'A123456',
      Marca: 'Toyota',
      Modelo: 'Corolla',
      Color: 'Blanco',
      FabricacionFecha: 2020,
      NumeroMotor: 'TYT123456789',
      NumeroChasis: 'TYT987654321',
      Tipo: 'Sedán'
    };

    const { data: garantia, error: garantiaError } = await supabase
      .from('garantias')
      .insert([garantiaData])
      .select()
      .single();

    if (garantiaError) {
      console.error('❌ Error creando garantía:', garantiaError.message);
    } else {
      console.log('✅ Garantía creada:', garantia.IdGarantia, '-', garantia.Descripcion);
    }

    console.log('\n🎉 Datos de prueba insertados exitosamente!');
    console.log('📋 Resumen:');
    console.log(`   - Cliente ID: ${cliente.IdCliente}`);
    console.log(`   - Préstamo ID: ${prestamo.IdPrestamo}`);
    console.log(`   - Garantía ID: ${garantia?.IdGarantia || 'No creada'}`);
    console.log('\n💡 Ahora puedes verificar el explorador de solicitudes en la aplicación.');

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Función para limpiar datos de prueba
async function cleanupTestData() {
  console.log('🧹 Limpiando datos de prueba...');
  
  try {
    // Eliminar garantías de prueba
    await supabase
      .from('garantias')
      .delete()
      .like('Descripcion', '%script de verificación%');

    // Eliminar préstamos de prueba
    await supabase
      .from('prestamos')
      .delete()
      .like('Observaciones', '%script de verificación%');

    // Eliminar clientes de prueba
    await supabase
      .from('cuentas')
      .delete()
      .like('Observaciones', '%script de verificación%');

    console.log('✅ Datos de prueba eliminados');
  } catch (error) {
    console.error('❌ Error limpiando datos:', error.message);
  }
}

// Verificar argumentos de línea de comandos
const args = process.argv.slice(2);
if (args.includes('--cleanup')) {
  cleanupTestData().then(() => process.exit(0));
} else {
  insertSampleData().then(() => process.exit(0));
}