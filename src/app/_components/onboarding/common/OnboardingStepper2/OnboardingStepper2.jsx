import { useOnboarding } from "@app/_components/onboarding/hooks";
import { useOnboardingData } from "@app/_components/onboarding/onboarding-2/context/OnboardingDataContext";
import { Div } from "@jumbo/shared";
import { Typography, Box, Chip, useTheme, Alert } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { Edit } from "@mui/icons-material";

const stepNames = [
  "Cálculo",
  "Garantía", 
  "Fiador",
  "Datos Personales",
  "Dirección",
  "Cónyuge",
  "Laboral",
  "Referencias",
  "Cheques",
  "Finalizar"
];

const OnboardingStepper2 = () => {
  const { steps, activeIndex, goToStep } = useOnboarding();
  const { isEditing } = useOnboardingData();
  const theme = useTheme();

  const handleStepClick = (stepIndex) => {
    if (goToStep) {
      goToStep(stepIndex);
    }
  };

  return (
    <Div sx={{ mb: 4 }}>
      {/* Alerta de modo edición */}
      {isEditing && (
        <Alert 
          severity="info" 
          icon={<Edit />}
          sx={{ mb: 2 }}
        >
          Editando datos del cliente existente
        </Alert>
      )}
      
      {/* Step Progress Header */}
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2, 
          fontWeight: 600,
          color: theme.palette.primary.main 
        }}
      >
        Paso {activeIndex + 1} de {steps?.length}
      </Typography>
      
      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            width: "100%",
            height: "8px",
            backgroundColor: "#E5E7EB",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: `${((activeIndex + 1) / steps?.length) * 100}%`,
              height: "100%",
              backgroundColor: theme.palette.primary.main,
              borderRadius: "4px",
              transition: "width 0.3s ease",
            }}
          />
        </Box>
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 1, 
            display: "block",
            color: theme.palette.text.secondary 
          }}
        >
          {Math.round(((activeIndex + 1) / steps?.length) * 100)}% completado
        </Typography>
      </Box>

      {/* Step Navigation Chips */}
      <Box 
        sx={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: 1,
          mb: 2 
        }}
      >
        {Array.from({ length: steps?.length || 11 }).map((_, index) => {
          const isActive = index === activeIndex;
          const isCompleted = index < activeIndex;
          const stepName = stepNames[index] || `Paso ${index + 1}`;
          
          return (
            <Chip
              key={index}
              label={`${index + 1}. ${stepName}`}
              onClick={() => handleStepClick(index)}
              variant={isActive ? "filled" : "outlined"}
              sx={{
                cursor: "pointer",
                fontSize: "0.75rem",
                height: "28px",
                backgroundColor: isActive 
                  ? theme.palette.primary.main 
                  : isCompleted 
                    ? theme.palette.success.light
                    : "transparent",
                color: isActive 
                  ? "white" 
                  : isCompleted 
                    ? theme.palette.success.dark
                    : theme.palette.text.secondary,
                borderColor: isActive 
                  ? theme.palette.primary.main 
                  : isCompleted 
                    ? theme.palette.success.main
                    : theme.palette.divider,
                "&:hover": {
                  backgroundColor: isActive 
                    ? theme.palette.primary.dark 
                    : isCompleted 
                      ? theme.palette.success.main
                      : theme.palette.action.hover,
                  color: isActive || isCompleted ? "white" : theme.palette.text.primary,
                },
                transition: "all 0.2s ease",
              }}
            />
          );
        })}
      </Box>

      {/* Current Step Indicator */}
      <Box 
        sx={{ 
          p: 2, 
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 500,
            color: theme.palette.text.primary 
          }}
        >
          Paso actual: {stepNames[activeIndex] || `Paso ${activeIndex + 1}`}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: theme.palette.text.secondary,
            mt: 0.5,
            display: "block"
          }}
        >
          Haz clic en cualquier paso para navegar libremente
        </Typography>
      </Box>
    </Div>
  );
};

export { OnboardingStepper2 };