import { Page } from "@app/_components/_core";
import {
  ActiveLogin,
  AdvertisingSettings,
  EmailAccessSettings,
  InvoiceSettings,
  MembershipPlans,
  NotificationSettings,
  OrganizationSettings,
  PaymentMethodSettings,
  ResetPasswordSettings,
  StatementSettings,
  TeamSettings,
  TwoFactorAuth,
} from "@app/_components/user/settings";
import withAuth from "@app/_hoc/withAuth";
import { SettingsLayout } from "@app/_layouts/SettingsLayout";
import { SoloLayout } from "@app/_layouts/SoloLayout";
import { StretchedLayout } from "@app/_layouts/StretchedLayout";
import ChatAppPage from "@app/pages/apps/chat";
import ContactAppPage from "@app/pages/apps/contact";
import InvoicePage1 from "@app/pages/apps/invoice-1";
import MailAppPage from "@app/pages/apps/mail";
import ForgotPassword from "@app/pages/auth/forgot-password";
import Login1 from "@app/pages/auth/login1";
import Login2 from "@app/pages/auth/login2";
import ResetPassword from "@app/pages/auth/reset-password";
import Signup1 from "@app/pages/auth/signup1";
import Signup2 from "@app/pages/auth/signup2";
import CrmPage from "@app/pages/dashboards/crm";
import CryptoPage from "@app/pages/dashboards/crypto";
import EcommercePage from "@app/pages/dashboards/ecommerce";
import IntranetPage from "@app/pages/dashboards/intranet";
import ListingPage from "@app/pages/dashboards/listing";
import MiscPage from "@app/pages/dashboards/misc";
import NewsPage from "@app/pages/dashboards/news";
import SIGPDashboard from "@app/pages/dashboards/sigp";
import DnDPage from "@app/pages/extensions/dnd";
import DropzonePage from "@app/pages/extensions/dropzone";
import CkEditorPage from "@app/pages/extensions/editors/ck";
import WysiwygEditorPage from "@app/pages/extensions/editors/wysiwyg";
import SweetAlertsPage from "@app/pages/extensions/sweet-alert";
import NotFoundErrorPage from "@app/pages/extra-pages/404";
import InternalServerErrorPage from "@app/pages/extra-pages/500";
import AboutUsPage from "@app/pages/extra-pages/about-us";
import CallOutsPage from "@app/pages/extra-pages/call-outs";
import ContactUsPage from "@app/pages/extra-pages/contact-us";
import LockScreenPage from "@app/pages/extra-pages/lock-screen";
import PricingPlanPage from "@app/pages/extra-pages/pricing-plan";
import ProjectsGridPage from "@app/pages/grid-views/projects";
import UsersGridPage from "@app/pages/grid-views/users";
import ProjectsListPage from "@app/pages/list-views/projects";
import UsersListPage from "@app/pages/list-views/users";
import MetricsPage from "@app/pages/metrics";
import BasicCalendarPage from "@app/pages/modules/calendars/basic";
import CultureCalendarPage from "@app/pages/modules/calendars/culture";
import PopupCalendarPage from "@app/pages/modules/calendars/popup";
import RenderingCalendarPage from "@app/pages/modules/calendars/rendering";
import SelectableCalendarPage from "@app/pages/modules/calendars/selectable";
import TimeslotCalendarPage from "@app/pages/modules/calendars/timeslot";
import AreaChartPage from "@app/pages/modules/charts/area";
import BarChartPage from "@app/pages/modules/charts/bar";
import ComposedChartPage from "@app/pages/modules/charts/composed";
import LineChartPage from "@app/pages/modules/charts/line";
import PieChartPage from "@app/pages/modules/charts/pie";
import RadarChartPage from "@app/pages/modules/charts/radar";
import RadialChartPage from "@app/pages/modules/charts/radial";
import ScatterChartPage from "@app/pages/modules/charts/scatter";
import TreeMapChartPage from "@app/pages/modules/charts/treemap";
import MarkerClustererPage from "@app/pages/modules/maps/clustering";
import DirectionsMapPage from "@app/pages/modules/maps/directions";
import DrawingViewMapPage from "@app/pages/modules/maps/drawing";
import GeoLocationMapPage from "@app/pages/modules/maps/geo-location";
import KmLayerMapPage from "@app/pages/modules/maps/kml";
import OverlayMapPage from "@app/pages/modules/maps/overlay";
import PopupInfoMapPage from "@app/pages/modules/maps/popup-info";
import SimpleMapPage from "@app/pages/modules/maps/simple";
import StreetViewPanoramaPage from "@app/pages/modules/maps/street-view";
import StyledMapPage from "@app/pages/modules/maps/styled";
import OnboardingPage1 from "@app/pages/onboarding-1";
import OnboardingPage2 from "@app/pages/onboarding-2";
import OnboardingPage3 from "@app/pages/onboarding-3";
import LoanCalculatorPage from "@app/pages/tools/loan-calculator";
import CreditApplicationPage from "@app/pages/tools/credit-application";
import CompaniesPage from "@app/pages/administration/companies";
import BranchesPage from "@app/pages/administration/branches";
import UsersPage from "@app/pages/administration/users";
import UserProfile1 from "@app/pages/user/profile-1";
import ProfilePage2 from "@app/pages/user/profile-2";
import ProfilePage3 from "@app/pages/user/profile-3";
import ProfilePage4 from "@app/pages/user/profile-4";
import PublicProfile from "@app/pages/user/settings/public-profile";
import SocialWallApp from "@app/pages/user/social-wall";
import { WidgetsPage } from "@app/pages/widgets";
import { createBrowserRouter, Navigate } from "react-router-dom";

const routes = [
  {
    path: "/",
    element: <StretchedLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/widgets" replace />,
      },
      {
        path: "/dashboards/misc",
        element: <Page Component={MiscPage} hoc={withAuth} />,
      },
      {
        path: "/dashboards/crypto",
        element: <Page Component={CryptoPage} hoc={withAuth} />,
      },
      {
        path: "/dashboards/listing",
        element: <Page Component={ListingPage} hoc={withAuth} />,
      },
      {
        path: "/dashboards/crm",
        element: <Page Component={CrmPage} hoc={withAuth} />,
      },
      {
        path: "/dashboards/intranet",
        element: <Page Component={IntranetPage} hoc={withAuth} />,
      },
      {
        path: "/dashboards/ecommerce",
        element: <Page Component={EcommercePage} hoc={withAuth} />,
      },
      {
        path: "/dashboards/news",
        element: <Page Component={NewsPage} hoc={withAuth} />,
      },
      {
        path: "/dashboards/sigp",
        element: <Page Component={SIGPDashboard} hoc={withAuth} />,
      },
      {
        path: "/widgets",
        element: <Page Component={WidgetsPage} hoc={withAuth} />,
      },
      {
        path: "/metrics",
        element: <Page Component={MetricsPage} hoc={withAuth} />,
      },
      {
        path: "/apps/chat",
        element: <Page Component={ChatAppPage} hoc={withAuth} />,
      },
      {
        path: "/apps/chat/:chatBy/:id",
        element: <Page Component={ChatAppPage} hoc={withAuth} />,
      },
      {
        path: "/apps/contact",
        element: <Page Component={ContactAppPage} hoc={withAuth} />,
      },
      {
        path: "/apps/contact/:category",
        element: <Page Component={ContactAppPage} hoc={withAuth} />,
      },
      {
        path: "/apps/contact/label/:labelID",
        element: <Page Component={ContactAppPage} hoc={withAuth} />,
      },
      {
        path: "/apps/mail/:category",
        element: <Page Component={MailAppPage} hoc={withAuth} />,
      },

      {
        path: "/apps/mail/message/:mailID",
        element: <Page Component={MailAppPage} hoc={withAuth} />,
      },
      {
        path: "/apps/mail/message/:mailID",
        element: <Page Component={MailAppPage} hoc={withAuth} />,
      },
      {
        path: "/apps/mail/label/:labelID",
        element: <Page Component={MailAppPage} hoc={withAuth} />,
      },
      {
        path: "/apps/invoice",
        element: <Page Component={InvoicePage1} hoc={withAuth} />,
      },
      {
        path: "/extensions/editors/ck",
        element: <Page Component={CkEditorPage} hoc={withAuth} />,
      },
      {
        path: "/extensions/editors/wysiwyg",
        element: <Page Component={WysiwygEditorPage} hoc={withAuth} />,
      },
      {
        path: "/extensions/dnd",
        element: <Page Component={DnDPage} hoc={withAuth} />,
      },
      {
        path: "/extensions/dropzone",
        element: <Page Component={DropzonePage} hoc={withAuth} />,
      },
      {
        path: "/extensions/sweet-alert",
        element: <Page Component={SweetAlertsPage} hoc={withAuth} />,
      },
      {
        path: "/modules/calendars/basic",
        element: <Page Component={BasicCalendarPage} hoc={withAuth} />,
      },
      {
        path: "/modules/calendars/culture",
        element: <Page Component={CultureCalendarPage} hoc={withAuth} />,
      },
      {
        path: "/modules/calendars/popup",
        element: <Page Component={PopupCalendarPage} hoc={withAuth} />,
      },
      {
        path: "/modules/calendars/rendering",
        element: <Page Component={RenderingCalendarPage} hoc={withAuth} />,
      },
      {
        path: "/modules/calendars/selectable",
        element: <Page Component={SelectableCalendarPage} hoc={withAuth} />,
      },
      {
        path: "/modules/calendars/timeslot",
        element: <Page Component={TimeslotCalendarPage} hoc={withAuth} />,
      },
      {
        path: "/modules/charts/line",
        element: <Page Component={LineChartPage} hoc={withAuth} />,
      },
      {
        path: "/modules/charts/bar",
        element: <Page Component={BarChartPage} hoc={withAuth} />,
      },
      {
        path: "/modules/charts/area",
        element: <Page Component={AreaChartPage} hoc={withAuth} />,
      },
      {
        path: "/modules/charts/composed",
        element: <Page Component={ComposedChartPage} hoc={withAuth} />,
      },
      {
        path: "/modules/charts/pie",
        element: <Page Component={PieChartPage} hoc={withAuth} />,
      },
      {
        path: "/modules/charts/scatter",
        element: <Page Component={ScatterChartPage} hoc={withAuth} />,
      },
      {
        path: "/modules/charts/radial",
        element: <Page Component={RadialChartPage} hoc={withAuth} />,
      },
      {
        path: "/modules/charts/radar",
        element: <Page Component={RadarChartPage} hoc={withAuth} />,
      },
      {
        path: "/modules/charts/treemap",
        element: <Page Component={TreeMapChartPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/simple",
        element: <Page Component={SimpleMapPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/styled",
        element: <Page Component={StyledMapPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/geo-location",
        element: <Page Component={GeoLocationMapPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/directions",
        element: <Page Component={DirectionsMapPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/overlay",
        element: <Page Component={OverlayMapPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/kml",
        element: <Page Component={KmLayerMapPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/popup-info",
        element: <Page Component={PopupInfoMapPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/street-view",
        element: <Page Component={StreetViewPanoramaPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/drawing",
        element: <Page Component={DrawingViewMapPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/clustering",
        element: <Page Component={MarkerClustererPage} hoc={withAuth} />,
      },
      {
        path: "/extra-pages/about-us",
        element: <Page Component={AboutUsPage} hoc={withAuth} />,
      },
      {
        path: "/extra-pages/contact-us",
        element: <Page Component={ContactUsPage} hoc={withAuth} />,
      },
      {
        path: "/extra-pages/call-outs",
        element: <Page Component={CallOutsPage} hoc={withAuth} />,
      },
      {
        path: "/extra-pages/pricing-plan",
        element: <Page Component={PricingPlanPage} hoc={withAuth} />,
      },
      {
        path: "/user/profile-1",
        element: <Page Component={UserProfile1} hoc={withAuth} />,
      },
      {
        path: "/user/profile-2",
        element: <Page Component={ProfilePage2} hoc={withAuth} />,
      },
      {
        path: "/user/profile-3",
        element: <Page Component={ProfilePage3} hoc={withAuth} />,
      },
      {
        path: "/user/profile-4",
        element: <Page Component={ProfilePage4} hoc={withAuth} />,
      },
      {
        path: "/user/social-wall",
        element: <Page Component={SocialWallApp} hoc={withAuth} />,
      },
      {
        path: "/user/settings",
        element: <SettingsLayout />,
        children: [
          {
            path: "public-profile",
            element: <Page Component={PublicProfile} hoc={withAuth} />,
          },
          {
            path: "team",
            element: <Page Component={TeamSettings} hoc={withAuth} />,
          },
          {
            path: "login-devices",
            element: <Page Component={ActiveLogin} hoc={withAuth} />,
          },
          {
            path: "organizations",
            element: <Page Component={OrganizationSettings} hoc={withAuth} />,
          },
          {
            path: "emails",
            element: <Page Component={EmailAccessSettings} hoc={withAuth} />,
          },
          {
            path: "reset-password",
            element: <Page Component={ResetPasswordSettings} hoc={withAuth} />,
          },
          {
            path: "2-factor-auth",
            element: <Page Component={TwoFactorAuth} hoc={withAuth} />,
          },
          {
            path: "membership-plans",
            element: <Page Component={MembershipPlans} hoc={withAuth} />,
          },
          {
            path: "payment-methods",
            element: <Page Component={PaymentMethodSettings} hoc={withAuth} />,
          },
          {
            path: "invoices",
            element: <Page Component={InvoiceSettings} hoc={withAuth} />,
          },
          {
            path: "statements",
            element: <Page Component={StatementSettings} hoc={withAuth} />,
          },
          {
            path: "advertising",
            element: <Page Component={AdvertisingSettings} hoc={withAuth} />,
          },
          {
            path: "notifications",
            element: <Page Component={NotificationSettings} hoc={withAuth} />,
          },
        ],
      },
      {
        path: "/list-views/projects",
        element: <Page Component={ProjectsListPage} hoc={withAuth} />,
      },
      {
        path: "/list-views/users",
        element: <Page Component={UsersListPage} hoc={withAuth} />,
      },
      {
        path: "/grid-views/projects",
        element: <Page Component={ProjectsGridPage} hoc={withAuth} />,
      },
      {
        path: "/grid-views/users",
        element: <Page Component={UsersGridPage} hoc={withAuth} />,
      },
      {
        path: "/tools/loan-calculator",
        element: <Page Component={LoanCalculatorPage} hoc={withAuth} />,
      },
      {
        path: "/tools/credit-application",
        element: <Page Component={CreditApplicationPage} hoc={withAuth} />,
      },
      {
        path: "/administration/companies",
        element: <Page Component={CompaniesPage} hoc={withAuth} />,
      },
      {
        path: "/administration/branches",
        element: <Page Component={BranchesPage} hoc={withAuth} />,
      },
      {
        path: "/administration/users",
        element: <Page Component={UsersPage} hoc={withAuth} />,
      },
      /** extra routes */
      {
        path: "/onboarding-1",
        element: <Page Component={OnboardingPage1} hoc={withAuth} />,
      },
      {
        path: "/onboarding-2",
        element: <Page Component={OnboardingPage2} hoc={withAuth} />,
      },
      {
        path: "/onboarding-3",
        element: <Page Component={OnboardingPage3} hoc={withAuth} />,
      },
    ],
  },

  {
    path: "/auth",
    element: <SoloLayout />,
    children: [
      {
        path: "login-1",
        element: <Login1 />,
      },
      {
        path: "login-2",
        element: <Login2 />,
      },
      {
        path: "signup-1",
        element: <Signup1 />,
      },
      {
        path: "signup-2",
        element: <Signup2 />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "/extra-pages",
    element: <SoloLayout />,
    children: [
      {
        path: "404",
        element: <NotFoundErrorPage />,
      },
      {
        path: "500",
        element: <InternalServerErrorPage />,
      },
      {
        path: "lock-screen",
        element: <LockScreenPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundErrorPage />,
  },
];

export const router = createBrowserRouter(routes);
