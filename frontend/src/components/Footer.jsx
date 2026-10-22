import { useLanguage } from '../use-language.js'

const socialLinks = [
  { label: 'LinkedIn', mark: 'in', href: 'https://www.linkedin.com/' },
  { label: 'GitHub', mark: 'GH', href: 'https://github.com/' },
  { label: 'Dribbble', mark: 'Dr', href: 'https://dribbble.com/kindufikad075' },
  { label: 'Instagram', mark: 'IG', href: 'https://www.instagram.com/' },
]

function Footer({ profile }) {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-slate-900/10 dark:border-white/[0.07]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8">
        <a href="#top" className="flex w-fit items-center gap-3 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950 dark:text-white/75 dark:hover:text-white">
          <span className="grid size-8 place-items-center rounded-lg bg-[#d3ff69] text-[10px] font-extrabold text-[#10140b]">
            KF
          </span>
          {profile.fullName}
        </a>

        <nav aria-label="Social media" className="flex flex-wrap items-center gap-2">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="group inline-flex items-center gap-2 rounded-lg border border-slate-900/10 px-3 py-2 text-xs font-medium text-slate-600 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-700/30 hover:text-emerald-800 dark:border-white/8 dark:text-white/55 dark:hover:border-[#d3ff69]/30 dark:hover:text-[#d3ff69]"
            >
              <span className="font-display text-[11px] font-bold text-slate-500 transition-colors group-hover:text-emerald-800 dark:text-white/35 dark:group-hover:text-[#d3ff69]" aria-hidden="true">
                {link.mark}
              </span>
              {link.label}
            </a>
          ))}
        </nav>

        <p className="text-xs text-slate-500 dark:text-white/40">
          © {new Date().getFullYear()} {profile.fullName}. {t('footer.rights')}
        </p>
      </div>
    </footer>
  )
}

export default Footer