import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import '@testing-library/jest-dom';

// Mock Language Context (already masked in setup but let's be explicit if needed)
jest.mock('@/context/LanguageContext', () => ({
    useLanguage: () => ({ t: (k) => k, language: 'fr' }),
}));

describe('Navbar Component', () => {
    it('renders login/register links when not authenticated', () => {
        useSession.mockReturnValue({ data: null, status: 'unauthenticated' });
        render(<Navbar />);

        expect(screen.getByText('nav.login')).toBeInTheDocument();
        expect(screen.getByText("S'inscrire")).toBeInTheDocument();
    });

    it('renders dashboard link for STUDENT', () => {
        useSession.mockReturnValue({
            data: { user: { name: 'Test Student', role: 'STUDENT' } },
            status: 'authenticated'
        });
        render(<Navbar />);

        const dashboardLink = screen.getByText('Test Student').closest('a');
        expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    });

    it('renders admin link for ADMIN', () => {
        useSession.mockReturnValue({
            data: { user: { name: 'Test Admin', role: 'ADMIN' } },
            status: 'authenticated'
        });
        render(<Navbar />);

        const dashboardLink = screen.getByText('Test Admin').closest('a');
        expect(dashboardLink).toHaveAttribute('href', '/admin');
    });

    it('renders super admin link for SUPER_ADMIN', () => {
        useSession.mockReturnValue({
            data: { user: { name: 'Super Admin', role: 'SUPER_ADMIN' } },
            status: 'authenticated'
        });
        render(<Navbar />);

        const dashboardLink = screen.getByText('Super Admin').closest('a');
        expect(dashboardLink).toHaveAttribute('href', '/super-admin');
    });

    it('renders marketing link for MARKETING_RECOVERY', () => {
        useSession.mockReturnValue({
            data: { user: { name: 'Marketing User', role: 'MARKETING_RECOVERY' } },
            status: 'authenticated'
        });
        render(<Navbar />);

        const dashboardLink = screen.getByText('Marketing User').closest('a');
        expect(dashboardLink).toHaveAttribute('href', '/admin/marketing');
    });
});
