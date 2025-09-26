import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qanuxayxehaimiknxvlw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs";

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugDashboardData() {
  console.log('🔍 Verificando datos del dashboard...\n');

  try {
    // 1. Verificar tabla usuarios
    console.log('1. Verificando tabla usuarios...');
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*');
    
    if (usuariosError) {
      console.error('❌ Error obteniendo usuarios:', usuariosError.message);
    } else {
      console.log(`✅ Usuarios en tabla usuarios: ${usuarios.length}`);
      usuarios.forEach(usuario => {
        console.log(`   - ${usuario.Nombres} ${usuario.Apellidos} (Empresa: ${usuario.IdEmpresa})`);
      });
    }

    // 2. Verificar tabla empresas
    console.log('\n2. Verificando tabla empresas...');
    const { data: empresas, error: empresasError } = await supabase
      .from('empresas')
      .select('*');
    
    if (empresasError) {
      console.error('❌ Error obteniendo empresas:', empresasError.message);
    } else {
      console.log(`✅ Empresas en tabla empresas: ${empresas.length}`);
      empresas.forEach(empresa => {
        console.log(`   - ${empresa.NombreComercial || empresa.RazonSocial} (ID: ${empresa.IdEmpresa})`);
      });
    }

    // 3. Verificar conexión usuario-empresa
    console.log('\n3. Verificando conexión usuario-empresa...');
    if (usuarios && usuarios.length > 0 && empresas && empresas.length > 0) {
      const usuarioConEmpresa = usuarios.find(u => u.IdEmpresa);
      if (usuarioConEmpresa) {
        const empresa = empresas.find(e => e.IdEmpresa === usuarioConEmpresa.IdEmpresa);
        if (empresa) {
          console.log(`✅ Usuario ${usuarioConEmpresa.Nombres} conectado a empresa ${empresa.NombreComercial}`);
        } else {
          console.log('❌ Usuario tiene IdEmpresa pero no se encuentra la empresa');
        }
      } else {
        console.log('❌ No hay usuarios con IdEmpresa asignado');
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

debugDashboardData();