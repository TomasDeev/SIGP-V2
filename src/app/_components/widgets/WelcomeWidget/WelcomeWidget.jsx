import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Skeleton,
  Alert,
  Button
} from '@mui/material';
import {
  WavingHand,
  Business,
  LocationOn,
  Person,
  Schedule
} from '@mui/icons-material';

// Tema azul de la empresa
const blueTheme = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    gradient: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
  },
  secondary: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#0d47a1'
  },
  accent: {
    orange: '#ff9800',
    green: '#4caf50',
    purple: '#9c27b0',
    cyan: '#00bcd4'
  },
  background: {
    main: '#f5f7fa',
    paper: '#ffffff',
    light: '#fafbfc',
  },
  text: {
    primary: '#2c3e50',
    secondary: '#7b8794',
    light: '#a0aec0',
  }
};

const WelcomeWidget = ({ userInfo, loading, error }) => {
  // Función para obtener el saludo según la hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  // Función para formatear la fecha actual
  const getCurrentDate = () => {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return (
      <Card 
        sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          mb: 4,
          background: blueTheme.primary.gradient,
          color: 'white'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Skeleton variant="circular" width={80} height={80} />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="80%" height={24} />
              <Skeleton variant="text" width="40%" height={20} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <CardContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              ¡Bienvenido al Sistema SIGP!
            </Typography>
            <Typography variant="body2">
              Para acceder a todas las funcionalidades, por favor inicia sesión.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                href="/auth/login-1"
                sx={{ mr: 1 }}
              >
                Iniciar Sesión
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                href="/auth/signup-1"
              >
                Registrarse
              </Button>
            </Box>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!userInfo) {
    return (
      <Alert severity="warning" sx={{ mb: 4 }}>
        No se pudo cargar la información del usuario
      </Alert>
    );
  }

  const { usuario, empresa, sucursal, displayName } = userInfo;

  return (
    <Card 
      sx={{ 
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
        mb: 4,
        background: blueTheme.primary.gradient,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          transform: 'translate(50%, -50%)'
        }
      }}
    >
      <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          {/* Avatar del usuario */}
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            {displayName ? displayName.charAt(0).toUpperCase() : <Person />}
          </Avatar>

          {/* Información principal */}
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <WavingHand sx={{ fontSize: '1.5rem', color: '#FFD700' }} />
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {getGreeting()}
              </Typography>
            </Box>
            
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                color: 'white',
                mb: 1,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              {displayName}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Schedule sx={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)' }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  textTransform: 'capitalize'
                }}
              >
                {getCurrentDate()}
              </Typography>
            </Box>

            {/* Información de empresa y sucursal */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {empresa && (
                <Chip
                  icon={<Business sx={{ color: 'white !important' }} />}
                  label={empresa.NombreComercial || empresa.RazonSocial}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
              )}
              
              {sucursal && (
                <Chip
                  icon={<LocationOn sx={{ color: 'white !important' }} />}
                  label={sucursal.Nombre}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Mensaje de bienvenida personalizado */}
        <Box 
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            p: 2,
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.95)',
              fontWeight: 500,
              lineHeight: 1.6
            }}
          >
            Bienvenido al Sistema Integrado de Gestión de Préstamos (SIGP). 
            {empresa && ` Estás conectado a ${empresa.NombreComercial || empresa.RazonSocial}`}
            {sucursal && ` en la sucursal ${sucursal.Nombre}`}.
            {!empresa && !sucursal && ' Tu perfil está configurado correctamente.'}
          </Typography>
        </Box>

        {/* Información adicional si está disponible */}
        {usuario && (
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {usuario.NombreUsuario && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1
                }}
              >
                Usuario: {usuario.NombreUsuario}
              </Typography>
            )}
            
            {usuario.Email && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1
                }}
              >
                {usuario.Email}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WelcomeWidget;