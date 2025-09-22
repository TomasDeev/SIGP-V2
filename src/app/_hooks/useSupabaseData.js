import { useState, useEffect, useCallback } from 'react';
import { EmpresasService, UsuariosService, PrestamosService, SucursalesService } from '../_services';

/**
 * Hook personalizado para gestionar datos de Supabase
 * Proporciona funciones CRUD y manejo de estado para diferentes entidades
 */
export const useSupabaseData = (entityType) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});

  // Seleccionar el servicio apropiado según el tipo de entidad
  const getService = useCallback(() => {
    switch (entityType) {
      case 'empresas':
        return EmpresasService;
      case 'usuarios':
        return UsuariosService;
      case 'prestamos':
        return PrestamosService;
      case 'sucursales':
        return SucursalesService;
      default:
        throw new Error(`Tipo de entidad no soportado: ${entityType}`);
    }
  }, [entityType]);

  // Cargar todos los datos
  const loadData = useCallback(async () => {
    console.log(`🔄 loadData called for ${entityType}`);
    setLoading(true);
    setError(null);
    try {
      const service = getService();
      console.log(`📡 Calling ${entityType} service.getAll()`);
      const result = await service.getAll();
      console.log(`📊 ${entityType} service result:`, result);
      
      if (result.success) {
        console.log(`✅ Setting ${entityType} data:`, result.data);
        setData(result.data || []);
      } else {
        console.log(`❌ ${entityType} service error:`, result.error);
        setError(result.error);
      }
    } catch (err) {
      console.log(`💥 ${entityType} loadData exception:`, err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getService, entityType]);

  // Cargar estadísticas
  const loadStats = useCallback(async () => {
    try {
      const service = getService();
      const result = await service.getStats();
      
      if (result.success) {
        setStats(result.data || {});
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, [getService]);

  // Crear nuevo registro
  const create = useCallback(async (newData) => {
    console.log(`🆕 create called for ${entityType} with data:`, newData);
    try {
      const service = getService();
      console.log(`📡 Calling ${entityType} service.create()`);
      const result = await service.create(newData);
      console.log(`📝 ${entityType} create result:`, result);
      
      if (result.success) {
        console.log(`✅ Adding new ${entityType} to local data:`, result.data);
        setData(prev => {
          const newData = [...prev, result.data];
          console.log(`📊 Updated ${entityType} data:`, newData);
          return newData;
        });
        await loadStats(); // Actualizar estadísticas
        return { success: true, data: result.data };
      } else {
        console.log(`❌ ${entityType} create error:`, result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.log(`💥 ${entityType} create exception:`, err.message);
      return { success: false, error: err.message };
    }
  }, [getService, loadStats, entityType]);

  // Actualizar registro existente
  const update = useCallback(async (id, updateData) => {
    try {
      const service = getService();
      const result = await service.update(id, updateData);
      
      if (result.success) {
        setData(prev => prev.map(item => 
          item.IdEmpresa === id || item.IdUsuario === id || item.IdPrestamo === id 
            ? result.data 
            : item
        ));
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [getService]);

  // Eliminar registro
  const remove = useCallback(async (id) => {
    try {
      const service = getService();
      const result = await service.delete(id);
      
      if (result.success) {
        setData(prev => prev.filter(item => 
          item.IdEmpresa !== id && item.IdUsuario !== id && item.IdPrestamo !== id
        ));
        await loadStats(); // Actualizar estadísticas
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [getService, loadStats]);

  // Buscar registros
  const search = useCallback(async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const service = getService();
      const result = await service.search(searchTerm);
      
      if (result.success) {
        setData(result.data || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getService]);

  // Obtener registro por ID
  const getById = useCallback(async (id) => {
    try {
      const service = getService();
      const result = await service.getById(id);
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [getService]);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
    loadStats();
  }, [loadData, loadStats]);

  return {
    // Estado
    data,
    loading,
    error,
    stats,
    
    // Funciones CRUD
    create,
    update,
    remove,
    search,
    getById,
    
    // Funciones de utilidad
    loadData,
    loadStats,
    
    // Funciones de estado
    setError,
    clearError: () => setError(null),
  };
};

/**
 * Hook específico para empresas
 */
export const useEmpresas = () => {
  const { 
    data, 
    loading, 
    error, 
    stats, 
    create, 
    update, 
    remove, 
    search, 
    getById,
    loadData
  } = useSupabaseData('empresas');
  
  return {
    empresas: data,
    loading,
    error,
    stats,
    createEmpresa: create,
    updateEmpresa: update,
    deleteEmpresa: remove,
    search,
    getById,
    loadData
  };
};

/**
 * Hook específico para usuarios
 */
export const useUsuarios = () => {
  return useSupabaseData('usuarios');
};

/**
 * Hook específico para préstamos
 */
export const usePrestamos = () => {
  return useSupabaseData('prestamos');
};

/**
 * Hook específico para sucursales
 */
export const useSucursales = () => {
  return useSupabaseData('sucursales');
};

export default useSupabaseData;