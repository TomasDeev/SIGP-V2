import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button
} from '@mui/material';
import {
  Person,
  Phone,
  LocationOn,
  FamilyRestroom,
  Add,
  Delete
} from '@mui/icons-material';
import { JumboCard } from '@jumbo/components';
import { OnboardingAction } from '@app/_components/onboarding/common';
import { useOnboardingData } from '../../context/OnboardingDataContext';

const ReferenciasPersonales = () => {
  const { onboardingData, updateSection } = useOnboardingData();
  const [referencias, setReferencias] = useState([
    {
      id: 1,
      nombres: '',
      apellidos: '',
      telefono: '',
      direccion: '',
      parentesco: ''
    }
  ]);

  // Cargar datos del contexto al montar el componente
  useEffect(() => {
    if (onboardingData.referenciasPersonales && onboardingData.referenciasPersonales.referencias && onboardingData.referenciasPersonales.referencias.length > 0) {
      setReferencias(onboardingData.referenciasPersonales.referencias);
    }
  }, [onboardingData.referenciasPersonales]);

  const updateContext = (newReferencias) => {
    console.log('Actualizando contexto de referencias:', newReferencias);
    updateSection('referenciasPersonales', { referencias: newReferencias });
  };

  const handleInputChange = (id, field, value) => {
    const newReferencias = referencias.map(ref => 
      ref.id === id ? { ...ref, [field]: value } : ref
    );
    setReferencias(newReferencias);
    updateContext(newReferencias);
  };

  const addReferencia = () => {
    const newId = referencias.length > 0 ? Math.max(...referencias.map(r => r.id)) + 1 : 1;
    const newReferencias = [...referencias, {
      id: newId,
      nombres: '',
      apellidos: '',
      telefono: '',
      direccion: '',
      parentesco: ''
    }];
    setReferencias(newReferencias);
    updateContext(newReferencias);
  };

  const removeReferencia = (id) => {
    if (referencias.length > 1) {
      const newReferencias = referencias.filter(ref => ref.id !== id);
      setReferencias(newReferencias);
      updateContext(newReferencias);
    }
  };

  const parentescoOptions = [
    'Padre',
    'Madre',
    'Hermano/a',
    'Hijo/a',
    'Esposo/a',
    'Tío/a',
    'Primo/a',
    'Abuelo/a',
    'Amigo/a',
    'Compañero de trabajo',
    'Vecino/a',
    'Otro'
  ];

  return (
    <JumboCard
      title="Paso 9: Referencias Personales"
      sx={{ mb: 3 }}
    >
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Person sx={{ mr: 1, color: 'primary.main' }} />
          10.1 Datos del referente
        </Typography>

        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nombres</strong></TableCell>
                <TableCell><strong>Apellidos</strong></TableCell>
                <TableCell><strong>Teléfono</strong></TableCell>
                <TableCell><strong>Dirección</strong></TableCell>
                <TableCell><strong>Parentesco</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {referencias.map((referencia) => (
                <TableRow key={referencia.id}>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={referencia.nombres}
                      onChange={(e) => handleInputChange(referencia.id, 'nombres', e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={referencia.apellidos}
                      onChange={(e) => handleInputChange(referencia.id, 'apellidos', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={referencia.telefono}
                      onChange={(e) => handleInputChange(referencia.id, 'telefono', e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <Phone sx={{ mr: 1, color: 'action.active' }} />
                        ),
                      }}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={referencia.direccion}
                      onChange={(e) => handleInputChange(referencia.id, 'direccion', e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <LocationOn sx={{ mr: 1, color: 'action.active' }} />
                        ),
                      }}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small" variant="outlined">
                      <Select
                        value={referencia.parentesco}
                        onChange={(e) => handleInputChange(referencia.id, 'parentesco', e.target.value)}
                        displayEmpty
                        startAdornment={<FamilyRestroom sx={{ mr: 1, color: 'action.active' }} />}
                      >
                        <MenuItem value="">
                          <em>Seleccionar parentesco</em>
                        </MenuItem>
                        {parentescoOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => removeReferencia(referencia.id)}
                      disabled={referencias.length === 1}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addReferencia}
            sx={{ borderRadius: 5 }}
          >
            Agregar referencia
          </Button>
        </Box>

        {/* Botones de navegación */}
        <OnboardingAction />
      </Box>
    </JumboCard>
  );
};

export default ReferenciasPersonales;