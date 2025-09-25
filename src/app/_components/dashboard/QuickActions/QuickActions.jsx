import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  AccountBalance as LoanIcon,
  Assessment as ReportIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Payment as PaymentIcon,
  Apps as ActionsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ActionCard = ({ title, description, icon: Icon, onClick }) => {
  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          borderColor: '#1976d2'
        }
      }}
      onClick={onClick}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1,
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2
          }}
        >
          <Icon sx={{ fontSize: 24, color: '#666666' }} />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: '#1a1a1a',
              mb: 1,
              lineHeight: 1.3,
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
            }}
          >
            {title}
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666666',
              lineHeight: 1.5,
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Nuevo Préstamo',
      description: 'Crear un nuevo préstamo para un cliente',
      icon: AddIcon,
      onClick: () => navigate('/prestamos/nuevo')
    },
    {
      title: 'Gestionar Clientes',
      description: 'Ver y administrar información de clientes',
      icon: PeopleIcon,
      onClick: () => navigate('/clientes')
    },
    {
      title: 'Buscar Préstamo',
      description: 'Buscar y consultar préstamos existentes',
      icon: SearchIcon,
      onClick: () => navigate('/prestamos/buscar')
    },
    {
      title: 'Procesar Pago',
      description: 'Registrar pagos de cuotas de préstamos',
      icon: PaymentIcon,
      onClick: () => navigate('/pagos')
    },
    {
      title: 'Reportes',
      description: 'Generar reportes y estadísticas',
      icon: ReportIcon,
      onClick: () => navigate('/reportes')
    },
    {
      title: 'Configuración',
      description: 'Ajustar configuraciones del sistema',
      icon: SettingsIcon,
      onClick: () => navigate('/configuracion')
    }
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ActionsIcon sx={{ mr: 2, fontSize: 24, color: '#495057' }} />
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: '#1a1a1a',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
          }}
        >
          Acciones Rápidas
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {actions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ActionCard {...action} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuickActions;