'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Award, Download, Calendar, BookOpen } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function AttestationsPage() {
    const { data: session } = useSession();
    const [attestations, setAttestations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchAttestations(); }, []);

    const fetchAttestations = async () => {
        try {
            const res = await fetch('/api/certificates');
            const data = await res.json();
            if (data.certificates) setAttestations(data.certificates);
        } catch {}
        setLoading(false);
    };

    const generatePDF = (att) => {
        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

        // Fond dégradé simulé via rectangles
        doc.setFillColor(10, 14, 23);
        doc.rect(0, 0, 297, 210, 'F');

        // Bordure extérieure violet
        doc.setLineWidth(3);
        doc.setDrawColor(139, 92, 246);
        doc.rect(10, 10, 277, 190);

        // Bordure intérieure fine
        doc.setLineWidth(0.5);
        doc.setDrawColor(99, 102, 241);
        doc.rect(15, 15, 267, 180);

        // Titre principal
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(36);
        doc.setTextColor(255, 255, 255);
        doc.text('ATTESTATION DE PARTICIPATION', 148.5, 48, { align: 'center' });

        // Ligne décorative
        doc.setLineWidth(1);
        doc.setDrawColor(139, 92, 246);
        doc.line(50, 53, 247, 53);

        // Sous-titre
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(13);
        doc.setTextColor(156, 163, 175);
        doc.text('La plateforme Elsayf by StatLabo certifie que', 148.5, 67, { align: 'center' });

        // Nom étudiant
        doc.setFont('times', 'bolditalic');
        doc.setFontSize(32);
        doc.setTextColor(167, 139, 250);
        const name = session?.user?.name || 'L\'Étudiant(e)';
        doc.text(name, 148.5, 88, { align: 'center' });

        // Ligne sous nom
        doc.setLineWidth(0.3);
        doc.setDrawColor(167, 139, 250);
        doc.line(80, 91, 217, 91);

        // Texte participation
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(13);
        doc.setTextColor(156, 163, 175);
        doc.text('a participé et complété avec succès la formation', 148.5, 107, { align: 'center' });

        // Titre du cours
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(99, 102, 241);
        doc.text(att.course.title, 148.5, 122, { align: 'center' });

        // Niveau et durée
        doc.setFontSize(11);
        doc.setTextColor(107, 114, 128);
        doc.text(`Niveau : ${att.course.level}   •   Durée : ${att.course.duration}`, 148.5, 133, { align: 'center' });

        // Date délivrance
        const dateStr = new Date(att.lastAccessed).toLocaleDateString('fr-FR', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        doc.setFontSize(12);
        doc.setTextColor(156, 163, 175);
        doc.text(`Délivrée le ${dateStr}`, 148.5, 148, { align: 'center' });

        // Signatures
        doc.setLineWidth(0.5);
        doc.setDrawColor(99, 102, 241);
        doc.line(45, 170, 115, 170);
        doc.line(182, 170, 252, 170);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(156, 163, 175);
        doc.text('Directeur Pédagogique', 80, 177, { align: 'center' });
        doc.text('StatLabo Platform', 217, 177, { align: 'center' });

        doc.setFont('times', 'italic');
        doc.setFontSize(11);
        doc.setTextColor(139, 92, 246);
        doc.text('Reda Dev', 80, 184, { align: 'center' });
        doc.text('elsayf.statlabo.com', 217, 184, { align: 'center' });

        // Filigrane
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(70);
        doc.setTextColor(255, 255, 255, 0.03);
        doc.text('ELSAYF', 148.5, 130, { align: 'center', angle: -20 });

        doc.save(`Attestation-${att.course.title.replace(/\s+/g, '_')}.pdf`);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-gray-400">
            Chargement des attestations...
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-900/30">
                    <Award size={22} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Mes Attestations</h1>
                    <p className="text-gray-400 text-sm">Télécharge ton attestation de participation en PDF</p>
                </div>
            </div>

            <p className="text-xs text-gray-600 mb-8 ml-16">
                Une attestation est générée automatiquement quand tu complètes 100% d'une formation.
            </p>

            {attestations.length === 0 ? (
                <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-800/60 flex items-center justify-center mx-auto mb-4">
                        <BookOpen size={28} className="text-gray-600" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Aucune attestation pour le moment</h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                        Termine une formation à 100% pour obtenir ton attestation de participation officielle.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {attestations.map((att) => (
                        <div key={att.id} className="bg-[#0d1117] border border-gray-800 hover:border-violet-500/50 rounded-2xl overflow-hidden group transition-colors">
                            <div className="h-1.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
                            <div className="p-5">
                                <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center mb-3">
                                    <Award size={18} className="text-violet-400" />
                                </div>
                                <h3 className="font-bold text-white text-sm mb-1 group-hover:text-violet-400 transition-colors line-clamp-2">
                                    {att.course.title}
                                </h3>
                                <p className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
                                    <Calendar size={11} />
                                    Obtenue le {new Date(att.lastAccessed).toLocaleDateString('fr-FR')}
                                </p>
                                <button
                                    onClick={() => generatePDF(att)}
                                    className="w-full py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                                >
                                    <Download size={14} />
                                    Télécharger PDF
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
