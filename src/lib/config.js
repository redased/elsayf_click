/**
 * Utility to get the base URL of the application.
 * Uses window.location.origin on the client side for automatic detection,
 * and falls back to environment variables on the server side.
 */
export const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        return window.location.origin;
    }

    // Fallback for server-side
    return process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || 'http://localhost:3000';
};

export const baseUrl = getBaseUrl();
