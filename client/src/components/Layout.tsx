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
import sanctumBackground from '../assets/bg.png';

function Layout() {
  const { mode, toggle } = useColorMode();
  const { status, user, logout } = useAuth();
  const navigate = useNavigate();

  const isAuthenticated = status === 'authenticated';

  // The logo links home, so the only persistent nav target is the shelf.
  const navItems = isAuthenticated ? [{ label: 'My Shelf', to: '/shelf' }] : [];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        // The da Vinci "scholar's sanctum" sets the lamp-lit mood; a mode-aware
        // scrim keeps it dim enough for text/cards to stay readable on top.
        backgroundImage: `${
          theme.palette.mode === 'dark'
            ? 'linear-gradient(rgba(15,17,19,0.82), rgba(15,17,19,0.93))'
            : 'linear-gradient(rgba(245,242,234,0.80), rgba(245,242,234,0.92))'
        }, url(${sanctumBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed',
      })}
    >
      <AppBar
        position="sticky"
        sx={(theme) => ({
          backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(20,24,26,0.65)' : 'rgba(255,253,248,0.70)',
          backgroundImage: 'none',
          backdropFilter: 'blur(10px)',
        })}
      >
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
