import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  InputAdornment
} from '@mui/material';
import {
  DirectionsCar,
  Home,
  Construction,
  Business
} from '@mui/icons-material';
import { JumboCard } from '@jumbo/components';
import { OnboardingAction } from '@app/_components/onboarding/common';
import { useOnboardingData } from '../../context/OnboardingDataContext';

const Guarantee = () => {
  const { updateOnboardingData, getOnboardingData } = useOnboardingData();
  const [guaranteeData, setGuaranteeData] = useState({
    type: 'vehiculo', // vehiculo, hipoteca, personal, comercial
    vehicleType: '',
    marca: '',
    modelo: '',
    año: '',
    color: '',
    placa: '',
    numeroChasis: '',
    numeroMotor: '',
    cantidadPasajeros: '',
    numeroMatricula: '',
    fechaMatricula: '',
    valorComercial: '',
    valorGarantia: ''
  });

  // Cargar datos existentes al iniciar
  useEffect(() => {
    const savedData = getOnboardingData('garantia');
    if (savedData && Object.keys(savedData).length > 0) {
      setGuaranteeData(prev => ({ ...prev, ...savedData }));
    }
  }, [getOnboardingData]);

  const handleGuaranteeTypeChange = (event, newType) => {
    if (newType !== null) {
      const updatedData = { ...guaranteeData, type: newType };
      setGuaranteeData(updatedData);
      updateOnboardingData('garantia', updatedData);
    }
  };

  const handleInputChange = (field, value) => {
    const updatedData = { ...guaranteeData, [field]: value };
    setGuaranteeData(updatedData);
    updateOnboardingData('garantia', updatedData);
  };

  // Función para validar los campos del formulario
  const validateFields = () => {
    // Implementar validación según el tipo de garantía
    if (guaranteeData.type === 'vehiculo') {
      return !!guaranteeData.vehicleType && !!guaranteeData.marca && !!guaranteeData.modelo;
    }
    return !!guaranteeData.valorGarantia;
  };

  return (
    <JumboCard
      title="Paso 2: Garantía"
      sx={{ mb: 3 }}
    >
      <Box sx={{ p: 4 }}>
        {/* 2.1 Datos de la garantía */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, fontSize: '1.1rem' }}>
            2.1 Datos de la garantía
          </Typography>

          {/* Tipo de garantía */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 2.5, fontWeight: 500, fontSize: '0.9rem' }}>
              Tipo garantía
            </Typography>
            <Grid container spacing={2}>
              {[
                { value: 'vehiculo', label: 'Vehículo', icon: DirectionsCar },
                { value: 'inmueble', label: 'Inmueble', icon: Home },
                { value: 'maquinaria', label: 'Maquinaria', icon: Construction },
                { value: 'comercial', label: 'Comercial', icon: Business }
              ].map((option) => {
                const IconComponent = option.icon;
                return (
                  <Grid item xs={6} md={3} key={option.value}>
                    <Paper
                      elevation={guaranteeData.type === option.value ? 3 : 1}
                      sx={{
                        p: 2.5,
                        cursor: 'pointer',
                        textAlign: 'center',
                        border: guaranteeData.type === option.value ? '2px solid #1976d2' : '2px solid transparent',
                        bgcolor: guaranteeData.type === option.value ? 'primary.50' : 'background.paper',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          elevation: 2,
                          bgcolor: guaranteeData.type === option.value ? 'primary.100' : 'grey.50',
                          transform: 'translateY(-2px)'
                        }
                      }}
                      onClick={() => handleGuaranteeTypeChange(null, option.value)}
                    >
                      <IconComponent 
                        sx={{ 
                          fontSize: '2.5rem', 
                          mb: 1.5,
                          color: guaranteeData.type === option.value ? 'primary.main' : 'text.secondary'
                        }} 
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: guaranteeData.type === option.value ? 600 : 500,
                          color: guaranteeData.type === option.value ? 'primary.main' : 'text.primary',
                          fontSize: '0.875rem'
                        }}
                      >
                        {option.label}
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {/* Campos específicos para vehículo */}
          {guaranteeData.type === 'vehiculo' && (
            <Paper sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 500, fontSize: '0.9rem' }}>
                Datos del vehículo
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontSize: '0.875rem' }}>Tipo...</InputLabel>
                    <Select
                      value={guaranteeData.vehicleType}
                      label="Tipo..."
                      onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                      sx={{ fontSize: '0.875rem' }}
                    >
                      <MenuItem value="ND">ND</MenuItem>
                      <MenuItem value="automovil">Automóvil</MenuItem>
                      <MenuItem value="motocicleta">Motocicleta</MenuItem>
                      <MenuItem value="camion">Camión</MenuItem>
                      <MenuItem value="autobus">Autobús</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Marca"
                    value={guaranteeData.marca}
                    onChange={(e) => handleInputChange('marca', e.target.value)}
                    placeholder="Ingrese la marca del vehículo"
                    InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Modelo"
                    value={guaranteeData.modelo}
                    onChange={(e) => handleInputChange('modelo', e.target.value)}
                    InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Año"
                    type="number"
                    value={guaranteeData.año}
                    onChange={(e) => handleInputChange('año', e.target.value)}
                    inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
                    InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Color"
                    value={guaranteeData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Placa"
                    value={guaranteeData.placa}
                    onChange={(e) => handleInputChange('placa', e.target.value)}
                    inputProps={{ style: { textTransform: 'uppercase' } }}
                    InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Número de motor"
                    value={guaranteeData.numeroMotor}
                    onChange={(e) => handleInputChange('numeroMotor', e.target.value)}
                    InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Número de chasis"
                    value={guaranteeData.numeroChasis}
                    onChange={(e) => handleInputChange('numeroChasis', e.target.value)}
                    InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Cantidad Pasajeros"
                    type="number"
                    value={guaranteeData.cantidadPasajeros}
                    onChange={(e) => handleInputChange('cantidadPasajeros', e.target.value)}
                    inputProps={{ min: 1 }}
                    InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Número de matrícula"
                    value={guaranteeData.numeroMatricula}
                    onChange={(e) => handleInputChange('numeroMatricula', e.target.value)}
                    InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Fecha Matrícula"
                    type="date"
                    value={guaranteeData.fechaMatricula}
                    onChange={(e) => handleInputChange('fechaMatricula', e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                      sx: { fontSize: '0.875rem' }
                    }}
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Valor comercial"
                    type="number"
                    value={guaranteeData.valorComercial}
                    onChange={(e) => handleInputChange('valorComercial', e.target.value)}
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                  />
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Placeholder para otros tipos de garantía */}
          {guaranteeData.type !== 'vehiculo' && (
            <Paper sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, mt: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 2 }}>
                Campos específicos para garantía tipo "{guaranteeData.type}" - En desarrollo
              </Typography>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Valor garantía"
                    type="number"
                    value={guaranteeData.valorGarantia}
                    onChange={(e) => handleInputChange('valorGarantia', e.target.value)}
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                  />
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>

        <OnboardingAction />
      </Box>
    </JumboCard>
  );
};

export { Guarantee };