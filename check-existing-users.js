import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Leer variables del archivo .env
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  if (line.includes('=') && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExistingData() {
  console.log('🔍 Verificando datos existentes en la base de datos...');
  
  try {
    // Verificar usuarios
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .limit(5);

    if (usuariosError) {
      console.log('❌ Error consultando usuarios:', usuariosError.message);
    } else {
      console.log(`✅ Usuarios encontrados: ${usuarios.length}`);
      if (usuarios.length > 0) {
        console.log('📋 Primeros usuarios:');
        usuarios.forEach(user => {
          console.log(`  - ${user.Nombres} ${user.Apellidos} (${user.Email})`);
        });
      }
    }

    // Verificar empresas
    const { data: empresas, error: empresasError } = await supabase
      .from('empresas')
      .select('*')
      .limit(5);

    if (empresasError) {
      console.log('❌ Error consultando empresas:', empresasError.message);
    } else {
      console.log(`✅ Empresas encontradas: ${empresas.length}`);
      if (empresas.length > 0) {
        console.log('📋 Primeras empresas:');
        empresas.forEach(empresa => {
          console.log(`  - ${empresa.NombreComercial} (${empresa.RazonSocial})`);
        });
      }
    }

    // Verificar sucursales
    const { data: sucursales, error: sucursalesError } = await supabase
      .from('sucursales')
      .select('*')
      .limit(5);

    if (sucursalesError) {
      console.log('❌ Error consultando sucursales:', sucursalesError.message);
    } else {
      console.log(`✅ Sucursales encontradas: ${sucursales.length}`);
      if (sucursales.length > 0) {
        console.log('📋 Primeras sucursales:');
        sucursales.forEach(sucursal => {
          console.log(`  - ${sucursal.Nombre} (Empresa ID: ${sucursal.IdEmpresa})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkExistingData();