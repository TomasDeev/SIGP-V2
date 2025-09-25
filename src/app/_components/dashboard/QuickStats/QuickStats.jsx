import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Alert,
  Paper
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
  Assessment as AssessmentIcon,
  BarChart as StatsIcon
} from '@mui/icons-material';
import { supabase } from '../../../_config/supabase';

const StatCard = ({ title, value, icon: Icon, loading }) => {
  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        transition: 'box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666666',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              mb: 2,
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
            }}
          >
            {title}
          </Typography>
          
          {loading ? (
            <Skeleton variant="text" width="60%" height={32} />
          ) : (
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                color: '#1a1a1a',
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
              }}
            >
              {value}
            </Typography>
          )}
        </Box>
        
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1,
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon sx={{ fontSize: 24, color: '#666666' }} />
        </Box>
      </Box>
    </Paper>
  );
};

const QuickStats = ({ userInfo }) => {
  const [stats, setStats] = useState({
    totalPrestamos: 0,
    totalClientes: 0,
    montoTotal: 0,
    prestamosActivos: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userInfo?.empresa?.IdEmpresa) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Obtener estadísticas de préstamos
        const { data: prestamosData, error: prestamosError } = await supabase
          .from('prestamos')
          .select('IdPrestamo, CapitalPrestado, IdEstado')
          .eq('IdEmpresa', userInfo.empresa.IdEmpresa);

        if (prestamosError) throw prestamosError;

        // Obtener estadísticas de clientes
        const { data: clientesData, error: clientesError } = await supabase
          .from('cuentas')
          .select('IdCliente')
          .eq('IdEmpresa', userInfo.empresa.IdEmpresa)
          .eq('Activo', true);

        if (clientesError) throw clientesError;

        // Calcular estadísticas
        const totalPrestamos = prestamosData?.length || 0;
        const totalClientes = clientesData?.length || 0;
        const montoTotal = prestamosData?.reduce((sum, prestamo) => sum + (prestamo.CapitalPrestado || 0), 0) || 0;
        const prestamosActivos = prestamosData?.filter(p => p.IdEstado === 1)?.length || 0;

        setStats({
          totalPrestamos,
          totalClientes,
          montoTotal,
          prestamosActivos
        });

      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userInfo?.empresa?.IdEmpresa]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };



  if (error) {
    return (
      <Box sx={{ mb: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 1 }}>
          Error al cargar las estadísticas: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <StatsIcon sx={{ mr: 2, fontSize: 24, color: '#495057' }} />
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: '#1a1a1a',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
          }}
        >
          Estadísticas del Sistema
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Préstamos"
            value={stats.totalPrestamos.toLocaleString()}
            icon={AccountBalanceIcon}
            loading={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Clientes Activos"
            value={stats.totalClientes.toLocaleString()}
            icon={PeopleIcon}
            loading={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monto Total"
            value={formatCurrency(stats.montoTotal)}
            icon={TrendingUpIcon}
            loading={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Préstamos Activos"
            value={stats.prestamosActivos.toLocaleString()}
            icon={AssessmentIcon}
            loading={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuickStats;