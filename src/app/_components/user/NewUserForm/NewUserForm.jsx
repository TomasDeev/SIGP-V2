import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
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
  Checkbox,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import { JumboCard } from "@jumbo/components";
import {
  Person,
  LocationOn,
  Phone,
  Business,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Schedule,
  CalendarToday,
  AccountCircle,
  Domain,
} from "@mui/icons-material";
import { useUserCompany } from "@app/_hooks/useUserCompany";

const NewUserForm = ({ onSuccess, onCancel }) => {
  // Hook para obtener datos de la empresa del usuario
  const { companyData, loading: companyLoading } = useUserCompany();

  // Estados para mostrar/ocultar contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para el formulario - Información Personal
  const [personalInfo, setPersonalInfo] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
  });

  // Estados para el formulario - Información de Cuenta
  const [accountInfo, setAccountInfo] = useState({
    empresa: "",
    sucursal: "",
    nombreUsuario: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Estados para Control de Acceso
  const [accessControl, setAccessControl] = useState({
    // Días regulares (Lun-Vie)
    regularDays: {
      enabled: true,
      horaInicio: "08:00",
      horaFin: "17:00",
      dias: {
        lunes: true,
        martes: true,
        miercoles: true,
        jueves: true,
        viernes: true,
      },
    },
    // Sábado
    saturday: {
      enabled: false,
      horaInicio: "08:00",
      horaFin: "12:00",
    },
    // Domingo
    sunday: {
      enabled: false,
      horaInicio: "08:00",
      horaFin: "12:00",
    },
  });

  // Lista de empresas (simulada - se puede obtener de la API)
  const [empresas] = useState([
    { id: 1, nombre: "SIGP Empresa Principal" },
    { id: 2, nombre: "SIGP Sucursal Norte" },
    { id: 3, nombre: "SIGP Sucursal Sur" },
  ]);

  // Lista de sucursales (simulada)
  const [sucursales] = useState([
    { id: 1, nombre: "Oficina Principal", empresaId: 1 },
    { id: 2, nombre: "Sucursal Santiago", empresaId: 1 },
    { id: 3, nombre: "Sucursal La Vega", empresaId: 2 },
  ]);

  // Funciones para manejar cambios en los formularios
  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAccountInfoChange = (field, value) => {
    setAccountInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAccessControlChange = (section, field, value) => {
    setAccessControl(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleDayToggle = (day) => {
    setAccessControl(prev => ({
      ...prev,
      regularDays: {
        ...prev.regularDays,
        dias: {
          ...prev.regularDays.dias,
          [day]: !prev.regularDays.dias[day]
        }
      }
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async () => {
    // Validaciones básicas
    if (!passwordValid || !passwordsMatch || !personalInfo.nombre || !accountInfo.email) {
      alert("Por favor, complete todos los campos requeridos y verifique que las contraseñas coincidan.");
      return;
    }

    try {
      // Preparar datos para envío
      const userData = {
        // Información Personal
        Nombres: personalInfo.nombre,
        Apellidos: personalInfo.apellidos || "",
        Direccion: personalInfo.direccion || "",
        Telefono: personalInfo.telefono || "",
        
        // Información de Cuenta
        IdEmpresa: accountInfo.empresa || companyData?.IdEmpresa,
        IdSucursal: accountInfo.sucursal || "",
        NombreUsuario: accountInfo.usuario,
        Email: accountInfo.email,
        password: accountInfo.password,
        
        // Control de Acceso
        DiasRegulares: accessControl.regularDays,
        Sabado: accessControl.saturday,
        Domingo: accessControl.sunday,
        
        Activo: true,
      };

      console.log("Creando usuario con datos:", userData);
      
      // Simular creación exitosa por ahora
      // En el futuro aquí iría la llamada al servicio
      // const result = await UsuariosService.create(userData);
      
      // Llamar a onSuccess si se proporciona
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error("Error al crear usuario:", error);
      alert("Error al crear el usuario. Por favor, intente nuevamente.");
    }
  };

  // Función para validar contraseñas
  const passwordsMatch = accountInfo.password === accountInfo.confirmPassword;
  const passwordValid = accountInfo.password.length >= 6;

  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: "1200px",
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
        Agregar Nuevo Usuario
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
          maxWidth: '800px',
          mx: 'auto'
        }}
      >
        Complete la información para crear un nuevo usuario en el sistema
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
          width: '100%'
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            Datos Básicos
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre Completo"
                value={personalInfo.nombre}
                onChange={(e) => handlePersonalInfoChange("nombre", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={personalInfo.telefono}
                onChange={(e) => handlePersonalInfoChange("telefono", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                value={personalInfo.direccion}
                onChange={(e) => handlePersonalInfoChange("direccion", e.target.value)}
                multiline
                rows={2}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Sección 2 - Información de su cuenta */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            Empresa y Sucursal
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Empresa</InputLabel>
                <Select
                  value={accountInfo.empresa}
                  label="Empresa"
                  onChange={(e) => handleAccountInfoChange("empresa", e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <Business sx={{ color: "action.active", mr: 1 }} />
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  {empresas.map((empresa) => (
                    <MenuItem key={empresa.id} value={empresa.id}>
                      {empresa.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Sucursal</InputLabel>
                <Select
                  value={accountInfo.sucursal}
                  label="Sucursal"
                  onChange={(e) => handleAccountInfoChange("sucursal", e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <Domain sx={{ color: "action.active", mr: 1 }} />
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  {sucursales
                    .filter(sucursal => sucursal.empresaId === accountInfo.empresa)
                    .map((sucursal) => (
                      <MenuItem key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            Credenciales de Acceso
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre de usuario"
                value={accountInfo.nombreUsuario}
                onChange={(e) => handleAccountInfoChange("nombreUsuario", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="E-mail"
                type="email"
                value={accountInfo.email}
                onChange={(e) => handleAccountInfoChange("email", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                value={accountInfo.password}
                onChange={(e) => handleAccountInfoChange("password", e.target.value)}
                error={accountInfo.password.length > 0 && !passwordValid}
                helperText={
                  accountInfo.password.length > 0 && !passwordValid
                    ? "La contraseña debe tener al menos 6 caracteres"
                    : ""
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirme Contraseña"
                type={showConfirmPassword ? "text" : "password"}
                value={accountInfo.confirmPassword}
                onChange={(e) => handleAccountInfoChange("confirmPassword", e.target.value)}
                error={accountInfo.confirmPassword.length > 0 && !passwordsMatch}
                helperText={
                  accountInfo.confirmPassword.length > 0 && !passwordsMatch
                    ? "Las contraseñas no coinciden"
                    : ""
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Sección 3 - Control de acceso */}
        <Typography variant="h6" sx={{ mb: 3, color: "primary.main" }}>
          Control de acceso
        </Typography>
        {/* Días Regulares (Lun-Vie) */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            Días Regulares
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Desde"
                type="time"
                value={accessControl.regularDays.horaInicio}
                onChange={(e) => handleAccessControlChange("regularDays", "horaInicio", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Schedule sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Hasta"
                type="time"
                value={accessControl.regularDays.horaFin}
                onChange={(e) => handleAccessControlChange("regularDays", "horaFin", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Schedule sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                Días Válidos
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {[
                  { key: "lunes", label: "Lun" },
                  { key: "martes", label: "Mar" },
                  { key: "miercoles", label: "Mie" },
                  { key: "jueves", label: "Jue" },
                  { key: "viernes", label: "Vie" },
                ].map((day) => (
                  <Chip
                    key={day.key}
                    label={day.label}
                    onClick={() => handleDayToggle(day.key)}
                    color={accessControl.regularDays.dias[day.key] ? "primary" : "default"}
                    variant={accessControl.regularDays.dias[day.key] ? "filled" : "outlined"}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Sábado */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            Sábado
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={accessControl.saturday.enabled}
                    onChange={(e) => handleAccessControlChange("saturday", "enabled", e.target.checked)}
                    color="primary"
                  />
                }
                label="Habilitar"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Desde"
                type="time"
                value={accessControl.saturday.horaInicio}
                onChange={(e) => handleAccessControlChange("saturday", "horaInicio", e.target.value)}
                disabled={!accessControl.saturday.enabled}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Schedule sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Hasta"
                type="time"
                value={accessControl.saturday.horaFin}
                onChange={(e) => handleAccessControlChange("saturday", "horaFin", e.target.value)}
                disabled={!accessControl.saturday.enabled}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Schedule sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Domingo */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            Domingo
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={accessControl.sunday.enabled}
                    onChange={(e) => handleAccessControlChange("sunday", "enabled", e.target.checked)}
                    color="primary"
                  />
                }
                label="Habilitar"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Desde"
                type="time"
                value={accessControl.sunday.horaInicio}
                onChange={(e) => handleAccessControlChange("sunday", "horaInicio", e.target.value)}
                disabled={!accessControl.sunday.enabled}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Schedule sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Hasta"
                type="time"
                value={accessControl.sunday.horaFin}
                onChange={(e) => handleAccessControlChange("sunday", "horaFin", e.target.value)}
                disabled={!accessControl.sunday.enabled}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Schedule sx={{ color: "action.active" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Botones de acción */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={onCancel}
            sx={{
              borderRadius: 2,
              px: 4,
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!passwordValid || !passwordsMatch || !personalInfo.nombre || !accountInfo.email}
            sx={{
              borderRadius: 2,
              px: 4,
              backgroundColor: '#4caf50',
              '&:hover': {
                backgroundColor: '#45a049',
              },
            }}
          >
            Crear Usuario
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export { NewUserForm };