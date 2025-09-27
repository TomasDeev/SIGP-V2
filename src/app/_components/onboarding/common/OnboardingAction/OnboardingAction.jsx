import { useOnboarding } from "@app/_components/onboarding/hooks";
import { useOnboardingData } from "@app/_components/onboarding/onboarding-2/context/OnboardingDataContext";
import { Button, Stack } from "@mui/material";
const OnboardingAction = () => {
  const { prevStep, nextStep, steps, activeIndex } = useOnboarding();
  const { enhancedNextStep } = useOnboardingData();
  return (
    <Stack direction={"row"} spacing={2}>
      <Button
        variant="outlined"
        size="small"
        sx={{ borderRadius: 5, px: 2, fontSize: '0.875rem' }}
        onClick={() => prevStep()}
        disabled={activeIndex === 0}
      >
        Atrás
      </Button>
      <Button
        disableElevation
        variant="contained"
        size="small"
        sx={{ borderRadius: 5, px: 2, fontSize: '0.875rem' }}
        onClick={() => enhancedNextStep ? enhancedNextStep() : nextStep()}
        disabled={activeIndex === steps?.length - 1}
      >
        Continuar
      </Button>
    </Stack>
  );
};

export { OnboardingAction };
