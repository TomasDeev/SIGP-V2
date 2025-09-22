import { supabase } from '../_config/supabase';

/**
 * Servicio para gestionar las operaciones CRUD de Usuarios
 */
export class UsuariosService {
  
  /**
   * Obtener todos los usuarios
   */
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('Usuarios')
        .select('*')
        .order('IdUsuario', { ascending: true });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener usuario por ID
   */
  static async getById(id) {
    try {
      const { data, error } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('IdUsuario', id)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener usuario por UserId (UUID de auth)
   */
  static async getByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('UserId', userId)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error obteniendo usuario por UserId:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Crear nuevo usuario
   */
  static async create(usuarioData) {
    try {
      const { data, error } = await supabase
        .from('Usuarios')
        .insert([usuarioData])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creando usuario:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualizar usuario existente
   */
  static async update(id, usuarioData) {
    try {
      const { data, error } = await supabase
        .from('Usuarios')
        .update(usuarioData)
        .eq('IdUsuario', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Eliminar usuario
   */
  static async delete(id) {
    try {
      const { error } = await supabase
        .from('Usuarios')
        .delete()
        .eq('IdUsuario', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Buscar usuarios por término
   */
  static async search(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('Usuarios')
        .select('*')
        .or(`Nombre.ilike.%${searchTerm}%,Direccion.ilike.%${searchTerm}%,Telefono.ilike.%${searchTerm}%`)
        .order('Nombre', { ascending: true });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error buscando usuarios:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener usuarios por cartera
   */
  static async getByCartera(idCartera) {
    try {
      const { data, error } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('IdCartera', idCartera)
        .order('Nombre', { ascending: true });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error obteniendo usuarios por cartera:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualizar estado de caja
   */
  static async updateCajaStatus(id, cajaAbierta) {
    try {
      const { data, error } = await supabase
        .from('Usuarios')
        .update({ CajaAbierta: cajaAbierta })
        .eq('IdUsuario', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error actualizando estado de caja:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener estadísticas de usuarios
   */
  static async getStats() {
    try {
      const { count, error } = await supabase
        .from('Usuarios')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      
      // Obtener usuarios con caja abierta
      const { count: cajasAbiertas, error: errorCajas } = await supabase
        .from('Usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('CajaAbierta', true);
      
      if (errorCajas) throw errorCajas;
      
      return { 
        success: true, 
        data: {
          total: count,
          cajasAbiertas: cajasAbiertas,
          cajasCerradas: count - cajasAbiertas
        }
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de usuarios:', error);
      return { success: false, error: error.message };
    }
  }
}