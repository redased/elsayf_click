'use client';
import { Mail, Phone, MapPin, Globe, Linkedin, Briefcase, GraduationCap, Award, Users, CheckCircle } from 'lucide-react';

export default function ExecutiveRHTemplate({ data, color = '#1e40af', font = 'serif', spacing = 'normal' }) {
  const { personal = {}, skills = [], softSkills = [], tools = [], languages = [], experiences = [], education = [], projects = [], certifications = [], interests = [] } = data || {};

  const fontClass = font === 'sans' ? 'font-sans' : font === 'mono' ? 'font-mono' : 'font-serif';
  const spacingClass = spacing === 'compact' ? 'space-y-3' : spacing === 'relaxed' ? 'space-y-6' : 'space-y-4';

  return (
    <div
      className={`w-full bg-white text-gray-900 ${fontClass} text-[13px] leading-relaxed p-8 min-h-[1120px] flex flex-col justify-between`}
      style={{ '--accent': color }}
    >
      <div>
        {/* En-tête Executive Chic */}
        <header className="border-b-2 pb-6 flex items-center justify-between gap-6" style={{ borderColor: color }}>
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-950 uppercase">
              {personal.firstName} <span style={{ color }}>{personal.lastName}</span>
            </h1>
            <p className="text-base font-medium tracking-wide uppercase text-gray-600">
              {personal.title}
            </p>
            {personal.summary && (
              <p className="text-xs text-gray-700 leading-relaxed max-w-2xl font-sans pt-1">
                {personal.summary}
              </p>
            )}
          </div>

          {/* Photo ou Monogramme */}
          <div className="shrink-0 flex flex-col items-center">
            {personal.avatar ? (
              <img
                src={personal.avatar}
                alt={personal.firstName}
                className="w-24 h-24 rounded-full object-cover border-4 shadow-sm"
                style={{ borderColor: color }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full border-2 flex items-center justify-center text-xl font-bold uppercase shadow-sm"
                style={{ borderColor: color, color: color, backgroundColor: '#f8fafc' }}
              >
                {personal.firstName?.[0]}{personal.lastName?.[0]}
              </div>
            )}
          </div>
        </header>

        {/* Barre de Coordonnées Horizontale */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-gray-200 text-xs font-sans text-gray-600 bg-slate-50 px-3 mt-1 rounded-sm">
          {personal.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={13} style={{ color }} />
              <span>{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={13} style={{ color }} />
              <span>{personal.phone}</span>
            </div>
          )}
          {personal.city && (
            <div className="flex items-center gap-1.5">
              <MapPin size={13} style={{ color }} />
              <span>{personal.city}</span>
            </div>
          )}
          {personal.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin size={13} style={{ color }} />
              <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
            </div>
          )}
          {personal.mobility && (
            <div className="flex items-center gap-1.5">
              <Briefcase size={13} style={{ color }} />
              <span>{personal.mobility}</span>
            </div>
          )}
        </div>

        {/* Corps du CV en 2 colonnes */}
        <div className="grid grid-cols-12 gap-8 mt-5">
          {/* Colonne Principale : Expériences & Projets (8 cols) */}
          <div className={`col-span-8 ${spacingClass}`}>
            {/* Expériences */}
            {experiences?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 pb-1.5 border-b mb-3" style={{ borderColor: color }}>
                  <Briefcase size={16} style={{ color }} />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    Parcours & Expériences Professionnelles
                  </h2>
                </div>

                <div className="space-y-4 font-sans">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-bold text-gray-950">{exp.position}</h3>
                        <span className="text-[11px] font-semibold text-gray-500">
                          {exp.startDate} — {exp.current ? 'Actuel' : exp.endDate}
                        </span>
                      </div>
                      <div className="text-xs font-semibold" style={{ color }}>
                        {exp.company} {exp.city ? `• ${exp.city}` : ''}
                      </div>
                      {exp.description && (
                        <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed pt-1">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formations */}
            {education?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 pb-1.5 border-b mb-3" style={{ borderColor: color }}>
                  <GraduationCap size={16} style={{ color }} />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    Formation & Diplômes
                  </h2>
                </div>

                <div className="space-y-3 font-sans">
                  {education.map((edu) => (
                    <div key={edu.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-xs font-bold text-gray-900">{edu.degree}</h3>
                        <span className="text-[11px] text-gray-500">{edu.year}</span>
                      </div>
                      <div className="text-xs text-gray-600 font-medium">
                        {edu.school} {edu.city ? `• ${edu.city}` : ''}
                      </div>
                      {edu.description && (
                        <p className="text-[11px] text-gray-500">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projets & Réalisations Clés */}
            {projects?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 pb-1.5 border-b mb-3" style={{ borderColor: color }}>
                  <Users size={16} style={{ color }} />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    Missions Notables & Projets Clés
                  </h2>
                </div>

                <div className="space-y-2.5 font-sans">
                  {projects.map((proj) => (
                    <div key={proj.id} className="p-2.5 rounded border border-gray-200 bg-slate-50/70">
                      <h3 className="text-xs font-bold text-gray-900">{proj.title}</h3>
                      <p className="text-[11px] text-gray-700 mt-1">{proj.description}</p>
                      {proj.technologies && (
                        <p className="text-[10px] text-gray-500 mt-1 italic">
                          Outils & Méthodes : {proj.technologies}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Colonne Latérale : Compétences, Outils, Langues (4 cols) */}
          <div className={`col-span-4 ${spacingClass} font-sans`}>
            {/* Domaines d'Expertise */}
            {skills?.length > 0 && (
              <div>
                <div className="pb-1 border-b mb-2.5" style={{ borderColor: color }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Domaines d'Expertise
                  </h2>
                </div>
                <div className="space-y-2">
                  {skills.map((s, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between text-xs font-medium text-gray-800">
                        <span>{s.name}</span>
                        <span className="text-[10px] text-gray-500 font-semibold">{s.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${s.level || 75}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outils & SIRH / Logiciels */}
            {tools?.length > 0 && (
              <div>
                <div className="pb-1 border-b mb-2" style={{ borderColor: color }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Outils & Logiciels
                  </h2>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tools.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-gray-800 border border-slate-300 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Savoir-être / Soft Skills */}
            {softSkills?.length > 0 && (
              <div>
                <div className="pb-1 border-b mb-2" style={{ borderColor: color }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Savoir-Être & Leadership
                  </h2>
                </div>
                <ul className="space-y-1 text-xs text-gray-700">
                  {softSkills.map((sk, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle size={12} style={{ color }} className="shrink-0" />
                      <span>{sk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Langues */}
            {languages?.length > 0 && (
              <div>
                <div className="pb-1 border-b mb-2" style={{ borderColor: color }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Langues
                  </h2>
                </div>
                <div className="space-y-1 text-xs">
                  {languages.map((l, idx) => (
                    <div key={idx} className="flex justify-between text-gray-700">
                      <span className="font-medium text-gray-900">{l.name}</span>
                      <span className="text-gray-500 text-[11px]">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications?.length > 0 && (
              <div>
                <div className="pb-1 border-b mb-2" style={{ borderColor: color }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Certifications
                  </h2>
                </div>
                <ul className="space-y-1 text-[11px] text-gray-700">
                  {certifications.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <Award size={13} style={{ color }} className="shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Centres d'intérêt */}
            {interests?.length > 0 && (
              <div>
                <div className="pb-1 border-b mb-2" style={{ borderColor: color }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Engagements & Intérêts
                  </h2>
                </div>
                <p className="text-xs text-gray-600">
                  {interests.join(' • ')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="pt-4 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-400 font-sans">
        <span>Dossier de candidature • {personal.firstName} {personal.lastName}</span>
        <span>Conçu avec Elsayf E-Learning Studio</span>
      </footer>
    </div>
  );
}
