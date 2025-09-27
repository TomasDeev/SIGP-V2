import { supabaseAdmin as supabase } from '../_config/supabase-admin';

/**
 * Servicio para gestionar las operaciones CRUD de Préstamos
 */
export class PrestamosService {
  
  /**
   * Obtener todos los préstamos
   */
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('prestamos')
        .select(`
          *,
          empresas!inner(RazonSocial, NombreComercial),
          cuentas!inner(Nombres, Apellidos, Cedula, Telefono, Celular, Sector),
          garantias(Descripcion)
        `)
        .order('FechaCreacion', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error obteniendo préstamos:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener préstamo por ID
   */
  static async getById(id) {
    try {
      const { data, error } = await supabase
        .from('prestamos')
        .select(`
          *,
          empresas!inner(RazonSocial, NombreComercial, Tasa, Mora),
          cuentas!inner(Nombres, Apellidos, Cedula, Telefono, Celular, Email)
        `)
        .eq('IdPrestamo', id)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error obteniendo préstamo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Crear nuevo préstamo
   */
  static async create(prestamoData) {
    try {
      const { data, error } = await supabase
        .from('prestamos')
        .insert([prestamoData])
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
   * Actualizar préstamo existente
   */
  static async update(id, prestamoData) {
    try {
      const { data, error } = await supabase
        .from('prestamos')
        .update(prestamoData)
        .eq('IdPrestamo', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error actualizando préstamo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Eliminar préstamo
   */
  static async delete(id) {
    try {
      const { error } = await supabase
        .from('prestamos')
        .delete()
        .eq('IdPrestamo', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error eliminando préstamo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener préstamos por empresa
   */
  static async getByEmpresa(idEmpresa) {
    try {
      const { data, error } = await supabase
        .from('prestamos')
        .select(`
          *,
          cuentas!inner(Nombres, Apellidos, Cedula)
        `)
        .eq('IdEmpresa', idEmpresa)
        .order('FechaCreacion', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error obteniendo préstamos por empresa:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener préstamos por cuenta (cliente)
   */
  static async getByCuenta(idCuenta) {
    try {
      const { data, error } = await supabase
        .from('prestamos')
        .select(`
          *,
          empresas!inner(RazonSocial, NombreComercial),
          cuentas!inner(Nombres, Apellidos, Cedula)
        `)
        .eq('IdCuenta', idCuenta)
        .order('FechaCreacion', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error obteniendo préstamos por cuenta:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Buscar préstamos por término
   */
  static async search(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('prestamos')
        .select(`
          *,
          empresas!inner(RazonSocial, NombreComercial),
          cuentas!inner(Nombres, Apellidos, Cedula)
        `)
        .or(`Observaciones.ilike.%${searchTerm}%`)
        .order('FechaCreacion', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error buscando préstamos:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener préstamos por estado
   */
  static async getByEstado(estado) {
    try {
      const { data, error } = await supabase
        .from('prestamos')
        .select(`
          *,
          empresas!inner(RazonSocial, NombreComercial),
          cuentas!inner(Nombres, Apellidos, Cedula)
        `)
        .eq('IdEstado', estado)
        .order('FechaCreacion', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error obteniendo préstamos por estado:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener tabla de amortización para un préstamo específico
   */
  static async getAmortizationTable(idPrestamo) {
    try {
      const { data, error } = await supabase
        .from('amortizaciones')
        .select('*')
        .eq('IdPrestamo', idPrestamo)
        .order('OrdenPago', { ascending: true });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error obteniendo tabla de amortización:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Crear tabla de amortización para un préstamo
   */
  static async createAmortizationTable(idPrestamo, amortizationData) {
    try {
      if (!Array.isArray(amortizationData) || amortizationData.length === 0) {
        return { success: false, error: 'Datos de amortización inválidos' };
      }
      
      // Formatear los datos para la tabla de amortizaciones
      const amortizaciones = amortizationData.map((item, index) => ({
        IdPrestamo: idPrestamo,
        OrdenPago: index + 1,
        Vencimiento: item.fechaVencimiento,
        Capital: parseFloat(item.capital) || 0,
        Interes: parseFloat(item.interes) || 0,
        Mora: 0,
        Seguro: parseFloat(item.seguro) || 0,
        GastoCierre: parseFloat(item.gastoCierre) || 0,
        EstaPagado: false,
        MontoPagado: 0
      }));
      
      const { data, error } = await supabase
        .from('amortizaciones')
        .insert(amortizaciones)
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creando tabla de amortización:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener estadísticas de préstamos
   */
  static async getStats() {
    try {
      // Total de préstamos
      const { count: total, error: errorTotal } = await supabase
        .from('prestamos')
        .select('*', { count: 'exact', head: true });
      
      if (errorTotal) throw errorTotal;

      // Préstamos activos (assuming estado 1 is active)
      const { count: activos, error: errorActivos } = await supabase
        .from('prestamos')
        .select('*', { count: 'exact', head: true })
        .eq('IdEstado', 1);
      
      if (errorActivos) throw errorActivos;

      // Suma total de capital prestado
      const { data: prestamos, error: errorMontos } = await supabase
        .from('prestamos')
        .select('CapitalPrestado')
        .eq('IdEstado', 1);
      
      if (errorMontos) throw errorMontos;

      const montoTotal = prestamos?.reduce((sum, prestamo) => sum + (parseFloat(prestamo.CapitalPrestado) || 0), 0) || 0;
      
      return { 
        success: true, 
        data: {
          total,
          activos,
          inactivos: total - activos,
          montoTotal
        }
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de préstamos:', error);
      return { success: false, error: error.message };
    }
  }
}