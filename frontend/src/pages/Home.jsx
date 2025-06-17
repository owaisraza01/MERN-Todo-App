import React from "react";
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Container,
    Button,
    Paper,
    useTheme,
    Divider,
    Fade,
} from "@mui/material";
import ThemeToggle from "../components/ThemeToggle";
import Dashboard from "../components/Dashboard";
import TaskTable from "../components/TaskTable";
import logo from "../assests/images/logo.png"; // fixed typo

const Home = ({ mode, setMode }) => {
    const theme = useTheme();

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    // background adapts to theme
    const bgGradient =
        theme.palette.mode === "dark"
            ? "linear-gradient(120deg, #232526 0%, #414345 100%)"
            : "linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)";

    const glassBg =
        theme.palette.mode === "dark"
            ? "rgba(34, 40, 49, 0.92)"
            : "rgba(255,255,255,0.93)";

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: bgGradient,
                fontFamily: 'Inter, "Roboto", Arial, sans-serif',
                transition: "background 0.4s",
            }}
        >
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    background: theme.palette.mode === "dark"
                        ? "rgba(44,62,80, 0.90)"
                        : "rgba(255,255,255,0.88)",
                    backdropFilter: "blur(14px)",
                    borderBottom: theme.palette.mode === "dark"
                        ? "1.5px solid #232526"
                        : "1.5px solid #e3e7ef",
                    boxShadow: "0 2px 12px 0 rgba(33,147,176,0.06)",
                    zIndex: theme.zIndex.drawer + 1,
                }}
            >
                {/* Animated gradient border accent */}
                <Fade in={true} timeout={1200}>
                    <Box
                        sx={{
                            height: 4,
                            width: "100%",
                            background:
                                "linear-gradient(90deg, #6dd5ed 10%, #2193b0 80%, #f093fb 100%)",
                            opacity: 0.9,
                        }}
                    />
                </Fade>
                <Toolbar sx={{ display: "flex", alignItems: "center", gap: 2, minHeight: 70 }}>
                    <Box
                        component="img"
                        src={logo}
                        alt="Master Motors Todo Dashboard Logo"
                        sx={{
                            height: 48,
                            width: 48,
                            borderRadius: 2,
                            mr: 2,
                            boxShadow: theme.palette.mode === "dark"
                                ? "0 2px 10px 0 #0006"
                                : "0 2px 6px 0 rgba(33,147,176,0.13)",
                            background: theme.palette.mode === "dark" ? "#232526" : "#fff",
                            p: 0.5,
                        }}
                    />
                    <Typography
                        variant="h5"
                        color="primary"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 900,
                            letterSpacing: "-1px",
                            fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                            background: "linear-gradient(90deg, #1976d2 10%, #42a5f5 100%)",
                            textShadow: theme.palette.mode === "dark"
                                ? "0 2px 10px #0002"
                                : "0 1px 0 #ffffff60",
                        }}
                    >
                        Master Motors Todo Dashboard
                    </Typography>
                    <ThemeToggle mode={mode} setMode={setMode} />
                    <Button
                        onClick={handleLogout}
                        sx={{
                            ml: 2,
                            px: 2.5,
                            py: 1,
                            borderRadius: 2,
                            fontWeight: 700,
                            fontSize: 15,
                            background: "linear-gradient(90deg, #f093fb 0%, #f5576c 100%)",
                            color: "#fff",
                            textTransform: "none",
                            boxShadow: "0 2px 12px -2px #f5576c44",
                            "&:hover": {
                                background: "linear-gradient(90deg, #f5576c 0%, #f093fb 100%)",
                                color: "#fff",
                                boxShadow: "0 4px 18px -2px #f093fb33",
                            },
                        }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                <Paper
                    elevation={8}
                    sx={{
                        borderRadius: 5,
                        p: { xs: 2, md: 4 },
                        background: glassBg,
                        boxShadow: theme.palette.mode === "dark"
                            ? "0 6px 32px 0 #000c"
                            : "0 8px 32px 0 rgba(31, 38, 135, 0.08)",
                        mb: 4,
                        transition: "background 0.3s, box-shadow 0.3s",
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={800}
                        color="primary"
                        sx={{
                            mb: 2,
                            letterSpacing: -1.5,
                            fontFamily: '"Inter", "Roboto", Arial, sans-serif',
                        }}
                    >
                        Welcome back!
                    </Typography>
                    <Divider sx={{
                        mb: 3,
                        borderColor: theme.palette.primary.light,
                        borderWidth: 2,
                        borderRadius: 2,
                        opacity: 0.25,
                    }} />
                    <Dashboard />
                </Paper>
                <Paper
                    elevation={4}
                    sx={{
                        borderRadius: 5,
                        p: { xs: 2, md: 4 },
                        background: glassBg,
                        boxShadow: theme.palette.mode === "dark"
                            ? "0 4px 18px 0 #000a"
                            : "0 6px 28px 0 rgba(31, 38, 135, 0.07)",
                        transition: "background 0.3s, box-shadow 0.3s",
                    }}
                >
                    <TaskTable />
                </Paper>
            </Container>
        </Box>
    );
};

export default Home;