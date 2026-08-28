'use client';
import { MegaphoneIcon, EnvelopeIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

export default function CampaignsPage() {
    return (
        <div className="min-h-screen pt-24 px-8 text-white">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <MegaphoneIcon className="w-8 h-8 text-orange-500" />
                        Campagnes Email & SMS
                    </h1>
                    <p className="text-gray-400 mt-2">Diffusez vos offres à grande échelle.</p>
                </div>
            </div>

            <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-8 mb-8">
                <h2 className="text-xl font-bold mb-6">Créer une Campagne</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Type de Campagne</label>
                            <div className="flex gap-4">
                                <label className="flex-1 cursor-pointer">
                                    <input type="radio" name="type" className="peer sr-only" defaultChecked />
                                    <div className="p-4 rounded-lg border border-gray-600 peer-checked:border-orange-500 peer-checked:bg-orange-500/10 transition-all flex items-center gap-3">
                                        <EnvelopeIcon className="w-6 h-6 text-gray-300 peer-checked:text-orange-500" />
                                        <span>Emailing</span>
                                    </div>
                                </label>
                                <label className="flex-1 cursor-pointer">
                                    <input type="radio" name="type" className="peer sr-only" />
                                    <div className="p-4 rounded-lg border border-gray-600 peer-checked:border-orange-500 peer-checked:bg-orange-500/10 transition-all flex items-center gap-3">
                                        <DevicePhoneMobileIcon className="w-6 h-6 text-gray-300 peer-checked:text-orange-500" />
                                        <span>SMS Blast</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Nom de la campagne</label>
                            <input type="text" className="w-full bg-[#0f172a] border border-gray-600 rounded p-3 text-white" placeholder="Promo Fin d'année" />
                        </div>
                    </div>

                    <div className="flex items-end">
                        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg w-full">
                            <h4 className="text-yellow-400 font-bold mb-2 text-sm">⚠️ Pré-requis</h4>
                            <ul className="text-xs text-yellow-200 space-y-1 list-disc list-inside">
                                <li>Configurez votre serveur SMTP pour l'emailing.</li>
                                <li>Connectez un compte Twilio pour les SMS.</li>
                                <li>Assurez-vous d'avoir le consentement des contacts (GDPR).</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
