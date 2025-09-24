import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
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
  Person as PersonIcon,
  Email as EmailIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { JumboCard } from "@jumbo/components";
import { UsuariosService } from "../../../_services/usuariosService";
import { EmpresasService } from "../../../_services";

const UsersWithSupabase = () => {
  // Estados para datos
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0 });

  // Estados para UI
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("create"); // create, edit, view
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Estados para formulario
  const [formData, setFormData] = useState({
    NombreUsuario: "",
    Nombres: "",
    Apellidos: "",
    Email: "",
    password: "",
    Activo: true,
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadUsers();
    loadCompanies();
    loadStats();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    console.log('🔍 Iniciando carga de usuarios...');
    try {
      const result = await UsuariosService.getAll();
      console.log('📊 Resultado del servicio:', result);
      
      if (result.success) {
        console.log('✅ Usuarios cargados exitosamente:', result.data?.length || 0);
        setUsers(result.data || []);
        setError(null);
      } else {
        console.error('❌ Error en el servicio:', result.error);
        setError(result.error);
        showSnackbar("Error al cargar usuarios: " + result.error, "error");
      }
    } catch (err) {
      console.error('❌ Error de excepción:', err);
      setError(err.message);
      showSnackbar("Error al cargar usuarios: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const loadCompanies = async () => {
    try {
      const result = await EmpresasService.getAll();
      if (result.success) {
        setCompanies(result.data || []);
      }
    } catch (err) {
      console.error("Error al cargar empresas:", err);
    }
  };

  const loadStats = async () => {
    try {
      const result = await UsuariosService.getStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    }
  };

  const handleCreate = async () => {
    try {
      const result = await UsuariosService.create(formData);
      if (result.success) {
        showSnackbar("Usuario creado exitosamente", "success");
        setOpenDialog(false);
        loadUsers();
        loadStats();
        resetForm();
      } else {
        showSnackbar("Error al crear usuario: " + result.error, "error");
      }
    } catch (err) {
      showSnackbar("Error al crear usuario: " + err.message, "error");
    }
  };

  const handleUpdate = async () => {
    try {
      const result = await UsuariosService.update(selectedUser.IdUsuario, formData);
      if (result.success) {
        showSnackbar("Usuario actualizado exitosamente", "success");
        setOpenDialog(false);
        loadUsers();
        loadStats();
        resetForm();
      } else {
        showSnackbar("Error al actualizar usuario: " + result.error, "error");
      }
    } catch (err) {
      showSnackbar("Error al actualizar usuario: " + err.message, "error");
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`¿Está seguro de eliminar el usuario "${user.NombreUsuario}"?`)) {
      try {
        const result = await UsuariosService.delete(user.IdUsuario);
        if (result.success) {
          showSnackbar("Usuario eliminado exitosamente", "success");
          loadUsers();
          loadStats();
        } else {
          showSnackbar("Error al eliminar usuario: " + result.error, "error");
        }
      } catch (err) {
        showSnackbar("Error al eliminar usuario: " + err.message, "error");
      }
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const result = await UsuariosService.search(searchTerm);
        if (result.success) {
          setUsers(result.data || []);
        } else {
          showSnackbar("Error en la búsqueda: " + result.error, "error");
        }
      } catch (err) {
        showSnackbar("Error en la búsqueda: " + err.message, "error");
      }
    } else {
      loadUsers();
    }
  };

  const openCreateDialog = () => {
    setDialogMode("create");
    resetForm();
    setOpenDialog(true);
  };

  const openEditDialog = (user) => {
    setDialogMode("edit");
    setSelectedUser(user);
    setFormData({
      NombreUsuario: user.NombreUsuario || "",
      Nombres: user.Nombres || "",
      Apellidos: user.Apellidos || "",
      Email: user.Email || "",
      Activo: user.Activo !== undefined ? user.Activo : true,
    });
    setOpenDialog(true);
  };

  const openViewDialog = (user) => {
    setDialogMode("view");
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const resetForm = () => {
    setFormData({
      NombreUsuario: "",
      Nombres: "",
      Apellidos: "",
      Email: "",
      password: "",
      Activo: true,
    });
    setSelectedUser(null);
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

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.NombreUsuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || 
      (statusFilter === "active" && user.Activo) ||
      (statusFilter === "inactive" && !user.Activo);
    
    return matchesSearch && matchesStatus;
  });

  // Paginación
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading && users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando usuarios...
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
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{stats.total || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Usuarios
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">
                    {filteredUsers.filter(u => u.Activo).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Usuarios Activos
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "warning.main" }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">
                    {filteredUsers.filter(u => !u.Activo).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Usuarios Inactivos
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
            <Typography variant="h5">Gestión de Usuarios</Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                size="small"
                placeholder="Buscar usuarios..."
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
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={statusFilter}
                  label="Estado"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="active">Activos</MenuItem>
                  <MenuItem value="inactive">Inactivos</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadUsers}
              >
                Actualizar
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openCreateDialog}
              >
                Nuevo Usuario
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Divider />

        {/* Tabla de usuarios */}
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Nombres</TableCell>
                <TableCell>Apellidos</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Estado Email</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha Creación</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                 <TableRow>
                   <TableCell colSpan={8} align="center">
                     <CircularProgress size={24} />
                   </TableCell>
                 </TableRow>
              ) : paginatedUsers.length === 0 ? (
                 <TableRow>
                   <TableCell colSpan={8} align="center">
                     <Typography variant="body2" color="text.secondary">
                       No se encontraron usuarios
                     </Typography>
                   </TableCell>
                 </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.IdUsuario} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" fontWeight="medium">
                          {user.NombreUsuario}
                        </Typography>
                      </Stack>
                    </TableCell>
                     <TableCell>{user.Nombres}</TableCell>
                     <TableCell>{user.Apellidos}</TableCell>
                     <TableCell>{user.Email}</TableCell>
                     <TableCell>
                       <Chip
                         label={user.estadoEmail || (user.Email === 'admin@sigp.com' ? 'Sin confirmar' : 'Confirmado')}
                         color={user.emailConfirmado !== false && user.Email !== 'admin@sigp.com' ? "success" : "warning"}
                         size="small"
                       />
                     </TableCell>
                     <TableCell>
                       <Chip
                         label={user.Activo ? "Activo" : "Inactivo"}
                         color={user.Activo ? "success" : "default"}
                         size="small"
                       />
                     </TableCell>
                    <TableCell>
                      {user.FechaCreacion ? new Date(user.FechaCreacion).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => openViewDialog(user)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => openEditDialog(user)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(user)}
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
          count={filteredUsers.length}
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

      {/* Dialog para crear/editar/ver usuario */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === "create" && "Nuevo Usuario"}
          {dialogMode === "edit" && "Editar Usuario"}
          {dialogMode === "view" && "Detalles de Usuario"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre de Usuario"
                value={dialogMode === "view" ? selectedUser?.NombreUsuario || "" : formData.NombreUsuario}
                onChange={(e) => handleFormChange("NombreUsuario", e.target.value)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombres"
                value={dialogMode === "view" ? selectedUser?.Nombres || "" : formData.Nombres}
                onChange={(e) => handleFormChange("Nombres", e.target.value)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Apellidos"
                value={dialogMode === "view" ? selectedUser?.Apellidos || "" : formData.Apellidos}
                onChange={(e) => handleFormChange("Apellidos", e.target.value)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={dialogMode === "view" ? selectedUser?.Email || "" : formData.Email}
                onChange={(e) => handleFormChange("Email", e.target.value)}
                disabled={dialogMode === "view"}
                required
              />
            </Grid>
            {dialogMode === "create" && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleFormChange("password", e.target.value)}
                  required
                  helperText="Mínimo 6 caracteres"
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={dialogMode === "view"}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={dialogMode === "view" ? (selectedUser?.Activo ? "true" : "false") : formData.Activo.toString()}
                  label="Estado"
                  onChange={(e) => handleFormChange("Activo", e.target.value === "true")}
                >
                  <MenuItem value="true">Activo</MenuItem>
                  <MenuItem value="false">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {dialogMode === "view" && selectedUser && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="ID Usuario"
                    value={selectedUser.IdUsuario || ""}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Fecha de Creación"
                    value={selectedUser.FechaCreacion ? new Date(selectedUser.FechaCreacion).toLocaleString() : ""}
                    disabled
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancelar
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

export default UsersWithSupabase;