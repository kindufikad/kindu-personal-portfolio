import { useEffect, useState } from 'react'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import Projects from './components/Projects.jsx'
import Recognition from './components/Recognition.jsx'
import { readStoredProfile } from './profile.js'
import Skills from './components/Skills.jsx'

const routeByHash = {
  hero: 'home',
  top: 'home',
  projects: 'projects',
  recognition: 'recognition',
  credentials: 'recognition',
  services: 'services',
  skills: 'services',
  about: 'about',
  contact: 'contact',
}

function getViewFromHash(hash = window.location.hash) {
  return routeByHash[hash.replace(/^#/, '')] || 'home'
}

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.localStorage.getItem('portfolio-theme') === 'dark' ? 'dark' : 'light'
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme)
  const [profile, setProfile] = useState(readStoredProfile)
  const [activeView, setActiveView] = useState(getViewFromHash)
  const [isResumeOpen, setIsResumeOpen] = useState(false)

  useEffect(() => {
    window.localStorage.setItem('portfolio-theme', theme)
    document.documentElement.dataset.theme = theme
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    try {
      window.localStorage.setItem('portfolio-profile', JSON.stringify(profile))
    } catch (error) {
      console.error('Unable to save the profile in this browser.', error)
    }
  }, [profile])

  useEffect(() => {
    function syncViewFromLocation() {
      setActiveView(getViewFromHash())
      window.scrollTo(0, 0)
    }

    window.addEventListener('hashchange', syncViewFromLocation)
    window.addEventListener('popstate', syncViewFromLocation)
    return () => {
      window.removeEventListener('hashchange', syncViewFromLocation)
      window.removeEventListener('popstate', syncViewFromLocation)
    }
  }, [])

  function navigateTo(href) {
    const nextView = getViewFromHash(href)
    setIsResumeOpen(false)
    if (window.location.hash !== href) {
      window.history.pushState(null, '', href)
    }
    setActiveView(nextView)
    window.scrollTo(0, 0)
  }

  function openResume() {
    if (activeView !== 'home') navigateTo('#hero')
    setIsResumeOpen(true)
  }

  return (
    <main
      id="top"
      className="isolate flex min-h-screen flex-col overflow-x-hidden bg-slate-50 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50"
    >
      <div className={`pointer-events-none fixed inset-0 z-0 hero-grid ${theme === 'light' ? 'hero-grid-light' : ''}`} />
      <div className="relative z-10 flex-1">
        <Navbar
          theme={theme}
          profile={profile}
          activeView={activeView}
          onNavigate={navigateTo}
          onViewResume={openResume}
          onSaveProfile={setProfile}
          onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
        />
        {activeView === 'home' && (
          <>
            <Hero
              profile={profile}
              isResumeOpen={isResumeOpen}
              onCloseResume={() => setIsResumeOpen(false)}
              onOpenResume={openResume}
              onNavigate={navigateTo}
            />
            <Footer profile={profile} />
          </>
        )}
        {activeView === 'projects' && <Projects />}
        {activeView === 'recognition' && <Recognition />}
        {activeView === 'services' && <Skills />}
        {activeView === 'about' && <About />}
        {activeView === 'contact' && <Contact />}
      </div>
      {activeView !== 'home' && (
        <div className="relative z-10 mt-auto">
          <Footer profile={profile} />
        </div>
      )}
    </main>
  )
}

export default App
