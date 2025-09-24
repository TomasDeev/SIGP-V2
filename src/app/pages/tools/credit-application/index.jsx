import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Stack,
  Avatar,
  Tooltip,
  Menu,
  TablePagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccountBalance as BankIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Security as SecurityIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  MoreVert as MoreVertIcon,
  BugReport as BugReportIcon,
  AccountBalanceWallet as AccountingIcon,
  CloudUpload as UploadIcon,
  Print as PrintIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { JumboCard } from "@jumbo/components";


const generateSampleData = () => {
  
  const datosReales = [
    {
      id: '108159',
      fecha: '20/09/2025',
      cliente: 'JULIO MANUEL DANIEL',
      cedula: '001-1234567-9',
      telefono: '(809) 555-1239',
      monto: 500000,
      garantia: 'HONDA CIVIC EX 2016',
      proveedor: 'NINGUNO',
      localizacion: 'SanIsidro',
      estado: 'Vendido'
    },
    {
      id: '108155',
      fecha: '20/09/2025',
      cliente: 'JUAN UREÑA BAUTISTA',
      cedula: '001-1234567-8',
      telefono: '(809) 555-1234',
      monto: 200000,
      garantia: 'PRESTAMO CON PAGARE NOTARIAL',
      proveedor: 'WALQUIDIA GUZMAN',
      localizacion: 'Ozama',
      estado: 'En contabilidad'
    },
    {
      id: '108154',
      fecha: '20/09/2025',
      cliente: 'CONSTUCTORA YIRI YIRI',
      cedula: '131-0123456-7',
      telefono: '(829) 555-1254',
      monto: 3000000,
      garantia: 'PRESTAMO CON PAGARE NOTARIAL',
      proveedor: 'WALQUIDIA GUZMAN',
      localizacion: 'Ozama',
      estado: 'En Evaluacion'
    },
    {
      id: '108153',
      fecha: '20/09/2025',
      cliente: 'CARLOS DAVID CABRERA POLANCO',
      cedula: '001-2345678-9',
      telefono: '(809) 555-1253',
      monto: 350000,
      garantia: 'HONDA ACCORD LX 2014',
      proveedor: 'NINGUNO',
      localizacion: 'Costa Rica',
      estado: 'En Solicitud'
    },
    {
      id: '108152',
      fecha: '20/09/2025',
      cliente: 'CONSTUCTORA YIRI YIRI',
      cedula: '131-0123456-7',
      telefono: '(829) 555-1254',
      monto: 2000000,
      garantia: 'PRESTAMO CON PAGARE NOTARIAL',
      proveedor: 'WALQUIDIA GUZMAN',
      localizacion: 'Charles',
      estado: 'Aprobado'
    },
    {
      id: '108151',
      fecha: '20/09/2025',
      cliente: 'RAFEL SANTIAGO CASTELLANOS SURIEL',
      cedula: '001-3456789-0',
      telefono: '(809) 555-1251',
      monto: 350000,
      garantia: 'HONDA CIVIC EX-L 2013',
      proveedor: 'NINGUNO',
      localizacion: 'Costa Rica',
      estado: 'Declinado'
    },
    {
      id: '108150',
      fecha: '29/09/2025',
      cliente: 'HICELA MONTERO MEDINA',
      cedula: '001-4567890-1',
      telefono: '(809) 555-1250',
      monto: 380000,
      garantia: 'HYUNDAI SONATA LF 2019',
      proveedor: 'TORRE FORUM',
      localizacion: 'Forum27',
      estado: 'Aprobado'
    },
    {
      id: '108149',
      fecha: '19/09/2025',
      cliente: 'RONI LUNA TORRES',
      cedula: '001-5678901-2',
      telefono: '(829) 555-1249',
      monto: 180000,
      garantia: 'HYUNDAI SONATA Y20 2013',
      proveedor: 'NINGUNO',
      localizacion: 'Zambvka',
      estado: 'Aprobado'
    }
  ];

  // Nombres adicionales para completar los datos
  const nombresAdicionales = [
    'MARÍA ELENA SANTOS PÉREZ', 'JOSÉ ANTONIO GARCÍA LÓPEZ', 'CARMEN ROSA JIMÉNEZ',
    'FRANCISCO JAVIER SÁNCHEZ MARTÍN', 'ISABEL CRISTINA GONZÁLEZ RUIZ', 'ANTONIO MIGUEL HERNÁNDEZ',
    'PILAR MERCEDES JIMÉNEZ MORENO', 'MANUEL ALBERTO ÁLVAREZ CASTRO', 'ROSA MARÍA ROMERO ORTEGA',
    'PEDRO LUIS DELGADO RAMOS', 'LUCÍA ESPERANZA VARGAS HERRERA', 'MIGUEL ÁNGEL TORRES IGLESIAS',
    'ELENA PATRICIA RAMÍREZ VEGA', 'RAFAEL DOMINGO FLORES MEDINA', 'CRISTINA BEATRIZ GUERRERO',
    'ALEJANDRO JOSÉ PEÑA CORTÉS', 'BEATRIZ ALTAGRACIA MENDOZA', 'SERGIO RAFAEL AGUILAR NAVARRO',
    'NATALIA MERCEDES CABRERA MORALES', 'DIEGO ANTONIO HERRERA CAMPOS', 'MÓNICA ELIZABETH VÁZQUEZ',
    'RUBÉN FRANCISCO CASTILLO PRIETO', 'ANDREA CAROLINA IGLESIAS SOTO', 'JAVIER EDUARDO MÉNDEZ',
    'SILVIA MARÍA PASCUAL FERRER', 'ÓSCAR LUIS SANTANA MARÍN', 'VERÓNICA ROSA MOLINA CANO'
  ];

  const proveedores = ['WALQUIDIA GUZMAN', 'NINGUNO', 'TORRE FORUM', 'MARÍA JOSÉ PEÑA', 'CARLOS ALBERTO SANTOS'];
  
  const ciudades = ['Ozama', 'SanIsidro', 'Costa Rica', 'Charles', 'Forum27', 'Zambvka', 'Santiago', 'La Romana'];
  
  const estados = ['En Solicitud', 'En Evaluacion', 'Declinado', 'Aprobado', 'En contabilidad', 'Vendido'];
  
  const garantias = [
    'PRESTAMO CON PAGARE NOTARIAL',
    'HONDA CIVIC EX 2016', 'HONDA ACCORD LX 2014', 'HONDA CIVIC EX-L 2013',
    'HYUNDAI SONATA LF 2019', 'HYUNDAI SONATA Y20 2013',
    'TOYOTA COROLLA LE 2018', 'NISSAN SENTRA SV 2017', 'KIA FORTE LX 2020',
    'MITSUBISHI LANCER ES 2015', 'CHEVROLET CRUZE LT 2019'
  ];

  const data = [...datosReales];

  // Generar datos adicionales para completar hasta 75 registros
  for (let i = datosReales.length; i < 75; i++) {
    const año = Math.random() > 0.7 ? 2024 : 2025;
    const mes = Math.floor(Math.random() * 12);
    const día = Math.floor(Math.random() * 28) + 1;
    const fecha = new Date(año, mes, día);
    
    data.push({
      id: `${108100 + i}`,
      fecha: fecha.toLocaleDateString('es-DO', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }),
      cliente: nombresAdicionales[Math.floor(Math.random() * nombresAdicionales.length)],
      cedula: `001-${String(1000000 + i).slice(1)}-${Math.floor(Math.random() * 10)}`,
      telefono: `(${Math.random() > 0.5 ? '809' : '829'}) 555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      monto: Math.floor(Math.random() * 2800000) + 180000, // Montos entre 180K y 3M
      garantia: garantias[Math.floor(Math.random() * garantias.length)],
      proveedor: proveedores[Math.floor(Math.random() * proveedores.length)],
      localizacion: ciudades[Math.floor(Math.random() * ciudades.length)],
      estado: estados[Math.floor(Math.random() * estados.length)]
    });
  }
  
  return data;
};

const initialApplications = generateSampleData();

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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function CreditApplicationPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState(initialApplications);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [formData, setFormData] = useState({
    cliente: "",
    cedula: "",
    telefono: "",
    monto: "",
    garantia: "",
    proveedor: "",
    localizacion: "",
    ingresos: "",
    proposito: "",
  });

  // Estado para almacenar datos de la calculadora de préstamos
  const [loanCalculationData, setLoanCalculationData] = useState(null);

  // useEffect para cargar datos de la calculadora de préstamos si existen
  useEffect(() => {
    const savedLoanData = localStorage.getItem('loanCalculationData');
    if (savedLoanData) {
      try {
        const parsedData = JSON.parse(savedLoanData);
        setLoanCalculationData(parsedData);
        
        // Pre-llenar el formulario con los datos de la calculadora
        setFormData(prev => ({
          ...prev,
          monto: parsedData.capital ? parsedData.capital.toString() : "",
          // Agregar información adicional en el propósito
          proposito: `Préstamo calculado con los siguientes parámetros:\n` +
                    `- Capital: RD$ ${(parsedData.capital || 0).toLocaleString()}\n` +
                    `- Tasa de interés: ${parsedData.tasaInteresMensual || 0}%\n` +
                    `- Plazo: ${parsedData.plazoMeses || 0} cuotas\n` +
                    `- Gastos de cierre: RD$ ${(parsedData.montoCierre || 0).toLocaleString()}\n` +
                    `${parsedData.tieneSeguro ? `- Seguro: RD$ ${(parsedData.montoTotalSeguro || 0).toLocaleString()}\n` : ''}` +
                    `${parsedData.tieneGPS ? `- GPS: RD$ ${(parsedData.montoTotalGPS || 0).toLocaleString()}\n` : ''}` +
                    `\nResumen de cálculos disponible en la tabla de amortización.`
        }));

        // Limpiar los datos del localStorage después de usarlos
        localStorage.removeItem('loanCalculationData');
        
        // Abrir automáticamente el diálogo para crear nueva solicitud
        setOpenDialog(true);
      } catch (error) {
        console.error('Error al cargar datos de la calculadora:', error);
      }
    }
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      cliente: "",
      cedula: "",
      telefono: "",
      monto: "",
      garantia: "",
      proveedor: "",
      localizacion: "",
      ingresos: "",
      proposito: "",
    });
  };

  const handleMenuClick = (event, application) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(application);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleMenuOption = (option) => {
    console.log(`Opción seleccionada: ${option} para solicitud: ${selectedRow?.id} - Cliente: ${selectedRow?.cliente}`);
    
    handleMenuClose();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = () => {
    const currentYear = new Date().getFullYear();
    const nextNumber = String(applications.length + 6).padStart(3, '0');
    
    const newApplication = {
      id: `SOL-${currentYear}-${nextNumber}`,
      fecha: new Date().toISOString().split("T")[0],
      cliente: formData.cliente,
      cedula: formData.cedula,
      telefono: formData.telefono,
      monto: parseFloat(formData.monto),
      garantia: formData.garantia,
      estado: "En Proceso",
      proveedor: formData.proveedor,
      localizacion: formData.localizacion,
      ingresos: parseFloat(formData.ingresos),
      proposito: formData.proposito,
    };

    setApplications([newApplication, ...applications]);
    handleCloseDialog();
  };

  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        width: '100%',
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        <Box sx={{ 
          width: '100%', 
          maxWidth: '1400px',
          mx: 'auto'
        }}>
          <Card sx={{ 
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            borderRadius: 2
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Explorador Solicitudes
                </Typography>
                
                {/* Controles: Filtros y Botón Nuevo */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Sucursales</InputLabel>
                    <Select
                      value={selectedBranch}
                      label="Sucursales"
                      onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                      <MenuItem value="">Todas</MenuItem>
                      <MenuItem value="sucursal1">Centro</MenuItem>
                      <MenuItem value="sucursal2">Norte</MenuItem>
                      <MenuItem value="sucursal3">Sur</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={selectedStatus}
                      label="Estado"
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="En Solicitud">En Solicitud</MenuItem>
                      <MenuItem value="En Evaluacion">En Evaluación</MenuItem>
                      <MenuItem value="Declinado">Declinado</MenuItem>
                      <MenuItem value="Aprobado">Aprobado</MenuItem>
                      <MenuItem value="En contabilidad">En contabilidad</MenuItem>
                      <MenuItem value="Vendido">Vendido</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/onboarding-2')}
                    sx={{ 
                      backgroundColor: '#4caf50', 
                      '&:hover': { backgroundColor: '#45a049' },
                      px: 2,
                      py: 1
                    }}
                  >
                    Nuevo
                  </Button>
                </Box>
              </Box>
              <JumboCard>
                <TableContainer sx={{ 
                  height: '50vh', 
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  },
                  '-ms-overflow-style': 'none',
                  'scrollbar-width': 'none'
                }}>
                  <Table sx={{ minWidth: 1200 }} stickyHeader>
                    <TableHead>
                      <TableRow sx={{ 
                        '& .MuiTableCell-head': {
                          backgroundColor: '#f5f5f5',
                          fontWeight: 600,
                          borderBottom: '2px solid #e0e0e0',
                          zIndex: 1
                        }
                      }}>
                        <TableCell>No</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Monto</TableCell>
                        <TableCell>Garantías</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Proveedor</TableCell>
                        <TableCell>Localización</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {applications
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((application, index) => (
                        <TableRow key={application.id}>
                          <TableCell>{application.id}</TableCell>
                          <TableCell>{application.fecha}</TableCell>
                          <TableCell>{application.cliente}</TableCell>
                          <TableCell>{formatCurrency(application.monto)}</TableCell>
                          <TableCell>{application.garantia}</TableCell>
                          <TableCell>
                            <Chip
                              label={application.estado}
                              color={application.estado === 'Aprobado' ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{application.proveedor}</TableCell>
                          <TableCell>{application.localizacion}</TableCell>
                          <TableCell>
                            <Button
                              onClick={(event) => handleMenuClick(event, application)}
                              variant="outlined"
                              size="small"
                              endIcon={<ExpandMoreIcon />}
                            >
                              Opciones
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={applications.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                sx={{
                  borderTop: '1px solid #e0e0e0',
                  backgroundColor: '#fafafa',
                  '& .MuiTablePagination-toolbar': {
                    paddingLeft: 2,
                    paddingRight: 2
                  },
                  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                    margin: 0,
                    fontSize: '0.875rem',
                    color: '#2c3e50'
                  },
                  '& .MuiTablePagination-select': {
                    fontSize: '0.875rem',
                    color: '#2c3e50'
                  },
                  '& .MuiTablePagination-actions button': {
                    color: '#2c3e50',
                    '&:hover': {
                      backgroundColor: '#ecf0f1'
                    },
                    '&.Mui-disabled': {
                      color: '#bdc3c7'
                    }
                  }
                }}
              />
              </JumboCard>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Menú de opciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: '180px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            mt: 1
          }
        }}
      >
        <MenuItem 
          onClick={() => handleMenuOption('ver')}
          sx={{ 
            py: 1.2, 
            px: 2,
            '&:hover': { backgroundColor: '#f8f9fa' }
          }}
        >
          <VisibilityIcon sx={{ mr: 2, fontSize: 16, color: '#3498db' }} />
          <Typography variant="body2" sx={{ fontWeight: 400, fontSize: '0.875rem' }}>Ver Detalles</Typography>
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleMenuOption('editar')}
          sx={{ 
            py: 1.2, 
            px: 2,
            '&:hover': { backgroundColor: '#f8f9fa' }
          }}
        >
          <EditIcon sx={{ mr: 2, fontSize: 16, color: '#f39c12' }} />
          <Typography variant="body2" sx={{ fontWeight: 400, fontSize: '0.875rem' }}>Editar</Typography>
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleMenuOption('aprobar')}
          sx={{ 
            py: 1.2, 
            px: 2,
            '&:hover': { backgroundColor: '#f8f9fa' }
          }}
        >
          <CheckCircleIcon sx={{ mr: 2, fontSize: 16, color: '#27ae60' }} />
          <Typography variant="body2" sx={{ fontWeight: 400, fontSize: '0.875rem' }}>Aprobar</Typography>
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleMenuOption('rechazar')}
          sx={{ 
            py: 1.2, 
            px: 2,
            '&:hover': { backgroundColor: '#f8f9fa' }
          }}
        >
          <CancelIcon sx={{ mr: 2, fontSize: 16, color: '#e74c3c' }} />
          <Typography variant="body2" sx={{ fontWeight: 400, fontSize: '0.875rem' }}>Rechazar</Typography>
        </MenuItem>
        
        <Divider sx={{ my: 0.5 }} />
        
        <MenuItem 
          onClick={() => handleMenuOption('imprimir')}
          sx={{ 
            py: 1.2, 
            px: 2,
            '&:hover': { backgroundColor: '#f8f9fa' }
          }}
        >
          <PrintIcon sx={{ mr: 2, fontSize: 16, color: '#7f8c8d' }} />
          <Typography variant="body2" sx={{ fontWeight: 400, fontSize: '0.875rem' }}>Imprimir</Typography>
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleMenuOption('eliminar')}
          sx={{ 
            py: 1.2, 
            px: 2,
            '&:hover': { backgroundColor: '#fdf2f2' }
          }}
        >
          <DeleteIcon sx={{ mr: 2, fontSize: 16, color: '#e74c3c' }} />
          <Typography variant="body2" sx={{ fontWeight: 400, fontSize: '0.875rem', color: '#e74c3c' }}>Eliminar</Typography>
        </MenuItem>
      </Menu>

      {/* Dialog para nueva solicitud */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, minHeight: '70vh' }
        }}
      >
        <DialogTitle sx={{ pb: 1, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <AddIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="600">
                Nueva Solicitud de Crédito
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete la información requerida para procesar la solicitud
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          {/* Mostrar datos de la calculadora si están disponibles */}
          {loanCalculationData && (
            <Box sx={{ mb: 4, p: 3, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e9ecef' }}>
              <Typography variant="h6" fontWeight="600" color="primary.main" sx={{ mb: 2 }}>
                🧮 Datos de la Calculadora de Préstamos
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">Capital</Typography>
                    <Typography variant="h6" fontWeight="600" color="primary.main">
                      RD$ {(loanCalculationData.capital || 0).toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">Tasa de Interés</Typography>
                    <Typography variant="h6" fontWeight="600" color="success.main">
                      {loanCalculationData.tasaInteresMensual || 0}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">Plazo</Typography>
                    <Typography variant="h6" fontWeight="600" color="info.main">
                      {loanCalculationData.plazoMeses || 0} cuotas
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">Gastos de Cierre</Typography>
                    <Typography variant="h6" fontWeight="600" color="warning.main">
                      RD$ {(loanCalculationData.montoCierre || 0).toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                {(loanCalculationData.tieneSeguro || loanCalculationData.tieneGPS) && (
                  <>
                    {loanCalculationData.tieneSeguro && (
                      <Grid item xs={12} md={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">Seguro Total</Typography>
                          <Typography variant="h6" fontWeight="600" color="secondary.main">
                            RD$ {(loanCalculationData.montoTotalSeguro || 0).toLocaleString()}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    {loanCalculationData.tieneGPS && (
                      <Grid item xs={12} md={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">GPS Total</Typography>
                          <Typography variant="h6" fontWeight="600" color="secondary.main">
                            RD$ {(loanCalculationData.montoTotalGPS || 0).toLocaleString()}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            </Box>
          )}
          
          <Grid container spacing={2}>
            {/* Información Personal */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="600" color="primary.main" sx={{ mb: 2 }}>
                📋 Información Personal
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre Completo del Cliente"
                placeholder="Ej: Juan Carlos Pérez Rodríguez"
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                InputProps={{
                  startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cédula de Identidad"
                placeholder="Ej: 001-1234567-8"
                value={formData.cedula}
                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Número de Teléfono"
                placeholder="Ej: (809) 123-4567"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ingresos Mensuales (DOP)"
                type="number"
                placeholder="Ej: 75000"
                value={formData.ingresos}
                onChange={(e) => setFormData({ ...formData, ingresos: parseFloat(e.target.value) || 0 })}
                InputProps={{
                  startAdornment: <MoneyIcon color="action" sx={{ mr: 1 }} />
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            {/* Información del Crédito */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="600" color="primary.main" sx={{ mb: 2, mt: 2 }}>
                💰 Información del Crédito
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Monto Solicitado (DOP)"
                type="number"
                placeholder="Ej: 500000"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: parseFloat(e.target.value) || 0 })}
                InputProps={{
                  startAdornment: <MoneyIcon color="success" sx={{ mr: 1 }} />
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tipo de Garantía"
                placeholder="Ej: Hipotecaria, Vehicular, Fiduciaria"
                value={formData.garantia}
                onChange={(e) => setFormData({ ...formData, garantia: e.target.value })}
                InputProps={{
                  startAdornment: <SecurityIcon color="action" sx={{ mr: 1 }} />
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Institución Financiera"
                placeholder="Ej: Banco Popular Dominicano"
                value={formData.proveedor}
                onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                InputProps={{
                  startAdornment: <BankIcon color="action" sx={{ mr: 1 }} />
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Localización"
                placeholder="Ej: Santo Domingo, Distrito Nacional"
                value={formData.localizacion}
                onChange={(e) => setFormData({ ...formData, localizacion: e.target.value })}
                InputProps={{
                  startAdornment: <LocationIcon color="action" sx={{ mr: 1 }} />
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Propósito del Crédito"
                placeholder="Describa detalladamente el uso que se dará al crédito solicitado..."
                multiline
                rows={4}
                value={formData.proposito}
                onChange={(e) => setFormData({ ...formData, proposito: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider', gap: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            size="large"
            sx={{ 
              minWidth: 120,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            disabled={
              !formData.cliente ||
              !formData.monto ||
              !formData.garantia ||
              !formData.proveedor ||
              !formData.localizacion
            }
            sx={{ 
              minWidth: 180,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Crear Solicitud
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}