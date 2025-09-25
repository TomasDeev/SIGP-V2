import React from 'react';
import { Box, Card, CardContent, Typography, Alert, Chip } from '@mui/material';
import useAuthenticatedUser from '@app/_hooks/useAuthenticatedUser';
import { useAuth } from '@app/_components/_core/AuthProvider/hooks';

const DebugWelcomeWidget = () => {
  const authContext = useAuth();
  const userHook = useAuthenticatedUser();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🔍 Debug de Autenticación
      </Typography>

      {/* Debug del AuthProvider */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Estado del AuthProvider
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip 
              label={`isAuthenticated: ${authContext.isAuthenticated}`} 
              color={authContext.isAuthenticated ? 'success' : 'error'} 
            />
            <Chip 
              label={`loading: ${authContext.loading}`} 
              color={authContext.loading ? 'warning' : 'default'} 
            />
          </Box>
          <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem', overflow: 'auto' }}>
            {JSON.stringify(authContext, null, 2)}
          </Typography>
        </CardContent>
      </Card>

      {/* Debug del useAuthenticatedUser */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            👤 Estado del useAuthenticatedUser
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip 
              label={`isAuthenticated: ${userHook.isAuthenticated}`} 
              color={userHook.isAuthenticated ? 'success' : 'error'} 
            />
            <Chip 
              label={`loading: ${userHook.loading}`} 
              color={userHook.loading ? 'warning' : 'default'} 
            />
            <Chip 
              label={`hasUserInfo: ${!!userHook.userInfo}`} 
              color={userHook.userInfo ? 'success' : 'error'} 
            />
            <Chip 
              label={`hasError: ${!!userHook.error}`} 
              color={userHook.error ? 'error' : 'success'} 
            />
          </Box>
          
          {userHook.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Error:</Typography>
              <Typography variant="body2">{userHook.error}</Typography>
            </Alert>
          )}

          <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem', overflow: 'auto' }}>
            {JSON.stringify({
              userInfo: userHook.userInfo,
              loading: userHook.loading,
              error: userHook.error,
              isAuthenticated: userHook.isAuthenticated
            }, null, 2)}
          </Typography>
        </CardContent>
      </Card>

      {/* Información de cookies */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🍪 Información de Cookies
          </Typography>
          <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem', overflow: 'auto' }}>
            {document.cookie}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DebugWelcomeWidget;