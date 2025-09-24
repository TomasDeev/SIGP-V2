import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Leer variables del archivo .env
const envContent = fs.readFileSync('.env', 'utf8');
const envLines = envContent.split('\n');
const envVars = {};

envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim().replace(/['"]/g, '');
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSyncMigration() {
  console.log('🔄 Ejecutando migración de sincronización auth.users -> usuarios...\n');

  try {
    // 1. Verificar usuarios existentes en auth.users
    console.log('1. Verificando usuarios en auth.users...');
    
    // Crear el usuario si no existe
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'jdiaz@clavoservices.com',
      password: 'TempPassword123!',
      options: {
        data: {
          username: 'jdiaz',
          full_name: 'José Díaz',
          first_name: 'José',
          last_name: 'Díaz'
        }
      }
    });

    if (signUpError && !signUpError.message.includes('already registered')) {
      console.log('❌ Error creando usuario:', signUpError.message);
    } else {
      console.log('✅ Usuario en auth.users:', signUpData.user ? 'creado' : 'ya existe');
    }

    // 2. Leer el archivo de migración
    console.log('\n2. Leyendo archivo de migración...');
    const migrationSQL = fs.readFileSync('sync-auth-usuarios.sql', 'utf8');
    console.log('✅ Archivo de migración leído');

    // 3. Dividir el SQL en comandos individuales
    console.log('\n3. Ejecutando comandos de migración...');
    
    // Extraer comandos específicos del archivo
    const commands = [
      // Crear función de sincronización
      `CREATE OR REPLACE FUNCTION public.sync_auth_user_to_usuarios()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.Usuarios (
    "UserId",
    "IdEmpresa", 
    "NombreUsuario",
    "Nombres",
    "Apellidos", 
    "Email",
    "Activo",
    "FechaCreacion"
  ) VALUES (
    NEW.id,
    1,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'first_name', 'Sin nombre'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    true,
    NEW.created_at
  )
  ON CONFLICT ("UserId") DO UPDATE SET
    "Email" = EXCLUDED."Email",
    "NombreUsuario" = EXCLUDED."NombreUsuario",
    "Nombres" = EXCLUDED."Nombres",
    "Apellidos" = EXCLUDED."Apellidos";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`,

      // Crear trigger
      `DROP TRIGGER IF EXISTS on_auth_user_created_sync_usuarios ON auth.users;`,
      
      `CREATE TRIGGER on_auth_user_created_sync_usuarios
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_auth_user_to_usuarios();`,

      // Migrar usuarios existentes
      `INSERT INTO public.Usuarios (
  "UserId",
  "IdEmpresa",
  "NombreUsuario", 
  "Nombres",
  "Apellidos",
  "Email",
  "Activo",
  "FechaCreacion"
)
SELECT 
  au.id,
  1 as "IdEmpresa",
  COALESCE(au.raw_user_meta_data->>'username', split_part(au.email, '@', 1)) as "NombreUsuario",
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'first_name', 'Sin nombre') as "Nombres",
  COALESCE(au.raw_user_meta_data->>'last_name', '') as "Apellidos",
  au.email as "Email",
  (au.banned_until IS NULL) as "Activo",
  au.created_at as "FechaCreacion"
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.Usuarios u WHERE u."UserId" = au.id
);`
    ];

    // Intentar ejecutar cada comando
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i].trim();
      if (command) {
        console.log(`\n   Ejecutando comando ${i + 1}...`);
        try {
          const { data, error } = await supabase.rpc('exec_sql', { sql: command });
          if (error) {
            console.log(`   ❌ Error en comando ${i + 1}:`, error.message);
          } else {
            console.log(`   ✅ Comando ${i + 1} ejecutado exitosamente`);
          }
        } catch (err) {
          console.log(`   ❌ Error ejecutando comando ${i + 1}:`, err.message);
        }
      }
    }

    // 4. Verificar resultado
    console.log('\n4. Verificando resultado de la sincronización...');
    
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*');

    if (usuariosError) {
      console.log('❌ Error verificando usuarios:', usuariosError.message);
    } else {
      console.log(`✅ Total de usuarios sincronizados: ${usuarios.length}`);
      
      if (usuarios.length > 0) {
        console.log('\n👥 Usuarios encontrados:');
        usuarios.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.Email} - ${user.Nombres} ${user.Apellidos} (ID: ${user.IdUsuario})`);
        });

        // Buscar nuestro usuario específico
        const targetUser = usuarios.find(u => u.Email === 'jdiaz@clavoservices.com');
        if (targetUser) {
          console.log('\n🎯 ¡Usuario objetivo encontrado!');
          console.log(JSON.stringify(targetUser, null, 2));
        } else {
          console.log('\n⚠️ Usuario objetivo no encontrado');
        }
      }
    }

    // 5. Si la migración no funcionó, intentar inserción manual con datos específicos
    if (!usuarios || usuarios.length === 0) {
      console.log('\n5. Migración no funcionó, intentando inserción manual...');
      
      // Intentar insertar manualmente usando la estructura exacta
      const manualUserData = {
        UserId: '550e8400-e29b-41d4-a716-446655440000', // UUID fijo para prueba
        IdEmpresa: 1,
        NombreUsuario: 'jdiaz',
        Nombres: 'José',
        Apellidos: 'Díaz',
        Email: 'jdiaz@clavoservices.com',
        Activo: true
      };

      console.log('📝 Intentando inserción manual:', manualUserData);
      
      const { data: manualData, error: manualError } = await supabase
        .from('usuarios')
        .insert(manualUserData)
        .select();

      if (manualError) {
        console.log('❌ Error inserción manual:', manualError.message);
      } else {
        console.log('✅ Usuario insertado manualmente:', manualData);
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
    console.error('📝 Stack trace:', error.stack);
  }
}

// Ejecutar migración
executeSyncMigration().then(() => {
  console.log('\n✅ Proceso de migración completado');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error ejecutando migración:', error);
  process.exit(1);
});