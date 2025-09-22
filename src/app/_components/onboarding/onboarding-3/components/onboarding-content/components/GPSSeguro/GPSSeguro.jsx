import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Paper,
  InputAdornment
} from '@mui/material';
import {
  Security,
  GpsFixed,
  Business,
  CalendarToday
} from '@mui/icons-material';
import { JumboCard } from '@jumbo/components';
import { OnboardingAction } from '@app/_components/onboarding/common';

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
      subheader={
        <Typography variant="body1" fontSize={16} sx={{ color: 'text.secondary' }}>
          Complete la información de GPS y Seguro
        </Typography>
      }
      contentWrapper
      sx={{
        display: "flex",
        minWidth: 0,
        flexDirection: "column",
        borderRadius: 5,
        boxShadow: "none",
        minHeight: "100%",
      }}
      contentSx={{
        display: "flex",
        minWidth: 0,
        flexDirection: "column",
        flex: 1,
      }}
    >
      <Box display={"flex"} flexDirection={"column"} minWidth={0} flex={1}>
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3, 
              fontWeight: 'bold',
              color: 'primary.main',
              textAlign: 'center'
            }}
          >
            Paso 3: GPS y Seguro
          </Typography>

          {/* Sección GPS y Seguro */}
          <Paper 
            elevation={2}
            sx={{ 
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              transition: 'all 0.3s ease',
              '&:hover': {
                elevation: 4,
                borderColor: 'primary.light'
              }
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontWeight: 'bold', 
                color: "secondary.main",
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Security sx={{ fontSize: '1.5rem' }} />
              3.1 GPS y Seguro
            </Typography>

            <Grid container spacing={3}>
              {/* Primera fila */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Aseguradora"
                  value={gpsSeguroData.aseguradora}
                  onChange={(e) => handleInputChange('aseguradora', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                  sx={{ 
                    '& .MuiInputBase-input': { fontSize: '0.875rem' },
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="No. Póliza"
                  value={gpsSeguroData.numeroPoliza}
                  onChange={(e) => handleInputChange('numeroPoliza', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Security sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                  sx={{ 
                    '& .MuiInputBase-input': { fontSize: '0.875rem' },
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              </Grid>

              {/* Segunda fila */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Emisión póliza"
                  type="date"
                  value={gpsSeguroData.emisionPoliza}
                  onChange={(e) => handleInputChange('emisionPoliza', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                    sx: { fontSize: '0.875rem' }
                  }}
                  sx={{ 
                    '& .MuiInputBase-input': { fontSize: '0.875rem' },
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Vencimiento póliza"
                  type="date"
                  value={gpsSeguroData.vencimientoPoliza}
                  onChange={(e) => handleInputChange('vencimientoPoliza', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                    sx: { fontSize: '0.875rem' }
                  }}
                  sx={{ 
                    '& .MuiInputBase-input': { fontSize: '0.875rem' },
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              </Grid>

              {/* Tercera fila */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Compañía GPS"
                  value={gpsSeguroData.companiaGps}
                  onChange={(e) => handleInputChange('companiaGps', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GpsFixed sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                  sx={{ 
                    '& .MuiInputBase-input': { fontSize: '0.875rem' },
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Fecha Instalación"
                  type="date"
                  value={gpsSeguroData.fechaInstalacion}
                  onChange={(e) => handleInputChange('fechaInstalacion', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                    sx: { fontSize: '0.875rem' }
                  }}
                  sx={{ 
                    '& .MuiInputBase-input': { fontSize: '0.875rem' },
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Box>

        <OnboardingAction />
      </Box>
    </JumboCard>
  );
};

export { GPSSeguro };