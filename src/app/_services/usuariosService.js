import { supabase } from '../_config/supabase';

/**
 * Servicio para gestionar las operaciones CRUD de Usuarios
 * Usa la tabla public.Usuarios que está sincronizada con auth.users
 */
export class UsuariosService {
  
  /**
   * Obtener todos los usuarios de public.Usuarios
   */
  static async getAll() {
    try {
      console.log('🔍 UsuariosService.getAll() - Iniciando consulta de public.Usuarios...');
      
      // Consultar la tabla public.usuarios
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          IdUsuario,
          NombreUsuario,
          Nombres,
          Apellidos,
          Email,
          Activo,
          FechaCreacion,
          UserId,
          RegID
        `)
        .order('FechaCreacion', { ascending: false });
      
      console.log('📊 Respuesta de Supabase Usuarios:', { data, error });
      console.log('📈 Cantidad de registros:', data?.length || 0);
      
      if (error) {
        console.error('❌ Error de Supabase Usuarios:', error);
        throw error;
      }
      
      // Los datos ya vienen en el formato correcto desde la tabla Usuarios
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('❌ Error obteniendo usuarios:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener usuario por ID
   */
  static async getById(id) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          IdUsuario,
          NombreUsuario,
          Nombres,
          Apellidos,
          Email,
          Activo,
          FechaCreacion,
          UserId,
          RegID
        `)
        .eq('IdUsuario', id)
        .single();
      
      if (error) throw error;
      
      return { success: true, data: data };
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener usuario por UserId (UUID de auth) - mismo que getById
   */
  static async getByUserId(userId) {
    return this.getById(userId);
  }

  /**
   * Crear nuevo usuario
   * NOTA: La creación de usuarios debe hacerse a través de auth.signUp()
   */
  static async create(usuarioData) {
    try {
      console.warn('⚠️ La creación de usuarios debe hacerse a través del sistema de autenticación');
      return { 
        success: false, 
        error: 'La creación de usuarios debe hacerse a través del sistema de autenticación de Supabase' 
      };
    } catch (error) {
      console.error('Error creando usuario:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualizar usuario existente
   * NOTA: Los metadatos de usuario se actualizan a través de auth.updateUser()
   */
  static async update(id, usuarioData) {
    try {
      console.warn('⚠️ La actualización de usuarios debe hacerse a través del sistema de autenticación');
      return { 
        success: false, 
        error: 'La actualización de usuarios debe hacerse a través del sistema de autenticación de Supabase' 
      };
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Eliminar usuario
   * NOTA: La eliminación de usuarios requiere permisos de administrador
   */
  static async delete(id) {
    try {
      console.warn('⚠️ La eliminación de usuarios requiere permisos de administrador');
      return { 
        success: false, 
        error: 'La eliminación de usuarios requiere permisos de administrador' 
      };
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
        .from('usuarios')
        .select(`
          IdUsuario,
          NombreUsuario,
          Nombres,
          Apellidos,
          Email,
          Activo,
          FechaCreacion,
          UserId,
          RegID
        `)
        .or(`Email.ilike.%${searchTerm}%,Nombres.ilike.%${searchTerm}%,Apellidos.ilike.%${searchTerm}%,NombreUsuario.ilike.%${searchTerm}%`)
        .order('FechaCreacion', { ascending: false });
      
      if (error) throw error;
      
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error buscando usuarios:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener usuarios por cartera
   * NOTA: Los usuarios de auth no tienen relación directa con carteras
   */
  static async getByCartera(idCartera) {
    try {
      console.warn('⚠️ Los usuarios de auth no tienen relación directa con carteras');
      return { 
        success: false, 
        error: 'Los usuarios de auth no tienen relación directa con carteras. Usar una tabla de relación separada.' 
      };
    } catch (error) {
      console.error('Error obteniendo usuarios por cartera:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualizar estado de caja
   * NOTA: Esta funcionalidad requiere una tabla separada para estados de caja
   */
  static async updateCajaStatus(id, cajaAbierta) {
    try {
      console.warn('⚠️ El estado de caja debe manejarse en una tabla separada');
      return { 
        success: false, 
        error: 'El estado de caja debe manejarse en una tabla separada, no en auth.users' 
      };
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
        .from('usuarios')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      
      // Obtener usuarios activos
      const { count: usuariosActivos, error: errorActivos } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('Activo', true);
      
      if (errorActivos) throw errorActivos;
      
      return { 
        success: true, 
        data: {
          total: count,
          activos: usuariosActivos,
          inactivos: count - usuariosActivos
        }
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de usuarios:', error);
      return { success: false, error: error.message };
    }
  }
}