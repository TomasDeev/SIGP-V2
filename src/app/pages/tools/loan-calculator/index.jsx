import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  InputAdornment,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { JumboCard } from "@jumbo/components";
import { CONTAINER_MAX_WIDTH } from "@app/_config/layouts";
import { useTranslation } from "react-i18next";
import CalculateIcon from "@mui/icons-material/Calculate";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PercentIcon from "@mui/icons-material/Percent";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import SecurityIcon from "@mui/icons-material/Security";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useNavigate } from "react-router-dom";

export default function LoanCalculatorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Estados para los campos de entrada
  const [capital, setCapital] = useState("");
  const [plazoMeses, setPlazoMeses] = useState("");
  const [tasaInteresMensual, setTasaInteresMensual] = useState("");
  const [montoCierre, setMontoCierre] = useState("");
  const [fechaInicial, setFechaInicial] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  });
  const [roundMultiple, setRoundMultiple] = useState("5");
  
  // Estados para seguro y GPS con validaciones condicionales
  const [tieneSeguro, setTieneSeguro] = useState(false);
  const [tieneGPS, setTieneGPS] = useState(false);
  const [montoTotalSeguro, setMontoTotalSeguro] = useState("0");
  const [cuotasSeguro, setCuotasSeguro] = useState("0");
  const [montoTotalGPS, setMontoTotalGPS] = useState("0");
  const [cuotasGPS, setCuotasGPS] = useState("0");
  
  // Estados calculados para seguro y GPS mensuales
  const [seguroMensual, setSeguroMensual] = useState("0");
  const [gpsMensual, setGpsMensual] = useState("0");
  
  // Estados para los resultados
  const [amortizationTable, setAmortizationTable] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  // Efecto para calcular automáticamente el gasto de cierre cuando cambie el capital
  useEffect(() => {
    if (capital && !isNaN(parseFloat(capital))) {
      const capitalNum = parseFloat(capital);
      const cierreCalculado = (capitalNum * 0.10).toFixed(2);
      setMontoCierre(cierreCalculado);
    }
  }, [capital]);

  // Efecto para calcular automáticamente los valores mensuales de seguro y GPS
  useEffect(() => {
    if (tieneSeguro && montoTotalSeguro && cuotasSeguro) {
      const montoNum = parseFloat(montoTotalSeguro) || 0;
      const cuotasNum = parseFloat(cuotasSeguro) || 1;
      const seguroMensualCalculado = cuotasNum > 0 ? (montoNum / cuotasNum).toFixed(2) : "0";
      setSeguroMensual(seguroMensualCalculado);
    } else {
      setSeguroMensual("0");
    }
  }, [tieneSeguro, montoTotalSeguro, cuotasSeguro]);

  useEffect(() => {
    if (tieneGPS && montoTotalGPS && cuotasGPS) {
      const montoNum = parseFloat(montoTotalGPS) || 0;
      const cuotasNum = parseFloat(cuotasGPS) || 1;
      const gpsMensualCalculado = cuotasNum > 0 ? (montoNum / cuotasNum).toFixed(2) : "0";
      setGpsMensual(gpsMensualCalculado);
    } else {
      setGpsMensual("0");
    }
  }, [tieneGPS, montoTotalGPS, cuotasGPS]);

  const calculateLoan = () => {
    setError("");
    
    // Validar inputs obligatorios
    if (!capital || !plazoMeses || !tasaInteresMensual || !montoCierre || !fechaInicial) {
      setError("Por favor, complete todos los campos obligatorios");
      return;
    }

    const capitalNum = parseFloat(capital);
    const plazoNum = parseInt(plazoMeses);
    const tasaNum = parseFloat(tasaInteresMensual);
    const cierreNum = parseFloat(montoCierre) || 0;
    const roundMultipleNum = parseFloat(roundMultiple) || 10;
    const seguroNum = parseFloat(seguroMensual) || 0;
    const gpsNum = parseFloat(gpsMensual) || 0;

    if (capitalNum <= 0 || plazoNum <= 0 || tasaNum < 0 || cierreNum < 0) {
      setError("Por favor, ingrese valores válidos");
      return;
    }

    // Cálculos según las reglas del sistema de referencia
    
    // 1. Base de interés: (capital + cierre_total) * (tasa_mensual_percent / 100)
    const interesBase = (capitalNum + cierreNum) * (tasaNum / 100);
    
    // 2. Capital por cuota (exacto)
    const capitalExacto = capitalNum / plazoNum;
    
    // 3. Cierre por cuota (exacto)
    const cierreExacto = cierreNum / plazoNum;

    // Crear tabla de amortización
    const tabla = [];
    const fechaBase = new Date(fechaInicial);
    
    let totalCapitalPagado = 0;
    let totalCierrePagado = 0;

    for (let i = 1; i <= plazoNum; i++) {
      const fechaVencimiento = new Date(fechaBase);
      fechaVencimiento.setMonth(fechaBase.getMonth() + i);
      
      let capitalCuota, cierreCuota, cuotaMostrada, interesMostrado;
      
      if (i === plazoNum) {
        // Última cuota: ajuste final
        capitalCuota = roundTo2Decimals(capitalNum - totalCapitalPagado);
        cierreCuota = roundTo2Decimals(cierreNum - totalCierrePagado);
        
        // Cuota preliminar para la última cuota
        const cuotaPreliminar = capitalCuota + cierreCuota + interesBase + seguroNum + gpsNum;
        cuotaMostrada = roundToNearestMultiple(cuotaPreliminar, roundMultipleNum);
        interesMostrado = roundTo2Decimals(cuotaMostrada - capitalCuota - cierreCuota - seguroNum - gpsNum);
      } else {
        // Cuotas regulares (1 a plazo_meses - 1)
        capitalCuota = roundTo2Decimals(capitalExacto);
        cierreCuota = roundTo2Decimals(cierreExacto);
        
        // Cuota preliminar
        const cuotaPreliminar = capitalCuota + cierreCuota + interesBase + seguroNum + gpsNum;
        cuotaMostrada = roundToNearestMultiple(cuotaPreliminar, roundMultipleNum);
        interesMostrado = roundTo2Decimals(cuotaMostrada - capitalCuota - cierreCuota - seguroNum - gpsNum);
      }
      
      totalCapitalPagado += capitalCuota;
      totalCierrePagado += cierreCuota;
      
      tabla.push({
        numeroCuota: i,
        fechaVencimiento: fechaVencimiento.toLocaleDateString('es-ES'),
        cuotaTotal: cuotaMostrada,
        cierre: cierreCuota,
        seguro: seguroNum,
        gps: gpsNum,
        capital: capitalCuota,
        interes: interesMostrado,
      });
    }

    // Calcular totales reales de la tabla
    const totalInteresCalculado = tabla.reduce((sum, row) => sum + row.interes, 0);
    const totalSeguroCalculado = seguroNum * plazoNum;
    const totalGPSCalculado = gpsNum * plazoNum;
    const totalCuotas = tabla.reduce((sum, row) => sum + row.cuotaTotal, 0);
    
    const granTotalCalculado = capitalNum + totalInteresCalculado + cierreNum + totalSeguroCalculado + totalGPSCalculado;

    setAmortizationTable(tabla);
    setSummary({
      capitalPorCuota: capitalExacto,
      interesPorCuota: interesBase,
      cierrePorCuota: cierreExacto,
      totalCapital: capitalNum,
      totalInteres: totalInteresCalculado,
      totalCierre: cierreNum,
      totalSeguro: totalSeguroCalculado,
      totalGPS: totalGPSCalculado,
      totalCuotas: totalCuotas,
      granTotal: granTotalCalculado,
    });
  };

  const resetCalculator = () => {
    setCapital("");
    setPlazoMeses("");
    setTasaInteresMensual("");
    setMontoCierre("");
    const today = new Date();
    setFechaInicial(today.toISOString().split('T')[0]); // Restablecer a fecha actual
    setRoundMultiple("5");
    setTieneSeguro(false);
    setTieneGPS(false);
    setMontoTotalSeguro("0");
    setCuotasSeguro("0");
    setMontoTotalGPS("0");
    setCuotasGPS("0");
    setSeguroMensual("0");
    setGpsMensual("0");
    setAmortizationTable([]);
    setSummary(null);
    setError("");
  };

  const handleFillLoanApplication = () => {
    // Guardar los datos del préstamo en localStorage
    const loanData = {
      capital: parseFloat(capital) || 0,
      plazoMeses: parseInt(plazoMeses) || 0,
      tasaInteresMensual: parseFloat(tasaInteresMensual) || 0,
      montoCierre: parseFloat(montoCierre) || 0,
      fechaInicial,
      tieneSeguro,
      tieneGPS,
      montoTotalSeguro: parseFloat(montoTotalSeguro) || 0,
      cuotasSeguro: parseInt(cuotasSeguro) || 0,
      montoTotalGPS: parseFloat(montoTotalGPS) || 0,
      cuotasGPS: parseInt(cuotasGPS) || 0,
      seguroMensual: parseFloat(seguroMensual) || 0,
      gpsMensual: parseFloat(gpsMensual) || 0,
      summary,
      amortizationTable
    };

    localStorage.setItem('loanCalculationData', JSON.stringify(loanData));
    
    // Navegar al onboarding-2 para llenar los datos del préstamo
    navigate('/onboarding-2');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (amount) => {
    return new Intl.NumberFormat('es-DO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Función para redondeo comercial al múltiplo más cercano
  const roundToNearestMultiple = (value, multiple) => {
    const remainder = value % multiple;
    if (remainder === 0) return value;
    
    // Si hay empate, redondear hacia arriba
    if (remainder >= multiple / 2) {
      return value + (multiple - remainder);
    } else {
      return value - remainder;
    }
  };

  // Función para redondear a 2 decimales
  const roundTo2Decimals = (value) => {
    return Math.round(value * 100) / 100;
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: "1200px", // Ampliamos significativamente el ancho
        display: "flex",
        minWidth: 0,
        flex: 1,
        flexDirection: "column",
        px: 2,
        py: 4,
      }}
      disableGutters
    >
      {/* Logo SIGP */}
      <Box display="flex" justifyContent="center" mb={3}>
        <img src="/SIGP Nuevo logo.png" alt="SIGP" style={{ maxHeight: '60px' }} />
      </Box>

      {/* Título Principal */}
      <Typography 
        variant="h4" 
        component="h1" 
        align="center" 
        sx={{ 
          mb: 2, 
          fontWeight: 600,
          color: 'primary.main'
        }}
      >
        Cuota de préstamo
      </Typography>

      {/* Descripción */}
      <Typography 
        variant="body1" 
        align="center" 
        sx={{ 
          mb: 4, 
          backgroundColor: 'primary.main',
          color: 'white',
          p: 2,
          borderRadius: 3,
          maxWidth: '800px', // Ampliamos también la descripción
          mx: 'auto'
        }}
      >
        Esta calculadora permite establecer el valor que va a tener la cuota de un crédito, tomando el monto a tomar prestado, la tasa de interés y el plazo.
      </Typography>

      {/* Formulario Principal */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          width: '100%' // Ancho completo para coincidir con la tabla de amortización
        }}
      >
        <Grid container spacing={3}>
          {/* Primera fila - Campos principales */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Monto"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              type="number"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#f8f9fa',
                  border: 'none',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: '2px solid',
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  color: '#666',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'primary.main',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Cuotas"
              value={plazoMeses}
              onChange={(e) => setPlazoMeses(e.target.value)}
              type="number"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarViewMonthIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#f8f9fa',
                  border: 'none',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: '2px solid',
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  color: '#666',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'primary.main',
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Interés anual"
              value={tasaInteresMensual}
              onChange={(e) => setTasaInteresMensual(e.target.value)}
              type="number"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#f8f9fa',
                  border: 'none',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: '2px solid',
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  color: '#666',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'primary.main',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PercentIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Segunda fila - Campos adicionales */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Gasto de Cierre"
              value={montoCierre}
              onChange={(e) => setMontoCierre(e.target.value)}
              type="number"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#f8f9fa',
                  border: 'none',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: '2px solid',
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  color: '#666',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'primary.main',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CloseIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Fecha Inicial"
              value={fechaInicial}
              onChange={(e) => setFechaInicial(e.target.value)}
              type="date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRangeIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#f8f9fa',
                  border: 'none',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: '2px solid',
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  color: '#666',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'primary.main',
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Múltiplo de Redondeo"
              value={roundMultiple}
              onChange={(e) => setRoundMultiple(e.target.value)}
              type="number"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#f8f9fa',
                  border: 'none',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: '2px solid #20b2aa',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  color: '#666',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#20b2aa',
                },
              }}
            />
          </Grid>

          {/* Sección de Seguro y GPS */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
              Opciones adicionales
            </Typography>
          </Grid>

          {/* Sección de Seguro */}
          <Grid item xs={12} md={6}>
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 3, p: 3, backgroundColor: '#fafafa' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={tieneSeguro}
                    onChange={(e) => setTieneSeguro(e.target.checked)}
                    sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon sx={{ color: 'primary.main' }} />
                    <Typography>Incluir Seguro</Typography>
                  </Box>
                }
                sx={{ mb: 2 }}
              />

              {tieneSeguro && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Monto Total del Seguro"
                    value={montoTotalSeguro}
                    onChange={(e) => setMontoTotalSeguro(e.target.value)}
                    type="number"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f8f9fa',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SecurityIcon sx={{ color: '#20b2aa' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Cuotas del Seguro"
                    value={cuotasSeguro}
                    onChange={(e) => setCuotasSeguro(e.target.value)}
                    type="number"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f8f9fa',
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Seguro mensual: {formatCurrency(parseFloat(seguroMensual) || 0)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Sección de GPS */}
          <Grid item xs={12} md={6}>
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 3, p: 3, backgroundColor: '#fafafa' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={tieneGPS}
                    onChange={(e) => setTieneGPS(e.target.checked)}
                    sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GpsFixedIcon sx={{ color: 'primary.main' }} />
                    <Typography>Incluir GPS</Typography>
                  </Box>
                }
                sx={{ mb: 2 }}
              />

              {tieneGPS && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Monto Total del GPS"
                    value={montoTotalGPS}
                    onChange={(e) => setMontoTotalGPS(e.target.value)}
                    type="number"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f8f9fa',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GpsFixedIcon sx={{ color: '#20b2aa' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Cuotas del GPS"
                    value={cuotasGPS}
                    onChange={(e) => setCuotasGPS(e.target.value)}
                    type="number"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f8f9fa',
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    GPS mensual: {formatCurrency(parseFloat(gpsMensual) || 0)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Botón Calcular */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                onClick={calculateLoan}
                startIcon={<CalculateIcon />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 25,
                  backgroundColor: 'primary.main',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  minWidth: '200px',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '&:active': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                Calcular Amortización
              </Button>
            </Box>
          </Grid>

          {/* Botones adicionales */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", mt: 2 }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleFillLoanApplication}
                startIcon={<AssignmentIcon />}
                disabled={!capital || !plazoMeses}
                sx={{ 
                  borderRadius: 20,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  px: 3
                }}
              >
                Llenar Préstamo
              </Button>
              <Button
                variant="outlined"
                onClick={resetCalculator}
                sx={{ 
                  borderRadius: 20,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  px: 3,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'primary.light',
                  }
                }}
              >
                Limpiar
              </Button>
            </Box>
          </Grid>

          {/* Error */}
          {error && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Espaciado adicional entre secciones */}
      <Box sx={{ height: 32 }} />

      {/* Tabla de Amortización - Solo se muestra si hay datos calculados */}
      {amortizationTable && amortizationTable.length > 0 && (
        <Grid item xs={12}>
          <JumboCard
            title="Tabla de Amortización"
            contentWrapper={true}
          >
            <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Cuota</strong></TableCell>
                    <TableCell><strong>Fecha Vencimiento</strong></TableCell>
                    <TableCell align="right"><strong>Cuota Total</strong></TableCell>
                    <TableCell align="right"><strong>Cierre</strong></TableCell>
                    <TableCell align="right"><strong>Seguro</strong></TableCell>
                    <TableCell align="right"><strong>GPS</strong></TableCell>
                    <TableCell align="right"><strong>Capital</strong></TableCell>
                    <TableCell align="right"><strong>Interés</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {amortizationTable.map((row) => (
                    <TableRow key={row.numeroCuota}>
                      <TableCell>{row.numeroCuota}</TableCell>
                      <TableCell>{row.fechaVencimiento}</TableCell>
                      <TableCell align="right">{formatCurrency(row.cuotaTotal)}</TableCell>
                      <TableCell align="right">{formatNumber(row.cierre)}</TableCell>
                      <TableCell align="right">{formatNumber(row.seguro)}</TableCell>
                      <TableCell align="right">{formatNumber(row.gps)}</TableCell>
                      <TableCell align="right">{formatNumber(row.capital)}</TableCell>
                      <TableCell align="right">{formatNumber(row.interes)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </JumboCard>
        </Grid>
      )}

      {/* Espaciado adicional entre secciones */}
      {amortizationTable && amortizationTable.length > 0 && <Box sx={{ height: 32 }} />}

      {/* Resumen del Cálculo - Solo se muestra si hay datos calculados */}
      {summary && (
        <Grid item xs={12}>
          <JumboCard
            title="Resumen del Cálculo"
            contentWrapper={true}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    Capital por Cuota
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {formatNumber(summary.capitalPorCuota)}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    Interés por Cuota
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {formatNumber(summary.interesPorCuota)}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    Cierre por Cuota
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {formatNumber(summary.cierrePorCuota)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Total Pagado
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(summary.totalCuotas)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Total Capital:</strong> {formatCurrency(summary.totalCapital)}<br/>
                    <strong>Total Interés:</strong> {formatCurrency(summary.totalInteres)}<br/>
                    <strong>Total Cierre:</strong> {formatCurrency(summary.totalCierre)}<br/>
                    <strong>Total Seguro:</strong> {formatCurrency(summary.totalSeguro)}<br/>
                    <strong>Total GPS:</strong> {formatCurrency(summary.totalGPS)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </JumboCard>
        </Grid>
      )}
    </Container>
  );
}