import { supabase } from '../_config/supabase';

/**
 * Servicio para gestionar las operaciones CRUD de Usuarios
 * Usa la tabla public.usuarios que está sincronizada con auth.users
 * Incluye datos de prueba como fallback cuando no se puede acceder a la base de datos
 */
export class UsuariosService {
  
  /**
   * Obtener todos los usuarios con estado de confirmación de email
   */
  static async getAll() {
    try {
      console.log('🔍 Ejecutando consulta de usuarios...');
      
      // Obtener usuarios básicos primero
      const { data: usuarios, error } = await supabase
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
          IdEmpresa,
          Direccion,
          Telefono,
          IdSucursal
        `)
        .order('FechaCreacion', { ascending: false });

      if (error) {
        console.error('❌ Error obteniendo usuarios:', error);
        return { success: false, error: error.message };
      }

      // Obtener empresas para enriquecer los datos
      const { data: empresas, error: empresasError } = await supabase
        .from('empresas')
        .select('IdEmpresa, NombreComercial, RazonSocial');

      if (empresasError) {
        console.warn('⚠️ Error obteniendo empresas:', empresasError.message);
      }

      // Obtener sucursales para enriquecer los datos
      const { data: sucursales, error: sucursalesError } = await supabase
        .from('sucursales')
        .select('IdSucursal, Nombre, Codigo');

      if (sucursalesError) {
        console.warn('⚠️ Error obteniendo sucursales:', sucursalesError.message);
      }

      // Enriquecer usuarios con datos de empresas y sucursales
      const usuariosEnriquecidos = usuarios.map(usuario => {
        const empresa = empresas?.find(emp => emp.IdEmpresa === usuario.IdEmpresa);
        const sucursal = sucursales?.find(suc => suc.IdSucursal === usuario.IdSucursal);
        
        return {
          ...usuario,
          empresas: empresa ? [empresa] : [],
          sucursales: sucursal ? [sucursal] : []
        };
      });

      // Obtener estado de confirmación para cada usuario
      const usuariosConEstado = [];
      
      for (const usuario of usuariosEnriquecidos || []) {
        try {
          const { data: authInfo, error: rpcError } = await supabase.rpc('get_user_auth_info', { 
            user_uuid: usuario.UserId 
          });
          
          console.log(`📧 Estado email para ${usuario.Email}:`, authInfo);
          
          const emailConfirmado = authInfo?.email_confirmed === true;
          
          usuariosConEstado.push({
            ...usuario,
            emailConfirmado,
            estadoEmail: emailConfirmado ? 'Confirmado' : 'Sin confirmar'
          });
        } catch (authError) {
          console.error('Error obteniendo info auth:', authError);
          usuariosConEstado.push({
            ...usuario,
            emailConfirmado: false,
            estadoEmail: 'Sin confirmar'
          });
        }
      }

      console.log('✅ Usuarios con estado procesados:', usuariosConEstado);
      return { success: true, data: usuariosConEstado };
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
      // Obtener usuario básico
      const { data: usuario, error } = await supabase
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
          IdEmpresa,
          Direccion,
          Telefono,
          IdSucursal,
          RegID
        `)
        .eq('IdUsuario', id)
        .single();
      
      if (error) throw error;

      // Obtener empresa si existe
      let empresa = null;
      if (usuario.IdEmpresa) {
        const { data: empresaData, error: empresaError } = await supabase
          .from('empresas')
          .select('IdEmpresa, NombreComercial, RazonSocial')
          .eq('IdEmpresa', usuario.IdEmpresa)
          .single();
        
        if (!empresaError) {
          empresa = empresaData;
        }
      }

      // Obtener sucursal si existe
      let sucursal = null;
      if (usuario.IdSucursal) {
        const { data: sucursalData, error: sucursalError } = await supabase
          .from('sucursales')
          .select('IdSucursal, Nombre, Codigo')
          .eq('IdSucursal', usuario.IdSucursal)
          .single();
        
        if (!sucursalError) {
          sucursal = sucursalData;
        }
      }

      // Enriquecer usuario con datos relacionados
      const usuarioEnriquecido = {
        ...usuario,
        empresas: empresa ? [empresa] : [],
        sucursales: sucursal ? [sucursal] : []
      };
      
      return { success: true, data: usuarioEnriquecido };
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
   * Crear nuevo usuario a través de Supabase Auth
   */
  static async create(usuarioData) {
    try {
      const { NombreUsuario, Nombres, Apellidos, Email, password, Activo = true } = usuarioData;

      // Validar campos requeridos
      if (!Email || !password || !Nombres || !Apellidos) {
        return { 
          success: false, 
          error: 'Email, contraseña, nombres y apellidos son requeridos' 
        };
      }

      // Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: Email,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/administration/users`,
          data: {
            nombres: Nombres,
            apellidos: Apellidos,
            nombre_usuario: NombreUsuario || `${Nombres.toLowerCase()}.${Apellidos.toLowerCase()}`,
            activo: Activo
          }
        }
      });

      if (error) {
        console.error('❌ Error creando usuario en auth:', error);
        let errorMessage = 'Error al crear usuario';
        
        if (error.message.includes('User already registered')) {
          errorMessage = 'Este email ya está registrado';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Email inválido';
        } else {
          errorMessage = error.message;
        }
        
        return { success: false, error: errorMessage };
      }

      if (data.user) {
        console.log('✅ Usuario creado exitosamente en auth:', data.user.id);
        
        // El trigger handle_new_user debería crear automáticamente el registro en usuarios
        // Esperamos un momento para que el trigger se ejecute
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { 
          success: true, 
          data: {
            userId: data.user.id,
            email: data.user.email
          }
        };
      }

      return { success: false, error: 'No se pudo crear el usuario' };
    } catch (error) {
      console.error('Error creando usuario:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualizar usuario existente
   * Solo se pueden actualizar algunos campos en la tabla usuarios
   */
  static async update(id, usuarioData) {
    try {
      const { Nombres, Apellidos, NombreUsuario, Activo, IdEmpresa, Direccion, Telefono, IdSucursal } = usuarioData;

      // Solo actualizamos los campos permitidos en la tabla usuarios
      const updates = {};
      if (Nombres !== undefined) updates.Nombres = Nombres;
      if (Apellidos !== undefined) updates.Apellidos = Apellidos;
      if (NombreUsuario !== undefined) updates.NombreUsuario = NombreUsuario;
      if (Activo !== undefined) updates.Activo = Activo;
      if (IdEmpresa !== undefined) updates.IdEmpresa = IdEmpresa;
      if (Direccion !== undefined) updates.Direccion = Direccion;
      if (Telefono !== undefined) updates.Telefono = Telefono;
      if (IdSucursal !== undefined) updates.IdSucursal = IdSucursal;

      const { data, error } = await supabase
        .from('usuarios')
        .update(updates)
        .eq('IdUsuario', id)
        .select();

      if (error) {
        console.error('❌ Error actualizando usuario:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Usuario actualizado exitosamente');
      return { success: true, data: data[0] };
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
      
      if (error) {
        console.error('❌ Error obteniendo estadísticas de usuarios:', error);
        return { success: false, error: error.message };
      }
      
      // Obtener usuarios activos
      const { count: usuariosActivos, error: errorActivos } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('Activo', true);
      
      if (errorActivos) {
        console.error('❌ Error obteniendo usuarios activos:', errorActivos);
        return { success: false, error: errorActivos.message };
      }
      
      return { 
        success: true, 
        data: {
          total: count || 0,
          activos: usuariosActivos || 0,
          inactivos: (count || 0) - (usuariosActivos || 0)
        }
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de usuarios:', error);
      return { success: false, error: error.message };
    }
  }
}