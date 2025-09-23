import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qanuxayxehaimiknxvlw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCompleteFlow() {
  console.log('🚀 Probando flujo completo: Registro + Creación de Empresa\n');
  
  try {
    const testEmail = 'test.user@example.com';
    const testPassword = 'TestPassword123!';
    
    console.log('1️⃣ Registrando nuevo usuario...');
    console.log('📧 Email:', testEmail);
    
    // Registrar usuario
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Usuario de Prueba TomasDevs'
        }
      }
    });
    
    if (signUpError) {
      console.log('❌ Error en registro:', signUpError);
      return;
    }
    
    console.log('✅ Usuario registrado exitosamente');
    console.log('🆔 User ID:', signUpData.user?.id);
    console.log('📧 Email confirmado:', signUpData.user?.email_confirmed_at ? 'Sí' : 'No');
    
    // Verificar que estamos autenticados
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('❌ No se pudo verificar la autenticación');
      return;
    }
    
    console.log('✅ Usuario autenticado:', user.email);
    
    // Esperar un momento para que la sesión se establezca
    console.log('⏳ Esperando que la sesión se establezca...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n2️⃣ Intentando crear empresa con usuario autenticado...');
    
    const empresaData = {
      RazonSocial: "TomasDevs Registrado",
      NombreComercial: "TomasDevs Reg",
      RNC: "123456789",
      Telefono: "809-555-1234",
      Direccion: "Calle Registrada 123",
      Presidente: "Usuario Registrado",
      CedulaPresidente: "001-1234567-8",
      Abogado: "Abogado Registrado",
      EstadoCivilAbogado: 1,
      CedulaAbogado: "001-7654321-0",
      DireccionAbogado: "Calle Legal Reg",
      Alguacil: "Alguacil Registrado",
      Banco: "Banco Registrado",
      NoCuenta: "123456789",
      Tasa: 12.0,
      Mora: 2.5,
      Cuotas: 36,
      GastoCierre: 5.0,
      Penalidad: 5,
      MaxAbonoSobreCapital: 0.9,
      MinAbonoSobreCapital: 0.1,
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
      console.log('❌ Error creando empresa:', error);
      console.log('🔍 Código de error:', error.code);
      console.log('📝 Mensaje:', error.message);
      
      if (error.code === '42501') {
        console.log('\n💡 Error 42501: Violación de política RLS');
        console.log('🔍 Verificando políticas...');
        
        // Intentar verificar las políticas
        const { data: policies, error: policiesError } = await supabase
          .rpc('get_policies', { table_name: 'empresas' })
          .catch(() => ({ data: null, error: 'No se pudo obtener políticas' }));
        
        if (policies) {
          console.log('📋 Políticas encontradas:', policies);
        } else {
          console.log('❌ No se pudieron obtener las políticas');
        }
      }
    } else {
      console.log('✅ ¡Empresa creada exitosamente!');
      console.log('🏢 Empresa:', data);
      
      // Verificar que se guardó
      console.log('\n3️⃣ Verificando que la empresa se guardó...');
      const { data: verificacion, error: verError } = await supabase
        .from('empresas')
        .select('*')
        .eq('RazonSocial', 'TomasDevs Registrado');
      
      if (verError) {
        console.log('❌ Error verificando:', verError);
      } else {
        console.log('✅ Verificación exitosa:', verificacion);
      }
    }
    
  } catch (error) {
    console.log('❌ Error general:', error);
  }
}

testCompleteFlow();