'use client';

import { useEffect } from 'react';

export default function ChunkErrorAutoReloader() {
  useEffect(() => {
    const handleChunkError = (error) => {
      // Chunk loading errors can be from event.message or event.reason
      const errorMsg = error?.message || error?.reason?.message || '';
      const isChunkError = 
        errorMsg.includes('Failed to load chunk') || 
        errorMsg.includes('Loading chunk') || 
        errorMsg.includes('chunk') ||
        (error?.target && error?.target?.tagName === 'SCRIPT' && error?.target?.src?.includes('/_next/static/chunks/'));

      if (isChunkError) {
        console.warn('[ChunkLoader] Failed chunk load detected, forcing page reload...', errorMsg);
        window.location.reload();
      }
    };

    window.addEventListener('error', handleChunkError, true); // capture phase
    window.addEventListener('unhandledrejection', handleChunkError);

    return () => {
      window.removeEventListener('error', handleChunkError, true);
      window.removeEventListener('unhandledrejection', handleChunkError);
    };
  }, []);

  return null;
}
