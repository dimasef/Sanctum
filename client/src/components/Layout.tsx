import { useState, type MouseEvent } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useColorMode } from '../theme/colorMode.ts';
import { useAuth } from '../auth/authContext.ts';
import { Footer, NavItem, Root, Wordmark } from './Layout.styles.ts';

function Layout() {
  const { mode, toggle } = useColorMode();
  const { status, user, logout } = useAuth();
  const navigate = useNavigate();

  const isAuthenticated = status === 'authenticated';

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const menuOpen = menuAnchor !== null;
  const closeMenu = () => setMenuAnchor(null);

  const handleLogout = async () => {
    closeMenu();
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

          <NavItem to="/" end>
            Search
          </NavItem>

          {isAuthenticated && <NavItem to="/shelves">My Shelves</NavItem>}

          {isAuthenticated ? (
            <>
              <Box
                onClick={(e: MouseEvent<HTMLElement>) => setMenuAnchor(e.currentTarget)}
                aria-haspopup="true"
                aria-expanded={menuOpen}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                }}
              >
                <Avatar
                  src={user?.avatarUrl ?? undefined}
                  alt={user?.name}
                  sx={{
                    width: 30,
                    height: 30,
                    fontSize: '0.85rem',
                    bgcolor: 'background.default',
                    color: 'gilt.main',
                    border: (theme) => `1.5px solid ${theme.palette.gilt.main}`,
                  }}
                >
                  {user?.name?.[0]?.toUpperCase()}
                </Avatar>
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
                <KeyboardArrowDownIcon
                  sx={{
                    color: 'text.secondary',
                    fontSize: '1.1rem',
                    transition: 'transform 0.2s ease',
                    transform: menuOpen ? 'rotate(180deg)' : 'none',
                  }}
                />
              </Box>
              <Menu
                anchorEl={menuAnchor}
                open={menuOpen}
                onClose={closeMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem component={RouterLink} to="/profile" onClick={closeMenu}>
                  <ListItemIcon>
                    <PersonOutlineIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
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
