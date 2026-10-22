import { useLanguage } from '../use-language.js'

function About() {
  const { t } = useLanguage()
  const capabilities = [
    { title: t('about.fullStack'), details: 'React · Django · Python · Node', accent: 'border-t-emerald-500' },
    { title: t('about.database'), details: 'MySQL · PostgreSQL · MongoDB', accent: 'border-t-cyan-500' },
    { title: t('about.problemSolver'), details: t('about.problemSolverDetails'), accent: 'border-t-amber-500' },
    { title: t('about.cleanUi'), details: t('about.cleanUiDetails'), accent: 'border-t-rose-500' },
  ]
  const interests = [
    t('about.interestArchitecture'),
    t('about.interestApi'),
    t('about.interestAi'),
    t('about.interestOperatingSystems'),
    t('about.interestSecurity'),
  ]

  return (
    <section id="about" className="border-t border-slate-900/10 dark:border-white/[0.07]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-[#d3ff69]">
              <span className="h-px w-7 bg-current opacity-70" />
              {t('about.eyebrow')}
            </p>
            <h2 className="font-display max-w-2xl text-4xl font-medium leading-tight text-slate-950 dark:text-white sm:text-5xl">
              {t('about.title')}
              <span className="block text-slate-500 dark:text-white/40">{t('about.titleAccent')}</span>
            </h2>
            <div className="mt-7 max-w-3xl space-y-4">
              <p className="text-base leading-7 text-slate-700 dark:text-white/70 sm:text-lg sm:leading-8">
                {t('about.paragraph1')}
              </p>
              <p className="text-sm leading-7 text-slate-600 dark:text-white/55 sm:text-base">
                {t('about.paragraph2')}
              </p>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60 sm:p-7 lg:col-span-5">
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800 dark:text-[#d3ff69]">
              {t('about.educationTitle')}
            </p>
            <dl className="space-y-5">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/45">
                  {t('about.degreeLabel')}
                </dt>
                <dd className="mt-1.5 text-base font-semibold leading-6 text-slate-900 dark:text-white/90">
                  {t('about.degree')}
                </dd>
              </div>
              <div className="border-t border-slate-900/10 pt-5 dark:border-white/10">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/45">
                  {t('about.focusLabel')}
                </dt>
                <dd className="mt-1.5 text-sm leading-6 text-slate-700 dark:text-white/70">
                  {t('about.focus')}
                </dd>
              </div>
              <div className="border-t border-slate-900/10 pt-5 dark:border-white/10">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/45">
                  {t('about.locationLabel')}
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-slate-800 dark:text-white/80">
                  {t('about.location')}
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {capabilities.map((capability) => (
            <article
              key={capability.title}
              className={`rounded-2xl border border-slate-200/80 border-t-2 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60 ${capability.accent}`}
            >
              <h3 className="text-base font-bold text-slate-900 dark:text-white/90">
                {capability.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-white/55">
                {capability.details}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200/80 bg-white/50 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/40 sm:p-7">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white/90">
            {t('about.interestsTitle')}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {interests.map((interest) => (
              <li
                key={interest}
                className="rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-white/3 dark:text-white/65"
              >
                {interest}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default About