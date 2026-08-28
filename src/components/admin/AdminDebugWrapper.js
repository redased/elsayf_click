'use client';
import dynamic from 'next/dynamic';

const AdminDebugButton = dynamic(() => import('./AdminDebugButton'), {
    ssr: false,
    loading: () => null
});

export default function AdminDebugWrapper() {
    return <AdminDebugButton />;
}
