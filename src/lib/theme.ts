import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff3d1f',
    },
    secondary: {
      main: '#f4ff52',
    },
    background: {
      default: '#080607',
      paper: '#151010',
    },
    text: {
      primary: '#fff7ef',
      secondary: '#b89f98',
    },
    divider: '#31201d',
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
          textTransform: 'uppercase',
          fontWeight: 900,
          borderRadius: 0,
          letterSpacing: 0,
          boxShadow: 'none',
        },
        contained: {
          backgroundColor: '#ff3d1f',
          color: '#080607',
          border: '1px solid #ff3d1f',
          '&:hover': {
            backgroundColor: '#f4ff52',
            borderColor: '#f4ff52',
            boxShadow: '6px 6px 0 #000000',
          },
        },
        outlined: {
          borderColor: '#5a332d',
          color: '#fff7ef',
          '&:hover': {
            borderColor: '#ff3d1f',
            backgroundColor: 'rgba(255, 61, 31, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #31201d',
          borderRadius: 0,
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
          borderColor: '#31201d',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            backgroundColor: '#100b0b',
            '& fieldset': {
              borderColor: '#5a332d',
            },
            '&:hover fieldset': {
              borderColor: '#ff3d1f',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#f4ff52',
              borderWidth: 1,
            },
          },
          '& .MuiInputBase-input': {
            color: '#fff7ef',
            fontFamily: 'var(--font-inter), "Helvetica Neue", "Arial", sans-serif',
          },
          '& .MuiFormHelperText-root': {
            color: '#b89f98',
          },
        },
      },
    },
  },
});
