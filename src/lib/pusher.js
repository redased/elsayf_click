import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

const PUSHER_APP_ID = process.env.PUSHER_APP_ID;
const NEXT_PUBLIC_PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY;
const PUSHER_SECRET = process.env.PUSHER_SECRET;
const NEXT_PUBLIC_PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu';

// Check if all required Pusher credentials are present
const hasServerCredentials = PUSHER_APP_ID && NEXT_PUBLIC_PUSHER_KEY && PUSHER_SECRET;
const hasClientCredentials = NEXT_PUBLIC_PUSHER_KEY;

// Pusher Server (for API routes)
let pusherServerInstance = null;

if (hasServerCredentials) {
    try {
        pusherServerInstance = new PusherServer({
            appId: PUSHER_APP_ID,
            key: NEXT_PUBLIC_PUSHER_KEY,
            secret: PUSHER_SECRET,
            cluster: NEXT_PUBLIC_PUSHER_CLUSTER,
            useTLS: true,
        });
        console.log('✅ Pusher Server initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Pusher Server:', error);
    }
} else {
    console.warn('⚠️ Pusher Server keys missing. Broadcasting will be disabled.');
}

export const pusherServer = pusherServerInstance;

// Pusher Client (for browser)
let pusherClientInstance = null;

if (hasClientCredentials) {
    try {
        pusherClientInstance = new PusherClient(NEXT_PUBLIC_PUSHER_KEY, {
            cluster: NEXT_PUBLIC_PUSHER_CLUSTER,
            enabledTransports: ['ws', 'wss'],
        });
        console.log('✅ Pusher Client initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Pusher Client:', error);
    }
} else {
    console.warn('⚠️ Pusher Client key missing. Real-time notifications will be disabled.');
}

export const pusherClient = pusherClientInstance;
