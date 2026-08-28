
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import PublicCoursePage from '@/app/courses/[slug]/page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

// Mock the 'use' hook for params
// Note: mocking use from 'react' is tricky because it's a direct named export
// Since we are using jest, we will mock the module
jest.mock('react', () => {
    const originalReact = jest.requireActual('react');
    return {
        ...originalReact,
        use: jest.fn((promise) => promise), // Simply return the resolved value (params is technically a promise)
    };
});

// Mock fetch
global.fetch = jest.fn();

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        refresh: jest.fn(),
    }),
}));

const mockCourse = {
    id: 'c1',
    slug: 'test-course',
    title: 'Test Course',
    description: 'Learn testing',
    level: 'Beginner',
    duration: '2h',
    lessons: [{ id: 'l1', title: 'Lesson 1', duration: 10 }],
    isFree: true,
    isInviteOnly: false,
};

describe('PublicCoursePage Enrollment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default mock fetch response for course details
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ course: mockCourse, isEnrolled: false }),
        });
    });

    it('redirects to login if not authenticated when enrolling', async () => {
        useSession.mockReturnValue({ data: null, status: 'unauthenticated' });

        // Pass plain object to simplify 'use' mock interaction
        const params = { slug: 'test-course' };

        render(<PublicCoursePage params={params} />);

        // Wait for course to load
        await waitFor(() => screen.getByText('Test Course'));

        const enrollButtons = screen.getAllByText("S'inscrire gratuitement");
        fireEvent.click(enrollButtons[0]);

        expect(mockPush).toHaveBeenCalledWith('/login?callbackUrl=/courses/test-course');
    });

    it('enrolls directly if authenticated and course is free', async () => {
        useSession.mockReturnValue({
            data: { user: { id: 'u1', name: 'User' } },
            status: 'authenticated'
        });

        const params = { slug: 'test-course' };

        render(<PublicCoursePage params={params} />);

        await waitFor(() => screen.getByText('Test Course'));

        // Mock fetch for enrollment
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Enrolled successfully' }),
        });

        const enrollButtons = screen.getAllByText("S'inscrire gratuitement");
        fireEvent.click(enrollButtons[0]);

        // Should show loading state
        expect(screen.getAllByText('Traitement...')[0]).toBeInTheDocument();

        // Should call enrollment API
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/courses/enroll', expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ courseId: 'c1' })
            }));
        });

        // Should redirect to course dashboard after success
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/dashboard/courses/test-course');
        });
    });

    it('initiates payment if authenticated and course is paid', async () => {
        // Reset mocks for paid course scenario
        jest.clearAllMocks();
        fetch.mockReset(); // Clear the default response fro beforeEach

        const paidCourse = { ...mockCourse, isFree: false, price: 5000 };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ course: paidCourse, isEnrolled: false }),
        });

        useSession.mockReturnValue({
            data: { user: { id: 'u1', name: 'User' } },
            status: 'authenticated'
        });

        const params = { slug: 'test-course' };

        render(<PublicCoursePage params={params} />);

        await waitFor(() => screen.getByText('Test Course'));

        // Mock fetch for payment
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ checkoutUrl: 'https://checkout.url' }),
        });

        // Mock window.location assignment is difficult in JSDOM, so we rely on fetch call verification
        // which implies we reached the logic to get the checkout URL.
        const originalLocation = window.location;

        // We accept that JSDOM might log "Error: Not implemented: navigation"
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        const enrollButton = screen.getByText("S'inscrire à la formation");
        fireEvent.click(enrollButton);

        // Should assume "Inscription..." or similar loading state? Actually the button probably still says "Inscription..." because we reused enrolling state
        // Let's check api call
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/payments/create-checkout', expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ courseId: 'c1' })
            }));
        });

        consoleSpy.mockRestore();
    });
});
