'use client';
import { Mail, Phone, MapPin, Globe, Linkedin, Briefcase, GraduationCap, Award, ShieldCheck, Check } from 'lucide-react';

export default function EmeraldTemplate({ data, color = '#0d9488', font = 'sans', spacing = 'normal' }) {
  const { personal = {}, skills = [], softSkills = [], tools = [], languages = [], experiences = [], education = [], projects = [], certifications = [], interests = [] } = data || {};

  const fontClass = font === 'serif' ? 'font-serif' : font === 'mono' ? 'font-mono' : 'font-sans';
  const spacingClass = spacing === 'compact' ? 'space-y-3' : spacing === 'relaxed' ? 'space-y-6' : 'space-y-4';

  return (
    <div
      className={`w-full bg-white text-gray-800 ${fontClass} text-[13px] leading-relaxed min-h-[297mm] h-full flex flex-col justify-between`}
      style={{ '--accent': color }}
    >
      <div>
        {/* Top Header Banner with Deep Contrast */}
        <header className="p-8 text-white flex items-center justify-between gap-6" style={{ backgroundColor: color }}>
          <div className="space-y-2 flex-1">
            <h1 className="text-3xl font-black tracking-tight uppercase">
              {personal.firstName} {personal.lastName}
            </h1>
            <p className="text-sm font-semibold tracking-wider uppercase text-emerald-100">
              {personal.title}
            </p>
            {personal.summary && (
              <p className="text-xs text-emerald-50 leading-relaxed max-w-2xl pt-1">
                {personal.summary}
              </p>
            )}
          </div>

          {personal.avatar ? (
            <img
              src={personal.avatar}
              alt={personal.firstName}
              className="w-24 h-24 rounded-full object-cover border-4 border-white/80 shadow-lg shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-4 border-white/80 flex items-center justify-center text-white text-2xl font-bold uppercase shadow-lg shrink-0 bg-white/20">
              {personal.firstName?.[0]}{personal.lastName?.[0]}
            </div>
          )}
        </header>

        {/* Contact Strip */}
        <div className="bg-slate-900 text-slate-200 px-8 py-2.5 flex flex-wrap justify-between items-center text-xs gap-3 font-sans">
          {personal.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={13} className="text-emerald-400" />
              <span>{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={13} className="text-emerald-400" />
              <span>{personal.phone}</span>
            </div>
          )}
          {personal.city && (
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-emerald-400" />
              <span>{personal.city}</span>
            </div>
          )}
          {personal.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin size={13} className="text-emerald-400" />
              <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
            </div>
          )}
        </div>

        {/* 2 Columns Body */}
        <div className="p-8 grid grid-cols-12 gap-8">
          {/* Main (8 cols) */}
          <div className={`col-span-8 ${spacingClass}`}>
            {/* Expériences */}
            {experiences?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider pb-1.5 border-b-2 mb-3 text-gray-950 flex items-center gap-2" style={{ borderColor: color }}>
                  <Briefcase size={15} style={{ color }} />
                  Expériences Professionnelles
                </h3>
                <div className="space-y-4 font-sans">
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
                <h3 className="text-xs font-bold uppercase tracking-wider pb-1.5 border-b-2 mb-3 text-gray-950 flex items-center gap-2" style={{ borderColor: color }}>
                  <GraduationCap size={15} style={{ color }} />
                  Formation Académique
                </h3>
                <div className="space-y-2.5 font-sans">
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

            {/* Projets */}
            {projects?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider pb-1.5 border-b-2 mb-2 text-gray-950 flex items-center gap-2" style={{ borderColor: color }}>
                  <ShieldCheck size={15} style={{ color }} />
                  Missions Notables & Réalisations
                </h3>
                <div className="space-y-2 font-sans">
                  {projects.map((proj) => (
                    <div key={proj.id} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                      <h4 className="font-bold text-xs text-gray-900">{proj.title}</h4>
                      <p className="text-xs text-gray-700 mt-0.5">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (4 cols) */}
          <div className={`col-span-4 ${spacingClass} font-sans`}>
            {/* Compétences */}
            {skills?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider pb-1.5 border-b-2 mb-2.5 text-gray-950" style={{ borderColor: color }}>
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
                          className="h-full rounded-full"
                          style={{ width: `${s.level || 80}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outils & Logiciels */}
            {tools?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider pb-1.5 border-b-2 mb-2 text-gray-950" style={{ borderColor: color }}>
                  Outils & Systèmes
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {tools.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Soft Skills */}
            {softSkills?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider pb-1.5 border-b-2 mb-2 text-gray-950" style={{ borderColor: color }}>
                  Atouts Majeurs
                </h3>
                <ul className="space-y-1 text-xs text-gray-700">
                  {softSkills.map((sk, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check size={12} style={{ color }} className="shrink-0" />
                      <span>{sk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Langues */}
            {languages?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider pb-1.5 border-b-2 mb-2 text-gray-950" style={{ borderColor: color }}>
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

            {/* Certifications */}
            {certifications?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider pb-1.5 border-b-2 mb-2 text-gray-950" style={{ borderColor: color }}>
                  Certifications
                </h3>
                <ul className="space-y-1 text-xs text-gray-700">
                  {certifications.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <Award size={13} style={{ color }} className="shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="p-6 border-t border-gray-200 flex justify-between text-[10px] text-gray-400 font-sans">
        <span>Curriculum Vitae • {personal.firstName} {personal.lastName}</span>
        <span>Généré sur elsayf.click</span>
      </footer>
    </div>
  );
}
