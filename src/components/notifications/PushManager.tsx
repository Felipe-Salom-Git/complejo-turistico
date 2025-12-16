'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BellRing } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function PushManager() {
    const { user } = useAuth();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && (window as any).workbox === undefined) {
            // Check existing subscription
            navigator.serviceWorker.ready.then(reg => {
                setRegistration(reg);
                reg.pushManager.getSubscription().then(sub => {
                    if (sub) setIsSubscribed(true);
                });
            });
        }
    }, []);

    const subscribeUser = async () => {
        if (!registration) return;

        try {
            // 1. Get Public Key from our API
            const response = await fetch('/api/push/vapid');
            const { publicKey } = await response.json();

            const convertedVapidKey = urlBase64ToUint8Array(publicKey);

            // 2. Subscribe via Browser
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });

            // 3. Send Subscription to Backend
            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subscription,
                    userId: user?.staffId || '1' // Fallback for safety/demo
                })
            });

            setIsSubscribed(true);
            console.log('User is subscribed to push');
        } catch (err) {
            console.error('Failed to subscribe the user: ', err);
        }
    };

    if (isSubscribed) {
        // Optionally return nothing or a "Notifications Enabled" badge
        return null;
    }

    // Only show for mucamas
    if (user?.role !== 'mucama' && user?.role !== 'admin') return null;

    return (
        <Button
            onClick={subscribeUser}
            variant="outline"
            size="sm"
            className="gap-2 bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
        >
            <BellRing className="w-4 h-4" />
            Activar Notificaciones
        </Button>
    );
}
