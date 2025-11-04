<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalAudio } from '../composables/useGlobalAudio'

const BACKGROUND_IMAGES = [
  '/VisitorExperience/pause-visitor-1.png',
  '/VisitorExperience/pause-visitor-2.png',
  '/VisitorExperience/pause-visitor-3.png',
  '/VisitorExperience/pause-visitor-4.png',
  '/VisitorExperience/pause-visitor-5.png'
]
const VIDEO_SOURCES = [
  '/VisitorExperience/video-1.mp4',
  '/VisitorExperience/video-2.mp4',
  '/VisitorExperience/video-3.mp4',
  '/VisitorExperience/video-4.mp4',
  '/VisitorExperience/video-5.mp4'
]

const { isMuted, toggleMuted } = useGlobalAudio()
const router = useRouter()
const videoRef = ref(null)
const audioLabel = computed(() => (isMuted.value ? 'Unmute audio' : 'Mute audio'))
const hasEnded = ref(false)
const currentVideoIndex = ref(0)
const currentVideoSrc = computed(() => VIDEO_SOURCES[currentVideoIndex.value])
const shouldPauseOnLoad = ref(false)
const isLastBackground = computed(
  () => currentVideoIndex.value >= BACKGROUND_IMAGES.length - 1
)
const currentBackground = computed(() => {
  if (BACKGROUND_IMAGES.length === 0) {
    return ''
  }
  if (BACKGROUND_IMAGES[currentVideoIndex.value]) {
    return BACKGROUND_IMAGES[currentVideoIndex.value]
  }
  return BACKGROUND_IMAGES[BACKGROUND_IMAGES.length - 1]
})

const syncVideoMuted = (muted) => {
  const el = videoRef.value
  if (!el) {
    return
  }
  el.muted = muted
  if (!muted && !hasEnded.value && !el.ended && !shouldPauseOnLoad.value) {
    try {
      const maybePromise = el.play?.()
      if (maybePromise && typeof maybePromise.then === 'function') {
        maybePromise.catch(() => {
          /* ignore play rejection */
        })
      }
    } catch (_) {
      /* ignore autoplay failure */
    }
  }
}

onMounted(() => {
  syncVideoMuted(isMuted.value)
})

watch(isMuted, (muted) => {
  syncVideoMuted(muted)
})

const handleVideoEnded = () => {
  hasEnded.value = true
}

const handleVideoPlay = () => {
  hasEnded.value = false
}

const goToPreviousBackground = () => {
  hasEnded.value = true
  shouldPauseOnLoad.value = true

  if (currentVideoIndex.value === 0) {
    return
  }

  currentVideoIndex.value = currentVideoIndex.value - 1
}

const playNextVideo = () => {
  if (isLastBackground.value) {
    router.push({ name: 'Exhibition' })
    return
  }

  const el = videoRef.value
  if (!hasEnded.value) {
    if (el) {
      hasEnded.value = true
      try {
        el.pause()
      } catch (_) {
        /* ignore pause failure */
      }
      try {
        el.currentTime = 0
      } catch (_) {
        /* ignore seek failure */
      }
    }
    return
  }
  shouldPauseOnLoad.value = false
  currentVideoIndex.value = (currentVideoIndex.value + 1) % VIDEO_SOURCES.length
}

watch(currentVideoSrc, () => {
  const el = videoRef.value
  if (!el) {
    return
  }
  el.load()
  if (shouldPauseOnLoad.value) {
    hasEnded.value = true
    try {
      el.pause()
    } catch (_) {
      /* ignore pause failure */
    }
    shouldPauseOnLoad.value = false
  } else {
    hasEnded.value = false
    syncVideoMuted(isMuted.value)
  }
})
</script>

<template>
  <div
    class="visitor-experience"
    :style="{ '--background-image': `url(${currentBackground})` }"
  >
    <button
      class="audio-toggle"
      type="button"
      :aria-label="audioLabel"
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

    <div class="overlay-controls">
      <button
        v-if="hasEnded"
        type="button"
        class="control-button"
        @click="goToPreviousBackground"
      >
        <img
          src="/VisitorExperience/back.png"
          alt="上一张背景"
          class="control-image"
        >
      </button>
      <button
        v-if="hasEnded"
        type="button"
        class="control-button"
        @click="playNextVideo"
        :class="{ 'control-button--main': isLastBackground }"
      >
        <img
          :src="isLastBackground ? '/VisitorExperience/backmain.png' : '/VisitorExperience/next.png'"
          :alt="isLastBackground ? '返回主页面' : '播放下一个视频'"
          class="control-image"
        >
      </button>
    </div>

    <video
      ref="videoRef"
      class="visitor-video"
      :src="currentVideoSrc"
      :poster="currentBackground"
      playsinline
      autoplay
      :muted="isMuted"
      :class="{ 'is-hidden': hasEnded }"
      @ended="handleVideoEnded"
      @play="handleVideoPlay"
    />
  </div>
</template>

<style scoped>
.visitor-experience {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-color: #000;
  overflow: hidden;
}

.visitor-experience::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--background-image);
  background-size: cover;
  background-position: center;
  filter: brightness(0.9);
  transition: opacity 0.4s ease;
  z-index: 0;
}

.overlay-controls {
  position: absolute;
  left: 75.5%;
  bottom: clamp(-65px, -20vw, -45px);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: clamp(28px, 6vw, 48px);
  transform: translateX(-50%);
  z-index: 3;
}

.control-button {
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.35));
}

.control-button:hover {
  transform: translateY(-4px);
}

.control-image {
  display: block;
  width: clamp(140px, 18vw, 220px);
  height: auto;
}

.control-button--main .control-image {
  width: clamp(90px, 11vw, 130px);
}

.audio-toggle {
  position: absolute;
  top: clamp(16px, 4vw, 32px);
  left: clamp(16px, 4vw, 32px);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.audio-toggle:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.85);
}

.audio-toggle .icon {
  width: 26px;
  height: 26px;
}

.visitor-video {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  object-fit: cover;
  background: transparent;
  transition: opacity 0.6s ease;
}

.visitor-video.is-hidden {
  opacity: 0;
  pointer-events: none;
}

@media (max-aspect-ratio: 3 / 4) {
  .visitor-video {
    height: auto;
    min-height: 100vh;
  }
}
</style>
