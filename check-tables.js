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

async function checkTables() {
  console.log('🔍 Verificando qué tablas existen en la base de datos...\n');

  // Lista de posibles nombres de tabla para usuarios
  const possibleTables = [
    'usuarios', 
    'Usuarios', 
    'users', 
    'Users',
    'profiles',
    'Profiles',
    'user_profiles'
  ];

  for (const tableName of possibleTables) {
    try {
      console.log(`Verificando tabla: ${tableName}`);
      
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
      } else {
        console.log(`✅ ${tableName}: Existe (${count} registros)`);
        
        // Si encontramos una tabla, obtener su estructura
        const { data, error: dataError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
          
        if (!dataError && data && data.length > 0) {
          console.log(`   Columnas: ${Object.keys(data[0]).join(', ')}`);
        } else if (!dataError) {
          console.log(`   Tabla vacía`);
        }
      }
    } catch (err) {
      console.log(`❌ ${tableName}: Error de conexión`);
    }
    console.log('');
  }

  // También verificar si podemos acceder a información del usuario actual
  console.log('🔍 Verificando usuario actual...');
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.log('❌ No hay usuario autenticado:', error.message);
    } else if (user) {
      console.log('✅ Usuario autenticado encontrado:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Creado: ${user.created_at}`);
    } else {
      console.log('❌ No hay usuario autenticado');
    }
  } catch (err) {
    console.log('❌ Error verificando usuario:', err.message);
  }
}

// Ejecutar el script
checkTables();