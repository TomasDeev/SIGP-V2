import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material";
import { OnboardingAction } from "@app/_components/onboarding/common";
import { JumboCard } from "@jumbo/components";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useUserCompany } from "@app/_hooks/useUserCompany";
import { useNavigate } from "react-router-dom";
import { useOnboardingData } from "../../context/OnboardingDataContext";

const LoanCalculation = () => {
  // Hook para obtener datos de la empresa del usuario
  const { companyData, getDefaults, loading: companyLoading } = useUserCompany();
  
  // Hook para navegación
  const navigate = useNavigate();

  // Hook para el contexto global de onboarding
  const { onboardingData, updateOnboardingData } = useOnboardingData();
  
  // Estados para el formulario
  const [selectedAgent, setSelectedAgent] = useState("");
  const [openAgentDialog, setOpenAgentDialog] = useState(false);
  const [openAmortizationDialog, setOpenAmortizationDialog] = useState(false);
  
  // Estados para datos del agente/suplidor
  const [agentData, setAgentData] = useState({
    cedula: "",
    nombre: "",
    telefono: "",
    direccion: "",
  });

  // Estados para datos básicos del préstamo - inicializar con valores por defecto de la empresa
  const [loanData, setLoanData] = useState({
    capital: "",
    gastoCierre: "",
    tasaInteres: "2.50", // Se actualizará con los valores de la empresa
    cantidadCuotas: "12", // Se actualizará con los valores de la empresa
    fechaContrato: "",
    fechaPrimerPago: "",
  });

  // Estado para la descripción automática del plan de pago
  const [planDescription, setPlanDescription] = useState("");

  // Estados para datos de amortización
  const [amortizationData, setAmortizationData] = useState({
    frecuenciaPago: "Mensual",
    tipo: "Amortización absoluta",
    estado: "Pendiente",
  });

  // Estados para la sección 1.4 - Agregar valor a las cuotas
  const [showAdditionalValues, setShowAdditionalValues] = useState(false);
  const [insuranceData, setInsuranceData] = useState({
    montoSeguro: 0,
    aplicarSeguroDesde: 0,
    aplicarSeguroHasta: 0,
  });
  const [gpsData, setGpsData] = useState({
    montoGps: 0,
    aplicarGpsDesde: 0,
    aplicarGpsHasta: 0,
  });
  const [kogarantiaData, setKogarantiaData] = useState({
  montoKogarantia: 0,
  aplicarKogarantiaDesde: 0,
  aplicarKogarantiaHasta: 0,
});

  // Lista de agentes/suplidores (simulada)
  const [agents] = useState([
    { id: 1, name: "Juan Pérez", cedula: "001-1234567-8" },
    { id: 2, name: "María García", cedula: "001-2345678-9" },
    { id: 3, name: "Carlos López", cedula: "001-3456789-0" },
  ]);

  // Efecto para cargar datos del contexto global
  useEffect(() => {
    if (onboardingData.loanCalculation) {
      const { loanCalculation } = onboardingData;
      
      if (loanCalculation.loanData) {
        setLoanData(loanCalculation.loanData);
      }
      
      if (loanCalculation.agentData) {
        setAgentData(loanCalculation.agentData);
      }
      
      if (loanCalculation.insuranceData) {
        setInsuranceData(loanCalculation.insuranceData);
      }
      
      if (loanCalculation.showAdditionalValues !== undefined) {
        setShowAdditionalValues(loanCalculation.showAdditionalValues);
      }
    }
  }, [onboardingData.loanCalculation]);

  // Efecto para cargar automáticamente los valores por defecto de la empresa
  useEffect(() => {
    if (companyData && !companyLoading) {
      const defaults = getDefaults();
      setLoanData(prev => ({
        ...prev,
        tasaInteres: defaults.interestRate.toString(),
        cantidadCuotas: defaults.installments.toString(),
      }));
    }
  }, [companyData, companyLoading, getDefaults]);

  // Efecto para cargar datos del localStorage cuando se navega desde la calculadora de préstamos
  useEffect(() => {
    try {
      const savedLoanData = localStorage.getItem('loanCalculationData');
      if (savedLoanData) {
        const parsedData = JSON.parse(savedLoanData);
        
        // Mapear los datos de la calculadora a los campos del onboarding-2
        setLoanData(prev => ({
          ...prev,
          capital: parsedData.capital?.toString() || "",
          gastoCierre: parsedData.montoCierre?.toString() || "",
          tasaInteres: parsedData.tasaInteresMensual?.toString() || prev.tasaInteres,
          cantidadCuotas: parsedData.plazoMeses?.toString() || prev.cantidadCuotas,
          fechaContrato: parsedData.fechaInicial || "",
          fechaPrimerPago: parsedData.fechaInicial || "",
        }));

        // Configurar datos de seguro y GPS si están disponibles
        if (parsedData.tieneSeguro) {
          setShowAdditionalValues(true);
          setInsuranceData({
            montoSeguro: parsedData.montoTotalSeguro || 0,
            aplicarSeguroDesde: 1,
            aplicarSeguroHasta: parsedData.plazoMeses || 12,
          });
        }

        if (parsedData.tieneGPS) {
          setShowAdditionalValues(true);
          setGpsData({
            montoGps: parsedData.montoTotalGPS || 0,
            aplicarGpsDesde: 1,
            aplicarGpsHasta: parsedData.plazoMeses || 12,
          });
        }

        // Limpiar los datos del localStorage después de usarlos
        localStorage.removeItem('loanCalculationData');
      }
    } catch (error) {
      console.error('Error al cargar datos de la calculadora:', error);
    }
  }, []); // Solo ejecutar una vez al montar el componente

  // Efecto para calcular automáticamente el gasto de cierre cuando cambie el capital
  useEffect(() => {
    if (loanData.capital && !isNaN(parseFloat(loanData.capital))) {
      const capitalValue = parseFloat(loanData.capital);
      const defaults = getDefaults();
      const closingCostPercentage = defaults.closingCosts / 100; // Convertir porcentaje a decimal
      const gastoCierreCalculado = (capitalValue * closingCostPercentage).toFixed(2);
      setLoanData(prev => ({
        ...prev,
        gastoCierre: gastoCierreCalculado
      }));
    }
  }, [loanData.capital, getDefaults]);

  // Función para generar la descripción automática del plan de pago
  const generatePlanDescription = () => {
    const capitalNum = parseFloat(loanData.capital) || 0;
    const plazoNum = parseInt(loanData.cantidadCuotas) || 12;
    const tasaNum = parseFloat(loanData.tasaInteres) || 0;
    const cierreNum = parseFloat(loanData.gastoCierre) || 0;
    const roundMultipleNum = 10;
    const seguroNum = parseFloat(insuranceData.montoSeguro) / plazoNum || 0;
    const gpsNum = parseFloat(gpsData.montoGps) / plazoNum || 0;
    
    if (capitalNum === 0) return "";

    // Usar la misma lógica que loan-calculator
    const interesBase = (capitalNum + cierreNum) * (tasaNum / 100);
    const capitalExacto = capitalNum / plazoNum;
    const cierreExacto = cierreNum / plazoNum;
    
    // Calcular cuota preliminar (para cuotas regulares)
    const cuotaPreliminar = capitalExacto + cierreExacto + interesBase + seguroNum + gpsNum;
    const cuotaMensual = roundToNearestMultiple(cuotaPreliminar, roundMultipleNum);
    
    // Formatear la descripción
    const cuotaFormateada = cuotaMensual.toLocaleString('es-DO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return `${plazoNum} Cuotas En Total: ${plazoNum} De ${cuotaFormateada}`;
  };

  // Efecto para actualizar la descripción automáticamente
  useEffect(() => {
    const description = generatePlanDescription();
    setPlanDescription(description);
  }, [loanData.capital, loanData.cantidadCuotas, loanData.tasaInteres]);

  // Función para actualizar el contexto global
  const updateContext = (newData) => {
    updateOnboardingData({
      loanCalculation: {
        ...onboardingData.loanCalculation,
        ...newData
      }
    });
  };

  // Función para manejar cambios en loanData
  const handleLoanDataChange = (field, value) => {
    const newLoanData = { ...loanData, [field]: value };
    setLoanData(newLoanData);
    updateContext({ loanData: newLoanData });
  };

  // Función para manejar cambios en agentData
  const handleAgentDataChange = (field, value) => {
    const newAgentData = { ...agentData, [field]: value };
    setAgentData(newAgentData);
    updateContext({ agentData: newAgentData });
  };

  // Función para manejar cambios en insuranceData
  const handleInsuranceDataChange = (field, value) => {
    const newInsuranceData = { ...insuranceData, [field]: value };
    setInsuranceData(newInsuranceData);
    updateContext({ insuranceData: newInsuranceData });
  };

  // Función para manejar el guardado del agente
  const handleSaveAgent = () => {
    // Aquí se guardaría el nuevo agente
    console.log("Guardando agente:", agentData);
    setOpenAgentDialog(false);
    // Reset form
    setAgentData({
      cedula: "",
      nombre: "",
      telefono: "",
      direccion: "",
    });
  };

  // Función para calcular el total de seguro
  const calculateTotalInsurance = () => {
    const { montoSeguro, aplicarSeguroDesde, aplicarSeguroHasta } = insuranceData;
    const cantidadCuotas = parseInt(loanData.cantidadCuotas) || 12;
    
    if (montoSeguro === 0) return 0;
    
    const desde = Math.max(1, aplicarSeguroDesde || 1);
    const hasta = Math.min(cantidadCuotas, aplicarSeguroHasta || cantidadCuotas);
    const cuotasConSeguro = Math.max(0, hasta - desde + 1);
    
    return montoSeguro * cuotasConSeguro;
  };

  // Función para calcular el total de GPS
  const calculateTotalGps = () => {
    const { montoGps, aplicarGpsDesde, aplicarGpsHasta } = gpsData;
    const cantidadCuotas = parseInt(loanData.cantidadCuotas) || 12;
    
    if (montoGps === 0) return 0;
    
    const desde = Math.max(1, aplicarGpsDesde || 1);
    const hasta = Math.min(cantidadCuotas, aplicarGpsHasta || cantidadCuotas);
    const cuotasConGps = Math.max(0, hasta - desde + 1);
    
    return montoGps * cuotasConGps;
  };

  // Funciones auxiliares para redondeo (igual que en loan-calculator)
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

  const roundTo2Decimals = (value) => {
    return Math.round(value * 100) / 100;
  };

  // Función para generar datos de amortización (usando la misma lógica que loan-calculator)
  const generateAmortizationData = () => {
    const capitalNum = parseFloat(loanData.capital) || 0;
    const plazoNum = parseInt(loanData.cantidadCuotas) || 12;
    const tasaNum = parseFloat(loanData.tasaInteres) || 0;
    const cierreNum = parseFloat(loanData.gastoCierre) || 0;
    const roundMultipleNum = 10; // Valor por defecto para redondeo
    const seguroNum = parseFloat(insuranceData.montoSeguro) / plazoNum || 0;
    const gpsNum = parseFloat(gpsData.montoGps) / plazoNum || 0;
    
    if (capitalNum === 0) return [];

    // Cálculos según las reglas del sistema de referencia (igual que loan-calculator)
    
    // 1. Base de interés: (capital + cierre_total) * (tasa_mensual_percent / 100)
    const interesBase = (capitalNum + cierreNum) * (tasaNum / 100);
    
    // 2. Capital por cuota (exacto)
    const capitalExacto = capitalNum / plazoNum;
    
    // 3. Cierre por cuota (exacto)
    const cierreExacto = cierreNum / plazoNum;

    // Crear tabla de amortización
    const tabla = [];
    const fechaBase = new Date(loanData.fechaContrato || new Date());
    
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
        cuota: i,
        cuotaMensual: cuotaMostrada.toFixed(2),
        capital: capitalCuota.toFixed(2),
        interes: interesMostrado.toFixed(2),
        saldoPendiente: (capitalNum - totalCapitalPagado).toFixed(2),
        cierre: cierreCuota.toFixed(2),
        seguro: seguroNum.toFixed(2),
        gps: gpsNum.toFixed(2),
        fechaVencimiento: fechaVencimiento.toLocaleDateString('es-ES'),
      });
    }

    return tabla;
  };

  const amortizationTable = generateAmortizationData();

  // Función para transferir datos a la solicitud de crédito
  const handleFillLoanApplication = () => {
    // Preparar los datos calculados para transferir
    const loanCalculationData = {
      capital: parseFloat(loanData.capital) || 0,
      gastoCierre: parseFloat(loanData.gastoCierre) || 0,
      tasaInteres: parseFloat(loanData.tasaInteres) || 0,
      cantidadCuotas: parseInt(loanData.cantidadCuotas) || 12,
      fechaContrato: loanData.fechaContrato,
      fechaPrimerPago: loanData.fechaPrimerPago,
      // Datos de seguro y GPS
      tieneSeguro: showAdditionalValues && insuranceData.montoSeguro > 0,
      montoSeguro: insuranceData.montoSeguro || 0,
      tieneGps: showAdditionalValues && gpsData.montoGps > 0,
      montoGps: gpsData.montoGps || 0,
      // Totales calculados
      totalSeguro: calculateTotalInsurance(),
      totalGps: calculateTotalGps(),
      // Datos de amortización
      amortizationTable: amortizationTable,
      planDescription: planDescription
    };

    // Guardar los datos en localStorage para transferir entre páginas
    localStorage.setItem('loanCalculationData', JSON.stringify(loanCalculationData));
    
    // Navegar a la página de solicitud de crédito
    navigate('/tools/credit-application');
  };

  return (
    <React.Fragment>
      <JumboCard
        title="Paso 1 - Cálculo"
        subheader="Complete la información para el cálculo del préstamo"
        contentWrapper
        sx={{ mb: 4 }}
      >
        {/* Sección 1.1 - Agente o Suplidor */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1.5, color: "primary.main" }}>
            1.1 Agente o Suplidor
          </Typography>
          <Box sx={{ mb: 1 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setOpenAgentDialog(true)}
              sx={{
                backgroundColor: '#4caf50',
                '&:hover': {
                  backgroundColor: '#45a049',
                },
                fontSize: '0.75rem',
                padding: '4px 8px',
              }}
            >
              Agregar Nuevo
            </Button>
          </Box>
          <FormControl fullWidth size="small">
            <InputLabel>Seleccionar Agente o Suplidor</InputLabel>
            <Select
              value={selectedAgent}
              label="Seleccionar Agente o Suplidor"
              onChange={(e) => setSelectedAgent(e.target.value)}
            >
              {agents.map((agent) => (
                <MenuItem key={agent.id} value={agent.id}>
                  {agent.name} - {agent.cedula}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Sección 1.2 - Datos básicos del préstamo */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1.5, color: "primary.main" }}>
            1.2 Datos básicos del préstamo
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Capital"
                type="number"
                value={loanData.capital}
                onChange={(e) => handleLoanDataChange('capital', e.target.value)}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1, fontSize: '0.875rem' }}>RD$</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Gasto por cierre"
                type="number"
                value={loanData.gastoCierre}
                onChange={(e) => handleLoanDataChange('gastoCierre', e.target.value)}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1, fontSize: '0.875rem' }}>RD$</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Tasa de interés"
                type="number"
                value={loanData.tasaInteres}
                onChange={(e) => handleLoanDataChange('tasaInteres', e.target.value)}
                InputProps={{
                  endAdornment: <Typography sx={{ ml: 1, fontSize: '0.875rem' }}>%</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Cantidad de cuotas"
                type="number"
                value={loanData.cantidadCuotas}
                onChange={(e) => handleLoanDataChange('cantidadCuotas', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Fecha del contrato"
                type="date"
                value={loanData.fechaContrato}
                onChange={(e) => handleLoanDataChange('fechaContrato', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Fecha primer pago"
                type="date"
                value={loanData.fechaPrimerPago}
                onChange={(e) => handleLoanDataChange('fechaPrimerPago', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Sección 1.3 - Plan De Pago */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1.5, color: "primary.main" }}>
            1.3 Plan De Pago
          </Typography>

          <TextField
            fullWidth
            size="small"
            label="Descripción personalizada (opcional)"
            multiline
            rows={2}
            placeholder="Puede agregar información adicional del plan de pago..."
            value={planDescription}
            onChange={(e) => setPlanDescription(e.target.value)}
            helperText="La descripción se genera automáticamente basada en los datos del préstamo. Puede editarla si lo desea."
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Sección 1.4 - Agregar valor a las cuotas */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 2 }}>
            <Typography variant="h6" sx={{ color: "primary.main" }}>
              1.4 Agregar valor a las cuotas
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showAdditionalValues}
                  onChange={(e) => setShowAdditionalValues(e.target.checked)}
                  color="primary"
                />
              }
              label="Mostrar"
            />
          </Box>

          {showAdditionalValues && (
            <Grid container spacing={2}>
              {/* Sección de Kogarantía */}
<Grid item xs={12}>
  <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 'bold', color: "secondary.main" }}>
    Kogarantía
  </Typography>
  <Grid container spacing={2}>
    <Grid item xs={12} md={3}>
      <TextField
        fullWidth
        size="small"
        label="Monto Kogarantía"
        type="number"
        value={kogarantiaData.montoKogarantia}
        onChange={(e) => setKogarantiaData({ ...kogarantiaData, montoKogarantia: parseFloat(e.target.value) || 0 })}
        InputProps={{
          startAdornment: <Typography sx={{ mr: 1, fontSize: '0.875rem' }}>RD$</Typography>,
        }}
      />
    </Grid>
    <Grid item xs={12} md={3}>
      <TextField
        fullWidth
        size="small"
        label="Aplicar Kogarantía desde cuota..."
        type="number"
        value={kogarantiaData.aplicarKogarantiaDesde}
        onChange={(e) => setKogarantiaData({ ...kogarantiaData, aplicarKogarantiaDesde: parseInt(e.target.value) || 0 })}
        inputProps={{ min: 1, max: parseInt(loanData.cantidadCuotas) || 12 }}
      />
    </Grid>
    <Grid item xs={12} md={3}>
      <TextField
        fullWidth
        size="small"
        label="Aplicar Kogarantía hasta cuota..."
        type="number"
        value={kogarantiaData.aplicarKogarantiaHasta}
        onChange={(e) => setKogarantiaData({ ...kogarantiaData, aplicarKogarantiaHasta: parseInt(e.target.value) || 0 })}
        inputProps={{ min: 1, max: parseInt(loanData.cantidadCuotas) || 12 }}
      />
    </Grid>
    <Grid item xs={12} md={3}>
      <TextField
        fullWidth
        size="small"
        label="Total Kogarantía"
        value={`RD$ ${calculateTotalKogarantia().toFixed(2)}`}
        InputProps={{
          readOnly: true,
        }}
        sx={{
          '& .MuiInputBase-input': {
            backgroundColor: '#f5f5f5',
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }
        }}
      />
    </Grid>
  </Grid>
</Grid>


              {/* Sección de Seguro */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 'bold', color: "secondary.main" }}>
                  Seguro
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Monto Seguro"
                      type="number"
                      value={insuranceData.montoSeguro}
                      onChange={(e) => handleInsuranceDataChange('montoSeguro', parseFloat(e.target.value) || 0)}
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, fontSize: '0.875rem' }}>RD$</Typography>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Aplicar seguro desde cuota..."
                      type="number"
                      value={insuranceData.aplicarSeguroDesde}
                      onChange={(e) => handleInsuranceDataChange('aplicarSeguroDesde', parseInt(e.target.value) || 0)}
                      inputProps={{ min: 1, max: parseInt(loanData.cantidadCuotas) || 12 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Aplicar seguro hasta cuota..."
                      type="number"
                      value={insuranceData.aplicarSeguroHasta}
                      onChange={(e) => handleInsuranceDataChange('aplicarSeguroHasta', parseInt(e.target.value) || 0)}
                      inputProps={{ min: 1, max: parseInt(loanData.cantidadCuotas) || 12 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Total seguro"
                      value={`RD$ ${calculateTotalInsurance().toFixed(2)}`}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          backgroundColor: '#f5f5f5',
                          fontWeight: 'bold',
                          fontSize: '0.875rem'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Sección de GPS */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 'bold', color: "secondary.main" }}>
                  GPS
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Monto GPS"
                      type="number"
                      value={gpsData.montoGps}
                      onChange={(e) => setGpsData({ ...gpsData, montoGps: parseFloat(e.target.value) || 0 })}
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, fontSize: '0.875rem' }}>RD$</Typography>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Aplicar GPS desde cuota..."
                      type="number"
                      value={gpsData.aplicarGpsDesde}
                      onChange={(e) => setGpsData({ ...gpsData, aplicarGpsDesde: parseInt(e.target.value) || 0 })}
                      inputProps={{ min: 1, max: parseInt(loanData.cantidadCuotas) || 12 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Aplicar GPS hasta cuota..."
                      type="number"
                      value={gpsData.aplicarGpsHasta}
                      onChange={(e) => setGpsData({ ...gpsData, aplicarGpsHasta: parseInt(e.target.value) || 0 })}
                      inputProps={{ min: 1, max: parseInt(loanData.cantidadCuotas) || 12 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Total GPS"
                      value={`RD$ ${calculateTotalGps().toFixed(2)}`}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          backgroundColor: '#f5f5f5',
                          fontWeight: 'bold',
                          fontSize: '0.875rem'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Sección 1.5 - Datos de la amortización */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            1.5 Datos de la amortización
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Frecuencia de pago</InputLabel>
                <Select
                  value={amortizationData.frecuenciaPago}
                  label="Frecuencia de pago"
                  onChange={(e) => setAmortizationData({ ...amortizationData, frecuenciaPago: e.target.value })}
                >
                  <MenuItem value="Mensual">Mensual</MenuItem>
                  <MenuItem value="Quincenal">Quincenal</MenuItem>
                  <MenuItem value="Semanal">Semanal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={amortizationData.tipo}
                  label="Tipo"
                  onChange={(e) => setAmortizationData({ ...amortizationData, tipo: e.target.value })}
                >
                  <MenuItem value="Amortización absoluta">Amortización absoluta</MenuItem>
                  <MenuItem value="Amortización francesa">Amortización francesa</MenuItem>
                  <MenuItem value="Amortización alemana">Amortización alemana</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={amortizationData.estado}
                  label="Estado"
                  onChange={(e) => setAmortizationData({ ...amortizationData, estado: e.target.value })}
                  disabled
                >
                  <MenuItem value="Pendiente">Pendiente</MenuItem>
                  <MenuItem value="Aprobado">Aprobado</MenuItem>
                  <MenuItem value="Rechazado">Rechazado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={() => setOpenAmortizationDialog(true)}
              disabled={!loanData.capital || !loanData.cantidadCuotas}
              sx={{
                fontSize: '0.75rem',
                py: 0.5,
                px: 1.5,
                minHeight: 'auto',
                '& .MuiSvgIcon-root': {
                  fontSize: '1rem'
                }
              }}
            >
              Ver Amortización
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<AssignmentIcon />}
              onClick={handleFillLoanApplication}
              disabled={!loanData.capital || !loanData.cantidadCuotas}
              sx={{
                fontSize: '0.75rem',
                py: 0.5,
                px: 1.5,
                minHeight: 'auto',
                backgroundColor: '#4caf50',
                '&:hover': {
                  backgroundColor: '#45a049',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '1rem'
                }
              }}
            >
              Llenar Préstamo
            </Button>
          </Box>
        </Box>

        <OnboardingAction />
      </JumboCard>

      {/* Dialog para agregar agente/suplidor */}
      <Dialog open={openAgentDialog} onClose={() => setOpenAgentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Nuevo Agente o Suplidor</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cédula"
                value={agentData.cedula}
                onChange={(e) => handleAgentDataChange('cedula', e.target.value)}
                placeholder="001-1234567-8"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                value={agentData.nombre}
                onChange={(e) => handleAgentDataChange('nombre', e.target.value)}
                placeholder="Nombre completo"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Teléfono"
                value={agentData.telefono}
                onChange={(e) => handleAgentDataChange('telefono', e.target.value)}
                placeholder="809-123-4567"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                value={agentData.direccion}
                onChange={(e) => handleAgentDataChange('direccion', e.target.value)}
                placeholder="Dirección completa"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            size="small"
            onClick={() => setOpenAgentDialog(false)}
            sx={{ fontSize: '0.875rem' }}
          >
            Cancelar
          </Button>
          <Button 
            size="small"
            onClick={handleSaveAgent} 
            variant="contained"
            sx={{ fontSize: '0.875rem' }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para ver amortización */}
      <Dialog open={openAmortizationDialog} onClose={() => setOpenAmortizationDialog(false)} maxWidth="xl" fullWidth>
        <DialogTitle sx={{ 
          backgroundColor: 'primary.main', 
          color: 'white', 
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          Tabla de Amortización
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {/* Resumen de información del préstamo */}
          <Box sx={{ 
            mb: 3, 
            p: 3, 
            backgroundColor: '#ffffff', 
            borderRadius: 1,
            border: '1px solid #d0d7de',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h6" sx={{ 
              mb: 3, 
              color: '#24292f', 
              fontWeight: 600,
              fontSize: '1.1rem',
              borderBottom: '1px solid #d0d7de',
              pb: 1
            }}>
              Resumen del Préstamo
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" sx={{ color: '#656d76', fontSize: '0.875rem', mb: 0.5 }}>
                  Capital
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: '#24292f',
                  fontSize: '1.1rem'
                }}>
                  RD$ {parseFloat(loanData.capital || 0).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" sx={{ color: '#656d76', fontSize: '0.875rem', mb: 0.5 }}>
                  Tasa de Interés
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: '#24292f',
                  fontSize: '1.1rem'
                }}>
                  {loanData.tasaInteres}%
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" sx={{ color: '#656d76', fontSize: '0.875rem', mb: 0.5 }}>
                  Número de Cuotas
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: '#24292f',
                  fontSize: '1.1rem'
                }}>
                  {loanData.cantidadCuotas}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" sx={{ color: '#656d76', fontSize: '0.875rem', mb: 0.5 }}>
                  Gastos de Cierre
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: '#24292f',
                  fontSize: '1.1rem'
                }}>
                  RD$ {parseFloat(loanData.gastoCierre || 0).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <TableContainer 
            component={Paper} 
            sx={{ 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderRadius: 1,
              overflow: 'hidden',
              border: '1px solid #d0d7de'
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f6f8fa' }}>
                  <TableCell sx={{ 
                    color: '#24292f', 
                    fontWeight: 600, 
                    fontSize: '0.875rem',
                    textAlign: 'center',
                    borderBottom: '1px solid #d0d7de',
                    py: 2
                  }}>
                    No.
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: '#24292f', 
                    fontWeight: 600, 
                    fontSize: '0.875rem',
                    borderBottom: '1px solid #d0d7de',
                    py: 2
                  }}>
                    Cuota Mensual
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: '#24292f', 
                    fontWeight: 600, 
                    fontSize: '0.875rem',
                    borderBottom: '1px solid #d0d7de',
                    py: 2
                  }}>
                    Abono a Capital
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: '#24292f', 
                    fontWeight: 600, 
                    fontSize: '0.875rem',
                    borderBottom: '1px solid #d0d7de',
                    py: 2
                  }}>
                    Cierre
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: '#24292f', 
                    fontWeight: 600, 
                    fontSize: '0.875rem',
                    borderBottom: '1px solid #d0d7de',
                    py: 2
                  }}>
                    Interés
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: '#24292f', 
                    fontWeight: 600, 
                    fontSize: '0.875rem',
                    borderBottom: '1px solid #d0d7de',
                    py: 2
                  }}>
                    Seguro
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: '#24292f', 
                    fontWeight: 600, 
                    fontSize: '0.875rem',
                    borderBottom: '1px solid #d0d7de',
                    py: 2
                  }}>
                    GPS
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    color: '#24292f', 
                    fontWeight: 600, 
                    fontSize: '0.875rem',
                    borderBottom: '1px solid #d0d7de',
                    py: 2
                  }}>
                    Saldo Pendiente
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {amortizationTable.map((row, index) => (
                  <TableRow 
                    key={index}
                    sx={{ 
                      '&:nth-of-type(odd)': { 
                        backgroundColor: '#f6f8fa' 
                      },
                      '&:hover': { 
                        backgroundColor: '#f1f8ff'
                      },
                      borderBottom: '1px solid #d0d7de'
                    }}
                  >
                    <TableCell sx={{ 
                      textAlign: 'center', 
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      color: '#24292f',
                      py: 1.5
                    }}>
                      {row.cuota}
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#24292f',
                      py: 1.5
                    }}>
                      RD$ {parseFloat(row.cuotaMensual).toLocaleString('es-DO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      fontWeight: 400,
                      fontSize: '0.875rem',
                      color: '#656d76',
                      py: 1.5
                    }}>
                      RD$ {parseFloat(row.capital).toLocaleString('es-DO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      fontWeight: 400,
                      fontSize: '0.875rem',
                      color: '#656d76',
                      py: 1.5
                    }}>
                      RD$ {parseFloat(row.cierre || 0).toLocaleString('es-DO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      fontWeight: 400,
                      fontSize: '0.875rem',
                      color: '#656d76',
                      py: 1.5
                    }}>
                      RD$ {parseFloat(row.interes).toLocaleString('es-DO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      fontWeight: 400,
                      fontSize: '0.875rem',
                      color: '#656d76',
                      py: 1.5
                    }}>
                      RD$ {parseFloat(row.seguro || 0).toLocaleString('es-DO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      fontWeight: 400,
                      fontSize: '0.875rem',
                      color: '#656d76',
                      py: 1.5
                    }}>
                      RD$ {parseFloat(row.gps || 0).toLocaleString('es-DO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      color: parseFloat(row.saldoPendiente) === 0 ? '#1a7f37' : '#24292f',
                      py: 1.5
                    }}>
                      RD$ {parseFloat(row.saldoPendiente).toLocaleString('es-DO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>


        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
          <Button 
            onClick={() => setOpenAmortizationDialog(false)}
            variant="outlined"
            size="small"
            sx={{ 
              minWidth: 100,
              fontWeight: 500,
              fontSize: '0.875rem',
              py: 1,
              px: 2
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export { LoanCalculation };