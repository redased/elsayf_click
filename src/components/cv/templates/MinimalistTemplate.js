'use client';

export default function MinimalistTemplate({ data, color = '#18181b', font = 'sans', spacing = 'normal' }) {
  const { personal = {}, skills = [], softSkills = [], tools = [], languages = [], experiences = [], education = [], projects = [], certifications = [], interests = [] } = data || {};

  const fontClass = font === 'serif' ? 'font-serif' : font === 'mono' ? 'font-mono' : 'font-sans';
  const spacingClass = spacing === 'compact' ? 'space-y-3' : spacing === 'relaxed' ? 'space-y-6' : 'space-y-4';

  return (
    <div
      className={`w-full bg-white text-black ${fontClass} text-[13px] leading-relaxed p-9 min-h-[1120px] flex flex-col justify-between`}
      style={{ '--accent': color }}
    >
      <div>
        {/* Clean ATS-Optimized Header */}
        <header className="border-b-2 border-black pb-5">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight uppercase">
                {personal.firstName} {personal.lastName}
              </h1>
              <p className="text-sm font-semibold tracking-wide text-neutral-800 uppercase mt-0.5">
                {personal.title}
              </p>
            </div>
            {personal.avatar && (
              <img
                src={personal.avatar}
                alt={personal.firstName}
                className="w-16 h-16 rounded-full object-cover border border-neutral-300"
              />
            )}
          </div>

          {/* Contact Line */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-700 mt-3 font-medium">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>• {personal.phone}</span>}
            {personal.city && <span>• {personal.city}</span>}
            {personal.linkedin && <span>• {personal.linkedin}</span>}
            {personal.website && <span>• {personal.website}</span>}
            {personal.github && <span>• {personal.github}</span>}
          </div>

          {personal.summary && (
            <p className="text-xs text-neutral-700 mt-3 text-justify leading-relaxed">
              {personal.summary}
            </p>
          )}
        </header>

        <div className={`mt-5 ${spacingClass}`}>
          {/* Expériences Professionnelles */}
          {experiences?.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 mb-2.5">
                Expériences Professionnelles
              </h2>
              <div className="space-y-3">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-xs">{exp.position} — <span className="font-normal">{exp.company}</span></h3>
                      <span className="text-[11px] text-neutral-600">
                        {exp.startDate} – {exp.current ? 'Présent' : exp.endDate} {exp.city ? `| ${exp.city}` : ''}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-neutral-700 whitespace-pre-line mt-1">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formation & Diplômes */}
          {education?.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 mb-2.5">
                Formation & Diplômes
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <h3 className="font-bold text-xs">{edu.degree}</h3>
                      <p className="text-xs text-neutral-700">{edu.school} {edu.city ? `• ${edu.city}` : ''}</p>
                      {edu.description && <p className="text-[11px] text-neutral-500">{edu.description}</p>}
                    </div>
                    <span className="text-[11px] text-neutral-600">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projets Clés */}
          {projects?.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 mb-2.5">
                Projets Clés
              </h2>
              <div className="space-y-2">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-xs">{proj.title}</h3>
                      {proj.link && <span className="text-[11px] text-neutral-500">{proj.link}</span>}
                    </div>
                    <p className="text-xs text-neutral-700">{proj.description}</p>
                    {proj.technologies && (
                      <p className="text-[10px] text-neutral-600 italic">Technologies : {proj.technologies}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compétences & Outils en 2 colonnes */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 mb-2.5">
              Compétences & Outils
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs text-neutral-800">
              {skills?.length > 0 && (
                <div>
                  <h4 className="font-bold text-[11px] uppercase text-neutral-600 mb-1">Compétences Clés</h4>
                  <p className="leading-snug">{skills.map(s => s.name).join(' • ')}</p>
                </div>
              )}
              {tools?.length > 0 && (
                <div>
                  <h4 className="font-bold text-[11px] uppercase text-neutral-600 mb-1">Logiciels & Environnements</h4>
                  <p className="leading-snug">{tools.join(' • ')}</p>
                </div>
              )}
              {languages?.length > 0 && (
                <div>
                  <h4 className="font-bold text-[11px] uppercase text-neutral-600 mb-1">Langues</h4>
                  <p className="leading-snug">{languages.map(l => `${l.name} (${l.level})`).join(' • ')}</p>
                </div>
              )}
              {certifications?.length > 0 && (
                <div>
                  <h4 className="font-bold text-[11px] uppercase text-neutral-600 mb-1">Certifications</h4>
                  <p className="leading-snug">{certifications.join(' • ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="pt-4 border-t border-neutral-200 text-[10px] text-neutral-500 flex justify-between">
        <span>{personal.firstName} {personal.lastName} • Curriculum Vitae</span>
        <span>elsayf.click</span>
      </footer>
    </div>
  );
}
