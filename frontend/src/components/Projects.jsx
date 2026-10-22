import { useEffect, useState } from 'react'
import { useLanguage } from '../use-language.js'

const PROJECTS_API_URL = 'http://127.0.0.1:8000/api/projects/'

function getTechnologies(value) {
  if (Array.isArray(value)) {
    return value.map((technology) => String(technology).trim()).filter(Boolean)
  }

  return String(value ?? '')
    .split(/[,|\n]/)
    .map((technology) => technology.trim())
    .filter(Boolean)
}

function getExternalUrl(value) {
  if (typeof value !== 'string' || !value.trim() || value.trim() === '#') return ''

  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : ''
  } catch {
    return ''
  }
}

function normalizeProject(project) {
  return {
    ...project,
    deployUrl: getExternalUrl(project.deployUrl ?? project.deploy_url ?? project.live_link),
    githubUrl: getExternalUrl(project.githubUrl ?? project.github_url ?? project.github_link),
  }
}

function ProjectPlaceholder({ title, index }) {
  const { t } = useLanguage()

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-between overflow-hidden bg-[radial-gradient(ellipse_at_75%_30%,rgba(16,185,129,0.12),transparent_40%),linear-gradient(135deg,#f0fdf4,#ffffff_60%,#ecfdf5)] px-6 sm:px-8 dark:bg-[radial-gradient(ellipse_at_75%_30%,rgba(104,217,208,0.16),transparent_40%),linear-gradient(135deg,#18201c,#101412_60%,#151d17)]"
    >
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(15,23,42,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.07)_1px,transparent_1px)] bg-size-[32px_32px] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]" />
      <span className="relative font-display text-5xl font-semibold text-slate-900/20 dark:text-white/15 sm:text-7xl">
        {title.slice(0, 2).toUpperCase() || 'PR'}
      </span>
      <span className="relative self-start pt-5 font-mono text-[10px] tracking-[0.18em] text-slate-600/70 dark:text-white/35">
        {t('projects.projectLabel')} / {String(index + 1).padStart(2, '0')}
      </span>
      <span className="absolute -bottom-16 right-[22%] size-44 rounded-full border border-emerald-700/15 dark:border-[#d3ff69]/15 sm:size-56" />
      <span className="absolute -bottom-10 right-[27%] size-32 rounded-full border border-emerald-600/20 dark:border-[#68d9d0]/20 sm:size-40" />
    </div>
  )
}

function ProjectCard({ project, index }) {
  const { t } = useLanguage()
  const technologies = getTechnologies(project.technologies)
  const deployUrl = project.deployUrl
  const githubUrl = project.githubUrl
  const imageSource = project.image_url || project.image
  const imageUrl = imageSource
    ? new URL(imageSource, PROJECTS_API_URL).href
    : null

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-900/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-700/25 hover:shadow-[0_18px_55px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#101412] dark:shadow-none dark:hover:border-white/20 dark:hover:shadow-[0_18px_55px_rgba(0,0,0,0.28)]">
      <div className="relative aspect-16/10 overflow-hidden border-b border-white/8">
        <ProjectPlaceholder title={project.title ?? ''} index={index} />
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${project.title} preview`}
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(event) => event.currentTarget.remove()}
          />
        )}
        <span className="absolute bottom-3 right-3 rounded-md border border-slate-900/10 bg-white/85 px-2 py-1 font-mono text-[10px] text-slate-600 backdrop-blur dark:border-white/10 dark:bg-[#0b0d0c]/75 dark:text-white/50">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold text-slate-950 transition-colors group-hover:text-emerald-800 dark:text-white dark:group-hover:text-[#d3ff69]">
          {project.title || 'Untitled project'}
        </h3>
        <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600 dark:text-white/55">
          {project.description || 'Project details will be added soon.'}
        </p>

        {technologies.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label={t('projects.technologies')}>
            {technologies.map((technology) => (
              <li
                key={technology}
                className="rounded-md border border-slate-900/10 bg-slate-100 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 dark:border-white/8 dark:bg-white/4 dark:text-white/65"
              >
                {technology}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-slate-900/10 pt-5 dark:border-white/8">
          {githubUrl ? (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={deployUrl
                ? 'inline-flex min-h-9 items-center gap-2 rounded-md border border-slate-900/15 px-3 text-xs font-semibold text-slate-700 transition-colors hover:border-emerald-700/50 hover:text-emerald-800 dark:border-white/15 dark:text-white/65 dark:hover:text-[#d3ff69]'
                : 'inline-flex min-h-9 items-center gap-2 rounded-md bg-[#39204f] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#4c2c67]'}
            >
              {deployUrl ? 'GitHub' : t('projects.githubCode')} <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <span aria-disabled="true" className="inline-flex min-h-9 items-center rounded-md border border-slate-900/10 px-3 text-xs font-medium text-slate-400 dark:border-white/10 dark:text-white/35">{t('projects.githubSoon')}</span>
          )}
          {deployUrl ? (
            <a
              href={deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 items-center gap-2 rounded-md bg-[#39204f] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#4c2c67]"
            >
              {t('projects.liveDemo')} <span aria-hidden="true">↗</span>
            </a>
          ) : githubUrl ? null : (
            <span aria-disabled="true" className="inline-flex min-h-9 items-center rounded-md border border-slate-900/10 px-3 text-xs font-medium text-slate-400 dark:border-white/10 dark:text-white/35">{t('projects.demoSoon')}</span>
          )}
        </div>
      </div>
    </article>
  )
}

function Projects() {
  const { t } = useLanguage()
  const [projects, setProjects] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProjects() {
      setStatus('loading')
      setErrorMessage('')

      try {
        const response = await fetch(PROJECTS_API_URL, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`The projects service returned ${response.status}.`)
        }

        const data = await response.json()
        const results = Array.isArray(data) ? data : data?.results

        if (!Array.isArray(results)) {
          throw new Error('The projects service returned an unexpected response.')
        }

        const projectsData = results.map(normalizeProject)
        setProjects(projectsData)
        setStatus(results.length > 0 ? 'success' : 'empty')
      } catch (error) {
        if (error.name === 'AbortError') return

        setErrorMessage(error.message || 'Unable to load projects right now.')
        setStatus('error')
      }
    }

    loadProjects()

    return () => controller.abort()
  }, [retryCount])

  return (
    <section id="projects" className="flex min-h-screen items-center border-t border-slate-900/10 dark:border-white/[0.07]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 lg:py-20">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#68871a]">
              <span className="h-px w-7 bg-[#9abf37]" />
              {t('projects.eyebrow')}
            </p>
            <h2 className="font-display text-4xl font-semibold leading-tight text-slate-950 dark:text-white sm:text-5xl">
              {t('projects.title')}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-600 dark:text-white/50 sm:text-right">
            {t('projects.description')}
          </p>
        </div>

        {status === 'loading' && (
          <div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            aria-label={t('projects.loading')}
            aria-busy="true"
          >
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-lg border border-slate-900/10 bg-white dark:border-white/8 dark:bg-[#101412]"
              >
                <div className="aspect-16/10 animate-pulse bg-slate-200 dark:bg-white/5" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/5 animate-pulse rounded bg-slate-200 dark:bg-white/8" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-white/5" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {status === 'error' && (
          <div
            role="alert"
            className="flex flex-col items-start gap-4 rounded-lg border border-red-300 bg-red-50 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-[#ff927d]/20 dark:bg-[#ff927d]/5"
          >
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{t('projects.error')}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-white/50">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="rounded-md border border-slate-900/15 px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:border-emerald-700/50 hover:text-emerald-800 dark:border-white/15 dark:text-white dark:hover:border-[#d3ff69]/50 dark:hover:text-[#d3ff69]"
            >
              {t('projects.tryAgain')}
            </button>
          </div>
        )}

        {status === 'empty' && (
          <p className="rounded-lg border border-slate-900/10 bg-white px-6 py-10 text-center text-sm text-slate-600 dark:border-white/8 dark:bg-white/2.5 dark:text-white/50">
            {t('projects.empty')}
          </p>
        )}

        {status === 'success' && (
          <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.id ?? `${project.title}-${index}`} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Projects