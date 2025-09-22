// Database service functions for SIGP
import { supabase } from '../../_config/supabase';

// ==================== USER FUNCTIONS ====================

export const userService = {
  // Get current user profile
  async getCurrentUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'No authenticated user' };

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return { data, error };
  },

  // Update user profile
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  },

  // Get all users (for admin/manager)
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  }
};

// ==================== PROJECT FUNCTIONS ====================

export const projectService = {
  // Get all projects
  async getAllProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        created_by_user:users!projects_created_by_fkey(full_name, email)
      `)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Get project by ID
  async getProjectById(projectId) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        created_by_user:users!projects_created_by_fkey(full_name, email),
        tasks(
          *,
          assigned_user:users!tasks_assigned_to_fkey(full_name, email)
        )
      `)
      .eq('id', projectId)
      .single();

    return { data, error };
  },

  // Create new project
  async createProject(projectData) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...projectData,
        created_by: user.id
      })
      .select()
      .single();

    return { data, error };
  },

  // Update project
  async updateProject(projectId, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    return { data, error };
  },

  // Delete project
  async deleteProject(projectId) {
    const { data, error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    return { data, error };
  }
};

// ==================== TASK FUNCTIONS ====================

export const taskService = {
  // Get tasks by project
  async getTasksByProject(projectId) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_user:users!tasks_assigned_to_fkey(full_name, email),
        created_by_user:users!tasks_created_by_fkey(full_name, email),
        project:projects(name)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Get tasks assigned to current user
  async getMyTasks() {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        project:projects(name),
        created_by_user:users!tasks_created_by_fkey(full_name, email)
      `)
      .eq('assigned_to', user.id)
      .order('due_date', { ascending: true });

    return { data, error };
  },

  // Create new task
  async createTask(taskData) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...taskData,
        created_by: user.id
      })
      .select()
      .single();

    return { data, error };
  },

  // Update task
  async updateTask(taskId, updates) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    return { data, error };
  },

  // Delete task
  async deleteTask(taskId) {
    const { data, error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    return { data, error };
  }
};

// ==================== DOCUMENT FUNCTIONS ====================

export const documentService = {
  // Get documents by project
  async getDocumentsByProject(projectId) {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        uploaded_by_user:users!documents_uploaded_by_fkey(full_name, email)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Upload document
  async uploadDocument(projectId, file, fileName) {
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${projectId}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Save document record
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('documents')
        .insert({
          project_id: projectId,
          name: fileName || file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: user.id
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete document
  async deleteDocument(documentId, filePath) {
    try {
      // Delete from storage
      if (filePath) {
        await supabase.storage
          .from('documents')
          .remove([filePath]);
      }

      // Delete record
      const { data, error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// ==================== DASHBOARD FUNCTIONS ====================

export const dashboardService = {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Get project count
      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      // Get task count
      const { count: taskCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true });

      // Get my tasks count
      const { count: myTaskCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_to', user.id);

      // Get pending tasks count
      const { count: pendingTaskCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      return {
        data: {
          totalProjects: projectCount || 0,
          totalTasks: taskCount || 0,
          myTasks: myTaskCount || 0,
          pendingTasks: pendingTaskCount || 0
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get recent activities
  async getRecentActivities(limit = 10) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        id,
        title,
        status,
        updated_at,
        project:projects(name),
        assigned_user:users!tasks_assigned_to_fkey(full_name)
      `)
      .order('updated_at', { ascending: false })
      .limit(limit);

    return { data, error };
  }
};

// ==================== UTILITY FUNCTIONS ====================

export const dbUtils = {
  // Test database connection
  async testConnection() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);

      return { connected: !error, error };
    } catch (error) {
      return { connected: false, error };
    }
  },

  // Get current user role
  async getCurrentUserRole() {
    const { data: profile } = await userService.getCurrentUserProfile();
    return profile?.role || 'user';
  }
};