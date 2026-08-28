/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'night-blue': '#0a0e17',
                'light-violet': '#a78bfa',
            },
            boxShadow: {
                'glass-hover': '0 10px 40px rgba(167, 139, 250, 0.2)',
                'neon': '0 0 15px rgba(167, 139, 250, 0.2)',
                'neon-hover': '0 0 25px rgba(167, 139, 250, 0.4)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'fade-in-up': 'fadeInUp 0.8s ease-out',
                'zoom-in': 'zoomIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                zoomIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            }
        },
    },
    plugins: [],
}
