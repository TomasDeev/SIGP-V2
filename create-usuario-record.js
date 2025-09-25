import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qanuxayxehaimiknxvlw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUsuarioRecord() {
  console.log('🔧 Creando registro de usuario en tabla usuarios...\n');

  const userId = '17dcbe83-108a-4bca-9f6d-89b2d17bee85';
  const email = 'jeiselperdomo@gmail.com';

  try {
    // Primero autenticar el cliente
    console.log('🔐 Autenticando cliente...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: '12345678'
    });

    if (authError) {
      console.error('❌ Error en autenticación:', authError.message);
      return;
    }

    console.log('✅ Cliente autenticado exitosamente');

    // Datos del usuario basados en la información de auth
    const usuarioData = {
      UserId: userId,
      NombreUsuario: 'Eliessel',
      Nombres: 'Eliessel',
      Apellidos: 'Perdomo',
      Email: email,
      IdEmpresa: 1, // La empresa que sabemos que existe
      Activo: true,
      FechaCreacion: new Date().toISOString()
    };

    console.log('📝 Datos a insertar:', JSON.stringify(usuarioData, null, 2));

    // Insertar el usuario
    const { data: insertedUser, error: insertError } = await supabase
      .from('usuarios')
      .insert([usuarioData])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error insertando usuario:', insertError.message);
      console.error('📝 Error details:', insertError);
      
      // Intentar con upsert en caso de que ya exista
      console.log('\n🔄 Intentando con upsert...');
      const { data: upsertedUser, error: upsertError } = await supabase
        .from('usuarios')
        .upsert([usuarioData], { onConflict: 'UserId' })
        .select()
        .single();

      if (upsertError) {
        console.error('❌ Error con upsert:', upsertError.message);
        return;
      }

      console.log('✅ Usuario creado/actualizado con upsert!');
      console.log('📝 Usuario:', JSON.stringify(upsertedUser, null, 2));
      return;
    }

    console.log('✅ Usuario creado exitosamente!');
    console.log('📝 Usuario insertado:', JSON.stringify(insertedUser, null, 2));

    // Verificar que se insertó correctamente
    console.log('\n🔍 Verificando inserción...');
    const { data: verifyUser, error: verifyError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('UserId', userId)
      .single();

    if (verifyError) {
      console.error('❌ Error verificando usuario:', verifyError.message);
    } else {
      console.log('✅ Verificación exitosa - Usuario encontrado:');
      console.log('📝 Usuario verificado:', JSON.stringify(verifyUser, null, 2));
    }

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

createUsuarioRecord();