import React from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import { CONTAINER_MAX_WIDTH } from '@app/_config/layouts';
import { DatabaseStats } from '@app/_components/widgets/DatabaseStats';
import { SupabaseExample } from '@app/_components/SupabaseExample';

/**
 * Dashboard principal del Sistema Integral de Gestión de Préstamos (SIGP)
 * Muestra estadísticas en tiempo real de la base de datos Supabase
 */
export default function SIGPDashboard() {
  const { t } = useTranslation();

  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: CONTAINER_MAX_WIDTH,
        display: 'flex',
        minWidth: 0,
        flex: 1,
        flexDirection: 'column',
      }}
      disableGutters
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Dashboard SIGP
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Sistema Integral de Gestión de Préstamos - Panel de Control
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Estadísticas principales de la base de datos */}
        <Grid size={{ xs: 12 }}>
          <DatabaseStats />
        </Grid>

        {/* Estado de conexión con Supabase */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Estado del Sistema
            </Typography>
          </Box>
          <SupabaseExample />
        </Grid>

        {/* Información del sistema */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Información del Sistema
            </Typography>
          </Box>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Sistema Integrado con Supabase</strong>
            </Typography>
            <Typography variant="body2">
              Este dashboard muestra datos en tiempo real de tu base de datos Supabase. 
              Las estadísticas se actualizan automáticamente cuando se realizan cambios en los datos.
            </Typography>
          </Alert>
          
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Funcionalidades Disponibles:</strong>
            </Typography>
            <Typography variant="body2" component="div">
              • Gestión de empresas con CRUD completo<br />
              • Administración de usuarios y perfiles<br />
              • Control de préstamos y transacciones<br />
              • Autenticación segura con Supabase Auth<br />
              • Estadísticas en tiempo real
            </Typography>
          </Alert>

          <Alert severity="warning">
            <Typography variant="body1" gutterBottom>
              <strong>Próximas Funcionalidades:</strong>
            </Typography>
            <Typography variant="body2" component="div">
              • Reportes avanzados y gráficos<br />
              • Notificaciones en tiempo real<br />
              • Integración con sistemas de pago<br />
              • Dashboard de análisis financiero
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Container>
  );
}