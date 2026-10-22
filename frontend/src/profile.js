export const defaultProfile = {
  fullName: 'Kindu Fikad',
  phoneNumber: '',
  bio: 'Department Of Computer Science & Full Stack Developer',
  picture: '',
}

export function readStoredProfile() {
  try {
    const savedProfile = JSON.parse(window.localStorage.getItem('portfolio-profile') || 'null')
    if (!savedProfile || typeof savedProfile !== 'object') return { ...defaultProfile }

    return {
      fullName: typeof savedProfile.fullName === 'string' ? savedProfile.fullName : defaultProfile.fullName,
      phoneNumber: typeof savedProfile.phoneNumber === 'string' ? savedProfile.phoneNumber : '',
      bio: typeof savedProfile.bio === 'string' ? savedProfile.bio : defaultProfile.bio,
      picture: typeof savedProfile.picture === 'string' ? savedProfile.picture : '',
    }
  } catch {
    return { ...defaultProfile }
  }
}