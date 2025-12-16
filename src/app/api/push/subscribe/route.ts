import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data/push-subscriptions.json');

export async function POST(request: Request) {
    const { subscription, userId } = await request.json();

    if (!subscription || !userId) {
        return NextResponse.json({ error: 'Missing logic' }, { status: 400 });
    }

    try {
        const fileData = fs.readFileSync(DB_PATH, 'utf-8');
        const subscriptions = JSON.parse(fileData);

        // Remove existing subscription for this user/endpoint to avoid duplicates
        const filtered = subscriptions.filter((s: any) => s.subscription.endpoint !== subscription.endpoint);

        // Add new
        filtered.push({ userId, subscription });

        fs.writeFileSync(DB_PATH, JSON.stringify(filtered, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
