import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Leer variables del archivo .env.local (que tiene las credenciales de servicio)
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  if (line.includes('=') && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseServiceKey = envVars.VITE_SUPABASE_SERVICE_ROLE_KEY || envVars.VITE_SUPABASE_ANON_KEY;

// Crear cliente con credenciales de servicio
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createUserWithServiceRole() {
  console.log('🚀 Creando usuario con credenciales de servicio...');
  
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
    console.log('✅ Usando empresa:', empresa.NombreComercial, '(ID:', empresa.IdEmpresa + ')');

    // 2. Crear sucursal para esta empresa
    const { data: sucursalData, error: sucursalError } = await supabase
      .from('sucursales')
      .insert({
        IdEmpresa: empresa.IdEmpresa,
        Nombre: 'Sucursal Principal',
        Codigo: 'SP001',
        Direccion: 'Av. Principal #123, Santo Domingo',
        Telefono: '809-555-0123',
        Email: 'principal@' + empresa.NombreComercial.toLowerCase() + '.com',
        Gerente: 'Gerente Principal'
      })
      .select()
      .single();

    if (sucursalError) {
      console.error('❌ Error creando sucursal:', sucursalError);
      return;
    }

    console.log('✅ Sucursal creada:', sucursalData.Nombre, '(ID:', sucursalData.IdSucursal + ')');

    // 3. Crear usuario en auth.users usando admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@sigp.com',
      password: 'admin123456',
      email_confirm: true,
      user_metadata: {
        full_name: 'Administrador SIGP',
        nombres: 'Administrador',
        apellidos: 'SIGP'
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
        NombreUsuario: 'admin_sigp',
        Nombres: 'Administrador',
        Apellidos: 'SIGP',
        Email: 'admin@sigp.com',
        IdEmpresa: empresa.IdEmpresa,
        IdSucursal: sucursalData.IdSucursal,
        Direccion: 'Oficina Principal, Santo Domingo',
        Telefono: '809-555-0100',
        Activo: true
      })
      .select()
      .single();

    if (usuarioError) {
      console.error('❌ Error creando usuario en tabla usuarios:', usuarioError);
      return;
    }

    console.log('✅ Usuario creado en tabla usuarios:', usuarioData.IdUsuario);

    console.log('\n🎉 ¡Usuario administrador creado exitosamente!');
    console.log('📧 Email: admin@sigp.com');
    console.log('🔑 Password: admin123456');
    console.log('🏢 Empresa:', empresa.NombreComercial);
    console.log('🏪 Sucursal:', sucursalData.Nombre);
    console.log('\n💡 Ahora puedes:');
    console.log('   1. Ir a http://localhost:8080/auth/login-1');
    console.log('   2. Iniciar sesión con las credenciales de arriba');
    console.log('   3. Navegar a http://localhost:8080/dashboards/misc');
    console.log('   4. Ver el widget de bienvenida funcionando');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createUserWithServiceRole();