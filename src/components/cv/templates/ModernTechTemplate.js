'use client';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink, Calendar, Briefcase, GraduationCap, Award, Heart, CheckCircle2, Code2 } from 'lucide-react';

export default function ModernTechTemplate({ data, color = '#7c3aed', font = 'sans', spacing = 'normal' }) {
  const { personal = {}, skills = [], softSkills = [], tools = [], languages = [], experiences = [], education = [], projects = [], certifications = [], interests = [] } = data || {};

  const fontClass = font === 'serif' ? 'font-serif' : font === 'mono' ? 'font-mono' : 'font-sans';
  const spacingClass = spacing === 'compact' ? 'space-y-3' : spacing === 'relaxed' ? 'space-y-6' : 'space-y-4';

  return (
    <div
      className={`w-full bg-white text-gray-800 ${fontClass} text-[13px] leading-relaxed select-text print:shadow-none min-h-[1120px]`}
      style={{ '--accent': color }}
    >
      <div className="grid grid-cols-12 min-h-[1120px]">
        {/* Left Column / Sidebar (4 cols) */}
        <div className="col-span-4 bg-slate-900 text-slate-100 p-6 flex flex-col justify-between border-r border-slate-800">
          <div className="space-y-6">
            {/* Photo / Avatar */}
            {personal.avatar ? (
              <div className="flex justify-center">
                <img
                  src={personal.avatar}
                  alt={personal.firstName}
                  className="w-28 h-28 rounded-2xl object-cover ring-4 shadow-xl"
                  style={{ ringColor: color }}
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg uppercase"
                  style={{ backgroundColor: color }}
                >
                  {personal.firstName?.[0] || 'E'}{personal.lastName?.[0] || 'S'}
                </div>
              </div>
            )}

            {/* Contact Details */}
            <div className="space-y-2.5 text-xs text-slate-300">
              <h3 className="text-xs uppercase tracking-widest font-bold pb-1 border-b border-slate-700/80" style={{ color: color }}>
                Contact
              </h3>
              {personal.email && (
                <div className="flex items-center gap-2 break-all">
                  <Mail size={13} className="shrink-0" style={{ color }} />
                  <span>{personal.email}</span>
                </div>
              )}
              {personal.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={13} className="shrink-0" style={{ color }} />
                  <span>{personal.phone}</span>
                </div>
              )}
              {personal.city && (
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="shrink-0" style={{ color }} />
                  <span>{personal.city}</span>
                </div>
              )}
              {personal.mobility && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Briefcase size={13} className="shrink-0" style={{ color }} />
                  <span>{personal.mobility}</span>
                </div>
              )}
              {personal.website && (
                <div className="flex items-center gap-2 break-all">
                  <Globe size={13} className="shrink-0" style={{ color }} />
                  <a href={personal.website} target="_blank" rel="noreferrer" className="hover:underline text-slate-200">
                    {personal.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {personal.linkedin && (
                <div className="flex items-center gap-2 break-all">
                  <Linkedin size={13} className="shrink-0" style={{ color }} />
                  <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
                </div>
              )}
              {personal.github && (
                <div className="flex items-center gap-2 break-all">
                  <Github size={13} className="shrink-0" style={{ color }} />
                  <span>{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
                </div>
              )}
            </div>

            {/* Technical Skills */}
            {skills?.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs uppercase tracking-widest font-bold pb-1 border-b border-slate-700/80" style={{ color }}>
                  Compétences Clés
                </h3>
                <div className="space-y-2">
                  {skills.map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-200">{s.name}</span>
                        <span className="text-slate-400 text-[10px]">{s.level}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${s.level || 75}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tools & Frameworks */}
            {tools?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-widest font-bold pb-1 border-b border-slate-700/80" style={{ color }}>
                  Outils & Environnements
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {tools.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-800/90 text-slate-200 border border-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Soft Skills */}
            {softSkills?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-widest font-bold pb-1 border-b border-slate-700/80" style={{ color }}>
                  Atouts / Soft Skills
                </h3>
                <ul className="space-y-1 text-xs text-slate-300">
                  {softSkills.map((sk, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[10px] mt-0.5" style={{ color }}>▹</span>
                      <span>{sk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Languages */}
            {languages?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-widest font-bold pb-1 border-b border-slate-700/80" style={{ color }}>
                  Langues
                </h3>
                <div className="space-y-1 text-xs">
                  {languages.map((l, idx) => (
                    <div key={idx} className="flex justify-between text-slate-300">
                      <span className="font-medium text-slate-200">{l.name}</span>
                      <span className="text-slate-400 text-[11px]">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Certifications & Interests footer */}
          {(certifications?.length > 0 || interests?.length > 0) && (
            <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
              {certifications?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-300 mb-1 text-[11px] uppercase tracking-wide">Certifications</h4>
                  <ul className="space-y-0.5 text-slate-400 text-[11px]">
                    {certifications.map((c, i) => (
                      <li key={i} className="truncate">• {c}</li>
                    ))}
                  </ul>
                </div>
              )}
              {interests?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-300 mb-1 text-[11px] uppercase tracking-wide">Centres d'intérêt</h4>
                  <p className="text-slate-400 text-[11px]">{interests.join(' • ')}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column / Main Body (8 cols) */}
        <div className="col-span-8 p-7 bg-white text-gray-800 flex flex-col justify-between">
          <div className={spacingClass}>
            {/* Header / Name & Title */}
            <div className="border-b-2 pb-4" style={{ borderColor: color }}>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
                {personal.firstName || 'Prénom'}{' '}
                <span style={{ color }}>{personal.lastName || 'Nom'}</span>
              </h1>
              <h2 className="text-sm font-semibold tracking-wide uppercase mt-1 text-gray-600">
                {personal.title || 'Titre Professionnel'}
              </h2>
              {personal.summary && (
                <p className="mt-3 text-xs text-gray-600 leading-relaxed text-justify">
                  {personal.summary}
                </p>
              )}
            </div>

            {/* Parcours Professionnel (Expériences) */}
            {experiences?.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b pb-1 border-gray-200">
                  <Briefcase size={16} style={{ color }} />
                  <h3 className="text-sm uppercase font-bold tracking-wider text-gray-900">
                    Expériences Professionnelles
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-3 border-l-2" style={{ borderColor: color }}>
                      <div className="flex flex-wrap justify-between items-baseline gap-1">
                        <h4 className="font-bold text-gray-900 text-[13px]">{exp.position}</h4>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                          {exp.startDate} — {exp.current ? 'Présent' : exp.endDate}
                        </span>
                      </div>
                      <div className="text-xs font-semibold" style={{ color }}>
                        {exp.company} {exp.city ? `• ${exp.city}` : ''}
                      </div>
                      {exp.description && (
                        <p className="mt-1.5 text-xs text-gray-600 whitespace-pre-line leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formations & Éducation */}
            {education?.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b pb-1 border-gray-200">
                  <GraduationCap size={16} style={{ color }} />
                  <h3 className="text-sm uppercase font-bold tracking-wider text-gray-900">
                    Formation & Diplômes
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {education.map((edu) => (
                    <div key={edu.id} className="relative pl-3 border-l-2 border-gray-300">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-gray-900 text-xs">{edu.degree}</h4>
                        <span className="text-[11px] font-medium text-gray-500">{edu.year}</span>
                      </div>
                      <div className="text-xs text-gray-600 font-medium">
                        {edu.school} {edu.city ? `• ${edu.city}` : ''}
                      </div>
                      {edu.description && (
                        <p className="text-[11px] text-gray-500 mt-0.5">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projets & Réalisations Clés */}
            {projects?.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 border-b pb-1 border-gray-200">
                  <Code2 size={16} style={{ color }} />
                  <h3 className="text-sm uppercase font-bold tracking-wider text-gray-900">
                    Projets & Réalisations Clés
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {projects.map((proj) => (
                    <div key={proj.id} className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-xs text-gray-900">{proj.title}</h4>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] flex items-center gap-1 font-medium hover:underline"
                            style={{ color }}
                          >
                            Lien <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1 leading-snug">{proj.description}</p>
                      {proj.technologies && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {proj.technologies.split(',').map((tech, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.2 rounded bg-white border border-gray-200 text-gray-700 font-mono">
                              {tech.trim()}
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

          <div className="pt-4 border-t border-gray-100 flex justify-between text-[10px] text-gray-400">
            <span>CV certifié conforme • {personal.firstName} {personal.lastName}</span>
            <span>Généré sur elsayf.click</span>
          </div>
        </div>
      </div>
    </div>
  );
}
