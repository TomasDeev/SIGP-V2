import { supabaseAdmin as supabase } from '../_config/supabase-admin';

/**
 * Servicio para mapear datos del onboarding-2 a solicitudes de crédito
 */
export class OnboardingToCreditService {
  
  /**
   * Crear una cuenta de cliente a partir de los datos del onboarding
   */
  static async createClientAccount(onboardingData, empresaId = 1) {
    try {
      const clientData = {
        IdEmpresa: empresaId,
        Nombres: onboardingData.datosPersonales?.nombres || '',
        Apellidos: onboardingData.datosPersonales?.apellidos || '',
        Cedula: onboardingData.datosPersonales?.cedula || '',
        Telefono: onboardingData.datosPersonales?.telefono || '',
        Celular: onboardingData.datosPersonales?.celular || onboardingData.datosPersonales?.telefono || '',
        Email: onboardingData.datosPersonales?.email || '',
        Direccion: onboardingData.datosPersonales?.direccion || '',
        Sector: onboardingData.datosPersonales?.sector || '',
        Nacionalidad: onboardingData.datosPersonales?.nacionalidad || 'Dominicana',
        LugarNacimiento: onboardingData.datosPersonales?.lugarNacimiento || '',
        FechaNacimiento: onboardingData.datosPersonales?.fechaNacimiento || null,
        EstadoCivil: OnboardingToCreditService.mapEstadoCivil(onboardingData.datosPersonales?.estadoCivil),
        Profesion: onboardingData.datosPersonales?.profesion || '',
        LugarTrabajo: onboardingData.informacionLaboral?.lugarTrabajo || '',
        DireccionTrabajo: onboardingData.informacionLaboral?.direccionTrabajo || '',
        TelefonoTrabajo: onboardingData.informacionLaboral?.telefonoTrabajo || '',
        Ingresos: parseFloat(onboardingData.informacionLaboral?.ingresos || 0),
        TiempoTrabajo: onboardingData.informacionLaboral?.tiempoTrabajo || '',
        Observaciones: OnboardingToCreditService.buildObservaciones(onboardingData),
        Activo: true
      };

      const { data, error } = await supabase
        .from('cuentas')
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creando cuenta de cliente:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Crear un préstamo a partir de los datos del onboarding
   */
  static async createLoanApplication(onboardingData, clientId, empresaId = 1) {
    try {
      const loanCalculation = onboardingData.loanCalculation || {};
      
      const loanData = {
        IdCuenta: clientId,
        IdEmpresa: empresaId,
        CapitalPrestado: parseFloat(loanCalculation.capital || 0),
        Cuotas: parseInt(loanCalculation.cantidadCuotas || 12),
        Interes: parseFloat(loanCalculation.tasaInteres || 0),
        GastoCierre: parseFloat(loanCalculation.gastoCierre || 0),
        GastoSeguro: parseFloat(loanCalculation.montoSeguro || 0),
        FechaPrimerPago: loanCalculation.fechaPrimerPago || new Date().toISOString(),
        FrecuenciaPago: 1, // Mensual por defecto
        IdTipoPrestamo: OnboardingToCreditService.mapTipoPrestamo(onboardingData.cheques?.tipoPrestamo),
        IdEstado: 1, // Estado "Activo" por defecto
        Moneda: 1, // Peso dominicano por defecto
        DiasGraciaMora: 0,
        InteresMora: 0,
        Prefijo: 'PR',
        PrestamoNo: await OnboardingToCreditService.getNextPrestamoNumber(empresaId),
        Observaciones: OnboardingToCreditService.buildLoanObservaciones(onboardingData)
      };

      const { data, error } = await supabase
        .from('prestamos')
        .insert([loanData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creando préstamo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Crear referencias personales del cliente
   */
  static async createPersonalReferences(onboardingData, clientId) {
    try {
      const referencias = onboardingData.referenciasPersonales || [];
      const referencesData = referencias.map(ref => ({
        IdCuenta: clientId,
        Nombres: ref.nombres || '',
        Apellidos: ref.apellidos || '',
        Telefono: ref.telefono || '',
        Direccion: ref.direccion || '',
        IdTipoReferenciaPersonal: OnboardingToCreditService.mapTipoReferencia(ref.tipo),
        Parentesco: ref.parentesco || '',
        TiempoConocerlo: ref.tiempoConocerlo || ''
      }));

      if (referencesData.length > 0) {
        const { data, error } = await supabase
          .from('referenciaspersonales')
          .insert(referencesData)
          .select();

        if (error) throw error;
        return { success: true, data };
      }

      return { success: true, data: [] };
    } catch (error) {
      console.error('Error creando referencias personales:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Proceso completo: crear cliente, préstamo y referencias
   */
  static async createCompleteApplication(onboardingData, empresaId = 1) {
    try {
      // 1. Crear cuenta del cliente
      const clientResult = await OnboardingToCreditService.createClientAccount(onboardingData, empresaId);
      if (!clientResult.success) {
        throw new Error(`Error creando cliente: ${clientResult.error}`);
      }

      const clientId = clientResult.data.IdCliente;

      // 2. Crear préstamo
      const loanResult = await OnboardingToCreditService.createLoanApplication(onboardingData, clientId, empresaId);
      if (!loanResult.success) {
        throw new Error(`Error creando préstamo: ${loanResult.error}`);
      }

      // 3. Crear referencias personales
      const referencesResult = await OnboardingToCreditService.createPersonalReferences(onboardingData, clientId);
      if (!referencesResult.success) {
        console.warn('Advertencia creando referencias:', referencesResult.error);
      }

      return {
        success: true,
        data: {
          client: clientResult.data,
          loan: loanResult.data,
          references: referencesResult.data || []
        }
      };
    } catch (error) {
      console.error('Error en proceso completo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mapear estado civil a número
   */
  static mapEstadoCivil(estadoCivil) {
    const mapping = {
      'soltero': 1,
      'casado': 2,
      'divorciado': 3,
      'viudo': 4,
      'union_libre': 5
    };
    return mapping[estadoCivil?.toLowerCase()] || 1;
  }

  /**
   * Mapear tipo de préstamo
   */
  static mapTipoPrestamo(tipoPrestamo) {
    const mapping = {
      'vehicular': 1,
      'personal': 2,
      'hipotecario': 3,
      'préstamo vehicular': 1,
      'préstamo personal': 2,
      'préstamo hipotecario': 3
    };
    return mapping[tipoPrestamo?.toLowerCase()] || 2; // Personal por defecto
  }

  /**
   * Mapear tipo de referencia personal
   */
  static mapTipoReferencia(tipo) {
    const mapping = {
      'familiar': 1,
      'laboral': 2,
      'personal': 3,
      'comercial': 4
    };
    return mapping[tipo?.toLowerCase()] || 3; // Personal por defecto
  }

  /**
   * Construir observaciones del cliente
   */
  static buildObservaciones(onboardingData) {
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

    observaciones.push(`Datos capturados desde onboarding-2 el ${new Date().toLocaleDateString('es-ES')}`);
    
    return observaciones.join('. ');
  }

  /**
   * Construir observaciones del préstamo
   */
  static buildLoanObservaciones(onboardingData) {
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

    observaciones.push(`Solicitud generada desde onboarding-2 el ${new Date().toLocaleDateString('es-ES')}`);
    
    return observaciones.join('. ');
  }

  /**
   * Obtener el siguiente número de préstamo
   */
  static async getNextPrestamoNumber(empresaId) {
    try {
      const { data, error } = await supabase
        .from('prestamos')
        .select('PrestamoNo')
        .eq('IdEmpresa', empresaId)
        .order('PrestamoNo', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      const lastNumber = data && data.length > 0 ? data[0].PrestamoNo : 0;
      return lastNumber + 1;
    } catch (error) {
      console.error('Error obteniendo número de préstamo:', error);
      return 1; // Valor por defecto
    }
  }
}

export default OnboardingToCreditService;