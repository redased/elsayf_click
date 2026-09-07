'use client';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink, Sparkles, Palette, Layers, Award } from 'lucide-react';

export default function CreativeDesignerTemplate({ data, color = '#e11d48', font = 'sans', spacing = 'normal' }) {
  const { personal = {}, skills = [], softSkills = [], tools = [], languages = [], experiences = [], education = [], projects = [], certifications = [], interests = [] } = data || {};

  const fontClass = font === 'serif' ? 'font-serif' : font === 'mono' ? 'font-mono' : 'font-sans';
  const spacingClass = spacing === 'compact' ? 'space-y-3' : spacing === 'relaxed' ? 'space-y-6' : 'space-y-4';

  return (
    <div
      className={`w-full bg-[#fafafa] text-zinc-800 ${fontClass} text-[13px] leading-relaxed p-7 min-h-[1120px] flex flex-col justify-between`}
      style={{ '--accent': color }}
    >
      <div>
        {/* Creative Top Banner with Gradient & Modern Typography */}
        <header className="relative bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm overflow-hidden mb-6">
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none -mr-20 -mt-20"
            style={{ backgroundColor: color }}
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              {personal.avatar ? (
                <img
                  src={personal.avatar}
                  alt={personal.firstName}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 shadow-md shrink-0"
                  style={{ ringColor: color }}
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md uppercase shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {personal.firstName?.[0]}{personal.lastName?.[0]}
                </div>
              )}

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase text-white mb-1.5 shadow-sm" style={{ backgroundColor: color }}>
                  <Sparkles size={11} /> Portfolio & Profil Créatif
                </div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-900">
                  {personal.firstName} <span style={{ color }}>{personal.lastName}</span>
                </h1>
                <p className="text-sm font-semibold text-zinc-600 tracking-wide mt-0.5">
                  {personal.title}
                </p>
              </div>
            </div>

            {/* Quick Contact Chips */}
            <div className="flex flex-col gap-1.5 text-xs text-zinc-600 shrink-0 border-t md:border-t-0 md:border-l border-zinc-200 pt-3 md:pt-0 md:pl-5">
              {personal.email && (
                <div className="flex items-center gap-2">
                  <Mail size={13} style={{ color }} />
                  <span>{personal.email}</span>
                </div>
              )}
              {personal.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={13} style={{ color }} />
                  <span>{personal.phone}</span>
                </div>
              )}
              {personal.city && (
                <div className="flex items-center gap-2">
                  <MapPin size={13} style={{ color }} />
                  <span>{personal.city}</span>
                </div>
              )}
              {personal.website && (
                <div className="flex items-center gap-2 font-medium">
                  <Globe size={13} style={{ color }} />
                  <a href={personal.website} target="_blank" rel="noreferrer" className="hover:underline" style={{ color }}>
                    {personal.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {personal.summary && (
            <p className="mt-4 pt-4 border-t border-zinc-100 text-xs text-zinc-600 leading-relaxed">
              {personal.summary}
            </p>
          )}
        </header>

        {/* Content Layout (7 cols experiences / projects, 5 cols skills / creative stack) */}
        <div className="grid grid-cols-12 gap-6">
          {/* Main Work History & Projects (7 cols) */}
          <div className={`col-span-7 ${spacingClass}`}>
            {/* Expériences */}
            {experiences?.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-3.5">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                  <Layers size={16} style={{ color }} />
                  <h2 className="text-xs font-black uppercase tracking-wider text-zinc-900">
                    Parcours & Expérience de Conception
                  </h2>
                </div>

                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-3 border-l-2" style={{ borderColor: color }}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-zinc-900 text-xs">{exp.position}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                          {exp.startDate} — {exp.current ? 'Actuel' : exp.endDate}
                        </span>
                      </div>
                      <div className="text-xs font-semibold mt-0.5" style={{ color }}>
                        {exp.company} {exp.city ? `• ${exp.city}` : ''}
                      </div>
                      {exp.description && (
                        <p className="text-xs text-zinc-600 whitespace-pre-line leading-relaxed mt-1">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projets Clés & Portfolio */}
            {projects?.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                  <Palette size={16} style={{ color }} />
                  <h2 className="text-xs font-black uppercase tracking-wider text-zinc-900">
                    Showcase & Projets Phares
                  </h2>
                </div>

                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-xs text-zinc-900">{proj.title}</h3>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-bold flex items-center gap-1 hover:underline"
                            style={{ color }}
                          >
                            Voir <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 mt-1">{proj.description}</p>
                      {proj.technologies && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {proj.technologies.split(',').map((t, i) => (
                            <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded bg-white border border-zinc-200 text-zinc-700">
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Skills & Creative Stack (5 cols) */}
          <div className={`col-span-5 ${spacingClass}`}>
            {/* Compétences Graphiques / UI-UX */}
            {skills?.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-2.5">
                <h2 className="text-xs font-black uppercase tracking-wider text-zinc-900 pb-1.5 border-b border-zinc-100" style={{ color }}>
                  Design Craft & Compétences
                </h2>
                <div className="space-y-2">
                  {skills.map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-zinc-800">
                        <span>{s.name}</span>
                        <span className="text-[10px] text-zinc-500">{s.level}%</span>
                      </div>
                      <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
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

            {/* Outils & Logiciels Créatifs */}
            {tools?.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-2.5">
                <h2 className="text-xs font-black uppercase tracking-wider text-zinc-900 pb-1.5 border-b border-zinc-100" style={{ color }}>
                  Stack & Outils Logiciels
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {tools.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-50 border border-zinc-200 text-zinc-800 hover:border-zinc-400 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Formation & Diplômes */}
            {education?.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-2.5">
                <h2 className="text-xs font-black uppercase tracking-wider text-zinc-900 pb-1.5 border-b border-zinc-100" style={{ color }}>
                  Formation & Diplômes
                </h2>
                <div className="space-y-2.5">
                  {education.map((edu) => (
                    <div key={edu.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-xs font-bold text-zinc-900">{edu.degree}</h3>
                        <span className="text-[10px] font-bold text-zinc-500">{edu.year}</span>
                      </div>
                      <p className="text-xs text-zinc-600">{edu.school}</p>
                      {edu.description && (
                        <p className="text-[11px] text-zinc-500">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Langues & Intérêts */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-3 text-xs">
              {languages?.length > 0 && (
                <div>
                  <h3 className="font-bold text-zinc-900 text-xs mb-1.5 uppercase tracking-wide">Langues</h3>
                  <div className="space-y-1">
                    {languages.map((l, i) => (
                      <div key={i} className="flex justify-between text-zinc-700">
                        <span className="font-medium">{l.name}</span>
                        <span className="text-zinc-500 text-[11px]">{l.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {interests?.length > 0 && (
                <div className="pt-2 border-t border-zinc-100">
                  <h3 className="font-bold text-zinc-900 text-xs mb-1 uppercase tracking-wide">Passions</h3>
                  <p className="text-zinc-600 text-xs">{interests.join(' • ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer minimal */}
      <footer className="pt-4 mt-6 border-t border-zinc-200/80 flex justify-between text-[10px] text-zinc-400">
        <span>Portfolio CV • {personal.firstName} {personal.lastName}</span>
        <span>Créé sur elsayf.click</span>
      </footer>
    </div>
  );
}
