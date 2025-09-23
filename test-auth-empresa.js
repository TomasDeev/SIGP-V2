import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qanuxayxehaimiknxvlw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testWithAuth() {
  console.log('🔐 Probando creación de empresa con usuario autenticado...\n');
  
  try {
    // Primero, intentar crear un usuario de prueba o usar uno existente
    console.log('1️⃣ Intentando registrar/autenticar usuario de prueba...');
    
    const testEmail = 'test@tomasdevs.com';
    const testPassword = 'TestPassword123!';
    
    // Intentar registrar el usuario (si ya existe, fallará pero continuaremos)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Usuario de Prueba'
        }
      }
    });
    
    if (signUpError && !signUpError.message.includes('User already registered')) {
      console.log('❌ Error en registro:', signUpError);
    } else {
      console.log('✅ Usuario registrado o ya existe');
    }
    
    // Intentar hacer login
    console.log('2️⃣ Intentando hacer login...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (signInError) {
      console.log('❌ Error en login:', signInError);
      console.log('💡 Intentando con credenciales por defecto...');
      
      // Intentar con credenciales por defecto si existen
      const { data: defaultSignIn, error: defaultError } = await supabase.auth.signInWithPassword({
        email: 'admin@example.com',
        password: 'password123'
      });
      
      if (defaultError) {
        console.log('❌ No se pudo autenticar con ninguna credencial');
        console.log('🔍 Verificando si hay usuarios en el sistema...');
        
        // Verificar la sesión actual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (session) {
          console.log('✅ Hay una sesión activa:', session.user.email);
        } else {
          console.log('❌ No hay sesión activa');
          return;
        }
      } else {
        console.log('✅ Login exitoso con credenciales por defecto');
      }
    } else {
      console.log('✅ Login exitoso:', signInData.user.email);
    }
    
    // Verificar que estamos autenticados
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('❌ No se pudo obtener el usuario autenticado');
      return;
    }
    
    console.log('✅ Usuario autenticado:', user.email);
    console.log('🆔 User ID:', user.id);
    
    // Ahora intentar crear la empresa
    console.log('\n3️⃣ Intentando crear empresa con usuario autenticado...');
    
    const empresaData = {
      RazonSocial: "TomasDevs Autenticado",
      NombreComercial: "TomasDevs Auth",
      RNC: "987654321",
      Telefono: "809-555-9999",
      Direccion: "Calle Autenticada 123",
      Presidente: "Usuario Autenticado",
      CedulaPresidente: "001-9999999-9",
      Abogado: "Abogado Test",
      EstadoCivilAbogado: 1,
      CedulaAbogado: "001-8888888-8",
      DireccionAbogado: "Calle Legal Auth",
      Alguacil: "Alguacil Test",
      Banco: "Banco Test",
      NoCuenta: "987654321",
      Tasa: 15.0,
      Mora: 3.0,
      Cuotas: 24,
      GastoCierre: 10.0,
      Penalidad: 10,
      MaxAbonoSobreCapital: 0.8,
      MinAbonoSobreCapital: 0.2,
      Activo: true,
      UrlLogo: ""
    };
    
    console.log('📝 Datos a insertar:', empresaData);
    
    const { data, error } = await supabase
      .from('empresas')
      .insert([empresaData])
      .select()
      .single();
    
    if (error) {
      console.log('❌ Error creando empresa (usuario autenticado):', error);
      
      if (error.code === '42501') {
        console.log('\n💡 El problema persiste incluso con usuario autenticado.');
        console.log('🔍 Esto indica que las políticas RLS son muy restrictivas.');
        console.log('📋 Posibles soluciones:');
        console.log('   1. Revisar las políticas RLS en Supabase Dashboard');
        console.log('   2. Crear políticas que permitan INSERT para usuarios autenticados');
        console.log('   3. Verificar si el usuario tiene los roles/permisos necesarios');
        console.log('   4. Considerar usar service_role key para operaciones administrativas');
      }
    } else {
      console.log('✅ ¡Empresa creada exitosamente!', data);
      
      // Verificar que se guardó
      const { data: verificacion } = await supabase
        .from('empresas')
        .select('*')
        .eq('RazonSocial', 'TomasDevs Autenticado');
      
      console.log('✅ Verificación:', verificacion);
    }
    
  } catch (error) {
    console.log('❌ Error general:', error);
  }
}

testWithAuth();