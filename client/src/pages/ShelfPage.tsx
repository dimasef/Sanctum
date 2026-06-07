import { Box, Button, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function ShelfPage() {
  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        My Shelf
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Books you want to read, are reading, and have finished.
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 6,
          textAlign: 'center',
          borderStyle: 'dashed',
        }}
      >
        <Typography sx={{ fontSize: 56, mb: 1 }}>📖</Typography>
        <Typography variant="h6" gutterBottom>
          Your shelf is empty
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Browse the catalogue and add books to start tracking your reading.
        </Typography>
        <Button variant="contained" component={RouterLink} to="/">
          Discover books
        </Button>
      </Paper>
    </Box>
  );
}

export default ShelfPage;
