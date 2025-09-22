import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
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
  Receipt,
  Person,
  Description,
  AccountBalance,
  AttachMoney,
  StickyNote2,
  Add,
  Delete
} from '@mui/icons-material';
import { JumboCard } from '@jumbo/components';
import { OnboardingAction } from '@app/_components/onboarding/common';

const Cheques = () => {
  const [desembolsos, setDesembolsos] = useState([
    {
      id: 1,
      beneficiario: '',
      concepto: '',
      prestamo: '',
      monto: '',
      nota: ''
    }
  ]);

  const handleInputChange = (id, field, value) => {
    setDesembolsos(prev => 
      prev.map(desembolso => 
        desembolso.id === id ? { ...desembolso, [field]: value } : desembolso
      )
    );
  };

  const addDesembolso = () => {
    const newId = Math.max(...desembolsos.map(d => d.id)) + 1;
    setDesembolsos(prev => [...prev, {
      id: newId,
      beneficiario: '',
      concepto: '',
      prestamo: '',
      monto: '',
      nota: ''
    }]);
  };

  const removeDesembolso = (id) => {
    if (desembolsos.length > 1) {
      setDesembolsos(prev => prev.filter(desembolso => desembolso.id !== id));
    }
  };

  const conceptoOptions = [
    'Pago de deudas',
    'Inversión en negocio',
    'Gastos médicos',
    'Educación',
    'Mejoras del hogar',
    'Compra de vehículo',
    'Capital de trabajo',
    'Gastos personales',
    'Emergencia',
    'Otro'
  ];

  const prestamoOptions = [
    'Préstamo personal',
    'Préstamo hipotecario',
    'Préstamo vehicular',
    'Préstamo comercial',
    'Línea de crédito',
    'Tarjeta de crédito',
    'Microcrédito',
    'Otro'
  ];

  const formatCurrency = (value) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Format as currency
    if (numericValue) {
      const number = parseFloat(numericValue);
      if (!isNaN(number)) {
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(number);
      }
    }
    return numericValue;
  };

  const handleMontoChange = (id, value) => {
    // Store the raw numeric value
    const numericValue = value.replace(/[^\d]/g, '');
    handleInputChange(id, 'monto', numericValue);
  };

  return (
    <JumboCard
      title="Paso 10: Cheques"
      sx={{ mb: 3 }}
    >
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Receipt sx={{ mr: 1, color: 'primary.main' }} />
          11.1 Desembolsos
        </Typography>

        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Beneficiario</strong></TableCell>
                <TableCell><strong>Concepto</strong></TableCell>
                <TableCell><strong>Préstamo</strong></TableCell>
                <TableCell><strong>Monto</strong></TableCell>
                <TableCell><strong>Nota</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {desembolsos.map((desembolso) => (
                <TableRow key={desembolso.id}>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={desembolso.beneficiario}
                      onChange={(e) => handleInputChange(desembolso.id, 'beneficiario', e.target.value)}
                      placeholder="Nombre del beneficiario"
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
                      }}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small" variant="outlined">
                      <Select
                        value={desembolso.concepto}
                        onChange={(e) => handleInputChange(desembolso.id, 'concepto', e.target.value)}
                        displayEmpty
                        startAdornment={<Description sx={{ mr: 1, color: 'action.active' }} />}
                      >
                        <MenuItem value="">
                          <em>Seleccionar concepto</em>
                        </MenuItem>
                        {conceptoOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small" variant="outlined">
                      <Select
                        value={desembolso.prestamo}
                        onChange={(e) => handleInputChange(desembolso.id, 'prestamo', e.target.value)}
                        displayEmpty
                        startAdornment={<AccountBalance sx={{ mr: 1, color: 'action.active' }} />}
                      >
                        <MenuItem value="">
                          <em>Tipo de préstamo</em>
                        </MenuItem>
                        {prestamoOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={desembolso.monto ? formatCurrency(desembolso.monto) : ''}
                      onChange={(e) => handleMontoChange(desembolso.id, e.target.value)}
                      placeholder="$0"
                      InputProps={{
                        startAdornment: <AttachMoney sx={{ mr: 1, color: 'action.active' }} />
                      }}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={desembolso.nota}
                      onChange={(e) => handleInputChange(desembolso.id, 'nota', e.target.value)}
                      placeholder="Observaciones adicionales"
                      InputProps={{
                        startAdornment: <StickyNote2 sx={{ mr: 1, color: 'action.active' }} />
                      }}
                      variant="outlined"
                      multiline
                      maxRows={2}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => removeDesembolso(desembolso.id)}
                      disabled={desembolsos.length === 1}
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
            onClick={addDesembolso}
            sx={{ borderRadius: 5 }}
          >
            Agregar desembolso
          </Button>
        </Box>

        {/* Resumen de montos */}
        {desembolsos.some(d => d.monto) && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AttachMoney sx={{ mr: 1, color: 'primary.main' }} />
              Resumen de Desembolsos
            </Typography>
            <Typography variant="body1">
              <strong>Total: </strong>
              {formatCurrency(
                desembolsos
                  .filter(d => d.monto)
                  .reduce((total, d) => total + parseInt(d.monto || 0), 0)
                  .toString()
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cantidad de desembolsos: {desembolsos.filter(d => d.monto).length}
            </Typography>
          </Box>
        )}

        {/* Botones de navegación */}
        <OnboardingAction />
      </Box>
    </JumboCard>
  );
};

export default Cheques;