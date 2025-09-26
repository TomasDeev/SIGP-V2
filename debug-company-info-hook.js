import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ixqjqfqjqfqjqfqjqfqj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cWpxZnFqcWZxanFmcWpxZnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NzI2NzQsImV4cCI6MjA0ODE0ODY3NH0.example';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugCompanyInfoHook() {
  console.log('🔍 Debugging Company Info Hook...\n');

  try {
    // 1. Verificar usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Error de autenticación:', authError);
      return;
    }

    if (!user) {
      console.log('❌ No hay usuario autenticado');
      return;
    }

    console.log('✅ Usuario autenticado:', user.email);

    // 2. Buscar información del usuario en la tabla usuarios
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuarios')
      .select('IdUsuario, NombreUsuario, Nombres, Apellidos, Email, IdEmpresa, Activo')
      .eq('Email', user.email)
      .eq('Activo', true)
      .single();

    if (usuarioError) {
      console.error('❌ Error al obtener usuario:', usuarioError);
      return;
    }

    if (!usuarioData) {
      console.log('❌ Usuario no encontrado en tabla usuarios');
      return;
    }

    console.log('✅ Usuario encontrado:', usuarioData);
    console.log('📍 IdEmpresa del usuario:', usuarioData.IdEmpresa);

    // 3. Obtener información de la empresa
    const { data: empresaData, error: empresaError } = await supabase
      .from('empresas')
      .select(`
        IdEmpresa,
        RazonSocial,
        NombreComercial,
        RNC,
        Direccion,
        Telefono,
        Presidente,
        CedulaPresidente,
        Logo,
        Activo
      `)
      .eq('IdEmpresa', usuarioData.IdEmpresa)
      .eq('Activo', true)
      .single();

    if (empresaError) {
      console.error('❌ Error al obtener empresa:', empresaError);
      return;
    }

    if (!empresaData) {
      console.log('❌ Empresa no encontrada');
      return;
    }

    console.log('✅ Empresa encontrada:', empresaData);

    // 4. Contar usuarios activos de la empresa
    const { count: usuariosCount, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true })
      .eq('IdEmpresa', usuarioData.IdEmpresa)
      .eq('Activo', true);

    if (usuariosError) {
      console.error('❌ Error al contar usuarios:', usuariosError);
    } else {
      console.log('👥 Total usuarios activos:', usuariosCount);
    }

    // 5. Contar clientes de la empresa
    const { count: clientesCount, error: clientesError } = await supabase
      .from('cuentas')
      .select('*', { count: 'exact', head: true })
      .eq('IdEmpresa', usuarioData.IdEmpresa)
      .eq('Activo', true);

    if (clientesError) {
      console.error('❌ Error al contar clientes:', clientesError);
    } else {
      console.log('👤 Total clientes activos:', clientesCount);
    }

    // 6. Contar préstamos activos
    const { count: prestamosCount, error: prestamosError } = await supabase
      .from('prestamos')
      .select('*', { count: 'exact', head: true })
      .eq('IdEmpresa', usuarioData.IdEmpresa)
      .in('IdEstado', [1, 2, 3]); // Estados activos

    if (prestamosError) {
      console.error('❌ Error al contar préstamos:', prestamosError);
    } else {
      console.log('💰 Total préstamos activos:', prestamosCount);
    }

    // 7. Resultado final que debería devolver el hook
    const companyInfo = {
      ...empresaData,
      totalUsuarios: usuariosCount || 0,
      totalClientes: clientesCount || 0,
      totalPrestamos: prestamosCount || 0
    };

    console.log('\n🎯 RESULTADO FINAL del hook useCompanyInfo:');
    console.log(JSON.stringify(companyInfo, null, 2));

    console.log('\n📊 RESUMEN:');
    console.log(`- Empresa: ${companyInfo.NombreComercial || companyInfo.RazonSocial}`);
    console.log(`- Usuarios: ${companyInfo.totalUsuarios}`);
    console.log(`- Clientes: ${companyInfo.totalClientes}`);
    console.log(`- Préstamos: ${companyInfo.totalPrestamos}`);

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

debugCompanyInfoHook();