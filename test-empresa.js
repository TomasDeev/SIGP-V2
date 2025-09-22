// Script de prueba para verificar la conexión con Supabase y crear una empresa de prueba
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qanuxayxehaimiknxvlw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Probando conexión con Supabase...');
  
  try {
    // Primero, verificar si la tabla existe
    const { data: tables, error: tablesError } = await supabase
      .from('Empresas')
      .select('*')
      .limit(1);
    
    if (tablesError) {
      console.error('❌ Error accediendo a la tabla Empresas:', tablesError);
      return;
    }
    
    console.log('✅ Tabla Empresas accesible');
    console.log('📊 Datos existentes:', tables);
    
    // Intentar crear una empresa de prueba
    const empresaPrueba = {
      RazonSocial: "Empresa de Prueba",
      NombreComercial: "Prueba Corp",
      RNC: "123456789",
      Direccion: "Calle de Prueba 123",
      Telefono: "809-555-0123",
      Presidente: "Juan Pérez",
      CedulaPresidente: "001-1234567-8",
      Abogado: "María García",
      EstadoCivilAbogado: 1,
      CedulaAbogado: "001-9876543-2",
      DireccionAbogado: "Calle Legal 456",
      Alguacil: "Pedro Martínez",
      Tasa: 12.5,
      Mora: 2.5,
      Cuotas: 12,
      GastoCierre: 5.0,
      UrlLogo: "",
      Banco: "Banco Popular",
      NoCuenta: "123456789",
      Activo: true,
      Penalidad: 1.0,
      MaxAbonoSobreCapital: 50.0,
      MinAbonoSobreCapital: 10.0
    };
    
    console.log('🏗️ Creando empresa de prueba...');
    const { data: newEmpresa, error: createError } = await supabase
      .from('Empresas')
      .insert(empresaPrueba)
      .select();
    
    if (createError) {
      console.error('❌ Error creando empresa:', createError);
    } else {
      console.log('✅ Empresa creada exitosamente:', newEmpresa);
    }
    
  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

testConnection();