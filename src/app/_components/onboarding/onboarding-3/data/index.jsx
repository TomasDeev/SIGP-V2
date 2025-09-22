import { GPSSeguro } from '../components/onboarding-content';
import { PersonalDetailSidebar } from '../components/onboarding-sidebar';

const steps = [
  {
    key: 'personal-detail',
    component: GPSSeguro,
  },
  {
    key: 'about-organisation',
    component: GPSSeguro,
  },
  {
    key: 'payment-detail',
    component: GPSSeguro,
  },
  {
    key: 'billing-address',
    component: GPSSeguro,
  },
  {
    key: 'final-onboarding',
    component: GPSSeguro,
  },
];

const sidebarSteps = [
  {
    key: 'personal-detail',
    component: PersonalDetailSidebar,
  },
  {
    key: 'about-organisation',
    component: PersonalDetailSidebar,
  },
  {
    key: 'payment-detail',
    component: PersonalDetailSidebar,
  },
  {
    key: 'billing-address',
    component: PersonalDetailSidebar,
  },
  {
    key: 'final-onboarding',
    component: PersonalDetailSidebar,
  },
];
const onboardingData = [
  {
    id: 1,
    picture: 'image',
    title: 'Pictures Hosting Service And Space',
    description: `Host your pictures over the cloud and access them from
                  anywhere. It starts with FREE!`,
  },
  {
    id: 2,
    picture: 'image',
    title: 'Pictures Hosting Service And Space',
    description: `Host your pictures over the cloud and access them from
                  anywhere. It starts with FREE!`,
  },
  {
    id: 3,
    picture: 'image',
    title: 'Pictures Hosting Service And Space',
    description: `Host your pictures over the cloud and access them from
                  anywhere. It starts with FREE!`,
  },
  {
    id: 4,
    picture: 'image',
    title: 'Pictures Hosting Service And Space',
    description: `Host your pictures over the cloud and access them from
                  anywhere. It starts with FREE!`,
  },
  {
    id: 5,
    picture: 'image',
    title: 'Pictures Hosting Service And Space',
    description: `Host your pictures over the cloud and access them from
                  anywhere. It starts with FREE!`,
  },
  {
    id: 6,
    picture: 'image',
    title: 'Pictures Hosting Service And Space',
    description: `Host your pictures over the cloud and access them from
                  anywhere. It starts with FREE!`,
  },
];

export { onboardingData, sidebarSteps, steps };
