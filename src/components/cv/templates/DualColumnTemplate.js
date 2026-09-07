'use client';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Briefcase, GraduationCap, Award, CheckCircle2, Star } from 'lucide-react';

export default function DualColumnTemplate({ data, color = '#059669', font = 'sans', spacing = 'normal' }) {
  const { personal = {}, skills = [], softSkills = [], tools = [], languages = [], experiences = [], education = [], projects = [], certifications = [], interests = [] } = data || {};

  const fontClass = font === 'serif' ? 'font-serif' : font === 'mono' ? 'font-mono' : 'font-sans';
  const spacingClass = spacing === 'compact' ? 'space-y-3' : spacing === 'relaxed' ? 'space-y-6' : 'space-y-4';

  return (
    <div
      className={`w-full bg-white text-gray-800 ${fontClass} text-[13px] leading-relaxed p-6 min-h-[297mm] h-full flex flex-col justify-between`}
      style={{ '--accent': color }}
    >
      <div>
        {/* Modern Compact Header with Accent Bar */}
        <header className="flex items-center justify-between gap-6 pb-5 border-b-2" style={{ borderColor: color }}>
          <div className="space-y-1.5 flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 uppercase">
              {personal.firstName} <span style={{ color }}>{personal.lastName}</span>
            </h1>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600">
              {personal.title}
            </h2>
            {personal.summary && (
              <p className="text-xs text-gray-600 text-justify leading-relaxed max-w-2xl pt-1">
                {personal.summary}
              </p>
            )}
          </div>

          {personal.avatar ? (
            <img
              src={personal.avatar}
              alt={personal.firstName}
              className="w-24 h-24 rounded-xl object-cover ring-2 shadow shrink-0"
              style={{ ringColor: color }}
            />
          ) : (
            <div
              className="w-20 h-20 rounded-xl flex items-center justify-center text-white text-2xl font-bold uppercase shadow shrink-0"
              style={{ backgroundColor: color }}
            >
              {personal.firstName?.[0]}{personal.lastName?.[0]}
            </div>
          )}
        </header>

        {/* 2 Balanced Columns (35% sidebar, 65% main) */}
        <div className="grid grid-cols-12 gap-6 mt-5">
          {/* Left Column (4 cols) */}
          <div className={`col-span-4 ${spacingClass}`}>
            {/* Contact Box */}
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/80 space-y-2 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-[11px] pb-1 border-b" style={{ color }}>
                Coordonnées
              </h3>
              {personal.email && (
                <div className="flex items-center gap-2 break-all text-gray-700">
                  <Mail size={13} style={{ color }} className="shrink-0" />
                  <span>{personal.email}</span>
                </div>
              )}
              {personal.phone && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone size={13} style={{ color }} className="shrink-0" />
                  <span>{personal.phone}</span>
                </div>
              )}
              {personal.city && (
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={13} style={{ color }} className="shrink-0" />
                  <span>{personal.city}</span>
                </div>
              )}
              {personal.mobility && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Briefcase size={13} style={{ color }} className="shrink-0" />
                  <span>{personal.mobility}</span>
                </div>
              )}
              {personal.linkedin && (
                <div className="flex items-center gap-2 break-all text-gray-700">
                  <Linkedin size={13} style={{ color }} className="shrink-0" />
                  <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
                </div>
              )}
              {personal.github && (
                <div className="flex items-center gap-2 break-all text-gray-700">
                  <Github size={13} style={{ color }} className="shrink-0" />
                  <span>{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
                </div>
              )}
            </div>

            {/* Compétences Techniques */}
            {skills?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b" style={{ color }}>
                  Compétences Clés
                </h3>
                <div className="space-y-2">
                  {skills.map((s, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between text-xs font-semibold text-gray-800">
                        <span>{s.name}</span>
                        <span className="text-[10px] text-gray-500">{s.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${s.level || 75}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outils & Environnements */}
            {tools?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b" style={{ color }}>
                  Outils & Méthodes
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {tools.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-gray-800 border border-emerald-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Langues */}
            {languages?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b" style={{ color }}>
                  Langues
                </h3>
                <div className="space-y-1 text-xs">
                  {languages.map((l, idx) => (
                    <div key={idx} className="flex justify-between text-gray-700">
                      <span className="font-semibold">{l.name}</span>
                      <span className="text-gray-500 text-[11px]">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications & Intérêts */}
            {certifications?.length > 0 && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b" style={{ color }}>
                  Certifications
                </h3>
                <ul className="space-y-1 text-xs text-gray-700">
                  {certifications.map((c, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <Award size={12} style={{ color }} className="shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column (8 cols) */}
          <div className={`col-span-8 ${spacingClass}`}>
            {/* Expériences */}
            {experiences?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-3" style={{ color }}>
                  Expériences Professionnelles
                </h3>
                <div className="space-y-3.5">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-gray-950 text-xs">{exp.position}</h4>
                        <span className="text-[11px] font-semibold text-gray-500">
                          {exp.startDate} — {exp.current ? 'Actuel' : exp.endDate}
                        </span>
                      </div>
                      <div className="text-xs font-semibold" style={{ color }}>
                        {exp.company} {exp.city ? `• ${exp.city}` : ''}
                      </div>
                      {exp.description && (
                        <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
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
                <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-3" style={{ color }}>
                  Formation & Diplômes
                </h3>
                <div className="space-y-2.5">
                  {education.map((edu) => (
                    <div key={edu.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-gray-900 text-xs">{edu.degree}</h4>
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

            {/* Projets Clés */}
            {projects?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2.5" style={{ color }}>
                  Réalisations & Projets
                </h3>
                <div className="space-y-2">
                  {projects.map((proj) => (
                    <div key={proj.id} className="p-2.5 rounded-lg border border-gray-200 bg-gray-50/70">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-xs text-gray-900">{proj.title}</h4>
                        {proj.link && <span className="text-[11px] font-medium" style={{ color }}>Lien actif</span>}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="pt-4 border-t border-gray-200 flex justify-between text-[10px] text-gray-400">
        <span>{personal.firstName} {personal.lastName} • CV Professionnel</span>
        <span>elsayf.click</span>
      </footer>
    </div>
  );
}
