import { supabase } from '../_config/supabase';

/**
 * Servicio para gestionar las operaciones CRUD de Sucursales
 */
export class SucursalesService {
  
  /**
   * Obtener todas las sucursales
   */
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('sucursales')
        .select(`
          *,
          empresas (
            IdEmpresa,
            RazonSocial
          )
        `)
        .order('FechaCreacion', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error obteniendo sucursales:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener sucursal por ID
   */
  static async getById(id) {
    try {
      const { data, error } = await supabase
        .from('sucursales')
        .select(`
          *,
          empresas (
            IdEmpresa,
            RazonSocial
          )
        `)
        .eq('IdSucursal', id)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error obteniendo sucursal:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Crear nueva sucursal
   */
  static async create(sucursalData) {
    try {
      const { data, error } = await supabase
        .from('sucursales')
        .insert([{
          ...sucursalData,
          FechaCreacion: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creando sucursal:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualizar sucursal
   */
  static async update(id, sucursalData) {
    try {
      const { data, error } = await supabase
        .from('sucursales')
        .update(sucursalData)
        .eq('IdSucursal', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error actualizando sucursal:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Eliminar sucursal
   */
  static async delete(id) {
    try {
      const { error } = await supabase
        .from('sucursales')
        .delete()
        .eq('IdSucursal', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error eliminando sucursal:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Buscar sucursales
   */
  static async search(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('sucursales')
        .select(`
          *,
          empresas (
            IdEmpresa,
            RazonSocial
          )
        `)
        .or(`Nombre.ilike.%${searchTerm}%,Direccion.ilike.%${searchTerm}%,Telefono.ilike.%${searchTerm}%`)
        .order('FechaCreacion', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error buscando sucursales:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener estadísticas de sucursales
   */
  static async getStats() {
    try {
      const { data, error } = await supabase
        .from('sucursales')
        .select('IdSucursal, Activo');
      
      if (error) throw error;
      
      const total = data.length;
      const activas = data.filter(s => s.Activo).length;
      
      return { 
        success: true, 
        data: { 
          total, 
          activas,
          inactivas: total - activas
        } 
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de sucursales:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener sucursales por empresa
   */
  static async getByEmpresa(idEmpresa) {
    try {
      const { data, error } = await supabase
        .from('sucursales')
        .select(`
          IdSucursal,
          Nombre,
          Codigo,
          Direccion,
          Telefono,
          Email,
          Gerente,
          Activo
        `)
        .eq('IdEmpresa', idEmpresa)
        .eq('Activo', true)
        .order('Nombre', { ascending: true });
      
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error obteniendo sucursales por empresa:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verificar si un email ya existe
   */
  static async checkEmailExists(email, excludeId = null) {
    try {
      let query = supabase
        .from('sucursales')
        .select('IdSucursal, Email')
        .eq('Email', email);
      
      // Si estamos editando, excluir el ID actual
      if (excludeId) {
        query = query.neq('IdSucursal', excludeId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return { 
        success: true, 
        exists: data && data.length > 0,
        data: data || []
      };
    } catch (error) {
      console.error('Error verificando email:', error);
      return { success: false, error: error.message };
    }
  }
}