import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff6b2b',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#0a0a0a',
      paper: '#111111',
    },
    text: {
      primary: '#ffffff',
      secondary: '#888888',
    },
    divider: '#1e1e1e',
  },
  typography: {
    fontFamily: 'var(--font-inter), "Helvetica Neue", "Arial", sans-serif',
    h1: {
      fontFamily: 'var(--font-instrument-serif), Georgia, serif',
      fontWeight: 400,
    },
    h2: {
      fontFamily: 'var(--font-instrument-serif), Georgia, serif',
      fontWeight: 400,
    },
    h3: {
      fontFamily: 'var(--font-instrument-serif), Georgia, serif',
      fontWeight: 400,
    },
    overline: {
      letterSpacing: '0.12em',
      fontWeight: 700,
      fontSize: '0.7rem',
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 2,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #1e1e1e',
          borderRadius: 2,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#1e1e1e',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        },
      },
    },
  },
});
