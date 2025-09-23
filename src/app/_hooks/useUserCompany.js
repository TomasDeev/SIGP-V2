import { useState, useEffect } from 'react';
import { useAuth } from '../_components/_core/AuthProvider/hooks';
import { supabase } from '../_config/supabase';

/**
 * Hook personalizado para obtener los datos de la empresa del usuario autenticado
 * Incluye los valores por defecto para la calculadora de préstamos
 */
export const useUserCompany = () => {
  const { user, isAuthenticated } = useAuth();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setCompanyData(null);
      return;
    }

    const fetchUserCompany = async () => {
      try {
        setLoading(true);
        setError(null);

        // Como es un usuario admin, buscar cualquier empresa activa
        const { data: empresas, error: empresasError } = await supabase
          .from('empresas')
          .select(`
            "IdEmpresa",
            "NombreComercial",
            "RazonSocial",
            "RNC",
            "Telefono",
            "Direccion",
            "Activo",
            "Tasa",
            "Cuotas", 
            "GastoCierre",
            "Mora"
          `)
          .eq('"Activo"', true)
          .limit(1)
          .single();

        if (empresasError) {
          console.error('Error fetching company data:', empresasError);
          setError('No se pudo obtener la información de la empresa');
          return;
        }

        if (empresas) {
          // Mapear los datos de la empresa a un formato más amigable
          const mappedCompanyData = {
            id: empresas.IdEmpresa,
            commercialName: empresas.NombreComercial,
            businessName: empresas.RazonSocial,
            rnc: empresas.RNC,
            phone: empresas.Telefono,
            address: empresas.Direccion,
            status: empresas.Activo ? 'Activa' : 'Inactiva',
            // Valores por defecto para la calculadora
            defaults: {
              interestRate: parseFloat(empresas.Tasa) || 2.5,
              installments: parseInt(empresas.Cuotas) || 12,
              closingCosts: parseFloat(empresas.GastoCierre) || 10,
              lateFee: parseFloat(empresas.Mora) || 5
            }
          };

          setCompanyData(mappedCompanyData);
        } else {
          setError('No se encontró una empresa asignada al usuario');
        }

      } catch (err) {
        console.error('Error in fetchUserCompany:', err);
        setError('Error al obtener los datos de la empresa');
      } finally {
        setLoading(false);
      }
    };

    fetchUserCompany();
  }, [user, isAuthenticated]);

  // Función para obtener solo los valores por defecto
  const getDefaults = () => {
    if (!companyData || !companyData.defaults) {
      return {
        interestRate: 2.5,
        installments: 12,
        closingCosts: 10,
        lateFee: 5
      };
    }
    return companyData.defaults;
  };

  // Función para refrescar los datos de la empresa
  const refreshCompanyData = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      setLoading(true);
      setError(null);

      // Como es un usuario admin, buscar cualquier empresa activa
      const { data: empresas, error: empresasError } = await supabase
        .from('empresas')
        .select(`
          "IdEmpresa",
          "NombreComercial",
          "RazonSocial",
          "RNC",
          "Telefono",
          "Direccion",
          "Activo",
          "Tasa",
          "Cuotas", 
          "GastoCierre",
          "Mora"
        `)
        .eq('"Activo"', true)
        .limit(1)
        .single();

      if (!empresasError && empresas) {
        const mappedCompanyData = {
          id: empresas.IdEmpresa,
          commercialName: empresas.NombreComercial,
          businessName: empresas.RazonSocial,
          rnc: empresas.RNC,
          phone: empresas.Telefono,
          address: empresas.Direccion,
          status: empresas.Activo ? 'Activa' : 'Inactiva',
          defaults: {
            interestRate: parseFloat(empresas.Tasa) || 2.5,
            installments: parseInt(empresas.Cuotas) || 12,
            closingCosts: parseFloat(empresas.GastoCierre) || 10,
            lateFee: parseFloat(empresas.Mora) || 5
          }
        };
        setCompanyData(mappedCompanyData);
      }
    } catch (err) {
      console.error('Error refreshing company data:', err);
      setError('Error al actualizar los datos de la empresa');
    } finally {
      setLoading(false);
    }
  };

  return {
    companyData,
    loading,
    error,
    getDefaults,
    refreshCompanyData,
    hasCompany: !!companyData
  };
};