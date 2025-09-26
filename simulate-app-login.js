import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Leer variables de entorno
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Simular la función getCookie
function simulateGetCookie(cookieValue) {
  try {
    const decoded = decodeURIComponent(cookieValue);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error parsing auth cookie:', error);
    return null;
  }
}

async function simulateAppLogin() {
  console.log('🎭 SIMULANDO LOGIN COMPLETO DE LA APLICACIÓN...\n');

  try {
    // 1. PASO 1: Login (como lo hace AuthProvider)
    console.log('1️⃣ PASO 1: Login con AuthProvider...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'jeiselperdomo@gmail.com',
      password: '12345678'
    });

    if (authError) {
      console.error('❌ Error en login:', authError.message);
      return;
    }

    console.log('✅ Login exitoso');
    console.log('📧 Email:', authData.user.email);
    console.log('🆔 User ID:', authData.user.id);

    // 2. PASO 2: Crear cookie (como lo hace AuthProvider)
    console.log('\n2️⃣ PASO 2: Creando cookie auth-user...');
    const cookieData = {
      token: authData.session.access_token,
      email: authData.user.email,
      user: authData.user,
      session: authData.session,
    };
    const cookieString = encodeURIComponent(JSON.stringify(cookieData));
    console.log('🍪 Cookie creada (primeros 100 chars):', cookieString.substring(0, 100) + '...');

    // 3. PASO 3: Simular useAuth() - isAuthenticated = true
    console.log('\n3️⃣ PASO 3: useAuth() devuelve isAuthenticated = true');
    const isAuthenticated = true;
    const authLoading = false;
    console.log('✅ isAuthenticated:', isAuthenticated);
    console.log('✅ authLoading:', authLoading);

    // 4. PASO 4: Simular useAuthenticatedUser - getUserFromCookie()
    console.log('\n4️⃣ PASO 4: useAuthenticatedUser - getUserFromCookie()...');
    const authUser = simulateGetCookie(cookieString);
    if (authUser) {
      console.log('✅ Cookie parseada correctamente');
      console.log('👤 Usuario de cookie:', authUser.user.email);
    } else {
      console.log('❌ Error parseando cookie');
      return;
    }

    // 5. PASO 5: Simular fetchUserCompleteInfo()
    console.log('\n5️⃣ PASO 5: fetchUserCompleteInfo() - Buscando en tabla usuarios...');
    
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select(`
        IdUsuario,
        NombreUsuario,
        Nombres,
        Apellidos,
        Email,
        Activo,
        FechaCreacion,
        UserId,
        IdEmpresa,
        Direccion,
        Telefono,
        IdSucursal
      `)
      .eq('UserId', authUser.user.id)
      .single();

    if (usuariosError) {
      console.error('❌ Error obteniendo usuario:', usuariosError);
      console.log('🔍 Esto es exactamente lo que está pasando en tu aplicación!');
      console.log('💡 El usuario existe en Supabase Auth pero no se encuentra en la tabla usuarios');
      return;
    }

    console.log('✅ Usuario encontrado en tabla usuarios');
    console.log('📝 Datos del usuario:', {
      IdUsuario: usuarios.IdUsuario,
      Nombres: usuarios.Nombres,
      Email: usuarios.Email,
      IdEmpresa: usuarios.IdEmpresa
    });

    // 6. PASO 6: Buscar empresa
    let empresa = null;
    if (usuarios.IdEmpresa) {
      console.log('\n6️⃣ PASO 6: Buscando empresa...');
      const { data: empresaData, error: empresaError } = await supabase
        .from('empresas')
        .select(`
          IdEmpresa,
          RazonSocial,
          NombreComercial,
          RNC,
          Direccion,
          Telefono,
          Logo
        `)
        .eq('IdEmpresa', usuarios.IdEmpresa)
        .single();

      if (!empresaError) {
        empresa = empresaData;
        console.log('✅ Empresa encontrada:', empresa.RazonSocial);
      } else {
        console.log('❌ Error buscando empresa:', empresaError.message);
      }
    }

    // 7. PASO 7: Resultado final de useAuthenticatedUser
    console.log('\n7️⃣ PASO 7: Resultado final de useAuthenticatedUser...');
    const completeUserInfo = {
      authUser: authUser.user,
      usuario: usuarios,
      empresa: empresa,
      sucursal: null,
      displayName: `${usuarios.Nombres} ${usuarios.Apellidos}`.trim() || usuarios.NombreUsuario || authUser.user.email,
      isComplete: true
    };

    console.log('🎉 ¡ÉXITO! useAuthenticatedUser devolvería:');
    console.log('📊 userInfo:', {
      displayName: completeUserInfo.displayName,
      usuario: {
        IdUsuario: completeUserInfo.usuario.IdUsuario,
        Nombres: completeUserInfo.usuario.Nombres,
        Email: completeUserInfo.usuario.Email
      },
      empresa: completeUserInfo.empresa ? {
        IdEmpresa: completeUserInfo.empresa.IdEmpresa,
        RazonSocial: completeUserInfo.empresa.RazonSocial
      } : null,
      isComplete: completeUserInfo.isComplete
    });

    console.log('\n✅ loading: false');
    console.log('✅ error: null');
    console.log('✅ isAuthenticated: true');

    console.log('\n🎯 CONCLUSIÓN: El WelcomeWidget debería mostrar:');
    console.log(`   - Saludo: "¡Hola, ${completeUserInfo.displayName}!"`);
    console.log(`   - Empresa: "${completeUserInfo.empresa?.RazonSocial || 'Sin empresa'}"`);
    console.log('   - Avatar con iniciales');
    console.log('   - Información completa del usuario');

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

simulateAppLogin();