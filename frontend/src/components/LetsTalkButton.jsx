import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../use-language.js'

const greetingByLanguage = {
  en: "Welcome to Kindu Fikad's portfolio. Let's connect directly.",
  am: 'እንኳን ወደ ክንዱ ፍቃድ ፖርትፎሊዮ በደህና መጡ። በቀጥታ እንገናኝ።',
  fr: 'Bienvenue sur le portfolio de Kindu Fikad. Restons en contact.',
}

const speechLanguages = { en: 'en-US', am: 'am-ET', fr: 'fr-FR' }

function LetsTalkButton({ label, className, onClick }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const speechRef = useRef(null)
  const { language, t } = useLanguage()

  useEffect(() => () => {
    speechRef.current = null
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }, [])

  function handleClick(event) {
    if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
      const utterance = new SpeechSynthesisUtterance(greetingByLanguage[language] ?? greetingByLanguage.en)
      utterance.lang = speechLanguages[language] ?? speechLanguages.en
      const languageVoices = window.speechSynthesis.getVoices()
      const voice = languageVoices.find((item) => item.lang.toLowerCase().startsWith(language))
      if (voice) utterance.voice = voice

      const finishSpeaking = () => {
        if (speechRef.current === utterance) {
          speechRef.current = null
          setIsSpeaking(false)
        }
      }
      utterance.onend = finishSpeaking
      utterance.onerror = finishSpeaking
      speechRef.current = utterance
      window.speechSynthesis.cancel()
      setIsSpeaking(true)
      window.speechSynthesis.speak(utterance)
    }

    onClick(event)
  }

  return (
    <button
      type="button"
      className={`${className} lets-talk-button hover:scale-105 transition-transform ${isHovered ? 'is-hovered' : ''} ${isSpeaking ? 'is-speaking' : ''}`}
      aria-label={`${label}. ${t('hero.playGreeting')}`}
      title={t('hero.playGreeting')}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {label}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={`lets-talk-button__sound ${isSpeaking ? 'is-pulsing' : ''}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 8.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13" />
      </svg>
      <span aria-hidden="true" className="lets-talk-button__arrow">↗</span>
    </button>
  )
}

export default LetsTalkButton
