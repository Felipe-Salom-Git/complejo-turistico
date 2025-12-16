import { NextResponse } from 'next/server';
import webpush from 'web-push';
import fs from 'fs';
import path from 'path';
import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } from '@/lib/pushConfig';

// Initialize web-push
webpush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);

const DB_PATH = path.join(process.cwd(), 'data/push-subscriptions.json');

export async function POST(request: Request) {
    const { userId, title, body } = await request.json();

    if (!userId || !title) {
        return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    }

    try {
        const fileData = fs.readFileSync(DB_PATH, 'utf-8');
        const subscriptions = JSON.parse(fileData);

        // Find all subscriptions for the user (user might be logged in on multiple devices)
        const userSubscriptions = subscriptions.filter((s: any) => s.userId === userId);

        if (userSubscriptions.length === 0) {
            return NextResponse.json({ message: 'No subscriptions found for user' });
        }

        const payload = JSON.stringify({ title, body });

        // Send to all devices
        const promises = userSubscriptions.map((sub: any) =>
            webpush.sendNotification(sub.subscription, payload)
                .catch(err => {
                    if (err.statusCode === 410) {
                        // Subscription expired, could delete it here
                        console.log('Subscription expired');
                    } else {
                        console.error('Error sending push', err);
                    }
                })
        );

        await Promise.all(promises);

        return NextResponse.json({ success: true, count: userSubscriptions.length });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
