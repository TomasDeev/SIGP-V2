-- SIGP Database Setup Script
-- Ejecuta este script en el editor SQL de Supabase

-- 1. Crear tabla de usuarios (perfil extendido)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'manager')),
  department TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear tabla de proyectos
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12,2),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear tabla de tareas
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  due_date DATE,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Crear tabla de documentos
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 6. Crear políticas de seguridad

-- Políticas para users
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para projects
CREATE POLICY "Users can view all projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Project creators can update their projects" ON public.projects
  FOR UPDATE USING (auth.uid() = created_by);

-- Políticas para tasks
CREATE POLICY "Users can view all tasks" ON public.tasks
  FOR SELECT USING (true);

CREATE POLICY "Users can create tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Task creators and assignees can update tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = created_by OR auth.uid() = assigned_to);

-- Políticas para documents
CREATE POLICY "Users can view all documents" ON public.documents
  FOR SELECT USING (true);

CREATE POLICY "Users can upload documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- 7. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Crear triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Crear función para crear perfil de usuario automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Crear trigger para nuevos usuarios
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. Insertar datos de ejemplo (opcional)
INSERT INTO public.users (id, email, full_name, role, department) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@sigp.com', 'Administrador SIGP', 'admin', 'IT'),
  ('00000000-0000-0000-0000-000000000002', 'manager@sigp.com', 'Gerente de Proyectos', 'manager', 'Gestión')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.projects (name, description, status, created_by) VALUES
  ('Proyecto Demo', 'Proyecto de demostración del sistema SIGP', 'active', '00000000-0000-0000-0000-000000000001'),
  ('Implementación SIGP', 'Implementación del sistema de gestión de proyectos', 'in_progress', '00000000-0000-0000-0000-000000000002')
ON CONFLICT DO NOTHING;