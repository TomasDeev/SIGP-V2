import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qanuxayxehaimiknxvlw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs";

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAuthAndHooks() {
  console.log('🔍 Depurando autenticación y hooks...\n');

  try {
    // 1. Verificar sesión actual
    console.log('1. Verificando sesión actual...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Error obteniendo sesión:', sessionError.message);
      return;
    }

    if (!session) {
      console.log('❌ No hay sesión activa');
      return;
    }

    console.log('✅ Sesión activa encontrada');
    console.log(`   - Usuario ID: ${session.user.id}`);
    console.log(`   - Email: ${session.user.email}`);

    // 2. Buscar usuario en tabla usuarios
    console.log('\n2. Buscando usuario en tabla usuarios...');
    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios')
      .select(`
        IdUsuario,
        NombreUsuario,
        Nombres,
        Apellidos,
        Email,
        IdEmpresa,
        Activo
      `)
      .eq('UserId', session.user.id)
      .single();

    if (usuarioError) {
      console.error('❌ Error obteniendo usuario:', usuarioError.message);
      console.log('   Intentando buscar por email...');
      
      const { data: usuarioByEmail, error: emailError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('Email', session.user.email)
        .single();
      
      if (emailError) {
        console.error('❌ Usuario no encontrado por email:', emailError.message);
        return;
      } else {
        console.log('✅ Usuario encontrado por email:', usuarioByEmail);
        return;
      }
    }

    console.log('✅ Usuario encontrado en tabla usuarios:');
    console.log(`   - Nombre: ${usuario.Nombres} ${usuario.Apellidos}`);
    console.log(`   - Email: ${usuario.Email}`);
    console.log(`   - IdEmpresa: ${usuario.IdEmpresa}`);
    console.log(`   - Activo: ${usuario.Activo}`);

    // 3. Obtener información de la empresa
    if (usuario.IdEmpresa) {
      console.log('\n3. Obteniendo información de la empresa...');
      const { data: empresa, error: empresaError } = await supabase
        .from('empresas')
        .select(`
          IdEmpresa,
          RazonSocial,
          NombreComercial,
          RNC,
          Activo
        `)
        .eq('IdEmpresa', usuario.IdEmpresa)
        .single();

      if (empresaError) {
        console.error('❌ Error obteniendo empresa:', empresaError.message);
      } else {
        console.log('✅ Empresa encontrada:');
        console.log(`   - Nombre Comercial: ${empresa.NombreComercial}`);
        console.log(`   - Razón Social: ${empresa.RazonSocial}`);
        console.log(`   - RNC: ${empresa.RNC}`);
        console.log(`   - Activo: ${empresa.Activo}`);
      }

      // 4. Obtener miembros de la empresa
      console.log('\n4. Obteniendo miembros de la empresa...');
      const { data: miembros, error: miembrosError } = await supabase
        .from('usuarios')
        .select(`
          IdUsuario,
          Nombres,
          Apellidos,
          Email,
          Activo
        `)
        .eq('IdEmpresa', usuario.IdEmpresa)
        .eq('Activo', true);

      if (miembrosError) {
        console.error('❌ Error obteniendo miembros:', miembrosError.message);
      } else {
        console.log(`✅ Miembros de la empresa encontrados: ${miembros.length}`);
        miembros.forEach(miembro => {
          console.log(`   - ${miembro.Nombres} ${miembro.Apellidos} (${miembro.Email})`);
        });
      }
    } else {
      console.log('\n❌ Usuario no tiene IdEmpresa asignado');
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

debugAuthAndHooks();