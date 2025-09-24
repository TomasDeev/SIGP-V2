import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = "https://qanuxayxehaimiknxvlw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUsuariosSync() {
  console.log('🔍 Verificando sincronización de usuarios...\n');

  try {
    // 1. Verificar usuarios en auth.users
    console.log('1. Verificando usuarios en auth.users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error accediendo a auth.users:', authError.message);
      console.log('ℹ️  Esto es normal si no tienes permisos de admin. Continuando con la verificación de la tabla usuarios...\n');
    } else {
      console.log(`✅ Usuarios en auth.users: ${authUsers.users?.length || 0}`);
      authUsers.users?.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (ID: ${user.id})`);
      });
      console.log('');
    }

    // 2. Verificar usuarios en la tabla usuarios
    console.log('2. Verificando usuarios en la tabla usuarios...');
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select(`
        IdUsuario,
        UserId,
        NombreUsuario,
        Nombres,
        Apellidos,
        Email,
        Activo,
        FechaCreacion
      `)
      .order('FechaCreacion', { ascending: false });

    if (usuariosError) {
      console.error('❌ Error consultando tabla usuarios:', usuariosError.message);
      return;
    }

    console.log(`✅ Usuarios en tabla usuarios: ${usuarios?.length || 0}`);
    if (usuarios && usuarios.length > 0) {
      usuarios.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.Email} - ${user.Nombres} ${user.Apellidos}`);
        console.log(`      Usuario: ${user.NombreUsuario} | Activo: ${user.Activo}`);
        console.log(`      UserId: ${user.UserId}`);
        console.log(`      Fecha: ${user.FechaCreacion}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No se encontraron usuarios en la tabla usuarios');
    }

    // 3. Verificar si existe el trigger
    console.log('3. Verificando trigger de sincronización...');
    const { data: triggers, error: triggerError } = await supabase
      .from('information_schema.triggers')
      .select('trigger_name, event_manipulation, action_statement')
      .eq('trigger_name', 'on_auth_user_created');

    if (triggerError) {
      console.log('ℹ️  No se pudo verificar el trigger (permisos limitados)');
    } else if (triggers && triggers.length > 0) {
      console.log('✅ Trigger encontrado:', triggers[0].trigger_name);
    } else {
      console.log('⚠️  Trigger no encontrado');
    }

    // 4. Verificar función de sincronización
    console.log('\n4. Verificando función de sincronización...');
    const { data: functions, error: functionError } = await supabase
      .from('information_schema.routines')
      .select('routine_name, routine_type')
      .eq('routine_name', 'handle_new_auth_user');

    if (functionError) {
      console.log('ℹ️  No se pudo verificar la función (permisos limitados)');
    } else if (functions && functions.length > 0) {
      console.log('✅ Función encontrada:', functions[0].routine_name);
    } else {
      console.log('⚠️  Función no encontrada');
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar la prueba
testUsuariosSync().then(() => {
  console.log('\n🏁 Verificación completada');
  process.exit(0);
}).catch(error => {
  console.error('❌ Error ejecutando la verificación:', error);
  process.exit(1);
});