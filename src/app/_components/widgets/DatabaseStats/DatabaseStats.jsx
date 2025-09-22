import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  AccountBalance as LoanIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useEmpresas, useUsuarios, usePrestamos, useSucursales } from "@app/_hooks/useSupabaseData";

const StatCard = ({ title, value, icon, color = 'primary', loading = false, error = null }) => {
  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            {loading ? (
              <CircularProgress size={24} />
            ) : error ? (
              <Typography variant="h6" color="error">
                Error
              </Typography>
            ) : (
              <Typography variant="h4" component="h2">
                {value}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { 
              sx: { color: `${color}.main`, fontSize: 32 } 
            })}
          </Box>
        </Box>
        {error && (
          <Typography variant="caption" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const DatabaseStats = () => {
  const { 
    data: empresas, 
    loading: loadingEmpresas, 
    error: errorEmpresas,
    stats: statsEmpresas 
  } = useEmpresas();
  
  const { 
    data: usuarios, 
    loading: loadingUsuarios, 
    error: errorUsuarios,
    stats: statsUsuarios 
  } = useUsuarios();
  
  const { 
    data: prestamos, 
    loading: loadingPrestamos, 
    error: errorPrestamos,
    stats: statsPrestamos 
  } = usePrestamos();

  const { 
    data: sucursales, 
    loading: loadingSucursales, 
    error: errorSucursales 
  } = useSucursales();

  const [summary, setSummary] = useState({
    totalEmpresas: 0,
    empresasActivas: 0,
    totalUsuarios: 0,
    totalPrestamos: 0,
    totalSucursales: 0,
    sucursalesActivas: 0,
  });

  useEffect(() => {
    // Calcular estadísticas cuando los datos cambien
    const totalEmpresas = empresas?.length || 0;
    const empresasActivas = empresas?.filter(emp => emp.Activo)?.length || 0;
    const totalUsuarios = usuarios?.length || 0;
    const totalPrestamos = prestamos?.length || 0;
    const totalSucursales = sucursales?.length || 0;
    const sucursalesActivas = sucursales?.filter(suc => suc.Activo)?.length || 0;

    setSummary({
      totalEmpresas,
      empresasActivas,
      totalUsuarios,
      totalPrestamos,
      totalSucursales,
      sucursalesActivas,
    });
  }, [empresas, usuarios, prestamos, sucursales]);

  const isLoading = loadingEmpresas || loadingUsuarios || loadingPrestamos || loadingSucursales;
  const hasError = errorEmpresas || errorUsuarios || errorPrestamos || errorSucursales;

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Estadísticas del Sistema
      </Typography>
      
      {hasError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Algunos datos no pudieron cargarse. Mostrando información disponible.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Empresas"
            value={summary.totalEmpresas}
            icon={<BusinessIcon />}
            color="primary"
            loading={loadingEmpresas}
            error={errorEmpresas}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Empresas Activas"
            value={summary.empresasActivas}
            icon={<TrendingUpIcon />}
            color="success"
            loading={loadingEmpresas}
            error={errorEmpresas}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Usuarios"
            value={summary.totalUsuarios}
            icon={<PeopleIcon />}
            color="info"
            loading={loadingUsuarios}
            error={errorUsuarios}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Préstamos"
            value={summary.totalPrestamos}
            icon={<LoanIcon />}
            color="warning"
            loading={loadingPrestamos}
            error={errorPrestamos}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sucursales"
            value={summary.totalSucursales}
            icon={<BusinessIcon />}
            color="info"
            loading={loadingSucursales}
            error={errorSucursales}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sucursales Activas"
            value={summary.sucursalesActivas}
            icon={<TrendingUpIcon />}
            color="success"
            loading={loadingSucursales}
            error={errorSucursales}
          />
        </Grid>
      </Grid>

      {/* Estadísticas adicionales si están disponibles */}
      {(statsEmpresas || statsUsuarios || statsPrestamos) && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Estadísticas Detalladas
          </Typography>
          <Grid container spacing={2}>
            {statsEmpresas && Object.keys(statsEmpresas).length > 0 && (
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Empresas por Estado
                    </Typography>
                    {Object.entries(statsEmpresas).map(([key, value]) => (
                      <Box key={key} display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">{key}:</Typography>
                        <Chip label={value} size="small" />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            )}
            
            {statsUsuarios && Object.keys(statsUsuarios).length > 0 && (
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Usuarios por Tipo
                    </Typography>
                    {Object.entries(statsUsuarios).map(([key, value]) => (
                      <Box key={key} display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">{key}:</Typography>
                        <Chip label={value} size="small" />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            )}
            
            {statsPrestamos && Object.keys(statsPrestamos).length > 0 && (
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Préstamos por Estado
                    </Typography>
                    {Object.entries(statsPrestamos).map(([key, value]) => (
                      <Box key={key} display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">{key}:</Typography>
                        <Chip label={value} size="small" />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {isLoading && (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
          <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }}>
            Cargando estadísticas...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DatabaseStats;