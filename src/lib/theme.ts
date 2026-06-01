import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff4444',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#0a0a0a',
      paper: '#141414',
    },
    text: {
      primary: '#ffffff',
      secondary: '#999999',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #222222',
        },
      },
    },
  },
});
