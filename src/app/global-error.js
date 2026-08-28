'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log complet dans la console navigateur
    console.error('[GlobalError]', {
      message: error?.message,
      stack: error?.stack,
      digest: error?.digest,
      time: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      ua: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    });

    // Envoyer au serveur pour monitoring (silencieux, ne bloque pas)
    try {
      fetch('/api/health/client-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error?.message || 'Unknown error',
          stack: error?.stack || '',
          digest: error?.digest || '',
          url: typeof window !== 'undefined' ? window.location.href : '',
          ua: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          time: new Date().toISOString(),
        }),
      }).catch(() => {}); // ignore réseau
    } catch (_) {}
  }, [error]);

  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="fr">
      <body style={{ margin: 0, background: '#0a0e17', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
        }}>
          {/* Icon */}
          <div style={{
            width: 72, height: 72,
            borderRadius: '50%',
            background: 'rgba(239,68,68,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 24,
            fontSize: 36,
          }}>
            ⚠️
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            Une erreur est survenue
          </h1>
          <p style={{ color: '#9ca3af', marginBottom: 32, maxWidth: 400, lineHeight: 1.6 }}>
            L'application a rencontré un problème inattendu.
            Vos données sont en sécurité.
          </p>

          {/* Error detail (dev only or digest) */}
          {(isDev || error?.digest) && (
            <div style={{
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: '16px 20px',
              maxWidth: 560,
              width: '100%',
              textAlign: 'left',
              marginBottom: 24,
            }}>
              <p style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                Détails
              </p>
              {error?.digest && (
                <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#f87171', marginBottom: 4 }}>
                  Digest: {error.digest}
                </p>
              )}
              {isDev && error?.message && (
                <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#f87171', wordBreak: 'break-word' }}>
                  {error.message}
                </p>
              )}
              {isDev && error?.stack && (
                <pre style={{
                  fontFamily: 'monospace', fontSize: 11, color: '#9ca3af',
                  marginTop: 8, overflow: 'auto', maxHeight: 200,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {error.stack}
                </pre>
              )}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => reset()}
              style={{
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '12px 28px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🔄 Réessayer
            </button>
            <button
              onClick={() => { window.location.href = '/'; }}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 12,
                padding: '12px 28px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🏠 Accueil
            </button>
          </div>

          <p style={{ marginTop: 24, fontSize: 12, color: '#4b5563' }}>
            Si le problème persiste, contactez le support.
          </p>
        </div>
      </body>
    </html>
  );
}
