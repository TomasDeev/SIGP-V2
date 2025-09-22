import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Paper,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Security,
  GpsFixed,
  Business,
  CalendarToday
} from '@mui/icons-material';
import { JumboCard } from '@jumbo/components';
import { OnboardingAction } from '@app/_components/onboarding/common';

// Opciones de aseguradoras registradas
const aseguradoras = [
  'ASSA Compañía de Seguros',
  'Seguros Universales',
  'La Colonial de Seguros',
  'Seguros Pepín',
  'Mapfre BHD Seguros',
  'Seguros Banreservas',
  'ARS Palic Salud',
  'Seguros Constitución',
  'Primera ARS',
  'Seguros La Internacional'
];

// Opciones de compañías GPS registradas
const companiasGPS = [
  'GPS Dominicana',
  'TrackingRD',
  'SecureTrack',
  'GPS Solutions',
  'MonitoreoRD',
  'SafeTrack Dominican',
  'GPS Control',
  'TrackMaster',
  'GPS Pro Services',
  'Dominican Tracking'
];

const GPSSeguro = () => {
  const [gpsSeguroData, setGpsSeguroData] = useState({
    aseguradora: '',
    numeroPoliza: '',
    emisionPoliza: '',
    vencimientoPoliza: '',
    companiaGps: '',
    fechaInstalacion: ''
  });

  const handleInputChange = (field, value) => {
    setGpsSeguroData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <JumboCard
      title="Paso 3: GPS y Seguro"
      sx={{ mb: 3 }}
    >
      <Box sx={{ p: 4 }}>
        {/* 3.1 GPS y Seguro */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, fontSize: '1.1rem' }}>
            3.1 GPS y Seguro
          </Typography>

            <Grid container spacing={3}>
              {/* Primera fila */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel 
                    sx={{ 
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}
                  >
                    Aseguradora
                  </InputLabel>
                  <Select
                    value={gpsSeguroData.aseguradora}
                    label="Aseguradora"
                    onChange={(e) => handleInputChange('aseguradora', e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <Business sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                      </InputAdornment>
                    }
                    sx={{ 
                      '& .MuiSelect-select': { 
                        fontSize: '0.9rem',
                        fontWeight: 400
                      }
                    }}
                  >
                    {aseguradoras.map((aseguradora) => (
                      <MenuItem 
                        key={aseguradora} 
                        value={aseguradora}
                        sx={{ fontSize: '0.9rem' }}
                      >
                        {aseguradora}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="No. Póliza"
                  value={gpsSeguroData.numeroPoliza}
                  onChange={(e) => handleInputChange('numeroPoliza', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Security sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
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
                  label="Emisión póliza"
                  type="date"
                  value={gpsSeguroData.emisionPoliza}
                  onChange={(e) => handleInputChange('emisionPoliza', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                    sx: { 
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }
                  }}
                  sx={{ 
                    '& .MuiInputBase-input': { 
                      fontSize: '0.9rem',
                      fontWeight: 400
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vencimiento póliza"
                  type="date"
                  value={gpsSeguroData.vencimientoPoliza}
                  onChange={(e) => handleInputChange('vencimientoPoliza', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                    sx: { 
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }
                  }}
                  sx={{ 
                    '& .MuiInputBase-input': { 
                      fontSize: '0.9rem',
                      fontWeight: 400
                    }
                  }}
                />
              </Grid>

              {/* Tercera fila */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel 
                    sx={{ 
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}
                  >
                    Compañía GPS
                  </InputLabel>
                  <Select
                    value={gpsSeguroData.companiaGps}
                    label="Compañía GPS"
                    onChange={(e) => handleInputChange('companiaGps', e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <GpsFixed sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                      </InputAdornment>
                    }
                    sx={{ 
                      '& .MuiSelect-select': { 
                        fontSize: '0.9rem',
                        fontWeight: 400
                      }
                    }}
                  >
                    {companiasGPS.map((compania) => (
                      <MenuItem 
                        key={compania} 
                        value={compania}
                        sx={{ fontSize: '0.9rem' }}
                      >
                        {compania}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha Instalación"
                  type="date"
                  value={gpsSeguroData.fechaInstalacion}
                  onChange={(e) => handleInputChange('fechaInstalacion', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                    sx: { 
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }
                  }}
                  sx={{ 
                    '& .MuiInputBase-input': { 
                      fontSize: '0.9rem',
                      fontWeight: 400
                    }
                  }}
                />
              </Grid>
            </Grid>
        </Box>

        <OnboardingAction />
      </Box>
    </JumboCard>
  );
};

export { GPSSeguro };