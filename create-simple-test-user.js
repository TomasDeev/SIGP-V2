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

async function createSimpleTestUser() {
  console.log('🚀 Creando usuario de prueba simple...');
  
  try {
    // 1. Obtener la primera empresa disponible
    const { data: empresas, error: empresasError } = await supabase
      .from('empresas')
      .select('*')
      .limit(1);

    if (empresasError || !empresas || empresas.length === 0) {
      console.error('❌ No se encontraron empresas:', empresasError);
      return;
    }

    const empresa = empresas[0];
    console.log('✅ Usando empresa:', empresa.NombreComercial);

    // 2. Crear sucursal de prueba para esta empresa
    const { data: sucursalData, error: sucursalError } = await supabase
      .from('sucursales')
      .insert({
        IdEmpresa: empresa.IdEmpresa,
        Nombre: 'Sucursal Principal Test',
        Codigo: 'TEST001',
        Direccion: 'Dirección de Prueba #123',
        Telefono: '809-555-0123',
        Email: 'test@empresa.com',
        Gerente: 'Gerente de Prueba'
      })
      .select()
      .single();

    if (sucursalError) {
      console.error('❌ Error creando sucursal:', sucursalError);
      return;
    }

    console.log('✅ Sucursal creada:', sucursalData.Nombre);

    // 3. Crear usuario en auth.users
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test@sigp.com',
      password: 'test123456',
      options: {
        data: {
          full_name: 'Usuario de Prueba SIGP'
        }
      }
    });

    if (authError) {
      console.error('❌ Error creando usuario de autenticación:', authError);
      return;
    }

    console.log('✅ Usuario de autenticación creado:', authData.user.id);

    // 4. Crear usuario en tabla usuarios
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuarios')
      .insert({
        UserId: authData.user.id,
        NombreUsuario: 'test_user_sigp',
        Nombres: 'Usuario',
        Apellidos: 'de Prueba SIGP',
        Email: 'test@sigp.com',
        IdEmpresa: empresa.IdEmpresa,
        IdSucursal: sucursalData.IdSucursal,
        Direccion: 'Dirección del Usuario #456',
        Telefono: '809-555-0789',
        Activo: true
      })
      .select()
      .single();

    if (usuarioError) {
      console.error('❌ Error creando usuario en tabla usuarios:', usuarioError);
      return;
    }

    console.log('✅ Usuario creado en tabla usuarios:', usuarioData.IdUsuario);

    console.log('\n🎉 ¡Usuario de prueba creado exitosamente!');
    console.log('📧 Email: test@sigp.com');
    console.log('🔑 Password: test123456');
    console.log('🏢 Empresa:', empresa.NombreComercial);
    console.log('🏪 Sucursal:', sucursalData.Nombre);
    console.log('\n💡 Ahora puedes iniciar sesión y probar el widget de bienvenida.');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createSimpleTestUser();