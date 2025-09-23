import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Leer variables de entorno del archivo .env
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  if (line.includes('=') && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixUsuariosRLS() {
  console.log('🔧 Corrigiendo políticas de RLS para tabla Usuarios...\n');

  try {
    // Leer el archivo de migración
    const migrationSQL = fs.readFileSync('supabase/migrations/20250125000000_fix_usuarios_rls_policies.sql', 'utf8');
    
    console.log('📄 Contenido de la migración:');
    console.log(migrationSQL);
    console.log('\n');

    // Ejecutar la migración usando rpc
    console.log('🚀 Ejecutando migración...');
    
    // Dividir el SQL en comandos individuales
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command) {
        console.log(`\n📝 Ejecutando comando ${i + 1}/${commands.length}:`);
        console.log(command.substring(0, 100) + '...');
        
        try {
          const { data, error } = await supabase.rpc('exec_sql', { sql: command });
          
          if (error) {
            console.error(`❌ Error en comando ${i + 1}:`, error.message);
          } else {
            console.log(`✅ Comando ${i + 1} ejecutado exitosamente`);
          }
        } catch (err) {
          console.error(`❌ Excepción en comando ${i + 1}:`, err.message);
        }
      }
    }

    console.log('\n🎉 Migración completada');

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar la corrección
fixUsuariosRLS().then(() => {
  console.log('\n✅ Proceso completado');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error ejecutando corrección:', error);
  process.exit(1);
});