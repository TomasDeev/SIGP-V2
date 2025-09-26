// Test simple de la función setCookie
import { setCookie, getCookie } from './src/@jumbo/utilities/cookies.js';

console.log('🧪 Probando función setCookie...');

// Crear un objeto de prueba
const testUser = {
  UserId: 'test-123',
  email: 'test@example.com',
  name: 'Test User'
};

try {
  // Intentar crear la cookie
  console.log('📝 Creando cookie de prueba...');
  setCookie('test-cookie', JSON.stringify(testUser), 1);
  console.log('✅ Cookie creada exitosamente');

  // Intentar leer la cookie
  console.log('📖 Leyendo cookie de prueba...');
  const retrievedCookie = getCookie('test-cookie');
  console.log('Cookie leída:', retrievedCookie);

  if (retrievedCookie) {
    const parsedUser = JSON.parse(retrievedCookie);
    console.log('✅ Cookie parseada exitosamente:', parsedUser);
  } else {
    console.log('❌ No se pudo leer la cookie');
  }

} catch (error) {
  console.error('❌ Error en el test:', error);
}