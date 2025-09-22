# SIGP V2 - Sistema Integral de Gestión de Préstamos

## 📋 Descripción

SIGP V2 es un sistema integral de gestión de préstamos desarrollado con tecnologías modernas. Permite la administración completa de empresas, sucursales, clientes y procesos de préstamos con una interfaz intuitiva y profesional.

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 18 + Vite
- **UI Framework**: Material-UI (MUI)
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Internacionalización**: i18next
- **Gestión de Estado**: React Hooks + Context API

## ✨ Características Principales

### 🏢 Gestión de Empresas
- Registro y administración de empresas
- Información legal completa
- Configuración de parámetros financieros

### 🏪 Gestión de Sucursales
- Creación y administración de sucursales
- Vinculación con empresas
- Información de gerentes y contactos
- Configuración de procesos automáticos

### 👥 Gestión de Clientes
- Registro completo de clientes
- Historial de préstamos
- Documentación y verificaciones

### 💰 Gestión de Préstamos
- Creación y seguimiento de préstamos
- Cálculo automático de intereses
- Gestión de pagos y cuotas
- Reportes y estadísticas

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/[tu-usuario]/SIGP-V2.git
   cd SIGP-V2
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   Edita el archivo `.env` con tus credenciales de Supabase.

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Componentes principales de la aplicación
│   ├── _components/        # Componentes reutilizables
│   ├── administration/     # Módulos de administración
│   ├── auth/              # Autenticación
│   └── shared/            # Componentes compartidos
├── @jumbo/                # Framework UI personalizado
├── integrations/          # Integraciones externas
└── i18n.js               # Configuración de idiomas
```

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la build
- `npm run lint` - Ejecutar linter

## 🗄️ Base de Datos

El proyecto utiliza Supabase con las siguientes tablas principales:

- **empresas** - Información de empresas
- **sucursales** - Sucursales por empresa
- **clientes** - Datos de clientes
- **prestamos** - Información de préstamos
- **pagos** - Registro de pagos

## 🌐 Funcionalidades

### Administración
- Dashboard con estadísticas
- Gestión de usuarios y permisos
- Configuración del sistema

### Operaciones
- Procesamiento de préstamos
- Gestión de pagos
- Reportes financieros

### Seguridad
- Autenticación segura
- Control de acceso por roles
- Auditoría de operaciones

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 💻 Desktop
- 📱 Móviles
- 📟 Tablets

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

Para soporte o consultas, contacta al equipo de desarrollo.

---

**SIGP V2** - Sistema Integral de Gestión de Préstamos
