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

  // Estados del formulario
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
    // Nuevos campos agregados
    RazonSocial: "",
    NombreComercial: "",
    RNC: "",
    Presidente: "",
    CedulaPresidente: "",
    Abogado: "",
    EstadoCivilAbogado: "Soltero",
    CedulaAbogado: "",
    DireccionEstudiosAbogado: "",
    PrimerTestigo: "",
    SegundoTestigo: "",
    Alguacil: "",
    Banco: "",
    NumeroCuenta: "",
    TipoRecibo: "/Report/Recibo.aspx",
    TasaPorDefecto: 0,
    MoraPorDefecto: 0,
    CuotasPorDefecto: 0,
    GastosCierrePorDefecto: 0,
    PagoMinimoVencido: 70,
    PenalidadAbono: 0,
    MaxAbonoCapital: 0,
    MinAbonoCapital: 0,
    CedulaGerente: "",
    DireccionGerente: "",
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
        // Nuevos campos agregados
        RazonSocial: "",
        NombreComercial: "",
        RNC: "",
        Presidente: "",
        CedulaPresidente: "",
        Abogado: "",
        EstadoCivilAbogado: "Soltero",
        CedulaAbogado: "",
        DireccionEstudiosAbogado: "",
        PrimerTestigo: "",
        SegundoTestigo: "",
        Alguacil: "",
        Banco: "",
        NumeroCuenta: "",
        TipoRecibo: "/Report/Recibo.aspx",
        TasaPorDefecto: 0,
        MoraPorDefecto: 0,
        CuotasPorDefecto: 0,
        GastosCierrePorDefecto: 0,
        PagoMinimoVencido: 70,
        PenalidadAbono: 0,
        MaxAbonoCapital: 0,
        MinAbonoCapital: 0,
        CedulaGerente: "",
        DireccionGerente: "",
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
        // Nuevos campos agregados
        RazonSocial: branch.RazonSocial || "",
        NombreComercial: branch.NombreComercial || "",
        RNC: branch.RNC || "",
        Presidente: branch.Presidente || "",
        CedulaPresidente: branch.CedulaPresidente || "",
        Abogado: branch.Abogado || "",
        EstadoCivilAbogado: branch.EstadoCivilAbogado || "Soltero",
        CedulaAbogado: branch.CedulaAbogado || "",
        DireccionEstudiosAbogado: branch.DireccionEstudiosAbogado || "",
        PrimerTestigo: branch.PrimerTestigo || "",
        SegundoTestigo: branch.SegundoTestigo || "",
        Alguacil: branch.Alguacil || "",
        Banco: branch.Banco || "",
        NumeroCuenta: branch.NumeroCuenta || "",
        TipoRecibo: branch.TipoRecibo || "/Report/Recibo.aspx",
        TasaPorDefecto: branch.TasaPorDefecto || 0,
        MoraPorDefecto: branch.MoraPorDefecto || 0,
        CuotasPorDefecto: branch.CuotasPorDefecto || 0,
        GastosCierrePorDefecto: branch.GastosCierrePorDefecto || 0,
        PagoMinimoVencido: branch.PagoMinimoVencido || 70,
        PenalidadAbono: branch.PenalidadAbono || 0,
        MaxAbonoCapital: branch.MaxAbonoCapital || 0,
        MinAbonoCapital: branch.MinAbonoCapital || 0,
        CedulaGerente: branch.CedulaGerente || "",
        DireccionGerente: branch.DireccionGerente || "",
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
    });
  };

  // Guardar sucursal
  const handleSave = async () => {
    try {
      if (dialogMode === "create") {
        await createSucursal(formData);
        setSnackbar({
          open: true,
          message: "Sucursal creada exitosamente",
          severity: "success"
        });
      } else if (dialogMode === "edit") {
        await updateSucursal(selectedBranch.IdSucursal, formData);
        setSnackbar({
          open: true,
          message: "Sucursal actualizada exitosamente",
          severity: "success"
        });
      }
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
                {/* Botón para llenar con datos de empresa */}
                {dialogMode !== "view" && (
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        if (formData.IdEmpresa) {
                          const selectedEmpresa = empresas?.find(emp => emp.IdEmpresa === formData.IdEmpresa);
                          if (selectedEmpresa) {
                            setFormData(prev => ({
                              ...prev,
                              RazonSocial: selectedEmpresa.RazonSocial || '',
                              RNC: selectedEmpresa.RNC || '',
                              Telefono: selectedEmpresa.Telefono || '',
                              Direccion: selectedEmpresa.Direccion || '',
                              Presidente: selectedEmpresa.Presidente || '',
                              CedulaPresidente: selectedEmpresa.CedulaPresidente || '',
                              Abogado: selectedEmpresa.Abogado || '',
                              EstadoCivilAbogado: selectedEmpresa.EstadoCivilAbogado || '',
                              CedulaAbogado: selectedEmpresa.CedulaAbogado || '',
                              DireccionEstudiosAbogado: selectedEmpresa.DireccionEstudiosAbogado || '',
                              Banco: selectedEmpresa.Banco || '',
                              NumeroCuenta: selectedEmpresa.NumeroCuenta || '',
                              TasaPorDefecto: selectedEmpresa.TasaPorDefecto || 0,
                              MoraPorDefecto: selectedEmpresa.MoraPorDefecto || 0
                            }));
                          }
                        }
                      }}
                      disabled={!formData.IdEmpresa}
                      sx={{ 
                        fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                        fontSize: '0.75rem',
                        textTransform: 'none'
                      }}
                    >
                      Llenar con datos de empresa
                    </Button>
                  </Box>
                )}

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
                        <FormControl fullWidth size="small" sx={professionalFieldStyle}>
                          <InputLabel>Empresa</InputLabel>
                          <Select
                            value={formData.IdEmpresa}
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
                          label="Código"
                          value={formData.Codigo}
                          onChange={(e) => handleFormChange("Codigo", e.target.value)}
                          disabled={dialogMode === "view"}
                          required
                          sx={professionalFieldStyle}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Nombre Sucursal"
                          value={formData.Nombre}
                          onChange={(e) => handleFormChange("Nombre", e.target.value)}
                          disabled={dialogMode === "view"}
                          required
                          sx={professionalFieldStyle}
                        />
                      </Grid>
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
                          label="Teléfono"
                          value={formData.Telefono}
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
                          value={formData.Direccion}
                          onChange={(e) => handleFormChange("Direccion", e.target.value)}
                          disabled={dialogMode === "view"}
                          multiline
                          rows={2}
                          sx={professionalFieldStyle}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Presidente"
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
                          label="Cédula del Presidente"
                          value={formData.CedulaPresidente || ''}
                          onChange={(e) => handleFormChange("CedulaPresidente", e.target.value)}
                          disabled={dialogMode === "view"}
                          sx={professionalFieldStyle}
                        />
                      </Grid>
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
                        <FormControl fullWidth size="small" sx={professionalFieldStyle}>
                          <InputLabel>Estado Civil del Abogado</InputLabel>
                          <Select
                            value={formData.EstadoCivilAbogado || 'Soltero'}
                            onChange={(e) => handleFormChange("EstadoCivilAbogado", e.target.value)}
                            disabled={dialogMode === "view"}
                            label="Estado Civil del Abogado"
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
                          value={formData.CedulaAbogado || ''}
                          onChange={(e) => handleFormChange("CedulaAbogado", e.target.value)}
                          disabled={dialogMode === "view"}
                          sx={professionalFieldStyle}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Dirección Estudios del Abogado"
                          value={formData.DireccionEstudiosAbogado || ''}
                          onChange={(e) => handleFormChange("DireccionEstudiosAbogado", e.target.value)}
                          disabled={dialogMode === "view"}
                          sx={professionalFieldStyle}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Nombre Primer Testigo"
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
                          label="Nombre Segundo Testigo"
                          value={formData.SegundoTestigo || ''}
                          onChange={(e) => handleFormChange("SegundoTestigo", e.target.value)}
                          disabled={dialogMode === "view"}
                          sx={professionalFieldStyle}
                        />
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
                          label="No. Cuenta"
                          value={formData.NumeroCuenta || ''}
                          onChange={(e) => handleFormChange("NumeroCuenta", e.target.value)}
                          disabled={dialogMode === "view"}
                          sx={professionalFieldStyle}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Tipo Recibo"
                          value={formData.TipoRecibo || '/Report/Recibo.aspx'}
                          onChange={(e) => handleFormChange("TipoRecibo", e.target.value)}
                          disabled={dialogMode === "view"}
                          sx={professionalFieldStyle}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="% Tasa por Defecto"
                          type="number"
                          value={formData.TasaPorDefecto || 0}
                          onChange={(e) => handleFormChange("TasaPorDefecto", parseFloat(e.target.value) || 0)}
                          disabled={dialogMode === "view"}
                          sx={professionalFieldStyle}
                          inputProps={{ step: 0.01, min: 0, max: 100 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="% Mora por Defecto"
                          type="number"
                          value={formData.MoraPorDefecto || 0}
                          onChange={(e) => handleFormChange("MoraPorDefecto", parseFloat(e.target.value) || 0)}
                          disabled={dialogMode === "view"}
                          sx={professionalFieldStyle}
                          inputProps={{ step: 0.01, min: 0, max: 100 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Cuotas por Defecto"
                          type="number"
                          value={formData.CuotasPorDefecto || 0}
                          onChange={(e) => handleFormChange("CuotasPorDefecto", parseInt(e.target.value) || 0)}
                          disabled={dialogMode === "view"}
                          sx={professionalFieldStyle}
                          inputProps={{ min: 0 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="% Gastos Cierre por Defecto"
                          type="number"
                          value={formData.GastosCierrePorDefecto || 0}
                          onChange={(e) => handleFormChange("GastosCierrePorDefecto", parseFloat(e.target.value) || 0)}
                          disabled={dialogMode === "view"}
                          sx={professionalFieldStyle}
                          inputProps={{ step: 0.01, min: 0, max: 100 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="% Pago Mínimo sobre lo Vencido"
                          type="number"
                          value={formData.PagoMinimoVencido || 70}
                          onChange={(e) => handleFormChange("PagoMinimoVencido", parseFloat(e.target.value) || 70)}
                          disabled={dialogMode === "view"}
                          sx={professionalFieldStyle}
                          inputProps={{ step: 0.01, min: 0, max: 100 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="% De Penalidad por Abono"
                          type="number"
                          value={formData.PenalidadAbono || 0}
                          onChange={(e) => handleFormChange("PenalidadAbono", parseFloat(e.target.value) || 0)}
                          disabled={dialogMode === "view"}
                          sx={professionalFieldStyle}
                          inputProps={{ step: 0.01, min: 0, max: 100 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="% Máx. Abono sobre Capital Restante"
                          type="number"
                          value={formData.MaxAbonoCapital || 0}
                          onChange={(e) => handleFormChange("MaxAbonoCapital", parseFloat(e.target.value) || 0)}
                          disabled={dialogMode === "view"}
                          sx={professionalFieldStyle}
                          inputProps={{ step: 0.01, min: 0, max: 100 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="% Mín. Abono sobre Capital Restante"
                          type="number"
                          value={formData.MinAbonoCapital || 0}
                          onChange={(e) => handleFormChange("MinAbonoCapital", parseFloat(e.target.value) || 0)}
                          disabled={dialogMode === "view"}
                          sx={professionalFieldStyle}
                          inputProps={{ step: 0.01, min: 0, max: 100 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small" sx={professionalFieldStyle}>
                          <InputLabel>Estado</InputLabel>
                          <Select
                            value={formData.Activo}
                            onChange={(e) => handleFormChange("Activo", e.target.value)}
                            disabled={dialogMode === "view"}
                            label="Estado"
                          >
                            <MenuItem value={true}>Activa</MenuItem>
                            <MenuItem value={false}>Inactiva</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                {/* Autorizaciones */}
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
                      Autorizaciones
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 1.5 }}>
                    <Grid container spacing={1.5}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Gerente"
                          value={formData.Gerente}
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
                          value={formData.TelefonoGerente}
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
                          value={formData.EmailGerente}
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
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                {/* Configuración Proceso Automático */}
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
                      Configuración Proceso Automático
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 1.5 }}>
                    <Grid container spacing={1.5}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small" sx={professionalFieldStyle}>
                          <InputLabel>Proceso Legal Automático</InputLabel>
                          <Select
                            value={formData.ProcesoLegalAutomatico || false}
                            onChange={(e) => handleFormChange("ProcesoLegalAutomatico", e.target.value)}
                            disabled={dialogMode === "view"}
                            label="Proceso Legal Automático"
                          >
                            <MenuItem value={true}>Activado</MenuItem>
                            <MenuItem value={false}>Desactivado</MenuItem>
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
                          label="Cuántas Cuotas Debe Tener Vencidas"
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
                          label="Días Transacciones"
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