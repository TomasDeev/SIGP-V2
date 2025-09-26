import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qanuxayxehaimiknxvlw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs";

const supabase = createClient(supabaseUrl, supabaseKey);

async function loginTestUser() {
  console.log('🔐 Intentando hacer login con usuario de prueba...\n');

  try {
    // Obtener usuarios de la tabla para ver qué emails tenemos
    console.log('1. Obteniendo usuarios disponibles...');
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('Email, Nombres, Apellidos, IdEmpresa')
      .eq('Activo', true);

    if (usuariosError) {
      console.error('❌ Error obteniendo usuarios:', usuariosError.message);
      return;
    }

    console.log('✅ Usuarios disponibles:');
    usuarios.forEach((usuario, index) => {
      console.log(`   ${index + 1}. ${usuario.Email} - ${usuario.Nombres} ${usuario.Apellidos} (Empresa: ${usuario.IdEmpresa})`);
    });

    // Intentar login con algunos emails comunes
    const testEmails = [
      'admin@test.com',
      'test@test.com',
      'tomas@test.com',
      'admin@sigp.com',
      'test@sigp.com'
    ];

    console.log('\n2. Intentando login con emails de prueba...');
    
    for (const email of testEmails) {
      console.log(`\nIntentando con: ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: '123456' // Contraseña común de prueba
      });

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✅ Login exitoso con ${email}`);
        console.log(`   Usuario ID: ${data.user.id}`);
        
        // Verificar si este usuario existe en la tabla usuarios
        const { data: usuarioData, error: usuarioError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('Email', email)
          .single();

        if (usuarioError) {
          console.log(`   ⚠️ Usuario no encontrado en tabla usuarios`);
        } else {
          console.log(`   ✅ Usuario encontrado: ${usuarioData.Nombres} ${usuarioData.Apellidos}`);
          console.log(`   Empresa ID: ${usuarioData.IdEmpresa}`);
        }
        
        return; // Salir si el login fue exitoso
      }
    }

    console.log('\n❌ No se pudo hacer login con ningún email de prueba');
    console.log('💡 Sugerencia: Verifica que existan usuarios en auth.users o crea uno nuevo');

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

loginTestUser();