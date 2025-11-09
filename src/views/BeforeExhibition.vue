<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalAudio } from '../composables/useGlobalAudio'
import { useSharedBgm } from '../composables/useSharedBgm'

const router = useRouter()
const videoRef = ref(null)
const bgmRef = ref(null)
const hasEnded = ref(false)

const { isMuted, setMuted, toggleMuted } = useGlobalAudio()
const {
  bgmCurrentTime,
  shouldResumeBgm,
  setBgmCurrentTime,
  setShouldResumeBgm
} = useSharedBgm()

const VIDEO_SRC = '/BeforeExhibitionPage/exhibition-video.mp4'
const CONFIRM_BUTTON = '/BeforeExhibitionPage/confirm.png'
const BGM = '/BeforeExhibitionPage/bgm.mp3'

const ensureBgmPlayback = async () => {
  const bgmEl = bgmRef.value
  if (!bgmEl) {
    return
  }

  try {
    await bgmEl.play()
  } catch (error) {
    if (!isMuted.value) {
      bgmEl.muted = true
      setMuted(true, { persist: false })
      try {
        await bgmEl.play()
      } catch (_) {
      }
    }
  }
}

const updateBgmTime = () => {
  const bgmEl = bgmRef.value
  if (!bgmEl) {
    return
  }
  setBgmCurrentTime(bgmEl.currentTime || 0)
}

const finishPlayback = () => {
  if (hasEnded.value) {
    return
  }
  hasEnded.value = true

  const el = videoRef.value
  if (el) {
    el.pause()
  }
}

const handleVideoEnded = () => {
  finishPlayback()
}

const onConfirm = () => {
  router.push('/exhibition')
}

const handleSkip = () => {
  const el = videoRef.value
  if (el) {
    try {
      el.currentTime = el.duration || el.currentTime
    } catch (_) {

    }
  }
  finishPlayback()
}

onMounted(() => {
  const bgmEl = bgmRef.value
  if (bgmEl) {
    bgmEl.muted = isMuted.value
    if (shouldResumeBgm.value && bgmCurrentTime.value > 0) {
      try {
        bgmEl.currentTime = bgmCurrentTime.value
      } catch (_) {
      }
      setShouldResumeBgm(false)
    }
    bgmEl.addEventListener('timeupdate', updateBgmTime, { passive: true })
    ensureBgmPlayback()
  }

  const introEl = videoRef.value
  if (introEl) {
    introEl.muted = true
  }
})

onBeforeUnmount(() => {
  const bgmEl = bgmRef.value
  if (bgmEl) {
    setBgmCurrentTime(bgmEl.currentTime || 0)
    setShouldResumeBgm(true)
    bgmEl.removeEventListener('timeupdate', updateBgmTime)
    bgmEl.pause()
  }
})

watch(isMuted, (muted) => {
  const bgmEl = bgmRef.value
  if (!bgmEl) {
    return
  }
  bgmEl.muted = muted
  if (!muted) {
    ensureBgmPlayback()
  }
})
</script>

<template>
  <div class="intro-video-page">
    <audio
      ref="bgmRef"
      :src="BGM"
      loop
      class="bg-music"
      :muted="isMuted"
    />

    <button
      class="bgm-control"
      type="button"
      :aria-label="isMuted ? 'Unmute audio' : 'Mute audio'"
      @click="toggleMuted"
    >
      <svg
        v-if="isMuted"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="white" stroke-width="2" stroke-linejoin="round" />
        <path d="M15 9L20 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M20 9L15 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <svg
        v-else
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="white" stroke-width="2" stroke-linejoin="round" />
        <path
          d="M15.54 8.46C16.477 9.397 17.001 10.669 17.001 11.995C17.001 13.321 16.477 14.592 15.54 15.53"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M19.07 4.93C20.945 6.805 22.002 9.348 22.002 11.995C22.002 14.642 20.945 17.185 19.07 19.06"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <div class="media-stage">
      <video
        ref="videoRef"
        class="hero-video"
        :src="VIDEO_SRC"
        playsinline
        autoplay
        muted
        @ended="handleVideoEnded"
      />
      <button
        v-if="!hasEnded"
        type="button"
        class="skip-button"
        @click="handleSkip"
      >
        skip
      </button>
      <div v-if="hasEnded">
        <button class="confirm-btn" type="button" @click="onConfirm">
          <img :src="CONFIRM_BUTTON" alt="I acknowledge">
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.intro-video-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  overflow: hidden;
}

.bg-music {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
}

.bgm-control {
  position: absolute;
  top: 16px;
  left: 20px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
  z-index: 20;
}

.bgm-control:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.85);
}

.media-stage {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-video {
  width: 100%;
  height: 100vh;
  object-fit: cover;
  display: block;
}

.skip-button {
  position: absolute;
  top: 16px;
  right: 20px;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 999px;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.skip-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.85);
}

.confirm-btn {
  position: absolute;
  bottom: 8rem;
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease;
  padding: 0.5rem;
  z-index: 10;
}

.confirm-btn:hover {
  transform: translateX(-50%) scale(1.05);
}

.btn-img {
  height: 60px;
  width: auto;
}

@media (max-width: 768px) {
  .confirm-btn {
    bottom: 2rem;
  }

  .btn-img {
    height: 50px;
  }
}
</style>
