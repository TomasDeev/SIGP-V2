import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Leer las credenciales desde .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const envLines = envContent.split('\n');

let supabaseUrl = '';
let supabaseAnonKey = '';

envLines.forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim();
  }
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
    supabaseAnonKey = line.split('=')[1].trim();
  }
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ No se encontraron las credenciales de Supabase en .env.local');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  try {
    console.log('🔐 Probando login con usuario existente...');
    
    // Probar con jeiselperdomo@gmail.com que sabemos que existe y está confirmado
    const email = 'jeiselperdomo@gmail.com';
    const password = '12345678';
    
    console.log(`📧 Intentando login con: ${email}`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) {
      console.error('❌ Error en login:', error.message);
      
      // Probar con otro usuario
      console.log('\n🔄 Probando con otro usuario...');
      const email2 = 'jdiaz@clavoservices.com';
      console.log(`📧 Intentando login con: ${email2}`);
      
      const { data: data2, error: error2 } = await supabase.auth.signInWithPassword({
        email: email2,
        password: password
      });
      
      if (error2) {
        console.error('❌ Error en segundo login:', error2.message);
        return;
      }
      
      console.log('✅ Login exitoso con segundo usuario!');
      console.log('👤 Usuario autenticado:', data2.user.email);
      console.log('🔑 Token de acceso obtenido');
      
      // Obtener información completa del usuario
      await getUserInfo(data2.user.id);
      
    } else {
      console.log('✅ Login exitoso!');
      console.log('👤 Usuario autenticado:', data.user.email);
      console.log('🔑 Token de acceso obtenido');
      
      // Obtener información completa del usuario
      await getUserInfo(data.user.id);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function getUserInfo(userId) {
  try {
    console.log('\n📊 Obteniendo información completa del usuario...');
    
    // Obtener datos del usuario desde la tabla usuarios
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select(`
        IdUsuario,
        NombreUsuario,
        Nombres,
        Apellidos,
        Email,
        Activo,
        IdEmpresa,
        IdSucursal,
        Direccion,
        Telefono
      `)
      .eq('UserId', userId)
      .single();
    
    if (error) {
      console.error('❌ Error obteniendo datos del usuario:', error);
      return;
    }
    
    console.log('✅ Datos del usuario obtenidos:');
    console.log(`   Nombre: ${usuario.Nombres} ${usuario.Apellidos}`);
    console.log(`   Usuario: ${usuario.NombreUsuario}`);
    console.log(`   Email: ${usuario.Email}`);
    console.log(`   Activo: ${usuario.Activo ? 'Sí' : 'No'}`);
    console.log(`   ID Empresa: ${usuario.IdEmpresa}`);
    console.log(`   ID Sucursal: ${usuario.IdSucursal}`);
    
    // Obtener información de la empresa si existe
    if (usuario.IdEmpresa) {
      const { data: empresa, error: empresaError } = await supabase
        .from('empresas')
        .select('IdEmpresa, NombreComercial, RazonSocial')
        .eq('IdEmpresa', usuario.IdEmpresa)
        .single();
      
      if (!empresaError && empresa) {
        console.log(`   Empresa: ${empresa.NombreComercial || empresa.RazonSocial}`);
      }
    }
    
    // Obtener información de la sucursal si existe
    if (usuario.IdSucursal) {
      const { data: sucursal, error: sucursalError } = await supabase
        .from('sucursales')
        .select('IdSucursal, Nombre, Codigo')
        .eq('IdSucursal', usuario.IdSucursal)
        .single();
      
      if (!sucursalError && sucursal) {
        console.log(`   Sucursal: ${sucursal.Nombre} (${sucursal.Codigo})`);
      }
    }
    
    console.log('\n🎉 El usuario tiene toda la información necesaria para el widget!');
    
  } catch (error) {
    console.error('❌ Error obteniendo información del usuario:', error);
  }
}

testLogin();