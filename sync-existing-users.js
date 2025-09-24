import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = "https://qanuxayxehaimiknxvlw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function syncExistingUsers() {
  console.log('🔄 Iniciando sincronización manual de usuarios...\n');

  try {
    // Primero, vamos a insertar algunos usuarios de prueba basados en los que probablemente existen
    // Ya que no podemos acceder directamente a auth.users sin service key
    
    console.log('1. Verificando usuarios actuales en la tabla usuarios...');
    const { data: existingUsers, error: checkError } = await supabase
      .from('usuarios')
      .select('Email, UserId');

    if (checkError) {
      console.error('❌ Error verificando usuarios existentes:', checkError.message);
      return;
    }

    console.log(`📊 Usuarios actuales en tabla: ${existingUsers?.length || 0}`);

    // Vamos a intentar obtener el usuario actual autenticado
    console.log('\n2. Verificando usuario autenticado actual...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.log('⚠️  No hay usuario autenticado. Vamos a crear usuarios de prueba...');
      
      // Crear usuarios de prueba si no hay usuarios autenticados
      const testUsers = [
        {
          UserId: '550e8400-e29b-41d4-a716-446655440001',
          Email: 'admin@sigp.com',
          NombreUsuario: 'admin',
          Nombres: 'Administrador',
          Apellidos: 'Sistema',
          Activo: true,
          FechaCreacion: new Date().toISOString()
        },
        {
          UserId: '550e8400-e29b-41d4-a716-446655440002',
          Email: 'usuario@sigp.com',
          NombreUsuario: 'usuario',
          Nombres: 'Usuario',
          Apellidos: 'Prueba',
          Activo: true,
          FechaCreacion: new Date().toISOString()
        },
        {
          UserId: '550e8400-e29b-41d4-a716-446655440003',
          Email: 'test@example.com',
          NombreUsuario: 'test',
          Nombres: 'Test',
          Apellidos: 'User',
          Activo: true,
          FechaCreacion: new Date().toISOString()
        }
      ];

      console.log('\n3. Insertando usuarios de prueba...');
      for (const testUser of testUsers) {
        // Verificar si el usuario ya existe
        const { data: existing } = await supabase
          .from('usuarios')
          .select('Email')
          .eq('Email', testUser.Email)
          .single();

        if (!existing) {
          const { data, error } = await supabase
            .from('usuarios')
            .insert([testUser])
            .select();

          if (error) {
            console.error(`❌ Error insertando ${testUser.Email}:`, error.message);
          } else {
            console.log(`✅ Usuario insertado: ${testUser.Email}`);
          }
        } else {
          console.log(`ℹ️  Usuario ya existe: ${testUser.Email}`);
        }
      }

    } else {
      console.log(`✅ Usuario autenticado encontrado: ${user.email}`);
      
      // Verificar si este usuario ya está en la tabla usuarios
      const { data: existingUser } = await supabase
        .from('usuarios')
        .select('Email')
        .eq('UserId', user.id)
        .single();

      if (!existingUser) {
        console.log('\n3. Insertando usuario autenticado en tabla usuarios...');
        
        const userData = {
          UserId: user.id,
          Email: user.email,
          NombreUsuario: user.user_metadata?.username || user.email.split('@')[0],
          Nombres: user.user_metadata?.first_name || 'Usuario',
          Apellidos: user.user_metadata?.last_name || 'Nuevo',
          Activo: true,
          FechaCreacion: user.created_at || new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('usuarios')
          .insert([userData])
          .select();

        if (error) {
          console.error('❌ Error insertando usuario autenticado:', error.message);
        } else {
          console.log('✅ Usuario autenticado insertado correctamente');
        }
      } else {
        console.log('ℹ️  Usuario autenticado ya existe en la tabla');
      }
    }

    // Verificar el resultado final
    console.log('\n4. Verificando resultado final...');
    const { data: finalUsers, error: finalError } = await supabase
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

    if (finalError) {
      console.error('❌ Error verificando resultado final:', finalError.message);
      return;
    }

    console.log(`\n✅ Total de usuarios en tabla: ${finalUsers?.length || 0}`);
    if (finalUsers && finalUsers.length > 0) {
      finalUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.Email} - ${user.Nombres} ${user.Apellidos}`);
        console.log(`      Usuario: ${user.NombreUsuario} | Activo: ${user.Activo}`);
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar la sincronización
syncExistingUsers().then(() => {
  console.log('\n🏁 Sincronización completada');
  process.exit(0);
}).catch(error => {
  console.error('❌ Error ejecutando la sincronización:', error);
  process.exit(1);
});