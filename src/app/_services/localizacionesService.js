import { supabase } from '../_config/supabase';

/**
 * Servicio para gestionar localizaciones de clientes
 */
export class LocalizacionesService {
  /**
   * Obtener todas las localizaciones de un cliente
   */
  static async getByClientId(clientId) {
    try {
      const { data, error } = await supabase
        .from('localizaciones')
        .select(`
          IdLocalizacion,
          IdCuenta,
          IdMunicipio,
          Sector,
          SubSector,
          Calle,
          ReferenciaLocalidad,
          Latitud,
          Longitud,
          municipios (
            IdMunicipio,
            Nombre,
            provincias (
              IdProvincia,
              Nombre
            )
          )
        `)
        .eq('IdCuenta', clientId)
        .order('IdLocalizacion', { ascending: true });
      
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error obteniendo localizaciones:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Crear una nueva localización
   */
  static async create(localizacionData) {
    try {
      const { data, error } = await supabase
        .from('localizaciones')
        .insert(localizacionData)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creando localización:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualizar una localización
   */
  static async update(id, localizacionData) {
    try {
      const { data, error } = await supabase
        .from('localizaciones')
        .update(localizacionData)
        .eq('IdLocalizacion', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error actualizando localización:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Eliminar una localización
   */
  static async delete(id) {
    try {
      const { error } = await supabase
        .from('localizaciones')
        .delete()
        .eq('IdLocalizacion', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error eliminando localización:', error);
      return { success: false, error: error.message };
    }
  }
}

export default LocalizacionesService;