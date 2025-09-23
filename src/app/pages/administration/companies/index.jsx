import React, { useState, useEffect } from "react";
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
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Input,
  FormHelperText,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  CloudUpload as CloudUploadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { JumboCard } from "@jumbo/components";
import { useEmpresas } from "../../../_hooks/useSupabaseData";

// Datos de respaldo en caso de que no haya conexión
const fallbackCompanies = [
  {
    id: 1,
    name: "ACRESA GROUP",
    commercialName: "ACRESA GROUP",
    ruc: "130-96308-8",
    phone: "809-692-7703",
    email: "contacto@acresagroup.com",
    address: "Santo Domingo, República Dominicana",
    status: "Activa",
    branches: 1,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Arlequin Auto Import SRL",
    commercialName: "Arlequin Auto Import",
    ruc: "131484034",
    phone: "809-689-6624",
    email: "info@arlequinauto.com",
    address: "Santo Domingo, República Dominicana",
    status: "Activa",
    branches: 1,
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    name: "CELIDICE C & c, S.R.L",
    commercialName: "CELIDICE C & c, S.R.L",
    ruc: "130870578",
    phone: "809-829-5935",
    email: "contacto@celidice.com",
    address: "Santo Domingo, República Dominicana",
    status: "Activa",
    branches: 1,
    createdAt: "2024-02-01",
  },
  {
    id: 4,
    name: "CEPEDA HERMANOS",
    commercialName: "CEPEDA HERMANOS SRL",
    ruc: "101578602",
    phone: "598-2002 Y 598-2045",
    email: "info@cepedahermanos.com",
    address: "Santo Domingo, República Dominicana",
    status: "Activa",
    branches: 1,
    createdAt: "2024-02-05",
  },
  {
    id: 5,
    name: "CLAVO AUTOS",
    commercialName: "CLAVO AUTOS",
    ruc: "131106439",
    phone: "809-335-4102",
    email: "contacto@clavoautos.com",
    address: "Santo Domingo, República Dominicana",
    status: "Activa",
    branches: 1,
    createdAt: "2024-02-10",
  },
  {
    id: 6,
    name: "GRAYLIN INVERSIONES SRL",
    commercialName: "GRAYLIN INVERSIONES SRL",
    ruc: "132000412",
    phone: "809-000-0000",
    email: "info@graylin.com",
    address: "Santo Domingo, República Dominicana",
    status: "Activa",
    branches: 1,
    createdAt: "2024-02-15",
  },
  {
    id: 7,
    name: "HUB DE INVERSIONES Y GRANTIA EMPRESARIAL SRL",
    commercialName: "HIGE SRL",
    ruc: "133171041",
    phone: "809-440-9913",
    email: "contacto@hige.com",
    address: "Santo Domingo, República Dominicana",
    status: "Activa",
    branches: 1,
    createdAt: "2024-02-20",
  },
  {
    id: 8,
    name: "INVERSIONES DIDA",
    commercialName: "INVERSIONES DIDA",
    ruc: "132-81375-8",
    phone: "809-730-5917",
    email: "info@inversionesdida.com",
    address: "Santo Domingo, República Dominicana",
    status: "Activa",
    branches: 1,
    createdAt: "2024-02-25",
  },
  {
    id: 9,
    name: "INVERSIONES YAMEL",
    commercialName: "INVERSIONES YAMEL",
    ruc: "130386439",
    phone: "809-483-1128, 3855, 3877",
    email: "contacto@inversionesyamel.com",
    address: "Santo Domingo, República Dominicana",
    status: "Activa",
    branches: 1,
    createdAt: "2024-03-01",
  },
  {
    id: 10,
    name: "JDC INVERSIONES",
    commercialName: "JDC INVERSIONES",
    ruc: "130262853",
    phone: "809-593-8059, 8031, 8053",
    email: "info@jdcinversiones.com",
    address: "Santo Domingo, República Dominicana",
    status: "Activa",
    branches: 1,
    createdAt: "2024-03-05",
  },
  {
    id: 11,
    name: "M & C Inversiones SRL",
    commercialName: "M & C Inversiones SRL",
    ruc: "131325645",
    phone: "809-594-9521 / 809-591-2318",
    email: "contacto@mcinversiones.com",
    address: "Santo Domingo, República Dominicana",
    status: "Activa",
    branches: 1,
    createdAt: "2024-03-10",
  },
  {
    id: 12,
    name: "NSP INVERSIONES",
    commercialName: "NSP INVERSIONES",
    ruc: "130806632",
    phone: "809-440-9913",
    email: "info@nspinversiones.com",
    address: "Santo Domingo, República Dominicana",
    status: "Activa",
    branches: 1,
    createdAt: "2024-03-15",
  },
  {
    id: 13,
    name: "PRESTAMOS E INVERSIONES JAMILET SRL",
    commercialName: "PRESTAMOS E INVERSIONES JAMILET",
    ruc: "131466052",
    phone: "829-687-5150",
    email: "contacto@jamilet.com",
    address: "Santo Domingo, República Dominicana",
    status: "Activa",
    branches: 1,
    createdAt: "2024-03-20",
  },
  {
    id: 14,
    name: "RICE AUTO PRESTAMOS Y MAS, S.R.L",
    commercialName: "RICE AUTO PRESTAMOS Y MAS",
    ruc: "1-31-71266-5",
    phone: "809-594-9521 / 809-591-2318",
    email: "info@riceauto.com",
    address: "Santo Domingo, República Dominicana",
    status: "Activa",
    branches: 1,
    createdAt: "2024-03-25",
  },
  {
    id: 15,
    name: "SOLUCIONES CEPEDA DOTEL SRL",
    commercialName: "SOLUCIONES CEPEDA DOTEL SRL",
    ruc: "131821482",
    phone: "809-545-9034",
    email: "contacto@cepedadotel.com",
    address: "Santo Domingo, República Dominicana",
    status: "Activa",
    branches: 1,
    createdAt: "2024-04-01",
  },
  {
    id: 16,
    name: "Terabizz Tech SRL",
    commercialName: "Terabizz Tech SRL",
    ruc: "1-31-46186-7",
    phone: "809-555-5555",
    email: "info@terabizz.com",
    address: "Santo Domingo, República Dominicana",
    status: "Activa",
    branches: 1,
    createdAt: "2024-04-05",
  },
  {
    id: 17,
    name: "Tifuat Auto Import",
    commercialName: "Tifuat Auto Import",
    ruc: "131-994-662",
    phone: "829-872-4089",
    email: "contacto@tifuat.com",
    address: "Santo Domingo, República Dominicana",
    status: "Activa",
    branches: 1,
    createdAt: "2024-04-10",
  },
  {
    id: 18,
    name: "URECE TRAVEL",
    commercialName: "URECE TRAVEL",
    ruc: "101853107",
    phone: "809-536-5482, Fax 809-549-4484",
    email: "info@urecetravel.com",
    address: "Santo Domingo, República Dominicana",
    status: "Activa",
    branches: 1,
    createdAt: "2024-04-15",
  },
];

const CompaniesPage = () => {
  const { empresas, loading, error, createEmpresa, updateEmpresa, deleteEmpresa, loadData } = useEmpresas();
  const [companies, setCompanies] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [saving, setSaving] = useState(false);

  // Estilos comunes para campos profesionales
  const professionalFieldStyle = {
    '& .MuiInputLabel-root': {
      fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    '& .MuiInputBase-input': {
      fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
    },
  };

  useEffect(() => {
    console.log('🔄 useEffect triggered - empresas:', empresas, 'loading:', loading);
    if (empresas && empresas.length > 0) {
      console.log('✅ Setting companies from empresas data:', empresas);
      setCompanies(empresas);
    } else if (!loading && !empresas) {
      console.log('⚠️ Using fallback companies');
      setCompanies(fallbackCompanies);
    }
  }, [empresas, loading]);

  const [formData, setFormData] = useState({
    // Información General
    name: "",
    commercialName: "",
    ruc: "",
    phone: "",
    address: "",
    email: "",
    
    // Información Legal
    president: "",
    presidentId: "",
    lawyer: "",
    lawyerMaritalStatus: "Soltero",
    lawyerId: "",
    lawyerOfficeAddress: "",
    notary: "",
    bailiff: "",
    
    // Información Financiera
    bank: "",
    accountNumber: "",
    accountingCompanyId: "",
    defaultRate: "0.00",
    defaultLateFee: "0.00",
    defaultInstallments: "0",
    defaultClosingCosts: "0.00",
    paymentPenalty: "5",
    maxPaymentOnRemainingCapital: "50",
    minPaymentOnRemainingCapital: "50",
    
    // Estado y Logo
    status: "Activa",
    logo: '',
  });

  const handleOpenDialog = (company = null) => {
    if (company) {
      setEditingCompany(company);
      // Mapear campos de la base de datos al formulario
      setFormData({
        // Información General
        name: company.RazonSocial || company.name || "",
        commercialName: company.NombreComercial || company.commercialName || "",
        ruc: company.RNC || company.ruc || "",
        phone: company.Telefono || company.phone || "",
        address: company.Direccion || company.address || "",
        email: company.email || "",
        
        // Información Legal
        president: company.Presidente || "",
        presidentId: company.CedulaPresidente || "",
        lawyer: company.Abogado || "",
        lawyerMaritalStatus: company.EstadoCivilAbogado === 2 ? "Casado" : "Soltero",
        lawyerId: company.CedulaAbogado || "",
        lawyerOfficeAddress: company.DireccionAbogado || "",
        notary: company.Notario || "",
        bailiff: company.Alguacil || "",
        
        // Información Financiera
        bank: company.Banco || "",
        accountNumber: company.NoCuenta || "",
        accountingCompanyId: company.EmpresaContabilidadId || "",
        defaultRate: company.Tasa || "0.00",
        defaultLateFee: company.Mora || "0.00",
        defaultInstallments: company.Cuotas || "0",
        defaultClosingCosts: company.GastoCierre || "0.00",
        paymentPenalty: company.Penalidad || "5",
        maxPaymentOnRemainingCapital: company.MaxAbonoSobreCapital || "50",
        minPaymentOnRemainingCapital: company.MinAbonoSobreCapital || "50",
        
        // Estado y Logo
        status: company.Activo ? "Activa" : "Inactiva",
        logo: company.Logo || '',
      });
    } else {
      setEditingCompany(null);
      setFormData({
        // Información General
        name: "",
        commercialName: "",
        ruc: "",
        phone: "",
        address: "",
        email: "",
        
        // Información Legal
        president: "",
        presidentId: "",
        lawyer: "",
        lawyerMaritalStatus: "Soltero",
        lawyerId: "",
        lawyerOfficeAddress: "",
        notary: "",
        bailiff: "",
        
        // Información Financiera
        bank: "",
        accountNumber: "",
        accountingCompanyId: "",
        defaultRate: "0.00",
        defaultLateFee: "0.00",
        defaultInstallments: "0",
        defaultClosingCosts: "0.00",
        paymentPenalty: "5",
        maxPaymentOnRemainingCapital: "50",
        minPaymentOnRemainingCapital: "50",
        
        // Estado y Logo
        status: "Activa",
        logo: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCompany(null);
  };

  const handleFormChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    // Campos requeridos básicos
    if (!formData.name?.trim()) errors.push('Razón Social es requerida');
    if (!formData.commercialName?.trim()) errors.push('Nombre Comercial es requerido');
    if (!formData.ruc?.trim()) errors.push('RNC es requerido');
    if (!formData.phone?.trim()) errors.push('Teléfono es requerido');
    if (!formData.address?.trim()) errors.push('Dirección es requerida');
    
    // Validación de email si se proporciona
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Email debe tener un formato válido');
    }
    
    // Validación de campos numéricos
    if (formData.defaultRate && (isNaN(formData.defaultRate) || parseFloat(formData.defaultRate) < 0)) {
      errors.push('Tasa por defecto debe ser un número válido mayor o igual a 0');
    }
    
    if (formData.defaultLateFee && (isNaN(formData.defaultLateFee) || parseFloat(formData.defaultLateFee) < 0)) {
      errors.push('Mora por defecto debe ser un número válido mayor o igual a 0');
    }
    
    if (formData.defaultInstallments && (isNaN(formData.defaultInstallments) || parseInt(formData.defaultInstallments) < 0)) {
      errors.push('Cuotas por defecto debe ser un número entero mayor o igual a 0');
    }
    
    // Validación de porcentajes
    const percentageFields = [
      { field: 'defaultClosingCosts', name: 'Gastos cierre por defecto' },
      { field: 'paymentPenalty', name: 'Penalidad por abono' },
      { field: 'maxPaymentOnRemainingCapital', name: 'Máx. abono sobre capital restante' },
      { field: 'minPaymentOnRemainingCapital', name: 'Min. abono sobre capital restante' }
    ];
    
    percentageFields.forEach(({ field, name }) => {
      const value = formData[field];
      if (value && (isNaN(value) || parseFloat(value) < 0 || parseFloat(value) > 100)) {
        errors.push(`${name} debe ser un porcentaje válido entre 0 y 100`);
      }
    });
    
    return errors;
  };

  const handleSaveCompany = async () => {
    console.log('💾 Starting handleSaveCompany');
    
    // Validar formulario antes de guardar
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setSnackbar({ 
        open: true, 
        message: `Errores de validación: ${validationErrors.join(', ')}`, 
        severity: 'error' 
      });
      return;
    }
    
    setSaving(true);
    try {
      if (editingCompany) {
        // Editar empresa existente - mapear campos del formulario a la base de datos
        const updateData = {
          // Información General
          RazonSocial: formData.name,
          NombreComercial: formData.commercialName,
          RNC: formData.ruc,
          Telefono: formData.phone,
          Direccion: formData.address,
          
          // Información Legal
          Presidente: formData.president || '',
          CedulaPresidente: formData.presidentId || '',
          Abogado: formData.lawyer || '',
          EstadoCivilAbogado: formData.lawyerMaritalStatus === 'Casado' ? 2 : 1,
          CedulaAbogado: formData.lawyerId || '',
          DireccionAbogado: formData.lawyerOfficeAddress || '',
          Notario: formData.notary || '',
          Alguacil: formData.bailiff || '',
          
          // Información Financiera
          Banco: formData.bank || '',
          NoCuenta: formData.accountNumber || '',
          EmpresaContabilidadId: formData.accountingCompanyId || '',
          Tasa: parseFloat(formData.defaultRate || 0),
          Mora: parseFloat(formData.defaultLateFee || 0),
          Cuotas: parseInt(formData.defaultInstallments || 0),
          GastoCierre: parseFloat(formData.defaultClosingCosts || 0),
          Penalidad: parseFloat(formData.paymentPenalty || 5),
          MaxAbonoSobreCapital: parseFloat(formData.maxPaymentOnRemainingCapital || 50) / 100,
          MinAbonoSobreCapital: parseFloat(formData.minPaymentOnRemainingCapital || 50) / 100,
          
          // Estado y Logo
          Activo: formData.status === "Activa",
          Logo: formData.logo || ''
        };
        console.log('✏️ Updating existing company:', editingCompany.id, updateData);
        await updateEmpresa(editingCompany.id, updateData);
        setSnackbar({ open: true, message: 'Empresa actualizada exitosamente', severity: 'success' });
      } else {
        // Crear nueva empresa - mapear campos del formulario a la base de datos
        const newCompanyData = {
          // Información General
          RazonSocial: formData.name,
          NombreComercial: formData.commercialName,
          RNC: formData.ruc,
          Telefono: formData.phone,
          Direccion: formData.address,
          
          // Información Legal
          Presidente: formData.president || '',
          CedulaPresidente: formData.presidentId || '',
          Abogado: formData.lawyer || '',
          EstadoCivilAbogado: formData.lawyerMaritalStatus === 'Casado' ? 2 : 1,
          CedulaAbogado: formData.lawyerId || '',
          DireccionAbogado: formData.lawyerOfficeAddress || '',
          Notario: formData.notary || '',
          Alguacil: formData.bailiff || '',
          
          // Información Financiera
          Banco: formData.bank || '',
          NoCuenta: formData.accountNumber || '',
          EmpresaContabilidadId: formData.accountingCompanyId || '',
          Tasa: parseFloat(formData.defaultRate || 0),
        Mora: parseFloat(formData.defaultLateFee || 0),
        Cuotas: parseInt(formData.defaultInstallments || 0),
        GastoCierre: parseFloat(formData.defaultClosingCosts || 0),
        Penalidad: parseFloat(formData.paymentPenalty || 5),
          MaxAbonoSobreCapital: parseFloat(formData.maxPaymentOnRemainingCapital || 50) / 100,
          MinAbonoSobreCapital: parseFloat(formData.minPaymentOnRemainingCapital || 50) / 100,
          
          // Estado y Logo
          Activo: formData.status === "Activa",
          Logo: formData.logo || ''
        };
        console.log('🆕 Creating new company:', newCompanyData);
        const result = await createEmpresa(newCompanyData);
        console.log('📝 Create result:', result);
        setSnackbar({ open: true, message: 'Empresa creada exitosamente', severity: 'success' });
      }
      // Recargar los datos para actualizar la tabla
      console.log('🔄 Calling loadData to refresh table');
      await loadData();
      console.log('✅ loadData completed');
      handleCloseDialog();
    } catch (error) {
      console.error('❌ Error al guardar empresa:', error);
      setSnackbar({ open: true, message: 'Error al guardar la empresa', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    try {
      await deleteEmpresa(companyId);
      setSnackbar({ open: true, message: 'Empresa eliminada exitosamente', severity: 'success' });
      // Recargar los datos para actualizar la tabla
      await loadData();
    } catch (error) {
      console.error('Error al eliminar empresa:', error);
      setSnackbar({ open: true, message: 'Error al eliminar la empresa', severity: 'error' });
    }
    handleMenuClose();
  };

  const handleMenuOpen = (event, company) => {
    setAnchorEl(event.currentTarget);
    setSelectedCompany(company);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCompany(null);
  };

  const handleMenuOption = (action) => {
    if (action === 'edit') {
      handleOpenDialog(selectedCompany);
    } else if (action === 'delete') {
      // Usar el campo correcto de ID de la base de datos
      const companyId = selectedCompany.IdEmpresa || selectedCompany.id;
      handleDeleteCompany(companyId);
    }
    handleMenuClose();
  };

  const filteredCompanies = companies.filter(company => {
    const name = company.RazonSocial || company.name || "";
    const commercialName = company.NombreComercial || company.commercialName || "";
    const ruc = company.RNC || company.ruc || "";
    const phone = company.Telefono || company.phone || "";
    
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           commercialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           ruc.includes(searchTerm) ||
           phone.includes(searchTerm);
  });

  const paginatedCompanies = filteredCompanies.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusColor = (status) => {
    return status === 'Activa' ? 'success' : 'error';
  };

  return (
    <Box sx={{ p: 1.5 }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 1 }}>
          Gestión de Empresas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra las empresas registradas en el sistema
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ '& .MuiCardContent-root': { p: 1.5, '&:last-child': { pb: 1.5 } } }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                  <BusinessIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '1.25rem', mb: 0.5 }}>{companies.length}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    Total Empresas
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ '& .MuiCardContent-root': { p: 1.5, '&:last-child': { pb: 1.5 } } }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar sx={{ bgcolor: 'success.main', width: 36, height: 36 }}>
                  <BusinessIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '1.25rem', mb: 0.5 }}>
                    {companies.filter(c => c.status === 'Activa').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    Empresas Activas
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ '& .MuiCardContent-root': { p: 1.5, '&:last-child': { pb: 1.5 } } }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar sx={{ bgcolor: 'error.main', width: 36, height: 36 }}>
                  <BusinessIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '1.25rem', mb: 0.5 }}>
                    {companies.filter(c => c.status === 'Inactiva').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    Empresas Inactivas
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ '& .MuiCardContent-root': { p: 1.5, '&:last-child': { pb: 1.5 } } }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar sx={{ bgcolor: 'info.main', width: 36, height: 36 }}>
                  <LocationIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '1.25rem', mb: 0.5 }}>
                    {companies.reduce((total, company) => total + company.branches, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    Total Sucursales
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card sx={{ '& .MuiCardContent-root': { p: 2, '&:last-child': { pb: 2 } } }}>
        <CardContent>
          {/* Toolbar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <TextField
              placeholder="Buscar empresas..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ minWidth: 300 }}
            />
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                console.log('🔄 Refreshing companies data...');
                loadData();
              }}
              size="small"
              sx={{ ml: 2 }}
            >
              Actualizar
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              size="small"
              sx={{ ml: 1 }}
            >
              Nueva Empresa
            </Button>
          </Box>

          {/* Table */}
          <JumboCard sx={{ '& .MuiCardContent-root': { p: 0 } }}>
            <TableContainer>
              <Table size="small" sx={{ '& .MuiTableCell-root': { py: 1 } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: '20%' }}>Razón Social</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '18%' }}>Nombre Comercial</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '12%' }}>RNC</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '15%' }}>Teléfono</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '8%' }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '8%' }}>Sucursales</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '12%' }}>Fecha Registro</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, width: '7%' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCompanies.map((company) => (
                    <TableRow key={company.IdEmpresa || company.id} hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            <BusinessIcon fontSize="small" />
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                            {company.RazonSocial || company.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                          {company.NombreComercial || company.commercialName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                          {company.RNC || company.ruc}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                            {company.Telefono || company.phone}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={company.Activo !== undefined ? (company.Activo ? "Activa" : "Inactiva") : (company.status || "Activa")}
                          color={getStatusColor(company.Activo !== undefined ? (company.Activo ? "Activa" : "Inactiva") : (company.status || "Activa"))}
                          size="small"
                          sx={{ height: 24, fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem', textAlign: 'center' }}>
                          {company.branches || 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                          {company.FechaCreacion ? new Date(company.FechaCreacion).toLocaleDateString() : (company.createdAt || "")}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, company)}
                          size="small"
                          sx={{ p: 0.5 }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[10, 15, 25, 50]}
              component="div"
              count={filteredCompanies.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
              }
              sx={{ 
                '& .MuiTablePagination-toolbar': { 
                  minHeight: '48px',
                  px: 1
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontSize: '0.875rem'
                }
              }}
            />
          </JumboCard>
        </CardContent>
      </Card>

      {/* Dialog for Add/Edit Company */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            minHeight: '70vh',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #e9ecef',
            py: 2,
            px: 3
          }}
        >
          <Typography variant="h5" sx={{ 
            fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
            fontWeight: 600, 
            color: '#2c3e50',
            fontSize: '1.25rem'
          }}>
            {editingCompany ? 'Editar Empresa' : 'Nueva Empresa'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ 
          p: 0,
          // Hide scrollbar but keep scroll functionality
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          '-ms-overflow-style': 'none',  // IE and Edge
          'scrollbar-width': 'none',     // Firefox
          overflow: 'auto'
        }}>
          <Box sx={{ p: 2 }}>
            {/* Información General */}
            <Accordion 
              defaultExpanded
              sx={{ 
                mb: 1,
                '&:before': { display: 'none' },
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                borderRadius: 1
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  minHeight: 48,
                  '&.Mui-expanded': { minHeight: 48 },
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px 4px 0 0'
                }}
              >
                <Typography variant="h6" sx={{ 
                  fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                  fontWeight: 600, 
                  fontSize: '1rem',
                  color: '#2c3e50'
                }}>
                  Información General
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 1.5 }}>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} md={6}>
                     <TextField
                       fullWidth
                       size="small"
                       label="Razón Social"
                       value={formData.name}
                       onChange={handleFormChange('name')}
                       required
                       sx={{
                         '& .MuiInputLabel-root': {
                           fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                           fontWeight: 500,
                           fontSize: '0.875rem'
                         },
                         '& .MuiInputBase-input': {
                           fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                           fontSize: '0.875rem'
                         }
                       }}
                     />
                   </Grid>
                   <Grid item xs={12} md={6}>
                     <TextField
                       fullWidth
                       size="small"
                       label="Nombre Comercial"
                       value={formData.commercialName}
                       onChange={handleFormChange('commercialName')}
                       required
                       sx={{
                         '& .MuiInputLabel-root': {
                           fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                           fontWeight: 500,
                           fontSize: '0.875rem'
                         },
                         '& .MuiInputBase-input': {
                           fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                           fontSize: '0.875rem'
                         }
                       }}
                     />
                   </Grid>
                   <Grid item xs={12} md={6}>
                     <TextField
                       fullWidth
                       size="small"
                       label="RNC"
                       value={formData.ruc}
                       onChange={handleFormChange('ruc')}
                       required
                       sx={{
                         '& .MuiInputLabel-root': {
                           fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                           fontWeight: 500,
                           fontSize: '0.875rem'
                         },
                         '& .MuiInputBase-input': {
                           fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                           fontSize: '0.875rem'
                         }
                       }}
                     />
                   </Grid>
                   <Grid item xs={12} md={6}>
                     <TextField
                       fullWidth
                       size="small"
                       label="Teléfono"
                       value={formData.phone}
                       onChange={handleFormChange('phone')}
                       required
                       sx={{
                         '& .MuiInputLabel-root': {
                           fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                           fontWeight: 500,
                           fontSize: '0.875rem'
                         },
                         '& .MuiInputBase-input': {
                           fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                           fontSize: '0.875rem'
                         }
                       }}
                     />
                   </Grid>
                   <Grid item xs={12}>
                     <TextField
                       fullWidth
                       size="small"
                       label="Dirección"
                       value={formData.address}
                       onChange={handleFormChange('address')}
                       required
                       sx={{
                         '& .MuiInputLabel-root': {
                           fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                           fontWeight: 500,
                           fontSize: '0.875rem'
                         },
                         '& .MuiInputBase-input': {
                           fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                           fontSize: '0.875rem'
                         }
                       }}
                     />
                   </Grid>
                   <Grid item xs={12} md={6}>
                     <TextField
                       fullWidth
                       size="small"
                       label="Email"
                       type="email"
                       value={formData.email}
                       onChange={handleFormChange('email')}
                       sx={{
                         '& .MuiInputLabel-root': {
                           fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                           fontWeight: 500,
                           fontSize: '0.875rem'
                         },
                         '& .MuiInputBase-input': {
                           fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                           fontSize: '0.875rem'
                         }
                       }}
                     />
                   </Grid>
                   <Grid item xs={12} md={6}>
                     <FormControl fullWidth size="small">
                       <InputLabel sx={{
                         fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                         fontWeight: 500,
                         fontSize: '0.875rem'
                       }}>Estado</InputLabel>
                       <Select
                         value={formData.status}
                         sx={{
                           '& .MuiSelect-select': {
                             fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                             fontSize: '0.875rem'
                           }
                         }}
                         label="Estado"
                         onChange={handleFormChange('status')}
                       >
                         <MenuItem value="Activa">Activa</MenuItem>
                         <MenuItem value="Inactiva">Inactiva</MenuItem>
                       </Select>
                     </FormControl>
                   </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Información Legal */}
            <Accordion
              sx={{ 
                mb: 1,
                '&:before': { display: 'none' },
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                borderRadius: 1
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  minHeight: 48,
                  '&.Mui-expanded': { minHeight: 48 },
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px 4px 0 0'
                }}
              >
                <Typography variant="h6" sx={{ 
                  fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                  fontWeight: 600, 
                  fontSize: '1rem',
                  color: '#2c3e50'
                }}>
                  Información Legal
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 1.5 }}>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Presidente"
                      value={formData.president}
                      onChange={(e) => setFormData({ ...formData, president: e.target.value })}
                      sx={professionalFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Cédula del Presidente"
                      value={formData.presidentId}
                      onChange={(e) => setFormData({ ...formData, presidentId: e.target.value })}
                      sx={professionalFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Abogado"
                      value={formData.lawyer}
                      onChange={(e) => setFormData({ ...formData, lawyer: e.target.value })}
                      sx={professionalFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small" sx={professionalFieldStyle}>
                      <InputLabel>Estado Civil del Abogado</InputLabel>
                      <Select
                        value={formData.lawyerMaritalStatus}
                        label="Estado Civil del Abogado"
                        onChange={(e) => setFormData({ ...formData, lawyerMaritalStatus: e.target.value })}
                      >
                        <MenuItem value="Soltero">Soltero</MenuItem>
                        <MenuItem value="Casado">Casado</MenuItem>
                        <MenuItem value="Divorciado">Divorciado</MenuItem>
                        <MenuItem value="Viudo">Viudo</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Cédula del Abogado"
                      value={formData.lawyerId}
                      onChange={(e) => setFormData({ ...formData, lawyerId: e.target.value })}
                      sx={professionalFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Dirección Estudios del Abogado"
                      value={formData.lawyerOfficeAddress}
                      onChange={(e) => setFormData({ ...formData, lawyerOfficeAddress: e.target.value })}
                      sx={professionalFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Notario"
                      value={formData.notary}
                      onChange={(e) => setFormData({ ...formData, notary: e.target.value })}
                      placeholder="N/D"
                      sx={professionalFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Alguacil"
                      value={formData.bailiff}
                      onChange={(e) => setFormData({ ...formData, bailiff: e.target.value })}
                      sx={professionalFieldStyle}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Información Financiera */}
            <Accordion
              sx={{ 
                mb: 1,
                '&:before': { display: 'none' },
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                borderRadius: 1
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  minHeight: 48,
                  '&.Mui-expanded': { minHeight: 48 },
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px 4px 0 0'
                }}
              >
                <Typography variant="h6" sx={{ 
                  fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                  fontWeight: 600, 
                  fontSize: '1rem',
                  color: '#2c3e50'
                }}>
                  Información Financiera
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 1.5 }}>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Banco"
                      value={formData.bank}
                      onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                      sx={professionalFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="No. Cuenta"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      sx={professionalFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Empresa en Contabilidad ID"
                      value={formData.accountingCompanyId}
                      onChange={(e) => setFormData({ ...formData, accountingCompanyId: e.target.value })}
                      sx={professionalFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="% Tasa por Defecto"
                      type="number"
                      value={formData.defaultRate}
                      onChange={(e) => setFormData({ ...formData, defaultRate: e.target.value })}
                      inputProps={{ step: "0.01", min: "0" }}
                      sx={professionalFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="% Mora por Defecto"
                      type="number"
                      value={formData.defaultLateFee}
                      onChange={(e) => setFormData({ ...formData, defaultLateFee: e.target.value })}
                      inputProps={{ step: "0.01", min: "0" }}
                      sx={professionalFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Cuotas por Defecto"
                      type="number"
                      value={formData.defaultInstallments}
                      onChange={(e) => setFormData({ ...formData, defaultInstallments: e.target.value })}
                      inputProps={{ min: "0" }}
                      sx={professionalFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="% Gastos Cierre por Defecto"
                      type="number"
                      value={formData.defaultClosingCosts}
                      onChange={(e) => setFormData({ ...formData, defaultClosingCosts: e.target.value })}
                      inputProps={{ step: "0.01", min: "0" }}
                      sx={professionalFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="% De Penalidad por Abono"
                      type="number"
                      value={formData.paymentPenalty}
                      onChange={(e) => setFormData({ ...formData, paymentPenalty: e.target.value })}
                      inputProps={{ step: "0.01", min: "0" }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="% Máx. Abono sobre Capital Restante"
                      type="number"
                      value={formData.maxPaymentOnRemainingCapital}
                      onChange={(e) => setFormData({ ...formData, maxPaymentOnRemainingCapital: e.target.value })}
                      inputProps={{ step: "0.01", min: "0", max: "100" }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="% Min. Abono sobre Capital Restante"
                      type="number"
                      value={formData.minPaymentOnRemainingCapital}
                      onChange={(e) => setFormData({ ...formData, minPaymentOnRemainingCapital: e.target.value })}
                      inputProps={{ step: "0.01", min: "0", max: "100" }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Logo */}
            <Accordion
              sx={{ 
                mb: 1,
                '&:before': { display: 'none' },
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                borderRadius: 1
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  minHeight: 48,
                  '&.Mui-expanded': { minHeight: 48 },
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px 4px 0 0'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  Logo de la Empresa
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        border: '2px dashed #ccc',
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'action.hover'
                        }
                      }}
                      onClick={() => document.getElementById('logo-upload').click()}
                    >
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/bmp"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.size > 1024 * 1024) { // 1MB
                              alert('El archivo debe ser menor a 1MB');
                              return;
                            }
                            setFormData({ ...formData, logo: file });
                          }
                        }}
                      />
                      <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body1" color="text.secondary">
                        {formData.logo ? formData.logo.name : 'Ningún archivo seleccionado'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Logo (sólo formato JPG, BMP, PNG Max. 1mb)
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        </DialogContent>
        <DialogActions 
          sx={{ 
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #e9ecef',
            px: 3,
            py: 2,
            gap: 2
          }}
        >
          <Button 
            onClick={handleCloseDialog} 
            disabled={saving}
            sx={{ 
              color: '#6c757d',
              borderColor: '#6c757d',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                borderColor: '#5a6268'
              }
            }}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveCompany} 
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: '#007bff',
              '&:hover': {
                backgroundColor: '#0056b3'
              },
              fontWeight: 600,
              px: 3
            }}
          >
            {saving ? 'Guardando...' : (editingCompany ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
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
          onClick={() => handleMenuOption('edit')}
          sx={{ 
            py: 1.2, 
            px: 2,
            '&:hover': { backgroundColor: '#f8f9fa' }
          }}
        >
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Editar
        </MenuItem>
        <MenuItem 
          onClick={() => handleMenuOption('delete')}
          sx={{ 
            py: 1.2, 
            px: 2,
            color: 'error.main',
            '&:hover': { backgroundColor: '#ffebee' }
          }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Loading overlay */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <CircularProgress size={60} />
        </Box>
      )}
    </Box>
  );
};

export default CompaniesPage;