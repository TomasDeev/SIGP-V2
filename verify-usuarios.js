import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyUsuarios() {
  console.log('🔍 Verificando usuarios en la tabla...\n');

  try {
    // Verificar usuarios en la tabla
    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('FechaCreacion', { ascending: false });

    if (error) {
      console.error('❌ Error consultando usuarios:', error.message);
      return;
    }

    console.log(`✅ Total de usuarios encontrados: ${usuarios.length}\n`);

    if (usuarios.length > 0) {
      console.log('📋 Lista de usuarios:');
      console.log('─'.repeat(80));
      usuarios.forEach((usuario, index) => {
        console.log(`${index + 1}. ${usuario.Nombres} ${usuario.Apellidos}`);
        console.log(`   Email: ${usuario.Email}`);
        console.log(`   Usuario: ${usuario.NombreUsuario}`);
        console.log(`   Activo: ${usuario.Activo ? 'Sí' : 'No'}`);
        console.log(`   Fecha: ${new Date(usuario.FechaCreacion).toLocaleString()}`);
        console.log('─'.repeat(80));
      });
    } else {
      console.log('⚠️  No se encontraron usuarios en la tabla.');
      console.log('💡 Asegúrate de ejecutar el script SQL en Supabase primero.');
    }

    // Verificar configuración de RLS
    console.log('\n🔒 Verificando configuración de RLS...');
    const { data: rlsInfo, error: rlsError } = await supabase
      .rpc('exec_sql', { 
        sql: `
          SELECT 
            schemaname,
            tablename,
            rowsecurity
          FROM pg_tables 
          WHERE tablename = 'usuarios' AND schemaname = 'public'
        `
      })
      .single();

    if (!rlsError && rlsInfo) {
      console.log(`✅ RLS está ${rlsInfo.rowsecurity ? 'habilitado' : 'deshabilitado'} en la tabla usuarios`);
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Función para probar la conexión
async function testConnection() {
  console.log('🔗 Probando conexión a Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Error de conexión:', error.message);
      return false;
    }

    console.log('✅ Conexión exitosa a Supabase\n');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando verificación de usuarios...\n');
  
  const connected = await testConnection();
  if (connected) {
    await verifyUsuarios();
  }
  
  console.log('\n🏁 Verificación completada');
}

main().catch(console.error);