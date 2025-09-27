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
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Button,
  Avatar,
  Paper
} from '@mui/material';
import {
  Person,
  PersonOutline,
  Tag,
  Badge,
  CalendarToday,
  Email,
  Phone,
  PhoneAndroid,
  Wc,
  Favorite,
  Public,
  Work,
  School,
  Home,
  PhotoCamera,
  CloudUpload
} from '@mui/icons-material';
import { JumboCard } from '@jumbo/components';
import { OnboardingAction } from '@app/_components/onboarding/common';
import { useOnboardingData } from '../../context/OnboardingDataContext';

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
  const { onboardingData, updateSection } = useOnboardingData();
  const [datosPersonales, setDatosPersonales] = useState({
    nombres: '',
    apellidos: '',
    apodo: '',
    cedula: '',
    fechaNacimiento: '',
    sexo: 'Masculino',
    correo: '',
    telefono: '',
    celular: '',
    estadoCivil: 'Soltero(a)',
    nacionalidad: 'Dominicano(a)',
    ocupacion: 'Información no disponible',
    profesion: 'Información no disponible',
    tipoResidencia: '',
    foto: null,
    fotoPreview: null
  });

  // Cargar datos del contexto al montar el componente
  useEffect(() => {
    if (onboardingData.datosPersonales) {
      setDatosPersonales(onboardingData.datosPersonales);
    }
  }, [onboardingData.datosPersonales]);

  const handleInputChange = (field, value) => {
    const newData = { ...datosPersonales, [field]: value };
    setDatosPersonales(newData);
    // Actualizar el contexto global
    updateSection('datosPersonales', newData);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB');
        return;
      }

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const newData = { 
          ...datosPersonales, 
          foto: file,
          fotoPreview: e.target.result 
        };
        setDatosPersonales(newData);
        updateSection('datosPersonales', newData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    const newData = { 
      ...datosPersonales, 
      foto: null,
      fotoPreview: null 
    };
    setDatosPersonales(newData);
    updateSection('datosPersonales', newData);
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
            {/* Foto del cliente */}
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, fontSize: '1rem' }}>
                  Foto del Cliente
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  {/* Preview de la imagen */}
                  <Paper
                    elevation={2}
                    sx={{
                      width: 120,
                      height: 120,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed',
                      borderColor: datosPersonales.fotoPreview ? 'primary.main' : 'grey.300',
                      borderRadius: 2,
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    {datosPersonales.fotoPreview ? (
                      <img
                        src={datosPersonales.fotoPreview}
                        alt="Preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <PhotoCamera sx={{ fontSize: 40, color: 'grey.400' }} />
                    )}
                  </Paper>

                  {/* Botones de acción */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<CloudUpload />}
                      sx={{ fontSize: '0.9rem' }}
                    >
                      Subir Foto
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </Button>
                    
                    {datosPersonales.fotoPreview && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleRemoveImage}
                        sx={{ fontSize: '0.9rem' }}
                      >
                        Eliminar
                      </Button>
                    )}
                    
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Formatos: JPG, PNG, GIF<br />
                      Tamaño máximo: 5MB
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

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
                label="Cédula"
                value={datosPersonales.cedula}
                onChange={(e) => handleInputChange('cedula', e.target.value)}
                placeholder="000-0000000-0"
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

            {/* Tercera fila */}
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

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Lugar de Nacimiento"
                value={datosPersonales.lugarNacimiento}
                onChange={(e) => handleInputChange('lugarNacimiento', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Public sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
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

            {/* Cuarta fila - Sexo */}
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

            {/* Teléfonos */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={datosPersonales.telefono}
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
                label="Celular"
                value={datosPersonales.celular}
                onChange={(e) => handleInputChange('celular', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneAndroid sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
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

            {/* Quinta fila */}
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

            {/* Sexta fila */}
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