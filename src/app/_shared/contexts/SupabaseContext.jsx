import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, testSupabaseConnection } from '../../_config/supabase';

// Crear el contexto
const SupabaseContext = createContext({});

// Hook personalizado para usar el contexto
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase debe ser usado dentro de un SupabaseProvider');
  }
  return context;
};

// Proveedor del contexto
export const SupabaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Verificar conexión inicial
    const checkConnection = async () => {
      const connected = await testSupabaseConnection();
      setIsConnected(connected);
    };
    
    checkConnection();

    // Obtener sesión inicial
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error obteniendo sesión:', error);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Evento de autenticación:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Funciones de autenticación
  const signUp = async (email, password, options = {}) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options
      });
      return { data, error };
    } catch (error) {
      console.error('Error en signUp:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } catch (error) {
      console.error('Error en signIn:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Error en signOut:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      return { data, error };
    } catch (error) {
      console.error('Error en resetPassword:', error);
      return { data: null, error };
    }
  };

  // Funciones de base de datos
  const insertData = async (table, data) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select();
      return { data: result, error };
    } catch (error) {
      console.error(`Error insertando en ${table}:`, error);
      return { data: null, error };
    }
  };

  const fetchData = async (table, options = {}) => {
    try {
      let query = supabase.from(table).select(options.select || '*');
      
      if (options.filter) {
        query = query.filter(options.filter.column, options.filter.operator, options.filter.value);
      }
      
      if (options.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending ?? true });
      }
      
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      return { data, error };
    } catch (error) {
      console.error(`Error obteniendo datos de ${table}:`, error);
      return { data: null, error };
    }
  };

  const updateData = async (table, id, updates) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select();
      return { data, error };
    } catch (error) {
      console.error(`Error actualizando ${table}:`, error);
      return { data: null, error };
    }
  };

  const deleteData = async (table, id) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      return { data, error };
    } catch (error) {
      console.error(`Error eliminando de ${table}:`, error);
      return { data: null, error };
    }
  };

  const value = {
    // Cliente de Supabase
    supabase,
    
    // Estado de autenticación
    user,
    session,
    loading,
    isConnected,
    
    // Funciones de autenticación
    signUp,
    signIn,
    signOut,
    resetPassword,
    
    // Funciones de base de datos
    insertData,
    fetchData,
    updateData,
    deleteData,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseContext;