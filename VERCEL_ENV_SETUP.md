# Configuración de Variables de Entorno en Vercel

## Problema Resuelto
La aplicación mostraba una página en blanco con el error:
```
Uncaught Error: supabaseUrl is required.
```

Este error ocurría porque las variables de entorno de Supabase no estaban configuradas en Vercel.

## Variables de Entorno Requeridas

Para que la aplicación funcione correctamente en Vercel, debes configurar las siguientes variables de entorno:

### 1. VITE_SUPABASE_URL
- **Valor**: `https://qanuxayxehaimiknxvlw.supabase.co`
- **Descripción**: URL del proyecto de Supabase

### 2. VITE_SUPABASE_ANON_KEY
- **Valor**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbnV4YXl4ZWhhaW1pa254dmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDgyNzEsImV4cCI6MjA3Mzg4NDI3MX0.DS9pHTo2PpglWCmPWbMMLICxZJeYQZGg2x0B6l4UKAs`
- **Descripción**: Clave anónima de Supabase para acceso público

## Cómo Configurar en Vercel

### Opción 1: Dashboard de Vercel
1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Navega a **Settings** → **Environment Variables**
3. Agrega cada variable:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://qanuxayxehaimiknxvlw.supabase.co`
   - **Environments**: Production, Preview, Development
4. Repite para `VITE_SUPABASE_ANON_KEY`
5. Haz un nuevo deploy o redeploy del proyecto

### Opción 2: Vercel CLI
```bash
vercel env add VITE_SUPABASE_URL
# Pega el valor cuando se solicite

vercel env add VITE_SUPABASE_ANON_KEY
# Pega el valor cuando se solicite

# Redeploy
vercel --prod
```

## Verificación
Después de configurar las variables:
1. La aplicación debería cargar correctamente
2. No debería aparecer el error "supabaseUrl is required"
3. Las funcionalidades de Supabase deberían funcionar

## Archivos Relacionados
- `.env` - Variables para desarrollo local
- `.env.local` - Variables locales con prioridad
- `src/app/_config/supabase.js` - Configuración del cliente Supabase
- `src/integrations/supabase/client.ts` - Cliente TypeScript de Supabase

## Notas Importantes
- Las variables con prefijo `VITE_` son expuestas al cliente (navegador)
- Estas son claves públicas seguras para usar en el frontend
- No incluyas claves privadas o service keys en variables `VITE_`