import { AppBar, Box, Container, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import { useColorMode } from '../theme/colorMode.ts';
import { useAuth } from '../auth/authContext.ts';
import { Footer, NavItem, Root, Wordmark } from './Layout.styles.ts';

function Layout() {
  const { mode, toggle } = useColorMode();
  const { status, user, logout } = useAuth();
  const navigate = useNavigate();

  const isAuthenticated = status === 'authenticated';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Root>
      <AppBar
        position="sticky"
        sx={(theme) => ({
          backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(24,19,13,0.62)' : 'rgba(252,247,236,0.68)',
          backgroundImage: 'none',
          backdropFilter: 'blur(12px) saturate(1.1)',
          WebkitBackdropFilter: 'blur(12px) saturate(1.1)',
        })}
      >
        <Toolbar sx={{ gap: { xs: 1.5, sm: 3 } }}>
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.25,
              flexGrow: 1,
              textDecoration: 'none',
            }}
          >
            <AutoStoriesIcon sx={{ color: 'gilt.main' }} />
            <Wordmark>Sanctum</Wordmark>
          </Box>

          {isAuthenticated && (
            <NavItem to="/shelf">My Shelf</NavItem>
          )}

          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontStyle: 'italic',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {user?.name}
              </Typography>
              <NavItem
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                end
              >
                Logout
              </NavItem>
            </Box>
          ) : (
            <NavItem to="/login">Login</NavItem>
          )}

          <Tooltip title={mode === 'light' ? 'Dim the lamps' : 'Light the lamps'}>
            <IconButton
              onClick={toggle}
              aria-label="toggle theme"
              sx={{ color: 'gilt.main' }}
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>
        <Outlet />
      </Container>

      <Footer>
        <Typography
          variant="body2"
          sx={{ fontStyle: 'italic', color: 'text.secondary', maxWidth: 460, mx: 'auto' }}
        >
          “A room without books is like a body without a soul.”
        </Typography>
        <Typography
          variant="overline"
          sx={{ color: 'gilt.main', display: 'block', mt: 1 }}
        >
          Cicero
        </Typography>
      </Footer>
    </Root>
  );
}

export default Layout;
