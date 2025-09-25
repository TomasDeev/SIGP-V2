import React, { useEffect, useState } from 'react';
import { supabase, testSupabaseConnection } from '../_config/supabase';

const DebugInfo = () => {
  const [debugInfo, setDebugInfo] = useState({
    environment: 'unknown',
    supabaseUrl: 'unknown',
    supabaseKeyExists: false,
    connectionTest: 'pending',
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    const gatherDebugInfo = async () => {
      try {
        // Información del entorno
        const environment = import.meta.env.MODE || 'unknown';
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'not-set';
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        console.log('🔍 Debug Info:');
        console.log('Environment:', environment);
        console.log('Supabase URL:', supabaseUrl);
        console.log('Supabase Key exists:', !!supabaseKey);
        console.log('User Agent:', navigator.userAgent);
        console.log('Location:', window.location.href);

        // Probar conexión con Supabase
        const connectionResult = await testSupabaseConnection();
        
        const info = {
          environment,
          supabaseUrl,
          supabaseKeyExists: !!supabaseKey,
          connectionTest: connectionResult ? 'success' : 'failed',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          location: window.location.href
        };

        setDebugInfo(info);
        console.log('📊 Complete Debug Info:', info);

      } catch (error) {
        console.error('❌ Error gathering debug info:', error);
        setDebugInfo(prev => ({
          ...prev,
          connectionTest: 'error',
          error: error.message
        }));
      }
    };

    gatherDebugInfo();
  }, []);

  // Solo mostrar en desarrollo o si hay un parámetro de debug
  const shouldShow = import.meta.env.MODE === 'development' || 
                    new URLSearchParams(window.location.search).has('debug');

  if (!shouldShow) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>Debug Info</h4>
      <div>Environment: {debugInfo.environment}</div>
      <div>Supabase URL: {debugInfo.supabaseUrl}</div>
      <div>Supabase Key: {debugInfo.supabaseKeyExists ? '✓' : '✗'}</div>
      <div>Connection: {debugInfo.connectionTest}</div>
      <div>Time: {debugInfo.timestamp}</div>
      {debugInfo.error && <div style={{color: 'red'}}>Error: {debugInfo.error}</div>}
    </div>
  );
};

export default DebugInfo;