import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  People,
  Badge,
  Person,
  PersonOutline,
  Cake,
  Wc,
  Phone,
  PhoneAndroid,
  Work,
  LocationOn
} from '@mui/icons-material';
import { JumboCard } from '@jumbo/components';
import { OnboardingAction } from '@app/_components/onboarding/common';
import { useOnboardingData } from '../../context/OnboardingDataContext';

const DatosConyuge = () => {
  const { onboardingData, updateSection } = useOnboardingData();
  const [datosConyuge, setDatosConyuge] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    fechaNacimiento: '',
    sexo: '',
    nombre: '',
    identificacion: '',
    telefonoTrabajo: '',
    celular: '',
    lugarTrabajo: '',
    direccionTrabajo: ''
  });

  // Cargar datos del contexto al montar el componente
  useEffect(() => {
    if (onboardingData.datosConyuge) {
      setDatosConyuge(onboardingData.datosConyuge);
    }
  }, [onboardingData.datosConyuge]);

  const handleInputChange = (field, value) => {
    const newData = { ...datosConyuge, [field]: value };
    setDatosConyuge(newData);
    updateSection('datosConyuge', newData);
  };

  return (
    <JumboCard
      title="Paso 6: Datos del Cónyuge"
      sx={{ mb: 3 }}
    >
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <People sx={{ mr: 1, color: 'primary.main' }} />
          7.1 Datos del cónyuge
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre"
              value={datosConyuge.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Identificación"
              value={datosConyuge.identificacion}
              onChange={(e) => handleInputChange('identificacion', e.target.value)}
              InputProps={{
                startAdornment: <Badge sx={{ mr: 1, color: 'action.active' }} />
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Teléfono trabajo"
              value={datosConyuge.telefonoTrabajo}
              onChange={(e) => handleInputChange('telefonoTrabajo', e.target.value)}
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Celular"
              value={datosConyuge.celular}
              onChange={(e) => handleInputChange('celular', e.target.value)}
              InputProps={{
                startAdornment: <PhoneAndroid sx={{ mr: 1, color: 'action.active' }} />
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Lugar trabajo"
              value={datosConyuge.lugarTrabajo}
              onChange={(e) => handleInputChange('lugarTrabajo', e.target.value)}
              InputProps={{
                startAdornment: <Work sx={{ mr: 1, color: 'action.active' }} />
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Dirección trabajo"
              value={datosConyuge.direccionTrabajo}
              onChange={(e) => handleInputChange('direccionTrabajo', e.target.value)}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />
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

export default DatosConyuge;