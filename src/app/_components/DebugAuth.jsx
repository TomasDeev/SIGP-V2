import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Alert, Chip } from '@mui/material';
import { supabase } from '../_config/supabase';
import { useAuth } from './_core/AuthProvider/hooks';

const DebugAuth = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [supabaseSession, setSupabaseSession] = useState(null);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSupabaseSession(session);
    };
    checkSession();
  }, []);

  const testCompanyCreation = async () => {
    setTestResult('Probando creación de empresa...');
    
    try {
      const testData = {
        "RazonSocial": "Empresa de Prueba S.A.",
        "NombreComercial": "Empresa de Prueba",
        "RNC": "123456789",
        "Direccion": "Calle Test 123",
        "Telefono": "809-555-0123",
        "Presidente": "Juan Pérez",
        "CedulaPresidente": "001-1234567-8",
        "Abogado": "María García",
        "CedulaAbogado": "001-9876543-2",
        "DireccionAbogado": "Calle Abogado 456",
        "Alguacil": "Pedro Martínez",
        "Tasa": 2.5,
        "Mora": 5.0,
        "Cuotas": 12,
        "GastoCierre": 10.0
      };

      const { data, error } = await supabase
        .from('empresas')
        .insert([testData])
        .select()
        .single();

      if (error) {
        setTestResult(`❌ Error: ${error.message}`);
      } else {
        setTestResult(`✅ Empresa creada exitosamente: ${JSON.stringify(data, null, 2)}`);
        
        // Limpiar datos de prueba
        setTimeout(async () => {
          await supabase
            .from('empresas')
            .delete()
            .eq('"IdEmpresa"', data.IdEmpresa);
          setTestResult(prev => prev + '\n🧹 Datos de prueba eliminados');
        }, 2000);
      }
    } catch (err) {
      setTestResult(`💥 Error: ${err.message}`);
    }
  };

  return (
    <Card sx={{ m: 2, maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔍 Debug de Autenticación
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Estado de Auth Provider:</Typography>
          <Chip 
            label={loading ? 'Cargando...' : isAuthenticated ? 'Autenticado ✓' : 'No autenticado ✗'}
            color={loading ? 'default' : isAuthenticated ? 'success' : 'error'}
            size="small"
            sx={{ mr: 1 }}
          />
          {user && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Email: {user.email}
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Sesión de Supabase:</Typography>
          <Chip 
            label={supabaseSession ? 'Activa ✓' : 'Inactiva ✗'}
            color={supabaseSession ? 'success' : 'error'}
            size="small"
          />
          {supabaseSession && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Usuario: {supabaseSession.user.email}
            </Typography>
          )}
        </Box>

        <Button 
          variant="contained" 
          onClick={testCompanyCreation}
          sx={{ mb: 2 }}
        >
          🧪 Probar Creación de Empresa
        </Button>

        {testResult && (
          <Alert 
            severity={testResult.includes('✅') ? 'success' : 'error'}
            sx={{ mt: 2 }}
          >
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {testResult}
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default DebugAuth;