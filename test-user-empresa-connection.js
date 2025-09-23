import { createClient } from '@supabase/supabase-js';

// Variables de entorno de Supabase
const supabaseUrl = 'https://qanuxayxehaimiknxvlw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserEmpresaConnection() {
  console.log('🔍 Investigando conexión usuario-empresa...\n');

  try {
    // 1. Primero buscar todas las empresas para ver qué hay
    console.log('🏢 Buscando todas las empresas...');
    const { data: todasEmpresas, error: allError } = await supabase
       .from('empresas')
       .select(`
         "IdEmpresa",
         "NombreComercial", 
         "RazonSocial",
         "RNC",
         "RegID",
         "Activo"
       `);

    if (allError) {
      console.error('❌ Error buscando empresas:', allError.message);
      return;
    }

    if (todasEmpresas && todasEmpresas.length > 0) {
      console.log(`✅ Encontradas ${todasEmpresas.length} empresa(s) en total:`);
      todasEmpresas.forEach((empresa, index) => {
        console.log(`\n📋 Empresa ${index + 1}:`);
        console.log(`  - ID: ${empresa.IdEmpresa}`);
        console.log(`  - Nombre Comercial: "${empresa.NombreComercial}"`);
        console.log(`  - Razón Social: "${empresa.RazonSocial}"`);
        console.log(`  - RNC: ${empresa.RNC}`);
        console.log(`  - RegID: ${empresa.RegID}`);
        console.log(`  - Activo: ${empresa.Activo}`);
      });
    } else {
      console.log('❌ No se encontraron empresas en la base de datos');
      return;
    }

    // 2. Ahora buscar específicamente la empresa "kkk"
    console.log('\n🔍 Buscando empresa "kkk" específicamente...');
    const { data: empresasKkk, error: empresaError } = await supabase
       .from('empresas')
       .select(`
         "IdEmpresa",
         "NombreComercial", 
         "RazonSocial",
         "RNC",
         "RegID",
         "Activo"
       `)
       .eq('"NombreComercial"', 'kkk');

    if (empresaError) {
        console.error('❌ Error buscando empresa kkk específicamente:', empresaError.message);
        return;
      }
 
     if (empresasKkk && empresasKkk.length > 0) {
       console.log(`✅ Encontradas ${empresasKkk.length} empresa(s) "kkk":`);
       
       for (let i = 0; i < empresasKkk.length; i++) {
         const empresaKkk = empresasKkk[i];
         console.log(`\n📋 Empresa ${i + 1}:`);
         console.log(`  - ID: ${empresaKkk.IdEmpresa}`);
         console.log(`  - Nombre Comercial: ${empresaKkk.NombreComercial}`);
         console.log(`  - Razón Social: ${empresaKkk.RazonSocial}`);
         console.log(`  - RNC: ${empresaKkk.RNC}`);
         console.log(`  - RegID: ${empresaKkk.RegID}`);
         console.log(`  - Activo: ${empresaKkk.Activo}`);
         
         // 2. Ahora intentar obtener información del usuario con ese RegID
         console.log('\n👤 Verificando usuario asociado...');
         console.log(`Buscando usuario con ID: ${empresaKkk.RegID}`);
         
         // Intentar diferentes usuarios conocidos
         const usuariosConocidos = [
           { email: 'tomasdevs@gmail.com', password: 'tomasdevs123' },
           { email: 'admin@sigp.com', password: 'admin123' },
           { email: 'test@test.com', password: 'test123' }
         ];
         
         for (const usuario of usuariosConocidos) {
           console.log(`\n🔐 Probando autenticación con: ${usuario.email}`);
           const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
             email: usuario.email,
             password: usuario.password
           });

           if (!signInError && signInData.user) {
             console.log(`✅ Autenticación exitosa con: ${usuario.email}`);
             console.log(`🆔 User ID: ${signInData.user.id}`);
             console.log(`¿Coincide con RegID de empresa? ${signInData.user.id === empresaKkk.RegID ? '✅ SÍ' : '❌ NO'}`);
             
             if (signInData.user.id === empresaKkk.RegID) {
               console.log('\n🎉 ¡ENCONTRADO! Este usuario es el propietario de la empresa "kkk"');
               return;
             }
           } else {
             console.log(`❌ Fallo autenticación: ${signInError?.message || 'Error desconocido'}`);
           }
         }
       }
       
       console.log('\n❌ No se encontró el usuario propietario de ninguna empresa "kkk"');
     } else {
       console.log('❌ No se encontró empresa "kkk"');
     }



  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testUserEmpresaConnection();