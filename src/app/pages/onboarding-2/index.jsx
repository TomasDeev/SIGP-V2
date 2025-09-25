import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import {
  OnboardingProvider,
  OnboardingStepper2,
  useOnboarding,
} from "@app/_components/onboarding";
import { steps } from "@app/_components/onboarding/onboarding-2";
import { OnboardingDataProvider } from "@app/_components/onboarding/onboarding-2/context/OnboardingDataContext";
import { CONTAINER_MAX_WIDTH } from "@app/_config/layouts";
import { Div } from "@jumbo/shared";
import { Container } from "@mui/material";
import React from "react";
const OnboardingComponent = () => {
  const { activeStep } = useOnboarding();

  const ContentComponent = React.useMemo(
    () => activeStep?.component,
    [activeStep]
  );
  return (
    <React.Fragment>
      <Div sx={{ mb: 3 }}>
        <img src="/SIGP Nuevo logo.png" alt="SIGP" style={{ maxHeight: '60px' }} />
      </Div>
      <OnboardingStepper2 />
      <ContentComponent value={activeStep} />
    </React.Fragment>
  );
};

const OnboardingPage2 = () => {
  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: CONTAINER_MAX_WIDTH,
        display: "flex",
        minWidth: 0,
        flex: 1,
        flexDirection: "column",
      }}
      disableGutters
    >
      <OnboardingDataProvider>
        <OnboardingProvider initSteps={steps}>
          <OnboardingComponent />
        </OnboardingProvider>
      </OnboardingDataProvider>
    </Container>
  );
};

export default OnboardingPage2;
