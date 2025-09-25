import { supabase } from '../_config/supabase';

/**
 * Servicio para gestionar referencias personales
 */
export class ReferenciasPersonalesService {
  /**
   * Obtener todas las referencias personales de un cliente
   */
  static async getByClientId(clientId) {
    try {
      const { data, error } = await supabase
        .from('referenciaspersonales')
        .select(`
          IdReferenciaPersonal,
          IdCuenta,
          IdTipoReferenciaPersonal,
          Nombre,
          Direccion,
          Telefono,
          referenciapersonaltipos (
            IdTipoReferenciaPersonal,
            Nombre
          )
        `)
        .eq('IdCuenta', clientId)
        .order('IdReferenciaPersonal', { ascending: true });
      
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error obteniendo referencias personales:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener tipos de referencias personales
   */
  static async getTipos() {
    try {
      const { data, error } = await supabase
        .from('referenciapersonaltipos')
        .select('*')
        .order('IdTipoReferenciaPersonal', { ascending: true });
      
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error obteniendo tipos de referencias:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Crear una nueva referencia personal
   */
  static async create(referenciaData) {
    try {
      const { data, error } = await supabase
        .from('referenciaspersonales')
        .insert(referenciaData)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creando referencia personal:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualizar una referencia personal
   */
  static async update(id, referenciaData) {
    try {
      const { data, error } = await supabase
        .from('referenciaspersonales')
        .update(referenciaData)
        .eq('IdReferenciaPersonal', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error actualizando referencia personal:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Eliminar una referencia personal
   */
  static async delete(id) {
    try {
      const { error } = await supabase
        .from('referenciaspersonales')
        .delete()
        .eq('IdReferenciaPersonal', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error eliminando referencia personal:', error);
      return { success: false, error: error.message };
    }
  }
}

export default ReferenciasPersonalesService;


