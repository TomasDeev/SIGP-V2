import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Avatar,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  AccountBalance as BankIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { JumboCard } from "@jumbo/components";
import { PrestamosService } from "../../../_services/prestamosService";
import CuentasService from "../../../_services/cuentasService";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 0,
  }).format(amount);
};

const getStatusColor = (estado) => {
  switch (estado) {
    case "En Solicitud":
      return "info";
    case "En Evaluacion":
      return "warning";
    case "Declinado":
      return "error";
    case "Aprobado":
      return "success";
    case "En contabilidad":
      return "primary";
    case "Vendido":
      return "success";
    default:
      return "default";
  }
};

const getStatusIcon = (estado) => {
  switch (estado) {
    case "En Solicitud":
      return "📝";
    case "En Evaluacion":
      return "📋";
    case "Declinado":
      return "✗";
    case "Aprobado":
      return "✓";
    case "En contabilidad":
      return "💰";
    case "Vendido":
      return "🎉";
    default:
      return "•";
  }
};

const getEstadoName = (idEstado) => {
  const estados = {
    1: 'En Solicitud',
    2: 'En Evaluacion', 
    3: 'Aprobado',
    4: 'Declinado',
    5: 'En contabilidad',
    6: 'Vendido'
  };
  return estados[idEstado] || 'En Solicitud';
};

export default function CreditApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loanData, setLoanData] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [amortizationData, setAmortizationData] = useState([]);

  useEffect(() => {
    loadApplicationDetails();
  }, [id]);

  const loadApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Extraer el ID del préstamo del parámetro
      const loanId = extractLoanId(id);
      
      if (!loanId) {
        throw new Error('ID de préstamo inválido');
      }

      // Cargar datos del préstamo
      const loanResult = await PrestamosService.getById(loanId);
      if (!loanResult.success) {
        throw new Error(loanResult.error || 'Error al cargar datos del préstamo');
      }

      const loan = loanResult.data;
      // Add estado field for UI display
      loan.estado = getEstadoName(loan.IdEstado);
      setLoanData(loan);

      // Cargar datos del cliente
      if (loan.IdCuenta) {
        const clientResult = await CuentasService.getById(loan.IdCuenta);
        if (clientResult.success) {
          setClientData(clientResult.data);
        }
      }

      // Cargar tabla de amortización
      const amortizationResult = await PrestamosService.getAmortizationTable(loanId);
      if (amortizationResult.success) {
        setAmortizationData(amortizationResult.data || []);
      }

    } catch (error) {
      console.error('Error loading application details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const extractLoanId = (paramId) => {
    // Si el ID viene en formato "PR123" o similar (prefijo + número), extraer el número
    const match = paramId.match(/^(\w+)(\d+)$/);
    if (match) {
      return parseInt(match[2]);
    }
    // Si es solo un número
    return parseInt(paramId);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/tools/credit-application')}
        >
          Volver a Solicitudes
        </Button>
      </Box>
    );
  }

  if (!loanData || !clientData) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">
          No se encontraron datos para esta solicitud.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={() => navigate('/tools/credit-application')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Detalles de Solicitud de Crédito
          </Typography>
        </Stack>
      </Box>

      {/* Loan Summary Card */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary.main" fontWeight="bold">
            📋 Resumen del Préstamo
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Número de Préstamo</Typography>
              <Typography variant="h6">{loanData.Prefijo}{loanData.PrestamoNo}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Monto del Préstamo</Typography>
              <Typography variant="h6" color="primary.main">
                {formatCurrency(loanData.CapitalPrestado)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Estado</Typography>
              <Chip 
                label={`${getStatusIcon(loanData.estado)} ${loanData.estado}`}
                color={getStatusColor(loanData.estado)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Fecha de Creación</Typography>
              <Typography variant="h6">
                {new Date(loanData.FechaCreacion).toLocaleDateString('es-DO')}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Client Information Card */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary.main" fontWeight="bold">
            👤 Información del Cliente
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">Nombre Completo</Typography>
              <Typography variant="h6">
                {clientData.Nombres} {clientData.Apellidos}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">Cédula</Typography>
              <Typography variant="h6">{clientData.Cedula}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">Teléfono</Typography>
              <Typography variant="h6">{clientData.Telefono || clientData.Celular}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">Email</Typography>
              <Typography variant="h6">{clientData.Email}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">Dirección</Typography>
              <Typography variant="h6">{clientData.Direccion}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">Sector</Typography>
              <Typography variant="h6">{clientData.Sector}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">Lugar de Trabajo</Typography>
              <Typography variant="h6">{clientData.LugarTrabajo}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">Ingresos</Typography>
              <Typography variant="h6" color="success.main">
                {formatCurrency(clientData.Ingresos)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Loan Details Card */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary.main" fontWeight="bold">
            💰 Detalles del Préstamo
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Tasa de Interés</Typography>
              <Typography variant="h6">{loanData.Interes}%</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Interés de Mora</Typography>
              <Typography variant="h6">{loanData.InteresMora}%</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Número de Cuotas</Typography>
              <Typography variant="h6">{loanData.Cuotas}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Frecuencia de Pago</Typography>
              <Typography variant="h6">{loanData.FrecuenciaPago} días</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Fecha Primer Pago</Typography>
              <Typography variant="h6">
                {new Date(loanData.FechaPrimerPago).toLocaleDateString('es-DO')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Gastos de Cierre</Typography>
              <Typography variant="h6">{formatCurrency(loanData.GastoCierre)}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Gastos de Seguro</Typography>
              <Typography variant="h6">{formatCurrency(loanData.GastoSeguro)}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Días de Gracia Mora</Typography>
              <Typography variant="h6">{loanData.DiasGraciaMora}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Amortization Table */}
      {amortizationData.length > 0 && (
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary.main" fontWeight="bold">
              📊 Tabla de Amortización
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell align="center"><strong>Cuota #</strong></TableCell>
                    <TableCell align="center"><strong>Fecha</strong></TableCell>
                    <TableCell align="right"><strong>Capital</strong></TableCell>
                    <TableCell align="right"><strong>Interés</strong></TableCell>
                    <TableCell align="right"><strong>Mora</strong></TableCell>
                    <TableCell align="right"><strong>Seguro</strong></TableCell>
                    <TableCell align="right"><strong>Gasto Cierre</strong></TableCell>
                    <TableCell align="right"><strong>Total</strong></TableCell>
                    <TableCell align="center"><strong>Estado</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {amortizationData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{row.OrdenPago}</TableCell>
                      <TableCell align="center">
                        {new Date(row.Vencimiento).toLocaleDateString('es-DO')}
                      </TableCell>
                      <TableCell align="right">{formatCurrency(row.Capital)}</TableCell>
                      <TableCell align="right">{formatCurrency(row.Interes)}</TableCell>
                      <TableCell align="right">{formatCurrency(row.Mora)}</TableCell>
                      <TableCell align="right">{formatCurrency(row.Seguro)}</TableCell>
                      <TableCell align="right">{formatCurrency(row.GastoCierre)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(row.Capital + row.Interes + row.Mora + row.Seguro + row.GastoCierre)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={row.EstaPagado ? 'Pagada' : 'Pendiente'}
                          color={row.EstaPagado ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/tools/credit-application')}
        >
          Volver al Listado
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => window.print()}
        >
          Imprimir Detalles
        </Button>
      </Box>
    </Box>
  );
}