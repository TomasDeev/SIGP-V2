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
  CircularProgress,
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
import { PrestamosService } from "../../../_services/prestamosService";
import CuentasService from '../../../_services/cuentasService';
import ReferenciasPersonalesService from '../../../_services/referenciasPersonalesService';
import LocalizacionesService from '../../../_services/localizacionesService';




// Función para transformar datos de la base de datos al formato esperado por la UI
const transformLoanData = (loans) => {
  return loans.map(loan => {
    // Asegurar que tenemos datos del cliente
    const clientData = loan.cuentas || {};
    const cedula = clientData.Cedula || '';
    const nombres = clientData.Nombres || '';
    const apellidos = clientData.Apellidos || '';
    
    // Log para debugging si no hay cédula
    if (!cedula) {
      console.warn('Préstamo sin cédula de cliente:', {
        prestamoId: loan.IdPrestamo,
        cliente: `${nombres} ${apellidos}`.trim(),
        clientData: clientData
      });
    }
    
    return {
      id: `${loan.Prefijo || ''}${loan.PrestamoNo || loan.IdPrestamo?.toString() || ''}`,
      fecha: loan.FechaCreacion ? new Date(loan.FechaCreacion).toLocaleDateString('es-DO', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }) : '',
      cliente: `${nombres} ${apellidos}`.trim() || 'Cliente sin nombre',
      cedula: cedula,
      telefono: clientData.Telefono || clientData.Celular || '',
      monto: loan.CapitalPrestado || 0,
      garantia: loan.garantias?.[0]?.Descripcion || 'PRESTAMO CON PAGARE NOTARIAL',
      proveedor: loan.empresas?.NombreComercial || 'NINGUNO',
      localizacion: clientData.Sector || '',
      estado: getEstadoName(loan.IdEstado),
      // Agregar datos adicionales para debugging
      _originalLoanData: loan
    };
  });
};

// Función para convertir ID de estado a nombre
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
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [clientForPrint, setClientForPrint] = useState(null); // Preservar datos del cliente para impresión
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

  // Opciones de documentos para imprimir
  const documentOptions = [
    { id: 'hoja-vida', name: 'Hoja de Vida', description: 'Documento con información personal y financiera del cliente' },
    { id: 'contrato', name: 'Contrato de Préstamo', description: 'Contrato oficial del préstamo' },
    { id: 'pagare', name: 'Pagaré', description: 'Documento de compromiso de pago' },
    { id: 'tabla-amortizacion', name: 'Tabla de Amortización', description: 'Cronograma de pagos del préstamo' },
  ];

  // Función para cargar préstamos desde la base de datos
  const loadLoans = async () => {
    try {
      setLoading(true);
      const result = await PrestamosService.getAll();
      
      if (result.success) {
        const transformedData = transformLoanData(result.data);
        setApplications(transformedData);
      } else {
        console.error('Error cargando préstamos:', result.error);
        setApplications([]);
      }
    } catch (error) {
      console.error('Error cargando préstamos:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para cargar préstamos al montar el componente
  useEffect(() => {
    loadLoans();
  }, []);

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

  const handleMenuOption = async (option) => {
    console.log(`Opción seleccionada: ${option} para solicitud: ${selectedRow?.id} - Cliente: ${selectedRow?.cliente}`);
    
    if (option === 'ver') {
      // Navegar a la página de detalles con el ID del préstamo
      if (selectedRow?.id) {
        navigate(`/tools/credit-application/${selectedRow.id}`);
      } else {
        console.error('No se encontró el ID del préstamo seleccionado');
        alert('No se encontró el ID del préstamo seleccionado');
      }
    } else if (option === 'imprimir') {
      // Preservar los datos del cliente antes de cerrar el menú
      setClientForPrint(selectedRow);
      setPrintDialogOpen(true);
    } else if (option === 'editar') {
      await handleEditClient();
    }
    
    handleMenuClose();
  };

  const handleEditClient = async () => {
    try {
      if (!selectedRow?.cedula) {
        console.error('No se encontró la cédula del cliente seleccionado');
        alert('No se encontró la cédula del cliente seleccionado');
        return;
      }

      console.log('Buscando cliente con cédula:', selectedRow.cedula);

      // Obtener datos completos del cliente por cédula
      const clientResult = await CuentasService.getByCedula(selectedRow.cedula);
      
      if (!clientResult.success) {
        console.error('Error obteniendo datos del cliente:', clientResult.error);
        alert(`Error obteniendo datos del cliente: ${clientResult.error}`);
        return;
      }

      if (!clientResult.data) {
        console.error('No se encontró el cliente con la cédula:', selectedRow.cedula);
        alert(`No se encontró el cliente con la cédula: ${selectedRow.cedula}`);
        return;
      }

      const clientData = clientResult.data;
      
      // TODO: Obtener datos relacionados de otras tablas (localizaciones, referencias, etc.)
      // Por ahora mapearemos solo los datos básicos disponibles en la tabla cuentas
      
      // Mapear datos del cliente al formato del onboarding
      const onboardingData = {
        datosPersonales: {
          nombres: clientData.Nombres || '',
          apellidos: clientData.Apellidos || '',
          cedula: clientData.Cedula || '',
          telefono: clientData.Telefono || '',
          celular: clientData.Celular || '',
          email: clientData.Email || '',
          nacionalidad: clientData.Nacionalidad || 'Dominicana',
          lugarNacimiento: clientData.LugarNacimiento || '',
          fechaNacimiento: clientData.FechaNacimiento || '',
          estadoCivil: mapEstadoCivilFromDB(clientData.EstadoCivil),
          profesion: clientData.Profesion || '',
          foto: clientData.Foto || null,
          fotoPreview: clientData.Foto || null,
          // Campos adicionales que pueden estar en observaciones
          apodo: extractFromObservaciones(clientData.Observaciones, 'Apodo') || '',
          sexo: 'masculino', // Por defecto, se puede mejorar
          ocupacion: clientData.Profesion || '',
          tipoResidencia: extractFromObservaciones(clientData.Observaciones, 'Tipo de residencia') || 'propia'
        },
        direccion: {
          direccion: clientData.Direccion || '',
          sector: clientData.Sector || '',
          // Campos adicionales que se pueden agregar
          provincia: '',
          municipio: '',
          calle: '',
          numero: '',
          referencia: '',
          latitud: null,
          longitud: null
        },
        informacionLaboral: {
          empresa: clientData.LugarTrabajo || '',
          direccionEmpresa: clientData.DireccionTrabajo || '',
          telefonoTrabajo: clientData.TelefonoTrabajo || '',
          ingresos: clientData.Ingresos || 0,
          tiempoTrabajo: clientData.TiempoTrabajo || '',
          // Campos adicionales
          cargo: '',
          supervisor: '',
          quienPagara: 'cliente'
        },
        // Secciones que se inicializarán vacías por ahora
        datosConyuge: {
          nombres: '',
          apellidos: '',
          cedula: '',
          fechaNacimiento: '',
          sexo: 'femenino',
          telefono: '',
          celular: '',
          lugarTrabajo: '',
          direccionTrabajo: ''
        },
        referenciasPersonales: [],
        fiadores: [],
        seguros: {
          gps: false,
          vida: false,
          vehicular: false,
          montoGps: 0,
          montoVida: 0,
          montoVehicular: 0
        },
        cheques: {
          tipoPrestamo: 'personal',
          concepto: '',
          banco: '',
          numeroCuenta: '',
          nombreCuenta: '',
          tipoCuenta: 'corriente'
        },
        loanCalculation: {
          capital: 0,
          cantidadCuotas: 12,
          tasaInteres: 18,
          gastoCierre: 0,
          montoSeguro: 0,
          fechaPrimerPago: new Date().toISOString().split('T')[0]
        },
        isEditing: true,
        clientId: clientData.IdCliente
      };

      // Guardar datos en localStorage para el onboarding
      localStorage.setItem('onboardingEditData', JSON.stringify(onboardingData));
      localStorage.setItem('onboardingEditMode', 'true');
      
      // Navegar al onboarding-2
      navigate('/onboarding-2');
      
    } catch (error) {
      console.error('Error al preparar edición del cliente:', error);
    }
  };

  // Función helper para extraer información de las observaciones
  const extractFromObservaciones = (observaciones, campo) => {
    if (!observaciones) return '';
    const regex = new RegExp(`${campo}:\\s*([^.]+)`, 'i');
    const match = observaciones.match(regex);
    return match ? match[1].trim() : '';
  };

  // Función helper para mapear estado civil desde la DB
  const mapEstadoCivilFromDB = (estadoCivilId) => {
    const estadosMap = {
      1: 'soltero',
      2: 'casado',
      3: 'divorciado',
      4: 'viudo',
      5: 'union_libre'
    };
    return estadosMap[estadoCivilId] || 'soltero';
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

  const handlePrintDialogClose = () => {
    setPrintDialogOpen(false);
    setSelectedDocuments([]);
    setClientForPrint(null); // Limpiar datos del cliente preservado
  };

  const handleDocumentToggle = (documentId) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handlePrintDocuments = () => {
    if (selectedDocuments.length === 0) {
      alert('Por favor seleccione al menos un documento para imprimir.');
      return;
    }

    // Aquí implementaremos la lógica de impresión para cada documento
    selectedDocuments.forEach(docId => {
      switch (docId) {
        case 'hoja-vida':
          printHojaDeVida();
          break;
        case 'contrato':
          printContrato();
          break;
        case 'pagare':
          printPagare();
          break;
        case 'tabla-amortizacion':
          printTablaAmortizacion();
          break;
        default:
          console.log(`Documento ${docId} no implementado`);
      }
    });

    handlePrintDialogClose();
  };

  const printHojaDeVida = async () => {
    try {
      // Validar que hay un cliente para imprimir
      if (!clientForPrint) {
        alert('Por favor seleccione un cliente de la lista');
        return;
      }

      // Validar que la cédula está disponible
      if (!clientForPrint.cedula || clientForPrint.cedula.trim() === '') {
        alert('No se encontró la cédula del cliente seleccionado. Verifique que el cliente tenga una cédula registrada.');
        console.error('Datos del cliente seleccionado:', clientForPrint);
        return;
      }

      // Mostrar loading
      console.log('Obteniendo datos completos del cliente para la hoja de vida...');
      console.log('Cédula del cliente:', clientForPrint.cedula);

      // Obtener datos completos del cliente
      const clientResult = await CuentasService.getByCedula(clientForPrint.cedula);
      if (!clientResult.success || !clientResult.data) {
        alert(`Error obteniendo datos del cliente con cédula: ${clientForPrint.cedula}. Verifique que el cliente existe en la base de datos.`);
        console.error('Error en CuentasService.getByCedula:', clientResult);
        return;
      }

      const clientData = clientResult.data;
      console.log('Datos del cliente obtenidos:', clientData);

      // Obtener referencias personales
      const referenciasResult = await ReferenciasPersonalesService.getByClientId(clientData.IdCliente);
      const referencias = referenciasResult.success ? referenciasResult.data : [];
      console.log('Referencias personales obtenidas:', referencias);

      // Obtener localizaciones
      const localizacionesResult = await LocalizacionesService.getByClientId(clientData.IdCliente);
      const localizaciones = localizacionesResult.success ? localizacionesResult.data : [];
      console.log('Localizaciones obtenidas:', localizaciones);

      // Crear una nueva ventana para la Hoja de Vida
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      if (printWindow) {
        // Generar el HTML usando el componente HojaDeVidaPDF
        const hojaDeVidaHTML = generateHojaDeVidaHTML(clientData, referencias, localizaciones);
        
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Hoja de Vida - ${clientData.Nombres} ${clientData.Apellidos}</title>
            <meta charset="UTF-8">
            <style>
              @media print { 
                body { margin: 0; }
                @page { margin: 15mm; }
              }
            </style>
          </head>
          <body>
            ${hojaDeVidaHTML}
          </body>
          </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      } else {
        alert('No se pudo abrir la ventana de impresión. Verifique que no esté bloqueada por el navegador.');
      }
    } catch (error) {
      console.error('Error generando hoja de vida:', error);
      alert(`Error generando la hoja de vida: ${error.message}`);
    }
  };

  const printContrato = () => {
    console.log('Imprimiendo Contrato de Préstamo para:', selectedRow?.cliente);
    // Implementar lógica de impresión del contrato
  };

  const printPagare = () => {
    console.log('Imprimiendo Pagaré para:', selectedRow?.cliente);
    // Implementar lógica de impresión del pagaré
  };

  const printTablaAmortizacion = () => {
    console.log('Imprimiendo Tabla de Amortización para:', selectedRow?.cliente);
    // Implementar lógica de impresión de la tabla de amortización
  };

  // Función para generar HTML de la Hoja de Vida
  const generateHojaDeVidaHTML = (clientData, referencias, localizaciones) => {
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        return new Date(dateString).toLocaleDateString('es-DO', {
          day: '2-digit',
          month: '2-digit', 
          year: 'numeric'
        });
      } catch {
        return 'N/A';
      }
    };

    const calculateAge = (birthDate) => {
      if (!birthDate) return 'N/A';
      try {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        return age;
      } catch {
        return 'N/A';
      }
    };

    const mapEstadoCivil = (estadoCivil) => {
      const mapping = {
        1: 'Soltero/a',
        2: 'Casado/a',
        3: 'Divorciado/a',
        4: 'Viudo/a',
        5: 'Unión Libre'
      };
      return mapping[estadoCivil] || 'N/A';
    };

    // Preparar datos de teléfonos
    const telefonosData = [
      ...(clientData?.Telefono ? [{ tipo: 'Móvil', numero: clientData.Telefono, observaciones: '' }] : []),
      ...(clientData?.Celular ? [{ tipo: 'Móvil', numero: clientData.Celular, observaciones: '' }] : []),
      ...(clientData?.TelefonoTrabajo ? [{ tipo: 'Trabajo', numero: clientData.TelefonoTrabajo, observaciones: '' }] : [])
    ];

    // Obtener dirección principal
    const direccionPrincipal = localizaciones && localizaciones.length > 0 ? localizaciones[0] : null;
    const direccionCompleta = direccionPrincipal 
      ? `${direccionPrincipal.Calle || ''} ${direccionPrincipal.Sector || ''}, ${direccionPrincipal.municipios?.Nombre || ''}, ${direccionPrincipal.municipios?.provincias?.Nombre || ''}`.trim()
      : clientData?.Direccion || 'N/A';

    // Preparar datos de familiares/referencias
    const familiares = referencias && referencias.length > 0 ? referencias.filter(ref => 
      ref.referenciapersonaltipos?.Nombre?.toLowerCase() === 'familiar' || ref.Relacion?.toLowerCase().includes('familiar')
    ) : [];

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hoja de vida de cliente</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  font-size: 10pt;
                  margin: 20px auto;
                  max-width: 900px;
                  padding: 0 40px;
              }

              .container {
                  border: 1px solid #ccc;
                  padding: 10px;
              }

              h1 {
                  text-align: center;
                  font-size: 14pt;
                  margin-bottom: 15px;
                  font-weight: normal;
              }

              table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 15px;
              }

              th, td {
                  padding: 6px 10px;
                  text-align: left;
                  border: 1px solid #ccc;
              }

              .header-cell {
                  background-color: #f2f2f2;
                  font-weight: bold;
                  font-size: 11pt;
                  border-top: 1px solid #ccc;
              }

              .datos-personales-table th, .datos-personales-table td {
                  border: none;
                  padding: 3px 10px;
              }

              .datos-personales-table {
                  border: none;
              }

              .datos-personales-table tr:not(:last-child) td {
                  padding-bottom: 5px;
              }

              .col-header {
                  width: 100px;
                  font-weight: bold;
              }

              .seccion-title {
                  background-color: #e6e6e6;
                  font-weight: bold;
                  padding: 6px 10px;
                  border: 1px solid #ccc;
                  border-bottom: none;
                  font-size: 11pt;
                  text-transform: uppercase;
              }

              .datos-principales {
                  border: 1px solid #ccc;
              }

              .datos-principales td {
                  border: none;
                  padding: 0;
                  vertical-align: top;
              }

              .foto-cell {
                  width: 120px;
                  padding: 10px;
                  text-align: center;
              }

              .foto {
                  width: 100px;
                  height: auto;
                  border: 1px solid #000;
              }
              
              .telefonos-direccion-section {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 15px;
              }

              .telefonos-direccion-section td {
                  vertical-align: top;
                  padding: 0;
                  border: 1px solid #ccc;
              }

              .direccion-info {
                  padding: 6px 10px;
                  min-height: 40px;
              }

              .familiares-table th {
                  text-align: center;
                  background-color: #f2f2f2;
                  font-weight: bold;
              }

              .familiares-table td {
                  text-align: center;
              }

              .familiares-table td:nth-child(2) {
                  text-align: left;
              }
              
              .familiares-table th:nth-child(2) {
                  text-align: left;
              }

              .declaracion {
                  padding: 10px 0;
                  font-style: italic;
                  font-size: 9pt;
                  line-height: 1.3;
              }

              .firma-line-container {
                  text-align: center;
                  margin-top: 60px;
              }

              .firma-line {
                  display: inline-block;
                  width: 40%;
                  border-bottom: 1px solid #000;
              }

              .firma-nombre {
                  margin-top: 5px;
                  font-weight: bold;
                  font-size: 10pt;
              }

              .fecha-impresion {
                  position: fixed;
                  bottom: 10px;
                  left: 20px;
                  font-size: 8pt;
              }

              .placeholder-image {
                  background-color: #ddd;
                  display: block;
                  width: 100px;
                  height: 120px;
                  line-height: 120px;
                  text-align: center;
                  font-size: 8pt;
                  color: #555;
                  border: 1px solid #000;
              }
          </style>
      </head>
      <body>

          <h1>Hoja de vida de cliente</h1>

          <div class="container">
              
              <table class="datos-principales">
                  <tr>
                      <td class="foto-cell">
                          ${clientData?.Foto ? 
                            `<img src="${clientData.Foto}" alt="Foto del cliente" class="foto" />` :
                            '<div class="placeholder-image">FOTO</div>'
                          }
                      </td>
                      <td>
                          <div class="seccion-title" style="border-bottom: 1px solid #ccc;">Datos básicos</div>
                          <table class="datos-personales-table">
                              <tr><td class="col-header">Nombre</td><td>${`${clientData?.Nombres || ''} ${clientData?.Apellidos || ''}`.trim() || 'N/A'}</td></tr>
                              <tr><td class="col-header">Cédula</td><td>${clientData?.Cedula || 'N/A'}</td></tr>
                              <tr><td class="col-header">Edad</td><td>${calculateAge(clientData?.FechaNacimiento)}</td></tr>
                              <tr><td class="col-header">Estado Civil</td><td>${mapEstadoCivil(clientData?.EstadoCivil)}</td></tr>
                              <tr><td class="col-header">Profesión</td><td>${clientData?.Profesion || 'N/A'}</td></tr>
                          </table>
                      </td>
                  </tr>
              </table>
              
              <!-- Sección Teléfonos -->
              <table class="telefonos-direccion-section">
                  <tr>
                      <td style="width: 120px;">
                          <div class="seccion-title">Teléfonos</div>
                      </td>
                      <td>
                          <table style="width: 100%; border: none;">
                              <tr style="background-color: #f2f2f2;">
                                  <th style="border: none; padding: 3px 10px; font-weight: bold;">Tipo</th>
                                  <th style="border: none; padding: 3px 10px; font-weight: bold;">Número</th>
                                  <th style="border: none; padding: 3px 10px; font-weight: bold;">Observaciones</th>
                              </tr>
                              ${telefonosData.length > 0 ? telefonosData.map(tel => `
                                  <tr>
                                      <td style="border: none; padding: 3px 10px;">${tel.tipo}</td>
                                      <td style="border: none; padding: 3px 10px;">${tel.numero}</td>
                                      <td style="border: none; padding: 3px 10px;">${tel.observaciones}</td>
                                  </tr>
                              `).join('') : `
                                  <tr>
                                      <td style="border: none; padding: 3px 10px;">-</td>
                                      <td style="border: none; padding: 3px 10px;">Sin teléfonos registrados</td>
                                      <td style="border: none; padding: 3px 10px;">-</td>
                                  </tr>
                              `}
                          </table>
                      </td>
                  </tr>
              </table>

              <!-- Sección Direcciones -->
              <div class="seccion-title">Direcciones</div>
              <table>
                  <tr>
                      <td class="direccion-info">
                          <strong>Dirección Principal:</strong><br>
                          ${direccionCompleta}
                          ${direccionPrincipal?.ReferenciaLocalidad ? `<br><strong>Referencia:</strong> ${direccionPrincipal.ReferenciaLocalidad}` : ''}
                          ${clientData?.Sector ? `<br><strong>Sector:</strong> ${clientData.Sector}` : ''}
                      </td>
                  </tr>
              </table>

              <!-- Sección Información Laboral -->
              <div class="seccion-title">Información Laboral</div>
              <table>
                  <tr>
                      <td style="font-weight: bold; width: 150px;">Lugar de Trabajo:</td>
                      <td>${clientData?.LugarTrabajo || 'N/A'}</td>
                      <td style="font-weight: bold; width: 150px;">Teléfono Trabajo:</td>
                      <td>${clientData?.TelefonoTrabajo || 'N/A'}</td>
                  </tr>
                  <tr>
                      <td style="font-weight: bold;">Dirección Trabajo:</td>
                      <td colspan="3">${clientData?.DireccionTrabajo || 'N/A'}</td>
                  </tr>
                  <tr>
                      <td style="font-weight: bold;">Ingresos:</td>
                      <td>${clientData?.Ingresos ? new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', minimumFractionDigits: 0 }).format(clientData.Ingresos) : 'N/A'}</td>
                      <td style="font-weight: bold;">Tiempo Trabajo:</td>
                      <td>${clientData?.TiempoTrabajo || 'N/A'}</td>
                  </tr>
              </table>

              <!-- Sección Familiares -->
              <div class="seccion-title">Familiares</div>
              <table class="familiares-table">
                  <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Dirección</th>
                      <th>Teléfono</th>
                  </tr>
                  ${familiares.length > 0 ? familiares.map((familiar, index) => `
                      <tr>
                          <td>${index + 1}</td>
                          <td>${familiar.Nombre || familiar.Nombres || 'N/A'}</td>
                          <td>${familiar.Direccion || 'N/A'}</td>
                          <td>${familiar.Telefono || 'N/A'}</td>
                      </tr>
                  `).join('') : `
                      <tr>
                          <td>-</td>
                          <td>No hay familiares registrados</td>
                          <td>-</td>
                          <td>-</td>
                      </tr>
                  `}
              </table>

              ${referencias && referencias.length > 0 ? `
              <!-- Sección Referencias Personales -->
              <div class="seccion-title">Referencias Personales</div>
              <table class="familiares-table">
                  <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Relación</th>
                      <th>Teléfono</th>
                      <th>Dirección</th>
                  </tr>
                  ${referencias.map((ref, index) => `
                      <tr>
                          <td>${index + 1}</td>
                          <td>${ref.Nombres || ref.Nombre || 'N/A'} ${ref.Apellidos || ''}</td>
                          <td>${ref.Relacion || 'N/A'}</td>
                          <td>${ref.Telefono || 'N/A'}</td>
                          <td>${ref.Direccion || 'N/A'}</td>
                      </tr>
                  `).join('')}
              </table>
              ` : ''}

              ${clientData?.Observaciones ? `
              <!-- Sección Observaciones -->
              <div class="seccion-title">Observaciones</div>
              <table>
                  <tr>
                      <td style="padding: 10px;">${clientData.Observaciones}</td>
                  </tr>
              </table>
              ` : ''}

              <!-- Declaración legal -->
              <div class="declaracion">
                  Declaro que todos los datos contenidos en este documento corresponden a la más entera fidelidad sobre mi persona y 
                  autorizo a esta empresa, sus afiliados, funcionarios y asociados, a consultar mis datos crediticios dentro y fuera de este país.
              </div>

              <!-- Firma -->
              <div class="firma-line-container">
                  <div class="firma-line"></div>
                  <div class="firma-nombre">${`${clientData?.Nombres || ''} ${clientData?.Apellidos || ''}`.trim() || 'NOMBRE DEL CLIENTE'}</div>
              </div>

          </div>

          <div class="fecha-impresion">
              Fecha de impresión: ${new Date().toLocaleDateString('es-DO')}
          </div>

      </body>
      </html>
    `;
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
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                            <CircularProgress />
                            <Typography variant="body2" sx={{ mt: 2 }}>
                              Cargando solicitudes...
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : applications.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No hay solicitudes disponibles
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        applications
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((application, index) => (
                        <TableRow key={application.id}>
                          <TableCell>{application.id}</TableCell>
                          <TableCell>{application.fecha}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {application.cliente}
                              {!application.cedula && (
                                <Chip
                                  label="Sin cédula"
                                  color="error"
                                  size="small"
                                  sx={{ fontSize: '0.7rem', height: '20px' }}
                                />
                              )}
                            </Box>
                          </TableCell>
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
                              disabled={!application.cedula}
                              title={!application.cedula ? 'Cliente sin cédula - No se pueden generar documentos' : 'Ver opciones'}
                            >
                              Opciones
                            </Button>
                          </TableCell>
                        </TableRow>
                          ))
                      )}
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

      {/* Print Dialog */}
      <Dialog 
        open={printDialogOpen} 
        onClose={handlePrintDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          pb: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <PrintIcon color="primary" />
          <Box>
            <Typography variant="h6" fontWeight="600">
              Documentos para Imprimir
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cliente: {clientForPrint?.cliente || 'N/A'}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Seleccione los documentos que desea imprimir:
          </Typography>
          
          <Stack spacing={2}>
            {documentOptions.map((doc) => (
              <Card 
                key={doc.id}
                variant="outlined"
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: selectedDocuments.includes(doc.id) ? 2 : 1,
                  borderColor: selectedDocuments.includes(doc.id) ? 'primary.main' : 'divider',
                  bgcolor: selectedDocuments.includes(doc.id) ? 'primary.50' : 'transparent',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.50'
                  }
                }}
                onClick={() => handleDocumentToggle(doc.id)}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: 2,
                        borderColor: selectedDocuments.includes(doc.id) ? 'primary.main' : 'grey.400',
                        bgcolor: selectedDocuments.includes(doc.id) ? 'primary.main' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {selectedDocuments.includes(doc.id) && (
                        <CheckCircleIcon sx={{ fontSize: 12, color: 'white' }} />
                      )}
                    </Box>
                    <Box flex={1}>
                      <Typography variant="subtitle2" fontWeight="600">
                        {doc.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {doc.description}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider', gap: 2 }}>
          <Button 
            onClick={handlePrintDialogClose}
            variant="outlined"
            size="large"
            startIcon={<CloseIcon />}
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
            onClick={handlePrintDocuments}
            variant="contained"
            size="large"
            startIcon={<PrintIcon />}
            disabled={selectedDocuments.length === 0}
            sx={{ 
              minWidth: 180,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Imprimir ({selectedDocuments.length})
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}