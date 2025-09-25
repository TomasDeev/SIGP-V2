import React from 'react';

/**
 * Componente para generar la Hoja de Vida en formato PDF
 * Basado en el diseño de referencia proporcionado
 */
export const HojaDeVidaPDF = ({ 
  clientData, 
  referencias = [], 
  localizaciones = [],
  telefonos = []
}) => {
  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    } catch {
      return 'N/A';
    }
  };

  // Función para calcular edad
  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    } catch {
      return 'N/A';
    }
  };

  // Función para mapear estado civil
  const mapEstadoCivil = (estadoCivil) => {
    const mapping = {
      1: 'Soltero/a',
      2: 'Casado/a',
      3: 'Divorciado/a',
      4: 'Viudo/a',
      5: 'Unión Libre'
    };
    return mapping[estadoCivil] || 'N/A';
  };

  // Obtener dirección principal
  const direccionPrincipal = localizaciones.length > 0 ? localizaciones[0] : null;
  const direccionCompleta = direccionPrincipal 
    ? `${direccionPrincipal.Calle || ''} ${direccionPrincipal.Sector || ''}, ${direccionPrincipal.municipios?.Nombre || ''}, ${direccionPrincipal.municipios?.provincias?.Nombre || ''}`.trim()
    : clientData?.Direccion || 'N/A';

  // Preparar datos de teléfonos
  const telefonosData = [
    ...(clientData?.Telefono ? [{ tipo: 'Móvil', numero: clientData.Telefono, observaciones: '' }] : []),
    ...(clientData?.Celular ? [{ tipo: 'Móvil', numero: clientData.Celular, observaciones: '' }] : []),
    ...(clientData?.TelefonoTrabajo ? [{ tipo: 'Trabajo', numero: clientData.TelefonoTrabajo, observaciones: '' }] : []),
    ...telefonos
  ];

  // Preparar datos de familiares/referencias
  const familiares = referencias.filter(ref => 
    ref.referenciapersonaltipos?.Nombre?.toLowerCase() === 'familiar'
  );

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      fontSize: '12px', 
      lineHeight: '1.4',
      color: '#333',
      maxWidth: '210mm',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#fff'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        borderBottom: '2px solid #333',
        paddingBottom: '10px'
      }}>
        <h1 style={{ 
          margin: '0', 
          fontSize: '18px', 
          fontWeight: 'bold',
          color: '#333'
        }}>
          Hoja de vida de cliente
        </h1>
      </div>

      {/* Contenido principal */}
      <div style={{ 
        border: '1px solid #ccc',
        borderRadius: '5px',
        overflow: 'hidden'
      }}>
        {/* Sección de Fotografía y Datos básicos */}
        <div style={{ 
          display: 'flex',
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #ccc'
        }}>
          {/* Fotografía */}
          <div style={{ 
            width: '120px',
            padding: '15px',
            borderRight: '1px solid #ccc',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: '10px',
              fontSize: '11px'
            }}>
              Fotografía
            </div>
            <div style={{ 
              width: '90px',
              height: '110px',
              border: '1px solid #999',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              overflow: 'hidden'
            }}>
              {clientData?.Foto ? (
                <img 
                  src={clientData.Foto} 
                  alt="Foto del cliente"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                />
              ) : (
                <div style={{ 
                  fontSize: '10px', 
                  color: '#666',
                  textAlign: 'center',
                  padding: '5px'
                }}>
                  Sin fotografía
                </div>
              )}
            </div>
          </div>

          {/* Datos básicos */}
          <div style={{ 
            flex: 1,
            padding: '15px'
          }}>
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: '10px',
              fontSize: '11px'
            }}>
              Datos básicos
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <strong>Nombre:</strong> {`${clientData?.Nombres || ''} ${clientData?.Apellidos || ''}`.trim() || 'N/A'}
              </div>
              <div>
                <strong>Cédula:</strong> {clientData?.Cedula || 'N/A'}
              </div>
              <div>
                <strong>Edad:</strong> {calculateAge(clientData?.FechaNacimiento)}
              </div>
              <div>
                <strong>Estado Civil:</strong> {mapEstadoCivil(clientData?.EstadoCivil)}
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong>Profesión:</strong> {clientData?.Profesion || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Teléfonos */}
        <div style={{ 
          display: 'flex',
          borderBottom: '1px solid #ccc'
        }}>
          <div style={{ 
            width: '120px',
            padding: '15px',
            borderRight: '1px solid #ccc',
            backgroundColor: '#f9f9f9'
          }}>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: '11px'
            }}>
              Teléfonos
            </div>
          </div>
          <div style={{ 
            flex: 1,
            padding: '15px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 120px 1fr', gap: '8px', fontSize: '11px' }}>
              <div style={{ fontWeight: 'bold' }}>Tipo</div>
              <div style={{ fontWeight: 'bold' }}>Número</div>
              <div style={{ fontWeight: 'bold' }}>Observaciones</div>
              
              {telefonosData.length > 0 ? telefonosData.map((tel, index) => (
                <React.Fragment key={index}>
                  <div>{tel.tipo}</div>
                  <div>{tel.numero}</div>
                  <div>{tel.observaciones}</div>
                </React.Fragment>
              )) : (
                <>
                  <div>-</div>
                  <div>Sin teléfonos registrados</div>
                  <div>-</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sección de Direcciones */}
        <div style={{ 
          display: 'flex',
          borderBottom: '1px solid #ccc'
        }}>
          <div style={{ 
            width: '120px',
            padding: '15px',
            borderRight: '1px solid #ccc',
            backgroundColor: '#f9f9f9'
          }}>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: '11px'
            }}>
              Direcciones
            </div>
          </div>
          <div style={{ 
            flex: 1,
            padding: '15px'
          }}>
            <div style={{ fontSize: '11px' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Dirección Principal:</strong>
              </div>
              <div style={{ marginLeft: '10px', lineHeight: '1.5' }}>
                {direccionCompleta}
                {direccionPrincipal?.ReferenciaLocalidad && (
                  <div style={{ marginTop: '5px' }}>
                    <strong>Referencia:</strong> {direccionPrincipal.ReferenciaLocalidad}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Familiares */}
        <div style={{ 
          display: 'flex'
        }}>
          <div style={{ 
            width: '120px',
            padding: '15px',
            borderRight: '1px solid #ccc',
            backgroundColor: '#f9f9f9'
          }}>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: '11px'
            }}>
              Familiares
            </div>
          </div>
          <div style={{ 
            flex: 1,
            padding: '15px'
          }}>
            {familiares.length > 0 ? (
              <div style={{ fontSize: '11px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold' }}>#</div>
                  <div style={{ fontWeight: 'bold' }}>Nombre</div>
                  <div style={{ fontWeight: 'bold' }}>Dirección</div>
                  <div style={{ fontWeight: 'bold' }}>Teléfono</div>
                </div>
                {familiares.map((familiar, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '20px 1fr 1fr 1fr', gap: '8px', marginBottom: '5px' }}>
                    <div>{index + 1}</div>
                    <div>{familiar.Nombre || 'N/A'}</div>
                    <div>{familiar.Direccion || 'N/A'}</div>
                    <div>{familiar.Telefono || 'N/A'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '11px', color: '#666' }}>
                No hay familiares registrados
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Declaración legal */}
      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
        fontSize: '10px',
        lineHeight: '1.5'
      }}>
        <p style={{ margin: '0', textAlign: 'justify' }}>
          Declaro que todos los datos contenidos en este documento corresponden a la más entera fidelidad sobre mi persona y 
          autorizo a esta empresa, sus afiliados, funcionarios y asociados, a consultar mis datos crediticios dentro y fuera de este país.
        </p>
      </div>

      {/* Firma y fecha */}
      <div style={{ 
        marginTop: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ 
          textAlign: 'center',
          borderTop: '1px solid #333',
          paddingTop: '5px',
          width: '200px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold' }}>
            {`${clientData?.Nombres || ''} ${clientData?.Apellidos || ''}`.trim() || 'NOMBRE DEL CLIENTE'}
          </div>
        </div>
        
        <div style={{ fontSize: '10px' }}>
          <strong>Fecha de impresión:</strong> {new Date().toLocaleDateString('es-ES')}
        </div>
      </div>
    </div>
  );
};

export default HojaDeVidaPDF;