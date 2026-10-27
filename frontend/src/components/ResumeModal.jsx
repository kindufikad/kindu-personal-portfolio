import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Copy, Download, Mail, X } from 'lucide-react'

const EMAIL_ADDRESS = 'kindufikad075@gmail.com'

const experience = [
  {
    title: 'Full-stack Business Platform',
    description: 'Built client-facing product workflows with React interfaces, Django services, REST APIs, and admin dashboards.',
    technologies: 'React · Django · REST APIs',
  },
  {
    title: 'AI Automation Experience',
    description: 'Developed Python-based automation and intelligent product experiences with a focus on practical workflows.',
    technologies: 'Python · Artificial Intelligence · Automation',
  },
]

const skillGroups = [
  { label: 'Frontend', skills: 'React, JavaScript, HTML5, CSS3, Tailwind CSS' },
  { label: 'Backend', skills: 'Python, Django, Java, C++, PHP, .NET' },
  { label: 'Data & Tools', skills: 'PostgreSQL, MySQL, MongoDB, Git' },
]

function ResumeModal({ isOpen, profile, onClose }) {
  const [isClosing, setIsClosing] = useState(false)
  const [copyMessage, setCopyMessage] = useState('')
  const closeTimerRef = useRef(null)

  const closeModal = useCallback(() => {
    if (closeTimerRef.current) return
    setIsClosing(true)
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null
      onClose()
    }, 180)
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') closeModal()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      window.clearTimeout(closeTimerRef.current)
    }
  }, [closeModal, isOpen])

  useEffect(() => {
    if (!copyMessage) return undefined
    const timeout = window.setTimeout(() => setCopyMessage(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [copyMessage])

  if (!isOpen) return null

  async function copyEmail() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(EMAIL_ADDRESS)
      } else {
        throw new Error('Clipboard API unavailable')
      }
      setCopyMessage('Email copied to clipboard.')
    } catch {
      const input = document.createElement('textarea')
      input.value = EMAIL_ADDRESS
      input.setAttribute('readonly', '')
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      const copied = document.execCommand('copy')
      document.body.removeChild(input)
      setCopyMessage(copied ? 'Email copied to clipboard.' : 'Could not copy the email address.')
    }
  }

  return createPortal((
    <div
      className={`resume-print-overlay fixed inset-0 z-70 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-md transition-opacity duration-200 sm:p-6 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-modal-title"
        className={`resume-printable flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition duration-200 dark:border-white/10 dark:bg-[#151916] ${isClosing ? 'translate-y-2 scale-[0.99]' : 'translate-y-0 scale-100'}`}
      >
        <header className="flex items-start justify-between gap-5 border-b border-slate-200 px-5 py-5 dark:border-white/10 sm:px-8 sm:py-6">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-[#d3ff69]">Resume / CV</p>
            <h2 id="resume-modal-title" className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl">
              {profile.fullName || 'Kindu Fikad'}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-white/65">Full Stack Developer</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-white/55">
              Computer Science student and full-stack developer building practical digital products with React, Django, and Python. Interested in thoughtful user experiences, reliable software, and useful AI-powered tools.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close resume"
            onClick={closeModal}
            className="resume-print-hidden grid size-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-900/5 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-emerald-700 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="resume-printable__body min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-700/15 bg-emerald-700/4 px-4 py-3 dark:border-[#d3ff69]/15 dark:bg-[#d3ff69]/4">
            <Mail size={17} className="shrink-0 text-emerald-800 dark:text-[#d3ff69]" aria-hidden="true" />
            <a className="min-w-0 flex-1 break-all text-sm font-medium text-slate-800 hover:text-emerald-800 dark:text-white/80 dark:hover:text-[#d3ff69]" href={`mailto:${EMAIL_ADDRESS}`}>
              {EMAIL_ADDRESS}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              aria-label="Copy email address"
              title="Copy email address"
              className="resume-print-hidden grid size-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-white hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-emerald-700 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-[#d3ff69]"
            >
              {copyMessage.startsWith('Email copied') ? <Check size={17} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            </button>
          </div>

          <section aria-labelledby="resume-preview-title" className="resume-printable__section mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/50 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-white/10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-[#d3ff69]">Resume Preview</p>
                <h3 id="resume-preview-title" className="mt-1 font-display text-lg font-semibold text-slate-900 dark:text-white">Experience & Skills</h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-white/40">Kindu_Fikad_Resume.pdf</span>
            </div>

            <div className="grid gap-6 pt-5 sm:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-white/45">Selected Project Experience</h4>
                <div className="mt-4 space-y-5">
                  {experience.map((item) => (
                    <article key={item.title} className="border-l-2 border-emerald-700/30 pl-4 dark:border-[#d3ff69]/35">
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h5>
                      <p className="mt-1.5 text-xs leading-5 text-slate-600 dark:text-white/55">{item.description}</p>
                      <p className="mt-2 text-[10px] font-semibold text-emerald-800 dark:text-[#d3ff69]/80">{item.technologies}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-white/45">Technical Skills</h4>
                <div className="mt-4 space-y-4">
                  {skillGroups.map((group) => (
                    <div key={group.label}>
                      <p className="text-xs font-semibold text-slate-800 dark:text-white/80">{group.label}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-white/50">{group.skills}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="resume-print-hidden flex flex-wrap gap-2.5 border-t border-slate-200 bg-white/80 px-5 py-4 dark:border-white/10 dark:bg-[#151916] sm:px-8">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:bg-[#d3ff69] dark:text-slate-950 dark:hover:bg-[#e1ff9d]"
          >
            <Download size={16} aria-hidden="true" />
            Download PDF
          </button>
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-emerald-700 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/5"
          >
            {copyMessage.startsWith('Email copied') ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            Copy Email
          </button>
          <a
            href={`mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent('Hello Kindu')}`}
            onClick={closeModal}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-emerald-700 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/5"
          >
            <Mail size={16} aria-hidden="true" />
            Contact Me
          </a>
          <button
            type="button"
            onClick={closeModal}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-emerald-700 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/5"
          >
            Close
          </button>
        </footer>

        {copyMessage && (
          <div className="resume-print-hidden pointer-events-none absolute bottom-20 left-1/2 z-10 -translate-x-1/2 rounded-lg border border-emerald-700/20 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-lg dark:border-[#d3ff69]/20 dark:bg-slate-900 dark:text-white" role="status" aria-live="polite">
            {copyMessage}
          </div>
        )}
      </section>
    </div>
  ), document.body)
}

export default ResumeModal