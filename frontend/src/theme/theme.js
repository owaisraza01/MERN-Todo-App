import { createTheme } from '@mui/material/styles';

const ACCENT = '#6366f1';
const ACCENT_DARK = '#4f46e5';

const getTheme = (mode) => {
    const dark = mode === 'dark';

    return createTheme({
        palette: {
            mode,
            primary: { main: ACCENT, light: '#818cf8', dark: ACCENT_DARK, contrastText: '#fff' },
            secondary: { main: '#8b5cf6' },
            background: {
                default: dark ? '#070c18' : '#f4f6fa',
                paper:   dark ? '#0d1424' : '#ffffff',
            },
            text: {
                primary:   dark ? '#e2e8f0' : '#0f172a',
                secondary: dark ? '#64748b' : '#64748b',
                disabled:  dark ? '#374151' : '#94a3b8',
            },
            divider: dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)',
            success: { main: '#10b981', light: '#34d399', dark: '#059669' },
            warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
            error:   { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
            info:    { main: '#06b6d4', light: '#22d3ee', dark: '#0891b2' },
            action: {
                hover:    dark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)',
                selected: dark ? 'rgba(99,102,241,0.12)'  : 'rgba(99,102,241,0.08)',
            },
        },

        typography: {
            fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
            h1: { fontWeight: 700, letterSpacing: '-0.03em' },
            h2: { fontWeight: 700, letterSpacing: '-0.025em' },
            h3: { fontWeight: 700, letterSpacing: '-0.02em' },
            h4: { fontWeight: 700, letterSpacing: '-0.015em' },
            h5: { fontWeight: 600, letterSpacing: '-0.01em' },
            h6: { fontWeight: 600, letterSpacing: '-0.01em' },
            subtitle1: { fontWeight: 500 },
            subtitle2: { fontWeight: 600, letterSpacing: '0.01em' },
            body1: { fontSize: 14, lineHeight: 1.6 },
            body2: { fontSize: 13, lineHeight: 1.5 },
            caption: { fontSize: 11, fontWeight: 500, letterSpacing: '0.05em' },
        },

        shape: { borderRadius: 6 },

        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    '*': { boxSizing: 'border-box' },
                    'html, body': { scrollBehavior: 'smooth' },
                    '::-webkit-scrollbar': { width: 6, height: 6 },
                    '::-webkit-scrollbar-track': { background: 'transparent' },
                    '::-webkit-scrollbar-thumb': {
                        background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)',
                        borderRadius: 3,
                    },
                },
            },

            MuiButton: {
                defaultProps: { disableElevation: true, disableRipple: false },
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: 14,
                        borderRadius: 6,
                        letterSpacing: 0,
                        boxShadow: 'none !important',
                        transition: 'background 0.15s, border-color 0.15s, opacity 0.15s',
                    },
                    contained: {
                        background: ACCENT,
                        '&:hover': { background: ACCENT_DARK },
                    },
                    outlined: {
                        borderColor: dark ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.18)',
                        '&:hover': {
                            borderColor: dark ? 'rgba(255,255,255,0.28)' : 'rgba(15,23,42,0.32)',
                            background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.03)',
                        },
                    },
                    text: {
                        '&:hover': { background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.05)' },
                    },
                },
            },

            MuiIconButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 6,
                        transition: 'background 0.15s',
                        '&:hover': { background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)' },
                    },
                },
            },

            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        borderRadius: 8,
                        boxShadow: dark
                            ? '0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)'
                            : '0 0 0 1px rgba(15,23,42,0.08), 0 4px 24px rgba(15,23,42,0.06)',
                    },
                },
            },

            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        borderRadius: 8,
                        boxShadow: 'none',
                        border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)'}`,
                    },
                },
            },

            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 4,
                        fontWeight: 500,
                        fontSize: 11,
                        letterSpacing: '0.02em',
                        height: 22,
                    },
                    label: { paddingLeft: 8, paddingRight: 8 },
                },
            },

            MuiTextField: {
                defaultProps: { variant: 'outlined', size: 'small' },
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 6,
                            fontSize: 14,
                            background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.02)',
                            '& fieldset': {
                                borderColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.14)',
                                transition: 'border-color 0.15s',
                            },
                            '&:hover fieldset': {
                                borderColor: dark ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.28)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: ACCENT,
                                borderWidth: 1,
                            },
                        },
                        '& .MuiInputLabel-root': {
                            fontSize: 13,
                            '&.Mui-focused': { color: ACCENT },
                        },
                    },
                },
            },

            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: 10,
                        backgroundImage: 'none',
                        background: dark ? '#0d1424' : '#ffffff',
                        border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
                        boxShadow: dark
                            ? '0 24px 64px rgba(0,0,0,0.6)'
                            : '0 24px 64px rgba(15,23,42,0.14)',
                    },
                },
            },

            MuiTableCell: {
                styleOverrides: {
                    head: {
                        fontWeight: 600,
                        fontSize: 11,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: '#64748b',
                        background: 'transparent',
                        borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)'}`,
                        padding: '10px 16px',
                    },
                    body: {
                        fontSize: 13,
                        fontWeight: 400,
                        padding: '12px 16px',
                        borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.05)'}`,
                    },
                },
            },

            MuiTableRow: {
                styleOverrides: {
                    root: {
                        transition: 'background 0.12s',
                        '&.MuiTableRow-hover:hover': {
                            background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.025)',
                        },
                        '&.Mui-selected': {
                            background: dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.06)',
                            '&:hover': {
                                background: dark ? 'rgba(99,102,241,0.14)' : 'rgba(99,102,241,0.09)',
                            },
                        },
                    },
                },
            },

            MuiLinearProgress: {
                styleOverrides: {
                    root: { borderRadius: 2, height: 4 },
                    bar: { borderRadius: 2 },
                },
            },

            MuiDivider: {
                styleOverrides: {
                    root: {
                        borderColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)',
                    },
                },
            },

            MuiPopover: {
                styleOverrides: {
                    paper: {
                        borderRadius: 8,
                        border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.1)'}`,
                        boxShadow: dark
                            ? '0 16px 48px rgba(0,0,0,0.5)'
                            : '0 16px 48px rgba(15,23,42,0.12)',
                    },
                },
            },

            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 6,
                        '&.Mui-selected': {
                            background: dark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)',
                        },
                    },
                },
            },

            MuiCheckbox: {
                styleOverrides: {
                    root: {
                        color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.2)',
                        '&.Mui-checked': { color: ACCENT },
                        padding: 6,
                    },
                },
            },

            MuiToggleButton: {
                styleOverrides: {
                    root: {
                        border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.14)'}`,
                        borderRadius: '6px !important',
                        color: dark ? '#64748b' : '#64748b',
                        '&.Mui-selected': {
                            background: dark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)',
                            color: ACCENT,
                            borderColor: `${ACCENT}40`,
                        },
                    },
                },
            },

            MuiBadge: {
                styleOverrides: {
                    badge: { fontSize: 10, minWidth: 16, height: 16, padding: '0 4px' },
                },
            },
        },
    });
};

export default getTheme;
