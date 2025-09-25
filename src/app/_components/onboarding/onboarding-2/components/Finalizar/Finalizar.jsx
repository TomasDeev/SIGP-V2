import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Send,
  Warning
} from '@mui/icons-material';
import { JumboCard } from '@jumbo/components';
import { useOnboardingData } from '../../context/OnboardingDataContext';
import { OnboardingToCreditService } from '@app/_services/onboardingToCreditService';

const Finalizar = () => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processComplete, setProcessComplete] = useState(false);
  const [error, setError] = useState(null);
  
  const { getAllData, clearData, isEditing } = useOnboardingData();

  const handleProcesar = () => {
    setOpenConfirmDialog(true);
  };

  const handleCancelar = () => {
    setOpenCancelDialog(true);
  };

  const confirmProcesar = async () => {
    setOpenConfirmDialog(false);
    setProcessing(true);
    setError(null);
    
    try {
      // Obtener todos los datos del onboarding
      const onboardingData = getAllData();
      
      let result;
      
      if (isEditing) {
        // Actualizar la solicitud de crédito existente
        console.log('DEBUG - onboardingData completo:', onboardingData);
        console.log('DEBUG - onboardingData.clientId:', onboardingData.clientId);
        console.log('DEBUG - Todas las propiedades de onboardingData:', Object.keys(onboardingData));
        
        const clientId = onboardingData.clientId;
        if (!clientId) {
          throw new Error('No se encontró el ID del cliente para actualizar');
        }
        console.log('DEBUG - clientId que se va a usar:', clientId);
        result = await OnboardingToCreditService.updateCompleteApplication(onboardingData, clientId);
      } else {
        // Crear la solicitud de crédito completa
        result = await OnboardingToCreditService.createCompleteApplication(onboardingData);
      }
      
      if (result.success) {
        setProcessComplete(true);
        // Limpiar los datos del onboarding después del éxito
        clearData();
      } else {
        setError(result.error || 'Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error al procesar la solicitud de crédito:', error);
      setError('Error inesperado al procesar la solicitud. Por favor, inténtelo de nuevo.');
    } finally {
      setProcessing(false);
    }
  };

  const confirmCancelar = () => {
    setOpenCancelDialog(false);
    // Aquí podrías redirigir o limpiar el formulario
    window.location.href = '/';
  };

  const handleCloseDialogs = () => {
    setOpenConfirmDialog(false);
    setOpenCancelDialog(false);
  };

  if (processComplete) {
    return (
      <JumboCard
        title="Proceso Completado"
        sx={{ mb: 3 }}
      >
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom color="success.main">
            {isEditing ? '¡Actualización Exitosa!' : '¡Proceso Exitoso!'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {isEditing 
              ? 'Su solicitud ha sido actualizada correctamente.'
              : 'Su solicitud ha sido procesada correctamente y se encuentra en revisión.'
            }
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => window.location.href = '/'}
            sx={{ borderRadius: 5 }}
          >
            Volver al Inicio
          </Button>
        </Box>
      </JumboCard>
    );
  }

  if (processing) {
    return (
      <JumboCard
        title="Procesando..."
        sx={{ mb: 3 }}
      >
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Procesando su solicitud
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Por favor espere mientras procesamos su información...
          </Typography>
        </Box>
      </JumboCard>
    );
  }

  if (error) {
    return (
      <JumboCard
        title="Error en el Procesamiento"
        sx={{ mb: 3 }}
      >
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Cancel sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom color="error.main">
            Error al Procesar
          </Typography>
          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
            {error}
          </Alert>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                setError(null);
                setProcessComplete(false);
              }}
              sx={{ borderRadius: 5 }}
            >
              Intentar de Nuevo
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => window.location.href = '/'}
              sx={{ borderRadius: 5 }}
            >
              Volver al Inicio
            </Button>
          </Box>
        </Box>
      </JumboCard>
    );
  }

  return (
    <>
      <JumboCard
        title="Paso 11: Finalizar"
        sx={{ mb: 3 }}
      >
        <Box sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <CheckCircle sx={{ mr: 1, color: 'primary.main' }} />
            12.1 Finalizar proceso
          </Typography>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {isEditing ? '¿Está listo para actualizar?' : '¿Está listo para finalizar?'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {isEditing 
                ? 'Revise toda la información modificada antes de actualizar su solicitud.'
                : 'Revise toda la información ingresada antes de procesar su solicitud. Una vez procesada, no podrá realizar cambios.'
              }
            </Typography>

            <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
              <Typography variant="body2">
                <strong>Antes de continuar, asegúrese de que:</strong>
              </Typography>
              <ul style={{ marginTop: 8, marginBottom: 0 }}>
                <li>Todos los datos personales están correctos</li>
                <li>La información laboral es precisa</li>
                <li>Las referencias son válidas</li>
                <li>Los montos de desembolso son correctos</li>
              </ul>
            </Alert>
          </Box>

          {/* Botones principales */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 3,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Send />}
              onClick={handleProcesar}
              sx={{ 
                borderRadius: 5,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                minWidth: 200
              }}
            >
              {isEditing ? 'Actualizar' : 'Procesar'}
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<Cancel />}
              onClick={handleCancelar}
              color="error"
              sx={{ 
                borderRadius: 5,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                minWidth: 200
              }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </JumboCard>

      {/* Dialog de confirmación para Procesar */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseDialogs}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircle sx={{ mr: 1, color: 'primary.main' }} />
          {isEditing ? 'Confirmar Actualización' : 'Confirmar Procesamiento'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isEditing 
              ? '¿Está seguro de que desea actualizar su solicitud con los cambios realizados?'
              : '¿Está seguro de que desea procesar su solicitud? Una vez confirmado, no podrá realizar cambios en la información ingresada.'
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialogs} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={confirmProcesar} 
            variant="contained"
            startIcon={<Send />}
          >
            {isEditing ? 'Confirmar Actualización' : 'Confirmar Procesamiento'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmación para Cancelar */}
      <Dialog
        open={openCancelDialog}
        onClose={handleCloseDialogs}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <Warning sx={{ mr: 1, color: 'warning.main' }} />
          Confirmar Cancelación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea cancelar el proceso? 
            Se perderá toda la información ingresada y será redirigido al inicio.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialogs} color="inherit">
            No, continuar
          </Button>
          <Button 
            onClick={confirmCancelar} 
            variant="contained"
            color="error"
            startIcon={<Cancel />}
          >
            Sí, cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Finalizar;