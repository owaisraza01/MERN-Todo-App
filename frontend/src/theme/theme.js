import { createTheme } from '@mui/material/styles';

const getTheme = (mode) =>
    createTheme({
        palette: {
            mode,
            primary: {
                main: mode === 'dark' ? '#6dd5ed' : '#1976d2',
            },
            secondary: {
                main: mode === 'dark' ? '#ff6a00' : '#f50057',
            },
            background: {
                default: mode === 'dark' ? '#232526' : '#f4f8fb',
                paper: mode === 'dark' ? '#2c2c32' : '#ffffff',
            },
            success: { main: '#00b894' },
            warning: { main: '#fdcb6e' },
            error: { main: '#e17055' },
            info: { main: '#0984e3' },
        },
        typography: {
            fontFamily: [
                'Inter',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'sans-serif',
            ].join(','),
            fontWeightBold: 700,
            h1: { fontWeight: 900 },
        },
        shape: {
            borderRadius: 12,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 8,
                        boxShadow: 'none',
                        letterSpacing: 0.1,
                        paddingLeft: 18,
                        paddingRight: 18,
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: 20,
                        boxShadow: mode === 'dark'
                            ? '0 4px 32px 0 rgba(33,147,176,0.10)'
                            : '0 10px 40px 0 rgba(33,147,176,0.12)',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 20,
                        boxShadow: mode === 'dark'
                            ? '0 4px 32px 0 rgba(33,147,176,0.13)'
                            : '0 10px 40px 0 rgba(33,147,176,0.11)',
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    head: {
                        fontWeight: 800,
                        fontSize: 15,
                        background: mode === 'dark' ? '#232526' : '#e0eafc',
                        color: mode === 'dark' ? '#e5eaf3' : '#1976d2',
                    },
                    body: {
                        fontWeight: 500,
                        fontSize: 15,
                    },
                },
            },
        },
    });

export default getTheme;