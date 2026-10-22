import { useEffect, useState } from 'react'
import { useLanguage } from '../use-language.js'
import { defaultProfile } from '../profile.js'

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
  { label: 'Dribbble', href: 'https://dribbble.com/', icon: 'dribbble' },
  { label: 'Instagram', href: 'https://www.instagram.com/', icon: 'instagram' },
]

const roleKeys = ['hero.roleFullStack', 'hero.roleAi', 'hero.roleReactDjango']

function SocialIcon({ name }) {
  if (name === 'linkedin') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 8.6H2.1V22h3.1V8.6ZM3.65 2A1.8 1.8 0 1 0 3.7 5.6a1.8 1.8 0 0 0-.05-3.6ZM22 14.3c0-4.03-2.15-5.9-5.02-5.9a4.34 4.34 0 0 0-3.9 2.14V8.6H10V22h3.1v-6.64c0-1.75.33-3.44 2.5-3.44 2.14 0 2.17 2 2.17 3.55V22H22v-7.7Z" /></svg>
  if (name === 'github') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.68-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.7 2.62 1.2 3.26.92.1-.72.39-1.2.71-1.48-2.47-.28-5.07-1.24-5.07-5.5 0-1.21.43-2.2 1.15-2.97-.12-.28-.5-1.41.11-2.94 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.66.12 2.94.71.77 1.14 1.76 1.14 2.97 0 4.27-2.6 5.22-5.08 5.49.4.35.76 1.02.76 2.05V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z" /></svg>
  if (name === 'dribbble') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2a9.8 9.8 0 1 0 0 19.6 9.8 9.8 0 0 0 0-19.6Zm6.9 4.9a8 8 0 0 1 1.8 4.1 17.5 17.5 0 0 0-5.2-.1 22.7 22.7 0 0 0-1.2-2.5 16.6 16.6 0 0 0 4.6-1.5ZM17.6 5.7a14.4 14.4 0 0 1-4.2 1.3 31 31 0 0 0-2.3-3.5 7.9 7.9 0 0 1 6.5 2.2ZM8.9 4.1a27.7 27.7 0 0 1 2.3 3.3 27.1 27.1 0 0 1-6.3-.1 8 8 0 0 1 4-3.2ZM3.9 9.2a29.5 29.5 0 0 0 8.3.1c.3.6.7 1.3 1 2-3.3.9-6.1 2.9-7.8 5.7a7.8 7.8 0 0 1-1.5-7.8Zm3.1 9.1c1.4-2.5 3.8-4.3 6.9-5 .7 1.9 1.2 3.9 1.5 6a7.9 7.9 0 0 1-8.4-1Zm10.5-.4a31.3 31.3 0 0 0-1.4-5.1 15.4 15.4 0 0 1 4.7.3 7.9 7.9 0 0 1-3.3 4.8Z" /></svg>
  if (name === 'instagram') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.3 2h9.4A5.3 5.3 0 0 1 22 7.3v9.4a5.3 5.3 0 0 1-5.3 5.3H7.3A5.3 5.3 0 0 1 2 16.7V7.3A5.3 5.3 0 0 1 7.3 2Zm0 3A2.3 2.3 0 0 0 5 7.3v9.4A2.3 2.3 0 0 0 7.3 19h9.4a2.3 2.3 0 0 0 2.3-2.3V7.3A2.3 2.3 0 0 0 16.7 5H7.3Zm9.8 1.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Zm0 3a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.3 2h9.4A5.3 5.3 0 0 1 22 7.3v9.4a5.3 5.3 0 0 1-5.3 5.3H7.3A5.3 5.3 0 0 1 2 16.7V7.3A5.3 5.3 0 0 1 7.3 2Zm0 3A2.3 2.3 0 0 0 5 7.3v9.4A2.3 2.3 0 0 0 7.3 19h9.4a2.3 2.3 0 0 0 2.3-2.3V7.3A2.3 2.3 0 0 0 16.7 5H7.3Zm9.8 1.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Zm0 3a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z" /></svg>
}

function Hero({ profile, isResumeOpen, onCloseResume, onOpenResume }) {
  const { t } = useLanguage()
  const displayName = profile.fullName === defaultProfile.fullName ? t('brand.name') : profile.fullName
  const hasDefaultRole = profile.bio === defaultProfile.bio || profile.bio === 'Full Stack Developer & AI Engineer'
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    if (!hasDefaultRole || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const interval = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % roleKeys.length)
    }, 3200)
    return () => window.clearInterval(interval)
  }, [hasDefaultRole])

  useEffect(() => {
    if (!isResumeOpen) return undefined
    function handleEscape(event) {
      if (event.key === 'Escape') onCloseResume()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isResumeOpen, onCloseResume])

  return (
    <section id="hero" className="portfolio-hero">
      <div className="portfolio-hero__inner">
        <div className="portfolio-hero__copy">
          <p className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-emerald-800/15 bg-white/65 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-[#d3ff69]/20 dark:bg-white/5 dark:text-white/75">
            <span className="inline-flex size-2.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
            {t('hero.availability')}
          </p>
          <p className="portfolio-hero__eyebrow">{t('hero.eyebrow')}</p>
          <h1>{t('hero.welcome')} {displayName}{t('hero.welcomeSuffix')}</h1>
          <p className="portfolio-hero__role">
            <span aria-live="off">
              {hasDefaultRole ? t(roleKeys[roleIndex]) : profile.bio}
            </span>
          </p>
          <div className="portfolio-hero__actions">
            <a className="portfolio-button portfolio-button--primary" href="#projects">{t('hero.portfolio')} <span aria-hidden="true">↗</span></a>
            <button className="portfolio-button portfolio-button--outline cursor-pointer" type="button" onClick={onOpenResume}>
              {t('hero.resume')}
            </button>
          </div>
          <div className="portfolio-socials" aria-label="Social links">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} aria-label={link.label} target="_blank" rel="noreferrer">
                <SocialIcon name={link.icon} />
              </a>
            ))}
          </div>
          <div className="mt-7 grid max-w-xl grid-cols-3 gap-2.5 sm:gap-3">
            {[
              { value: '3+', label: t('hero.statProjects') },
              { value: '15+', label: t('hero.statTechnologies') },
              { value: '100%', label: t('hero.statCode') },
            ].map((stat) => (
              <div key={stat.value} className="min-w-0 border-l-2 border-emerald-700/25 pl-3 sm:pl-4 dark:border-[#d3ff69]/30">
                <p className="text-xl font-extrabold leading-none text-slate-900 dark:text-white sm:text-2xl">{stat.value}</p>
                <p className="mt-2 text-[10px] font-medium leading-4 text-slate-500 dark:text-white/50 sm:text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="portfolio-portrait" aria-label="Portfolio portrait">
          <div className="portfolio-portrait__ring" aria-hidden="true">
            <svg viewBox="0 0 360 360">
              <defs><path id="portrait-ring-path" d="M 180,180 m -150,0 a 150,150 0 1,1 300,0 a 150,150 0 1,1 -300,0" /></defs>
              <text>
                <textPath href="#portrait-ring-path">
                  <tspan className="portfolio-portrait__word portfolio-portrait__word--frontend">FRONTEND</tspan>
                  <tspan className="portfolio-portrait__separator"> · </tspan>
                  <tspan className="portfolio-portrait__word portfolio-portrait__word--backend">BACKEND</tspan>
                  <tspan className="portfolio-portrait__separator"> · </tspan>
                  <tspan className="portfolio-portrait__word portfolio-portrait__word--devops">DEVOPS</tspan>
                  <tspan className="portfolio-portrait__separator"> · </tspan>
                  <tspan className="portfolio-portrait__word portfolio-portrait__word--innovator">INNOVATOR</tspan>
                  <tspan className="portfolio-portrait__separator"> · </tspan>
                </textPath>
              </text>
            </svg>
          </div>
          <div className="portfolio-portrait__image-wrap">
            <img
              src={profile.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85'}
              alt={profile.fullName}
            />
          </div>
        </div>
      </div>
      {isResumeOpen && (
        <div
          className="fixed inset-0 z-100 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) onCloseResume()
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-preview-title"
            className="w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#151916] sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-[#d3ff69]">{t('hero.resumePreview')}</p>
                <h2 id="resume-preview-title" className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">{displayName}</h2>
              </div>
              <button
                type="button"
                aria-label={t('settings.close')}
                className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-900/5 text-lg text-slate-600 hover:bg-slate-900/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
                onClick={onCloseResume}
              >
                ×
              </button>
            </div>
            <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-white/60">
              {hasDefaultRole ? t(roleKeys[roleIndex]) : profile.bio}
            </p>
            <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-white/60">{t('about.paragraph2')}</p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-900/10 pt-5 text-sm dark:border-white/10">
              <a className="font-semibold text-emerald-800 hover:underline dark:text-[#d3ff69]" href="mailto:kindufikad075@gmail.com">kindufikad075@gmail.com</a>
              <span className="text-slate-500 dark:text-white/50">{t('about.location')}</span>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}

export default Hero