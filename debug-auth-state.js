import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://qanuxayxehaimiknxvlw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAuthState() {
  console.log('🔍 Depurando estado de autenticación...\n');

  try {
    // 1. Intentar login
    console.log('1️⃣ Intentando login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'jeiselperdomo@gmail.com',
      password: '12345678'
    });

    if (loginError) {
      console.log('❌ Error en login:', loginError);
      return;
    }

    console.log('✅ Login exitoso');
    console.log('📧 Email:', loginData.user.email);
    console.log('🆔 User ID:', loginData.user.id);
    console.log('🔑 Token:', loginData.session.access_token.substring(0, 20) + '...');

    // 2. Verificar sesión actual
    console.log('\n2️⃣ Verificando sesión actual...');
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (sessionData.session) {
      console.log('✅ Sesión activa encontrada');
      console.log('📧 Email de sesión:', sessionData.session.user.email);
      console.log('🆔 User ID de sesión:', sessionData.session.user.id);
    } else {
      console.log('❌ No hay sesión activa');
    }

    // 3. Buscar usuario en tabla usuarios
    console.log('\n3️⃣ Buscando usuario en tabla usuarios...');
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuarios')
      .select(`
        IdUsuario,
        NombreUsuario,
        Nombres,
        Apellidos,
        Email,
        Activo,
        UserId,
        IdEmpresa,
        IdSucursal
      `)
      .eq('UserId', loginData.user.id)
      .single();

    if (usuarioError) {
      console.log('❌ Error buscando usuario:', usuarioError);
      console.log('🔍 Verificando si existe el usuario con este UserId...');
      
      // Buscar todos los usuarios para ver qué UserIds existen
      const { data: allUsers } = await supabase
        .from('usuarios')
        .select('UserId, Email, NombreUsuario')
        .limit(10);
      
      console.log('👥 Usuarios existentes:', allUsers);
    } else {
      console.log('✅ Usuario encontrado en tabla usuarios:');
      console.log('📝 Datos:', usuarioData);

      // 4. Buscar empresa si existe
      if (usuarioData.IdEmpresa) {
        console.log('\n4️⃣ Buscando empresa...');
        const { data: empresaData, error: empresaError } = await supabase
          .from('empresas')
          .select('IdEmpresa, RazonSocial, NombreComercial')
          .eq('IdEmpresa', usuarioData.IdEmpresa)
          .single();

        if (empresaError) {
          console.log('❌ Error buscando empresa:', empresaError);
        } else {
          console.log('✅ Empresa encontrada:', empresaData);
        }
      }

      // 5. Buscar sucursal si existe
      if (usuarioData.IdSucursal) {
        console.log('\n5️⃣ Buscando sucursal...');
        const { data: sucursalData, error: sucursalError } = await supabase
          .from('sucursales')
          .select('IdSucursal, Nombre')
          .eq('IdSucursal', usuarioData.IdSucursal)
          .single();

        if (sucursalError) {
          console.log('❌ Error buscando sucursal:', sucursalError);
        } else {
          console.log('✅ Sucursal encontrada:', sucursalData);
        }
      }
    }

    // 6. Simular el objeto que debería crear el hook
    console.log('\n6️⃣ Objeto que debería crear useAuthenticatedUser:');
    const mockUserInfo = {
      authUser: loginData.user,
      usuario: usuarioData,
      empresa: null, // Se buscaría si existe
      sucursal: null, // Se buscaría si existe
      displayName: usuarioData ? `${usuarioData.Nombres} ${usuarioData.Apellidos}`.trim() : loginData.user.email,
      isComplete: !!usuarioData
    };
    
    console.log('📦 UserInfo simulado:', JSON.stringify(mockUserInfo, null, 2));

  } catch (error) {
    console.log('❌ Error general:', error);
  }
}

debugAuthState();