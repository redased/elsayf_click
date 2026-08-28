'use client';
import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    CheckCircle, Clock, BarChart2, BookOpen, PlayCircle, Shield, Users, Code,
    ChevronDown, ChevronUp, Zap, Award, MessageCircle, Star, Lock, Globe,
    Terminal, Brain, TrendingUp, Gift
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '@/context/LanguageContext';

export default function PublicCoursePage({ params }) {
    const { slug } = use(params);
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();
    const { language } = useLanguage();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userEnrollment, setUserEnrollment] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [error, setError] = useState(null);
    const [expandedLesson, setExpandedLesson] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [couponStatus, setCouponStatus] = useState(null); // null | { valid, discount, message }
    const [validatingCoupon, setValidatingCoupon] = useState(false);

    useEffect(() => {
        if (!slug) return;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        fetch(`/api/public/courses/${slug}?lang=${language}`, { signal: controller.signal })
            .then(res => {
                if (!res.ok) throw new Error(res.status === 404 ? 'Cours introuvable' : 'Erreur serveur');
                return res.json();
            })
            .then(data => {
                if (data.error) throw new Error(data.error);
                setCourse({ ...data.course, invitationStatus: data.invitationStatus });
                setUserEnrollment(data.isEnrolled);
                setLoading(false);
            })
            .catch(err => {
                if (err.name === 'AbortError') return;
                setError(err.message);
                setLoading(false);
            })
            .finally(() => clearTimeout(timeoutId));

        return () => { clearTimeout(timeoutId); controller.abort(); };
    }, [slug, language]);

    const handleHeroEnroll = async () => {
        if (sessionStatus === 'loading') return;
        if (sessionStatus === 'unauthenticated' || !session) {
            window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
            return;
        }

        setEnrolling(true);
        try {
            if (course.isFree) {
                const res = await fetch('/api/courses/enroll', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ courseId: course.id })
                });
                if (res.ok) {
                    setUserEnrollment(true);
                    router.push(`/dashboard/courses/${course.slug}`);
                } else {
                    const data = await res.json();
                    alert(data.message || 'Erreur lors de l\'inscription');
                }
            } else {
                const finalPrice = couponStatus?.valid
                    ? Math.round(course.price * (1 - couponStatus.discount / 100))
                    : course.price;

                const res = await fetch('/api/payments/create-checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ courseId: course.id, couponCode: couponStatus?.valid ? couponCode : undefined })
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || 'Erreur de paiement');
                }
                const data = await res.json();
                if (data.checkoutUrl) window.location.href = data.checkoutUrl;
            }
        } catch (err) {
            alert('Une erreur est survenue: ' + err.message);
        } finally {
            setEnrolling(false);
        }
    };

    const validateCoupon = async () => {
        if (!couponCode.trim()) return;
        setValidatingCoupon(true);
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, courseId: course.id })
            });
            const data = await res.json();
            setCouponStatus(data);
        } catch { setCouponStatus({ valid: false, message: 'Erreur de validation' }); }
        finally { setValidatingCoupon(false); }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center text-white flex-col gap-4">
            <div className="w-12 h-12 border-4 border-[#a78bfa] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400">Chargement de la formation...</p>
        </div>
    );

    if (error || !course) return (
        <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center text-white flex-col gap-4">
            <div className="text-red-400 text-2xl font-bold">Formation introuvable</div>
            <p className="text-gray-400">{error}</p>
            <Link href="/courses" className="text-[#a78bfa] hover:underline">← Voir toutes les formations</Link>
        </div>
    );

    const learningOutcomes = Array.isArray(course.learningOutcomes) ? course.learningOutcomes : [];
    const requirements = Array.isArray(course.requirements) ? course.requirements : [];
    const discountedPrice = couponStatus?.valid
        ? Math.round(course.price * (1 - couponStatus.discount / 100))
        : null;

    const levelColors = {
        'Débutant': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
        'Intermédiaire': 'text-amber-400 bg-amber-400/10 border-amber-400/30',
        'Avancé': 'text-red-400 bg-red-400/10 border-red-400/30',
    };
    const levelColor = levelColors[course.level] || 'text-purple-400 bg-purple-400/10 border-purple-400/30';

    return (
        <div className="min-h-screen bg-[#0a0e17] text-white">
            {/* ── HERO ── */}
            <div className="relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f0a1e] via-[#0d1117] to-[#0a0e17]" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#a78bfa]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-20 right-10 w-48 h-48 bg-purple-800/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 container mx-auto px-4 pt-12 pb-16">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                        <Link href="/" className="hover:text-[#a78bfa] transition-colors">Accueil</Link>
                        <span>/</span>
                        <Link href="/courses" className="hover:text-[#a78bfa] transition-colors">Formations</Link>
                        <span>/</span>
                        <span className="text-gray-300">{course.title}</span>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-12 items-start">
                        {/* Left content — 3 cols */}
                        <div className="lg:col-span-3">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-5">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${levelColor}`}>
                                    {course.level}
                                </span>
                                {course.isFree ? (
                                    <span className="text-xs font-bold px-3 py-1 rounded-full border text-emerald-400 bg-emerald-400/10 border-emerald-400/30 flex items-center gap-1">
                                        <Gift size={12} /> Gratuit
                                    </span>
                                ) : (
                                    <span className="text-xs font-bold px-3 py-1 rounded-full border text-amber-400 bg-amber-400/10 border-amber-400/30">
                                        {course.price.toLocaleString()} DZD
                                    </span>
                                )}
                                <span className="text-xs font-bold px-3 py-1 rounded-full border text-blue-400 bg-blue-400/10 border-blue-400/30 flex items-center gap-1">
                                    <Zap size={12} /> IA intégrée
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight bg-gradient-to-r from-white via-purple-100 to-[#a78bfa] bg-clip-text text-transparent">
                                {course.title}
                            </h1>

                            <p className="text-lg text-gray-300 leading-relaxed mb-8">
                                {course.description}
                            </p>

                            {/* Stats row */}
                            <div className="flex flex-wrap gap-6 text-sm mb-8">
                                <div className="flex items-center gap-2 text-gray-300">
                                    <Clock size={16} className="text-[#a78bfa]" />
                                    <span>{course.duration || 'Accès illimité'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <BookOpen size={16} className="text-[#a78bfa]" />
                                    <span>{course.lessons.length} leçon{course.lessons.length !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <BarChart2 size={16} className="text-[#a78bfa]" />
                                    <span>{course.level}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <Globe size={16} className="text-[#a78bfa]" />
                                    <span>Français</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <Award size={16} className="text-[#a78bfa]" />
                                    <span>Attestation incluse</span>
                                </div>
                            </div>

                            {/* CTA for mobile */}
                            <div className="lg:hidden">
                                <EnrollCard
                                    course={course}
                                    userEnrollment={userEnrollment}
                                    enrolling={enrolling}
                                    sessionStatus={sessionStatus}
                                    handleHeroEnroll={handleHeroEnroll}
                                    couponCode={couponCode}
                                    setCouponCode={setCouponCode}
                                    couponStatus={couponStatus}
                                    validatingCoupon={validatingCoupon}
                                    validateCoupon={validateCoupon}
                                    discountedPrice={discountedPrice}
                                    session={session}
                                />
                            </div>

                            {/* Platform features */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                                {[
                                    { icon: Brain, label: 'Assistant IA', desc: 'Posez vos questions en direct' },
                                    { icon: Terminal, label: 'IDE intégré', desc: 'Codez sans installation' },
                                    { icon: Users, label: 'Communauté', desc: 'Forum et Q&A actifs' },
                                    { icon: TrendingUp, label: 'Progression', desc: 'Suivi XP et badges' },
                                    { icon: Award, label: 'Attestation', desc: 'Certifiez vos compétences' },
                                    { icon: PlayCircle, label: 'Sessions live', desc: 'Avec les formateurs' },
                                ].map(({ icon: Icon, label, desc }) => (
                                    <div key={label} className="flex items-start gap-3 bg-white/3 border border-white/8 rounded-xl p-3 hover:border-[#a78bfa]/30 transition-colors">
                                        <div className="mt-0.5 w-8 h-8 rounded-lg bg-[#a78bfa]/15 flex items-center justify-center flex-shrink-0">
                                            <Icon size={15} className="text-[#a78bfa]" />
                                        </div>
                                        <div>
                                            <p className="text-white text-xs font-semibold">{label}</p>
                                            <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right card — 2 cols, desktop only */}
                        <div className="hidden lg:block lg:col-span-2">
                            <div className="sticky top-24">
                                <EnrollCard
                                    course={course}
                                    userEnrollment={userEnrollment}
                                    enrolling={enrolling}
                                    sessionStatus={sessionStatus}
                                    handleHeroEnroll={handleHeroEnroll}
                                    couponCode={couponCode}
                                    setCouponCode={setCouponCode}
                                    couponStatus={couponStatus}
                                    validatingCoupon={validatingCoupon}
                                    validateCoupon={validateCoupon}
                                    discountedPrice={discountedPrice}
                                    session={session}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="container mx-auto px-4 py-16 max-w-6xl">
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-14">

                        {/* Learning outcomes */}
                        {learningOutcomes.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#a78bfa]/20 flex items-center justify-center">
                                        <CheckCircle size={16} className="text-[#a78bfa]" />
                                    </div>
                                    Ce que vous allez apprendre
                                </h2>
                                <div className="bg-gradient-to-br from-[#111827] to-[#0d1117] border border-[#1f2937] rounded-2xl p-6">
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {learningOutcomes.map((outcome, idx) => (
                                            <div key={idx} className="flex items-start gap-3 group">
                                                <div className="w-5 h-5 rounded-full bg-[#a78bfa]/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#a78bfa]/40 transition-colors">
                                                    <CheckCircle size={12} className="text-[#a78bfa]" />
                                                </div>
                                                <span className="text-gray-300 text-sm leading-relaxed">{outcome}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Course content / lessons */}
                        {course.lessons.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                        <BookOpen size={16} className="text-blue-400" />
                                    </div>
                                    Contenu de la formation
                                </h2>
                                <p className="text-gray-500 text-sm mb-5">{course.lessons.length} leçon{course.lessons.length !== 1 ? 's' : ''} · {course.duration}</p>
                                <div className="border border-[#1f2937] rounded-2xl overflow-hidden divide-y divide-[#1f2937]">
                                    {course.lessons.map((lesson, idx) => (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setExpandedLesson(expandedLesson === idx ? null : idx)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors text-left group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-[#1f2937] flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-[#a78bfa]/20 group-hover:text-[#a78bfa] transition-colors flex-shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <p className="text-gray-300 font-medium text-sm">{lesson.title}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                {lesson.duration && (
                                                    <span className="text-xs text-gray-500">{lesson.duration} min</span>
                                                )}
                                                <Lock size={14} className="text-gray-600" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Full description */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                    <MessageCircle size={16} className="text-emerald-400" />
                                </div>
                                Description détaillée
                            </h2>
                            <div className="prose prose-invert prose-sm max-w-none text-gray-300 prose-headings:text-white prose-headings:font-bold prose-h2:text-xl prose-h3:text-base prose-h3:text-[#a78bfa] prose-strong:text-white prose-ul:text-gray-300 prose-li:marker:text-[#a78bfa]">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{course.fullDescription || course.description}</ReactMarkdown>
                            </div>
                        </section>

                        {/* Requirements */}
                        {requirements.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-5 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                        <Star size={16} className="text-amber-400" />
                                    </div>
                                    Pré-requis
                                </h2>
                                <div className="space-y-2">
                                    {requirements.map((req, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-gray-300 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] flex-shrink-0" />
                                            {req}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Desktop sidebar */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24 space-y-4">
                            {/* Included features */}
                            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
                                <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Cette formation comprend</h3>
                                <ul className="space-y-3">
                                    {[
                                        { icon: BookOpen, text: `${course.lessons.length} leçons interactives`, color: 'text-[#a78bfa]' },
                                        { icon: Clock, text: 'Accès illimité à vie', color: 'text-blue-400' },
                                        { icon: Terminal, text: 'IDE en ligne inclus', color: 'text-emerald-400' },
                                        { icon: Brain, text: 'Assistant IA par leçon', color: 'text-purple-400' },
                                        { icon: Award, text: 'Attestation de participation', color: 'text-amber-400' },
                                        { icon: Users, text: 'Accès communauté', color: 'text-sky-400' },
                                    ].map(({ icon: Icon, text, color }) => (
                                        <li key={text} className="flex items-center gap-3 text-sm text-gray-300">
                                            <Icon size={16} className={color} />
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Share / info */}
                            <div className="bg-[#a78bfa]/5 border border-[#a78bfa]/20 rounded-2xl p-5 text-center">
                                <p className="text-xs text-gray-400">
                                    Des questions ? Rejoins notre communauté ou contacte-nous sur{' '}
                                    <a href="https://elsayf.click" className="text-[#a78bfa] hover:underline">elsayf.click</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Enroll Card Component ── */
function EnrollCard({ course, userEnrollment, enrolling, sessionStatus, handleHeroEnroll,
    couponCode, setCouponCode, couponStatus, validatingCoupon, validateCoupon, discountedPrice, session }) {

    return (
        <div className="bg-gradient-to-b from-[#111827] to-[#0d1117] border border-[#1f2937] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Course image / placeholder */}
            <div className="relative">
                {course.image ? (
                    <img src={course.image} alt={course.title} className="w-full h-44 object-cover" />
                ) : (
                    <div className="h-44 bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#a855f7] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #818cf8 0%, transparent 50%), radial-gradient(circle at 80% 50%, #c084fc 0%, transparent 50%)' }} />
                        <div className="text-center relative z-10">
                            <div className="text-6xl mb-2">🐍</div>
                            <p className="text-white/70 text-sm font-medium">Python Intégral</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-5">
                {/* Price */}
                <div className="flex items-baseline gap-3 mb-5">
                    {course.isFree ? (
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-extrabold text-emerald-400">Gratuit</span>
                            <span className="text-xs bg-emerald-400/15 text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">OFFERT</span>
                        </div>
                    ) : discountedPrice ? (
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-white">{discountedPrice.toLocaleString()} DZD</span>
                            <span className="text-lg text-gray-500 line-through">{course.price.toLocaleString()}</span>
                            <span className="text-xs bg-emerald-400/15 text-emerald-400 px-2 py-0.5 rounded-full font-bold">-{couponStatus.discount}%</span>
                        </div>
                    ) : (
                        <span className="text-3xl font-extrabold text-white">{course.price.toLocaleString()} DZD</span>
                    )}
                </div>

                {/* Main CTA */}
                {userEnrollment ? (
                    <a
                        href={`/dashboard/courses/${course.slug}`}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-sm"
                    >
                        <PlayCircle size={18} />
                        Continuer la formation
                    </a>
                ) : course.isInviteOnly ? (
                    <InvitationForm courseId={course.id} userEmail={session?.user?.email} />
                ) : (
                    <button
                        onClick={handleHeroEnroll}
                        disabled={enrolling || sessionStatus === 'loading'}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#a855f7] hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-500/20 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    >
                        {enrolling ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Traitement...
                            </>
                        ) : course.isFree ? (
                            <>
                                <Gift size={18} />
                                S'inscrire gratuitement
                            </>
                        ) : (
                            <>
                                <Zap size={18} />
                                S'inscrire — {course.price.toLocaleString()} DZD
                            </>
                        )}
                    </button>
                )}

                {/* Coupon input for paid courses */}
                {!course.isFree && !userEnrollment && !course.isInviteOnly && (
                    <div className="mt-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Code promo"
                                value={couponCode}
                                onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponStatus(null); }}
                                className="flex-1 bg-[#1f2937] border border-[#374151] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#a78bfa] focus:outline-none"
                            />
                            <button
                                onClick={validateCoupon}
                                disabled={validatingCoupon || !couponCode.trim()}
                                className="px-3 py-2 bg-[#a78bfa]/20 hover:bg-[#a78bfa]/30 text-[#a78bfa] rounded-lg text-sm font-medium disabled:opacity-50 transition-colors whitespace-nowrap"
                            >
                                {validatingCoupon ? '...' : 'Appliquer'}
                            </button>
                        </div>
                        {couponStatus && (
                            <p className={`text-xs mt-1.5 ${couponStatus.valid ? 'text-emerald-400' : 'text-red-400'}`}>
                                {couponStatus.message}
                            </p>
                        )}
                    </div>
                )}

                {/* Guarantees */}
                <div className="mt-5 space-y-2 border-t border-[#1f2937] pt-5">
                    {[
                        { icon: Shield, text: 'Accès immédiat après inscription' },
                        { icon: Clock, text: 'Accès à vie, aucune limite' },
                        { icon: Award, text: 'Attestation de participation' },
                    ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-2 text-xs text-gray-400">
                            <Icon size={13} className="text-[#a78bfa] flex-shrink-0" />
                            {text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ── Invitation Form ── */
function InvitationForm({ courseId, userEmail }) {
    const [email, setEmail] = useState(userEmail || '');
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/invitations/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, courseId })
            });
            const data = await res.json();
            if (res.ok) { setStatus('success'); setMessage('Demande envoyée ! Vous recevrez un email de confirmation.'); }
            else { setStatus('error'); setMessage(data.message || data.error || 'Erreur'); }
        } catch { setStatus('error'); setMessage('Erreur de connexion'); }
    };

    if (status === 'success') return (
        <div className="text-emerald-400 text-center p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-sm">
            <CheckCircle size={24} className="mx-auto mb-2" />
            <p className="font-bold">{message}</p>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-xs text-blue-300">
                <Shield size={14} className="inline mr-1" />
                Formation accessible sur invitation uniquement
            </div>
            <input
                type="email"
                required
                placeholder="Votre adresse email"
                className="bg-[#1f2937] border border-[#374151] rounded-xl px-4 py-3 text-white text-sm focus:border-[#a78bfa] focus:outline-none placeholder-gray-500"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-gradient-to-r from-blue-600 to-[#a78bfa] hover:opacity-90 text-white font-bold py-3 rounded-xl text-sm transition-all"
            >
                {status === 'loading' ? 'Envoi...' : 'Demander un accès'}
            </button>
            {status === 'error' && <p className="text-red-400 text-xs text-center">{message}</p>}
        </form>
    );
}
