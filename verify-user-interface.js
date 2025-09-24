import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Leer variables de entorno
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Configurando cliente Supabase...');
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyUserInterface() {
  console.log('\n🔍 === VERIFICACIÓN DE INTERFAZ DE USUARIOS ===\n');

  try {
    // 1. Verificar usuarios en la tabla usuarios (lowercase)
    console.log('1️⃣ Verificando tabla usuarios (lowercase)...');
    const { data: usuariosLower, error: errorLower } = await supabase
      .from('usuarios')
      .select('*');
    
    console.log('📊 Usuarios en tabla usuarios (lowercase):', usuariosLower?.length || 0);
    if (usuariosLower && usuariosLower.length > 0) {
      console.log('👤 Usuarios encontrados:', usuariosLower.map(u => ({ 
        email: u.Email || u.email, 
        nombre: u.NombreUsuario || u.nombre_usuario,
        activo: u.Activo || u.activo 
      })));
    }
    if (errorLower) {
      console.log('❌ Error en tabla usuarios (lowercase):', errorLower.message);
    }

    // 2. Verificar usuarios en la tabla Usuarios (uppercase)
    console.log('\n2️⃣ Verificando tabla Usuarios (uppercase)...');
    const { data: usuariosUpper, error: errorUpper } = await supabase
      .from('Usuarios')
      .select('*');
    
    console.log('📊 Usuarios en tabla Usuarios (uppercase):', usuariosUpper?.length || 0);
    if (usuariosUpper && usuariosUpper.length > 0) {
      console.log('👤 Usuarios encontrados:', usuariosUpper.map(u => ({ 
        email: u.Email || u.email, 
        nombre: u.NombreUsuario || u.nombre_usuario,
        activo: u.Activo || u.activo 
      })));
    }
    if (errorUpper) {
      console.log('❌ Error en tabla Usuarios (uppercase):', errorUpper.message);
    }

    // 3. Verificar usuarios en auth.users
    console.log('\n3️⃣ Verificando auth.users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authUsers && authUsers.users) {
      console.log('📊 Usuarios en auth.users:', authUsers.users.length);
      console.log('👤 Usuarios auth encontrados:', authUsers.users.map(u => ({ 
        email: u.email, 
        id: u.id,
        created_at: u.created_at 
      })));
    }
    if (authError) {
      console.log('❌ Error en auth.users:', authError.message);
    }

    // 4. Crear datos de prueba si no hay usuarios en las tablas
    const totalUsuarios = (usuariosLower?.length || 0) + (usuariosUpper?.length || 0);
    
    if (totalUsuarios === 0) {
      console.log('\n4️⃣ No se encontraron usuarios en las tablas. Creando datos de prueba...');
      await createTestData();
    } else {
      console.log('\n✅ Se encontraron usuarios en las tablas. No es necesario crear datos de prueba.');
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

async function createTestData() {
  console.log('\n🧪 === CREANDO DATOS DE PRUEBA ===\n');

  const testUsers = [
    {
      NombreUsuario: 'jdiaz',
      Nombres: 'Juan',
      Apellidos: 'Díaz',
      Email: 'jdiaz@clavoservices.com',
      Activo: true,
      FechaCreacion: new Date().toISOString(),
      UserId: '550e8400-e29b-41d4-a716-446655440000', // UUID de ejemplo
      RegID: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      NombreUsuario: 'mgarcia',
      Nombres: 'María',
      Apellidos: 'García',
      Email: 'mgarcia@clavoservices.com',
      Activo: true,
      FechaCreacion: new Date().toISOString(),
      UserId: '550e8400-e29b-41d4-a716-446655440002',
      RegID: '550e8400-e29b-41d4-a716-446655440003'
    },
    {
      NombreUsuario: 'admin',
      Nombres: 'Administrador',
      Apellidos: 'Sistema',
      Email: 'admin@clavoservices.com',
      Activo: true,
      FechaCreacion: new Date().toISOString(),
      UserId: '550e8400-e29b-41d4-a716-446655440004',
      RegID: '550e8400-e29b-41d4-a716-446655440005'
    }
  ];

  // Intentar insertar en tabla usuarios (lowercase)
  console.log('1️⃣ Intentando insertar en tabla usuarios (lowercase)...');
  for (const user of testUsers) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .insert(user)
        .select();
      
      if (error) {
        console.log(`❌ Error insertando ${user.Email} en usuarios (lowercase):`, error.message);
      } else {
        console.log(`✅ Usuario ${user.Email} insertado exitosamente en usuarios (lowercase)`);
      }
    } catch (err) {
      console.log(`❌ Error general insertando ${user.Email}:`, err.message);
    }
  }

  // Intentar insertar en tabla Usuarios (uppercase)
  console.log('\n2️⃣ Intentando insertar en tabla Usuarios (uppercase)...');
  for (const user of testUsers) {
    try {
      const { data, error } = await supabase
        .from('Usuarios')
        .insert(user)
        .select();
      
      if (error) {
        console.log(`❌ Error insertando ${user.Email} en Usuarios (uppercase):`, error.message);
      } else {
        console.log(`✅ Usuario ${user.Email} insertado exitosamente en Usuarios (uppercase)`);
      }
    } catch (err) {
      console.log(`❌ Error general insertando ${user.Email}:`, err.message);
    }
  }

  // Verificar resultado final
  console.log('\n3️⃣ Verificando resultado final...');
  const { data: finalUsers } = await supabase
    .from('usuarios')
    .select('*');
  
  const { data: finalUsersUpper } = await supabase
    .from('Usuarios')
    .select('*');
  
  console.log('📊 Total usuarios en usuarios (lowercase):', finalUsers?.length || 0);
  console.log('📊 Total usuarios en Usuarios (uppercase):', finalUsersUpper?.length || 0);
}

// Ejecutar verificación
verifyUserInterface()
  .then(() => {
    console.log('\n🎉 Verificación completada');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error en verificación:', error);
    process.exit(1);
  });