import { useState, type SyntheticEvent } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

type Mode = 'login' | 'register';

function LoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isLogin = mode === 'login';

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    // Auth wiring (login/register mutations + token storage) comes in the next step.
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, sm: 6 } }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h4" gutterBottom>
            {isLogin ? 'Welcome back' : 'Create account'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {isLogin ? 'Sign in to reach your shelves.' : 'Start building your personal library.'}
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {!isLogin && (
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                />
              )}
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />
              <Button type="submit" variant="contained" size="large" fullWidth>
                {isLogin ? 'Sign in' : 'Sign up'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
            {isLogin ? "Don't have an account? " : 'Already registered? '}
            <MuiLink
              component="button"
              type="button"
              onClick={() => setMode(isLogin ? 'register' : 'login')}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </MuiLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;
