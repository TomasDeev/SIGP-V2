// Test simple para verificar el mapeo de datos en el servicio
import OnboardingToCreditService from './src/app/_services/onboardingToCreditService.js';

// Datos de prueba simulando el contexto
const testData = {
  datosPersonales: {
    nombres: 'Juan',
    apellidos: 'Pérez Test',
    cedula: '001-1234567-8',
    fechaNacimiento: '1990-01-01',
    sexo: 'masculino',
    email: 'juan@test.com',
    nacionalidad: 'Dominicana',
    lugarNacimiento: 'Santo Domingo',
    estadoCivil: 'soltero',
    profesion: 'Ingeniero',
    telefono: '809-123-4567',
    celular: '809-987-6543'
  },
  direccion: {
    calle: 'Calle Principal #123',
    subsector: 'Ensanche La Fe',
    sector: 'Los Prados',
    pais: 'República Dominicana',
    provincia: 'Santo Domingo',
    municipio: 'Santo Domingo Norte',
    referenciaUbicacion: 'Frente al parque'
  },
  informacionLaboral: {
    empresa: 'Empresa XYZ SRL',
    cargo: 'Gerente de Proyectos',
    supervisor: 'Carlos Rodríguez',
    ingresosMes: 45000,
    ingresos: 45000,
    direccionEmpresa: 'Av. Lope de Vega #99',
    telefonoTrabajo: '809-555-1234',
    tiempoTrabajo: '3 años',
    quienPagara: 'Empleador'
  },
  referenciasPersonales: [
    {
      nombres: 'María',
      apellidos: 'Gómez',
      telefono: '809-111-2222',
      direccion: 'Calle A #45',
      tipo: 'familiar',
      parentesco: 'Hermana',
      tiempoConocerlo: '25 años'
    }
  ]
};

console.log('🧪 Iniciando prueba de mapeo de datos...');
console.log('📊 Datos de entrada:');
console.log('- Dirección:', testData.direccion);
console.log('- Información Laboral:', testData.informacionLaboral);

// Probar el método buildObservaciones
const observaciones = OnboardingToCreditService.buildObservaciones(testData);
console.log('\n📝 Observaciones generadas:');
console.log(observaciones);

// Probar el mapeo para createClientAccount
const clientData = {
  IdEmpresa: 1,
  Nombres: testData.datosPersonales.nombres,
  Apellidos: testData.datosPersonales.apellidos,
  Cedula: testData.datosPersonales.cedula,
  Telefono: testData.datosPersonales.telefono,
  Celular: testData.datosPersonales.celular,
  Email: testData.datosPersonales.email,
  Direccion: testData.direccion.calle,
  Sector: testData.direccion.sector,
  Nacionalidad: testData.datosPersonales.nacionalidad,
  LugarNacimiento: testData.datosPersonales.lugarNacimiento,
  FechaNacimiento: testData.datosPersonales.fechaNacimiento,
  EstadoCivil: 1,
  Profesion: testData.datosPersonales.profesion,
  LugarTrabajo: testData.informacionLaboral.empresa,
  DireccionTrabajo: testData.informacionLaboral.direccionEmpresa,
  TelefonoTrabajo: testData.informacionLaboral.telefonoTrabajo,
  Ingresos: testData.informacionLaboral.ingresos,
  TiempoTrabajo: testData.informacionLaboral.tiempoTrabajo,
  Observaciones: observaciones,
  Activo: true
};

console.log('\n💾 Datos mapeados para guardar:');
console.log('- Dirección:', clientData.Direccion);
console.log('- Sector:', clientData.Sector);
console.log('- Lugar de Trabajo:', clientData.LugarTrabajo);
console.log('- Dirección de Trabajo:', clientData.DireccionTrabajo);
console.log('- Teléfono de Trabajo:', clientData.TelefonoTrabajo);
console.log('- Ingresos:', clientData.Ingresos);
console.log('- Observaciones:', clientData.Observaciones);

console.log('\n✅ Prueba completada exitosamente!');