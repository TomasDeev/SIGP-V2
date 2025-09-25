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

async function createTestUser() {
  console.log('🚀 Creando usuario de prueba para el widget...');
  
  try {
    // 1. Crear usuario en auth.users
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test@sigp.com',
      password: 'test123456',
      options: {
        data: {
          full_name: 'Usuario de Prueba'
        }
      }
    });

    if (authError) {
      console.error('❌ Error creando usuario de autenticación:', authError);
      return;
    }

    console.log('✅ Usuario de autenticación creado:', authData.user.id);

    // 2. Crear empresa de prueba
    const { data: empresaData, error: empresaError } = await supabase
      .from('empresas')
      .insert({
        RazonSocial: 'Empresa de Prueba SIGP',
        NombreComercial: 'SIGP Test',
        RNC: '123456789',
        Direccion: 'Calle Principal #123, Santo Domingo',
        Telefono: '809-555-0123',
        Presidente: 'Juan Pérez',
        CedulaPresidente: '001-1234567-8',
        Abogado: 'María González',
        CedulaAbogado: '001-9876543-2',
        DireccionAbogado: 'Av. Independencia #456',
        Alguacil: 'Carlos Rodríguez',
        Tasa: 12.5,
        Mora: 2.0,
        Cuotas: 12,
        GastoCierre: 500.00
      })
      .select()
      .single();

    if (empresaError) {
      console.error('❌ Error creando empresa:', empresaError);
      return;
    }

    console.log('✅ Empresa creada:', empresaData.IdEmpresa);

    // 3. Crear sucursal de prueba
    const { data: sucursalData, error: sucursalError } = await supabase
      .from('sucursales')
      .insert({
        IdEmpresa: empresaData.IdEmpresa,
        Nombre: 'Sucursal Principal',
        Codigo: 'SP001',
        Direccion: 'Calle Principal #123, Santo Domingo',
        Telefono: '809-555-0123',
        Email: 'principal@sigp.com',
        Gerente: 'Ana Martínez'
      })
      .select()
      .single();

    if (sucursalError) {
      console.error('❌ Error creando sucursal:', sucursalError);
      return;
    }

    console.log('✅ Sucursal creada:', sucursalData.IdSucursal);

    // 4. Crear usuario en tabla usuarios
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuarios')
      .insert({
        UserId: authData.user.id,
        NombreUsuario: 'test_user',
        Nombres: 'Usuario',
        Apellidos: 'de Prueba',
        Email: 'test@sigp.com',
        IdEmpresa: empresaData.IdEmpresa,
        IdSucursal: sucursalData.IdSucursal,
        Direccion: 'Calle Secundaria #789',
        Telefono: '809-555-0456',
        Activo: true
      })
      .select()
      .single();

    if (usuarioError) {
      console.error('❌ Error creando usuario:', usuarioError);
      return;
    }

    console.log('✅ Usuario creado en tabla usuarios:', usuarioData.IdUsuario);

    console.log('\n🎉 ¡Usuario de prueba creado exitosamente!');
    console.log('📧 Email: test@sigp.com');
    console.log('🔑 Password: test123456');
    console.log('🏢 Empresa:', empresaData.NombreComercial);
    console.log('🏪 Sucursal:', sucursalData.Nombre);
    console.log('\n💡 Ahora puedes iniciar sesión y probar el widget de bienvenida.');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createTestUser();