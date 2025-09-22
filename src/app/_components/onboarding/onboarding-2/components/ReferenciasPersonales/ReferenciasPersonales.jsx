import React, { useState } from 'react';
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

const ReferenciasPersonales = () => {
  const [referencias, setReferencias] = useState([
    {
      id: 1,
      nombre: '',
      telefono: '',
      direccion: '',
      parentesco: ''
    }
  ]);

  const handleInputChange = (id, field, value) => {
    setReferencias(prev => 
      prev.map(ref => 
        ref.id === id ? { ...ref, [field]: value } : ref
      )
    );
  };

  const addReferencia = () => {
    const newId = Math.max(...referencias.map(r => r.id)) + 1;
    setReferencias(prev => [...prev, {
      id: newId,
      nombre: '',
      telefono: '',
      direccion: '',
      parentesco: ''
    }]);
  };

  const removeReferencia = (id) => {
    if (referencias.length > 1) {
      setReferencias(prev => prev.filter(ref => ref.id !== id));
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
                <TableCell><strong>Nombre</strong></TableCell>
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
                      value={referencia.nombre}
                      onChange={(e) => handleInputChange(referencia.id, 'nombre', e.target.value)}
                      placeholder="Nombre completo"
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
                      }}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={referencia.telefono}
                      onChange={(e) => handleInputChange(referencia.id, 'telefono', e.target.value)}
                      placeholder="Número de teléfono"
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
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
                      placeholder="Dirección completa"
                      InputProps={{
                        startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />
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