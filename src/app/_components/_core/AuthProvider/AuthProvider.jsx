import { eraseCookie, getCookie, setCookie } from "@jumbo/utilities/cookies";
import React from "react";
import { AuthContext } from "./AuthContext";
import { supabase } from "@app/_config/supabase";

const iAuthService = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user && data.session) {
      return {
        token: data.session.access_token,
        email: data.user.email,
        user: data.user,
        session: data.session
      };
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    throw new Error(error.message || "Authentication failed");
  }
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await iAuthService(email, password);
      if (response.token) {
        const stringify = {
          token: response.token,
          email: response.email,
          user: response.user,
          session: response.session,
        };
        const authUserSr = encodeURIComponent(JSON.stringify(stringify));
        setCookie("auth-user", authUserSr, 1);
        setIsAuthenticated(true);
        return response;
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error; // Re-throw para que el componente pueda manejar el error
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      eraseCookie("auth-user");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed", error);
      // Aún así limpiamos la sesión local
      eraseCookie("auth-user");
      setIsAuthenticated(false);
    }
  };

  React.useEffect(() => {
    // Verificar sesión de Supabase al cargar
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
          // Actualizar cookie con solo los datos esenciales (optimizado para tamaño)
          const stringify = {
            token: session.access_token,
            email: session.user.email,
            userId: session.user.id,
            // Solo metadatos esenciales del usuario
            userMeta: {
              nombres: session.user.user_metadata?.nombres,
              apellidos: session.user.user_metadata?.apellidos,
              nombre_usuario: session.user.user_metadata?.nombre_usuario,
              activo: session.user.user_metadata?.activo
            },
            expiresAt: session.expires_at
          };
          const authUserSr = encodeURIComponent(JSON.stringify(stringify));
          setCookie("auth-user", authUserSr, 1);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error verificando sesión:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
        const stringify = {
          token: session.access_token,
          email: session.user.email,
          userId: session.user.id,
          // Solo metadatos esenciales del usuario
          userMeta: {
            nombres: session.user.user_metadata?.nombres,
            apellidos: session.user.user_metadata?.apellidos,
            nombre_usuario: session.user.user_metadata?.nombre_usuario,
            activo: session.user.user_metadata?.activo
          },
          expiresAt: session.expires_at
        };
        const authUserSr = encodeURIComponent(JSON.stringify(stringify));
        setCookie("auth-user", authUserSr, 1);
      } else {
        setIsAuthenticated(false);
        eraseCookie("auth-user");
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
