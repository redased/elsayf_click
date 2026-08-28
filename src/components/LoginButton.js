'use client';
import { signIn } from "next-auth/react";
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function LoginButton() {
  const searchParams  = useSearchParams();
  const callbackUrl   = searchParams.get('callbackUrl') || '/auth-redirect';
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    signIn("google", { callbackUrl });
  };

  return (
    <>
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-white text-black py-3 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors disabled:opacity-70"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
        )}
        {loading ? 'Connexion…' : 'Continuer avec Google'}
      </button>
    </>
  );
}
