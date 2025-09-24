import React from "react";
import { OnboardingContext } from "./OnboardingContext";

const OnboardingProvider = ({ children, initSteps, initSidebarSteps }) => {
  const [steps] = React.useState(initSteps);

  const [sidebarSteps] = React.useState(initSidebarSteps);

  const [activeIndex, setActiveIndex] = React.useState(0);

  const activeStep = React.useMemo(() => {
    return steps[activeIndex];
  }, [activeIndex, steps]);

  const sidebarActiveStep = React.useMemo(() => {
    if (!sidebarSteps) return null;
    return sidebarSteps[activeIndex];
  }, [activeIndex, sidebarSteps]);

  const nextStep = React.useCallback(() => {
    setActiveIndex(activeIndex + 1);
  }, [activeIndex]);

  const prevStep = React.useCallback(() => {
    setActiveIndex(activeIndex - 1);
  }, [activeIndex]);

  const goToStep = React.useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setActiveIndex(stepIndex);
    }
  }, [steps.length]);

  const stepperContextValue = React.useMemo(
    () => ({
      steps,
      activeStep,
      sidebarSteps,
      sidebarActiveStep,
      activeIndex,
      nextStep,
      prevStep,
      goToStep,
    }),
    [
      steps,
      activeStep,
      sidebarSteps,
      sidebarActiveStep,
      activeIndex,
      nextStep,
      prevStep,
      goToStep,
    ]
  );

  return (
    <OnboardingContext.Provider value={stepperContextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};

export { OnboardingProvider };
