import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Grid,
  Paper,
  IconButton
} from '@mui/material';
import {
  DesignServices,
  Brush,
  Code,
  MoreHoriz,
  Person,
  ArrowForward,
  Schedule,
  Today
} from '@mui/icons-material';
import useAuthenticatedUser from '@app/_hooks/useAuthenticatedUser';
import useCompanyInfo from '@app/_hooks/useCompanyInfo';
import useCompanyMembers from '@app/_hooks/useCompanyMembers';
import WelcomeWidget from '@app/_components/widgets/WelcomeWidget/WelcomeWidget';

// Tema azul de la empresa
const blueTheme = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    gradient: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
  },
  secondary: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#0d47a1'
  },
  accent: {
    orange: '#ff9800',
    green: '#4caf50',
    purple: '#9c27b0',
    cyan: '#00bcd4'
  },
  background: {
    main: '#f5f7fa',
    paper: '#ffffff',
    light: '#fafbfc',
  },
  text: {
    primary: '#2c3e50',
    secondary: '#7b8794',
    light: '#a0aec0',
  }
};

// Componente de tarjeta de proyecto
const ProjectCard = ({ title, projects, icon, color, bgColor }) => (
  <Card 
    sx={{ 
      borderRadius: 3,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
      }
    }}
  >
    <CardContent sx={{ p: 3, textAlign: 'center' }}>
      <Avatar 
        sx={{ 
          width: 80, 
          height: 80, 
          mx: 'auto', 
          mb: 2,
          background: bgColor,
          color: color
        }}
      >
        {icon}
      </Avatar>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600, 
          color: blueTheme.text.primary,
          mb: 1
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          color: blueTheme.text.secondary,
          mb: 2
        }}
      >
        {projects} proyectos
      </Typography>
      <Button 
        variant="outlined" 
        size="small"
        sx={{ 
          borderRadius: 2,
          textTransform: 'none',
          borderColor: blueTheme.primary.light,
          color: blueTheme.primary.main,
          '&:hover': {
            borderColor: blueTheme.primary.main,
            backgroundColor: blueTheme.primary.main,
            color: 'white'
          }
        }}
      >
        Ver Todo
      </Button>
    </CardContent>
  </Card>
);

// Componente de miembro del equipo
const TeamMember = ({ name, role, avatar, initials }) => {
  const getInitials = (fullName) => {
    if (initials) return initials;
    const names = fullName.split(' ');
    return names.length >= 2 
      ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
      : fullName.charAt(0).toUpperCase();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Avatar 
        src={avatar} 
        sx={{ 
          width: 40, 
          height: 40, 
          mr: 2,
          border: `2px solid ${blueTheme.primary.light}`,
          backgroundColor: blueTheme.primary.light,
          color: 'white',
          fontWeight: 600
        }} 
      >
        {!avatar && getInitials(name)}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 600,
            color: blueTheme.text.primary
          }}
        >
          {name}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: blueTheme.text.secondary
          }}
        >
          {role}
        </Typography>
      </Box>
    </Box>
  );
};

// Componente de horario
const ScheduleItem = ({ day, task, time, color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
    <Typography 
      variant="body2" 
      sx={{ 
        width: 40,
        color: blueTheme.text.secondary,
        fontSize: '0.75rem'
      }}
    >
      {day}
    </Typography>
    <Chip 
      label={task}
      size="small"
      sx={{ 
        backgroundColor: color,
        color: 'white',
        fontWeight: 500,
        borderRadius: 2,
        ml: 1
      }}
    />
    {time && (
      <Typography 
        variant="body2" 
        sx={{ 
          ml: 'auto',
          color: blueTheme.text.secondary,
          fontSize: '0.75rem'
        }}
      >
        {time}
      </Typography>
    )}
  </Box>
);

const Dashboard = () => {
  const { userInfo, loading, error, isAuthenticated } = useAuthenticatedUser();
  const { companyInfo, loading: companyLoading, error: companyError } = useCompanyInfo();
  const { members, loading: membersLoading, error: membersError } = useCompanyMembers();

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: blueTheme.background.main 
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: blueTheme.text.primary, mb: 2 }}>
            Cargando dashboard...
          </Typography>
          <Typography variant="body2" sx={{ color: blueTheme.text.secondary }}>
            Por favor espere un momento
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, backgroundColor: blueTheme.background.main, minHeight: '100vh' }}>
        <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" sx={{ color: 'error.main', mb: 2 }}>
              Error de Autenticación
            </Typography>
            <Typography variant="body2" sx={{ color: blueTheme.text.secondary, mb: 3 }}>
              {error.message || 'Ha ocurrido un error al cargar la información del usuario'}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => window.location.reload()}
              sx={{ backgroundColor: blueTheme.primary.main }}
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, backgroundColor: blueTheme.background.main, minHeight: '100vh' }}>
        <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" sx={{ color: blueTheme.text.primary, mb: 2 }}>
              Acceso Requerido
            </Typography>
            <Typography variant="body2" sx={{ color: blueTheme.text.secondary }}>
              Debe iniciar sesión para acceder al dashboard
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        backgroundColor: blueTheme.background.main,
        minHeight: '100vh',
        p: 3
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              color: blueTheme.text.primary,
              mb: 1
            }}
          >
            Mi Dashboard
          </Typography>
        </Box>

        {/* Widget de Bienvenida */}
        <WelcomeWidget 
          userInfo={userInfo} 
          loading={loading} 
          error={error} 
        />

        <Grid container spacing={3}>
          {/* Columna Izquierda */}
          <Grid item xs={12} lg={8}>
            {/* Tarjetas de Proyectos */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <ProjectCard
                  title="Gestión de Préstamos"
                  projects="5"
                  icon={<DesignServices sx={{ fontSize: 40 }} />}
                  color="#ff9800"
                  bgColor="linear-gradient(135deg, #ffcc80 0%, #ff9800 100%)"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <ProjectCard
                  title="Análisis Financiero"
                  projects="1"
                  icon={<Brush sx={{ fontSize: 40 }} />}
                  color={blueTheme.primary.main}
                  bgColor={blueTheme.primary.gradient}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <ProjectCard
                  title="Reportes"
                  projects="3"
                  icon={<Code sx={{ fontSize: 40 }} />}
                  color="#00bcd4"
                  bgColor="linear-gradient(135deg, #4dd0e1 0%, #00bcd4 100%)"
                />
              </Grid>
            </Grid>

            {/* Sección del Estudio */}
            <Card 
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                mb: 4
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mr: 3,
                      background: blueTheme.primary.gradient
                    }}
                  >
                    <img 
                      src="/SIGP Nuevo logo.png" 
                      alt="SIGP" 
                      style={{ width: '60%', height: '60%', objectFit: 'contain' }}
                    />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        color: blueTheme.text.primary,
                        mb: 1
                      }}
                    >
                      {companyLoading ? 'Cargando...' : 
                       companyError ? 'Error al cargar empresa' :
                       (companyInfo?.NombreComercial || companyInfo?.RazonSocial || 'Mi Empresa')}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: blueTheme.text.secondary,
                        mb: 2
                      }}
                    >
                      {companyError ? 'No se pudo cargar la información de la empresa' : 'Sistema enfocado en gestión de préstamos'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 4 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 700,
                            color: companyError ? 'error.main' : blueTheme.text.primary
                          }}
                        >
                          {companyLoading ? '...' : 
                           companyError ? '!' :
                           (companyInfo?.totalClientes || 0)}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: blueTheme.text.secondary
                          }}
                        >
                          Clientes
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 700,
                            color: companyError ? 'error.main' : blueTheme.primary.main
                          }}
                        >
                          {companyLoading ? '...' : 
                           companyError ? '!' :
                           (companyInfo?.totalPrestamos || 0)}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: blueTheme.text.secondary
                          }}
                        >
                          Préstamos
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 700,
                            color: companyError ? 'error.main' : blueTheme.text.primary
                          }}
                        >
                          {companyLoading ? '...' : 
                           companyError ? '!' :
                           (companyInfo?.totalUsuarios || 0)}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: blueTheme.text.secondary
                          }}
                        >
                          Miembros
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <IconButton>
                    <MoreHoriz />
                  </IconButton>
                </Box>

                {/* Miembros del Equipo */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: blueTheme.text.primary,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Person /> Miembros del Equipo
                  <IconButton size="small">
                    <MoreHoriz />
                  </IconButton>
                </Typography>
                
                {membersLoading ? (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" sx={{ color: blueTheme.text.secondary }}>
                      Cargando miembros...
                    </Typography>
                  </Box>
                ) : membersError ? (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" sx={{ color: 'error.main', mb: 1 }}>
                      Error al cargar miembros
                    </Typography>
                    <Typography variant="caption" sx={{ color: blueTheme.text.secondary }}>
                      {membersError.message || 'No se pudo obtener la información del equipo'}
                    </Typography>
                  </Box>
                ) : members.length > 0 ? (
                   members.slice(0, 4).map((member) => (
                     <TeamMember 
                       key={member.id}
                       name={member.name} 
                       role={member.role} 
                       avatar={member.avatar}
                       initials={member.initials}
                     />
                   ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" sx={{ color: blueTheme.text.secondary }}>
                      No hay miembros registrados
                    </Typography>
                  </Box>
                )}
                
                {members.length > 4 && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button 
                      variant="text" 
                      size="small"
                      sx={{ 
                        color: blueTheme.primary.main,
                        textTransform: 'none'
                      }}
                    >
                      Ver todos los miembros ({members.length})
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Columna Derecha */}
          <Grid item xs={12} lg={4}>
            {/* Horarios */}
            <Card 
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                mb: 3
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: blueTheme.text.primary
                    }}
                  >
                    Horarios
                  </Typography>
                  <Button 
                    size="small" 
                    sx={{ 
                      color: blueTheme.primary.main,
                      textTransform: 'none'
                    }}
                  >
                    Ver detalles
                  </Button>
                </Box>
                
                {/* Horas del día */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'].map((time) => (
                    <Typography 
                      key={time}
                      variant="caption" 
                      sx={{ 
                        color: blueTheme.text.secondary,
                        fontSize: '0.7rem'
                      }}
                    >
                      {time}
                    </Typography>
                  ))}
                </Box>

                <ScheduleItem 
                  day="Dom" 
                  task="Revisión app" 
                  color={blueTheme.primary.main}
                />
                <ScheduleItem 
                  day="Lun" 
                  task="Concepto alimentario" 
                  color={blueTheme.accent.orange}
                />
                <ScheduleItem 
                  day="Mar" 
                  task="Diseño web" 
                  color={blueTheme.accent.orange}
                />
                <ScheduleItem 
                  day="Mié" 
                  task="Reporte.io" 
                  color={blueTheme.accent.green}
                />
                <ScheduleItem 
                  day="Jue" 
                  task="Nueva app web" 
                  color={blueTheme.accent.cyan}
                />
              </CardContent>
            </Card>

            {/* Tareas de Hoy */}
            <Card 
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: blueTheme.text.primary,
                    mb: 3
                  }}
                >
                  Hoy
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: 2,
                        backgroundColor: blueTheme.background.light,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          color: blueTheme.text.primary
                        }}
                      >
                        23
                      </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          color: blueTheme.text.primary
                        }}
                      >
                        Concepto app alimentaria
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: blueTheme.text.secondary
                        }}
                      >
                        Gestión de Préstamos • 13:00 pm
                      </Typography>
                    </Box>
                    <IconButton>
                      <ArrowForward />
                    </IconButton>
                  </Box>
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: 2,
                        backgroundColor: blueTheme.background.light,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          color: blueTheme.text.primary
                        }}
                      >
                        25
                      </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          color: blueTheme.text.primary
                        }}
                      >
                        Página de reportes completa
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: blueTheme.text.secondary
                        }}
                      >
                        Análisis Financiero • 10:00 am
                      </Typography>
                    </Box>
                    <IconButton>
                      <ArrowForward />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
