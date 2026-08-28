'use client';
import { RocketLaunchIcon, ClockIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function SocialBotPage() {
    return (
        <div className="min-h-screen pt-24 px-8 text-white">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <RocketLaunchIcon className="w-8 h-8 text-purple-500" />
                        Social Bot Automation
                    </h1>
                    <p className="text-gray-400 mt-2">Pilotez vos réseaux sociaux en pilote automatique.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Bot Instance Card */}
                <div className="bg-[#1e293b] border border-purple-500/30 p-6 rounded-xl relative overflow-hidden group hover:border-purple-500/60 transition-all">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl group-hover:bg-purple-500/30 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-600/20 rounded-lg text-blue-400">
                            <ChatBubbleLeftRightIcon className="w-6 h-6" />
                        </div>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-bold uppercase">Actif</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Facebook Commenter</h3>
                    <p className="text-sm text-gray-400 mb-6">Répond automatiquement aux commentaires contenant "Prix" ou "Infos" sur vos posts.</p>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Réponses 24h</span>
                            <span className="text-white font-mono">142</span>
                        </div>
                        <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-purple-500 w-[70%] h-full rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* New Bot Card */}
                <div className="border border-dashed border-gray-700 p-6 rounded-xl flex flex-col items-center justify-center text-center hover:bg-white/5 transition cursor-pointer group">
                    <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-4xl text-gray-500 font-light">+</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-300">Ajouter un Bot</h3>
                    <p className="text-sm text-gray-500 mt-2">Instagram Auto-DM, LinkedIn Connector...</p>
                </div>
            </div>
        </div>
    );
}
