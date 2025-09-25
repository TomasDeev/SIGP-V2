import { supabaseAdmin as supabase } from '../_config/supabase-admin';
import StorageService from './storageService';

/**
 * Servicio para mapear datos del onboarding-2 a solicitudes de crédito
 */
export class OnboardingToCreditService {
  
  /**
   * Crear cuenta de cliente en la tabla cuentas
   */
  static async createClientAccount(onboardingData, empresaId = 1) {
    try {
      const { datosPersonales, direccion, informacionLaboral } = onboardingData;

      const clientData = {
        IdEmpresa: empresaId,
        Nombres: datosPersonales?.nombres || '',
        Apellidos: datosPersonales?.apellidos || '',
        Cedula: datosPersonales?.cedula || '',
        Telefono: datosPersonales?.telefono || '',
        Celular: datosPersonales?.celular || '',
        Email: datosPersonales?.email || '',
        Direccion: direccion?.direccion || '',
        Sector: direccion?.sector || '',
        Nacionalidad: datosPersonales?.nacionalidad || 'Dominicana',
        LugarNacimiento: datosPersonales?.lugarNacimiento || '',
        FechaNacimiento: datosPersonales?.fechaNacimiento || null,
        EstadoCivil: OnboardingToCreditService.mapEstadoCivil(datosPersonales?.estadoCivil),
        Profesion: datosPersonales?.profesion || '',
        LugarTrabajo: informacionLaboral?.empresa || '',
        DireccionTrabajo: informacionLaboral?.direccion || '',
        TelefonoTrabajo: informacionLaboral?.telefono || '',
        Ingresos: OnboardingToCreditService.parseNumericValue(informacionLaboral?.ingresos, 0),
        TiempoTrabajo: informacionLaboral?.tiempoTrabajo || '',
        Observaciones: OnboardingToCreditService.buildObservaciones(onboardingData),
        Activo: true
      };

      const { data, error } = await supabase
        .from('cuentas')
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;

      // Si hay una foto, subirla después de crear el cliente
      if (datosPersonales?.foto) {
        const photoResult = await StorageService.uploadClientPhoto(
          datosPersonales.foto, 
          data.IdCliente
        );

        if (photoResult.success) {
          // Actualizar el registro del cliente con la URL de la foto
          const { error: updateError } = await supabase
            .from('cuentas')
            .update({ Foto: photoResult.data.publicUrl })
            .eq('IdCliente', data.IdCliente);

          if (updateError) {
            console.warn('Error actualizando URL de foto:', updateError);
          } else {
            data.Foto = photoResult.data.publicUrl;
          }
        } else {
          console.warn('Error subiendo foto del cliente:', photoResult.error);
        }
      }

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
        CapitalPrestado: OnboardingToCreditService.parseNumericValue(loanCalculation.capital, 0),
        Cuotas: OnboardingToCreditService.parseNumericValue(loanCalculation.cantidadCuotas, 12),
        Interes: OnboardingToCreditService.parseNumericValue(loanCalculation.tasaInteres, 0),
        GastoCierre: OnboardingToCreditService.parseNumericValue(loanCalculation.gastoCierre, 0),
        GastoSeguro: OnboardingToCreditService.parseNumericValue(loanCalculation.montoSeguro, 0),
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
      
      if (referencias.length === 0) {
        return { success: true, data: [] };
      }

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

      const { data, error } = await supabase
        .from('referenciaspersonales')
        .insert(referencesData)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creando referencias personales:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualizar cuenta de cliente existente
   */
  static async updateClientAccount(onboardingData, clientId, empresaId = 1) {
    try {
      const { datosPersonales, direccion, informacionLaboral } = onboardingData;

      // Verificar que el cliente existe antes de actualizar
      const { data: existingClient, error: checkError } = await supabase
        .from('cuentas')
        .select('IdCliente, Nombres, Apellidos, Cedula')
        .eq('IdCliente', clientId);

      if (checkError) {
        throw new Error(`Error verificando cliente: ${checkError.message}`);
      }

      if (!existingClient || existingClient.length === 0) {
        throw new Error(`No se encontró el cliente con ID: ${clientId}`);
      }

      const clientData = {
        IdEmpresa: empresaId,
        Nombres: datosPersonales?.nombres || '',
        Apellidos: datosPersonales?.apellidos || '',
        Cedula: datosPersonales?.cedula || '',
        Telefono: datosPersonales?.telefono || '',
        Celular: datosPersonales?.celular || '',
        Email: datosPersonales?.email || '',
        Direccion: direccion?.direccion || '',
        Sector: direccion?.sector || '',
        Nacionalidad: datosPersonales?.nacionalidad || 'Dominicana',
        LugarNacimiento: datosPersonales?.lugarNacimiento || '',
        FechaNacimiento: datosPersonales?.fechaNacimiento || null,
        EstadoCivil: OnboardingToCreditService.mapEstadoCivil(datosPersonales?.estadoCivil),
        Profesion: datosPersonales?.profesion || '',
        LugarTrabajo: informacionLaboral?.empresa || '',
        DireccionTrabajo: informacionLaboral?.direccion || '',
        TelefonoTrabajo: informacionLaboral?.telefono || '',
        Ingresos: OnboardingToCreditService.parseNumericValue(informacionLaboral?.ingresos, 0),
        TiempoTrabajo: informacionLaboral?.tiempoTrabajo || '',
        Observaciones: OnboardingToCreditService.buildObservaciones(onboardingData),
        Activo: true
      };

      // Ejecutar la actualización sin .select() para evitar problemas con RLS
      const { error } = await supabase
        .from('cuentas')
        .update(clientData)
        .eq('IdCliente', clientId);

      if (error) {
        throw new Error(`Error actualizando cliente: ${error.message}`);
      }

      // Verificar que la actualización fue exitosa obteniendo el cliente actualizado
      const { data: updatedClient, error: fetchError } = await supabase
        .from('cuentas')
        .select('IdCliente, Nombres, Apellidos, Cedula, Email')
        .eq('IdCliente', clientId)
        .single();

      if (fetchError) {
        console.warn('Advertencia obteniendo cliente actualizado:', fetchError);
        // Aún así consideramos la actualización exitosa
        return { 
          success: true, 
          data: { 
            IdCliente: clientId, 
            ...clientData 
          } 
        };
      }

      return { success: true, data: updatedClient };
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualizar referencias personales (eliminar existentes y crear nuevas)
   */
  static async updatePersonalReferences(onboardingData, clientId) {
    try {
      // Primero eliminar referencias existentes
      const { error: deleteError } = await supabase
        .from('referenciaspersonales')
        .delete()
        .eq('IdCuenta', clientId);

      if (deleteError) throw deleteError;

      // Luego crear las nuevas referencias
      return await OnboardingToCreditService.createPersonalReferences(onboardingData, clientId);
    } catch (error) {
      console.error('Error actualizando referencias personales:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Proceso completo de actualización: actualizar cliente y referencias
   */
  static async updateCompleteApplication(onboardingData, clientId, empresaId = 1) {
    try {
      // 1. Actualizar cuenta del cliente
      const clientResult = await OnboardingToCreditService.updateClientAccount(onboardingData, clientId, empresaId);
      if (!clientResult.success) {
        throw new Error(`Error actualizando cliente: ${clientResult.error}`);
      }

      // 2. Actualizar referencias personales
      const referencesResult = await OnboardingToCreditService.updatePersonalReferences(onboardingData, clientId);
      if (!referencesResult.success) {
        console.warn('Advertencia actualizando referencias:', referencesResult.error);
      }

      return {
        success: true,
        data: {
          client: clientResult.data,
          references: referencesResult.data || []
        }
      };
    } catch (error) {
      console.error('Error en proceso de actualización:', error);
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
   * Parsear valor numérico de forma segura
   */
  static parseNumericValue(value, defaultValue = 0) {
    // Si el valor es undefined, null, o string "undefined", retornar valor por defecto
    if (value === undefined || value === null || value === "undefined" || value === "") {
      return defaultValue;
    }
    
    // Intentar convertir a número
    const parsed = parseFloat(value);
    
    // Si el resultado es NaN, retornar valor por defecto
    if (isNaN(parsed)) {
      return defaultValue;
    }
    
    return parsed;
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