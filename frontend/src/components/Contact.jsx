import { useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'
import { CheckCircle2 } from 'lucide-react'
import { LuCheck, LuCopy, LuMail, LuMapPin, LuPhone } from 'react-icons/lu'
import { useLanguage } from '../use-language.js'

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? ''
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? ''
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? ''
const CONTACT_EMAIL = 'kindufikad075@gmail.com'
const emptyForm = { name: '', email: '', message: '' }

function Contact() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [copyStatus, setCopyStatus] = useState('')

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(null), 5000)
    return () => window.clearTimeout(timeout)
  }, [toast])

  useEffect(() => {
    if (!copyStatus) return undefined
    const timeout = window.setTimeout(() => setCopyStatus(''), 2000)
    return () => window.clearTimeout(timeout)
  }, [copyStatus])

  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY) {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY })
    }
  }, [])

  async function handleCopy(value, type) {
    try {
      await navigator.clipboard.writeText(value)
      setCopyStatus(type)
      setToast({ type: 'success', message: `${t('contact.copied')} ${t(`contact.${type}`)}` })
    } catch {
      setCopyStatus('error')
      setToast({ type: 'error', message: t('contact.copyFailed') })
    }
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setToast(null)

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.warn(
        'EmailJS configuration warning: missing VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, or VITE_EMAILJS_PUBLIC_KEY in .env',
      )
      setToast({ type: 'error', message: t('contact.configurationMissing') })
      return
    }

    const payload = {
      from_name: formData.name.trim(),
      from_email: formData.email.trim(),
      message: formData.message.trim(),
      to_name: 'Kindu Fikad',
      to_email: CONTACT_EMAIL,
    }

    if (!payload.from_name || !payload.from_email || !payload.message) {
      setToast({ type: 'error', message: 'Please complete all fields before sending.' })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        payload,
        {
          publicKey: EMAILJS_PUBLIC_KEY,
        },
      )

      console.log('EmailJS success:', result)
      setFormData(emptyForm)
      setToast({ type: 'success', message: t('contact.sent') })
    } catch (error) {
      console.error('EmailJS Error:', error)
      setToast({
        type: 'error',
        message: 'The message could not be sent. Please try again in a moment.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="flex min-h-screen items-center border-t border-slate-900/10 dark:border-white/[0.07]">
      {toast && (
        <div
          className={`pointer-events-auto fixed right-4 top-4 z-50 w-[min(92vw,26rem)] rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 ease-out transform ${
            toast.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-50/90 text-emerald-950 shadow-emerald-500/10 dark:bg-emerald-950/90 dark:text-emerald-50 translate-y-0 opacity-100'
              : 'border-red-500/30 bg-red-50/90 text-red-950 dark:bg-red-950/90 dark:text-red-50 translate-y-0 opacity-100'
          }`}
          role={toast.type === 'error' ? 'alert' : 'status'}
          aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
        >
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                toast.type === 'success'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 shadow-[0_0_0_6px_rgba(16,185,129,0.12)] dark:text-emerald-300'
                  : 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 animate-pulse" aria-hidden="true" />
              ) : (
                <span aria-hidden="true" className="text-lg font-bold">!</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-5 text-slate-900 dark:text-white">
                {toast.type === 'success' ? 'Message sent successfully!' : toast.message}
              </p>
              {toast.type === 'success' && (
                <p className="mt-1 text-sm text-emerald-700/80 dark:text-emerald-200/80">
                  I will get back to you soon!
                </p>
              )}
            </div>

            <button
              type="button"
              aria-label={t('settings.close')}
              onClick={() => setToast(null)}
              className="ml-2 rounded-full p-1 text-slate-500 transition hover:bg-slate-200/70 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-12 sm:px-6 sm:py-16 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:py-20">
        <div className="max-w-lg">
          <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#68d9d0]">
            <span className="h-px w-7 bg-[#68d9d0]/70" />
            {t('contact.eyebrow')}
          </p>
          <h2 className="font-display text-4xl font-medium leading-tight text-slate-950 dark:text-white sm:text-5xl">
            {t('contact.title')}
            <span className="mt-1 block text-slate-500 dark:text-white/40">{t('contact.titleAccent')}</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-600 dark:text-white/50">
            {t('contact.description')}
          </p>

          <div className="mt-8 grid gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white/60 p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-700/20 hover:shadow-md dark:border-white/10 dark:bg-white/4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-700/10 text-emerald-800 dark:bg-[#d3ff69]/10 dark:text-[#d3ff69]">
                <LuMail size={18} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-white/45">{t('contact.email')}</p>
                <a className="break-all text-sm font-semibold text-slate-800 hover:text-emerald-800 dark:text-white/80 dark:hover:text-[#d3ff69]" href="mailto:kindufikad075@gmail.com">
                  kindufikad075@gmail.com
                </a>
              </div>
              <button
                type="button"
                className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-900/5 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-emerald-700 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-[#d3ff69]"
                aria-label={`${t('contact.copy')} ${t('contact.email')}`}
                title={copyStatus === 'email' ? t('contact.copied') : t('contact.copy')}
                onClick={() => handleCopy('kindufikad075@gmail.com', 'email')}
              >
                {copyStatus === 'email' ? <LuCheck size={17} aria-hidden="true" /> : <LuCopy size={16} aria-hidden="true" />}
              </button>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white/60 p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-700/20 hover:shadow-md dark:border-white/10 dark:bg-white/4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-700/10 text-emerald-800 dark:bg-[#d3ff69]/10 dark:text-[#d3ff69]">
                <LuPhone size={18} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-white/45">{t('contact.phone')}</p>
                <a className="text-sm font-semibold text-slate-800 hover:text-emerald-800 dark:text-white/80 dark:hover:text-[#d3ff69]" href="tel:+251961806188">
                  +251961806188
                </a>
              </div>
              <button
                type="button"
                className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-900/5 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-emerald-700 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-[#d3ff69]"
                aria-label={`${t('contact.copy')} ${t('contact.phone')}`}
                title={copyStatus === 'phone' ? t('contact.copied') : t('contact.copy')}
                onClick={() => handleCopy('+251961806188', 'phone')}
              >
                {copyStatus === 'phone' ? <LuCheck size={17} aria-hidden="true" /> : <LuCopy size={16} aria-hidden="true" />}
              </button>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white/60 p-3 shadow-sm dark:border-white/10 dark:bg-white/4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-700/10 text-emerald-800 dark:bg-[#d3ff69]/10 dark:text-[#d3ff69]">
                <LuMapPin size={18} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-white/45">{t('contact.location')}</p>
                <a
                  className="text-sm font-semibold text-slate-800 hover:text-emerald-800 dark:text-white/80 dark:hover:text-[#d3ff69]"
                  href="https://www.google.com/maps/search/?api=1&query=Mertulemariyam%2C%20Ethiopia"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mertulemariyam, Ethiopia
                </a>
              </div>
            </div>
            <span className="sr-only" role="status" aria-live="polite">
              {copyStatus === 'error'
                ? t('contact.copyFailed')
                : copyStatus
                  ? `${t('contact.copied')} ${t(`contact.${copyStatus}`)}`
                  : ''}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-900/10 bg-white/80 p-5 shadow-sm sm:p-7 dark:border-white/10 dark:bg-white/2.5 dark:shadow-none">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-white/65">
              {t('contact.name')}
              <input
                autoComplete="name"
                id="contact-name"
                className="mt-2.5 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700/60 focus:ring-2 focus:ring-emerald-700/10 dark:border-white/10 dark:bg-[#0b0d0c]/70 dark:text-white dark:placeholder:text-white/25 dark:focus:border-[#d3ff69]/60 dark:focus:ring-[#d3ff69]/10"
                name="name"
                onChange={handleChange}
                placeholder={t('contact.namePlaceholder')}
                required
                value={formData.name}
              />
            </label>
            <label className="block text-xs font-semibold text-slate-700 dark:text-white/65">
              {t('contact.email')}
              <input
                autoComplete="email"
                className="mt-2.5 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700/60 focus:ring-2 focus:ring-emerald-700/10 dark:border-white/10 dark:bg-[#0b0d0c]/70 dark:text-white dark:placeholder:text-white/25 dark:focus:border-[#d3ff69]/60 dark:focus:ring-[#d3ff69]/10"
                name="email"
                onChange={handleChange}
                placeholder={t('contact.emailPlaceholder')}
                required
                type="email"
                value={formData.email}
              />
            </label>
          </div>

          <label className="mt-5 block text-xs font-semibold text-slate-700 dark:text-white/65">
            {t('contact.message')}
            <textarea
              className="mt-2.5 min-h-36 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700/60 focus:ring-2 focus:ring-emerald-700/10 dark:border-white/10 dark:bg-[#0b0d0c]/70 dark:text-white dark:placeholder:text-white/25 dark:focus:border-[#d3ff69]/60 dark:focus:ring-[#d3ff69]/10"
              name="message"
              onChange={handleChange}
              placeholder={t('contact.messagePlaceholder')}
              required
              rows="5"
              value={formData.message}
            />
          </label>

          <div className="mt-5 flex justify-end">
            <button
              className="inline-flex min-h-12 shrink-0 items-center gap-3 rounded-full bg-emerald-700 px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60 dark:bg-[#d3ff69] dark:text-[#11150d] dark:hover:bg-[#e1ff9a]"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? t('contact.sending') : t('contact.send')}
              {!isSubmitting && <span aria-hidden="true">↗</span>}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Contact