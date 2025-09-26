import { useState, useEffect } from 'react';
import { useAuth } from '@app/_components/_core/AuthProvider/hooks';
import { getCookie } from '@jumbo/utilities/cookies';
import { UsuariosService } from '@app/_services/usuariosService';
import { supabase } from '@app/_config/supabase';

/**
 * Hook personalizado para obtener información completa del usuario autenticado
 * Incluye datos del usuario, empresa y sucursal asociada
 */
const useAuthenticatedUser = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserFromCookie = () => {
    try {
      const authUserSr = getCookie("auth-user");
      if (authUserSr) {
        const decoded = decodeURIComponent(authUserSr);
        return JSON.parse(decoded);
      }
      return null;
    } catch (error) {
      console.error('Error parsing auth cookie:', error);
      return null;
    }
  };

  const fetchUserCompleteInfo = async (authUser) => {
    try {
      setLoading(true);
      setError(null);

      // Buscar el usuario en la tabla usuarios por UserId (auth.users.id)
      const { data: usuarios, error: usuariosError } = await supabase
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
        .eq('UserId', authUser.userId)
        .single();

      if (usuariosError) {
        console.error('Error obteniendo usuario:', usuariosError);
        // Si no se encuentra el usuario en la tabla, usar datos básicos del auth
        setUserInfo({
          authUser: {
            id: authUser.userId,
            email: authUser.email,
            user_metadata: authUser.userMeta
          },
          usuario: null,
          empresa: null,
          sucursal: null,
          displayName: authUser.email,
          isComplete: false
        });
        return;
      }

      let empresa = null;
      let sucursal = null;

      // Obtener información de la empresa si existe
      if (usuarios.IdEmpresa) {
        const { data: empresaData, error: empresaError } = await supabase
          .from('empresas')
          .select(`
            IdEmpresa,
            RazonSocial,
            NombreComercial,
            RNC,
            Direccion,
            Telefono,
            Logo
          `)
          .eq('IdEmpresa', usuarios.IdEmpresa)
          .single();

        if (!empresaError) {
          empresa = empresaData;
        }
      }

      // Obtener información de la sucursal si existe
      if (usuarios.IdSucursal) {
        const { data: sucursalData, error: sucursalError } = await supabase
          .from('sucursales')
          .select(`
            IdSucursal,
            Nombre,
            Codigo,
            Direccion,
            Telefono,
            Email,
            Gerente
          `)
          .eq('IdSucursal', usuarios.IdSucursal)
          .single();

        if (!sucursalError) {
          sucursal = sucursalData;
        }
      }

      // Construir el objeto completo de información del usuario
      const completeUserInfo = {
        authUser: {
          id: authUser.userId,
          email: authUser.email,
          user_metadata: authUser.userMeta
        },
        usuario: usuarios,
        empresa: empresa,
        sucursal: sucursal,
        displayName: `${usuarios.Nombres} ${usuarios.Apellidos}`.trim() || usuarios.NombreUsuario || authUser.email,
        isComplete: true
      };

      setUserInfo(completeUserInfo);

    } catch (error) {
      console.error('Error fetching complete user info:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        const authUser = getUserFromCookie();
        if (authUser) {
          fetchUserCompleteInfo(authUser);
        } else {
          setLoading(false);
          setError('No se pudo obtener información de autenticación');
        }
      } else {
        setUserInfo(null);
        setLoading(false);
      }
    }
  }, [isAuthenticated, authLoading]);

  const refreshUserInfo = async () => {
    if (isAuthenticated) {
      const authUser = getUserFromCookie();
      if (authUser) {
        await fetchUserCompleteInfo(authUser);
      }
    }
  };

  return {
    userInfo,
    loading: loading || authLoading,
    error,
    isAuthenticated,
    refreshUserInfo
  };
};

export default useAuthenticatedUser;