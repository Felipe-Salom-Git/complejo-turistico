'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
    source: 'servicios' | 'sistema';
}

interface NotificationsContextType {
    notifications: Notification[];
    unreadCount: (userId: string) => number;
    notify: (userId: string, title: string, message: string, source?: 'servicios' | 'sistema') => void;
    markAsRead: (id: string) => void;
    markAllAsRead: (userId: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage
    useEffect(() => {
        const stored = localStorage.getItem('notifications');
        if (stored) {
            setNotifications(JSON.parse(stored));
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('notifications', JSON.stringify(notifications));
        }
    }, [notifications, isLoaded]);

    const notify = (userId: string, title: string, message: string, source: 'servicios' | 'sistema' = 'servicios') => {
        const newNotification: Notification = {
            id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            userId,
            title,
            message,
            date: new Date().toISOString(),
            read: false,
            source
        };
        setNotifications(prev => [newNotification, ...prev]);

        // Future: Here we would trigger Push Notification / WhatsApp API
        console.log(`[PUSH] To ${userId}: ${title} - ${message}`);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = (userId: string) => {
        setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, read: true } : n));
    };

    const unreadCount = (userId: string) => {
        return notifications.filter(n => n.userId === userId && !n.read).length;
    };

    return (
        <NotificationsContext.Provider value={{ notifications, unreadCount, notify, markAsRead, markAllAsRead }}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
}
