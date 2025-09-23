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
  Alert,
  CircularProgress,
  Snackbar,
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
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { JumboCard } from "@jumbo/components";
import { EmpresasService } from "../../../_services";

const CompaniesWithSupabase = () => {
  // Estados para datos
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0 });

  // Estados para UI
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("create"); // create, edit, view
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Estados para formulario
  const [formData, setFormData] = useState({
    RazonSocial: "",
    NombreComercial: "",
    RNC: "",
    Direccion: "",
    Telefono: "",
    Presidente: "",
    CedulaPresidente: "",
    Abogado: "",
    EstadoCivilAbogado: 1,
    CedulaAbogado: "",
    DireccionAbogado: "",
    Alguacil: "",
    Tasa: 0,
    Mora: 0,
    Cuotas: 12,
    GastoCierre: 0,
    Logo: "",
    Banco: "",
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadCompanies();
    loadStats();
  }, []);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const result = await EmpresasService.getAll();
      if (result.success) {
        setCompanies(result.data || []);
        setError(null);
      } else {
        setError(result.error);
        showSnackbar("Error al cargar empresas: " + result.error, "error");
      }
    } catch (err) {
      setError(err.message);
      showSnackbar("Error al cargar empresas: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await EmpresasService.getStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadCompanies();
      return;
    }

    setLoading(true);
    try {
      const result = await EmpresasService.search(searchTerm);
      if (result.success) {
        setCompanies(result.data || []);
        setError(null);
      } else {
        showSnackbar("Error en búsqueda: " + result.error, "error");
      }
    } catch (err) {
      showSnackbar("Error en búsqueda: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const result = await EmpresasService.create(formData);
      if (result.success) {
        showSnackbar("Empresa creada exitosamente", "success");
        setOpenDialog(false);
        resetForm();
        loadCompanies();
        loadStats();
      } else {
        showSnackbar("Error al crear empresa: " + result.error, "error");
      }
    } catch (err) {
      showSnackbar("Error al crear empresa: " + err.message, "error");
    }
  };

  const handleUpdate = async () => {
    try {
      const result = await EmpresasService.update(selectedCompany.IdEmpresa, formData);
      if (result.success) {
        showSnackbar("Empresa actualizada exitosamente", "success");
        setOpenDialog(false);
        resetForm();
        loadCompanies();
      } else {
        showSnackbar("Error al actualizar empresa: " + result.error, "error");
      }
    } catch (err) {
      showSnackbar("Error al actualizar empresa: " + err.message, "error");
    }
  };

  const handleDelete = async (company) => {
    if (window.confirm(`¿Está seguro de eliminar la empresa "${company.RazonSocial}"?`)) {
      try {
        const result = await EmpresasService.delete(company.IdEmpresa);
        if (result.success) {
          showSnackbar("Empresa eliminada exitosamente", "success");
          loadCompanies();
          loadStats();
        } else {
          showSnackbar("Error al eliminar empresa: " + result.error, "error");
        }
      } catch (err) {
        showSnackbar("Error al eliminar empresa: " + err.message, "error");
      }
    }
  };

  const openCreateDialog = () => {
    setDialogMode("create");
    resetForm();
    setOpenDialog(true);
  };

  const openEditDialog = (company) => {
    setDialogMode("edit");
    setSelectedCompany(company);
    setFormData({
      RazonSocial: company.RazonSocial || "",
      NombreComercial: company.NombreComercial || "",
      RNC: company.RNC || "",
      Direccion: company.Direccion || "",
      Telefono: company.Telefono || "",
      Presidente: company.Presidente || "",
      CedulaPresidente: company.CedulaPresidente || "",
      Abogado: company.Abogado || "",
      EstadoCivilAbogado: company.EstadoCivilAbogado || 1,
      CedulaAbogado: company.CedulaAbogado || "",
      DireccionAbogado: company.DireccionAbogado || "",
      Alguacil: company.Alguacil || "",
      Tasa: company.Tasa || 0,
      Mora: company.Mora || 0,
      Cuotas: company.Cuotas || 12,
      GastoCierre: company.GastoCierre || 0,
      Logo: company.Logo || "",
      Banco: company.Banco || "",
    });
    setOpenDialog(true);
  };

  const openViewDialog = (company) => {
    setDialogMode("view");
    setSelectedCompany(company);
    setOpenDialog(true);
  };

  const resetForm = () => {
    setFormData({
      RazonSocial: "",
      NombreComercial: "",
      RNC: "",
      Direccion: "",
      Telefono: "",
      Presidente: "",
      CedulaPresidente: "",
      Abogado: "",
      EstadoCivilAbogado: 1,
      CedulaAbogado: "",
      DireccionAbogado: "",
      Alguacil: "",
      Tasa: 0,
      Mora: 0,
      Cuotas: 12,
      GastoCierre: 0,
      Logo: "",
      Banco: "",
    });
    setSelectedCompany(null);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (dialogMode === "create") {
      handleCreate();
    } else if (dialogMode === "edit") {
      handleUpdate();
    }
  };

  // Filtrar empresas para paginación
  const paginatedCompanies = companies.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading && companies.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando empresas...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header con estadísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <BusinessIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats.total}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Empresas
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Barra de herramientas */}
      <JumboCard>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Typography variant="h5">Gestión de Empresas</Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                size="small"
                placeholder="Buscar empresas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadCompanies}
              >
                Actualizar
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openCreateDialog}
              >
                Nueva Empresa
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Divider />

        {/* Tabla de empresas */}
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Razón Social</TableCell>
                <TableCell>Nombre Comercial</TableCell>
                <TableCell>RNC</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Fecha Creación</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : paginatedCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No se encontraron empresas
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCompanies.map((company) => (
                  <TableRow key={company.IdEmpresa} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                          <BusinessIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" fontWeight="medium">
                          {company.RazonSocial}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{company.NombreComercial}</TableCell>
                    <TableCell>{company.RNC}</TableCell>
                    <TableCell>{company.Telefono}</TableCell>
                    <TableCell>{company.Direccion}</TableCell>
                    <TableCell>
                      {new Date(company.FechaCreacion).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => openViewDialog(company)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => openEditDialog(company)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(company)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={companies.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Filas por página:"
        />
      </JumboCard>

      {/* Dialog para crear/editar/ver empresa */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === "create" && "Nueva Empresa"}
          {dialogMode === "edit" && "Editar Empresa"}
          {dialogMode === "view" && "Detalles de Empresa"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Razón Social"
                value={formData.RazonSocial}
                onChange={(e) => handleFormChange("RazonSocial", e.target.value)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre Comercial"
                value={formData.NombreComercial}
                onChange={(e) => handleFormChange("NombreComercial", e.target.value)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="RNC"
                value={formData.RNC}
                onChange={(e) => handleFormChange("RNC", e.target.value)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.Telefono}
                onChange={(e) => handleFormChange("Telefono", e.target.value)}
                disabled={dialogMode === "view"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                value={formData.Direccion}
                onChange={(e) => handleFormChange("Direccion", e.target.value)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Presidente"
                value={formData.Presidente}
                onChange={(e) => handleFormChange("Presidente", e.target.value)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cédula Presidente"
                value={formData.CedulaPresidente}
                onChange={(e) => handleFormChange("CedulaPresidente", e.target.value)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Abogado"
                value={formData.Abogado}
                onChange={(e) => handleFormChange("Abogado", e.target.value)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cédula Abogado"
                value={formData.CedulaAbogado}
                onChange={(e) => handleFormChange("CedulaAbogado", e.target.value)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección Abogado"
                value={formData.DireccionAbogado}
                onChange={(e) => handleFormChange("DireccionAbogado", e.target.value)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Alguacil"
                value={formData.Alguacil}
                onChange={(e) => handleFormChange("Alguacil", e.target.value)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Banco"
                value={formData.Banco}
                onChange={(e) => handleFormChange("Banco", e.target.value)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Tasa (%)"
                type="number"
                value={formData.Tasa}
                onChange={(e) => handleFormChange("Tasa", parseFloat(e.target.value) || 0)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Mora (%)"
                type="number"
                value={formData.Mora}
                onChange={(e) => handleFormChange("Mora", parseFloat(e.target.value) || 0)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Cuotas"
                type="number"
                value={formData.Cuotas}
                onChange={(e) => handleFormChange("Cuotas", parseInt(e.target.value) || 0)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Gasto Cierre"
                type="number"
                value={formData.GastoCierre}
                onChange={(e) => handleFormChange("GastoCierre", parseFloat(e.target.value) || 0)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {dialogMode === "view" ? "Cerrar" : "Cancelar"}
          </Button>
          {dialogMode !== "view" && (
            <Button variant="contained" onClick={handleSubmit}>
              {dialogMode === "create" ? "Crear" : "Actualizar"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CompaniesWithSupabase;