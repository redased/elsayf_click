import '@testing-library/jest-dom'
import 'whatwg-fetch'

// Mock next/navigation
jest.mock('next/navigation', () => {
    return {
        useRouter: () => ({
            push: jest.fn(),
            refresh: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            replace: jest.fn(),
        }),
        useSearchParams: () => ({
            get: jest.fn((key) => {
                if (key === 'callbackUrl') return '/dashboard';
                return null;
            }),
        }),
        usePathname: () => '',
    }
})

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
    useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
    signIn: jest.fn(),
    signOut: jest.fn(),
}))

// Mock Language Context
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => ({
        t: (key) => key,
        language: 'fr',
        setLanguage: jest.fn(),
    }),
    LanguageProvider: ({ children }) => <div>{children}</div>
}))

// Mock lucide-react to avoid issues with icon rendering in tests
jest.mock('lucide-react', () => ({
    Menu: () => 'Menu',
    X: () => 'X',
    Code: () => 'Code',
    BookOpen: () => 'BookOpen',
    Users: () => 'Users',
    LogIn: () => 'LogIn',
    LogOut: () => 'LogOut',
    User: () => 'User',
    ChevronDown: () => 'ChevronDown',
    Monitor: () => 'Monitor',
    BarChart3: () => 'BarChart3',
    CheckCircle: () => 'CheckCircle',
    Clock: () => 'Clock',
    BarChart: () => 'BarChart',
    PlayCircle: () => 'PlayCircle',
    Star: () => 'Star',
    Shield: () => 'Shield',
    Globe: () => 'Globe'
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock react-markdown
jest.mock('react-markdown', () => ({ children }) => <>{children}</>);
