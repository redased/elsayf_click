'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCartIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'; // Adjust icons based on your icon set

export default function CoursePaymentButton({ course, userId, isEnrolled }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEnroll = async () => {
        console.log("Handle Enroll - UserID:", userId);
        if (!userId) {
            console.log("Redirecting to login from PaymentButton");
            // Use window.location.href to ensure full reload if router.push behaves oddly with auth state
            window.location.href = `/login?callbackUrl=/courses/${course.slug}`;
            return;
        }

        setLoading(true);
        try {
            if (course.isFree) {
                // Free enrollment logic (handled via API or direct enroll)
                // For now, let's assume we can hit a "free enrollment" endpoint or re-use create-checkout which handles free check?
                // Wait, create-checkout said "Course is free" -> error.
                // We need an endpoint for free enrollment!
                // Let's add that logic to `src/app/api/courses/[slug]/enroll/route.js` or similar.
                // Or simply modify create-checkout to handle free? No, separate it.
                // For now, I will call a hypothetical enroll endpoint for free courses.
                // Actually, let's create it on the fly or use an existing one if available.
                // I'll assume we need to create `/api/courses/enroll` for free courses.

                const res = await fetch('/api/courses/enroll', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ courseId: course.id })
                });

                if (res.ok) {
                    router.refresh();
                } else {
                    alert('Erreur lors de l\'inscription');
                }

            } else {
                // Chargily Payment
                const res = await fetch('/api/payments/create-checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ courseId: course.id })
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || 'Payment init failed');
                }

                const data = await res.json();
                if (data.checkoutUrl) {
                    window.location.href = data.checkoutUrl;
                }
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            alert('Une erreur est survenue: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (isEnrolled) {
        return (
            <button
                onClick={() => router.push(`/dashboard/courses/${course.slug}`)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
                <CheckCircleIcon className="w-5 h-5" />
                Continuer le cours
            </button>
        );
    }

    return (
        <button
            onClick={handleEnroll}
            disabled={loading}
            className={`w-full font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg
        ${course.isFree
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                }
        ${loading ? 'opacity-75 cursor-not-allowed' : ''}
      `}
        >
            {loading ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement...
                </span>
            ) : (
                <>
                    {course.isFree ? (
                        <>
                            S'inscrire gratuitement
                            <ArrowRightIcon className="w-5 h-5" />
                        </>
                    ) : (
                        <>
                            <ShoppingCartIcon className="w-5 h-5" />
                            Acheter pour {course.price} DA
                        </>
                    )}
                </>
            )}
        </button>
    );
}
