import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Alert,
  Chip,
  Divider
} from '@mui/material';
import { useAuth } from '../_components/_core/AuthProvider/hooks';
import { supabase } from '../_config/supabase';

const SupabaseExample = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [supabaseUser, setSupabaseUser] = useState(null);

  // Test connection and get Supabase user info
  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test Supabase connection
        const { data: { session } } = await supabase.auth.getSession();
        setSupabaseUser(session?.user || null);
        setConnectionStatus('connected');
      } catch (error) {
        console.error('Error connecting to Supabase:', error);
        setConnectionStatus('error');
      }
    };

    testConnection();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Card sx={{ maxWidth: 700, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Estado de Integración Supabase
        </Typography>
        
        {/* Connection Status */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Conexión a Supabase:
          </Typography>
          <Chip 
            label={
              connectionStatus === 'checking' ? 'Verificando...' :
              connectionStatus === 'connected' ? 'Conectado ✓' : 'Error de conexión ✗'
            }
            color={
              connectionStatus === 'checking' ? 'default' :
              connectionStatus === 'connected' ? 'success' : 'error'
            }
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Authentication Status */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Estado de Autenticación:
          </Typography>
          {loading ? (
            <Typography>Cargando...</Typography>
          ) : isAuthenticated && supabaseUser ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body1">
                  <strong>Usuario autenticado:</strong> {supabaseUser.email}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>ID:</strong> {supabaseUser.id}
                </Typography>
                <Typography variant="body2">
                  <strong>Confirmado:</strong> {supabaseUser.email_confirmed_at ? 'Sí' : 'No'}
                </Typography>
                <Typography variant="body2">
                  <strong>Último acceso:</strong> {new Date(supabaseUser.last_sign_in_at).toLocaleString()}
                </Typography>
              </Alert>
              <Button variant="outlined" color="error" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </Box>
          ) : (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body1">
                No hay usuario autenticado. 
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Ve a <strong>Login-1</strong> para iniciar sesión o <strong>Signup-1</strong> para registrarte.
              </Typography>
            </Alert>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Instructions */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Instrucciones de Uso:
          </Typography>
          <Alert severity="info">
            <Typography variant="body2" component="div">
              <strong>Para probar la autenticación:</strong>
              <br />
              1. Ve a la página <strong>Signup-1</strong> para registrar un nuevo usuario
              <br />
              2. Revisa tu email para confirmar la cuenta (si está habilitado)
              <br />
              3. Ve a la página <strong>Login-1</strong> para iniciar sesión
              <br />
              4. Los usuarios se guardan automáticamente en Supabase Auth
              <br /><br />
              <strong>Configuración actual:</strong>
              <br />
              • URL: {import.meta.env.VITE_SUPABASE_URL ? '✓ Configurada' : '✗ Faltante'}
              <br />
              • API Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Configurada' : '✗ Faltante'}
            </Typography>
          </Alert>
        </Box>
      </CardContent>
    </Card>
  );
};

export { SupabaseExample };
export default SupabaseExample;