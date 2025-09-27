import { supabaseAdmin as supabase } from '../_config/supabase-admin';
import StorageService from './storageService';
import { PrestamosService } from './prestamosService';

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

      // Usar direccion del contexto (que ahora incluye todos los campos)
      const direccionData = direccion || {};
      const infoLaboral = informacionLaboral || {};

      const clientData = {
        IdEmpresa: empresaId,
        Nombres: datosPersonales?.nombres || '',
        Apellidos: datosPersonales?.apellidos || '',
        Cedula: datosPersonales?.cedula || '',
        Telefono: datosPersonales?.telefono || '',
        Celular: datosPersonales?.celular || '',
        Email: datosPersonales?.email || '',
        Direccion: direccionData?.calle || '',
        Sector: direccionData?.sector || '',
        Nacionalidad: datosPersonales?.nacionalidad || 'Dominicana',
        LugarNacimiento: datosPersonales?.lugarNacimiento || '',
        FechaNacimiento: datosPersonales?.fechaNacimiento || null,
        EstadoCivil: OnboardingToCreditService.mapEstadoCivil(datosPersonales?.estadoCivil),
        Profesion: datosPersonales?.profesion || '',
        LugarTrabajo: infoLaboral?.empresa || '',
        DireccionTrabajo: infoLaboral?.direccionEmpresa || '',
        TelefonoTrabajo: infoLaboral?.telefonoTrabajo || '',
        Ingresos: OnboardingToCreditService.parseNumericValue(infoLaboral?.ingresosMes || infoLaboral?.ingresos, 0),
        TiempoTrabajo: infoLaboral?.tiempoTrabajo || '',
        // Campos que antes se guardaban en observaciones
        Apodo: datosPersonales?.apodo || '',
        Sexo: datosPersonales?.sexo || '',
        Ocupacion: datosPersonales?.ocupacion || '',
        TipoResidencia: datosPersonales?.tipoResidencia || '',
        Cargo: infoLaboral?.cargo || '',
        Supervisor: infoLaboral?.supervisor || '',
        DireccionEmpresa: infoLaboral?.direccionEmpresa || '',
        QuienPagara: infoLaboral?.quienPagara || '',
        Observaciones: OnboardingToCreditService.buildObservaciones(onboardingData),
        Activo: true
      };

      const { data, error } = await supabase
        .from('cuentas')
        .insert([clientData])
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('No se pudo crear la cuenta del cliente.');
      }

      const newClient = data[0];

      // Si hay una foto, subirla después de crear el cliente
      if (datosPersonales?.foto) {
        const photoResult = await StorageService.uploadClientPhoto(
          datosPersonales.foto, 
          newClient.IdCliente
        );

        if (photoResult.success) {
          // Actualizar el registro del cliente con la URL de la foto
          const { error: updateError } = await supabase
            .from('cuentas')
            .update({ Foto: photoResult.data.publicUrl })
            .eq('IdCliente', newClient.IdCliente);

          if (updateError) {
            console.warn('Error actualizando URL de foto:', updateError);
          } else {
            newClient.Foto = photoResult.data.publicUrl;
          }
        } else {
          console.warn('Error subiendo foto del cliente:', photoResult.error);
        }
      }

      return { success: true, data: newClient };
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
      const loanData = loanCalculation.loanData || {};
      const insuranceData = loanCalculation.insuranceData || {};
      const kogarantiaData = loanCalculation.kogarantiaData || {};
      
      // Calcular el gasto total de seguro (incluyendo Kogarantía si existe)
      const seguroBase = OnboardingToCreditService.parseNumericValue(insuranceData.montoSeguro, 0);
      const kogarantiaTotal = kogarantiaData.tieneKogarantia ? 
        OnboardingToCreditService.parseNumericValue(kogarantiaData.montoTotalKogarantia, 0) : 0;
      const gastoSeguroTotal = seguroBase + kogarantiaTotal;

      const loanApplicationData = {
        IdCuenta: clientId,
        IdEmpresa: empresaId,
        CapitalPrestado: OnboardingToCreditService.parseNumericValue(loanData.capital, 0),
        Cuotas: OnboardingToCreditService.parseNumericValue(loanData.cantidadCuotas, 12),
        Interes: OnboardingToCreditService.parseNumericValue(loanData.tasaInteres, 0),
        GastoCierre: OnboardingToCreditService.parseNumericValue(loanData.gastoCierre, 0),
        GastoSeguro: gastoSeguroTotal,
        FechaPrimerPago: loanData.fechaPrimerPago || new Date().toISOString(),
        FrecuenciaPago: 1, // Mensual por defecto
        IdTipoPrestamo: OnboardingToCreditService.mapTipoPrestamo(loanData.tipoPrestamo),
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
        .insert([loanApplicationData])
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('No se pudo crear la solicitud de préstamo.');
      }
      
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error creando préstamo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualizar solicitud de préstamo existente
   */
  static async updateLoanApplication(onboardingData, loanId) {
    try {
      const loanCalculation = onboardingData.loanCalculation || {};
      const loanData = loanCalculation.loanData || {};
      const insuranceData = loanCalculation.insuranceData || {};
      const kogarantiaData = loanCalculation.kogarantiaData || {};
      
      // Calcular el gasto total de seguro (incluyendo Kogarantía si existe)
      const seguroBase = OnboardingToCreditService.parseNumericValue(insuranceData.montoSeguro, 0);
      const kogarantiaTotal = kogarantiaData.tieneKogarantia ? 
        OnboardingToCreditService.parseNumericValue(kogarantiaData.montoTotalKogarantia, 0) : 0;
      const gastoSeguroTotal = seguroBase + kogarantiaTotal;

      const loanUpdateData = {
        CapitalPrestado: OnboardingToCreditService.parseNumericValue(loanData.capital, 0),
        Cuotas: OnboardingToCreditService.parseNumericValue(loanData.cantidadCuotas, 12),
        Interes: OnboardingToCreditService.parseNumericValue(loanData.tasaInteres, 0),
        GastoCierre: OnboardingToCreditService.parseNumericValue(loanData.gastoCierre, 0),
        GastoSeguro: gastoSeguroTotal,
        FechaPrimerPago: loanData.fechaPrimerPago || new Date().toISOString(),
        FrecuenciaPago: 1, // Mensual por defecto
        IdTipoPrestamo: OnboardingToCreditService.mapTipoPrestamo(loanData.tipoPrestamo),
        InteresMora: OnboardingToCreditService.parseNumericValue(loanData.interesMora, 0),
        Observaciones: OnboardingToCreditService.buildLoanObservaciones(onboardingData)
      };

      const { data, error } = await supabase
        .from('prestamos')
        .update(loanUpdateData)
        .eq('IdPrestamo', loanId)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('No se pudo actualizar la solicitud de préstamo.');
      }
      
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error actualizando préstamo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Crear referencias personales del cliente
   */
  static async createPersonalReferences(onboardingData, clientId) {
    try {
      console.log('Datos de referencias personales recibidos en el servicio:', onboardingData.referenciasPersonales);
      const referencias = onboardingData.referenciasPersonales?.referencias || [];
      
      if (!Array.isArray(referencias)) {
        console.error('Error: referenciasPersonales no es un array.', referencias);
        return { success: false, error: 'El formato de las referencias personales es incorrecto.' };
      }

      if (referencias.length === 0) {
        return { success: true, data: [] };
      }

      // Primero, crear una tabla temporal para almacenar la relación y otros datos adicionales
      const referencesMetadata = [];

      const referencesData = referencias.map(ref => {
        // Guardar los metadatos adicionales para procesarlos después
        referencesMetadata.push({
          nombres: ref.nombres,
          apellidos: ref.apellidos,
          parentesco: ref.parentesco,
          cedula: ref.cedula || ''
        });

        return {
          IdCuenta: clientId,
          Nombre: `${ref.nombres || ''} ${ref.apellidos || ''}`.trim(),
          cedula: ref.cedula || '',
          Telefono: ref.telefono || '',
          Direccion: ref.direccion || '',
          IdTipoReferenciaPersonal: OnboardingToCreditService.mapTipoReferencia(ref.parentesco) // Usar parentesco para mapear el tipo
        };
      });

      const { data, error } = await supabase
        .from('referenciaspersonales')
        .insert(referencesData)
        .select();

      if (error) throw error;

      // Guardar los metadatos adicionales en localStorage para poder recuperarlos en la hoja de vida
      if (data && data.length > 0) {
        const referencesWithMetadata = data.map((ref, index) => ({
          ...ref,
          Relacion: referencesMetadata[index]?.parentesco || '',
          Nombres: referencesMetadata[index]?.nombres || '',
          Apellidos: referencesMetadata[index]?.apellidos || ''
        }));
        
        localStorage.setItem('referencesMetadata', JSON.stringify(referencesWithMetadata));
      }

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

      // Usar direccion del contexto (que ahora incluye todos los campos)
      const direccionData = direccion || {};
      const infoLaboral = informacionLaboral || {};

      const clientData = {
        IdEmpresa: empresaId,
        Nombres: datosPersonales?.nombres || '',
        Apellidos: datosPersonales?.apellidos || '',
        Cedula: datosPersonales?.cedula || '',
        Telefono: datosPersonales?.telefono || '',
        Celular: datosPersonales?.celular || '',
        Email: datosPersonales?.email || '',
        Direccion: direccionData?.calle || '',
        Sector: direccionData?.sector || '',
        Nacionalidad: datosPersonales?.nacionalidad || 'Dominicana',
        LugarNacimiento: datosPersonales?.lugarNacimiento || '',
        FechaNacimiento: datosPersonales?.fechaNacimiento || null,
        EstadoCivil: OnboardingToCreditService.mapEstadoCivil(datosPersonales?.estadoCivil),
        Profesion: datosPersonales?.profesion || '',
        LugarTrabajo: infoLaboral?.empresa || '',
        DireccionTrabajo: infoLaboral?.direccionEmpresa || '',
        TelefonoTrabajo: infoLaboral?.telefonoTrabajo || '',
        Ingresos: OnboardingToCreditService.parseNumericValue(infoLaboral?.ingresosMes || infoLaboral?.ingresos, 0),
        TiempoTrabajo: infoLaboral?.tiempoTrabajo || '',
        // Campos que antes se guardaban en observaciones
        Apodo: datosPersonales?.apodo || '',
        Sexo: datosPersonales?.sexo || '',
        Ocupacion: datosPersonales?.ocupacion || '',
        TipoResidencia: datosPersonales?.tipoResidencia || '',
        Cargo: infoLaboral?.cargo || '',
        Supervisor: infoLaboral?.supervisor || '',
        DireccionEmpresa: infoLaboral?.direccionEmpresa || '',
        QuienPagara: infoLaboral?.quienPagara || '',
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
   * Proceso completo de actualización: actualizar cliente, préstamo y referencias
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
      
      // 3. Buscar préstamos asociados al cliente para actualizar
      let loanResult = { success: true, data: null };
      let guaranteeResult = { success: true, data: null };
      
      const { data: prestamos, error: prestamosError } = await supabase
        .from('prestamos')
        .select('IdPrestamo')
        .eq('IdCuenta', clientId)
        .order('IdPrestamo', { ascending: false })
        .limit(1);
        
      if (!prestamosError && prestamos && prestamos.length > 0) {
        const loanId = prestamos[0].IdPrestamo;
        
        // 4. Actualizar datos del préstamo si hay datos de cálculo
        if (onboardingData.loanCalculation) {
          loanResult = await OnboardingToCreditService.updateLoanApplication(onboardingData, loanId);
          
          if (!loanResult.success) {
            console.warn('Advertencia actualizando préstamo:', loanResult.error);
          }
        }
        
        // 5. Actualizar la garantía para este préstamo
        if (onboardingData.garantia) {
          guaranteeResult = await OnboardingToCreditService.updateGuarantee(
            onboardingData,
            loanId
          );
          
          if (!guaranteeResult.success) {
            console.warn('Advertencia actualizando garantía:', guaranteeResult.error);
          }
        }
      }

      return {
        success: true,
        data: {
          client: clientResult.data,
          loan: loanResult.data,
          references: referencesResult.data || [],
          guarantee: guaranteeResult.data
        }
      };
    } catch (error) {
      console.error('Error en proceso de actualización:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Crear garantía para un préstamo
   */
  static async createGuarantee(onboardingData, loanId) {
    try {
      const garantiaData = onboardingData.garantia || {};
      
      // Determinar el tipo de garantía
      let garantiaTipo = 1; // Por defecto: Vehículo
      switch (garantiaData.type) {
        case 'vehiculo':
          garantiaTipo = 1;
          break;
        case 'hipoteca':
          garantiaTipo = 2;
          break;
        case 'personal':
          garantiaTipo = 3;
          break;
        case 'comercial':
          garantiaTipo = 4;
          break;
      }
      
      // Preparar datos de garantía
      const guaranteeData = {
        IdPrestamo: loanId,
        GarantiaTipo: garantiaTipo,
        Descripcion: garantiaData.type === 'vehiculo' 
          ? `Vehículo ${garantiaData.marca} ${garantiaData.modelo} ${garantiaData.año}` 
          : `Garantía tipo ${garantiaData.type}`,
        ValorGarantia: garantiaData.type === 'vehiculo' 
          ? OnboardingToCreditService.parseNumericValue(garantiaData.valorComercial, 0)
          : OnboardingToCreditService.parseNumericValue(garantiaData.valorGarantia, 0),
      };
      
      // Agregar datos específicos para vehículos
      if (garantiaData.type === 'vehiculo') {
        Object.assign(guaranteeData, {
          Placa: garantiaData.placa || '',
          Matricula: garantiaData.numeroMatricula || '',
          FechaMatricula: garantiaData.fechaMatricula || null,
          Marca: garantiaData.marca || '',
          Modelo: garantiaData.modelo || '',
          Color: garantiaData.color || '',
          FabricacionFecha: garantiaData.año ? parseInt(garantiaData.año, 10) : null,
          NumeroMotor: garantiaData.numeroMotor || '',
          NumeroChasis: garantiaData.numeroChasis || '',
          Tipo: garantiaData.vehicleType || ''
        });
      }
      
      const { data, error } = await supabase
        .from('garantias')
        .insert([guaranteeData])
        .select();
        
      if (error) throw error;
      
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error creando garantía:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Actualizar garantía existente
   */
  static async updateGuarantee(onboardingData, loanId) {
    try {
      const garantiaData = onboardingData.garantia || {};
      
      // Primero verificar si existe una garantía para este préstamo
      const { data: existingGuarantees, error: fetchError } = await supabase
        .from('garantias')
        .select('*')
        .eq('IdPrestamo', loanId);
        
      if (fetchError) throw fetchError;
      
      // Determinar el tipo de garantía
      let garantiaTipo = 1; // Por defecto: Vehículo
      switch (garantiaData.type) {
        case 'vehiculo':
          garantiaTipo = 1;
          break;
        case 'hipoteca':
          garantiaTipo = 2;
          break;
        case 'personal':
          garantiaTipo = 3;
          break;
        case 'comercial':
          garantiaTipo = 4;
          break;
      }
      
      // Preparar datos de garantía
      const guaranteeData = {
        GarantiaTipo: garantiaTipo,
        Descripcion: garantiaData.type === 'vehiculo' 
          ? `Vehículo ${garantiaData.marca} ${garantiaData.modelo} ${garantiaData.año}` 
          : `Garantía tipo ${garantiaData.type}`,
        ValorGarantia: garantiaData.type === 'vehiculo' 
          ? OnboardingToCreditService.parseNumericValue(garantiaData.valorComercial, 0)
          : OnboardingToCreditService.parseNumericValue(garantiaData.valorGarantia, 0),
      };
      
      // Agregar datos específicos para vehículos
      if (garantiaData.type === 'vehiculo') {
        Object.assign(guaranteeData, {
          Placa: garantiaData.placa || '',
          Matricula: garantiaData.numeroMatricula || '',
          FechaMatricula: garantiaData.fechaMatricula || null,
          Marca: garantiaData.marca || '',
          Modelo: garantiaData.modelo || '',
          Color: garantiaData.color || '',
          FabricacionFecha: garantiaData.año ? parseInt(garantiaData.año, 10) : null,
          NumeroMotor: garantiaData.numeroMotor || '',
          NumeroChasis: garantiaData.numeroChasis || '',
          Tipo: garantiaData.vehicleType || ''
        });
      }
      
      let result;
      
      // Si existe una garantía, actualizarla
      if (existingGuarantees && existingGuarantees.length > 0) {
        const { data, error } = await supabase
          .from('garantias')
          .update(guaranteeData)
          .eq('IdPrestamo', loanId)
          .select();
          
        if (error) throw error;
        result = { success: true, data: data[0], isUpdate: true };
      } else {
        // Si no existe, crear una nueva
        const { data, error } = await supabase
          .from('garantias')
          .insert([{ ...guaranteeData, IdPrestamo: loanId }])
          .select();
          
        if (error) throw error;
        result = { success: true, data: data[0], isUpdate: false };
      }
      
      return result;
    } catch (error) {
      console.error('Error actualizando garantía:', error);
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

      // 4. Crear tabla de amortización
      let amortizationResult = { success: true, data: [] };
      if (onboardingData.loanCalculation?.amortizationTable && loanResult.data?.IdPrestamo) {
        amortizationResult = await PrestamosService.createAmortizationTable(
          loanResult.data.IdPrestamo,
          onboardingData.loanCalculation.amortizationTable
        );
        if (!amortizationResult.success) {
          console.warn('Advertencia creando amortizaciones:', amortizationResult.error);
        }
      }
      
      // 5. Crear garantía
      let guaranteeResult = { success: true, data: null };
      if (onboardingData.garantia && loanResult.data?.IdPrestamo) {
        guaranteeResult = await OnboardingToCreditService.createGuarantee(
          onboardingData,
          loanResult.data.IdPrestamo
        );
        if (!guaranteeResult.success) {
          console.warn('Advertencia creando garantía:', guaranteeResult.error);
        }
      }

      return {
        success: true,
        data: {
          client: clientResult.data,
          loan: loanResult.data,
          references: referencesResult.data || [],
          amortization: amortizationResult.data || [],
          guarantee: guaranteeResult.data
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
   * Mapear tipo de referencia a ID
   */
  static mapTipoReferencia(tipo) {
    // Relaciones familiares
    const relacionesFamiliares = [
      'padre', 'madre', 'hermano', 'hermana', 'hermano/a', 
      'hijo', 'hija', 'hijo/a', 'esposo', 'esposa', 'esposo/a',
      'tío', 'tía', 'tío/a', 'primo', 'prima', 'primo/a',
      'abuelo', 'abuela', 'abuelo/a', 'sobrino', 'sobrina', 'sobrino/a'
    ];

    // Relaciones laborales
    const relacionesLaborales = [
      'compañero de trabajo', 'jefe', 'supervisor', 'colega', 'empleado'
    ];

    // Relaciones vecinales
    const relacionesVecinales = [
      'vecino', 'vecina', 'vecino/a'
    ];

    // Relaciones comerciales
    const relacionesComerciales = [
      'cliente', 'proveedor', 'socio', 'socia'
    ];

    if (!tipo) return 3; // Personal por defecto

    const tipoLower = tipo.toLowerCase();

    // Verificar si es una relación familiar
    if (relacionesFamiliares.some(rel => tipoLower.includes(rel))) {
      return 1; // Familiar
    }
    
    // Verificar si es una relación laboral
    if (relacionesLaborales.some(rel => tipoLower.includes(rel))) {
      return 2; // Laboral
    }
    
    // Verificar si es una relación comercial
    if (relacionesComerciales.some(rel => tipoLower.includes(rel))) {
      return 4; // Comercial
    }
    
    // Verificar si es una relación vecinal
    if (relacionesVecinales.some(rel => tipoLower.includes(rel))) {
      return 5; // Vecinal
    }

    // Verificar el tipo exacto
    switch (tipoLower) {
      case 'familiar':
        return 1;
      case 'laboral':
        return 2;
      case 'personal':
        return 3;
      case 'comercial':
        return 4;
      case 'vecinal':
        return 5;
      default:
        return 3; // Personal por defecto
    }
  }

  /**
   * Construir observaciones del cliente
   */
  static buildObservaciones(onboardingData) {
    const observaciones = [];
    
    // Solo incluir información del cónyuge y datos adicionales que no tienen columnas específicas
    if (onboardingData.datosConyuge?.nombres) {
      observaciones.push(`Cónyuge: ${onboardingData.datosConyuge.nombres} ${onboardingData.datosConyuge.apellidos || ''}`);
    }

    // Información adicional de dirección que no tiene columnas específicas
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