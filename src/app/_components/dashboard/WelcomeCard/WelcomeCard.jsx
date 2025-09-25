import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Skeleton,
  Alert,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';

const WelcomeCard = ({ userInfo, loading, error }) => {
  if (error) {
    return (
      <Box sx={{ mb: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 1 }}>
          Error al cargar la información del usuario: {error}
        </Alert>
      </Box>
    );
  }

  const getDisplayName = () => {
    if (userInfo?.displayName) return userInfo.displayName;
    if (userInfo?.usuario?.Nombres && userInfo?.usuario?.Apellidos) {
      return `${userInfo.usuario.Nombres} ${userInfo.usuario.Apellidos}`;
    }
    if (userInfo?.authUser?.email) return userInfo.authUser.email;
    return 'Usuario';
  };

  const getCompanyName = () => {
    return userInfo?.empresa?.NombreComercial || userInfo?.empresa?.RazonSocial || 'Empresa no asignada';
  };

  const getBranchName = () => {
    return userInfo?.sucursal?.Nombre || 'Sucursal no asignada';
  };
  return (
    <Card 
      sx={{ 
        mb: 4,
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccountIcon sx={{ fontSize: 28, mr: 2, color: '#1976d2' }} />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: '#1a1a1a',
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                }}
              >
                Panel de Control
              </Typography>
            </Box>
            
            {loading ? (
              <Box>
                <Skeleton variant="text" width="60%" height={28} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
            ) : (
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 1, 
                    fontWeight: 500,
                    color: '#333333',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                  }}
                >
                  {getDisplayName()}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#666666',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                  }}
                >
                  Sistema Integral de Gestión de Préstamos
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#888888',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  fontWeight: 500,
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                }}
              >
                {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: '#e0e0e0' }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 3, 
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: 1,
                boxShadow: 'none'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon sx={{ mr: 1.5, fontSize: 20, color: '#495057' }} />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#495057',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                  }}
                >
                  Empresa
                </Typography>
              </Box>
              {loading ? (
                <Skeleton variant="text" width="80%" />
              ) : (
                <Typography 
                  variant="body1"
                  sx={{ 
                    color: '#212529',
                    fontWeight: 500,
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                  }}
                >
                  {getCompanyName()}
                </Typography>
              )}
              {userInfo?.empresa?.RNC && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#6c757d',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                  }}
                >
                  RNC: {userInfo.empresa.RNC}
                </Typography>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 3, 
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: 1,
                boxShadow: 'none'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationIcon sx={{ mr: 1.5, fontSize: 20, color: '#495057' }} />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#495057',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                  }}
                >
                  Sucursal
                </Typography>
              </Box>
              {loading ? (
                <Skeleton variant="text" width="70%" />
              ) : (
                <Typography 
                  variant="body1"
                  sx={{ 
                    color: '#212529',
                    fontWeight: 500,
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                  }}
                >
                  {getBranchName()}
                </Typography>
              )}
              {userInfo?.sucursal?.Codigo && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#6c757d',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                  }}
                >
                  Código: {userInfo.sucursal.Codigo}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;