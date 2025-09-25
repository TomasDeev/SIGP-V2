import { createClient } from '@supabase/supabase-js';

// Configuración directa para Node.js
const supabaseUrl = "https://qanuxayxehaimiknxvlw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkPrestamosTable() {
  console.log('🔍 Verificando tabla prestamos...');
  
  try {
    // Verificar los últimos préstamos creados
    const { data: prestamos, error: prestamosError } = await supabase
      .from('prestamos')
      .select(`
        IdPrestamo,
        PrestamoNo,
        IdEmpresa,
        IdCuenta,
        FechaCreacion,
        CapitalPrestado,
        Cuotas,
        cuentas!FK_Prestamos_Cuentas (
          Nombres,
          Apellidos,
          Cedula
        )
      `)
      .order('FechaCreacion', { ascending: false })
      .limit(10);
    
    if (prestamosError) {
      console.error('❌ Error consultando prestamos:', prestamosError);
      return;
    }
    
    console.log(`📊 Total de préstamos encontrados: ${prestamos.length}`);
    
    if (prestamos.length > 0) {
      console.log('\n📋 Últimos préstamos creados:');
      prestamos.forEach((prestamo, index) => {
        console.log(`${index + 1}. ID: ${prestamo.IdPrestamo} | No: ${prestamo.PrestamoNo} | Cliente: ${prestamo.cuentas?.Nombres} ${prestamo.cuentas?.Apellidos} | Monto: $${prestamo.CapitalPrestado} | Fecha: ${new Date(prestamo.FechaCreacion).toLocaleString()}`);
      });
    } else {
      console.log('⚠️  No se encontraron préstamos en la tabla');
    }
    
    // Verificar también las cuentas recientes
    console.log('\n👥 Verificando cuentas recientes...');
    const { data: cuentas, error: cuentasError } = await supabase
      .from('cuentas')
      .select('IdCliente, Nombres, Apellidos, Cedula, FechaIngreso')
      .order('FechaIngreso', { ascending: false })
      .limit(5);
    
    if (cuentasError) {
      console.error('❌ Error consultando cuentas:', cuentasError);
      return;
    }
    
    console.log(`👥 Últimas cuentas creadas: ${cuentas.length}`);
    cuentas.forEach((cuenta, index) => {
      console.log(`${index + 1}. ID: ${cuenta.IdCliente} | ${cuenta.Nombres} ${cuenta.Apellidos} | Cédula: ${cuenta.Cedula} | Fecha: ${new Date(cuenta.FechaIngreso).toLocaleString()}`);
    });
    
  } catch (error) {
    console.error('💥 Error inesperado:', error);
  }
}

checkPrestamosTable();