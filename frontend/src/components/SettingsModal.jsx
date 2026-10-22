import { useCallback, useEffect, useRef, useState } from 'react'
import { LuCheck, LuChevronDown, LuExternalLink, LuFileText, LuLanguages, LuMail, LuMoon, LuSun, LuX } from 'react-icons/lu'
import { SiGithub } from 'react-icons/si'
import { languages } from '../language-options.js'
import { useLanguage } from '../use-language.js'

const languageDisplay = {
  en: { flag: '🇬🇧', label: 'English' },
  am: { flag: '🇪🇹', label: 'አማርኛ (Amharic)' },
  fr: { flag: '🇫🇷', label: 'Français' },
}

function SettingsModal({ isOpen, onClose, onOpenProfile, onOpenProjects, onViewResume, theme, onToggleTheme }) {
  const settingsRef = useRef(null)
  const languageSelectorRef = useRef(null)
  const languageTriggerRef = useRef(null)
  const closeButtonRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const closeTimeoutRef = useRef(null)
  const closingRef = useRef(false)
  const { language, setLanguage, t } = useLanguage()
  const [isClosing, setIsClosing] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [deployedUrl, setDeployedUrl] = useState(() => {
    try {
      return window.localStorage.getItem('user_deployed_url') || ''
    } catch {
      return ''
    }
  })
  const [deployedUrlError, setDeployedUrlError] = useState('')

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    try {
      window.localStorage.setItem('user_deployed_url', deployedUrl)
    } catch (error) {
      console.warn('Unable to save the deployed project URL in local storage.', error)
    }
  }, [deployedUrl])

  const closePanel = useCallback((afterClose) => {
    if (closingRef.current) return
    closingRef.current = true
    setIsClosing(true)
    closeTimeoutRef.current = window.setTimeout(() => {
      onCloseRef.current()
      closingRef.current = false
      closeTimeoutRef.current = null
      afterClose?.()
    }, 180)
  }, [])

  function handleOpenDeployedProject() {
    const pastedUrl = deployedUrl.trim()
    if (!pastedUrl) {
      setDeployedUrlError('')
      closePanel(onOpenProjects)
      return
    }

    const normalizedUrl = /^https?:\/\//i.test(pastedUrl) ? pastedUrl : `https://${pastedUrl}`
    try {
      const parsedUrl = new URL(normalizedUrl)
      if (!['http:', 'https:'].includes(parsedUrl.protocol) || !parsedUrl.hostname) {
        throw new Error('Invalid deployment URL')
      }
      setDeployedUrlError('')
      const openedWindow = window.open(parsedUrl.href, '_blank')
      if (openedWindow) openedWindow.opener = null
    } catch {
      setDeployedUrlError(t('settings.deployedUrlInvalid'))
    }
  }

  useEffect(() => {
    if (!isOpen) return undefined
    closeButtonRef.current?.focus()

    function handlePointerDown(event) {
      if (!settingsRef.current?.contains(event.target)) closePanel()
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') closePanel()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current)
    }
  }, [closePanel, isOpen])

  useEffect(() => {
    if (!isLanguageOpen) return undefined

    function handlePointerDown(event) {
      if (!languageSelectorRef.current?.contains(event.target)) setIsLanguageOpen(false)
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        setIsLanguageOpen(false)
        languageTriggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLanguageOpen])

  if (!isOpen) return null

  return (
    <div
      ref={settingsRef}
      id="settings-popover"
      aria-hidden={isClosing}
      inert={isClosing}
      className={`settings-panel-enter absolute right-0 top-full z-60 mt-3 max-h-[calc(100dvh-5rem)] w-80 max-w-[calc(100vw-2rem)] origin-top-right overflow-y-auto overscroll-contain rounded-2xl border border-slate-200/80 bg-white/90 p-5 text-slate-900 shadow-2xl backdrop-blur-md transition-[opacity,transform] duration-200 ease-out dark:border-slate-800 dark:bg-slate-900/90 dark:text-white max-[680px]:fixed max-[680px]:inset-x-4 max-[680px]:top-18 max-[680px]:mt-0 max-[680px]:w-auto max-[680px]:max-w-none ${isClosing ? 'translate-y-2 scale-[0.98] opacity-0 pointer-events-none' : 'translate-y-0 scale-100 opacity-100'}`}
      role="dialog"
      aria-labelledby="settings-title"
      aria-modal="false"
    >
      <header className="flex items-start justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-slate-700/80">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-700/10 text-emerald-800 dark:bg-[#d3ff69]/10 dark:text-[#d3ff69]">
            <LuLanguages size={19} aria-hidden="true" />
          </span>
          <div>
            <h2 id="settings-title" className="text-base font-bold leading-5">{t('settings.title')}</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-white/50">{t('settings.subtitle')}</p>
          </div>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          aria-label={t('settings.close')}
          className="grid size-8 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-900/5 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-emerald-700 dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white"
          onClick={() => closePanel()}
        >
          <LuX size={18} aria-hidden="true" />
        </button>
      </header>

      <div className="divide-y divide-slate-200/80 dark:divide-slate-700/80">
        <section className="py-4">
          <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-white/45">
            <LuLanguages size={14} aria-hidden="true" />
            {t('settings.languageSection')}
          </h3>
          <div ref={languageSelectorRef} className="relative">
            <button
              ref={languageTriggerRef}
              id="settings-language"
              type="button"
              aria-haspopup="true"
              aria-expanded={isLanguageOpen}
              aria-controls="settings-language-options"
              className="relative flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white/70 p-3 text-left text-sm font-medium text-slate-800 outline-none transition hover:border-slate-300 focus-visible:border-emerald-700/50 focus-visible:ring-2 focus-visible:ring-emerald-700/10 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white dark:hover:border-slate-600"
              onClick={() => setIsLanguageOpen((open) => !open)}
            >
              <span className="flex items-center gap-2.5">
                <span aria-hidden="true" className="text-lg leading-none">{languageDisplay[language]?.flag}</span>
                <span>{languageDisplay[language]?.label || t('settings.chooseLanguage')}</span>
              </span>
              <LuChevronDown
                size={17}
                aria-hidden="true"
                className={`shrink-0 text-slate-500 transition-transform duration-200 dark:text-white/55 ${isLanguageOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isLanguageOpen && (
              <div
                id="settings-language-options"
                role="group"
                aria-label={t('settings.chooseLanguage')}
                className="absolute left-0 right-0 top-full z-30 mt-2 grid gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
              >
                {languages.map((option) => {
                  const display = languageDisplay[option.code]
                  if (!display) return null
                  const isSelected = language === option.code

                  return (
                    <button
                      key={option.code}
                      type="button"
                      lang={option.code}
                      aria-pressed={isSelected}
                      className={`flex min-h-10 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-sm transition ${isSelected ? 'bg-emerald-700/10 font-semibold text-emerald-900 dark:bg-[#d3ff69]/10 dark:text-[#d3ff69]' : 'text-slate-700 hover:bg-slate-900/5 dark:text-white/75 dark:hover:bg-white/5'}`}
                      onClick={() => {
                        setLanguage(option.code)
                        setIsLanguageOpen(false)
                        languageTriggerRef.current?.focus()
                      }}
                    >
                      <span aria-hidden="true" className="text-lg leading-none">{display.flag}</span>
                      <span className="flex-1">{display.label}</span>
                      {isSelected && <LuCheck size={16} aria-label={t('settings.selected')} />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        <section className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-white/65">
              {theme === 'dark' ? <LuMoon size={17} aria-hidden="true" /> : <LuSun size={17} aria-hidden="true" />}
            </span>
            <div>
              <h3 className="text-sm font-semibold">{t('settings.themeSection')}</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-white/50">
                {theme === 'dark' ? t('settings.dark') : t('settings.light')}
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={theme === 'dark'}
            aria-label={t('settings.appearance')}
            className={`relative h-7 w-12 shrink-0 rounded-full p-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${theme === 'dark' ? 'bg-emerald-800 dark:bg-[#d3ff69]' : 'bg-slate-300 dark:bg-slate-700'}`}
            onClick={onToggleTheme}
          >
            <span className={`block size-5 rounded-full bg-white shadow-sm transition-transform ${theme === 'dark' ? 'translate-x-5 dark:bg-slate-950' : 'translate-x-0'}`} />
          </button>
        </section>

        <section className="pt-4">
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-white/45">
            {t('settings.quickLinks')}
          </h3>
          <div className="grid gap-2">
            <button
              type="button"
              className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-slate-200/70 bg-white/55 px-3 text-left text-sm font-semibold transition hover:border-emerald-700/30 hover:bg-emerald-50/70 dark:border-slate-700 dark:bg-white/3 dark:hover:bg-white/7"
              onClick={() => closePanel(onViewResume)}
            >
              <LuFileText size={17} className="text-emerald-800 dark:text-[#d3ff69]" aria-hidden="true" />
              <span className="flex-1">{t('settings.resume')}</span>
              <LuExternalLink size={15} className="text-slate-400 dark:text-white/35" aria-hidden="true" />
            </button>
            <a
              href="https://github.com/kindufikad"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200/70 bg-white/55 px-3 text-sm font-semibold transition hover:border-emerald-700/30 hover:bg-emerald-50/70 dark:border-slate-700 dark:bg-white/3 dark:hover:bg-white/7"
            >
              <SiGithub size={17} className="text-slate-700 dark:text-white/80" aria-hidden="true" />
              <span className="flex-1">{t('settings.githubProfile')}</span>
              <LuExternalLink size={15} className="text-slate-400 dark:text-white/35" aria-hidden="true" />
            </a>
            <div className="rounded-xl border border-slate-200/70 bg-white/55 p-3 dark:border-slate-700 dark:bg-white/3">
              <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-white/75">
                <span aria-hidden="true" className="text-base">🚀</span>
                {t('settings.deployedProjects')}
              </h4>
              <label htmlFor="settings-deployed-url" className="mb-2 block text-xs text-slate-600 dark:text-white/60">
                {t('settings.deployedUrlLabel')}
              </label>
              <div className="flex min-w-0 gap-2">
                <input
                  id="settings-deployed-url"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  value={deployedUrl}
                  placeholder={t('settings.deployedUrlPlaceholder')}
                  aria-label={t('settings.deployedUrlLabel')}
                  aria-invalid={Boolean(deployedUrlError)}
                  aria-describedby={deployedUrlError ? 'settings-deployed-url-error' : undefined}
                  onChange={(event) => {
                    setDeployedUrl(event.target.value)
                    setDeployedUrlError('')
                  }}
                  className="min-h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-700/50 focus:ring-2 focus:ring-emerald-700/10 dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={handleOpenDeployedProject}
                  className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-lg bg-[#39204f] px-2.5 text-xs font-semibold text-white transition hover:bg-[#4c2c67] focus-visible:outline-2 focus-visible:outline-emerald-700"
                >
                  {t('settings.openDeployedProject')} <LuExternalLink size={13} aria-hidden="true" />
                </button>
              </div>
              {deployedUrlError && (
                <p id="settings-deployed-url-error" className="mt-2 text-xs text-red-600 dark:text-rose-300" role="alert">
                  {deployedUrlError}
                </p>
              )}
            </div>
            <a
              href="mailto:kindufikad075@gmail.com"
              className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200/70 bg-white/55 px-3 text-sm font-semibold transition hover:border-emerald-700/30 hover:bg-emerald-50/70 dark:border-slate-700 dark:bg-white/3 dark:hover:bg-white/7"
            >
              <LuMail size={17} className="text-emerald-800 dark:text-[#d3ff69]" aria-hidden="true" />
              <span className="flex-1">{t('settings.contactDirect')}</span>
              <LuExternalLink size={15} className="text-slate-400 dark:text-white/35" aria-hidden="true" />
            </a>
            <button
              type="button"
              className="mt-1 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-slate-600 transition hover:bg-slate-900/5 dark:text-white/60 dark:hover:bg-white/5"
              onClick={() => closePanel(onOpenProfile)}
            >
              <LuLanguages size={17} aria-hidden="true" />
              <span className="flex-1">{t('settings.profile')}</span>
              <LuExternalLink size={15} className="text-slate-400 dark:text-white/35" aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SettingsModal