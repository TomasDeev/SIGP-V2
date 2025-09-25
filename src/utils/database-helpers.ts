/**
 * SIGP Database Helpers
 * Funciones helper para operaciones comunes de base de datos
 * Reduce errores y estandariza operaciones
 */

import { supabase } from '../app/_config/supabase';
import type {
  Empresa, Cartera, Usuario, Cuenta, Prestamo, Amortizacion, Garantia,
  EmpresaInsert, CarteraInsert, UsuarioInsert, CuentaInsert, PrestamoInsert,
  FiltrosPrestamo, FiltrosCuenta, PrestamoConRelaciones, CuentaConRelaciones,
  ApiResponse, PaginatedResponse, EstadoPrestamo
} from '../types/database.types';

// ============================================================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================================================

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

// ============================================================================
// FUNCIONES DE VALIDACIÓN
// ============================================================================

export const validateRNC = (rnc: string): boolean => {
  // RNC dominicano: 9 dígitos o 11 dígitos
  const rncPattern = /^[0-9]{9}$|^[0-9]{11}$/;
  return rncPattern.test(rnc.replace(/[-\s]/g, ''));
};

export const validateCedula = (cedula: string): boolean => {
  // Cédula dominicana: 11 dígitos con formato XXX-XXXXXXX-X
  const cedulaPattern = /^[0-9]{3}-?[0-9]{7}-?[0-9]{1}$/;
  return cedulaPattern.test(cedula);
};

export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

// ============================================================================
// FUNCIONES DE FORMATO
// ============================================================================

export const formatCurrency = (amount: number, currency: 'DOP' | 'USD' = 'DOP'): string => {
  const formatter = new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: currency === 'DOP' ? 'DOP' : 'USD',
    minimumFractionDigits: 2
  });
  return formatter.format(amount);
};

export const formatPercentage = (rate: number): string => {
  return `${(rate * 100).toFixed(2)}%`;
};

export const formatCodigoPrestamo = (prefijo: string, numero: number): string => {
  return `${prefijo}${numero.toString().padStart(6, '0')}`;
};

export const formatCodigoCuenta = (prefijo: string, numero: number): string => {
  return `${prefijo}${numero.toString().padStart(8, '0')}`;
};

// ============================================================================
// FUNCIONES DE EMPRESAS
// ============================================================================

export const getEmpresaById = async (id: number): Promise<ApiResponse<Empresa | null>> => {
  try {
    const { data, error } = await supabase
      .from('Empresas')
      .select('*')
      .eq('IdEmpresa', id)
      .eq('Activo', true)
      .single();

    if (error) throw error;
    return { data };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const getEmpresasActivas = async (): Promise<ApiResponse<Empresa[]>> => {
  try {
    const { data, error } = await supabase
      .from('Empresas')
      .select('*')
      .eq('Activo', true)
      .order('NombreComercial');

    if (error) throw error;
    return { data: data || [] };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

export const createEmpresa = async (empresa: EmpresaInsert): Promise<ApiResponse<Empresa | null>> => {
  try {
    // Validaciones
    if (!validateRNC(empresa.RNC)) {
      return { data: null, error: 'RNC inválido' };
    }

    const { data, error } = await supabase
      .from('Empresas')
      .insert(empresa)
      .select()
      .single();

    if (error) throw error;
    return { data };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// ============================================================================
// FUNCIONES DE CARTERAS
// ============================================================================

export const getCarterasByEmpresa = async (idEmpresa: number): Promise<ApiResponse<Cartera[]>> => {
  try {
    const { data, error } = await supabase
      .from('Carteras')
      .select('*')
      .eq('IdEmpresa', idEmpresa)
      .eq('Activo', true)
      .order('NombreComercial');

    if (error) throw error;
    return { data: data || [] };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

export const getCarteraById = async (id: number): Promise<ApiResponse<Cartera | null>> => {
  try {
    const { data, error } = await supabase
      .from('Carteras')
      .select('*')
      .eq('IdCartera', id)
      .eq('Activo', true)
      .single();

    if (error) throw error;
    return { data };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// ============================================================================
// FUNCIONES DE USUARIOS
// ============================================================================

export const getUsuarioByAuthId = async (authId: string): Promise<ApiResponse<Usuario | null>> => {
  try {
    const { data, error } = await supabase
      .from('Usuarios')
      .select(`
        *,
        cartera:Carteras!inner(
          *,
          empresa:Empresas!inner(*)
        )
      `)
      .eq('UserId', authId)
      .single();

    if (error) throw error;
    return { data };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const createUsuario = async (usuario: UsuarioInsert): Promise<ApiResponse<Usuario | null>> => {
  try {
    const { data, error } = await supabase
      .from('Usuarios')
      .insert(usuario)
      .select()
      .single();

    if (error) throw error;
    return { data };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// ============================================================================
// FUNCIONES DE CUENTAS
// ============================================================================

export const getCuentasByCartera = async (
  idCartera: number,
  filtros?: FiltrosCuenta,
  page: number = 1,
  limit: number = DEFAULT_PAGE_SIZE
): Promise<PaginatedResponse<Cuenta>> => {
  try {
    let query = supabase
      .from('Cuentas')
      .select('*', { count: 'exact' })
      .eq('IdCartera', idCartera);

    // Aplicar filtros
    if (filtros?.EstaEnListaNegra !== undefined) {
      query = query.eq('EstaEnListaNegra', filtros.EstaEnListaNegra);
    }
    if (filtros?.Bloqueado !== undefined) {
      query = query.eq('Bloqueado', filtros.Bloqueado);
    }
    if (filtros?.Nacionalidad) {
      query = query.eq('Nacionalidad', filtros.Nacionalidad);
    }
    if (filtros?.EstadoCivil) {
      query = query.eq('EstadoCivil', filtros.EstadoCivil);
    }

    // Paginación
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .range(from, to)
      .order('Nombres');

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > page * limit
    };
  } catch (error) {
    return {
      data: [],
      total: 0,
      page,
      limit,
      hasMore: false
    };
  }
};

export const getCuentaById = async (id: number): Promise<ApiResponse<CuentaConRelaciones | null>> => {
  try {
    const { data, error } = await supabase
      .from('Cuentas')
      .select(`
        *,
        cartera:Carteras!inner(*),
        prestamos:Prestamos(*)
      `)
      .eq('IdCuenta', id)
      .single();

    if (error) throw error;
    return { data };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const buscarCuentas = async (
  termino: string,
  idCartera?: number
): Promise<ApiResponse<Cuenta[]>> => {
  try {
    let query = supabase
      .from('Cuentas')
      .select('*');

    if (idCartera) {
      query = query.eq('IdCartera', idCartera);
    }

    // Buscar por nombre, apellido, identificación o código
    const { data, error } = await query
      .or(`Nombres.ilike.%${termino}%,Apellidos.ilike.%${termino}%,Identificacion.ilike.%${termino}%,Codigo.ilike.%${termino}%`)
      .limit(10);

    if (error) throw error;
    return { data: data || [] };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

// ============================================================================
// FUNCIONES DE PRÉSTAMOS
// ============================================================================

export const getPrestamosByCartera = async (
  idCartera: number,
  filtros?: FiltrosPrestamo,
  page: number = 1,
  limit: number = DEFAULT_PAGE_SIZE
): Promise<PaginatedResponse<Prestamo>> => {
  try {
    let query = supabase
      .from('Prestamos')
      .select('*', { count: 'exact' })
      .eq('IdCartera', idCartera);

    // Aplicar filtros
    if (filtros?.IdEstado) {
      query = query.eq('IdEstado', filtros.IdEstado);
    }
    if (filtros?.UsuarioId) {
      query = query.eq('UsuarioId', filtros.UsuarioId);
    }
    if (filtros?.FechaDesde) {
      query = query.gte('FechaCreacion', filtros.FechaDesde);
    }
    if (filtros?.FechaHasta) {
      query = query.lte('FechaCreacion', filtros.FechaHasta);
    }
    if (filtros?.MontoMinimo) {
      query = query.gte('CapitalPrestado', filtros.MontoMinimo);
    }
    if (filtros?.MontoMaximo) {
      query = query.lte('CapitalPrestado', filtros.MontoMaximo);
    }
    if (filtros?.EnLegal !== undefined) {
      query = query.eq('EnLegal', filtros.EnLegal);
    }
    if (filtros?.Castigada !== undefined) {
      query = query.eq('Castigada', filtros.Castigada);
    }

    // Paginación
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .range(from, to)
      .order('FechaCreacion', { ascending: false });

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > page * limit
    };
  } catch (error) {
    return {
      data: [],
      total: 0,
      page,
      limit,
      hasMore: false
    };
  }
};

export const getPrestamoById = async (id: number): Promise<ApiResponse<PrestamoConRelaciones | null>> => {
  try {
    const { data, error } = await supabase
      .from('Prestamos')
      .select(`
        *,
        cuenta:Cuentas!inner(*),
        cartera:Carteras!inner(*),
        usuario:Usuarios!inner(*),
        amortizaciones:Amortizaciones(*),
        garantias:Garantias(*)
      `)
      .eq('IdPrestamo', id)
      .single();

    if (error) throw error;
    return { data };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const buscarPrestamos = async (
  termino: string,
  idCartera?: number
): Promise<ApiResponse<Prestamo[]>> => {
  try {
    let query = supabase
      .from('Prestamos')
      .select(`
        *,
        cuenta:Cuentas!inner(Nombres, Apellidos, Identificacion)
      `);

    if (idCartera) {
      query = query.eq('IdCartera', idCartera);
    }

    // Buscar por código de préstamo o datos del cliente
    const { data, error } = await query
      .or(`Codigo.ilike.%${termino}%,cuenta.Nombres.ilike.%${termino}%,cuenta.Apellidos.ilike.%${termino}%,cuenta.Identificacion.ilike.%${termino}%`)
      .limit(10);

    if (error) throw error;
    return { data: data || [] };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

// ============================================================================
// FUNCIONES DE AMORTIZACIONES
// ============================================================================

export const getAmortizacionesByPrestamo = async (idPrestamo: number): Promise<ApiResponse<Amortizacion[]>> => {
  try {
    const { data, error } = await supabase
      .from('Amortizaciones')
      .select('*')
      .eq('IdPrestamo', idPrestamo)
      .order('OrdenPago');

    if (error) throw error;
    return { data: data || [] };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

export const getAmortizacionesVencidas = async (
  idCartera?: number,
  diasVencimiento: number = 0
): Promise<ApiResponse<Amortizacion[]>> => {
  try {
    const fechaCorte = new Date();
    fechaCorte.setDate(fechaCorte.getDate() - diasVencimiento);

    let query = supabase
      .from('Amortizaciones')
      .select(`
        *,
        prestamo:Prestamos!inner(
          *,
          cuenta:Cuentas!inner(*)
        )
      `)
      .eq('EstaPago', false)
      .lte('Vencimiento', fechaCorte.toISOString());

    if (idCartera) {
      query = query.eq('prestamo.IdCartera', idCartera);
    }

    const { data, error } = await query
      .order('Vencimiento');

    if (error) throw error;
    return { data: data || [] };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

// ============================================================================
// FUNCIONES DE REPORTES Y ESTADÍSTICAS
// ============================================================================

export const getEstadisticasCartera = async (idCartera: number) => {
  try {
    // Obtener estadísticas básicas
    const [prestamosResult, cuentasResult, amortizacionesResult] = await Promise.all([
      supabase
        .from('Prestamos')
        .select('IdEstado, CapitalPrestado')
        .eq('IdCartera', idCartera),
      
      supabase
        .from('Cuentas')
        .select('IdCuenta')
        .eq('IdCartera', idCartera),
      
      supabase
        .from('Amortizaciones')
        .select('EstaPago, Capital, Interes, Mora')
        .eq('prestamo.IdCartera', idCartera)
    ]);

    const prestamos = prestamosResult.data || [];
    const cuentas = cuentasResult.data || [];
    const amortizaciones = amortizacionesResult.data || [];

    // Calcular estadísticas
    const totalPrestamos = prestamos.length;
    const totalCuentas = cuentas.length;
    const prestamosActivos = prestamos.filter(p => p.IdEstado === EstadoPrestamo.ACTIVO).length;
    const prestamosPagados = prestamos.filter(p => p.IdEstado === EstadoPrestamo.PAGADO).length;
    const prestamosVencidos = prestamos.filter(p => p.IdEstado === EstadoPrestamo.VENCIDO).length;
    
    const capitalTotal = prestamos.reduce((sum, p) => sum + (p.CapitalPrestado || 0), 0);
    const cuotasPendientes = amortizaciones.filter(a => !a.EstaPago).length;
    const montoPendiente = amortizaciones
      .filter(a => !a.EstaPago)
      .reduce((sum, a) => sum + (a.Capital || 0) + (a.Interes || 0) + (a.Mora || 0), 0);

    return {
      data: {
        totalPrestamos,
        totalCuentas,
        prestamosActivos,
        prestamosPagados,
        prestamosVencidos,
        capitalTotal,
        cuotasPendientes,
        montoPendiente,
        porcentajePagados: totalPrestamos > 0 ? (prestamosPagados / totalPrestamos) * 100 : 0,
        porcentajeVencidos: totalPrestamos > 0 ? (prestamosVencidos / totalPrestamos) * 100 : 0
      }
    };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

export const calcularProximoNumero = async (
  tabla: 'Prestamos' | 'Cuentas',
  idCartera: number,
  campo: 'PrestamoNo' | 'CuentaNo'
): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from(tabla)
      .select(campo)
      .eq('IdCartera', idCartera)
      .order(campo, { ascending: false })
      .limit(1);

    if (error) throw error;
    
    const ultimoNumero = data?.[0]?.[campo] || 0;
    return ultimoNumero + 1;
  } catch (error) {
    console.error(`Error calculando próximo número para ${tabla}:`, error);
    return 1;
  }
};

export const verificarExistenciaRNC = async (rnc: string, excluirId?: number): Promise<boolean> => {
  try {
    let query = supabase
      .from('Empresas')
      .select('IdEmpresa')
      .eq('RNC', rnc);

    if (excluirId) {
      query = query.neq('IdEmpresa', excluirId);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('Error verificando RNC:', error);
    return false;
  }
};

export const verificarExistenciaCedula = async (
  cedula: string,
  idCartera: number,
  excluirId?: number
): Promise<boolean> => {
  try {
    let query = supabase
      .from('Cuentas')
      .select('IdCuenta')
      .eq('Identificacion', cedula)
      .eq('IdCartera', idCartera);

    if (excluirId) {
      query = query.neq('IdCuenta', excluirId);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('Error verificando cédula:', error);
    return false;
  }
};