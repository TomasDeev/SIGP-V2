import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

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

// Función para obtener datos iniciales
const getInitialData = () => {
  // Verificar si hay datos de edición en localStorage
  const editData = localStorage.getItem('onboardingEditData');
  if (editData) {
    try {
      const parsedData = JSON.parse(editData);
      // Limpiar localStorage después de cargar para evitar inconsistencias
      localStorage.removeItem('onboardingEditData');
      return parsedData;
    } catch (error) {
      console.error('Error parsing edit data:', error);
    }
  }

  // Datos iniciales por defecto
  return {
    // Datos del cálculo de préstamo
    loanCalculation: {
      loanData: {
        capital: "",
        gastoCierre: "",
        tasaInteres: "2.50",
        cantidadCuotas: "12",
        fechaContrato: "",
        fechaPrimerPago: "",
        tipoPrestamo: "personal",
      },
      agentData: {
        nombre: "",
        telefono: "",
        direccion: "",
      },
      insuranceData: {
        montoSeguro: 0,
        numeroCuotasSeguro: 0,
        aseguradora: "",
        tipoSeguro: "",
      },
      gpsData: {
        montoGps: 0,
        numeroCuotasGps: 0,
        proveedor: "",
        tipoGps: "",
      },
      kogarantiaData: {
        montoKogarantia: 0,
        numeroCuotasKogarantia: 0,
        tipoKogarantia: "",
      },
      showAdditionalValues: false,
      planDescription: "",
      selectedAgent: null
    },
    
    // Datos personales
    datosPersonales: {
      idCliente: null, // Campo crítico para identificar el cliente al actualizar
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
      tipoResidencia: '',
      foto: null,
      fotoPreview: null
    },
    
    // Dirección y localización
    direccion: {
      provincia: '',
      municipio: '',
      sector: '',
      subsector: '',
      calle: '',
      numero: '',
      referencia: '',
      referenciaUbicacion: '',
      pais: '',
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
      ingresosMes: '',
      ingresos: '',
      direccionEmpresa: '',
      telefonoTrabajo: '',
      tiempoTrabajo: '',
      quienPagara: ''
    },
    
    // Referencias personales
    referenciasPersonales: [],
    
    // Garantía
    garantia: {
      type: 'vehiculo',
      vehicleType: '',
      marca: '',
      modelo: '',
      año: '',
      color: '',
      placa: '',
      numeroChasis: '',
      numeroMotor: '',
      cantidadPasajeros: '',
      numeroMatricula: '',
      fechaMatricula: '',
      valorComercial: '',
      valorGarantia: ''
    },
    
    // Cheques
    cheques: {
        tipoPrestamo: '',
        banco: '',
        numeroCuenta: '',
        tipoGarantia: '',
        descripcionGarantia: ''
      }
    };
};

// Proveedor del contexto
export const OnboardingDataProvider = ({ children }) => {
  // Estado inicial para todos los datos del onboarding
  const [onboardingData, setOnboardingData] = useState(() => getInitialData());
  
  // Estado para saber si estamos en modo edición
  const [isEditing, setIsEditing] = useState(false);

  // Efecto para guardar en localStorage cada vez que onboardingData cambie
  useEffect(() => {
    localStorage.setItem('onboardingEditData', JSON.stringify(onboardingData));
  }, [onboardingData]);

  // Verificar si estamos en modo edición al cargar
  useEffect(() => {
    const editMode = localStorage.getItem('onboardingEditMode');
    if (editMode === 'true') {
      setIsEditing(true);
    }
  }, []);

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
        loanData: {
          capital: "",
          gastoCierre: "",
          tasaInteres: "2.50",
          cantidadCuotas: "12",
          fechaContrato: "",
          fechaPrimerPago: "",
          tipoPrestamo: "personal",
        },
        agentData: {
          nombre: "",
          telefono: "",
          direccion: "",
        },
        insuranceData: {
          montoSeguro: 0,
          numeroCuotasSeguro: 0,
          aseguradora: "",
          tipoSeguro: "",
        },
        gpsData: {
          montoGps: 0,
          numeroCuotasGps: 0,
          proveedor: "",
          tipoGps: "",
        },
        kogarantiaData: {
          montoKogarantia: 0,
          numeroCuotasKogarantia: 0,
          tipoKogarantia: "",
        },
        showAdditionalValues: false,
        planDescription: "",
        selectedAgent: null
      },
      datosPersonales: {
        idCliente: null, // Campo crítico para identificar el cliente al actualizar
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
        tipoResidencia: '',
        foto: null,
        fotoPreview: null
      },
      direccion: {
        provincia: '',
        municipio: '',
        sector: '',
        subsector: '',
        calle: '',
        numero: '',
        referencia: '',
        referenciaUbicacion: '',
        pais: '',
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

  // Función para obtener datos de una sección específica
  const getOnboardingData = useCallback((section) => {
    if (section) {
      return onboardingData[section];
    }
    return onboardingData;
  }, [onboardingData]);

  // Función para actualizar todos los datos del onboarding
  const updateOnboardingData = useCallback((section, newData) => {
    if (typeof section === 'string') {
      // Si se pasa una sección específica
      setOnboardingData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          ...newData
        }
      }));
    } else {
      // Si se pasan todos los datos
      setOnboardingData(prev => ({
        ...prev,
        ...section
      }));
    }
  }, []);

  // Función enhancedNextStep para ser sobrescrita por componentes
  const [enhancedNextStep, setEnhancedNextStep] = useState(null);

  // Valor del contexto
  const contextValue = {
    onboardingData,
    isEditing,
    setIsEditing,
    updateSection,
    updateField,
    addReferencia,
    removeReferencia,
    updateReferencia,
    clearData,
    getAllData,
    getOnboardingData,
    updateOnboardingData,
    enhancedNextStep,
    setEnhancedNextStep
  };

  return (
    <OnboardingDataContext.Provider value={contextValue}>
      {children}
    </OnboardingDataContext.Provider>
  );
};

export default OnboardingDataProvider;

// Función para guardar los datos de loanCalculation
const saveLoanCalculationData = (data) => {
  console.log('Saving loan calculation data:', data);
  setOnboardingData((prevData) => ({
    ...prevData,
    loanCalculation: data,
  }));
};