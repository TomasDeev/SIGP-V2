import { supabase } from '../_config/supabase';

/**
 * Servicio para manejar uploads de archivos a Supabase Storage
 */
export class StorageService {
  
  /**
   * Subir imagen de cliente al bucket de fotos
   */
  static async uploadClientPhoto(file, clientId) {
    try {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La imagen debe ser menor a 5MB');
      }

      // Generar nombre único para el archivo
      const fileExtension = file.name.split('.').pop();
      const fileName = `cliente_${clientId}_${Date.now()}.${fileExtension}`;
      const filePath = `clientes/${fileName}`;

      // Subir archivo a Supabase Storage
      const { data, error } = await supabase.storage
        .from('cliente-fotos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Obtener URL pública del archivo
      const { data: { publicUrl } } = supabase.storage
        .from('cliente-fotos')
        .getPublicUrl(filePath);

      return {
        success: true,
        data: {
          path: filePath,
          publicUrl: publicUrl,
          fileName: fileName
        }
      };
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Eliminar imagen de cliente
   */
  static async deleteClientPhoto(filePath) {
    try {
      const { error } = await supabase.storage
        .from('cliente-fotos')
        .remove([filePath]);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Actualizar imagen de cliente (eliminar la anterior y subir nueva)
   */
  static async updateClientPhoto(file, clientId, oldFilePath = null) {
    try {
      // Si hay una imagen anterior, eliminarla
      if (oldFilePath) {
        await StorageService.deleteClientPhoto(oldFilePath);
      }

      // Subir nueva imagen
      return await StorageService.uploadClientPhoto(file, clientId);
    } catch (error) {
      console.error('Error actualizando imagen:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener URL pública de una imagen
   */
  static getPublicUrl(filePath) {
    const { data: { publicUrl } } = supabase.storage
      .from('client-photos')
      .getPublicUrl(filePath);
    
    return publicUrl;
  }
}

export default StorageService;