import { createClient } from '@supabase/supabase-js';

// Usar las mismas credenciales que la aplicación
const supabaseUrl = 'https://qanuxayxehaimiknxvlw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCreateEmpresa() {
  console.log('🏗️ Probando crear empresa TomasDevs...');
  
  try {
    // Datos de la empresa con los nombres de columnas correctos según la migración
    const empresaData = {
      // Información General
      RazonSocial: "TomasDevs",
      NombreComercial: "TomasDevs",
      RNC: "123456789",
      Telefono: "809-555-0123",
      Direccion: "Calle Principal 123, Santo Domingo",
      
      // Información Legal
      Presidente: "Tomas Rodriguez",
      CedulaPresidente: "001-1234567-8",
      Abogado: "Maria Garcia",
      EstadoCivilAbogado: 1, // integer según la migración
      CedulaAbogado: "001-9876543-2",
      DireccionAbogado: "Calle Legal 456", // Nombre correcto según migración
      Alguacil: "Juan Perez",
      
      // Información Financiera (nombres según migración)
      Banco: "Banco Popular",
      NoCuenta: "123456789", // Nombre correcto según migración
      Tasa: 12.5, // Nombre correcto según migración
      Mora: 2.5, // Nombre correcto según migración
      Cuotas: 12, // Nombre correcto según migración
      GastoCierre: 5.0, // Nombre correcto según migración
      Penalidad: 5,
      MaxAbonoSobreCapital: 0.5, // Valor entre 0 y 1
      MinAbonoSobreCapital: 0.1, // Valor entre 0 y 1
      
      // Estado y Logo
      Activo: true,
      UrlLogo: "" // Nombre correcto según migración
    };
    
    console.log('📝 Datos a insertar:', empresaData);
    
    // Intentar crear la empresa usando el mismo método que el servicio
    const { data, error } = await supabase
      .from('empresas')
      .insert([empresaData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creando empresa:', error);
      return;
    }
    
    console.log('✅ Empresa creada exitosamente:', data);
    
    // Verificar que se guardó correctamente
    const { data: verificacion, error: errorVerificacion } = await supabase
      .from('empresas')
      .select('*')
      .eq('RazonSocial', 'TomasDevs');
    
    if (errorVerificacion) {
      console.error('❌ Error verificando empresa:', errorVerificacion);
      return;
    }
    
    console.log('🔍 Verificación - Empresa encontrada:', verificacion);
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

// Ejecutar la prueba
testCreateEmpresa().then(() => {
  console.log('🏁 Prueba de creación completada');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Error ejecutando prueba:', error);
  process.exit(1);
});