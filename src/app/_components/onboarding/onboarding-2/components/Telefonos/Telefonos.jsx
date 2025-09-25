import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Button
} from '@mui/material';
import {
  Phone,
  PhoneAndroid,
  Business,
  LocationOn,
  Home,
  Delete,
  Add
} from '@mui/icons-material';
import { JumboCard } from '@jumbo/components';
import { OnboardingAction } from '@app/_components/onboarding/common';
import { useOnboardingData } from '../../context/OnboardingDataContext';

const Telefonos = () => {
  // Hook para el contexto global de onboarding
  const { onboardingData, updateOnboardingData } = useOnboardingData();

  const [telefonos, setTelefonos] = useState([
    {
      numero: '',
      tipo: '',
      residencia: ''
    }
  ]);

  // Efecto para cargar datos del contexto global
  useEffect(() => {
    if (onboardingData.telefonos && onboardingData.telefonos.length > 0) {
      setTelefonos(onboardingData.telefonos);
    }
  }, [onboardingData.telefonos]);

  // Función para actualizar el contexto global
  const updateContext = (newTelefonos) => {
    updateOnboardingData({
      telefonos: newTelefonos
    });
  };

  const handleTelefonoChange = (index, field, value) => {
    const newTelefonos = [...telefonos];
    newTelefonos[index][field] = value;
    setTelefonos(newTelefonos);
    updateContext(newTelefonos);
  };

  const addTelefono = () => {
    const newTelefonos = [...telefonos, { numero: '', tipo: '', residencia: '' }];
    setTelefonos(newTelefonos);
    updateContext(newTelefonos);
  };

  const removeTelefono = (index) => {
    if (telefonos.length > 1) {
      const newTelefonos = telefonos.filter((_, i) => i !== index);
      setTelefonos(newTelefonos);
      updateContext(newTelefonos);
    }
  };

  return (
    <JumboCard
      title="Paso 7: Teléfonos"
      sx={{ mb: 3 }}
    >
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Phone sx={{ mr: 1, color: 'primary.main' }} />
          8.1 Teléfonos
        </Typography>

        {telefonos.map((telefono, index) => (
          <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                Teléfono {index + 1}
              </Typography>
              {telefonos.length > 1 && (
                <IconButton 
                  onClick={() => removeTelefono(index)}
                  color="error"
                  size="small"
                >
                  <Delete />
                </IconButton>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Número"
                  value={telefono.numero}
                  onChange={(e) => handleTelefonoChange(index, 'numero', e.target.value)}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                  }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={telefono.tipo}
                    onChange={(e) => handleTelefonoChange(index, 'tipo', e.target.value)}
                    label="Tipo"
                  >
                    <MenuItem value="Residencia">Residencia</MenuItem>
                    <MenuItem value="Trabajo">Trabajo</MenuItem>
                    <MenuItem value="Celular">Celular</MenuItem>
                    <MenuItem value="Otro">Otro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Residencia"
                  value={telefono.residencia}
                  onChange={(e) => handleTelefonoChange(index, 'residencia', e.target.value)}
                  InputProps={{
                    startAdornment: <Home sx={{ mr: 1, color: 'action.active' }} />
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addTelefono}
            sx={{ minWidth: 200 }}
          >
            Agregar teléfono
          </Button>
        </Box>

        {/* Botones de navegación */}
        <OnboardingAction />
      </Box>
    </JumboCard>
  );
};

export default Telefonos;