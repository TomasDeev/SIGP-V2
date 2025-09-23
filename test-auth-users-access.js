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

console.log('🔍 Verificando tablas de usuarios disponibles...');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? 'Configurada' : 'NO CONFIGURADA');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan credenciales de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAvailableTables() {
  console.log('\n📊 Probando diferentes tablas de usuarios...');
  
  // Lista de posibles tablas de usuarios
  const tablesToTest = [
    'users',           // public.users
    'Usuarios',        // public.Usuarios (con mayúscula)
    'usuarios',        // public.usuarios (minúscula)
    'profiles',        // public.profiles (común en Supabase)
    'user_profiles'    // public.user_profiles
  ];
  
  for (const tableName of tablesToTest) {
    try {
      console.log(`\n🔍 Probando tabla: ${tableName}`);
      
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(5);
      
      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
      } else {
        console.log(`✅ ${tableName}: Encontrada! (${count} registros)`);
        if (data && data.length > 0) {
          console.log(`   Primeros campos:`, Object.keys(data[0]));
          console.log(`   Primer registro:`, data[0]);
        }
      }
    } catch (err) {
      console.log(`💥 ${tableName}: Error inesperado - ${err.message}`);
    }
  }
  
  // También probar si podemos obtener el usuario actual
  console.log('\n👤 Probando obtener usuario actual...');
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log('Usuario actual:', user);
    console.log('Error:', error);
  } catch (err) {
    console.log('Error obteniendo usuario actual:', err.message);
  }
}

// Ejecutar la prueba
testAvailableTables();