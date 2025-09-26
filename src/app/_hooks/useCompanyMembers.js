import { useState, useEffect } from 'react';
import { supabase } from '../_config/supabase';
import useAuthenticatedUser from './useAuthenticatedUser';

const useCompanyMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo, isAuthenticated } = useAuthenticatedUser();

  useEffect(() => {
    const fetchCompanyMembers = async () => {
      if (!isAuthenticated || !userInfo?.IdEmpresa) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Obtener usuarios de la empresa
        const { data: usuariosData, error: usuariosError } = await supabase
          .from('usuarios')
          .select(`
            IdUsuario,
            NombreUsuario,
            Nombres,
            Apellidos,
            Email,
            Telefono,
            Activo,
            FechaCreacion,
            IdSucursal
          `)
          .eq('IdEmpresa', userInfo.IdEmpresa)
          .eq('Activo', true)
          .order('FechaCreacion', { ascending: false });

        if (usuariosError) {
          throw usuariosError;
        }

        // Mapear los datos para incluir información adicional
        const membersWithRoles = usuariosData.map(usuario => {
          // Determinar el rol basado en el email, nombre de usuario o información disponible
          let role = 'Miembro del Equipo';
          
          if (usuario.Email?.includes('admin') || usuario.NombreUsuario?.includes('admin')) {
            role = 'Administrador';
          } else if (usuario.Email?.includes('gerente') || usuario.NombreUsuario?.includes('gerente')) {
            role = 'Gerente';
          } else if (usuario.Email?.includes('analista') || usuario.NombreUsuario?.includes('analista')) {
            role = 'Analista';
          } else if (usuario.Email?.includes('cobrador') || usuario.Email?.includes('cobranza')) {
            role = 'Especialista en Cobranza';
          } else if (usuario.Email?.includes('tecnico') || usuario.NombreUsuario?.includes('tecnico')) {
            role = 'Técnico';
          }

          return {
            id: usuario.IdUsuario,
            name: `${usuario.Nombres} ${usuario.Apellidos}`.trim(),
            role: role,
            email: usuario.Email,
            telefono: usuario.Telefono,
            fechaCreacion: usuario.FechaCreacion,
            avatar: `/assets/images/avatar/avatar${(usuario.IdUsuario % 10) + 1}.jpg`, // Avatar dinámico
            initials: `${usuario.Nombres?.charAt(0) || ''}${usuario.Apellidos?.charAt(0) || ''}`.toUpperCase()
          };
        });

        setMembers(membersWithRoles);

      } catch (err) {
        console.error('Error fetching company members:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyMembers();
  }, [isAuthenticated, userInfo?.IdEmpresa]);

  return {
    members,
    loading,
    error,
    refetch: () => {
      if (isAuthenticated && userInfo?.IdEmpresa) {
        setLoading(true);
        fetchCompanyMembers();
      }
    }
  };
};

export default useCompanyMembers;