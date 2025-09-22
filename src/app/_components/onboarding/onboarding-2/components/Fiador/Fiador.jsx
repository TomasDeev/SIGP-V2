import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Person,
  Badge,
  Phone,
  LocationOn
} from '@mui/icons-material';
import { JumboCard } from '@jumbo/components';
import { OnboardingAction } from '@app/_components/onboarding/common';

const Fiador = () => {
  const [fiadorData, setFiadorData] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    direccion: ''
  });

  const handleInputChange = (field, value) => {
    setFiadorData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <JumboCard
      title="Paso 3: Fiador"
      sx={{ mb: 3 }}
    >
      <Box sx={{ p: 4 }}>
        {/* 4.1 Fiador */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, fontSize: '1.1rem' }}>
            4.1 Fiador
          </Typography>

          <Grid container spacing={3}>
            {/* Primera fila */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={fiadorData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiInputBase-input': { 
                    fontSize: '0.9rem',
                    fontWeight: 400
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cédula"
                value={fiadorData.cedula}
                onChange={(e) => handleInputChange('cedula', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiInputBase-input': { 
                    fontSize: '0.9rem',
                    fontWeight: 400
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }
                }}
              />
            </Grid>

            {/* Segunda fila */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={fiadorData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiInputBase-input': { 
                    fontSize: '0.9rem',
                    fontWeight: 400
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dirección"
                value={fiadorData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiInputBase-input': { 
                    fontSize: '0.9rem',
                    fontWeight: 400
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Botones de navegación */}
        <OnboardingAction />
      </Box>
    </JumboCard>
  );
};

export default Fiador;