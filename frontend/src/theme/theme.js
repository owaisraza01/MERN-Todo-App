import { createTheme } from '@mui/material/styles';

const ACCENT = '#d4ff3a';
const ACCENT_DEEP = '#b8e62c';
const ACCENT_INK = '#0a0a0d';

const FONT_SANS = '"Inter", system-ui, -apple-system, sans-serif';
const FONT_DISPLAY = '"Space Grotesk", "Inter", system-ui, sans-serif';
const FONT_MONO = '"JetBrains Mono", "SF Mono", Consolas, monospace';

export const tokens = {
    accent: ACCENT,
    accentDeep: ACCENT_DEEP,
    accentInk: ACCENT_INK,
    fontDisplay: FONT_DISPLAY,
    fontMono: FONT_MONO,
    fontSans: FONT_SANS,
};

const getTheme = (mode) => {
    const dark = mode === 'dark';

    const bg     = dark ? '#0a0a0d' : '#f7f7f5';
    const paper  = dark ? '#111114' : '#ffffff';
    const elev   = dark ? '#18181d' : '#fafaf7';
    const border = dark ? 'rgba(255,255,255,0.07)' : 'rgba(10,10,13,0.08)';
    const borderStrong = dark ? 'rgba(255,255,255,0.14)' : 'rgba(10,10,13,0.16)';
    const textPrimary   = dark ? '#f5f5f4' : '#0a0a0d';
    const textSecondary = dark ? '#71717a' : '#52525b';
    const textDisabled  = dark ? '#3f3f46' : '#a1a1aa';

    return createTheme({
        palette: {
            mode,
            primary: { main: ACCENT, light: '#e0ff66', dark: ACCENT_DEEP, contrastText: ACCENT_INK },
            secondary: { main: '#a78bfa' },
            background: { default: bg, paper },
            text: { primary: textPrimary, secondary: textSecondary, disabled: textDisabled },
            divider: border,
            success: { main: '#22c55e', light: '#4ade80', dark: '#16a34a' },
            warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
            error:   { main: '#f43f5e', light: '#fb7185', dark: '#e11d48' },
            info:    { main: '#06b6d4', light: '#22d3ee', dark: '#0891b2' },
            action: {
                hover:    dark ? 'rgba(255,255,255,0.04)' : 'rgba(10,10,13,0.04)',
                selected: dark ? 'rgba(212,255,58,0.08)'  : 'rgba(184,230,44,0.12)',
            },
        },

        typography: {
            fontFamily: FONT_SANS,
            h1: { fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 },
            h2: { fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.02 },
            h3: { fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 },
            h4: { fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1 },
            h5: { fontFamily: FONT_DISPLAY, fontWeight: 600, letterSpacing: '-0.015em' },
            h6: { fontFamily: FONT_DISPLAY, fontWeight: 600, letterSpacing: '-0.01em' },
            subtitle1: { fontWeight: 500 },
            subtitle2: { fontWeight: 600, letterSpacing: '0.01em' },
            body1: { fontSize: 14, lineHeight: 1.6 },
            body2: { fontSize: 13, lineHeight: 1.5 },
            caption: { fontFamily: FONT_MONO, fontSize: 10.5, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' },
        },

        shape: { borderRadius: 2 },

        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    '*': { boxSizing: 'border-box' },
                    'html, body': { scrollBehavior: 'smooth' },
                    body: {
                        backgroundColor: bg,
                        backgroundImage: dark
                            ? `radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)`
                            : `radial-gradient(rgba(10,10,13,0.04) 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                        backgroundAttachment: 'fixed',
                    },
                    '::selection': { background: ACCENT, color: ACCENT_INK },
                    '::-webkit-scrollbar': { width: 8, height: 8 },
                    '::-webkit-scrollbar-track': { background: 'transparent' },
                    '::-webkit-scrollbar-thumb': {
                        background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
                        borderRadius: 0,
                        '&:hover': { background: dark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.2)' },
                    },
                },
            },

            MuiButton: {
                defaultProps: { disableElevation: true, disableRipple: false },
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: 13,
                        borderRadius: 2,
                        letterSpacing: 0,
                        boxShadow: 'none !important',
                        transition: 'all 0.12s ease',
                        padding: '6px 14px',
                    },
                    contained: {
                        background: ACCENT,
                        color: ACCENT_INK,
                        '&:hover': { background: ACCENT_DEEP },
                        '&.Mui-disabled': { background: dark ? '#27272a' : '#e4e4e7', color: textDisabled },
                    },
                    outlined: {
                        borderColor: borderStrong,
                        color: textPrimary,
                        '&:hover': {
                            borderColor: textPrimary,
                            background: 'transparent',
                        },
                    },
                    text: {
                        color: textSecondary,
                        '&:hover': { background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(10,10,13,0.04)', color: textPrimary },
                    },
                },
            },

            MuiIconButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 2,
                        transition: 'all 0.12s',
                        '&:hover': { background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(10,10,13,0.05)' },
                    },
                },
            },

            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        borderRadius: 2,
                        boxShadow: 'none',
                    },
                },
            },

            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        borderRadius: 2,
                        boxShadow: 'none',
                        border: `1px solid ${border}`,
                        background: paper,
                    },
                },
            },

            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 2,
                        fontFamily: FONT_MONO,
                        fontWeight: 500,
                        fontSize: 10.5,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
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
                            borderRadius: 2,
                            fontSize: 13.5,
                            background: 'transparent',
                            '& fieldset': {
                                borderColor: border,
                                transition: 'border-color 0.12s',
                            },
                            '&:hover fieldset': { borderColor: borderStrong },
                            '&.Mui-focused fieldset': { borderColor: ACCENT, borderWidth: 1 },
                        },
                        '& .MuiInputLabel-root': {
                            fontSize: 13,
                            '&.Mui-focused': { color: textPrimary },
                        },
                    },
                },
            },

            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: 2,
                        backgroundImage: 'none',
                        background: paper,
                        border: `1px solid ${border}`,
                        boxShadow: dark
                            ? '0 32px 80px rgba(0,0,0,0.7)'
                            : '0 32px 80px rgba(10,10,13,0.18)',
                    },
                },
            },

            MuiTableCell: {
                styleOverrides: {
                    head: {
                        fontFamily: FONT_MONO,
                        fontWeight: 500,
                        fontSize: 10.5,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: textSecondary,
                        background: 'transparent',
                        borderBottom: `1px solid ${border}`,
                        padding: '10px 16px',
                    },
                    body: {
                        fontSize: 13.5,
                        fontWeight: 400,
                        padding: '14px 16px',
                        borderBottom: `1px solid ${border}`,
                    },
                },
            },

            MuiTableRow: {
                styleOverrides: {
                    root: {
                        transition: 'background 0.1s',
                        '&.MuiTableRow-hover:hover': {
                            background: dark ? 'rgba(255,255,255,0.025)' : 'rgba(10,10,13,0.02)',
                        },
                        '&.Mui-selected': {
                            background: dark ? 'rgba(212,255,58,0.06)' : 'rgba(184,230,44,0.1)',
                            '&:hover': {
                                background: dark ? 'rgba(212,255,58,0.09)' : 'rgba(184,230,44,0.14)',
                            },
                        },
                    },
                },
            },

            MuiLinearProgress: {
                styleOverrides: {
                    root: {
                        borderRadius: 0,
                        height: 3,
                        backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(10,10,13,0.06)',
                    },
                    bar: { borderRadius: 0, backgroundColor: ACCENT },
                },
            },

            MuiDivider: {
                styleOverrides: { root: { borderColor: border } },
            },

            MuiPopover: {
                styleOverrides: {
                    paper: {
                        borderRadius: 2,
                        border: `1px solid ${border}`,
                        boxShadow: dark
                            ? '0 16px 48px rgba(0,0,0,0.6)'
                            : '0 16px 48px rgba(10,10,13,0.14)',
                    },
                },
            },

            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 2,
                        '&.Mui-selected': { background: dark ? 'rgba(212,255,58,0.08)' : 'rgba(184,230,44,0.12)' },
                    },
                },
            },

            MuiCheckbox: {
                styleOverrides: {
                    root: {
                        color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(10,10,13,0.2)',
                        '&.Mui-checked': { color: ACCENT },
                        padding: 6,
                    },
                },
            },

            MuiToggleButtonGroup: {
                styleOverrides: {
                    root: {
                        border: `1px solid ${border}`,
                        borderRadius: 2,
                        padding: 2,
                        gap: 2,
                    },
                    grouped: { border: '0 !important', borderRadius: '2px !important' },
                },
            },

            MuiToggleButton: {
                styleOverrides: {
                    root: {
                        border: 'none',
                        borderRadius: 2,
                        color: textSecondary,
                        padding: '4px 10px',
                        '&.Mui-selected': {
                            background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(10,10,13,0.06)',
                            color: textPrimary,
                            '&:hover': { background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(10,10,13,0.08)' },
                        },
                    },
                },
            },

            MuiBadge: {
                styleOverrides: {
                    badge: {
                        fontFamily: FONT_MONO,
                        fontSize: 9,
                        fontWeight: 600,
                        minWidth: 14,
                        height: 14,
                        padding: '0 3px',
                    },
                },
            },

            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        background: dark ? '#27272a' : '#0a0a0d',
                        color: '#fafafa',
                        fontFamily: FONT_MONO,
                        fontSize: 10.5,
                        fontWeight: 500,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        borderRadius: 2,
                        padding: '4px 8px',
                    },
                },
            },

            MuiAvatar: {
                styleOverrides: {
                    root: { borderRadius: 2, fontFamily: FONT_MONO, fontWeight: 600 },
                },
            },

            MuiPagination: {
                styleOverrides: {
                    ul: { gap: 4 },
                },
            },

            MuiPaginationItem: {
                styleOverrides: {
                    root: {
                        borderRadius: 2,
                        fontFamily: FONT_MONO,
                        fontSize: 12,
                        minWidth: 28,
                        height: 28,
                        '&.Mui-selected': {
                            background: ACCENT,
                            color: ACCENT_INK,
                            '&:hover': { background: ACCENT_DEEP },
                        },
                    },
                },
            },
        },
    });
};

export default getTheme;
