import React, { createContext, useContext, useState, useCallback } from 'react';

// Crear el contexto
const OnboardingDataContext = createContext();

// Hook personalizado para usar el contexto
export const useOnboardingData = () => {
  const context = useContext(OnboardingDataContext);
  if (!context) {
    throw new Error('useOnboardingData debe ser usado dentro de un OnboardingDataProvider');
  }
  return context;
};

// Proveedor del contexto
export const OnboardingDataProvider = ({ children }) => {
  // Estado inicial para todos los datos del onboarding
  const [onboardingData, setOnboardingData] = useState({
    // Datos del cálculo de préstamo
    loanCalculation: {
      capital: '',
      tasaInteres: '',
      cantidadCuotas: '',
      gastoCierre: '',
      fechaPrimerPago: '',
      montoSeguro: 0,
      montoGps: 0,
      agente: '',
      suplidor: ''
    },
    
    // Datos personales
    datosPersonales: {
      nombres: '',
      apellidos: '',
      apodo: '',
      cedula: '',
      fechaNacimiento: '',
      sexo: '',
      email: '',
      telefono: '',
      celular: '',
      nacionalidad: '',
      lugarNacimiento: '',
      estadoCivil: '',
      profesion: '',
      ocupacion: '',
      tipoResidencia: ''
    },
    
    // Dirección y localización
    direccion: {
      provincia: '',
      municipio: '',
      sector: '',
      calle: '',
      numero: '',
      referencia: '',
      latitud: null,
      longitud: null
    },
    
    // Datos del cónyuge
    datosConyuge: {
      nombres: '',
      apellidos: '',
      cedula: '',
      fechaNacimiento: '',
      sexo: '',
      telefono: '',
      celular: '',
      lugarTrabajo: '',
      direccionTrabajo: ''
    },
    
    // Información laboral
    informacionLaboral: {
      empresa: '',
      cargo: '',
      supervisor: '',
      ingresos: '',
      direccionEmpresa: '',
      telefonoTrabajo: '',
      tiempoTrabajo: '',
      quienPagara: ''
    },
    
    // Referencias personales
    referenciasPersonales: [],
    
    // Cheques
    cheques: {
      tipoPrestamo: '',
      banco: '',
      numeroCuenta: '',
      tipoGarantia: '',
      descripcionGarantia: ''
    }
  });

  // Función para actualizar una sección específica de los datos
  const updateSection = useCallback((section, data) => {
    setOnboardingData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data
      }
    }));
  }, []);

  // Función para actualizar un campo específico dentro de una sección
  const updateField = useCallback((section, field, value) => {
    setOnboardingData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  }, []);

  // Función para agregar una referencia personal
  const addReferencia = useCallback((referencia) => {
    setOnboardingData(prev => ({
      ...prev,
      referenciasPersonales: [...prev.referenciasPersonales, referencia]
    }));
  }, []);

  // Función para eliminar una referencia personal
  const removeReferencia = useCallback((index) => {
    setOnboardingData(prev => ({
      ...prev,
      referenciasPersonales: prev.referenciasPersonales.filter((_, i) => i !== index)
    }));
  }, []);

  // Función para actualizar una referencia personal específica
  const updateReferencia = useCallback((index, referencia) => {
    setOnboardingData(prev => ({
      ...prev,
      referenciasPersonales: prev.referenciasPersonales.map((ref, i) => 
        i === index ? { ...ref, ...referencia } : ref
      )
    }));
  }, []);

  // Función para limpiar todos los datos
  const clearData = useCallback(() => {
    setOnboardingData({
      loanCalculation: {
        capital: '',
        tasaInteres: '',
        cantidadCuotas: '',
        gastoCierre: '',
        fechaPrimerPago: '',
        montoSeguro: 0,
        montoGps: 0,
        agente: '',
        suplidor: ''
      },
      datosPersonales: {
        nombres: '',
        apellidos: '',
        apodo: '',
        cedula: '',
        fechaNacimiento: '',
        sexo: '',
        email: '',
        nacionalidad: '',
        lugarNacimiento: '',
        estadoCivil: '',
        profesion: '',
        ocupacion: '',
        tipoResidencia: ''
      },
      direccion: {
        provincia: '',
        municipio: '',
        sector: '',
        calle: '',
        numero: '',
        referencia: '',
        latitud: null,
        longitud: null
      },
      datosConyuge: {
        nombres: '',
        apellidos: '',
        cedula: '',
        fechaNacimiento: '',
        sexo: '',
        telefono: '',
        celular: '',
        lugarTrabajo: '',
        direccionTrabajo: ''
      },
      informacionLaboral: {
        empresa: '',
        cargo: '',
        supervisor: '',
        ingresos: '',
        direccionEmpresa: '',
        telefonoTrabajo: '',
        tiempoTrabajo: '',
        quienPagara: ''
      },
      referenciasPersonales: [],
      cheques: {
        tipoPrestamo: '',
        banco: '',
        numeroCuenta: '',
        tipoGarantia: '',
        descripcionGarantia: ''
      }
    });
  }, []);

  // Función para obtener todos los datos
  const getAllData = useCallback(() => {
    return onboardingData;
  }, [onboardingData]);

  // Valor del contexto
  const contextValue = {
    onboardingData,
    updateSection,
    updateField,
    addReferencia,
    removeReferencia,
    updateReferencia,
    clearData,
    getAllData
  };

  return (
    <OnboardingDataContext.Provider value={contextValue}>
      {children}
    </OnboardingDataContext.Provider>
  );
};

export default OnboardingDataProvider;