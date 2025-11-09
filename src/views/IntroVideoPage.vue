<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalAudio } from '../composables/useGlobalAudio'

const router = useRouter()
const videoRef = ref(null)
const hasEnded = ref(false)

const { isMuted, setMuted, toggleMuted } = useGlobalAudio()

const VIDEO_SRC = '/IntroPage/intro-video.mp4'
const FINAL_FRAME_SRC = '/IntroPage/final-frame.png'

const ensurePlayback = async () => {
  const el = videoRef.value
  if (!el || hasEnded.value) {
    return
  }

  try {
    await el.play()
  } catch (error) {
    if (!isMuted.value) {
      el.muted = true
      setMuted(true, { persist: false })
      try {
        await el.play()
      } catch (_) {
      }
    }
  }
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

const handleSkip = () => {
  const el = videoRef.value
  if (el) {
    try {
      el.currentTime = Number.isFinite(el.duration) ? el.duration : el.currentTime
    } catch (_) {
    }
  }
  finishPlayback()
}

const enterExhibition = () => {
  router.push('/beforeexhibition')
}

onMounted(() => {
  const el = videoRef.value
  if (!el) {
    return
  }
  el.muted = isMuted.value
  ensurePlayback()
})

watch(isMuted, (muted) => {
  const el = videoRef.value
  if (!el) {
    return
  }
  el.muted = muted

  if (!muted) {
    ensurePlayback()
  } else {
    el.muted = true
  }
})
</script>

<template>
  <div class="intro-video-page">
    <div class="media-stage">
      <video
        ref="videoRef"
        class="hero-video"
        :src="VIDEO_SRC"
        playsinline
        autoplay
        :muted="isMuted"
        @ended="handleVideoEnded"
      />

      <button
        type="button"
        class="audio-toggle"
        :aria-label="isMuted ? 'Unmute audio' : 'Mute audio'"
        @click="toggleMuted"
      >
        <svg
          v-if="isMuted"
          class="icon"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 5L6 9H2V15H6L11 19V5Z"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <path
            d="M15 9L20 15"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M20 9L15 15"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          v-else
          class="icon"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 5L6 9H2V15H6L11 19V5Z"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linejoin="round"
          />
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

      <button
        v-if="!hasEnded"
        type="button"
        class="skip-button"
        @click="handleSkip"
      >
        skip
      </button>

      <div
        v-if="hasEnded"
        class="final-frame"
        role="presentation"
      >
        <img
          :src="FINAL_FRAME_SRC"
          alt=""
          class="final-frame-image"
        >
        <button
          type="button"
          class="enter-button"
          aria-label="Enter exhibition"
          @click="enterExhibition"
        />
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

.audio-toggle {
  position: absolute;
  top: 24px;
  left: 32px;
  width: 42px;
  height: 42px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
  z-index: 4;
}

.audio-toggle:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.85);
}

.audio-toggle .icon {
  width: 22px;
  height: 22px;
}

.skip-button {
  position: absolute;
  top: 24px;
  right: 32px;
  padding: 6px 18px;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 999px;
  font-size: 0.95rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
  z-index: 3;
}

.skip-button:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.85);
}

.final-frame {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: clamp(80px, 14vh, 200px);
  z-index: 2;
}

.final-frame-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.enter-button {
  width: clamp(260px, 34vw, 420px);
  height: clamp(84px, 10vh, 120px);
  background-image: url('/IntroPage/buttonbackground.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  border-radius: 18px;
  cursor: pointer;
  box-shadow:
    0 10px 36px rgba(223, 155, 54, 0.48),
    inset 0 3px 10px rgba(255, 255, 255, 0.45);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.enter-button:hover {
  transform: translateY(-4px);
  box-shadow:
    0 16px 42px rgba(223, 155, 54, 0.65),
    inset 0 4px 12px rgba(255, 255, 255, 0.55);
}

@media (max-width: 768px) {
  .audio-toggle {
    top: 16px;
    left: 20px;
    width: 38px;
    height: 38px;
  }

  .audio-toggle .icon {
    width: 20px;
    height: 20px;
  }

  .skip-button {
    top: 16px;
    right: 20px;
    padding: 6px 14px;
    font-size: 0.82rem;
    letter-spacing: 0.1em;
  }

  .final-frame {
    padding-bottom: clamp(60px, 18vh, 140px);
  }

  .enter-button {
    width: clamp(220px, 60vw, 340px);
    height: clamp(70px, 9vh, 100px);
  }
}
</style>
