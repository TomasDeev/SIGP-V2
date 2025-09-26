import { useState, useEffect } from 'react';
import { supabase } from '../_config/supabase';
import useAuthenticatedUser from './useAuthenticatedUser';

export const useBranchCollaborators = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { userInfo, isAuthenticated } = useAuthenticatedUser();

  useEffect(() => {
    const fetchBranchCollaborators = async () => {
      if (!isAuthenticated || !userInfo?.usuario?.IdSucursal || !userInfo?.usuario?.IdEmpresa) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Obtener todos los usuarios de la misma sucursal y empresa
        const { data, error: queryError } = await supabase
          .from('usuarios')
          .select(`
            IdUsuario,
            NombreUsuario,
            Nombres,
            Apellidos,
            Email,
            IdEmpresa,
            IdSucursal,
            Activo
          `)
          .eq('IdSucursal', userInfo.usuario.IdSucursal)
          .eq('IdEmpresa', userInfo.usuario.IdEmpresa)
          .eq('Activo', true)
          .order('Nombres', { ascending: true });

        if (queryError) {
          throw queryError;
        }

        setCollaborators(data || []);
      } catch (err) {
        console.error('Error fetching branch collaborators:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBranchCollaborators();
  }, [isAuthenticated, userInfo?.usuario?.IdSucursal, userInfo?.usuario?.IdEmpresa]);

  return {
    collaborators,
    loading,
    error,
    totalCollaborators: collaborators.length
  };
};