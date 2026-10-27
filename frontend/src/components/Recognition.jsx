import { useEffect, useState } from 'react'
import { Award, ArrowDownToLine, ArrowUpRight, Check, ChevronLeft, ChevronRight, Quote, Star, Trash2, Upload, UserRound } from 'lucide-react'
import { useLanguage } from '../use-language.js'

const CERTIFICATES_STORAGE_KEY = 'portfolio-certificates'
const TESTIMONIALS_STORAGE_KEY = 'portfolio-testimonials'
const MAX_CERTIFICATE_IMAGE_SIZE = 2 * 1024 * 1024
const MAX_CLIENT_AVATAR_SIZE = 5 * 1024 * 1024
const emptyCertificateDraft = { title: '', organization: '', date: '', description: '', image: '' }
const emptyTestimonialDraft = { name: '', role: '', company: '', quote: '', rating: 5, avatar: '' }
const sampleTestimonials = [
  {
    id: 'sample-review-1',
    name: 'Sample client',
    role: 'Project client',
    company: 'Example project',
    source: 'Example',
    quote: 'This is sample review text for layout preview. Replace it with a real, approved client quote.',
    rating: 5,
    avatar: '',
    approved: true,
    isSample: true,
  },
  {
    id: 'sample-review-2',
    name: 'Sample client',
    role: 'Freelance client',
    company: 'Example project',
    source: 'Example',
    quote: 'Add a verified testimonial here to share feedback from a completed freelance project.',
    rating: 5,
    avatar: '',
    approved: true,
    isSample: true,
  },
]

function readStoredTestimonials() {
  try {
    const raw = window.localStorage.getItem(TESTIMONIALS_STORAGE_KEY)
    if (raw === null) return sampleTestimonials
    const stored = JSON.parse(raw)
    if (!Array.isArray(stored)) return sampleTestimonials

    return stored.filter((item) => (
      item && typeof item.id === 'string'
      && typeof item.name === 'string'
      && typeof item.role === 'string'
      && typeof item.company === 'string'
      && typeof item.quote === 'string'
      && Number.isInteger(item.rating)
      && item.rating >= 1 && item.rating <= 5
      && typeof item.approved === 'boolean'
      && (item.avatar === undefined || item.avatar === '' || (typeof item.avatar === 'string' && item.avatar.startsWith('data:image/')))
    )).map((item) => ({ ...item, avatar: item.avatar || '' }))
  } catch {
    return sampleTestimonials
  }
}

function makeAvatarPreview(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read the selected avatar'))
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Could not read the selected avatar'))
        return
      }

      const image = new Image()
      image.onerror = () => reject(new Error('Could not decode the selected avatar'))
      image.onload = () => {
        const canvas = document.createElement('canvas')
        const size = 160
        const side = Math.min(image.naturalWidth, image.naturalHeight)
        const left = (image.naturalWidth - side) / 2
        const top = (image.naturalHeight - side) / 2
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        if (!context) {
          reject(new Error('Could not prepare the selected avatar'))
          return
        }
        context.drawImage(image, left, top, side, side, 0, 0, size, size)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      image.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

function readStoredCertificates() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(CERTIFICATES_STORAGE_KEY) || '[]')
    if (!Array.isArray(stored)) return []

    return stored.filter((item) => (
      item && typeof item.id === 'string'
      && typeof item.title === 'string'
      && typeof item.organization === 'string'
      && typeof item.image === 'string'
      && item.image.startsWith('data:image/')
    ))
  } catch {
    return []
  }
}

function getCertificateUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return ''

  try {
    const url = new URL(value.trim(), window.location.origin)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : ''
  } catch {
    return ''
  }
}

function formatCertificateDate(value, language) {
  if (!value) return ''
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(language, { year: 'numeric', month: 'long', day: 'numeric' }).format(date)
}

function getInitials(name) {
  return String(name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function CertificationCard({ certification, t, language, onDelete }) {
  const certificateUrl = getCertificateUrl(certification.url)
  const imageUrl = certification.image || ''
  const downloadName = `${certification.title.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'certificate'}.jpg`

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white/80 transition duration-200 hover:-translate-y-1 hover:border-emerald-700/35 hover:shadow-lg dark:border-white/10 dark:bg-slate-900/45 dark:hover:border-emerald-300/30">
      <a
        href={imageUrl || certificateUrl || undefined}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${t('recognition.viewCertificate')}: ${certification.title}`}
        className="relative grid aspect-[4/3] place-items-center overflow-hidden border-b border-slate-200 bg-slate-100 p-3 dark:border-white/10 dark:bg-slate-950/50"
      >
        {imageUrl ? (
          <img src={imageUrl} alt={`${certification.title} certificate`} loading="lazy" className="size-full object-contain transition-transform duration-300 group-hover:scale-[1.02]" />
        ) : (
          <Award size={34} className="text-emerald-800/60 dark:text-emerald-200/60" aria-hidden="true" />
        )}
      </a>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-base font-semibold leading-6 text-slate-900 dark:text-white">{certification.title}</h4>
          {certification.date && (
            <time className="shrink-0 pt-1 text-right text-xs text-slate-500 dark:text-white/45" dateTime={certification.date}>
              {formatCertificateDate(certification.date, language)}
            </time>
          )}
        </div>
        <p className="mt-1 text-sm text-slate-600 dark:text-white/55">{certification.organization}</p>
        {certification.description && (
          <p className="mt-3 text-sm leading-5 text-slate-600 dark:text-white/50">{certification.description}</p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200 pt-4 dark:border-white/10">
          {imageUrl ? (
            <>
              <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-600 dark:text-emerald-200 dark:hover:text-emerald-100">
                {t('recognition.viewCertificate')} <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a href={imageUrl} download={downloadName} className="inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white">
                {t('recognition.downloadCertificate')} <ArrowDownToLine size={15} aria-hidden="true" />
              </a>
            </>
          ) : certificateUrl ? (
            <a href={certificateUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-600 dark:text-emerald-200 dark:hover:text-emerald-100">
              {t('recognition.viewCertificate')} <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          ) : (
            <p className="text-xs text-slate-400 dark:text-white/35">{t('recognition.linkUnavailable')}</p>
          )}
          {onDelete && (
            <button
              type="button"
              aria-label={`${t('recognition.deleteCertificate')}: ${certification.title}`}
              onClick={() => onDelete(certification.id)}
              className="ml-auto grid size-9 place-items-center rounded-md text-slate-500 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-red-600 dark:text-white/45 dark:hover:bg-red-400/10 dark:hover:text-red-200"
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

function TestimonialCarousel({ testimonials, t }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const total = testimonials.length
  const currentIndex = total ? activeIndex % total : 0
  const testimonial = testimonials[currentIndex]

  useEffect(() => {
    if (total < 2 || isPaused) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % total)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [isPaused, total])

  function showPrevious() {
    setActiveIndex((index) => (index - 1 + total) % total)
  }

  function showNext() {
    setActiveIndex((index) => (index + 1) % total)
  }

  return (
    <div
      className="rounded-lg border border-slate-200 bg-white/75 p-5 shadow-sm backdrop-blur-sm sm:p-8 dark:border-white/10 dark:bg-slate-900/45"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false)
      }}
    >
      {testimonial ? (
        <div key={testimonial.id || currentIndex} className="recognition-slide">
          <div className="flex items-center justify-between gap-4">
            <Quote size={26} className="text-emerald-700/70 dark:text-emerald-200/70" aria-hidden="true" />
            {Number.isFinite(Number(testimonial.rating)) && (
              <div className="flex items-center gap-1" role="img" aria-label={`${testimonial.rating} ${t('recognition.outOfFive')}`}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    size={15}
                    className={index < Math.max(0, Math.min(5, Number(testimonial.rating)))
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-slate-300 dark:text-white/20'}
                    aria-hidden="true"
                  />
                ))}
              </div>
            )}
          </div>

          <blockquote className="mt-5 max-w-3xl font-display text-xl leading-8 text-slate-800 sm:text-2xl sm:leading-9 dark:text-white/90">
            “{testimonial.quote}”
          </blockquote>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-slate-200 pt-5 dark:border-white/10">
            <div className="flex min-w-0 items-center gap-3">
              <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-emerald-800 text-sm font-semibold text-white dark:bg-emerald-200 dark:text-slate-950">
                {getInitials(testimonial.name)}
                {testimonial.avatar && (
                  <img
                    src={testimonial.avatar}
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                    onError={(event) => event.currentTarget.remove()}
                  />
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">{testimonial.name}</span>
                <span className="mt-0.5 block text-xs text-slate-600 dark:text-white/50">
                  {[testimonial.role, testimonial.company].filter(Boolean).join(' · ')}
                </span>
              </span>
            </div>
            {testimonial.source && (
              <span className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:text-white/55">
                {testimonial.isSample ? t('recognition.sampleBadge') : testimonial.source}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center px-4 py-8 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-white/45">
            <Quote size={21} aria-hidden="true" />
          </span>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 dark:text-white/55">{t('recognition.emptyTestimonials')}</p>
        </div>
      )}

      {total > 1 && (
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200 pt-4 dark:border-white/10">
          <div className="flex items-center gap-1.5" role="group" aria-label={t('recognition.testimonialNavigation')}>
            {testimonials.map((item, index) => (
              <button
                key={item.id || index}
                type="button"
                aria-label={`${t('recognition.goToTestimonial')} ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : undefined}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${index === currentIndex ? 'w-7 bg-emerald-700 dark:bg-emerald-200' : 'w-2.5 bg-slate-300 hover:bg-slate-400 dark:bg-white/20 dark:hover:bg-white/40'}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={t('recognition.previous')}
              onClick={showPrevious}
              className="grid size-10 place-items-center rounded-md border border-slate-200 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-emerald-700 dark:border-white/10 dark:text-white/75 dark:hover:bg-white/5"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={t('recognition.next')}
              onClick={showNext}
              className="grid size-10 place-items-center rounded-md border border-slate-200 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-emerald-700 dark:border-white/10 dark:text-white/75 dark:hover:bg-white/5"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Recognition({ certifications = [], testimonials = [] }) {
  const { t, language } = useLanguage()
  const [savedCertifications, setSavedCertifications] = useState(readStoredCertificates)
  const [certificateDraft, setCertificateDraft] = useState(emptyCertificateDraft)
  const [certificateError, setCertificateError] = useState('')
  const [savedTestimonials, setSavedTestimonials] = useState(readStoredTestimonials)
  const [testimonialDraft, setTestimonialDraft] = useState(emptyTestimonialDraft)
  const [testimonialError, setTestimonialError] = useState('')
  const suppliedCertifications = certifications.filter((item) => item?.title && item?.organization)
  const validCertifications = [...suppliedCertifications, ...savedCertifications]
  const suppliedTestimonials = testimonials.filter((item) => item?.name && item?.quote)
  const validTestimonials = [...suppliedTestimonials, ...savedTestimonials].filter((item) => item.approved)

  function persistTestimonials(nextTestimonials) {
    try {
      window.localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(nextTestimonials))
      setSavedTestimonials(nextTestimonials)
      setTestimonialError('')
      return true
    } catch {
      setTestimonialError(t('recognition.testimonialStorageError'))
      return false
    }
  }

  async function handleAvatarChange(event) {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setTestimonialError(t('recognition.invalidAvatar'))
      input.value = ''
      return
    }
    if (file.size > MAX_CLIENT_AVATAR_SIZE) {
      setTestimonialError(t('recognition.avatarTooLarge'))
      input.value = ''
      return
    }

    try {
      const avatar = await makeAvatarPreview(file)
      setTestimonialDraft((current) => ({ ...current, avatar }))
      setTestimonialError('')
    } catch {
      setTestimonialError(t('recognition.invalidAvatar'))
    } finally {
      input.value = ''
    }
  }

  function handleAddTestimonial(event) {
    event.preventDefault()
    const nextTestimonial = {
      ...testimonialDraft,
      id: globalThis.crypto?.randomUUID?.() || `testimonial-${Date.now()}`,
      name: testimonialDraft.name.trim(),
      role: testimonialDraft.role.trim(),
      company: testimonialDraft.company.trim(),
      quote: testimonialDraft.quote.trim(),
      approved: false,
      isSample: false,
    }
    if (!nextTestimonial.name || !nextTestimonial.role || !nextTestimonial.company || !nextTestimonial.quote) return

    if (persistTestimonials([nextTestimonial, ...savedTestimonials])) {
      setTestimonialDraft(emptyTestimonialDraft)
      event.currentTarget.reset()
    }
  }

  function handleToggleTestimonial(id) {
    persistTestimonials(savedTestimonials.map((item) => (
      item.id === id ? { ...item, approved: !item.approved } : item
    )))
  }

  function handleDeleteTestimonial(id) {
    persistTestimonials(savedTestimonials.filter((item) => item.id !== id))
  }

  function persistCertificates(nextCertificates) {
    try {
      window.localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(nextCertificates))
      setSavedCertifications(nextCertificates)
      setCertificateError('')
      return true
    } catch {
      setCertificateError(t('recognition.storageError'))
      return false
    }
  }

  function handleCertificateFileChange(event) {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setCertificateError(t('recognition.invalidCertificateImage'))
      input.value = ''
      return
    }
    if (file.size > MAX_CERTIFICATE_IMAGE_SIZE) {
      setCertificateError(t('recognition.certificateImageTooLarge'))
      input.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string' || !reader.result.startsWith('data:image/')) {
        setCertificateError(t('recognition.invalidCertificateImage'))
        return
      }
      setCertificateDraft((current) => ({ ...current, image: reader.result }))
      setCertificateError('')
    }
    reader.onerror = () => setCertificateError(t('recognition.invalidCertificateImage'))
    reader.readAsDataURL(file)
    input.value = ''
  }

  function handleAddCertificate(event) {
    event.preventDefault()
    if (!certificateDraft.image) {
      setCertificateError(t('recognition.invalidCertificateImage'))
      return
    }

    const nextCertificate = {
      ...certificateDraft,
      id: globalThis.crypto?.randomUUID?.() || `certificate-${Date.now()}`,
      title: certificateDraft.title.trim(),
      organization: certificateDraft.organization.trim(),
    }
    if (!nextCertificate.title || !nextCertificate.organization) return

    if (persistCertificates([nextCertificate, ...savedCertifications])) {
      setCertificateDraft(emptyCertificateDraft)
      event.currentTarget.reset()
    }
  }

  function handleDeleteCertificate(id) {
    persistCertificates(savedCertifications.filter((item) => item.id !== id))
  }

  return (
    <section id="recognition" className="min-h-screen border-t border-slate-900/10 dark:border-white/[0.07]">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-18 md:px-8 lg:py-20">
        <header className="mb-12 max-w-3xl">
          <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-200">
            <span className="h-px w-7 bg-emerald-700/70 dark:bg-emerald-200/70" />
            {t('recognition.eyebrow')}
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl dark:text-white">
            {t('recognition.title')}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-white/55">
            {t('recognition.description')}
          </p>
        </header>

        <section aria-labelledby="certifications-title">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 id="certifications-title" className="text-xl font-semibold text-slate-900 dark:text-white">{t('recognition.certifications')}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-white/50">{t('recognition.certificationsDescription')}</p>
            </div>
            {validCertifications.length > 0 && (
              <span className="shrink-0 text-xs tabular-nums text-slate-500 dark:text-white/45">{String(validCertifications.length).padStart(2, '0')}</span>
            )}
          </div>
          {validCertifications.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {validCertifications.map((certification, index) => (
                <CertificationCard
                  key={certification.id || `${certification.title}-${index}`}
                  certification={certification}
                  t={t}
                  language={language}
                  onDelete={savedCertifications.some((item) => item.id === certification.id) ? handleDeleteCertificate : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-36 items-center gap-4 rounded-lg border border-dashed border-slate-300 bg-white/45 px-5 py-6 dark:border-white/15 dark:bg-white/[0.02]">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-emerald-700/10 text-emerald-800 dark:bg-emerald-300/10 dark:text-emerald-200">
                <Award size={20} aria-hidden="true" />
              </span>
              <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-white/55">{t('recognition.emptyCertifications')}</p>
            </div>
          )}

          <details className="mt-5 rounded-lg border border-slate-200 bg-white/55 p-4 dark:border-white/10 dark:bg-white/[0.02]">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-slate-800 marker:hidden dark:text-white">
              <Upload size={16} aria-hidden="true" />
              {t('recognition.addCertificate')}
            </summary>
            <form className="mt-4 grid gap-4 border-t border-slate-200 pt-4 dark:border-white/10 sm:grid-cols-2" onSubmit={handleAddCertificate}>
              <label className="grid gap-1.5 text-xs font-semibold text-slate-700 dark:text-white/70">
                {t('recognition.certificateTitle')}
                <input required maxLength={120} value={certificateDraft.title} onChange={(event) => setCertificateDraft((current) => ({ ...current, title: event.target.value }))} className="min-h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 dark:border-white/15 dark:bg-slate-950/60 dark:text-white" />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-slate-700 dark:text-white/70">
                {t('recognition.issuingOrganization')}
                <input required maxLength={100} value={certificateDraft.organization} onChange={(event) => setCertificateDraft((current) => ({ ...current, organization: event.target.value }))} className="min-h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 dark:border-white/15 dark:bg-slate-950/60 dark:text-white" />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-slate-700 dark:text-white/70">
                {t('recognition.issueDate')}
                <input required type="date" value={certificateDraft.date} onChange={(event) => setCertificateDraft((current) => ({ ...current, date: event.target.value }))} className="min-h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 dark:border-white/15 dark:bg-slate-950/60 dark:text-white" />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-slate-700 dark:text-white/70">
                {t('recognition.certificateDescription')}
                <input maxLength={240} value={certificateDraft.description} onChange={(event) => setCertificateDraft((current) => ({ ...current, description: event.target.value }))} className="min-h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 dark:border-white/15 dark:bg-slate-950/60 dark:text-white" />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-slate-700 dark:text-white/70 sm:col-span-2">
                {t('recognition.certificateImage')}
                <input type="file" accept="image/*" onChange={handleCertificateFileChange} className="block w-full text-sm text-slate-600 file:mr-3 file:min-h-9 file:rounded-md file:border-0 file:bg-emerald-800 file:px-3 file:font-semibold file:text-white hover:file:bg-emerald-700 dark:text-white/60" />
              </label>
              {certificateDraft.image && (
                <img src={certificateDraft.image} alt={t('recognition.certificatePreview')} className="max-h-52 w-full rounded-md border border-slate-200 bg-slate-100 object-contain p-2 sm:col-span-2 dark:border-white/10 dark:bg-slate-950/50" />
              )}
              {certificateError && <p className="text-sm text-red-700 dark:text-red-300 sm:col-span-2" role="alert">{certificateError}</p>}
              <div className="flex items-center justify-between gap-4 sm:col-span-2">
                <p className="text-xs text-slate-500 dark:text-white/40">{t('recognition.storageNote')}</p>
                <button type="submit" className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:bg-emerald-200 dark:text-slate-950 dark:hover:bg-emerald-100">
                  <Upload size={15} aria-hidden="true" />
                  {t('recognition.saveCertificate')}
                </button>
              </div>
            </form>
          </details>
        </section>

        <section className="mt-14" aria-labelledby="testimonials-title">
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-white/45">{t('recognition.testimonialsEyebrow')}</p>
            <h2 id="testimonials-title" className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{t('recognition.testimonials')}</h2>
          </div>
          <TestimonialCarousel testimonials={validTestimonials} t={t} />
          {savedTestimonials.some((item) => item.isSample) && (
            <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-white/40">{t('recognition.sampleDisclosure')}</p>
          )}

          <details className="mt-5 rounded-lg border border-slate-200 bg-white/55 p-4 dark:border-white/10 dark:bg-white/[0.02]">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-slate-800 marker:hidden dark:text-white">
              <UserRound size={16} aria-hidden="true" />
              {t('recognition.manageReviews')} ({savedTestimonials.length})
            </summary>
            <div className="mt-4 grid gap-2 border-t border-slate-200 pt-4 dark:border-white/10">
              {savedTestimonials.map((item) => (
                <article key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-slate-950/30">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-emerald-800 text-xs font-semibold text-white dark:bg-emerald-200 dark:text-slate-950">
                      {item.avatar ? <img src={item.avatar} alt="" className="size-full object-cover" /> : getInitials(item.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">{item.name}</span>
                      <span className="block truncate text-xs text-slate-500 dark:text-white/45">{item.company} · {item.isSample ? t('recognition.sampleBadge') : item.approved ? t('recognition.approved') : t('recognition.pending')}</span>
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleTestimonial(item.id)}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:border-emerald-700/40 hover:text-emerald-800 dark:border-white/10 dark:text-white/70 dark:hover:text-emerald-200"
                    >
                      <Check size={14} aria-hidden="true" />
                      {item.approved ? t('recognition.hideReview') : t('recognition.approveReview')}
                    </button>
                    <button
                      type="button"
                      aria-label={`${t('recognition.deleteReview')}: ${item.name}`}
                      onClick={() => handleDeleteTestimonial(item.id)}
                      className="grid size-9 place-items-center rounded-md text-slate-500 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-red-600 dark:text-white/45 dark:hover:bg-red-400/10 dark:hover:text-red-200"
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
              {!savedTestimonials.length && (
                <p className="text-sm text-slate-500 dark:text-white/45">{t('recognition.noManagedReviews')}</p>
              )}
            </div>
          </details>

          <details className="mt-3 rounded-lg border border-slate-200 bg-white/55 p-4 dark:border-white/10 dark:bg-white/[0.02]">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-slate-800 marker:hidden dark:text-white">
              <Upload size={16} aria-hidden="true" />
              {t('recognition.addReview')}
            </summary>
            <form className="mt-4 grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2 dark:border-white/10" onSubmit={handleAddTestimonial}>
              <label className="grid gap-1.5 text-xs font-semibold text-slate-700 dark:text-white/70">
                {t('recognition.clientName')}
                <input required maxLength={100} value={testimonialDraft.name} onChange={(event) => setTestimonialDraft((current) => ({ ...current, name: event.target.value }))} className="min-h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 dark:border-white/15 dark:bg-slate-950/60 dark:text-white" />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-slate-700 dark:text-white/70">
                {t('recognition.clientRole')}
                <input required maxLength={100} value={testimonialDraft.role} onChange={(event) => setTestimonialDraft((current) => ({ ...current, role: event.target.value }))} className="min-h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 dark:border-white/15 dark:bg-slate-950/60 dark:text-white" />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-slate-700 dark:text-white/70">
                {t('recognition.clientCompany')}
                <input required maxLength={100} value={testimonialDraft.company} onChange={(event) => setTestimonialDraft((current) => ({ ...current, company: event.target.value }))} className="min-h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 dark:border-white/15 dark:bg-slate-950/60 dark:text-white" />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-slate-700 dark:text-white/70">
                {t('recognition.reviewSource')}
                <input maxLength={60} placeholder="Upwork" value={testimonialDraft.source || ''} onChange={(event) => setTestimonialDraft((current) => ({ ...current, source: event.target.value }))} className="min-h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 dark:border-white/15 dark:bg-slate-950/60 dark:text-white" />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-slate-700 dark:text-white/70 sm:col-span-2">
                {t('recognition.reviewText')}
                <textarea required maxLength={1200} rows={4} value={testimonialDraft.quote} onChange={(event) => setTestimonialDraft((current) => ({ ...current, quote: event.target.value }))} className="min-h-24 resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-normal leading-5 text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 dark:border-white/15 dark:bg-slate-950/60 dark:text-white" />
              </label>
              <div className="grid gap-1.5 text-xs font-semibold text-slate-700 dark:text-white/70 sm:col-span-2">
                <span>{t('recognition.rating')}</span>
                <div role="radiogroup" aria-label={t('recognition.rating')} className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      role="radio"
                      aria-checked={testimonialDraft.rating === rating}
                      aria-label={`${rating} ${t('recognition.outOfFive')}`}
                      onClick={() => setTestimonialDraft((current) => ({ ...current, rating }))}
                      className="grid size-9 place-items-center rounded-md hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-amber-500 dark:hover:bg-amber-400/10"
                    >
                      <Star size={18} className={rating <= testimonialDraft.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300 dark:text-white/25'} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
              <label className="grid gap-1.5 text-xs font-semibold text-slate-700 dark:text-white/70 sm:col-span-2">
                {t('recognition.clientPhoto')}
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="block w-full text-sm text-slate-600 file:mr-3 file:min-h-9 file:rounded-md file:border-0 file:bg-emerald-800 file:px-3 file:font-semibold file:text-white hover:file:bg-emerald-700 dark:text-white/60" />
              </label>
              {testimonialDraft.avatar && <img src={testimonialDraft.avatar} alt={t('recognition.avatarPreview')} className="size-16 rounded-full object-cover sm:col-span-2" />}
              {testimonialError && <p className="text-sm text-red-700 dark:text-red-300 sm:col-span-2" role="alert">{testimonialError}</p>}
              <p className="text-xs leading-5 text-slate-500 dark:text-white/45 sm:col-span-2">{t('recognition.reviewApprovalNote')}</p>
              <div className="flex items-center justify-between gap-4 sm:col-span-2">
                <span className="text-xs text-slate-500 dark:text-white/40">{t('recognition.testimonialStorageNote')}</span>
                <button type="submit" className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:bg-emerald-200 dark:text-slate-950 dark:hover:bg-emerald-100">
                  <Upload size={15} aria-hidden="true" />
                  {t('recognition.saveReview')}
                </button>
              </div>
            </form>
          </details>
        </section>
      </div>
    </section>
  )
}

export default Recognition
