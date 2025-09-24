import fs from 'fs';

// Crear datos de prueba para usuarios que se pueden usar en la interfaz
const testUsersData = [
  {
    IdUsuario: 1,
    NombreUsuario: 'jdiaz',
    Nombres: 'Juan',
    Apellidos: 'Díaz',
    Email: 'jdiaz@clavoservices.com',
    Activo: true,
    FechaCreacion: new Date().toISOString(),
    UserId: '550e8400-e29b-41d4-a716-446655440000',
    RegID: '550e8400-e29b-41d4-a716-446655440001'
  },
  {
    IdUsuario: 2,
    NombreUsuario: 'mgarcia',
    Nombres: 'María',
    Apellidos: 'García',
    Email: 'mgarcia@clavoservices.com',
    Activo: true,
    FechaCreacion: new Date().toISOString(),
    UserId: '550e8400-e29b-41d4-a716-446655440002',
    RegID: '550e8400-e29b-41d4-a716-446655440003'
  },
  {
    IdUsuario: 3,
    NombreUsuario: 'admin',
    Nombres: 'Administrador',
    Apellidos: 'Sistema',
    Email: 'admin@clavoservices.com',
    Activo: true,
    FechaCreacion: new Date().toISOString(),
    UserId: '550e8400-e29b-41d4-a716-446655440004',
    RegID: '550e8400-e29b-41d4-a716-446655440005'
  },
  {
    IdUsuario: 4,
    NombreUsuario: 'lrodriguez',
    Nombres: 'Luis',
    Apellidos: 'Rodríguez',
    Email: 'lrodriguez@clavoservices.com',
    Activo: false,
    FechaCreacion: new Date(Date.now() - 86400000).toISOString(), // Ayer
    UserId: '550e8400-e29b-41d4-a716-446655440006',
    RegID: '550e8400-e29b-41d4-a716-446655440007'
  },
  {
    IdUsuario: 5,
    NombreUsuario: 'aperez',
    Nombres: 'Ana',
    Apellidos: 'Pérez',
    Email: 'aperez@clavoservices.com',
    Activo: true,
    FechaCreacion: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
    UserId: '550e8400-e29b-41d4-a716-446655440008',
    RegID: '550e8400-e29b-41d4-a716-446655440009'
  }
];

console.log('🧪 === CREANDO ARCHIVO DE DATOS DE PRUEBA ===\n');

// Crear archivo de datos de prueba para el servicio de usuarios
const testDataContent = `// Datos de prueba para usuarios
// Este archivo se usa cuando no se pueden obtener datos de la base de datos
export const testUsersData = ${JSON.stringify(testUsersData, null, 2)};

export default testUsersData;
`;

// Escribir el archivo en la carpeta de servicios
const testDataPath = './src/app/_services/testUsersData.js';
fs.writeFileSync(testDataPath, testDataContent);

console.log('✅ Archivo de datos de prueba creado:', testDataPath);
console.log('📊 Total de usuarios de prueba:', testUsersData.length);
console.log('👤 Usuarios creados:');
testUsersData.forEach(user => {
  console.log(`   - ${user.NombreUsuario} (${user.Email}) - ${user.Activo ? 'Activo' : 'Inactivo'}`);
});

console.log('\n🔧 Ahora necesitas modificar el UsuariosService para usar estos datos de prueba cuando no pueda acceder a la base de datos.');
console.log('\n🎉 Datos de prueba generados exitosamente');