import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Leer variables de entorno del archivo .env
const envContent = fs.readFileSync('.env', 'utf8');
const envLines = envContent.split('\n');
const envVars = {};

envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Configuración de Supabase:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? 'Configurada' : 'No encontrada');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertUserManually() {
  console.log('🔍 Insertando usuario manualmente en la tabla Usuarios...\n');

  try {
    // 1. Verificar si la tabla usuarios existe y está vacía
    console.log('1. Verificando tabla usuarios:');
    const { count, error: countError } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error verificando tabla:', countError.message);
      return;
    }

    console.log(`✅ Tabla usuarios encontrada. Registros actuales: ${count}`);

    // 2. Insertar el usuario específico
    console.log('\n2. Insertando usuario jdiaz@clavoservices.com:');
    
    const userData = {
      NombreUsuario: 'jdiaz',
      Nombres: 'José',
      Apellidos: 'Díaz',
      Email: 'jdiaz@clavoservices.com',
      Activo: true,
      UserId: '550e8400-e29b-41d4-a716-446655440000' // UUID de ejemplo
    };

    const { data: insertData, error: insertError } = await supabase
      .from('usuarios')
      .insert([userData])
      .select();

    if (insertError) {
      console.error('❌ Error insertando usuario:', insertError.message);
      
      // Si el error es de duplicado, intentar actualizar
      if (insertError.code === '23505') {
        console.log('🔄 Usuario ya existe, intentando actualizar...');
        
        const { data: updateData, error: updateError } = await supabase
          .from('usuarios')
          .update(userData)
          .eq('Email', userData.Email)
          .select();

        if (updateError) {
          console.error('❌ Error actualizando usuario:', updateError.message);
        } else {
          console.log('✅ Usuario actualizado exitosamente:', updateData);
        }
      }
    } else {
      console.log('✅ Usuario insertado exitosamente:', insertData);
    }

    // 3. Verificar el resultado final
    console.log('\n3. Verificando usuarios en la tabla:');
    const { data: allUsers, error: selectError } = await supabase
      .from('usuarios')
      .select('*')
      .order('FechaCreacion', { ascending: false });

    if (selectError) {
      console.error('❌ Error obteniendo usuarios:', selectError.message);
    } else {
      console.log(`✅ Total de usuarios: ${allUsers.length}`);
      allUsers.forEach((user, index) => {
        console.log(`\n--- Usuario ${index + 1} ---`);
        console.log(`ID: ${user.IdUsuario}`);
        console.log(`Usuario: ${user.NombreUsuario}`);
        console.log(`Nombres: ${user.Nombres}`);
        console.log(`Apellidos: ${user.Apellidos}`);
        console.log(`Email: ${user.Email}`);
        console.log(`Activo: ${user.Activo}`);
        console.log(`Fecha: ${user.FechaCreacion}`);
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar el script
insertUserManually();