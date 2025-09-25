import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Leer las credenciales desde .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const envLines = envContent.split('\n');

let supabaseUrl = '';
let supabaseServiceKey = '';

envLines.forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim();
  }
});

// Usar la clave de servicio proporcionada
supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODMwODI3MSwiZXhwIjoyMDczODg0MjcxfQ.XleXFr1jkXeDbzcD54IiZ1M2zkOTJ1fKDU46uk8t4E8';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ No se encontraron las credenciales de Supabase en .env.local');
  process.exit(1);
}

// Crear cliente de Supabase con service role para acceder a auth.users
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkAuthUsers() {
  try {
    console.log('🔍 Verificando usuarios en auth.users...');
    
    // Obtener usuarios de auth.users usando admin API
    const { data: authUsers, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Error obteniendo usuarios de auth:', error);
      return;
    }
    
    console.log(`📊 Usuarios encontrados en auth.users: ${authUsers.users.length}`);
    
    if (authUsers.users.length > 0) {
      console.log('\n👥 Lista de usuarios en auth.users:');
      authUsers.users.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Confirmado: ${user.email_confirmed_at ? 'Sí' : 'No'}`);
        console.log(`   Creado: ${user.created_at}`);
        console.log(`   Último login: ${user.last_sign_in_at || 'Nunca'}`);
        console.log('   ---');
      });
    }
    
    // Ahora verificar la tabla usuarios
    console.log('\n🔍 Verificando tabla usuarios...');
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*');
    
    if (usuariosError) {
      console.error('❌ Error obteniendo usuarios de tabla usuarios:', usuariosError);
    } else {
      console.log(`📊 Usuarios encontrados en tabla usuarios: ${usuarios.length}`);
      
      if (usuarios.length > 0) {
        console.log('\n👥 Lista de usuarios en tabla usuarios:');
        usuarios.forEach((user, index) => {
          console.log(`${index + 1}. Email: ${user.Email}`);
          console.log(`   Nombre: ${user.Nombres} ${user.Apellidos}`);
          console.log(`   Usuario: ${user.NombreUsuario}`);
          console.log(`   Activo: ${user.Activo ? 'Sí' : 'No'}`);
          console.log(`   UserId: ${user.UserId}`);
          console.log('   ---');
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAuthUsers();