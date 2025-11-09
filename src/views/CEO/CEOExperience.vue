<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalAudio } from '../../composables/useGlobalAudio'

const BACKGROUND_IMAGES = [
  '/CEOExperience/pause-ceo-0.png',
  '/CEOExperience/pause-ceo-1.png',
]
const VIDEO_SOURCES = [
  '/CEOExperience/video-1.mp4',
  '/CEOExperience/video-2.mp4',
]

const { isMuted, toggleMuted } = useGlobalAudio()
const router = useRouter()
const videoRef = ref(null)
const bgmRef = ref(null)
const audioLabel = computed(() => (isMuted.value ? 'Unmute audio' : 'Mute audio'))
const hasEnded = ref(false)
const currentVideoIndex = ref(0)
const currentVideoSrc = computed(() => VIDEO_SOURCES[currentVideoIndex.value])
const shouldPauseOnLoad = ref(false)
const isLastBackground = computed(
  () => currentVideoIndex.value >= BACKGROUND_IMAGES.length - 1
)
const isinPocket=ref(true)


const currentBackground = computed(() => {
  if(currentVideoIndex.value!=0){
    isinPocket.value=false
    console.log('CURRENT INDEX', currentVideoIndex.value)
    console.log('Current BG IMG', BACKGROUND_IMAGES[currentVideoIndex.value])
  }
  if (BACKGROUND_IMAGES.length === 0) {
    return ''
  }
  if (BACKGROUND_IMAGES[currentVideoIndex.value]) {
    return BACKGROUND_IMAGES[currentVideoIndex.value]
  }
  return BACKGROUND_IMAGES[BACKGROUND_IMAGES.length - 1]
})

const BGM = '/VisitorExperience/bgm.mp3'
const BGM_VOLUME = 0.4

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
        })
      }
    } catch (_) {
    }
  }
}

const ensureBgmPlayback = () => {
  const el = bgmRef.value
  if (!el) {
    return
  }
  try {
    el.volume = BGM_VOLUME
  } catch (_) {
  }
  try {
    const maybePromise = el.play?.()
    if (maybePromise && typeof maybePromise.then === 'function') {
      maybePromise.catch(() => {
      })
    }
  } catch (_) {
  }
}

const syncBgmMuted = (muted) => {
  const el = bgmRef.value
  if (!el) {
    return
  }
  el.muted = muted
  if (!muted) {
    ensureBgmPlayback()
  }
}

onMounted(() => {
  syncVideoMuted(isMuted.value)
  const bgmEl = bgmRef.value
  if (bgmEl) {
    bgmEl.muted = isMuted.value
    try {
      bgmEl.volume = BGM_VOLUME
    } catch (_) {
    }
    ensureBgmPlayback()
  }
})

watch(isMuted, (muted) => {
  syncVideoMuted(muted)
  syncBgmMuted(muted)
})

const handleVideoEnded = () => {
  hasEnded.value = true
}

const handleVideoPlay = () => {
  hasEnded.value = false
}

const goToPreviousBackground = () => {
  if (currentVideoIndex.value === 0) {
    router.push({ name: 'Exhibition' })
    return
  }

  hasEnded.value = true
  shouldPauseOnLoad.value = true
  currentVideoIndex.value = currentVideoIndex.value - 1
}

const routerTo=(Name)=>{
  router.push({ name: Name })
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
      }
      try {
        el.currentTime = 0
      } catch (_) {
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
    }
    shouldPauseOnLoad.value = false
  } else {
    hasEnded.value = false
    syncVideoMuted(isMuted.value)
  }
})

onBeforeUnmount(() => {
  const el = bgmRef.value
  if (!el) {
    return
  }
  try {
    el.pause()
  } catch (_) {
  }
  try {
    el.currentTime = 0
  } catch (_) {
  }
})
</script>

<template>
  <div
    class="visitor-experience"
    :style="{ '--background-image': `url(${currentBackground})` }"
  >
    <audio
      ref="bgmRef"
      :src="BGM"
      loop
      class="background-music"
      :muted="isMuted"
    />
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

      <!-- 锦囊点击判定区 -->
      <button
        v-if="!isinPocket.value"
        type="button"
        class="pocket-button"
        @click="playNextVideo"       
      >
        <img
          src="/CEOExperience/backmain.png"
          alt="上一张背景"
          class="control-image"
        >
        </img>
      </button>

      <!-- 五个锦囊跳转按钮 -->
      <div v-if="!isinPocket.value">
        <!-- 产品研发理念按钮 -->
        <button
          v-if="currentVideoIndex.valueOf!=0"
          type="button"
          class="pocket-button1"
          @click="touterTo('ProductRationale')"       
        >
          <img
            src="/CEOExperience/pocket/button1.png"
            alt="上一张背景"
            class="control-image"
          >
          </img>
        </button>
        <!-- 市场运营思维按钮 -->
        <button
          v-if="currentVideoIndex.valueOf!=0"
          type="button"
          class="pocket-button2"
          @click="routerTo('MarketThinking')"       
        >
          <img
            src="/CEOExperience/pocket/button2.png"
            alt="上一张背景"
            class="control-image"
          >
          </img>
        </button>
        <!-- 避免同质化思维按钮 -->
        <!-- <button
          v-if="currentVideoIndex.valueOf!=0"
          type="button"
          class="pocket-button3"
          @click="playNextVideo"       
        >
          <img
            src="/CEOExperience/pocket/button3.png"
            alt="上一张背景"
            class="control-image"
          >
          </img>
        </button> -->
        <!-- 企业的社会价值按钮 -->
        <!-- <button
          v-if="currentVideoIndex.valueOf!=0"
          type="button"
          class="pocket-button4"
          @click="playNextVideo"       
        >
          <img
            src="/CEOExperience/pocket/button4.png"
            alt="上一张背景"
            class="control-image"
          >
          </img>
        </button> -->
        <!-- 未来发展规划按钮 -->
        <!-- <button
          v-if="currentVideoIndex.valueOf!=0"
          type="button"
          class="pocket-button5"
          @click="playNextVideo"       
        >
          <img
            src="/CEOExperience/pocket/button5.png"
            alt="上一张背景"
            class="control-image"
          >
          </img>
        </button> -->
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
  transform: scale(0.9);
}

.control-button--main .control-image {
  width: clamp(90px, 11vw, 130px);
}

.control-button--main {
  margin-top: clamp(-32px, -8vw, -56px);
}

.pocket-button {
  position:absolute;
  left:60%;
  bottom: 35%;
  padding: 0;
  border: none;
  /* background: none; */
  cursor: pointer;
  transition: transform 0.2s ease;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.35));
}

.pocket-button1 {
  position:absolute;
  left:35%;
  bottom: 20%;
  padding: 0;
  border: none;
  /* background: none; */
  cursor: pointer;
  transition: transform 0.2s ease;
  /* transform : scale(2.0); */
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.35));
}

.pocket-button1:hover {
  transform: translateY(-4px);
}

.pocket-button2 {
  position:absolute;
  left:45%;
  bottom: 20%;
  padding: 0;
  border: none;
  /* background: none; */
  cursor: pointer;
  transition: transform 0.2s ease;
  /* transform : scale(2.0); */
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.35));
}

.pocket-button2:hover {
  transform: translateY(-4px);
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

.background-music {
  display: none;
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
