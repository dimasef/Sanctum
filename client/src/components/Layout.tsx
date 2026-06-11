import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link as RouterLink, NavLink, Outlet, useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import { useColorMode } from '../theme/colorMode.ts';
import { useAuth } from '../auth/authContext.ts';

function Layout() {
  const { mode, toggle } = useColorMode();
  const { status, user, logout } = useAuth();
  const navigate = useNavigate();

  const isAuthenticated = status === 'authenticated';

  const navItems = [
    { label: 'Books', to: '/' },
    ...(isAuthenticated ? [{ label: 'My Shelf', to: '/shelf' }] : []),
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              color: 'text.primary',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            <MenuBookIcon color="primary" />
            Sanctum
          </Typography>

          {navItems.map((item) => (
            <Button
              key={item.to}
              component={NavLink}
              to={item.to}
              end={item.to === '/'}
              color="inherit"
              sx={{
                color: 'text.secondary',
                '&.active': { color: 'primary.main', fontWeight: 700 },
              }}
            >
              {item.label}
            </Button>
          ))}

          {isAuthenticated ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mx: 1.5 }}>
                {user?.name}
              </Typography>
              <Button color="inherit" onClick={handleLogout} sx={{ color: 'text.secondary' }}>
                Logout
              </Button>
            </>
          ) : (
            <Button
              component={NavLink}
              to="/login"
              color="inherit"
              sx={{
                color: 'text.secondary',
                '&.active': { color: 'primary.main', fontWeight: 700 },
              }}
            >
              Login
            </Button>
          )}

          <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
            <IconButton onClick={toggle} sx={{ ml: 1 }} color="inherit" aria-label="toggle theme">
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default Layout;
