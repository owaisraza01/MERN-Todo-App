import React, { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar, { SIDEBAR_WIDTH } from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Dashboard from '../components/Dashboard';
import Tasks from './Tasks';
import Analytics from './Analytics';
import Profile from './Profile';
import { useAuth } from '../hooks/useAuth';

const Home = ({ mode, setMode }) => {
    const [activeView, setActiveView] = useState('dashboard');
    const [mobileOpen, setMobileOpen] = useState(false);
    const { logout } = useAuth();

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Sidebar
                mode={mode}
                setMode={setMode}
                onLogout={logout}
                activeView={activeView}
                setActiveView={setActiveView}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />
            <Box
                component="main"
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    ml: { md: `${SIDEBAR_WIDTH}px` },
                }}
            >
                <Topbar onMenuClick={() => setMobileOpen(true)} />
                <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>
                    {activeView === 'dashboard' && <Dashboard />}
                    {activeView === 'tasks' && <Tasks />}
                    {activeView === 'analytics' && <Analytics />}
                    {activeView === 'profile' && <Profile />}
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
