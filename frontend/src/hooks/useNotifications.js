import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

export const useNotifications = () => {
    const { authHeader } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async () => {
        if (!authHeader.Authorization) return;
        try {
            const { data } = await axios.get('/api/notifications', { headers: authHeader });
            setNotifications(data);
        } catch { }
    }, [authHeader]);

    useEffect(() => {
        fetch();
        const interval = setInterval(fetch, 30000);
        return () => clearInterval(interval);
    }, [fetch]);

    const markRead = async (id) => {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        await axios.put(`/api/notifications/${id}/read`, {}, { headers: authHeader }).catch(() => {});
    };

    const markAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        await axios.put('/api/notifications/read-all', {}, { headers: authHeader }).catch(() => {});
    };

    const refresh = async () => {
        setLoading(true);
        await fetch();
        setLoading(false);
    };

    return { notifications, loading, refresh, markRead, markAllRead };
};
