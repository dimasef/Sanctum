import { useState, type SyntheticEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../auth/authContext.ts';

type Mode = 'login' | 'register';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong. Please try again.';
}

function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Where to send the user after a successful auth (set by ProtectedRoute).
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === 'login';

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({ email, password, name });
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(isLogin ? 'register' : 'login');
    setError(null);
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

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

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
                helperText={!isLogin ? 'At least 8 characters.' : undefined}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                loading={submitting}
              >
                {isLogin ? 'Sign in' : 'Sign up'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
            {isLogin ? "Don't have an account? " : 'Already registered? '}
            <MuiLink component="button" type="button" onClick={switchMode}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </MuiLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;
