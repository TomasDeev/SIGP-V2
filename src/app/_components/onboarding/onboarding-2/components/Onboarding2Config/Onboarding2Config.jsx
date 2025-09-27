import { Logo } from "@app/_components/_core";
import { OnboardingStepper, useOnboarding } from "@app/_components/onboarding";
import { useUserCompany } from "@app/_hooks/useUserCompany";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { Div } from "@jumbo/shared";
import React from "react";

const Onboarding2Config = () => {
  const { activeStep } = useOnboarding();
  const { theme } = useJumboTheme();
  const { companyData, loading: companyLoading, getDefaults } = useUserCompany();
  
  const ContentComponent = React.useMemo(
    () => activeStep?.component,
    [activeStep]
  );
  
  // Props to pass to the component
  const componentProps = {
    value: activeStep,
    companyData,
    companyLoading,
    getDefaults
  };
  
  return (
    <React.Fragment>
      <Div sx={{ mb: 3 }}>
        <Logo sx={{ mr: 3, minWidth: 150 }} mode={theme.type} />
      </Div>
      <OnboardingStepper />
      <ContentComponent {...componentProps} />
    </React.Fragment>
  );
};

export { Onboarding2Config };
