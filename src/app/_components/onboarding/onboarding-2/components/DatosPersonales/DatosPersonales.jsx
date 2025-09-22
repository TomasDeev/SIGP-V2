import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel
} from '@mui/material';
import {
  Person,
  PersonOutline,
  Tag,
  CalendarToday,
  Email,
  Wc,
  Favorite,
  Public,
  Work,
  School,
  Home
} from '@mui/icons-material';
import { JumboCard } from '@jumbo/components';
import { OnboardingAction } from '@app/_components/onboarding/common';

// Opciones para los dropdowns
const estadosCiviles = [
  'Soltero(a)',
  'Casado(a)',
  'Divorciado(a)',
  'Viudo(a)',
  'Unión libre'
];

const nacionalidades = [
  'Dominicano(a)',
  'Colombiano(a)',
  'Venezolano(a)',
  'Haitiano(a)',
  'Estadounidense',
  'Español(a)',
  'Francés(a)',
  'Italiano(a)',
  'Alemán(a)',
  'Otro'
];

const ocupaciones = [
  'Información no disponible',
  'Empleado(a)',
  'Independiente',
  'Empresario(a)',
  'Estudiante',
  'Jubilado(a)',
  'Ama de casa',
  'Desempleado(a)'
];

const profesiones = [
  'Información no disponible',
  'Ingeniero(a)',
  'Médico(a)',
  'Abogado(a)',
  'Contador(a)',
  'Administrador(a)',
  'Profesor(a)',
  'Técnico(a)',
  'Comerciante',
  'Otro'
];

const tiposResidencia = [
  'Propia',
  'Alquilada',
  'Familiar',
  'Hipotecada',
  'Otro'
];

const DatosPersonales = () => {
  const [datosPersonales, setDatosPersonales] = useState({
    nombres: '',
    apellidos: '',
    apodo: '',
    fechaNacimiento: '',
    sexo: 'Masculino',
    correo: '',
    estadoCivil: 'Soltero(a)',
    nacionalidad: 'Dominicano(a)',
    ocupacion: 'Información no disponible',
    profesion: 'Información no disponible',
    tipoResidencia: ''
  });

  const handleInputChange = (field, value) => {
    setDatosPersonales(prev => ({ ...prev, [field]: value }));
  };

  return (
    <JumboCard
      title="Paso 4: Datos Personales"
      sx={{ mb: 3 }}
    >
      <Box sx={{ p: 4 }}>
        {/* 5.1 Datos personales */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, fontSize: '1.1rem' }}>
            5.1 Datos personales
          </Typography>

          <Grid container spacing={3}>
            {/* Primera fila */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombres"
                value={datosPersonales.nombres}
                onChange={(e) => handleInputChange('nombres', e.target.value)}
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
                label="Apellidos"
                value={datosPersonales.apellidos}
                onChange={(e) => handleInputChange('apellidos', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
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
                label="Apodo"
                value={datosPersonales.apodo}
                onChange={(e) => handleInputChange('apodo', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tag sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
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
                label="Fecha Nacimiento"
                type="date"
                value={datosPersonales.fechaNacimiento}
                onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
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

            {/* Tercera fila - Sexo */}
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset">
                <FormLabel 
                  component="legend" 
                  sx={{ 
                    fontSize: '0.9rem', 
                    fontWeight: 500,
                    color: 'text.primary',
                    mb: 1
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Wc sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                    Sexo
                  </Box>
                </FormLabel>
                <RadioGroup
                  row
                  value={datosPersonales.sexo}
                  onChange={(e) => handleInputChange('sexo', e.target.value)}
                >
                  <FormControlLabel 
                    value="Masculino" 
                    control={<Radio size="small" />} 
                    label={<Typography sx={{ fontSize: '0.9rem' }}>Masculino</Typography>}
                  />
                  <FormControlLabel 
                    value="Femenino" 
                    control={<Radio size="small" />} 
                    label={<Typography sx={{ fontSize: '0.9rem' }}>Femenino</Typography>}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Correo"
                type="email"
                value={datosPersonales.correo}
                onChange={(e) => handleInputChange('correo', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
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

            {/* Cuarta fila */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel 
                  sx={{ 
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                >
                  Estado civil
                </InputLabel>
                <Select
                  value={datosPersonales.estadoCivil}
                  label="Estado civil"
                  onChange={(e) => handleInputChange('estadoCivil', e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <Favorite sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                    </InputAdornment>
                  }
                  sx={{ 
                    '& .MuiSelect-select': { 
                      fontSize: '0.9rem',
                      fontWeight: 400
                    }
                  }}
                >
                  {estadosCiviles.map((estado) => (
                    <MenuItem 
                      key={estado} 
                      value={estado}
                      sx={{ fontSize: '0.9rem' }}
                    >
                      {estado}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel 
                  sx={{ 
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                >
                  Nacionalidad
                </InputLabel>
                <Select
                  value={datosPersonales.nacionalidad}
                  label="Nacionalidad"
                  onChange={(e) => handleInputChange('nacionalidad', e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <Public sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                    </InputAdornment>
                  }
                  sx={{ 
                    '& .MuiSelect-select': { 
                      fontSize: '0.9rem',
                      fontWeight: 400
                    }
                  }}
                >
                  {nacionalidades.map((nacionalidad) => (
                    <MenuItem 
                      key={nacionalidad} 
                      value={nacionalidad}
                      sx={{ fontSize: '0.9rem' }}
                    >
                      {nacionalidad}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Quinta fila */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel 
                  sx={{ 
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                >
                  Ocupación
                </InputLabel>
                <Select
                  value={datosPersonales.ocupacion}
                  label="Ocupación"
                  onChange={(e) => handleInputChange('ocupacion', e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <Work sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                    </InputAdornment>
                  }
                  sx={{ 
                    '& .MuiSelect-select': { 
                      fontSize: '0.9rem',
                      fontWeight: 400
                    }
                  }}
                >
                  {ocupaciones.map((ocupacion) => (
                    <MenuItem 
                      key={ocupacion} 
                      value={ocupacion}
                      sx={{ fontSize: '0.9rem' }}
                    >
                      {ocupacion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel 
                  sx={{ 
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                >
                  Profesión
                </InputLabel>
                <Select
                  value={datosPersonales.profesion}
                  label="Profesión"
                  onChange={(e) => handleInputChange('profesion', e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <School sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                    </InputAdornment>
                  }
                  sx={{ 
                    '& .MuiSelect-select': { 
                      fontSize: '0.9rem',
                      fontWeight: 400
                    }
                  }}
                >
                  {profesiones.map((profesion) => (
                    <MenuItem 
                      key={profesion} 
                      value={profesion}
                      sx={{ fontSize: '0.9rem' }}
                    >
                      {profesion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sexta fila */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel 
                  sx={{ 
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                >
                  Tipo residencia
                </InputLabel>
                <Select
                  value={datosPersonales.tipoResidencia}
                  label="Tipo residencia"
                  onChange={(e) => handleInputChange('tipoResidencia', e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <Home sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                    </InputAdornment>
                  }
                  sx={{ 
                    '& .MuiSelect-select': { 
                      fontSize: '0.9rem',
                      fontWeight: 400
                    }
                  }}
                >
                  {tiposResidencia.map((tipo) => (
                    <MenuItem 
                      key={tipo} 
                      value={tipo}
                      sx={{ fontSize: '0.9rem' }}
                    >
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Botones de navegación */}
        <OnboardingAction />
      </Box>
    </JumboCard>
  );
};

export default DatosPersonales;