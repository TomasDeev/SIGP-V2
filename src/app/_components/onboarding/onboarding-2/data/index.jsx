import { 
  LoanCalculation, 
  Guarantee, 
  GPSSeguro, 
  Fiador, 
  DatosPersonales,
  DireccionLocalizacion,
  DatosConyuge,
  InformacionLaboral,
  ReferenciasPersonales,
  Cheques,
  Finalizar
} from '../components';

export const steps = [
  { key: 'loan-calculation', component: LoanCalculation },
  { key: 'guarantee', component: Guarantee },
  { key: 'fiador', component: Fiador },
  { key: 'datos-personales', component: DatosPersonales },
  { key: 'direccion-localizacion', component: DireccionLocalizacion },
  { key: 'datos-conyuge', component: DatosConyuge },
  { key: 'informacion-laboral', component: InformacionLaboral },
  { key: 'referencias-personales', component: ReferenciasPersonales },
  { key: 'cheques', component: Cheques },
  { key: 'finalizar', component: Finalizar },
];
