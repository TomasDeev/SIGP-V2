import { supabase } from '../_config/supabase';

/**
 * Servicio para gestionar las operaciones CRUD de Empresas
 */
export class EmpresasService {
  
  /**
   * Obtener todas las empresas
   */
  static async getAll() {
    try {
      console.log('🔍 EmpresasService.getAll() - Iniciando consulta...');
      console.log('🔗 Supabase URL:', supabase.supabaseUrl);
      console.log('📋 Consultando tabla: Empresas');
      
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('IdEmpresa', { ascending: false });
      
      console.log('📊 EmpresasService.getAll() - Resultado completo:', { 
        data, 
        error, 
        dataLength: data?.length,
        dataType: typeof data,
        isArray: Array.isArray(data)
      });
      
      if (error) {
        console.error('❌ EmpresasService.getAll() - Error detallado:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log('📋 Empresas encontradas:');
        data.forEach((empresa, index) => {
          console.log(`  ${index + 1}. ${empresa.RazonSocial || empresa.NombreComercial} (ID: ${empresa.IdEmpresa})`);
        });
      } else {
        console.log('⚠️ No se encontraron empresas en la base de datos');
      }
      
      console.log('✅ EmpresasService.getAll() - Éxito:', data?.length || 0, 'empresas encontradas');
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('💥 EmpresasService.getAll() - Excepción completa:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener empresa por ID
   */
  static async getById(id) {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('IdEmpresa', id)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error obteniendo empresa:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Crear nueva empresa
   */
  static async create(empresaData) {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .insert([empresaData])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creando empresa:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualizar empresa existente
   */
  static async update(id, empresaData) {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .delete()
        .eq('IdEmpresa', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error actualizando empresa:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Eliminar empresa
   */
  static async delete(id) {
    try {
      const { error } = await supabase
        .from('Empresas')
        .delete()
        .eq('IdEmpresa', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error eliminando empresa:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Buscar empresas por término
   */
  static async search(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('Empresas')
        .select('*')
        .or(`RazonSocial.ilike.%${searchTerm}%,NombreComercial.ilike.%${searchTerm}%,RNC.ilike.%${searchTerm}%`)
        .order('FechaCreacion', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error buscando empresas:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener estadísticas de empresas
   */
  static async getStats() {
    try {
      const { count, error } = await supabase
        .from('Empresas')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      
      return { 
        success: true, 
        data: {
          total: count,
          // Aquí puedes agregar más estadísticas según necesites
        }
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return { success: false, error: error.message };
    }
  }
}