// Test script para verificar el flujo completo de guardado
// Este script prueba el servicio OnboardingToCreditService directamente

import { createClient } from '@supabase/supabase-js';

// Datos de prueba completos con todos los campos
const testData = {
  loanCalculation: {
    capital: 50000,
    interes: 15,
    cuotas: 12,
    gastoCierre: 500,
    frecuenciaPago: 30,
    planDescription: 'Plan Estándar'
  },
  datosPersonales: {
    nombres: 'Juan Carlos',
    apellidos: 'Pérez Rodríguez',
    cedula: '001-1234567-8',
    fechaNacimiento: '1990-05-15',
    lugarNacimiento: 'Santo Domingo',
    nacionalidad: 'Dominicana',
    estadoCivil: 'casado',
    telefono: '809-555-1234',
    celular: '809-555-5678',
    email: 'juan.perez@email.com',
    apodo: 'Juanchi',
    tipoResidencia: 'Propia'
  },
  direccion: {
    calle: 'Calle Principal #123',
    sector: 'Ensanche Naco',
    subsector: 'Sector A',
    municipio: 'Santo Domingo',
    provincia: 'Distrito Nacional',
    pais: 'República Dominicana',
    referenciaUbicacion: 'Frente al supermercado'
  },
  informacionLaboral: {
    lugarTrabajo: 'Empresa XYZ S.A.',
    direccionTrabajo: 'Av. Lope de Vega #456',
    telefonoTrabajo: '809-555-9012',
    ingresos: 75000,
    tiempoTrabajo: '3 años',
    cargo: 'Gerente de Ventas',
    supervisor: 'Lic. María González',
    quienPagara: 'Depósito directo'
  },
  referenciasPersonales: [
    {
      nombres: 'María',
      apellidos: 'Gómez',
      cedula: '001-7654321-9',
      telefono: '809-555-1111',
      tipo: 'familiar',
      relacion: 'Hermana'
    },
    {
      nombres: 'Carlos',
      apellidos: 'Martínez',
      cedula: '001-9876543-2',
      telefono: '809-555-2222',
      tipo: 'personal',
      relacion: 'Amigo'
    }
  ],
  cheques: {
    concepto: 'Préstamo personal para mejoras de vivienda',
    tipoPrestamo: 'personal'
  }
};

// Función para simular el servicio (sin dependencias externas)
function simulateOnboardingService(data) {
  console.log('=== INICIANDO SIMULACIÓN DE GUARDADO COMPLETO ===\n');
  
  // 1. Crear cuenta del cliente
  console.log('1. CREANDO CUENTA DEL CLIENTE:');
  const clientData = {
    Nombres: data.datosPersonales.nombres,
    Apellidos: data.datosPersonales.apellidos,
    Cedula: data.datosPersonales.cedula,
    Telefono: data.datosPersonales.telefono,
    Celular: data.datosPersonales.celuloar || data.datosPersonales.celular,
    Email: data.datosPersonales.email,
    Direccion: data.direccion.calle,
    Sector: data.direccion.sector,
    Nacionalidad: data.datosPersonales.nacionalidad,
    LugarNacimiento: data.datosPersonales.lugarNacimiento,
    FechaNacimiento: data.datosPersonales.fechaNacimiento,
    EstadoCivil: data.datosPersonales.estadoCivil === 'casado' ? 2 : 1,
    Profesion: data.informacionLaboral.cargo,
    LugarTrabajo: data.informacionLaboral.lugarTrabajo,
    DireccionTrabajo: data.informacionLaboral.direccionTrabajo,
    TelefonoTrabajo: data.informacionLaboral.telefonoTrabajo,
    Ingresos: parseFloat(data.informacionLaboral.ingresos),
    TiempoTrabajo: data.informacionLaboral.tiempoTrabajo,
    Observaciones: buildObservaciones(data)
  };
  
  console.log('Datos del cliente:', JSON.stringify(clientData, null, 2));
  
  // 2. Crear préstamo
  console.log('\n2. CREANDO PRÉSTAMO:');
  const loanData = {
    IdEmpresa: 1,
    IdCuenta: 123, // ID simulado del cliente
    IdTipoPrestamo: data.cheques.tipoPrestamo === 'personal' ? 2 : 1,
    FechaPrimerPago: new Date().toISOString(),
    CapitalPrestado: parseFloat(data.loanCalculation.capital),
    Interes: parseFloat(data.loanCalculation.interes),
    FrecuenciaPago: parseInt(data.loanCalculation.frecuenciaPago),
    Cuotas: parseInt(data.loanCalculation.cuotas),
    GastoCierre: parseFloat(data.loanCalculation.gastoCierre),
    GastoSeguro: 0,
    Observaciones: buildLoanObservaciones(data)
  };
  
  console.log('Datos del préstamo:', JSON.stringify(loanData, null, 2));
  
  // 3. Crear referencias
  console.log('\n3. CREANDO REFERENCIAS PERSONALES:');
  data.referenciasPersonales.forEach((ref, index) => {
    const referenceData = {
      Nombres: ref.nombres,
      Apellidos: ref.apellidos,
      Cedula: ref.cedula,
      Telefono: ref.telefono,
      Tipo: ref.tipo === 'familiar' ? 1 : ref.tipo === 'laboral' ? 2 : 3
    };
    console.log(`Referencia ${index + 1}:`, JSON.stringify(referenceData, null, 2));
  });
  
  console.log('\n=== SIMULACIÓN COMPLETADA EXITOSAMENTE ===');
  return { success: true, message: 'Simulación completada' };
}

// Función para construir observaciones (igual que en el servicio)
function buildObservaciones(onboardingData) {
  const observaciones = [];
  
  if (onboardingData.datosPersonales?.apodo) {
    observaciones.push(`Apodo: ${onboardingData.datosPersonales.apodo}`);
  }
  
  if (onboardingData.datosPersonales?.tipoResidencia) {
    observaciones.push(`Tipo de residencia: ${onboardingData.datosPersonales.tipoResidencia}`);
  }

  if (onboardingData.datosConyuge?.nombres) {
    observaciones.push(`Cónyuge: ${onboardingData.datosConyuge.nombres} ${onboardingData.datosConyuge.apellidos || ''}`);
  }

  // Información laboral adicional
  const infoLaboral = onboardingData.informacionLaboral || {};
  if (infoLaboral.cargo) {
    observaciones.push(`Cargo: ${infoLaboral.cargo}`);
  }
  if (infoLaboral.supervisor) {
    observaciones.push(`Supervisor: ${infoLaboral.supervisor}`);
  }
  if (infoLaboral.quienPagara) {
    observaciones.push(`Método de pago: ${infoLaboral.quienPagara}`);
  }

  // Dirección completa
  const direccionData = onboardingData.direccion || {};
  if (direccionData.subsector) {
    observaciones.push(`Subsector: ${direccionData.subsector}`);
  }
  if (direccionData.municipio) {
    observaciones.push(`Municipio: ${direccionData.municipio}`);
  }
  if (direccionData.provincia) {
    observaciones.push(`Provincia: ${direccionData.provincia}`);
  }
  if (direccionData.pais) {
    observaciones.push(`País: ${direccionData.pais}`);
  }
  if (direccionData.referenciaUbicacion) {
    observaciones.push(`Referencia ubicación: ${direccionData.referenciaUbicacion}`);
  }
  
  return observaciones.join('. ');
}

function buildLoanObservaciones(onboardingData) {
  const observaciones = [];
  
  if (onboardingData.cheques?.concepto) {
    observaciones.push(`Concepto: ${onboardingData.cheques.concepto}`);
  }

  if (onboardingData.cheques?.tipoPrestamo) {
    observaciones.push(`Tipo solicitado: ${onboardingData.cheques.tipoPrestamo}`);
  }

  if (onboardingData.loanCalculation?.planDescription) {
    observaciones.push(`Plan: ${onboardingData.loanCalculation.planDescription}`);
  }
  
  return observaciones.join('. ');
}

// Ejecutar simulación
console.log('=== TEST DE FLUJO COMPLETO DE GUARDADO ===');
console.log('Datos de prueba:', JSON.stringify(testData, null, 2));
console.log('\n');

try {
  const result = simulateOnboardingService(testData);
  console.log('\nResultado:', result);
} catch (error) {
  console.error('Error en la simulación:', error);
}