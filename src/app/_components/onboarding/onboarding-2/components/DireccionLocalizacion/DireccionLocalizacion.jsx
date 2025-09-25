import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  InputAdornment
} from '@mui/material';
import {
  LocationOn,
  Map,
  Place,
  Flag,
  LocationCity,
  Business,
  Info
} from '@mui/icons-material';
import { JumboCard } from '@jumbo/components';
import { OnboardingAction } from '@app/_components/onboarding/common';
import { useOnboardingData } from '../../context/OnboardingDataContext';

const DireccionLocalizacion = () => {
  // Hook para el contexto global de onboarding
  const { onboardingData, updateOnboardingData } = useOnboardingData();

  const [direccion, setDireccion] = useState({
    calle: '',
    subsector: '',
    sector: '',
    pais: '',
    provincia: '',
    municipio: '',
    referenciaUbicacion: ''
  });

  // Efecto para cargar datos del contexto global
  useEffect(() => {
    if (onboardingData.direccionLocalizacion) {
      setDireccion(onboardingData.direccionLocalizacion);
    }
  }, [onboardingData.direccionLocalizacion]);

  const handleInputChange = (field, value) => {
    const newDireccion = { ...direccion, [field]: value };
    setDireccion(newDireccion);
    updateOnboardingData({
      direccionLocalizacion: newDireccion
    });
  };

  return (
    <JumboCard
      title="Paso 5: Dirección y Localización"
      sx={{ mb: 3 }}
    >
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
          6.1 Dirección y localización
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Calle"
              value={direccion.calle}
              onChange={(e) => handleInputChange('calle', e.target.value)}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Subsector"
              value={direccion.subsector}
              onChange={(e) => handleInputChange('subsector', e.target.value)}
              InputProps={{
                startAdornment: <Map sx={{ mr: 1, color: 'action.active' }} />
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Sector"
              value={direccion.sector}
              onChange={(e) => handleInputChange('sector', e.target.value)}
              InputProps={{
                startAdornment: <Place sx={{ mr: 1, color: 'action.active' }} />
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="País"
              value={direccion.pais}
              onChange={(e) => handleInputChange('pais', e.target.value)}
              InputProps={{
                startAdornment: <Flag sx={{ mr: 1, color: 'action.active' }} />
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Provincia"
              value={direccion.provincia}
              onChange={(e) => handleInputChange('provincia', e.target.value)}
              InputProps={{
                startAdornment: <LocationCity sx={{ mr: 1, color: 'action.active' }} />
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Municipio"
              value={direccion.municipio}
              onChange={(e) => handleInputChange('municipio', e.target.value)}
              InputProps={{
                startAdornment: <Business sx={{ mr: 1, color: 'action.active' }} />
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Referencia ubicación"
              value={direccion.referenciaUbicacion}
              onChange={(e) => handleInputChange('referenciaUbicacion', e.target.value)}
              multiline
              rows={3}
              InputProps={{
                startAdornment: <Info sx={{ mr: 1, color: 'action.active', alignSelf: 'flex-start', mt: 1 }} />
              }}
              variant="outlined"
            />
          </Grid>
        </Grid>
        {/* Botones de navegación */}
        <OnboardingAction />
      </Box>
    </JumboCard>
  );
};

export default DireccionLocalizacion;