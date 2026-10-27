import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '../use-language.js'
import profileImage from '../assets/kkkk.jpg'

async function makeImagePreview(file) {
  const source = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => typeof reader.result === 'string'
      ? resolve(reader.result)
      : reject(new Error('Could not read the selected image'))
    reader.onerror = () => reject(reader.error || new Error('Could not read the selected image'))
    reader.readAsDataURL(file)
  })
  const image = await new Promise((resolve, reject) => {
    const loadedImage = new Image()
    loadedImage.onload = () => resolve(loadedImage)
    loadedImage.onerror = () => reject(new Error('Could not decode the selected image'))
    loadedImage.src = source
  })
  const maxDimension = 720
  const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not prepare the selected image')
  context.fillStyle = '#fff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.82)
}

function ProfileEditModal({ isOpen, profile, onSave, onClose }) {
  const [draft, setDraft] = useState(profile)
  const [imageError, setImageError] = useState('')
  const [isClosing, setIsClosing] = useState(false)
  const nameInputRef = useRef(null)
  const closeTimerRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const { t } = useLanguage()

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  const closeModal = useCallback(() => {
    if (closeTimerRef.current) return
    setIsClosing(true)
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null
      onCloseRef.current()
    }, 180)
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    nameInputRef.current?.focus()

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

  if (!isOpen) return null

  function updateField(event) {
    const { name, value } = event.target
    setDraft((current) => ({ ...current, [name]: value }))
  }

  async function handlePictureChange(event) {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
      setImageError(t('profile.invalidImage'))
      input.value = ''
      return
    }

    try {
      setImageError('')
      const picture = await makeImagePreview(file)
      setDraft((current) => ({ ...current, picture }))
    } catch {
      setImageError(t('profile.invalidImage'))
    } finally {
      input.value = ''
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSave({ ...draft, fullName: draft.fullName.trim() })
    closeModal()
  }

  return createPortal((
    <div
      className={`profile-modal-backdrop ${isClosing ? 'is-closing' : ''}`}
      aria-hidden={isClosing}
      inert={isClosing}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal()
      }}
    >
      <section
        className={`profile-modal ${isClosing ? 'is-closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        <div className="profile-modal__header">
          <div>
            <p>{t('settings.profile')}</p>
            <h2 id="profile-modal-title">{t('profile.title')}</h2>
          </div>
          <button type="button" className="profile-modal__close" aria-label={t('settings.close')} onClick={closeModal}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </div>

        <div className="profile-modal__body">
          <form onSubmit={handleSubmit}>
            <div className="profile-picture-field">
              <img
                className="profile-picture-field__preview"
                src={draft.picture || profileImage}
                alt={t('profile.picture')}
              />
              <div>
                <p>{t('profile.picture')}</p>
                <label className="profile-picture-field__button">
                  {t('profile.changePicture')}
                  <input type="file" accept="image/*" onChange={handlePictureChange} />
                </label>
                {imageError && <span className="profile-modal__error" role="alert">{imageError}</span>}
              </div>
            </div>

            <label className="profile-modal__field">
              {t('profile.fullName')}
              <input
                ref={nameInputRef}
                autoComplete="name"
                name="fullName"
                required
                value={draft.fullName}
                onChange={updateField}
              />
            </label>

            <label className="profile-modal__field">
              {t('profile.phone')}
              <input
                autoComplete="tel"
                name="phoneNumber"
                type="tel"
                value={draft.phoneNumber}
                onChange={updateField}
              />
            </label>

            <label className="profile-modal__field">
              {t('profile.bio')}
              <textarea name="bio" rows="3" value={draft.bio} onChange={updateField} />
            </label>

            <div className="profile-modal__actions">
              <button type="button" className="profile-modal__cancel" onClick={closeModal}>{t('profile.cancel')}</button>
              <button type="submit" className="profile-modal__save">{t('profile.save')}</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  ), document.body)
}

export default ProfileEditModal