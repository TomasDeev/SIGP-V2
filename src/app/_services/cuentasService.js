import { supabase } from '../_config/supabase';

/**
 * Servicio para gestionar las operaciones CRUD de Cuentas (Clientes)
 */
export class CuentasService {
  
  /**
   * Obtener todas las cuentas
   */
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('cuentas')
        .select(`
          IdCliente,
          IdEmpresa,
          Nombres,
          Apellidos,
          Cedula,
          Telefono,
          Celular,
          Email,
          Direccion,
          Sector,
          Nacionalidad,
          LugarNacimiento,
          FechaNacimiento,
          EstadoCivil,
          Profesion,
          LugarTrabajo,
          DireccionTrabajo,
          TelefonoTrabajo,
          Ingresos,
          TiempoTrabajo,
          Observaciones,
          FechaIngreso,
          Activo,
          Foto
        `)
        .eq('Activo', true)
        .order('FechaIngreso', { ascending: false });
      
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error obteniendo cuentas:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener cuenta por ID
   */
  static async getById(id) {
    try {
      const { data, error } = await supabase
        .from('cuentas')
        .select(`
          IdCliente,
          IdEmpresa,
          Nombres,
          Apellidos,
          Cedula,
          Telefono,
          Celular,
          Email,
          Direccion,
          Sector,
          Nacionalidad,
          LugarNacimiento,
          FechaNacimiento,
          EstadoCivil,
          Profesion,
          LugarTrabajo,
          DireccionTrabajo,
          TelefonoTrabajo,
          Ingresos,
          TiempoTrabajo,
          Observaciones,
          FechaIngreso,
          Activo,
          Foto
        `)
        .eq('IdCliente', id)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error obteniendo cuenta:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener cuenta por cédula
   */
  static async getByCedula(cedula) {
    try {
      const { data, error } = await supabase
        .from('cuentas')
        .select(`
          IdCliente,
          IdEmpresa,
          Nombres,
          Apellidos,
          Cedula,
          Telefono,
          Celular,
          Email,
          Direccion,
          Sector,
          Nacionalidad,
          LugarNacimiento,
          FechaNacimiento,
          EstadoCivil,
          Profesion,
          LugarTrabajo,
          DireccionTrabajo,
          TelefonoTrabajo,
          Ingresos,
          TiempoTrabajo,
          Observaciones,
          FechaIngreso,
          Activo,
          Foto
        `)
        .eq('Cedula', cedula)
        .eq('Activo', true)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error obteniendo cuenta por cédula:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualizar cuenta
   */
  static async update(id, cuentaData) {
    try {
      const { data, error } = await supabase
        .from('cuentas')
        .update(cuentaData)
        .eq('IdCliente', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error actualizando cuenta:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Buscar cuentas por término
   */
  static async search(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('cuentas')
        .select(`
          IdCliente,
          Nombres,
          Apellidos,
          Cedula,
          Telefono,
          Celular,
          Email,
          Direccion,
          FechaIngreso,
          Activo,
          Foto
        `)
        .or(`Nombres.ilike.%${searchTerm}%,Apellidos.ilike.%${searchTerm}%,Cedula.ilike.%${searchTerm}%,Email.ilike.%${searchTerm}%`)
        .eq('Activo', true)
        .order('FechaIngreso', { ascending: false });
      
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error buscando cuentas:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener cuentas por empresa
   */
  static async getByEmpresa(idEmpresa) {
    try {
      const { data, error } = await supabase
        .from('cuentas')
        .select(`
          IdCliente,
          Nombres,
          Apellidos,
          Cedula,
          Telefono,
          Email,
          FechaIngreso,
          Activo,
          Foto
        `)
        .eq('IdEmpresa', idEmpresa)
        .eq('Activo', true)
        .order('FechaIngreso', { ascending: false });
      
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error obteniendo cuentas por empresa:', error);
      return { success: false, error: error.message };
    }
  }
}

export default CuentasService;