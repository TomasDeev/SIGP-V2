import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Leer variables de entorno del archivo .env
let supabaseUrl = '';
let supabaseAnonKey = '';

try {
  const envContent = fs.readFileSync('.env', 'utf8');
  const envLines = envContent.split('\n');
  
  for (const line of envLines) {
    if (line.startsWith('VITE_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = line.split('=')[1].trim();
    }
  }
} catch (error) {
  console.error('Error leyendo archivo .env:', error.message);
}

console.log('🔧 Intentando migrar usuarios manualmente...');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? 'Configurada' : 'NO CONFIGURADA');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan credenciales de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function manualUserMigration() {
  try {
    console.log('\n📊 Verificando estado actual...');
    
    // Verificar usuarios en public.Usuarios
    const { count: usuariosCount, error: usuariosError } = await supabase
      .from('Usuarios')
      .select('*', { count: 'exact', head: true });
    
    if (usuariosError) {
      console.error('❌ Error contando usuarios en Usuarios:', usuariosError.message);
      return;
    }
    console.log(`✅ Usuarios en public.Usuarios: ${usuariosCount}`);
    
    // Intentar insertar el usuario específico manualmente
    console.log('\n🎯 Insertando usuario específico jdiaz@clavoservices.com...');
    
    const targetUser = {
      UserId: '4ab8e77b-54de-42b7-b02f-5f3c19f0e9a6',
      IdEmpresa: 1,
      NombreUsuario: 'jdiaz',
      Nombres: 'José',
      Apellidos: 'Díaz',
      Email: 'jdiaz@clavoservices.com',
      Activo: true,
      FechaCreacion: new Date().toISOString()
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('Usuarios')
      .insert(targetUser)
      .select();
    
    if (insertError) {
      console.error('❌ Error insertando usuario:', insertError.message);
      console.error('Detalles:', insertError);
      
      // Intentar actualizar si ya existe
      console.log('🔄 Intentando actualizar usuario existente...');
      const { data: updateData, error: updateError } = await supabase
        .from('Usuarios')
        .update({
          NombreUsuario: targetUser.NombreUsuario,
          Nombres: targetUser.Nombres,
          Apellidos: targetUser.Apellidos,
          Email: targetUser.Email,
          Activo: targetUser.Activo
        })
        .eq('UserId', targetUser.UserId)
        .select();
      
      if (updateError) {
        console.error('❌ Error actualizando usuario:', updateError.message);
      } else {
        console.log('✅ Usuario actualizado exitosamente:', updateData);
      }
    } else {
      console.log('✅ Usuario insertado exitosamente:', insertData);
    }
    
    // Verificar resultados finales
    console.log('\n📈 Verificando resultados finales...');
    const { data: allUsers, error: allUsersError } = await supabase
      .from('Usuarios')
      .select('IdUsuario, UserId, NombreUsuario, Email, Activo, FechaCreacion')
      .order('FechaCreacion', { ascending: false });
    
    if (allUsersError) {
      console.error('❌ Error obteniendo usuarios:', allUsersError.message);
    } else {
      console.log(`✅ Total de usuarios en public.Usuarios: ${allUsers.length}`);
      
      if (allUsers.length > 0) {
        console.log('\n👥 Usuarios encontrados:');
        allUsers.forEach((user, index) => {
          console.log(`${index + 1}. ${user.Email} (${user.NombreUsuario}) - ID: ${user.IdUsuario}, UserId: ${user.UserId}`);
        });
        
        // Buscar el usuario específico
        const targetFound = allUsers.find(u => u.Email === 'jdiaz@clavoservices.com' || u.UserId === '4ab8e77b-54de-42b7-b02f-5f3c19f0e9a6');
        if (targetFound) {
          console.log('\n🎯 ¡Usuario objetivo encontrado!');
          console.log(JSON.stringify(targetFound, null, 2));
        } else {
          console.log('\n⚠️ Usuario objetivo NO encontrado');
        }
      }
    }
    
  } catch (error) {
    console.error('💥 Error inesperado:', error);
  }
}

// Ejecutar la migración manual
manualUserMigration();