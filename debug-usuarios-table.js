import { createClient } from '@supabase/supabase-js';

// Variables de entorno (necesitas configurarlas manualmente o usar .env)
const supabaseUrl = 'https://your-project.supabase.co'; // Reemplazar con tu URL
const supabaseServiceKey = 'your-service-role-key'; // Reemplazar con tu service role key

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Crear cliente con service role key para bypasear RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function debugUsuariosTable() {
  console.log('🔍 Verificando tabla Usuarios...\n');

  try {
    // 1. Verificar estructura de la tabla
    console.log('1. Verificando estructura de la tabla Usuarios:');
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_columns', { table_name: 'Usuarios' })
      .catch(() => null);

    // 2. Contar registros totales
    console.log('\n2. Contando registros en la tabla Usuarios:');
    const { count, error: countError } = await supabase
      .from('Usuarios')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error contando usuarios:', countError.message);
    } else {
      console.log(`✅ Total de usuarios en la tabla: ${count}`);
    }

    // 3. Obtener todos los usuarios (usando service role para bypasear RLS)
    console.log('\n3. Obteniendo todos los usuarios:');
    const { data: usuarios, error: usuariosError } = await supabase
      .from('Usuarios')
      .select('*')
      .order('IdUsuario', { ascending: true });

    if (usuariosError) {
      console.error('❌ Error obteniendo usuarios:', usuariosError.message);
    } else {
      console.log(`✅ Usuarios encontrados: ${usuarios.length}`);
      
      if (usuarios.length > 0) {
        console.log('\n📋 Datos de usuarios:');
        usuarios.forEach((usuario, index) => {
          console.log(`\n--- Usuario ${index + 1} ---`);
          console.log(`ID: ${usuario.IdUsuario}`);
          console.log(`UserId (Auth): ${usuario.UserId || 'NULL'}`);
          console.log(`IdEmpresa: ${usuario.IdEmpresa || 'NULL'}`);
          console.log(`NombreUsuario: ${usuario.NombreUsuario}`);
          console.log(`Nombres: ${usuario.Nombres}`);
          console.log(`Apellidos: ${usuario.Apellidos}`);
          console.log(`Email: ${usuario.Email}`);
          console.log(`Activo: ${usuario.Activo}`);
          console.log(`FechaCreacion: ${usuario.FechaCreacion}`);
        });
      }
    }

    // 4. Verificar usuarios de auth
    console.log('\n4. Verificando usuarios en auth.users:');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error obteniendo usuarios de auth:', authError.message);
    } else {
      console.log(`✅ Usuarios en auth.users: ${authUsers.users.length}`);
      
      if (authUsers.users.length > 0) {
        console.log('\n📋 Usuarios de auth:');
        authUsers.users.forEach((user, index) => {
          console.log(`\n--- Auth User ${index + 1} ---`);
          console.log(`ID: ${user.id}`);
          console.log(`Email: ${user.email}`);
          console.log(`Created: ${user.created_at}`);
          console.log(`Last Sign In: ${user.last_sign_in_at || 'Never'}`);
        });
      }
    }

    // 5. Verificar políticas RLS
    console.log('\n5. Verificando políticas RLS para tabla Usuarios:');
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'Usuarios');

    if (policiesError) {
      console.error('❌ Error obteniendo políticas:', policiesError.message);
    } else {
      console.log(`✅ Políticas encontradas: ${policies.length}`);
      policies.forEach((policy, index) => {
        console.log(`\n--- Política ${index + 1} ---`);
        console.log(`Nombre: ${policy.policyname}`);
        console.log(`Comando: ${policy.cmd}`);
        console.log(`Expresión: ${policy.qual}`);
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar el debug
debugUsuariosTable().then(() => {
  console.log('\n✅ Debug completado');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error ejecutando debug:', error);
  process.exit(1);
});