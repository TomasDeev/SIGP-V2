import { useTranslation } from "react-i18next";

export function getMenus() {
  const { t } = useTranslation();
  return [
    {
      label: t("sidebar.menu.modules"),
      children: [
        {
          label: t("sidebar.menu.tools"),
          collapsible: true,
          icon: "widget",
          children: [
            {
              path: "/tools/loan-calculator",
              label: t("sidebar.menuItem.loanCalculator"),
            },
            {
              path: "/tools/credit-application",
              label: t("sidebar.menuItem.creditApplication"),
            },
          ],
        },
        {
          label: t("sidebar.menu.administration"),
          collapsible: true,
          icon: "settings",
          children: [
            {
              path: "/administration/companies",
              label: t("sidebar.menuItem.companies"),
            },
            {
              path: "/administration/branches",
              label: t("sidebar.menuItem.branches"),
            },
          ],
        },
      ],
    },
  ];
}

// Función específica para el widget de navegación circular que incluye todas las páginas
export function getWidgetMenus() {
  const { t } = useTranslation();
  return [
    {
      label: "DASHBOARDS",
      children: [
        { path: "/dashboards/misc", label: "Misc" },
        { path: "/dashboards/crypto", label: "Crypto" },
        { path: "/dashboards/listing", label: "Listing" },
        { path: "/dashboards/crm", label: "CRM" },
        { path: "/dashboards/intranet", label: "Intranet" },
        { path: "/dashboards/ecommerce", label: "E-commerce" },
        { path: "/dashboards/news", label: "News" },
      ],
    },
    {
      label: "WIDGETS",
      children: [
        { path: "/widgets", label: "Widgets" },
        { path: "/metrics", label: "Metrics" },
      ],
    },
    {
      label: "APLICACIONES",
      children: [
        { path: "/apps/chat", label: "Chat" },
        { path: "/apps/contact", label: "Contactos" },
        { path: "/apps/mail/inbox", label: "Mail" },
        { path: "/apps/invoice", label: "Factura" },
      ],
    },
    {
      label: "EXTENSIONES",
      children: [
        { path: "/extensions/editors/ck", label: "CK Editor" },
        { path: "/extensions/editors/wysiwyg", label: "WYSIWYG Editor" },
        { path: "/extensions/dnd", label: "Drag & Drop" },
        { path: "/extensions/dropzone", label: "Dropzone" },
        { path: "/extensions/sweet-alert", label: "Sweet Alert" },
      ],
    },
    {
      label: "MÓDULOS",
      children: [
        {
          label: "Herramientas",
          collapsible: true,
          icon: "settings",
          children: [
            { path: "/tools/loan-calculator", label: "Calculadora de Préstamos" },
            { path: "/tools/credit-application", label: "Solicitud de Crédito" },
          ],
        },
        {
          label: "Calendarios",
          collapsible: true,
          icon: "calendar",
          children: [
            { path: "/modules/calendars/basic", label: "Básico" },
            { path: "/modules/calendars/culture", label: "Cultura" },
            { path: "/modules/calendars/popup", label: "Popup" },
            { path: "/modules/calendars/rendering", label: "Rendering" },
            { path: "/modules/calendars/selectable", label: "Selectable" },
            { path: "/modules/calendars/timeslot", label: "Time Slots" },
          ],
        },
        {
          label: "Gráficos",
          collapsible: true,
          icon: "chart",
          children: [
            { path: "/modules/charts/line", label: "Línea" },
            { path: "/modules/charts/bar", label: "Barra" },
            { path: "/modules/charts/area", label: "Área" },
            { path: "/modules/charts/composed", label: "Compuesto" },
            { path: "/modules/charts/pie", label: "Pie" },
            { path: "/modules/charts/scatter", label: "Scatter" },
            { path: "/modules/charts/radial", label: "Radial" },
            { path: "/modules/charts/radar", label: "Radar" },
            { path: "/modules/charts/treemap", label: "Tree Map" },
          ],
        },
        {
          label: "Mapas",
          collapsible: true,
          icon: "map",
          children: [
            { path: "/modules/maps/simple", label: "Simple" },
            { path: "/modules/maps/styled", label: "Styled" },
            { path: "/modules/maps/geo-location", label: "Geo Location" },
            { path: "/modules/maps/directions", label: "Directions" },
            { path: "/modules/maps/overlay", label: "Overlay" },
            { path: "/modules/maps/kml", label: "KM Layer" },
            { path: "/modules/maps/popup-info", label: "Popup Info" },
            { path: "/modules/maps/street-view", label: "Street View" },
            { path: "/modules/maps/drawing", label: "Drawing" },
            { path: "/modules/maps/clustering", label: "Clustering" },
          ],
        },
      ],
    },
    {
      label: "PÁGINAS DE AUTORIZACIÓN",
      children: [
        { path: "/auth/login-1", label: "Login 1" },
        { path: "/auth/login-2", label: "Login 2" },
        { path: "/auth/signup-1", label: "Signup 1" },
        { path: "/auth/signup-2", label: "Signup 2" },
        { path: "/auth/forgot-password", label: "Forgot Password" },
        { path: "/auth/reset-password", label: "Reset Password" },
      ],
    },
    {
      label: "FORMULARIOS PASO A PASO",
      children: [
        { path: "/onboarding-1", label: "Onboarding 1" },
        { path: "/onboarding-2", label: "Onboarding 2" },
        { path: "/onboarding-3", label: "Onboarding 3" },
      ],
    },
    {
      label: "PÁGINAS ADICIONALES",
      children: [
        { path: "/extra-pages/about-us", label: "About Us" },
        { path: "/extra-pages/contact-us", label: "Contact Us" },
        { path: "/extra-pages/call-outs", label: "Call Outs" },
        { path: "/extra-pages/pricing-plan", label: "Pricing Plan" },
        { path: "/extra-pages/404", label: "404 Error" },
        { path: "/extra-pages/500", label: "500 Error" },
        { path: "/extra-pages/lock-screen", label: "Lock Screen" },
      ],
    },
    {
      label: "PERFILES DE USUARIO",
      children: [
        { path: "/user/profile-1", label: "Profile 1" },
        { path: "/user/profile-2", label: "Profile 2" },
        { path: "/user/profile-3", label: "Profile 3" },
        { path: "/user/profile-4", label: "Profile 4" },
        { path: "/user/settings/public-profile", label: "Public Profile" },
        { path: "/user/social-wall", label: "Social Wall" },
      ],
    },
    {
      label: "VISTAS DE LISTA",
      children: [
        { path: "/list-views/projects", label: "Projects" },
        { path: "/list-views/users", label: "Users" },
      ],
    },
    {
      label: "VISTAS DE GRID",
      children: [
        { path: "/grid-views/projects", label: "Projects Grid" },
        { path: "/grid-views/users", label: "Users Grid" },
      ],
    },
  ];
}
