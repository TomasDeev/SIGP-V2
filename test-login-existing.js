import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Leer variables de entorno
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

console.log('🔐 PROBANDO LOGIN CON USUARIOS EXISTENTES');
console.log('=========================================');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testExistingLogins() {
  // Lista de credenciales para probar
  const credenciales = [
    { email: 'test@sigp.com', password: 'test123456' },
    { email: 'test@sigp.com', password: 'test123' },
    { email: 'admin@sigp.com', password: 'admin123' },
    { email: 'admin@sigp.com', password: 'admin123456' },
    { email: 'jeiselperdomo@gmail.com', password: 'Jeisel123' },
    { email: 'jeiselperdomo@gmail.com', password: 'jeisel123' },
    { email: 'tomasdevss@gmail.com', password: 'tomas123' },
    { email: 'tomasdevss@gmail.com', password: 'tomas123456' }
  ];

  for (const cred of credenciales) {
    console.log(`\n🔐 Probando: ${cred.email} / ${cred.password}`);
    
    try {
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: cred.email,
        password: cred.password
      });

      if (loginError) {
        console.log(`❌ Falló: ${loginError.message}`);
      } else {
        console.log(`✅ ¡ÉXITO! Login con ${cred.email}`);
        console.log('🆔 User ID:', loginData.user.id);
        console.log('📧 Email:', loginData.user.email);
        console.log('🔑 Token presente:', !!loginData.session.access_token);
        
        // Verificar usuario en tabla usuarios
        const { data: usuarioData, error: usuarioError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('UserId', loginData.user.id)
          .single();

        if (usuarioError) {
          console.log('❌ Usuario NO encontrado en tabla usuarios');
        } else {
          console.log('✅ Usuario encontrado en tabla usuarios');
          console.log('📊 Datos:', {
            IdUsuario: usuarioData.IdUsuario,
            Nombres: usuarioData.Nombres,
            Apellidos: usuarioData.Apellidos,
            Email: usuarioData.Email,
            IdEmpresa: usuarioData.IdEmpresa
          });
        }

        // Verificar empresa
        if (usuarioData && usuarioData.IdEmpresa) {
          const { data: empresaData, error: empresaError } = await supabase
            .from('empresas')
            .select('IdEmpresa, RazonSocial, NombreComercial')
            .eq('IdEmpresa', usuarioData.IdEmpresa)
            .single();

          if (empresaError) {
            console.log('❌ Empresa NO encontrada');
          } else {
            console.log('✅ Empresa encontrada:', empresaData.RazonSocial);
          }
        }

        console.log('\n🎉 ¡CREDENCIALES VÁLIDAS ENCONTRADAS!');
        console.log(`📝 Para usar en la aplicación:`);
        console.log(`   Email: ${cred.email}`);
        console.log(`   Password: ${cred.password}`);
        
        return; // Salir cuando encontremos credenciales válidas
      }
    } catch (error) {
      console.log(`💥 Error: ${error.message}`);
    }
  }

  console.log('\n❌ No se encontraron credenciales válidas');
}

testExistingLogins();