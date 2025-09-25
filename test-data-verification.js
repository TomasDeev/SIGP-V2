// Script para verificar si los datos se están guardando correctamente
import { createClient } from '@supabase/supabase-js';

// Variables de Supabase (directamente desde .env)
const supabaseUrl = "https://qanuxayxehaimiknxvlw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyData() {
  console.log('🔍 Verificando datos en las tablas...\n');

  try {
    // Verificar cuentas
    console.log('📋 Verificando tabla cuentas...');
    const { data: cuentas, error: cuentasError } = await supabase
      .from('cuentas')
      .select('IdCliente, Nombres, Apellidos, Cedula, FechaIngreso')
      .order('FechaIngreso', { ascending: false })
      .limit(5);

    if (cuentasError) {
      console.error('❌ Error consultando cuentas:', cuentasError.message);
    } else {
      console.log(`✅ Cuentas encontradas: ${cuentas?.length || 0}`);
      if (cuentas && cuentas.length > 0) {
        console.log('📄 Últimas cuentas creadas:');
        cuentas.forEach(cuenta => {
          console.log(`  - ID: ${cuenta.IdCliente}, Nombre: ${cuenta.Nombres} ${cuenta.Apellidos}, Cédula: ${cuenta.Cedula}`);
        });
      }
    }

    console.log('\n📋 Verificando tabla prestamos...');
    const { data: prestamos, error: prestamosError } = await supabase
      .from('prestamos')
      .select('IdPrestamo, IdCuenta, CapitalPrestado, FechaCreacion')
      .order('FechaCreacion', { ascending: false })
      .limit(5);

    if (prestamosError) {
      console.error('❌ Error consultando prestamos:', prestamosError.message);
    } else {
      console.log(`✅ Préstamos encontrados: ${prestamos?.length || 0}`);
      if (prestamos && prestamos.length > 0) {
        console.log('📄 Últimos préstamos creados:');
        prestamos.forEach(prestamo => {
          console.log(`  - ID: ${prestamo.IdPrestamo}, Cliente: ${prestamo.IdCuenta}, Capital: $${prestamo.CapitalPrestado}`);
        });
      }
    }

    // Verificar si hay datos relacionados
    if (cuentas && cuentas.length > 0 && prestamos && prestamos.length > 0) {
      console.log('\n🔗 Verificando relaciones entre cuentas y préstamos...');
      const clientesConPrestamos = prestamos.filter(p => 
        cuentas.some(c => c.IdCliente === p.IdCuenta)
      );
      console.log(`✅ Préstamos con cuentas relacionadas: ${clientesConPrestamos.length}`);
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar verificación
verifyData().then(() => {
  console.log('\n✅ Verificación completada');
  process.exit(0);
}).catch(error => {
  console.error('❌ Error en verificación:', error);
  process.exit(1);
});