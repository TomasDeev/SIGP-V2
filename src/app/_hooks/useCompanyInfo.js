import { useState, useEffect } from 'react';
import { supabase } from '../_config/supabase';
import useAuthenticatedUser from './useAuthenticatedUser';

const useCompanyInfo = () => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo, isAuthenticated } = useAuthenticatedUser();

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      if (!isAuthenticated || !userInfo?.IdEmpresa) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Obtener información de la empresa
        const { data: empresaData, error: empresaError } = await supabase
          .from('empresas')
          .select(`
            IdEmpresa,
            RazonSocial,
            NombreComercial,
            RNC,
            Direccion,
            Telefono,
            Presidente,
            CedulaPresidente,
            Logo,
            Activo
          `)
          .eq('IdEmpresa', userInfo.IdEmpresa)
          .eq('Activo', true)
          .single();

        if (empresaError) {
          throw empresaError;
        }

        // Contar usuarios activos de la empresa
        const { count: usuariosCount, error: usuariosError } = await supabase
          .from('usuarios')
          .select('*', { count: 'exact', head: true })
          .eq('IdEmpresa', userInfo.IdEmpresa)
          .eq('Activo', true);

        if (usuariosError) {
          throw usuariosError;
        }

        // Contar clientes de la empresa
        const { count: clientesCount, error: clientesError } = await supabase
          .from('cuentas')
          .select('*', { count: 'exact', head: true })
          .eq('IdEmpresa', userInfo.IdEmpresa)
          .eq('Activo', true);

        if (clientesError) {
          throw clientesError;
        }

        // Contar préstamos activos
        const { count: prestamosCount, error: prestamosError } = await supabase
          .from('prestamos')
          .select('*', { count: 'exact', head: true })
          .eq('IdEmpresa', userInfo.IdEmpresa)
          .in('IdEstado', [1, 2, 3]); // Estados activos

        if (prestamosError) {
          throw prestamosError;
        }

        setCompanyInfo({
          ...empresaData,
          totalUsuarios: usuariosCount || 0,
          totalClientes: clientesCount || 0,
          totalPrestamos: prestamosCount || 0
        });

      } catch (err) {
        console.error('Error fetching company info:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, [isAuthenticated, userInfo?.IdEmpresa]);

  const refetch = async () => {
    if (isAuthenticated && userInfo?.IdEmpresa) {
      setLoading(true);
      const fetchCompanyInfo = async () => {
        try {
          setError(null);

          const { data: empresaData, error: empresaError } = await supabase
            .from('empresas')
            .select(`
              IdEmpresa,
              RazonSocial,
              NombreComercial,
              RNC,
              Direccion,
              Telefono,
              Presidente,
              CedulaPresidente,
              Logo,
              Activo
            `)
            .eq('IdEmpresa', userInfo.IdEmpresa)
            .eq('Activo', true)
            .single();

          if (empresaError) throw empresaError;

          const { count: usuariosCount, error: usuariosError } = await supabase
            .from('usuarios')
            .select('*', { count: 'exact', head: true })
            .eq('IdEmpresa', userInfo.IdEmpresa)
            .eq('Activo', true);

          if (usuariosError) throw usuariosError;

          const { count: clientesCount, error: clientesError } = await supabase
            .from('cuentas')
            .select('*', { count: 'exact', head: true })
            .eq('IdEmpresa', userInfo.IdEmpresa)
            .eq('Activo', true);

          if (clientesError) throw clientesError;

          const { count: prestamosCount, error: prestamosError } = await supabase
            .from('prestamos')
            .select('*', { count: 'exact', head: true })
            .eq('IdEmpresa', userInfo.IdEmpresa)
            .in('IdEstado', [1, 2, 3]);

          if (prestamosError) throw prestamosError;

          setCompanyInfo({
            ...empresaData,
            totalUsuarios: usuariosCount || 0,
            totalClientes: clientesCount || 0,
            totalPrestamos: prestamosCount || 0
          });

        } catch (err) {
          console.error('Error fetching company info:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      
      await fetchCompanyInfo();
    }
  };

  return {
    companyInfo,
    loading,
    error,
    refetch
  };
};

export default useCompanyInfo;