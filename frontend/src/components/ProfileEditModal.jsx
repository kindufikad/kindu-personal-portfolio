import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '../use-language.js'

async function makeImagePreview(file) {
  const bitmap = await createImageBitmap(file)
  const maxDimension = 720
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.82)
}

function ProfileEditModal({ isOpen, profile, onSave, onClose }) {
  const [draft, setDraft] = useState(profile)
  const [imageError, setImageError] = useState('')
  const nameInputRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    if (!isOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    nameInputRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, profile])

  if (!isOpen) return null

  function updateField(event) {
    const { name, value } = event.target
    setDraft((current) => ({ ...current, [name]: value }))
  }

  async function handlePictureChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
      setImageError(t('profile.invalidImage'))
      event.target.value = ''
      return
    }

    try {
      const picture = await makeImagePreview(file)
      setDraft((current) => ({ ...current, picture }))
      setImageError('')
    } catch {
      setImageError(t('profile.invalidImage'))
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSave({ ...draft, fullName: draft.fullName.trim() })
    onClose()
  }

  return createPortal((
    <div
      className="profile-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        <div className="profile-modal__header">
          <div>
            <p>{t('settings.profile')}</p>
            <h2 id="profile-modal-title">{t('profile.title')}</h2>
          </div>
          <button type="button" className="profile-modal__close" aria-label={t('settings.close')} onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </div>

        <div className="profile-modal__body">
          <form onSubmit={handleSubmit}>
            <div className="profile-picture-field">
            {draft.picture ? (
              <img className="profile-picture-field__preview" src={draft.picture} alt={t('profile.picture')} />
            ) : (
              <div className="profile-picture-field__placeholder" aria-hidden="true">
                {draft.fullName.trim().slice(0, 1).toUpperCase() || 'K'}
              </div>
            )}
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
              <button type="button" className="profile-modal__cancel" onClick={onClose}>{t('profile.cancel')}</button>
              <button type="submit" className="profile-modal__save">{t('profile.save')}</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  ), document.body)
}

export default ProfileEditModal