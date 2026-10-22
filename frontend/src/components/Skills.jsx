import { useLanguage } from '../use-language.js'
import {
  SiAndroid,
  SiBootstrap,
  SiCplusplus,
  SiCss,
  SiDjango,
  SiDotnet,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTailwindcss,
} from 'react-icons/si'
import { TbBinaryTree2, TbBrain, TbCoffee, TbCpu, TbPalette, TbShieldLock } from 'react-icons/tb'

function FigmaIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 38 57" width={size} height={size * 1.5} aria-hidden="true">
      <path fill="#F24E1E" d="M9.5 0A9.5 9.5 0 0 0 9.5 19H19V0H9.5Z" />
      <path fill="#FF7262" d="M19 0h9.5a9.5 9.5 0 0 1 0 19H19V0Z" />
      <path fill="#A259FF" d="M9.5 19A9.5 9.5 0 0 0 9.5 38H19V19H9.5Z" />
      <path fill="#1ABCFE" d="M19 19h9.5a9.5 9.5 0 0 1 0 19H19V19Z" />
      <path fill="#0ACF83" d="M9.5 38H19v9.5a9.5 9.5 0 1 1-9.5-9.5Z" />
    </svg>
  )
}

const skillsData = [
  {
    category: 'Frontend',
    tone: 'text-emerald-800 dark:text-emerald-300',
    skills: [
      { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
      { name: 'CSS3', icon: SiCss, color: '#1572B6' },
      { name: 'JavaScript', icon: SiJavascript, color: '#111827', background: '#F7DF1E' },
      { name: 'Bootstrap', icon: SiBootstrap, color: '#7952B3' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'React', icon: SiReact, color: '#61DAFB' },
      { name: 'Figma', icon: FigmaIcon, color: '#F24E1E', multicolor: true },
      { name: 'Graphics Design', icon: TbPalette, color: '#C026D3' },
    ],
  },
  {
    category: 'Backend',
    tone: 'text-cyan-800 dark:text-cyan-300',
    skills: [
      { name: 'Java', icon: TbCoffee, color: '#ED8B00' },
      { name: 'C++', icon: SiCplusplus, color: '#00599C' },
      { name: 'Python', icon: SiPython, color: '#3776AB' },
      { name: 'Django', icon: SiDjango, color: '#FFFFFF', background: '#092E20' },
      { name: 'PHP', icon: SiPhp, color: '#777BB4' },
      { name: '.NET Framework', icon: SiDotnet, color: '#512BD4' },
      { name: 'Android', icon: SiAndroid, color: '#3DDC84' },
    ],
  },
  {
    category: 'Database',
    tone: 'text-amber-800 dark:text-amber-300',
    skills: [
      { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
      { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
      { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
    ],
  },
  {
    category: 'Core Computer Science & Security',
    tone: 'text-rose-800 dark:text-rose-300',
    skills: [
      { name: 'Algorithms', icon: TbBinaryTree2, color: '#64748B' },
      { name: 'Operating Systems', icon: TbCpu, color: '#F97316' },
      { name: 'Artificial Intelligence', icon: TbBrain, color: '#8B5CF6' },
      { name: 'Cyber Security', icon: TbShieldLock, color: '#DC2626' },
      { name: 'Git', icon: SiGit, color: '#F05032' },
    ],
  },
]

function Skills() {
  const { t } = useLanguage()

  return (
    <section id="skills" className="flex min-h-screen items-center border-t border-slate-900/10 dark:border-white/[0.07]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 lg:py-20">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#68d9d0]">
              <span className="h-px w-7 bg-[#68d9d0]/70" />
              {t('skills.eyebrow')}
            </p>
            <h2 className="font-display text-4xl font-medium leading-tight text-slate-950 dark:text-white sm:text-5xl">
              {t('skills.title')}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-600 dark:text-white/50 sm:text-right">
            {t('skills.description')}
          </p>
        </div>

        <div className="w-full overflow-hidden rounded-2xl border border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/40">
          <div className="grid gap-2 border-b border-slate-200/60 bg-slate-50/70 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:grid-cols-[minmax(12rem,1fr)_3fr] sm:px-6 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white/45">
            <span>Category</span>
            <span>Skill badges and icon marks</span>
          </div>
          <div className="divide-y divide-slate-200/60 dark:divide-slate-800">
            {skillsData.map((group) => (
              <div
                key={group.category}
                className="grid gap-4 px-4 py-5 sm:grid-cols-[minmax(12rem,1fr)_3fr] sm:items-start sm:px-6 sm:py-6"
              >
                <h3 className={`w-fit rounded-lg bg-slate-50/80 px-3 py-2 text-sm font-semibold sm:mt-0.5 dark:bg-slate-900/70 ${group.tone}`}>
                  {group.category}
                </h3>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {group.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className="group flex min-h-14 min-w-0 items-center gap-2 rounded-xl border border-slate-200/70 bg-white/80 px-2.5 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:gap-2.5 sm:px-3 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700"
                    >
                      <span
                        aria-hidden="true"
                        className="grid size-9 shrink-0 place-items-center rounded-lg border border-slate-200/70 shadow-inner transition-colors group-hover:border-slate-300 dark:border-slate-700 dark:group-hover:border-slate-600"
                        style={{
                          color: skill.multicolor ? undefined : skill.color,
                          backgroundColor: skill.background || `${skill.color}14`,
                        }}
                      >
                        <skill.icon size={18} />
                      </span>
                      <span className="min-w-0 wrap-break-word text-xs font-semibold leading-4 text-slate-800 dark:text-white/75">
                        {skill.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills