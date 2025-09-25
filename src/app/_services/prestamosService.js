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
          usuarios!inner(Nombre, Telefono)
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
          usuarios!inner(Nombre)
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
   * Obtener préstamos por usuario
   */
  static async getByUsuario(idUsuario) {
    try {
      const { data, error } = await supabase
        .from('prestamos')
        .select(`
          *,
          empresas!inner(RazonSocial, NombreComercial)
        `)
        .eq('IdUsuario', idUsuario)
        .order('FechaCreacion', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error obteniendo préstamos por usuario:', error);
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
          usuarios!inner(Nombre)
        `)
        .or(`NumeroContrato.ilike.%${searchTerm}%,Observaciones.ilike.%${searchTerm}%`)
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
          usuarios!inner(Nombre)
        `)
        .eq('Estado', estado)
        .order('FechaCreacion', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error obteniendo préstamos por estado:', error);
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

      // Préstamos activos
      const { count: activos, error: errorActivos } = await supabase
        .from('prestamos')
        .select('*', { count: 'exact', head: true })
        .eq('Estado', 'Activo');
      
      if (errorActivos) throw errorActivos;

      // Suma total de montos
      const { data: montos, error: errorMontos } = await supabase
        .from('prestamos')
        .select('Monto')
        .eq('Estado', 'Activo');
      
      if (errorMontos) throw errorMontos;

      const montoTotal = montos?.reduce((sum, prestamo) => sum + (prestamo.Monto || 0), 0) || 0;
      
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