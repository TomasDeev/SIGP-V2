import { supabase } from '../_config/supabase';

/**
 * Servicio para gestionar las operaciones CRUD de Usuarios
 * Usa auth.users para obtener usuarios de autenticación de Supabase
 */
export class UsuariosService {
  
  /**
   * Obtener todos los usuarios de auth.users
   */
  static async getAll() {
    try {
      console.log('🔍 UsuariosService.getAll() - Iniciando consulta de auth.users...');
      
      // Consultar directamente la tabla auth.users
      const { data, error } = await supabase
        .from('auth.users')
        .select(`
          id,
          email,
          created_at,
          updated_at,
          last_sign_in_at,
          email_confirmed_at,
          banned_until,
          raw_user_meta_data,
          raw_app_meta_data
        `)
        .order('created_at', { ascending: false });
      
      console.log('📊 Respuesta de Supabase Auth:', { data, error });
      console.log('📈 Cantidad de registros:', data?.length || 0);
      
      if (error) {
        console.error('❌ Error de Supabase Auth:', error);
        throw error;
      }
      
      // Transformar los datos para que coincidan con el formato esperado
      const transformedUsers = data?.map(user => ({
        IdUsuario: user.id,
        NombreUsuario: user.raw_user_meta_data?.username || user.email?.split('@')[0] || 'Sin nombre',
        Nombres: user.raw_user_meta_data?.full_name || user.raw_user_meta_data?.first_name || 'Sin nombre',
        Apellidos: user.raw_user_meta_data?.last_name || '',
        Email: user.email,
        Activo: !user.banned_until,
        FechaCreacion: user.created_at,
        UserId: user.id,
        // Campos adicionales que pueden ser útiles
        EmailConfirmed: user.email_confirmed_at ? true : false,
        LastSignIn: user.last_sign_in_at,
        // Campos para empresa y sucursal (inicialmente vacíos)
        IdEmpresa: null,
        IdSucursal: null
      })) || [];
      
      return { success: true, data: transformedUsers };
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
        .from('auth.users')
        .select(`
          id,
          email,
          created_at,
          updated_at,
          last_sign_in_at,
          email_confirmed_at,
          banned_until,
          raw_user_meta_data,
          raw_app_meta_data
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Transformar el dato
      const transformedUser = {
        IdUsuario: data.id,
        NombreUsuario: data.raw_user_meta_data?.username || data.email?.split('@')[0] || 'Sin nombre',
        Nombres: data.raw_user_meta_data?.full_name || data.raw_user_meta_data?.first_name || 'Sin nombre',
        Apellidos: data.raw_user_meta_data?.last_name || '',
        Email: data.email,
        Activo: !data.banned_until,
        FechaCreacion: data.created_at,
        UserId: data.id,
        EmailConfirmed: data.email_confirmed_at ? true : false,
        LastSignIn: data.last_sign_in_at,
        IdEmpresa: null,
        IdSucursal: null
      };
      
      return { success: true, data: transformedUser };
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
        .from('auth.users')
        .select(`
          id,
          email,
          created_at,
          updated_at,
          last_sign_in_at,
          email_confirmed_at,
          banned_until,
          raw_user_meta_data,
          raw_app_meta_data
        `)
        .or(`email.ilike.%${searchTerm}%,raw_user_meta_data->>full_name.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transformar los datos
      const transformedUsers = data?.map(user => ({
        IdUsuario: user.id,
        NombreUsuario: user.raw_user_meta_data?.username || user.email?.split('@')[0] || 'Sin nombre',
        Nombres: user.raw_user_meta_data?.full_name || user.raw_user_meta_data?.first_name || 'Sin nombre',
        Apellidos: user.raw_user_meta_data?.last_name || '',
        Email: user.email,
        Activo: !user.banned_until,
        FechaCreacion: user.created_at,
        UserId: user.id,
        EmailConfirmed: user.email_confirmed_at ? true : false,
        LastSignIn: user.last_sign_in_at,
        IdEmpresa: null,
        IdSucursal: null
      })) || [];
      
      return { success: true, data: transformedUsers };
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
        .from('auth.users')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      
      // Obtener usuarios activos (no baneados)
      const { count: usuariosActivos, error: errorActivos } = await supabase
        .from('auth.users')
        .select('*', { count: 'exact', head: true })
        .is('banned_until', null);
      
      if (errorActivos) throw errorActivos;
      
      // Obtener usuarios con email confirmado
      const { count: emailsConfirmados, error: errorEmails } = await supabase
        .from('auth.users')
        .select('*', { count: 'exact', head: true })
        .not('email_confirmed_at', 'is', null);
      
      if (errorEmails) throw errorEmails;
      
      return { 
        success: true, 
        data: {
          total: count,
          activos: usuariosActivos,
          inactivos: count - usuariosActivos,
          emailsConfirmados: emailsConfirmados,
          emailsPendientes: count - emailsConfirmados
        }
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de usuarios:', error);
      return { success: false, error: error.message };
    }
  }
}