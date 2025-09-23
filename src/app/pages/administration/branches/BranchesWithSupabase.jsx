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
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Store as StoreIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { JumboCard } from "@jumbo/components";
import { useSucursales, useEmpresas } from "@app/_hooks/useSupabaseData";
import { SucursalesService } from "@app/_services/sucursalesService";

const BranchesWithSupabase = () => {
  // Hooks de Supabase
  const {
    data: sucursales,
    loading: loadingSucursales,
    error: errorSucursales,
    create: createSucursal,
    update: updateSucursal,
    remove: deleteSucursal,
    search: searchSucursales,
    stats: statsSucursales,
    loadData: loadSucursales,
  } = useSucursales();

  const {
    empresas,
    loading: loadingEmpresas,
    loadData: loadEmpresas,
  } = useEmpresas();

  // Debug logs
  console.log('🏢 Empresas data:', empresas);
  console.log('⏳ Loading empresas:', loadingEmpresas);
  console.log('📊 Empresas length:', empresas?.length || 0);
  console.log('🏪 Sucursales data:', sucursales);
  console.log('📊 Sucursales length:', sucursales?.length || 0);
  if (sucursales?.length > 0) {
    console.log('🔍 Primera sucursal:', sucursales[0]);
    console.log('🔍 Campos disponibles:', Object.keys(sucursales[0]));
  }

  // Force load companies data on component mount
  useEffect(() => {
    console.log('🚀 Forzando carga de empresas...');
    if (loadEmpresas) {
      loadEmpresas();
    }
  }, [loadEmpresas]);

  // Estados locales
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [emailError, setEmailError] = useState("");
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);

  // Estados del formulario - Todos los campos de la tabla sucursales
  const [formData, setFormData] = useState({
    IdEmpresa: "",
    Nombre: "",
    Codigo: "",
    Direccion: "",
    Telefono: "",
    Email: "",
    Gerente: "",
    TelefonoGerente: "",
    EmailGerente: "",
    Activo: true,
    // Información de empresa específica de sucursal
    RazonSocial: "",
    NombreComercial: "",
    RNC: "",
    Presidente: "",
    CedulaPresidente: "",
    // Información legal
    Abogado: "",
    EstadoCivilAbogado: 1,
    CedulaAbogado: "",
    DireccionAbogado: "",
    // Testigos
    PrimerTestigo: "",
    SegundoTestigo: "",
    // Alguacil
    Alguacil: "",
    // Información bancaria
    Banco: "",
    NumeroCuenta: "",
    // Configuración de préstamos
    TipoRecibo: "",
    Tasa: 0,
    Mora: 0,
    Cuotas: 12,
    GastoCierre: 0,
    PagoMinimoVencido: 0,
    PenalidadAbono: 0,
    MaxAbonoCapital: 1,
    MinAbonoCapital: 0,
    // Información adicional del gerente
    CedulaGerente: "",
    DireccionGerente: "",
    // Configuración adicional
    ProcesoLegalAutomatico: false,
    CostoBasico: 0,
    CuotasVencidas: 0,
    DiasTransacciones: 0,
  });

  // Datos de respaldo en caso de que no haya conexión
  const fallbackBranches = [
    {
      IdSucursal: 1,
      IdEmpresa: 1,
      Nombre: "Sucursal Central",
      Codigo: "SUC001",
      Direccion: "Av. 27 de Febrero #123, Santo Domingo",
      Telefono: "809-555-0101",
      Email: "central@empresa1.com",
      Gerente: "María González",
      TelefonoGerente: "809-555-0102",
      EmailGerente: "maria.gonzalez@empresa1.com",
      Activo: true,
      FechaCreacion: "2024-01-15T10:30:00Z",
    },
    {
      IdSucursal: 2,
      IdEmpresa: 1,
      Nombre: "Sucursal Norte",
      Codigo: "SUC002",
      Direccion: "Av. John F. Kennedy #456, Santo Domingo",
      Telefono: "809-555-0201",
      Email: "norte@empresa1.com",
      Gerente: "Carlos Rodríguez",
      TelefonoGerente: "809-555-0202",
      EmailGerente: "carlos.rodriguez@empresa1.com",
      Activo: true,
      FechaCreacion: "2024-01-20T14:15:00Z",
    },
  ];

  // Datos a mostrar (reales o de respaldo)
  const displayData = sucursales && sucursales.length > 0 ? sucursales : fallbackBranches;

  // Filtrar datos según búsqueda
  const filteredData = displayData.filter((branch) =>
    branch.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.Codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.Gerente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.Email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Datos paginados
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Obtener nombre de empresa
  const getEmpresaName = (idEmpresa) => {
    const empresa = empresas?.find(emp => emp.IdEmpresa === idEmpresa);
    return empresa ? empresa.RazonSocial : `Empresa ${idEmpresa}`;
  };

  // Manejar búsqueda
  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term && searchSucursales) {
      try {
        await searchSucursales(term);
      } catch (error) {
        console.error("Error en búsqueda:", error);
      }
    }
  };

  // Manejar cambios en el formulario
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Abrir diálogo
  const handleOpenDialog = (mode, branch = null) => {
    setDialogMode(mode);
    setSelectedBranch(branch);
    
    // Limpiar errores de validación
    setEmailError("");
    setIsValidatingEmail(false);
    
    if (mode === "create") {
      setFormData({
        IdEmpresa: "",
        Nombre: "",
        Codigo: "",
        Direccion: "",
        Telefono: "",
        Email: "",
        Gerente: "",
        TelefonoGerente: "",
        EmailGerente: "",
        Activo: true,
        // Información de empresa específica de sucursal
        RazonSocial: "",
        NombreComercial: "",
        RNC: "",
        Presidente: "",
        CedulaPresidente: "",
        // Información legal
        Abogado: "",
        EstadoCivilAbogado: 1,
        CedulaAbogado: "",
        DireccionAbogado: "",
        // Testigos
        PrimerTestigo: "",
        SegundoTestigo: "",
        // Alguacil
        Alguacil: "",
        // Información bancaria
        Banco: "",
        NumeroCuenta: "",
        // Configuración de préstamos
        TipoRecibo: "",
        Tasa: 0,
        Mora: 0,
        Cuotas: 12,
        GastoCierre: 0,
        PagoMinimoVencido: 0,
        PenalidadAbono: 0,
        MaxAbonoCapital: 1,
        MinAbonoCapital: 0,
        // Información adicional del gerente
        CedulaGerente: "",
        DireccionGerente: "",
        // Configuración adicional
        ProcesoLegalAutomatico: false,
        CostoBasico: 0,
        CuotasVencidas: 0,
        DiasTransacciones: 0,
      });
    } else if (mode === "edit" && branch) {
      setFormData({
        IdEmpresa: branch.IdEmpresa || "",
        Nombre: branch.Nombre || "",
        Codigo: branch.Codigo || "",
        Direccion: branch.Direccion || "",
        Telefono: branch.Telefono || "",
        Email: branch.Email || "",
        Gerente: branch.Gerente || "",
        TelefonoGerente: branch.TelefonoGerente || "",
        EmailGerente: branch.EmailGerente || "",
        Activo: branch.Activo !== undefined ? branch.Activo : true,
        // Información de empresa específica de sucursal
        RazonSocial: branch.RazonSocial || "",
        NombreComercial: branch.NombreComercial || "",
        RNC: branch.RNC || "",
        Presidente: branch.Presidente || "",
      CedulaPresidente: branch.CedulaPresidente || "",
        // Información legal
        Abogado: branch.Abogado || "",
        EstadoCivilAbogado: branch.EstadoCivilAbogado || 1,
        CedulaAbogado: branch.CedulaAbogado || "",
        DireccionAbogado: branch.DireccionAbogado || "",
        // Testigos
        PrimerTestigo: branch.PrimerTestigo || "",
        SegundoTestigo: branch.SegundoTestigo || "",
        // Alguacil
        Alguacil: branch.Alguacil || "",
        // Información bancaria
        Banco: branch.Banco || "",
        NumeroCuenta: branch.NumeroCuenta || "",
        // Configuración de préstamos
        TipoRecibo: branch.TipoRecibo || "",
        Tasa: branch.Tasa || 0,
        Mora: branch.Mora || 0,
        Cuotas: branch.Cuotas || 12,
        GastoCierre: branch.GastoCierre || 0,
        PagoMinimoVencido: branch.PagoMinimoVencido || 0,
        PenalidadAbono: branch.PenalidadAbono || 0,
        MaxAbonoCapital: branch.MaxAbonoCapital || 1,
        MinAbonoCapital: branch.MinAbonoCapital || 0,
        // Información adicional del gerente
        CedulaGerente: branch.CedulaGerente || "",
        DireccionGerente: branch.DireccionGerente || "",
        // Configuración adicional
        ProcesoLegalAutomatico: branch.ProcesoLegalAutomatico || false,
        CostoBasico: branch.CostoBasico || 0,
        CuotasVencidas: branch.CuotasVencidas || 0,
        DiasTransacciones: branch.DiasTransacciones || 0,
      });
    }
    
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBranch(null);
    
    // Limpiar errores de validación
    setEmailError("");
    setIsValidatingEmail(false);
    setFormData({
      IdEmpresa: "",
      Nombre: "",
      Codigo: "",
      Direccion: "",
      Telefono: "",
      Email: "",
      Gerente: "",
      TelefonoGerente: "",
      EmailGerente: "",
      Activo: true,
      // Información de empresa específica de sucursal
      RazonSocial: "",
      NombreComercial: "",
      RNC: "",
      Presidente: "",
      CedulaPresidente: "",
      // Información legal
      Abogado: "",
      EstadoCivilAbogado: 1,
      CedulaAbogado: "",
      DireccionAbogado: "",
      // Testigos
      PrimerTestigo: "",
      SegundoTestigo: "",
      // Alguacil
      Alguacil: "",
      // Información bancaria
      Banco: "",
      NumeroCuenta: "",
      // Configuración de préstamos
      TipoRecibo: "",
      Tasa: 0,
      Mora: 0,
      Cuotas: 12,
      GastoCierre: 0,
      PagoMinimoVencido: 0,
      PenalidadAbono: 0,
      MaxAbonoCapital: 1,
      MinAbonoCapital: 0,
      // Información adicional del gerente
      CedulaGerente: "",
      DireccionGerente: "",
      // Configuración adicional
      ProcesoLegalAutomatico: false,
      CostoBasico: 0,
      CuotasVencidas: 0,
      DiasTransacciones: 0,
    });
  };

  // Validar email único
  const validateEmail = async (email) => {
    if (!email || email.trim() === "") {
      setEmailError("");
      return true;
    }

    setIsValidatingEmail(true);
    setEmailError("");

    try {
      const excludeId = dialogMode === "edit" ? selectedBranch?.IdSucursal : null;
      const result = await SucursalesService.checkEmailExists(email, excludeId);
      
      if (result.success && result.exists) {
        setEmailError("Este email ya está siendo utilizado por otra sucursal");
        setIsValidatingEmail(false);
        return false;
      }
      
      setEmailError("");
      setIsValidatingEmail(false);
      return true;
    } catch (error) {
      console.error("Error validando email:", error);
      setEmailError("Error al validar el email");
      setIsValidatingEmail(false);
      return false;
    }
  };

  // Guardar sucursal
  const handleSave = async () => {
    try {
      // Validar email antes de guardar
      if (formData.Email && formData.Email.trim() !== "") {
        const isEmailValid = await validateEmail(formData.Email);
        if (!isEmailValid) {
          setSnackbar({
            open: true,
            message: "Por favor, corrija el error en el email antes de continuar",
            severity: "error"
          });
          return;
        }
      }
      // Ahora enviamos todos los campos ya que están en la tabla sucursales
      const sucursalData = {
        IdEmpresa: formData.IdEmpresa,
        Nombre: formData.Nombre,
        Codigo: formData.Codigo,
        Direccion: formData.Direccion,
        Telefono: formData.Telefono,
        Email: formData.Email,
        Gerente: formData.Gerente,
        TelefonoGerente: formData.TelefonoGerente,
        EmailGerente: formData.EmailGerente,
        Activo: formData.Activo !== undefined ? formData.Activo : true,
        // Información de empresa específica de sucursal
        RazonSocial: formData.RazonSocial,
        NombreComercial: formData.NombreComercial,
        RNC: formData.RNC,
        Presidente: formData.Presidente,
      CedulaPresidente: formData.CedulaPresidente,
        // Información legal
        Abogado: formData.Abogado,
        EstadoCivilAbogado: formData.EstadoCivilAbogado,
        CedulaAbogado: formData.CedulaAbogado,
        DireccionAbogado: formData.DireccionAbogado,
        // Testigos
        PrimerTestigo: formData.PrimerTestigo,
        SegundoTestigo: formData.SegundoTestigo,
        // Alguacil
        Alguacil: formData.Alguacil,
        // Información bancaria
        Banco: formData.Banco,
        NumeroCuenta: formData.NumeroCuenta,
        // Configuración de préstamos
        TipoRecibo: formData.TipoRecibo,
        Tasa: formData.Tasa,
        Mora: formData.Mora,
        Cuotas: formData.Cuotas,
        GastoCierre: formData.GastoCierre,
        PagoMinimoVencido: formData.PagoMinimoVencido,
        PenalidadAbono: formData.PenalidadAbono,
        MaxAbonoCapital: formData.MaxAbonoCapital,
        MinAbonoCapital: formData.MinAbonoCapital,
        // Información adicional del gerente
        CedulaGerente: formData.CedulaGerente,
        DireccionGerente: formData.DireccionGerente,
        // Configuración adicional
        ProcesoLegalAutomatico: formData.ProcesoLegalAutomatico,
        CostoBasico: formData.CostoBasico,
        CuotasVencidas: formData.CuotasVencidas,
        DiasTransacciones: formData.DiasTransacciones,
      };

      if (dialogMode === "create") {
        await createSucursal(sucursalData);
        setSnackbar({
          open: true,
          message: "Sucursal creada exitosamente",
          severity: "success"
        });
      } else if (dialogMode === "edit") {
        await updateSucursal(selectedBranch.IdSucursal, sucursalData);
        setSnackbar({
          open: true,
          message: "Sucursal actualizada exitosamente",
          severity: "success"
        });
      }
      
      // Refrescar la lista de sucursales después de guardar
      await loadSucursales();
      handleCloseDialog();
    } catch (error) {
      console.error("Error al guardar sucursal:", error);
      setSnackbar({
        open: true,
        message: "Error al guardar la sucursal",
        severity: "error"
      });
    }
  };

  // Eliminar sucursal
  const handleDelete = async (branch) => {
    if (window.confirm(`¿Está seguro de eliminar la sucursal "${branch.Nombre}"?`)) {
      try {
        await deleteSucursal(branch.IdSucursal);
        setSnackbar({
          open: true,
          message: "Sucursal eliminada exitosamente",
          severity: "success"
        });
        // Refrescar la lista de sucursales después de eliminar
        await loadSucursales();
      } catch (error) {
        console.error("Error al eliminar sucursal:", error);
        setSnackbar({
          open: true,
          message: "Error al eliminar la sucursal",
          severity: "error"
        });
      }
    }
  };

  // Manejar cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Manejar cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Backdrop de carga */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingSucursales || loadingEmpresas}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Encabezado */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Sucursales
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administra las sucursales de las empresas registradas
        </Typography>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <StoreIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Sucursales</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {statsSucursales?.total || displayData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Sucursales Activas</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {statsSucursales?.active || displayData.filter(b => b.Activo).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Sucursales Inactivas</Typography>
              </Box>
              <Typography variant="h4" color="error.main">
                {statsSucursales?.inactive || displayData.filter(b => !b.Activo).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Barra de herramientas */}
      <JumboCard sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <TextField
              placeholder="Buscar sucursales..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ minWidth: 300 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog("create")}
            >
              Nueva Sucursal
            </Button>
          </Stack>
        </Box>
      </JumboCard>

      {/* Tabla de sucursales */}
      <JumboCard>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Código</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Empresa</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Gerente</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Teléfono</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '120px' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((branch) => (
                <TableRow key={branch.IdSucursal} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {branch.Codigo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        <StoreIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {branch.Nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {branch.Direccion}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {getEmpresaName(branch.IdEmpresa)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {branch.Gerente}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {branch.TelefonoGerente}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {branch.Telefono}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {branch.Email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={branch.Activo ? "Activa" : "Inactiva"}
                      color={branch.Activo ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Ver detalles">
                        <IconButton size="small" onClick={() => handleOpenDialog("view", branch)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => handleOpenDialog("edit", branch)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" onClick={() => handleDelete(branch)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </JumboCard>

      {/* Diálogo para crear/editar sucursal */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ 
          fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
          fontWeight: 600,
          fontSize: '1.25rem',
          color: '#2c3e50',
          borderBottom: '1px solid #e0e0e0',
          pb: 2
        }}>
          {dialogMode === "create" ? "Nueva Sucursal" : 
           dialogMode === "edit" ? "Editar Sucursal" : "Detalles de Sucursal"}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {/* Estilo profesional para campos */}
          {(() => {
            const professionalFieldStyle = {
              '& .MuiInputLabel-root': {
                fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                fontWeight: 500,
                fontSize: '0.875rem'
              },
              '& .MuiInputBase-input': {
                fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                fontSize: '0.875rem'
              },
              '& .MuiSelect-select': {
                fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                fontSize: '0.875rem'
              }
            };

            return (
               <Box sx={{ p: 2 }}>
                 {/* Información Básica de la Sucursal */}
                 <Accordion
                   defaultExpanded
                   sx={{ 
                     mb: 1,
                     '&:before': { display: 'none' },
                     boxShadow: 'none',
                     border: '1px solid #e0e0e0'
                   }}
                 >
                   <AccordionSummary
                     expandIcon={<ExpandMoreIcon />}
                     sx={{
                       backgroundColor: '#f5f5f5',
                       minHeight: 48,
                       '&.Mui-expanded': { minHeight: 48 },
                       '& .MuiAccordionSummary-content': {
                         margin: '8px 0',
                         '&.Mui-expanded': { margin: '8px 0' }
                       }
                     }}
                   >
                     <Typography
                       variant="subtitle2"
                       sx={{
                         fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                         fontWeight: 600,
                         color: '#333'
                       }}
                     >
                       Información Básica de la Sucursal
                     </Typography>
                   </AccordionSummary>
                   <AccordionDetails sx={{ p: 2 }}>
                     <Grid container spacing={2}>
                       <Grid item xs={12} md={6}>
                         <FormControl fullWidth size="small" sx={professionalFieldStyle}>
                           <InputLabel>Empresa</InputLabel>
                           <Select
                             value={formData.IdEmpresa || ''}
                             onChange={(e) => handleFormChange("IdEmpresa", e.target.value)}
                             disabled={dialogMode === "view"}
                             label="Empresa"
                           >
                             {empresas?.map((empresa) => (
                               <MenuItem key={empresa.IdEmpresa} value={empresa.IdEmpresa}>
                                 {empresa.RazonSocial}
                               </MenuItem>
                             ))}
                           </Select>
                         </FormControl>
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Nombre de la Sucursal"
                           value={formData.Nombre || ''}
                           onChange={(e) => handleFormChange("Nombre", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                           required
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Código"
                           value={formData.Codigo || ''}
                           onChange={(e) => handleFormChange("Codigo", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Teléfono"
                           value={formData.Telefono || ''}
                           onChange={(e) => handleFormChange("Telefono", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                       <Grid item xs={12}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Dirección"
                           value={formData.Direccion || ''}
                           onChange={(e) => handleFormChange("Direccion", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                           multiline
                           rows={2}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Email"
                           type="email"
                           value={formData.Email || ''}
                           onChange={async (e) => {
                             const newEmail = e.target.value;
                             handleFormChange("Email", newEmail);
                             
                             // Validar email en tiempo real con debounce
                             if (newEmail && newEmail.trim() !== "") {
                               setTimeout(() => {
                                 if (formData.Email === newEmail) {
                                   validateEmail(newEmail);
                                 }
                               }, 500);
                             } else {
                               setEmailError("");
                             }
                           }}
                           disabled={dialogMode === "view"}
                           error={!!emailError}
                           helperText={emailError || (isValidatingEmail ? "Validando email..." : "")}
                           sx={professionalFieldStyle}
                           InputProps={{
                             endAdornment: isValidatingEmail && (
                               <CircularProgress size={20} sx={{ mr: 1 }} />
                             )
                           }}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <FormControl fullWidth size="small" sx={professionalFieldStyle}>
                           <InputLabel>Estado</InputLabel>
                           <Select
                             value={formData.Activo !== undefined ? formData.Activo : true}
                             onChange={(e) => handleFormChange("Activo", e.target.value)}
                             disabled={dialogMode === "view"}
                             label="Estado"
                           >
                             <MenuItem value={true}>Activo</MenuItem>
                             <MenuItem value={false}>Inactivo</MenuItem>
                           </Select>
                         </FormControl>
                       </Grid>
                     </Grid>
                   </AccordionDetails>
                 </Accordion>

                 {/* Información de Empresa Específica */}
                 <Accordion
                   sx={{ 
                     mb: 1,
                     '&:before': { display: 'none' },
                     boxShadow: 'none',
                     border: '1px solid #e0e0e0'
                   }}
                 >
                   <AccordionSummary
                     expandIcon={<ExpandMoreIcon />}
                     sx={{
                       backgroundColor: '#f5f5f5',
                       minHeight: 48,
                       '&.Mui-expanded': { minHeight: 48 },
                       '& .MuiAccordionSummary-content': {
                         margin: '8px 0',
                         '&.Mui-expanded': { margin: '8px 0' }
                       }
                     }}
                   >
                     <Typography
                       variant="subtitle2"
                       sx={{
                         fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                         fontWeight: 600,
                         color: '#333'
                       }}
                     >
                       Información de Empresa Específica
                     </Typography>
                   </AccordionSummary>
                   <AccordionDetails sx={{ p: 2 }}>
                     <Grid container spacing={2}>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Razón Social"
                           value={formData.RazonSocial || ''}
                           onChange={(e) => handleFormChange("RazonSocial", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Nombre Comercial"
                           value={formData.NombreComercial || ''}
                           onChange={(e) => handleFormChange("NombreComercial", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="RNC"
                           value={formData.RNC || ''}
                           onChange={(e) => handleFormChange("RNC", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Gerente"
                           value={formData.Presidente || ''}
                           onChange={(e) => handleFormChange("Presidente", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Cédula del Gerente"
                           value={formData.CedulaPresidente || ''}
                           onChange={(e) => handleFormChange("CedulaPresidente", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                     </Grid>
                   </AccordionDetails>
                 </Accordion>

                 {/* Información del Gerente */}
                 <Accordion
                   sx={{ 
                     mb: 1,
                     '&:before': { display: 'none' },
                     boxShadow: 'none',
                     border: '1px solid #e0e0e0'
                   }}
                 >
                   <AccordionSummary
                     expandIcon={<ExpandMoreIcon />}
                     sx={{
                       backgroundColor: '#f5f5f5',
                       minHeight: 48,
                       '&.Mui-expanded': { minHeight: 48 },
                       '& .MuiAccordionSummary-content': {
                         margin: '8px 0',
                         '&.Mui-expanded': { margin: '8px 0' }
                       }
                     }}
                   >
                     <Typography
                       variant="subtitle2"
                       sx={{
                         fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                         fontWeight: 600,
                         color: '#333'
                       }}
                     >
                       Información del Gerente
                     </Typography>
                   </AccordionSummary>
                   <AccordionDetails sx={{ p: 2 }}>
                     <Grid container spacing={2}>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Gerente"
                           value={formData.Gerente || ''}
                           onChange={(e) => handleFormChange("Gerente", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Cédula del Gerente"
                           value={formData.CedulaGerente || ''}
                           onChange={(e) => handleFormChange("CedulaGerente", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Teléfono del Gerente"
                           value={formData.TelefonoGerente || ''}
                           onChange={(e) => handleFormChange("TelefonoGerente", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Email del Gerente"
                           type="email"
                           value={formData.EmailGerente || ''}
                           onChange={(e) => handleFormChange("EmailGerente", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                       <Grid item xs={12}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Dirección del Gerente"
                           value={formData.DireccionGerente || ''}
                           onChange={(e) => handleFormChange("DireccionGerente", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                           multiline
                           rows={2}
                         />
                       </Grid>
                     </Grid>
                   </AccordionDetails>
                 </Accordion>

                 {/* Información Legal */}
                 <Accordion
                   sx={{ 
                     mb: 1,
                     '&:before': { display: 'none' },
                     boxShadow: 'none',
                     border: '1px solid #e0e0e0'
                   }}
                 >
                   <AccordionSummary
                     expandIcon={<ExpandMoreIcon />}
                     sx={{
                       backgroundColor: '#f5f5f5',
                       minHeight: 48,
                       '&.Mui-expanded': { minHeight: 48 },
                       '& .MuiAccordionSummary-content': {
                         margin: '8px 0',
                         '&.Mui-expanded': { margin: '8px 0' }
                       }
                     }}
                   >
                     <Typography
                       variant="subtitle2"
                       sx={{
                         fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                         fontWeight: 600,
                         color: '#333'
                       }}
                     >
                       Información Legal
                     </Typography>
                   </AccordionSummary>
                   <AccordionDetails sx={{ p: 2 }}>
                     <Grid container spacing={2}>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Abogado"
                           value={formData.Abogado || ''}
                           onChange={(e) => handleFormChange("Abogado", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Cédula del Abogado"
                           value={formData.CedulaAbogado || ''}
                           onChange={(e) => handleFormChange("CedulaAbogado", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <FormControl fullWidth size="small" sx={professionalFieldStyle}>
                           <InputLabel>Estado Civil del Abogado</InputLabel>
                           <Select
                             value={formData.EstadoCivilAbogado || 1}
                             onChange={(e) => handleFormChange("EstadoCivilAbogado", e.target.value)}
                             disabled={dialogMode === "view"}
                             label="Estado Civil del Abogado"
                           >
                             <MenuItem value={1}>Soltero(a)</MenuItem>
                             <MenuItem value={2}>Casado(a)</MenuItem>
                             <MenuItem value={3}>Divorciado(a)</MenuItem>
                             <MenuItem value={4}>Viudo(a)</MenuItem>
                             <MenuItem value={5}>Unión Libre</MenuItem>
                           </Select>
                         </FormControl>
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Alguacil"
                           value={formData.Alguacil || ''}
                           onChange={(e) => handleFormChange("Alguacil", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                       <Grid item xs={12}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Dirección del Abogado"
                           value={formData.DireccionAbogado || ''}
                           onChange={(e) => handleFormChange("DireccionAbogado", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                           multiline
                           rows={2}
                         />
                       </Grid>
                     </Grid>
                   </AccordionDetails>
                 </Accordion>

                 {/* Testigos */}
                 <Accordion
                   sx={{ 
                     mb: 1,
                     '&:before': { display: 'none' },
                     boxShadow: 'none',
                     border: '1px solid #e0e0e0'
                   }}
                 >
                   <AccordionSummary
                     expandIcon={<ExpandMoreIcon />}
                     sx={{
                       backgroundColor: '#f5f5f5',
                       minHeight: 48,
                       '&.Mui-expanded': { minHeight: 48 },
                       '& .MuiAccordionSummary-content': {
                         margin: '8px 0',
                         '&.Mui-expanded': { margin: '8px 0' }
                       }
                     }}
                   >
                     <Typography
                       variant="subtitle2"
                       sx={{
                         fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                         fontWeight: 600,
                         color: '#333'
                       }}
                     >
                       Testigos
                     </Typography>
                   </AccordionSummary>
                   <AccordionDetails sx={{ p: 2 }}>
                     <Grid container spacing={2}>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Primer Testigo"
                           value={formData.PrimerTestigo || ''}
                           onChange={(e) => handleFormChange("PrimerTestigo", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Segundo Testigo"
                           value={formData.SegundoTestigo || ''}
                           onChange={(e) => handleFormChange("SegundoTestigo", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                     </Grid>
                   </AccordionDetails>
                 </Accordion>

                 {/* Información Bancaria */}
                 <Accordion
                   sx={{ 
                     mb: 1,
                     '&:before': { display: 'none' },
                     boxShadow: 'none',
                     border: '1px solid #e0e0e0'
                   }}
                 >
                   <AccordionSummary
                     expandIcon={<ExpandMoreIcon />}
                     sx={{
                       backgroundColor: '#f5f5f5',
                       minHeight: 48,
                       '&.Mui-expanded': { minHeight: 48 },
                       '& .MuiAccordionSummary-content': {
                         margin: '8px 0',
                         '&.Mui-expanded': { margin: '8px 0' }
                       }
                     }}
                   >
                     <Typography
                       variant="subtitle2"
                       sx={{
                         fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                         fontWeight: 600,
                         color: '#333'
                       }}
                     >
                       Información Bancaria
                     </Typography>
                   </AccordionSummary>
                   <AccordionDetails sx={{ p: 2 }}>
                     <Grid container spacing={2}>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Banco"
                           value={formData.Banco || ''}
                           onChange={(e) => handleFormChange("Banco", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Número de Cuenta"
                           value={formData.NumeroCuenta || ''}
                           onChange={(e) => handleFormChange("NumeroCuenta", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                     </Grid>
                   </AccordionDetails>
                 </Accordion>

                 {/* Configuración de Préstamos */}
                 <Accordion
                   sx={{ 
                     mb: 1,
                     '&:before': { display: 'none' },
                     boxShadow: 'none',
                     border: '1px solid #e0e0e0'
                   }}
                 >
                   <AccordionSummary
                     expandIcon={<ExpandMoreIcon />}
                     sx={{
                       backgroundColor: '#f5f5f5',
                       minHeight: 48,
                       '&.Mui-expanded': { minHeight: 48 },
                       '& .MuiAccordionSummary-content': {
                         margin: '8px 0',
                         '&.Mui-expanded': { margin: '8px 0' }
                       }
                     }}
                   >
                     <Typography
                       variant="subtitle2"
                       sx={{
                         fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                         fontWeight: 600,
                         color: '#333'
                       }}
                     >
                       Configuración de Préstamos
                     </Typography>
                   </AccordionSummary>
                   <AccordionDetails sx={{ p: 2 }}>
                     <Grid container spacing={2}>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Tipo de Recibo"
                           value={formData.TipoRecibo || ''}
                           onChange={(e) => handleFormChange("TipoRecibo", e.target.value)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Tasa de Interés (%)"
                           type="number"
                           value={formData.Tasa || 0}
                           onChange={(e) => handleFormChange("Tasa", parseFloat(e.target.value) || 0)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                           inputProps={{ step: 0.01, min: 0 }}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Tasa de Mora (%)"
                           type="number"
                           value={formData.Mora || 0}
                           onChange={(e) => handleFormChange("Mora", parseFloat(e.target.value) || 0)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                           inputProps={{ step: 0.01, min: 0 }}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Cuotas por Defecto"
                           type="number"
                           value={formData.Cuotas || 12}
                           onChange={(e) => handleFormChange("Cuotas", parseInt(e.target.value) || 12)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                           inputProps={{ min: 1 }}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Gasto de Cierre"
                           type="number"
                           value={formData.GastoCierre || 0}
                           onChange={(e) => handleFormChange("GastoCierre", parseFloat(e.target.value) || 0)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                           inputProps={{ step: 0.01, min: 0 }}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Pago Mínimo Vencido"
                           type="number"
                           value={formData.PagoMinimoVencido || 0}
                           onChange={(e) => handleFormChange("PagoMinimoVencido", parseFloat(e.target.value) || 0)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                           inputProps={{ step: 0.01, min: 0 }}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Penalidad por Abono"
                           type="number"
                           value={formData.PenalidadAbono || 0}
                           onChange={(e) => handleFormChange("PenalidadAbono", parseFloat(e.target.value) || 0)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                           inputProps={{ step: 0.01, min: 0 }}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Máximo Abono sobre Capital"
                           type="number"
                           value={formData.MaxAbonoCapital || 1}
                           onChange={(e) => handleFormChange("MaxAbonoCapital", parseFloat(e.target.value) || 1)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                           inputProps={{ step: 0.01, min: 0 }}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Mínimo Abono sobre Capital"
                           type="number"
                           value={formData.MinAbonoCapital || 0}
                           onChange={(e) => handleFormChange("MinAbonoCapital", parseFloat(e.target.value) || 0)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                           inputProps={{ step: 0.01, min: 0 }}
                         />
                       </Grid>
                     </Grid>
                   </AccordionDetails>
                 </Accordion>

                 {/* Configuración Adicional */}
                 <Accordion
                   sx={{ 
                     mb: 1,
                     '&:before': { display: 'none' },
                     boxShadow: 'none',
                     border: '1px solid #e0e0e0'
                   }}
                 >
                   <AccordionSummary
                     expandIcon={<ExpandMoreIcon />}
                     sx={{
                       backgroundColor: '#f5f5f5',
                       minHeight: 48,
                       '&.Mui-expanded': { minHeight: 48 },
                       '& .MuiAccordionSummary-content': {
                         margin: '8px 0',
                         '&.Mui-expanded': { margin: '8px 0' }
                       }
                     }}
                   >
                     <Typography
                       variant="subtitle2"
                       sx={{
                         fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                         fontWeight: 600,
                         color: '#333'
                       }}
                     >
                       Configuración Adicional
                     </Typography>
                   </AccordionSummary>
                   <AccordionDetails sx={{ p: 2 }}>
                     <Grid container spacing={2}>
                       <Grid item xs={12} md={6}>
                         <FormControl fullWidth size="small" sx={professionalFieldStyle}>
                           <InputLabel>Proceso Legal Automático</InputLabel>
                           <Select
                             value={formData.ProcesoLegalAutomatico || false}
                             onChange={(e) => handleFormChange("ProcesoLegalAutomatico", e.target.value)}
                             disabled={dialogMode === "view"}
                             label="Proceso Legal Automático"
                           >
                             <MenuItem value={true}>Sí</MenuItem>
                             <MenuItem value={false}>No</MenuItem>
                           </Select>
                         </FormControl>
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Costo Básico"
                           type="number"
                           value={formData.CostoBasico || 0}
                           onChange={(e) => handleFormChange("CostoBasico", parseFloat(e.target.value) || 0)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                           inputProps={{ step: 0.01, min: 0 }}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Cuotas Vencidas Permitidas"
                           type="number"
                           value={formData.CuotasVencidas || 0}
                           onChange={(e) => handleFormChange("CuotasVencidas", parseInt(e.target.value) || 0)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                           inputProps={{ min: 0 }}
                         />
                       </Grid>
                       <Grid item xs={12} md={6}>
                         <TextField
                           fullWidth
                           size="small"
                           label="Días para Transacciones"
                           type="number"
                           value={formData.DiasTransacciones || 0}
                           onChange={(e) => handleFormChange("DiasTransacciones", parseInt(e.target.value) || 0)}
                           disabled={dialogMode === "view"}
                           sx={professionalFieldStyle}
                           inputProps={{ min: 0 }}
                         />
                       </Grid>
                     </Grid>
                   </AccordionDetails>
                 </Accordion>
               </Box>
             );
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {dialogMode === "view" ? "Cerrar" : "Cancelar"}
          </Button>
          {dialogMode !== "view" && (
            <Button onClick={handleSave} variant="contained">
              {dialogMode === "create" ? "Crear" : "Guardar"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BranchesWithSupabase;