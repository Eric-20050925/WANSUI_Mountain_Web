import { ref } from 'vue'

const currentTime = ref(0)
const shouldResume = ref(false)

export function useSharedBgm() {
  const setCurrentTime = (time) => {
    currentTime.value = time
  }

  const setShouldResume = (value) => {
    shouldResume.value = value
  }

  return {
    bgmCurrentTime: currentTime,
    shouldResumeBgm: shouldResume,
    setBgmCurrentTime: setCurrentTime,
    setShouldResumeBgm: setShouldResume
  }
}
