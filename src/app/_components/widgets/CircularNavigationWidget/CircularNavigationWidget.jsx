import React, { useState } from 'react';
import {
  Box,
  Fab,
  Modal,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandLess,
  ExpandMore,
  Dashboard,
  Apps,
  Person,
  Extension,
  Widgets,
  Security,
  Pages,
  ViewList,
  ViewModule,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getWidgetMenus } from '@app/_components/layout/Sidebar/menus-items';

const CircularNavigationWidget = () => {
  const [open, setOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const navigate = useNavigate();
  const { t } = useTranslation();
  const menuItems = getWidgetMenus();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setExpandedMenus({});
  };

  const handleMenuToggle = (menuIndex) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuIndex]: !prev[menuIndex]
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const getMenuIcon = (label) => {
    const iconMap = {
      'HOGAR': <Dashboard />,
      'APLICACIONES': <Apps />,
      'TARJETAS': <ViewModule />,
      'EXTENSIONES': <Extension />,
      'MÓDULOS': <Widgets />,
      'PÁGINAS DE AUTORIZACIÓN': <Security />,
      'PÁGINAS ADICIONALES': <Pages />,
      'USUARIA': <Person />,
      'VISTA DE LA LISTA': <ViewList />,
      'VISTA DE LISTA VGRID': <ViewModule />,
    };
    return iconMap[label] || <MenuIcon />;
  };

  const renderMenuItem = (item, index, isChild = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus[index];

    return (
      <React.Fragment key={index}>
        <ListItem disablePadding sx={{ pl: isChild ? 4 : 0 }}>
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                handleMenuToggle(index);
              } else if (item.path) {
                handleNavigation(item.path);
              }
            }}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {getMenuIcon(item.label)}
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              primaryTypographyProps={{
                fontSize: isChild ? '0.875rem' : '1rem',
                fontWeight: isChild ? 400 : 500,
              }}
            />
            {hasChildren && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child, childIndex) => 
                renderMenuItem(child, `${index}-${childIndex}`, true)
              )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <>
      {/* Floating Action Button with Logo */}
      <Fab
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 80,
          height: 80,
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: 'transparent',
            transform: 'scale(1.05)',
          },
          '&:focus': {
            backgroundColor: 'transparent',
          },
          '&:active': {
            backgroundColor: 'transparent',
          },
          zIndex: 1000,
          padding: 0,
          minHeight: 'unset',
          '&.MuiFab-root': {
            backgroundColor: 'transparent !important',
            boxShadow: 'none !important',
          },
        }}
      >
        <Box
          component="img"
          src="/prueba_de_cierculo.png"
          alt="Sistema SIGP"
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      </Fab>

      {/* Navigation Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          sx={{
            width: '90%',
            maxWidth: 600,
            maxHeight: '80vh',
            overflow: 'hidden',
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component="img"
                src="/prueba_de_cierculo.png"
                alt="Sistema SIGP"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                }}
              />
              <Typography variant="h6" fontWeight="bold">
                Sistema SIGP - Navegación
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{ color: 'inherit' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* Navigation Content */}
          <Box
            sx={{
              p: 2,
              maxHeight: 'calc(80vh - 80px)',
              overflow: 'auto',
            }}
          >
            <List>
              {menuItems.map((menuGroup, index) => 
                renderMenuItem(menuGroup, index)
              )}
            </List>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export { CircularNavigationWidget };