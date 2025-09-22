import React, { useState } from 'react';
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
  Business,
  Work,
  Person,
  AttachMoney,
  LocationOn,
  Payment
} from '@mui/icons-material';
import { JumboCard } from '@jumbo/components';
import { OnboardingAction } from '@app/_components/onboarding/common';

const InformacionLaboral = () => {
  const [datosLaborales, setDatosLaborales] = useState({
    empresa: '',
    cargo: '',
    supervisor: '',
    ingresosMes: '',
    direccionEmpresa: '',
    quienPagara: ''
  });

  const handleInputChange = (field, value) => {
    setDatosLaborales(prev => ({ ...prev, [field]: value }));
  };

  return (
    <JumboCard
      title="Paso 8: Información Laboral"
      sx={{ mb: 3 }}
    >
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Business sx={{ mr: 1, color: 'primary.main' }} />
          9.1 Datos laborales
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Empresa"
              value={datosLaborales.empresa}
              onChange={(e) => handleInputChange('empresa', e.target.value)}
              InputProps={{
                startAdornment: <Business sx={{ mr: 1, color: 'action.active' }} />
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Cargo"
              value={datosLaborales.cargo}
              onChange={(e) => handleInputChange('cargo', e.target.value)}
              InputProps={{
                startAdornment: <Work sx={{ mr: 1, color: 'action.active' }} />
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Supervisor"
              value={datosLaborales.supervisor}
              onChange={(e) => handleInputChange('supervisor', e.target.value)}
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ingresos mes"
              value={datosLaborales.ingresosMes}
              onChange={(e) => handleInputChange('ingresosMes', e.target.value)}
              type="number"
              InputProps={{
                startAdornment: <AttachMoney sx={{ mr: 1, color: 'action.active' }} />
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dirección Empresa"
              value={datosLaborales.direccionEmpresa}
              onChange={(e) => handleInputChange('direccionEmpresa', e.target.value)}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Cómo/Quién pagará el préstamo</InputLabel>
              <Select
                value={datosLaborales.quienPagara}
                onChange={(e) => handleInputChange('quienPagara', e.target.value)}
                label="Cómo/Quién pagará el préstamo"
                startAdornment={<Payment sx={{ mr: 1, color: 'action.active' }} />}
              >
                <MenuItem value="descuento_nomina">Descuento por nómina</MenuItem>
                <MenuItem value="pago_directo">Pago directo</MenuItem>
                <MenuItem value="transferencia_bancaria">Transferencia bancaria</MenuItem>
                <MenuItem value="efectivo">Efectivo</MenuItem>
                <MenuItem value="familiar">Familiar</MenuItem>
                <MenuItem value="otro">Otro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Botones de navegación */}
        <OnboardingAction />
      </Box>
    </JumboCard>
  );
};

export default InformacionLaboral;