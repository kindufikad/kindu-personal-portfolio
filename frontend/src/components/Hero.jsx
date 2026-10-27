import { useCallback, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useLanguage } from '../use-language.js'
import { defaultProfile } from '../profile.js'
import profileImage from '../assets/kkkk.jpg'
import ResumeModal from './ResumeModal.jsx'

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

function Hero({ profile, isResumeOpen, onCloseResume, onOpenResume, onNavigate }) {
  const { t } = useLanguage()
  const displayName = profile.fullName === defaultProfile.fullName ? t('brand.name') : profile.fullName
  const hasDefaultRole = profile.bio === defaultProfile.bio || profile.bio === 'Full Stack Developer & AI Engineer'
  const [roleIndex, setRoleIndex] = useState(0)
  const [localTime, setLocalTime] = useState('')
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false)
  const [isPortfolioClosing, setIsPortfolioClosing] = useState(false)
  const portfolioCloseTimerRef = useRef(null)

  const closePortfolio = useCallback((afterClose) => {
    if (portfolioCloseTimerRef.current) return
    setIsPortfolioClosing(true)
    portfolioCloseTimerRef.current = window.setTimeout(() => {
      portfolioCloseTimerRef.current = null
      setIsPortfolioOpen(false)
      setIsPortfolioClosing(false)
      afterClose?.()
    }, 180)
  }, [])

  function openPortfolio() {
    if (portfolioCloseTimerRef.current) {
      window.clearTimeout(portfolioCloseTimerRef.current)
      portfolioCloseTimerRef.current = null
    }
    setIsPortfolioClosing(false)
    setIsPortfolioOpen(true)
  }

  useEffect(() => {
    const updateTime = () => {
      const date = new Date()
      const timeFormatter = new Intl.DateTimeFormat('en-ET', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Africa/Addis_Ababa',
      })
      setLocalTime(timeFormatter.format(date))
    }

    updateTime()
    const interval = window.setInterval(updateTime, 1000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!hasDefaultRole || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const interval = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % roleKeys.length)
    }, 3200)
    return () => window.clearInterval(interval)
  }, [hasDefaultRole])

  useEffect(() => {
    if (!isPortfolioOpen) return undefined

    function handleEscape(event) {
      if (event.key === 'Escape') closePortfolio()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [closePortfolio, isPortfolioOpen])

  useEffect(() => () => {
    window.clearTimeout(portfolioCloseTimerRef.current)
  }, [])

  const handlePortfolioAction = (event) => {
    if (event) event.preventDefault()
    const projectSection = document.getElementById('projects')
    if (projectSection) {
      projectSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    openPortfolio()
  }

  const handleViewProjectsGrid = () => {
    closePortfolio(() => onNavigate?.('#projects'))
  }

  const handleDownloadResume = () => {
    const link = document.createElement('a')
    link.href = '/resume.pdf'
    link.download = 'Kindu_Fikad_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleResumeAction = () => {
    if (typeof onOpenResume === 'function') {
      onOpenResume()
      return
    }

    handleDownloadResume()
  }

  return (
    <section id="hero" className="portfolio-hero relative overflow-hidden">
      <div className="pointer-events-none absolute -top-14 left-1/4 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl dark:bg-purple-900/20" aria-hidden="true" />
      <div className="pointer-events-none absolute right-10 top-10 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-900/20" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/25 blur-3xl dark:bg-emerald-900/15" aria-hidden="true" />

      <div className="portfolio-hero__inner relative">
        <div className="portfolio-hero__copy">
          <div className="mb-5 flex max-w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-emerald-500/30 bg-white/90 px-4 py-2 text-xs font-medium text-slate-700 shadow-md backdrop-blur-md dark:border-emerald-500/20 dark:bg-slate-900/90 dark:text-slate-100 sm:flex-row sm:justify-start sm:gap-2 sm:rounded-full sm:text-sm">
            <div className="inline-flex items-center gap-2 text-center sm:text-left">
              <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span>Available for Freelance & Remote Work</span>
            </div>

            <div className="inline-flex items-center justify-center gap-1.5 text-center text-slate-600 dark:text-slate-300 sm:justify-start">
              <span aria-hidden="true">🕒</span>
              <span>Addis Ababa, ET {localTime}</span>
            </div>
          </div>

          <p className="portfolio-hero__eyebrow">{t('hero.eyebrow')}</p>
          <h1>{t('hero.welcome')} {displayName}{t('hero.welcomeSuffix')}</h1>
          <p className="portfolio-hero__role">
            <span aria-live="off">
              {hasDefaultRole ? t(roleKeys[roleIndex]) : profile.bio}
            </span>
          </p>

          <div className="portfolio-hero__actions">
            <button
              type="button"
              onClick={handlePortfolioAction}
              className="portfolio-button portfolio-button--primary hover:scale-105 transition-all duration-300"
            >
              {t('hero.portfolio')} <span aria-hidden="true">↗</span>
            </button>
            <button
              className="portfolio-button portfolio-button--outline cursor-pointer hover:scale-105 transition-all duration-300"
              type="button"
              onClick={handleResumeAction}
            >
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
              src={profileImage}
              alt={profile.fullName}
            />
          </div>
        </div>
      </div>

      {isPortfolioOpen && (
        <div
          className={`portfolio-preview-backdrop fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm ${isPortfolioClosing ? 'is-closing' : ''}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) closePortfolio()
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-preview-title"
            className={`portfolio-preview-panel max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#151916] sm:p-8 ${isPortfolioClosing ? 'is-closing' : ''}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-[#d3ff69]">Featured Work</p>
                <h2 id="portfolio-preview-title" className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white">Selected Projects</h2>
              </div>
              <button
                type="button"
                aria-label="Close Selected Projects"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-900/5 text-slate-600 transition hover:bg-slate-900/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
                onClick={() => closePortfolio()}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleViewProjectsGrid}
                className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-700/30 hover:shadow-md focus-visible:outline-2 focus-visible:outline-emerald-700 dark:border-white/10 dark:bg-slate-900/60"
              >
                <div className="mb-3 h-32 rounded-xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500" aria-hidden="true" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Full-stack Business Platform</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-white/60">React, Django, REST APIs, and admin dashboards for client-facing product workflows.</p>
              </button>
              <button
                  type="button"
                  aria-label="View AI Automation Experience project"
                  onClick={handleViewProjectsGrid}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-700/30 hover:shadow-md focus-visible:outline-2 focus-visible:outline-emerald-700 dark:border-white/10 dark:bg-slate-900/60"
                >
                <div className="mb-3 h-32 rounded-xl bg-gradient-to-br from-violet-400 via-fuchsia-400 to-pink-500" aria-hidden="true" />
                <h3 className="font-semibold text-slate-900 dark:text-white">AI Automation Experience</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-white/60">Python-based automation and intelligent product experiences with a strong UX focus.</p>
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleViewProjectsGrid}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-105 dark:bg-white dark:text-slate-950"
              >
                View Projects Grid
              </button>
            </div>
          </section>
        </div>
      )}

      {isResumeOpen && (
        <ResumeModal isOpen={isResumeOpen} profile={{ ...profile, fullName: displayName }} onClose={onCloseResume} />
      )}
    </section>
  )
}

export default Hero