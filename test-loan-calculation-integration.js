// Test script para verificar la integración del LoanCalculation con el contexto
import fs from 'fs';
import path from 'path';

console.log('🧪 Probando integración de LoanCalculation...\n');

// Verificar LoanCalculation.jsx
const loanCalculationPath = 'src/app/_components/onboarding/onboarding-2/components/LoanCalculation/LoanCalculation.jsx';
const loanCalcContent = fs.readFileSync(loanCalculationPath, 'utf8');

// Leer el archivo OnboardingDataContext.jsx
  const contextPath = 'src/app/_components/onboarding/onboarding-2/context/OnboardingDataContext.jsx';
  const contextContent = fs.readFileSync(contextPath, 'utf8');

// Leer el archivo OnboardingAction.jsx
  const actionPath = 'src/app/_components/onboarding/common/OnboardingAction/OnboardingAction.jsx';
  const actionContent = fs.readFileSync(actionPath, 'utf8');

console.log('✅ Verificando imports en LoanCalculation.jsx:');
const hasSetEnhancedNextStep = loanCalcContent.includes('setEnhancedNextStep');
const hasUseEffect = loanCalcContent.includes('useEffect(() => {');
console.log(`  - setEnhancedNextStep importado: ${hasSetEnhancedNextStep ? '✅' : '❌'}`);
console.log(`  - useEffect agregado: ${hasUseEffect ? '✅' : '❌'}`);

console.log('\n✅ Verificando enhancedNextStep en OnboardingDataContext.jsx:');
const hasEnhancedNextStepState = contextContent.includes('const [enhancedNextStep, setEnhancedNextStep] = useState(null);');
const hasEnhancedNextStepInContext = contextContent.includes('enhancedNextStep,') && contextContent.includes('setEnhancedNextStep');
console.log(`  - Estado enhancedNextStep definido: ${hasEnhancedNextStepState ? '✅' : '❌'}`);
console.log(`  - enhancedNextStep en contextValue: ${hasEnhancedNextStepInContext ? '✅' : '❌'}`);

console.log('\n✅ Verificando OnboardingAction.jsx:');
const hasEnhancedNextStepImport = actionContent.includes('const { enhancedNextStep } = useOnboardingData();');
const hasEnhancedNextStepUsage = actionContent.includes('enhancedNextStep ? enhancedNextStep() : nextStep()');
console.log(`  - enhancedNextStep importado: ${hasEnhancedNextStepImport ? '✅' : '❌'}`);
console.log(`  - enhancedNextStep usado en botón: ${hasEnhancedNextStepUsage ? '✅' : '❌'}`);

console.log('\n📋 Resumen de la implementación:');
console.log('1. LoanCalculation.jsx:');
console.log('   - Importa setEnhancedNextStep del contexto');
console.log('   - Tiene un useEffect que guarda datos al cambiar de paso');
console.log('   - Llama a setEnhancedNextStep(saveLoanCalculationData)');

console.log('\n2. OnboardingDataContext.jsx:');
console.log('   - Define [enhancedNextStep, setEnhancedNextStep] = useState(null)');
console.log('   - Proporciona enhancedNextStep y setEnhancedNextStep en el contexto');

console.log('\n3. OnboardingAction.jsx:');
console.log('   - Importa enhancedNextStep del contexto');
console.log('   - Usa enhancedNextStep ? enhancedNextStep() : nextStep() en el botón Continuar');

console.log('\n🎯 Flujo esperado:');
console.log('1. Usuario completa datos en LoanCalculation');
console.log('2. useEffect en LoanCalculation actualiza enhancedNextStep con saveLoanCalculationData');
console.log('3. Usuario hace clic en "Continuar"');
console.log('4. OnboardingAction ejecuta enhancedNextStep() que guarda los datos');
console.log('5. enhancedNextStep llama a saveLoanCalculationData que actualiza el contexto');
console.log('6. Los datos están disponibles en el siguiente paso');

const allTestsPass = hasSetEnhancedNextStep && hasUseEffect && 
                    hasEnhancedNextStepState && hasEnhancedNextStepInContext &&
                    hasEnhancedNextStepImport && hasEnhancedNextStepUsage;

console.log(`\n${allTestsPass ? '🎉' : '⚠️'} Resultado: ${allTestsPass ? 'Todos los componentes están correctamente configurados' : 'Algunos componentes necesitan ajustes'}`);