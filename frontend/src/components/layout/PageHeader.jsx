import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme/theme';

const PageHeader = ({ index, title, subtitle, actions }) => {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';

    return (
        <Box
            sx={{
                px: { xs: 3, md: 5 },
                pt: { xs: 4, md: 6 },
                pb: { xs: 3, md: 4 },
                borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(10,10,13,0.08)'}`,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Decorative grid lines */}
            <Box
                aria-hidden
                sx={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    backgroundImage: dark
                        ? `linear-gradient(90deg, rgba(212,255,58,0.04) 1px, transparent 1px)`
                        : `linear-gradient(90deg, rgba(10,10,13,0.025) 1px, transparent 1px)`,
                    backgroundSize: '80px 100%',
                    opacity: 0.6,
                }}
            />

            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    {/* Section index */}
                    <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                        <Box
                            sx={{
                                fontFamily: tokens.fontMono,
                                fontSize: 11,
                                fontWeight: 600,
                                color: tokens.accent,
                                letterSpacing: '0.08em',
                                px: 0.75,
                                py: 0.25,
                                border: `1px solid ${tokens.accent}`,
                                lineHeight: 1,
                            }}
                        >
                            {index}
                        </Box>
                        <Box sx={{ height: 1, width: 24, bgcolor: dark ? 'rgba(255,255,255,0.16)' : 'rgba(10,10,13,0.18)' }} />
                        <Typography
                            sx={{
                                fontFamily: tokens.fontMono,
                                fontSize: 11,
                                fontWeight: 500,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                color: 'text.secondary',
                            }}
                        >
                            TaskFlow / {title}
                        </Typography>
                    </Box>

                    {/* Page title */}
                    <Typography
                        component="h1"
                        sx={{
                            fontFamily: tokens.fontDisplay,
                            fontWeight: 700,
                            fontSize: { xs: 40, sm: 52, md: 64 },
                            letterSpacing: '-0.04em',
                            lineHeight: 0.95,
                            color: 'text.primary',
                        }}
                    >
                        {title}
                        <Box component="span" sx={{ color: tokens.accent, ml: 0.5 }}>.</Box>
                    </Typography>

                    {subtitle && (
                        <Typography
                            mt={1.25}
                            sx={{
                                fontSize: 14,
                                color: 'text.secondary',
                                maxWidth: 520,
                                lineHeight: 1.5,
                            }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                {actions && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                        {actions}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default PageHeader;
