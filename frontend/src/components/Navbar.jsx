import { useCallback, useEffect, useRef, useState } from 'react'
import { LuCheck, LuCopy, LuMail, LuMenu, LuPhone, LuSend, LuSettings, LuX } from 'react-icons/lu'
import { useLanguage } from '../use-language.js'
import { defaultProfile } from '../profile.js'
import LetsTalkButton from './LetsTalkButton.jsx'
import ProfileEditModal from './ProfileEditModal.jsx'
import SettingsModal from './SettingsModal.jsx'

const navLinks = [
  { label: 'nav.home', href: '#hero', view: 'home' },
  { label: 'nav.projects', href: '#projects', view: 'projects' },
  { label: 'nav.recognition', href: '#recognition', view: 'recognition' },
  { label: 'nav.services', href: '#services', view: 'services' },
  { label: 'nav.about', href: '#about', view: 'about' },
  { label: 'nav.contact', href: '#contact', view: 'contact' },
]

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'GitHub', href: 'https://github.com/kindufikad' },
  { label: 'Dribbble', href: 'https://dribbble.com/kindufikad075' },
  { label: 'Instagram', href: 'https://www.instagram.com/' },
]

function SettingsButton({ label, isOpen, onClick, buttonRef }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className="portfolio-settings__trigger group grid size-10 place-items-center rounded-full bg-slate-100 p-2.5 text-slate-700 transition-colors hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-emerald-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={isOpen ? 'settings-popover' : undefined}
      onClick={onClick}
    >
      <LuSettings size={19} className="transition-transform duration-300 group-hover:rotate-45" aria-hidden="true" />
    </button>
  )
}

function Navbar({ theme, profile, activeView, onNavigate, onViewResume, onSaveProfile, onToggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isQuickConnectOpen, setIsQuickConnectOpen] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  const settingsButtonRef = useRef(null)
  const mobileSettingsButtonRef = useRef(null)
  const menuButtonRef = useRef(null)
  const mobileCloseRef = useRef(null)
  const firstMobileLinkRef = useRef(null)
  const profileReturnFocusRef = useRef(null)
  const quickConnectCloseRef = useRef(null)
  const quickConnectTriggerRef = useRef(null)
  const { t } = useLanguage()
  const displayName = profile.fullName === defaultProfile.fullName ? t('brand.name') : profile.fullName

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
    setIsSettingsOpen(false)
  }, [])

  function handleNavigation(event, href) {
    event.preventDefault()
    closeMenu()
    onNavigate(href)
  }

  function openQuickConnect(event) {
    closeMenu()
    quickConnectTriggerRef.current = event.currentTarget
    setIsQuickConnectOpen(true)
  }

  function closeQuickConnect() {
    setIsQuickConnectOpen(false)
  }

  async function copyContact(value, type) {
    try {
      await navigator.clipboard.writeText(value)
      setCopyStatus(type)
    } catch {
      setCopyStatus('error')
    }
  }

  function openProfileFromSettings(isMobile = false) {
    profileReturnFocusRef.current = isMobile ? menuButtonRef.current : settingsButtonRef.current
    closeMenu()
    setIsProfileOpen(true)
  }

  useEffect(() => {
    if (!isMenuOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstMobileLinkRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        closeMenu()
        menuButtonRef.current?.focus()
      }
    }

    const desktopQuery = window.matchMedia('(min-width: 768px)')
    function closeAtDesktop(event) {
      if (event.matches) closeMenu()
    }

    document.addEventListener('keydown', handleKeyDown)
    desktopQuery.addEventListener('change', closeAtDesktop)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      desktopQuery.removeEventListener('change', closeAtDesktop)
    }
  }, [closeMenu, isMenuOpen])

  useEffect(() => {
    if (!isQuickConnectOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    quickConnectCloseRef.current?.focus()

    function handleEscape(event) {
      if (event.key === 'Escape') {
        closeQuickConnect()
        quickConnectTriggerRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isQuickConnectOpen])

  useEffect(() => {
    if (!copyStatus) return undefined
    const timeout = window.setTimeout(() => setCopyStatus(''), 2400)
    return () => window.clearTimeout(timeout)
  }, [copyStatus])

  return (
    <header className="portfolio-header">
      <nav aria-label="Main navigation" className="portfolio-nav">
        <a
          href="#top"
          onClick={(event) => handleNavigation(event, '#hero')}
          className="portfolio-brand"
        >
          {displayName}
        </a>

        <div className="hidden items-center gap-5 md:flex lg:gap-6">
          <div className="portfolio-nav__links">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`portfolio-nav__link ${activeView === link.view ? 'is-active' : ''}`}
                aria-current={activeView === link.view ? 'page' : undefined}
                onClick={(event) => handleNavigation(event, link.href)}
              >
                {t(link.label)}
              </a>
            ))}
          </div>

          <div className="portfolio-settings">
            <SettingsButton
              buttonRef={settingsButtonRef}
              label={t('settings.title')}
              isOpen={isSettingsOpen && !isMenuOpen}
              onClick={() => setIsSettingsOpen((open) => !open)}
            />
            {isSettingsOpen && !isMenuOpen && (
              <SettingsModal
                isOpen
                onClose={() => setIsSettingsOpen(false)}
                onOpenProfile={() => openProfileFromSettings()}
                onOpenProjects={() => {
                  closeMenu()
                  onNavigate('#projects')
                }}
                onViewResume={onViewResume}
                theme={theme}
                onToggleTheme={onToggleTheme}
              />
            )}
          </div>

          <LetsTalkButton
            label={t('nav.talk')}
            className="portfolio-nav__cta"
            onClick={openQuickConnect}
          />
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="grid size-10 place-items-center rounded-full border border-slate-900/10 text-slate-800 transition hover:bg-slate-900/5 focus-visible:outline-2 focus-visible:outline-emerald-700 md:hidden dark:border-white/15 dark:text-white dark:hover:bg-white/10"
          aria-label={isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <LuX size={20} aria-hidden="true" /> : <LuMenu size={20} aria-hidden="true" />}
        </button>
      </nav>

      <div
        id="mobile-navigation"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
        className={`fixed inset-0 z-60 transition-[visibility] duration-300 md:hidden ${isMenuOpen ? 'visible' : 'invisible delay-300'}`}
      >
        <button
          type="button"
          aria-label={t('nav.closeMenu')}
          tabIndex={isMenuOpen ? 0 : -1}
          className={`absolute inset-0 size-full bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeMenu}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.mobileMenu')}
          className={`absolute inset-y-0 right-0 flex h-dvh w-full max-w-sm flex-col overflow-y-auto border-l border-slate-200 bg-white p-5 shadow-2xl transition-transform duration-300 ease-out dark:border-slate-800 dark:bg-slate-950 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
            <span className="font-display text-lg font-bold text-slate-900 dark:text-white">{displayName}</span>
            <button
              ref={mobileCloseRef}
              type="button"
              className="grid size-9 place-items-center rounded-full text-slate-500 hover:bg-slate-900/5 dark:text-white/60 dark:hover:bg-white/10"
              aria-label={t('nav.closeMenu')}
              onClick={closeMenu}
            >
              <LuX size={20} aria-hidden="true" />
            </button>
          </div>

          <nav aria-label={t('nav.mobileMenu')} className="grid gap-1 py-5">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                ref={index === 0 ? firstMobileLinkRef : undefined}
                href={link.href}
                onClick={(event) => handleNavigation(event, link.href)}
                className={`rounded-xl px-4 py-3 text-base font-semibold transition ${activeView === link.view ? 'bg-emerald-700/10 text-emerald-900 dark:bg-[#d3ff69]/10 dark:text-[#d3ff69]' : 'text-slate-700 hover:bg-slate-900/5 dark:text-white/75 dark:hover:bg-white/5'}`}
                aria-current={activeView === link.view ? 'page' : undefined}
              >
                {t(link.label)}
              </a>
            ))}
          </nav>

          <LetsTalkButton
            label={t('nav.talk')}
            className="portfolio-mobile-menu__cta w-full"
            onClick={openQuickConnect}
          />

          <div className="portfolio-settings relative mt-4 flex w-full items-center gap-3">
            <SettingsButton
              buttonRef={mobileSettingsButtonRef}
              label={t('settings.title')}
              isOpen={isSettingsOpen && isMenuOpen}
              onClick={() => setIsSettingsOpen((open) => !open)}
            />
            <span className="text-sm font-semibold text-slate-700 dark:text-white/75">{t('settings.title')}</span>
            {isSettingsOpen && isMenuOpen && (
              <SettingsModal
                isOpen
                onClose={() => setIsSettingsOpen(false)}
                onOpenProfile={() => openProfileFromSettings(true)}
                onOpenProjects={() => {
                  closeMenu()
                  onNavigate('#projects')
                }}
                onViewResume={onViewResume}
                theme={theme}
                onToggleTheme={onToggleTheme}
              />
            )}
          </div>

          <div className="mt-auto border-t border-slate-200/80 pt-5 dark:border-slate-800">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-white/45">
              {t('nav.socialLinks')}
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-700/30 hover:text-emerald-800 dark:border-slate-700 dark:text-white/60 dark:hover:text-[#d3ff69]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {isQuickConnectOpen && (
        <div
          className="fixed inset-0 z-100 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeQuickConnect()
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-connect-title"
            className="w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white/90 p-5 text-slate-900 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 dark:text-white sm:p-7"
          >
            <header className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-800 dark:text-[#d3ff69]">{t('quickConnect.eyebrow')}</p>
                <h2 id="quick-connect-title" className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{t('quickConnect.title')}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-white/55">{t('quickConnect.description')}</p>
              </div>
              <button
                ref={quickConnectCloseRef}
                type="button"
                aria-label={t('settings.close')}
                className="grid size-9 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-900/5 focus-visible:outline-2 focus-visible:outline-emerald-700 dark:text-white/55 dark:hover:bg-white/10"
                onClick={closeQuickConnect}
              >
                <LuX size={19} aria-hidden="true" />
              </button>
            </header>

            <div className="grid gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white/70 p-3 transition hover:border-emerald-700/30 hover:shadow-md dark:border-slate-700 dark:bg-white/3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-700/10 text-emerald-800 dark:bg-[#d3ff69]/10 dark:text-[#d3ff69]">
                  <LuMail size={19} aria-hidden="true" />
                </span>
                <a className="min-w-0 flex-1 break-all text-sm font-semibold hover:text-emerald-800 dark:hover:text-[#d3ff69]" href="mailto:kindufikad075@gmail.com">
                  <span className="block text-xs font-medium text-slate-500 dark:text-white/45">{t('quickConnect.email')}</span>
                  kindufikad075@gmail.com
                </a>
                <button
                  type="button"
                  aria-label={`${t('contact.copy')} ${t('contact.email')}`}
                  title={copyStatus === 'email' ? t('contact.copied') : t('quickConnect.copyEmail')}
                  className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-900/5 hover:text-emerald-800 dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-[#d3ff69]"
                  onClick={() => copyContact('kindufikad075@gmail.com', 'email')}
                >
                  {copyStatus === 'email' ? <LuCheck size={17} aria-hidden="true" /> : <LuCopy size={16} aria-hidden="true" />}
                </button>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white/70 p-3 transition hover:border-emerald-700/30 hover:shadow-md dark:border-slate-700 dark:bg-white/3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-700/10 text-emerald-800 dark:bg-[#d3ff69]/10 dark:text-[#d3ff69]">
                  <LuPhone size={18} aria-hidden="true" />
                </span>
                <a className="min-w-0 flex-1 text-sm font-semibold hover:text-emerald-800 dark:hover:text-[#d3ff69]" href="tel:+251961806188">
                  <span className="block text-xs font-medium text-slate-500 dark:text-white/45">{t('quickConnect.phone')}</span>
                  +251961806188
                </a>
                <button
                  type="button"
                  aria-label={`${t('contact.copy')} ${t('contact.phone')}`}
                  title={copyStatus === 'phone' ? t('contact.copied') : t('quickConnect.copyPhone')}
                  className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-900/5 hover:text-emerald-800 dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-[#d3ff69]"
                  onClick={() => copyContact('+251961806188', 'phone')}
                >
                  {copyStatus === 'phone' ? <LuCheck size={17} aria-hidden="true" /> : <LuCopy size={16} aria-hidden="true" />}
                </button>
              </div>

              <a
                href="https://t.me/kindufikad"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-16 items-center gap-3 rounded-xl border border-slate-200/70 bg-white/70 p-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-sky-500/40 hover:shadow-md dark:border-slate-700 dark:bg-white/3"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-300">
                  <LuSend size={18} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium text-slate-500 dark:text-white/45">{t('quickConnect.telegram')}</span>
                  @kindufikad
                </span>
                <span aria-hidden="true" className="text-slate-400">↗</span>
              </a>
            </div>

            <p className="mt-4 min-h-5 text-xs text-emerald-800 dark:text-[#d3ff69]" role="status" aria-live="polite">
              {copyStatus === 'email' || copyStatus === 'phone'
                ? `${t('contact.copied')} ${t(`contact.${copyStatus}`)}`
                : copyStatus === 'error' ? t('contact.copyFailed') : ''}
            </p>
          </section>
        </div>
      )}

      {isProfileOpen && (
        <ProfileEditModal
          isOpen={isProfileOpen}
          profile={profile}
          onSave={onSaveProfile}
          onClose={() => {
            setIsProfileOpen(false)
            profileReturnFocusRef.current?.focus()
          }}
        />
      )}
    </header>
  )
}

export default Navbar
