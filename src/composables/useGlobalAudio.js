import { ref } from 'vue'

const STORAGE_KEY = 'global-audio-muted-v2'
const mutedRef = ref(false)
let initialized = false

const readFromStorage = () => {
  if (typeof window === 'undefined') {
    return
  }
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored !== null) {
    mutedRef.value = stored === 'true'
  }
}

const writeToStorage = (value) => {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false')
}

export function useGlobalAudio() {
  if (!initialized) {
    readFromStorage()
    initialized = true
  }

  const setMuted = (value) => {
    mutedRef.value = value
    writeToStorage(value)
  }

  const toggleMuted = () => {
    setMuted(!mutedRef.value)
  }

  return {
    isMuted: mutedRef,
    setMuted,
    toggleMuted
  }
}
