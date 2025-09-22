# SIGP - Sistema Integrado de Gestión de Préstamos

Un dashboard administrativo moderno construido con React, Material-UI y Vite, que incluye un widget de navegación circular personalizado.

## 🚀 Características Principales

- **Dashboard Administrativo Completo**: Interfaz moderna y responsiva
- **Widget de Navegación Circular**: Acceso rápido a todas las páginas del sistema
- **Material-UI**: Componentes de interfaz de usuario modernos
- **Vite**: Build tool rápido y eficiente
- **React Router**: Navegación SPA fluida
- **Internacionalización**: Soporte para múltiples idiomas
- **Supabase Ready**: Configuración preparada para base de datos

## 🎯 Widget de Navegación Circular

El proyecto incluye un widget de navegación circular único que:
- Muestra el logo "prueba_de_cierculo" sin fondo
- Proporciona acceso rápido a todas las páginas del menú
- Se posiciona en la esquina inferior derecha
- Incluye efectos hover suaves
- Organiza las páginas en categorías colapsibles

## 🛠️ Tecnologías Utilizadas

- **React 18**: Framework de JavaScript
- **Material-UI (MUI)**: Biblioteca de componentes
- **Vite**: Build tool y dev server
- **React Router**: Enrutamiento
- **i18next**: Internacionalización
- **Supabase**: Base de datos (opcional)

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/TomasDeev/hello-world-solo-page.git
   cd hello-world-solo-page
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   Edita el archivo `.env` con tus configuraciones.

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador:**
   ```
   http://localhost:5173
   ```

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 🌐 Integración con Lovable

Este proyecto está optimizado para trabajar con Lovable:

1. **Conecta tu repositorio** con Lovable
2. **Configura las variables de entorno** en Lovable
3. **Despliega automáticamente** con cada push

### Variables de Entorno para Lovable

```env
VITE_APP_TITLE=SIGP Sistema de Préstamos
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_key
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── _components/
│   │   └── widgets/
│   │       └── CircularNavigationWidget/
│   ├── _layouts/
│   ├── _routes/
│   ├── _shared/
│   ├── _themes/
│   └── pages/
├── @sigp/
│   ├── components/
│   ├── shared/
│   └── utilities/
└── @assets/
```

## 🎨 Personalización

### Modificar el Logo del Widget Circular
1. Reemplaza `public/prueba_de_cierculo.png` con tu logo
2. El logo se ajustará automáticamente al círculo

### Agregar Nuevas Páginas
1. Crea el componente en `src/app/pages/`
2. Agrega la ruta en `src/app/_routes/`
3. El widget circular detectará automáticamente la nueva página

## 🚀 Despliegue

### Con Lovable (Recomendado)
1. Conecta este repositorio con Lovable
2. Configura las variables de entorno
3. El despliegue será automático

### Manual
```bash
npm run build
# Sube la carpeta 'dist' a tu servidor
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:
- Abre un issue en GitHub
- Contacta al equipo de desarrollo

---

**Desarrollado con ❤️ **
