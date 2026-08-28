'use client';
import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, Users, MessageSquare } from 'lucide-react';

export default function JitsiMeet({ roomId, displayName, email, onLeave }) {
    const containerRef = useRef(null);
    const apiRef = useRef(null);
    const [status, setStatus] = useState('connecting'); // connecting | ready | error
    const [participants, setParticipants] = useState(0);
    const [audioMuted, setAudioMuted] = useState(false);
    const [videoMuted, setVideoMuted] = useState(false);

    useEffect(() => {
        let timeoutId;

        // Charger le script Jitsi external API
        const existingScript = document.getElementById('jitsi-api-script');
        if (existingScript) {
            // Script déjà présent, attendre qu'il soit chargé
            if (window.JitsiMeetExternalAPI) {
                initJitsi();
            } else {
                // Timeout si le script ne charge pas dans les 30s
                timeoutId = setTimeout(() => {
                    if (!window.JitsiMeetExternalAPI) {
                        console.error('[Jitsi] Timeout lors du chargement (30s)');
                        setStatus('error');
                    }
                }, 30000);
                existingScript.onload = () => {
                    clearTimeout(timeoutId);
                    initJitsi();
                };
            }
            return;
        }

        const script = document.createElement('script');
        script.id = 'jitsi-api-script';
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;

        // Timeout de 30 secondes pour le chargement
        timeoutId = setTimeout(() => {
            if (!window.JitsiMeetExternalAPI) {
                console.error('[Jitsi] Timeout lors du chargement du script (30s)');
                setStatus('error');
            }
        }, 30000);

        script.onload = () => {
            clearTimeout(timeoutId);
            initJitsi();
        };

        script.onerror = () => {
            clearTimeout(timeoutId);
            console.error('[Jitsi] Erreur lors du chargement du script');
            setStatus('error');
        };

        document.body.appendChild(script);

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (apiRef.current) {
                apiRef.current.dispose();
                apiRef.current = null;
            }
        };
    }, [roomId]);

    const initJitsi = () => {
        if (!containerRef.current) {
            console.warn('[Jitsi] Container ref not ready');
            return;
        }
        if (!window.JitsiMeetExternalAPI) {
            console.warn('[Jitsi] JitsiMeetExternalAPI not loaded');
            return;
        }
        if (apiRef.current) {
            console.log('[Jitsi] Disposing previous instance');
            apiRef.current.dispose();
        }

        console.log('[Jitsi] Initializing with room:', roomId);

        const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
            roomName: `elsayf-${roomId}`,
            parentNode: containerRef.current,
            width: '100%',
            height: '100%',
            userInfo: { displayName: displayName || 'Participant', email: email || '' },
            configOverwrite: {
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                prejoinPageEnabled: false,
                defaultLanguage: 'fr',
            },
            interfaceConfigOverwrite: {
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                SHOW_BRAND_WATERMARK: false,
                BRAND_WATERMARK_LINK: '',
                SHOW_POWERED_BY: false,
                GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
                DISPLAY_WELCOME_FOOTER: false,
                APP_NAME: 'Elsayf Live',
                NATIVE_APP_NAME: 'Elsayf Live',
                DEFAULT_BACKGROUND: '#0a0e17',
                DEFAULT_LOCAL_DISPLAY_NAME: displayName || 'Moi',
                TOOLBAR_ALWAYS_VISIBLE: false,
                FILM_STRIP_MAX_HEIGHT: 120,
            },
            lang: 'fr',
        });

        apiRef.current = api;

        api.addEventListener('videoConferenceJoined', () => {
            console.log('[Jitsi] Conference joined successfully');
            setStatus('ready');
        });

        api.addEventListener('videoConferenceLeft', () => {
            console.log('[Jitsi] Conference left');
            if (onLeave) onLeave();
        });

        api.addEventListener('participantJoined', () => {
            api.getNumberOfParticipants().then(n => {
                console.log('[Jitsi] Participants:', n);
                setParticipants(n);
            }).catch(() => {});
        });

        api.addEventListener('participantLeft', () => {
            api.getNumberOfParticipants().then(n => setParticipants(n)).catch(() => {});
        });

        api.addEventListener('audioMuteStatusChanged', ({ muted }) => setAudioMuted(muted));
        api.addEventListener('videoMuteStatusChanged', ({ muted }) => setVideoMuted(muted));

        console.log('[Jitsi] All event listeners registered');
    };

    const toggleAudio = () => apiRef.current?.executeCommand('toggleAudio');
    const toggleVideo = () => apiRef.current?.executeCommand('toggleVideo');
    const hangup     = () => { apiRef.current?.executeCommand('hangup'); if (onLeave) onLeave(); };
    const shareScreen = () => apiRef.current?.executeCommand('toggleShareScreen');
    const retryConnection = () => {
        setStatus('connecting');
        // Supprimer le script existant et recharger
        const existingScript = document.getElementById('jitsi-api-script');
        if (existingScript) existingScript.remove();
        window.location.reload();
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0e17]">
            {/* Barre de statut */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#0d1117] border-b border-gray-800/60 shrink-0">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'ready' ? 'bg-green-400 animate-pulse' : status === 'error' ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'}`} />
                    <span className="text-xs text-gray-400 font-mono">
                        {status === 'ready' ? 'En direct' : status === 'error' ? 'Erreur connexion' : 'Connexion...'}
                    </span>
                    {status === 'ready' && participants > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-500 ml-2">
                            <Users size={11} /> {participants} participant{participants > 1 ? 's' : ''}
                        </span>
                    )}
                </div>
                <span className="text-xs text-gray-600 font-mono">elsayf-{roomId}</span>
            </div>

            {/* Conteneur Jitsi */}
            <div className="flex-1 relative overflow-hidden">
                {status === 'connecting' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0e17] z-10">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-400 text-sm">Connexion à la salle live...</p>
                            <p className="text-gray-600 text-xs">meet.jit.si • Chiffrement de bout en bout</p>
                        </div>
                    </div>
                )}
                {status === 'error' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0e17] z-10">
                        <div className="text-center max-w-md px-4">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">⚠️</span>
                            </div>
                            <p className="text-red-400 mb-2 font-semibold">Impossible de charger Jitsi Meet</p>
                            <p className="text-gray-500 text-sm mb-4">Le serveur meet.jit.si ne répond pas ou votre connexion internet est lente.</p>
                            <button
                                onClick={retryConnection}
                                className="px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
                            >
                                Réessayer
                            </button>
                        </div>
                    </div>
                )}
                <div ref={containerRef} className="w-full h-full" />
            </div>

            {/* Contrôles custom */}
            <div className="flex items-center justify-center gap-3 px-4 py-3 bg-[#0d1117] border-t border-gray-800/60 shrink-0">
                <button
                    onClick={toggleAudio}
                    className={`p-3 rounded-full transition-all ${audioMuted ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                    title={audioMuted ? 'Activer micro' : 'Couper micro'}
                >
                    {audioMuted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button
                    onClick={toggleVideo}
                    className={`p-3 rounded-full transition-all ${videoMuted ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                    title={videoMuted ? 'Activer caméra' : 'Couper caméra'}
                >
                    {videoMuted ? <VideoOff size={18} /> : <Video size={18} />}
                </button>
                <button
                    onClick={shareScreen}
                    className="p-3 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
                    title="Partager l'écran"
                >
                    <Monitor size={18} />
                </button>
                <button
                    onClick={hangup}
                    className="p-3 rounded-full bg-red-600 hover:bg-red-500 text-white transition-all shadow-lg shadow-red-900/30"
                    title="Quitter"
                >
                    <PhoneOff size={18} />
                </button>
            </div>
        </div>
    );
}
