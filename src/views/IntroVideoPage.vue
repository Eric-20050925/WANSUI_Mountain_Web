<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const videoRef = ref(null)
const hasEnded = ref(false)
const VIDEO_SRC = '/IntroPage/intro-video.mp4'
const FINAL_FRAME_SRC = '/IntroPage/final-frame.png'

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
      el.currentTime = el.duration || el.currentTime
    } catch (error) {

    }
  }
  finishPlayback()
}

const enterExhibition = () => {
  router.push('/exhibition')
}

onMounted(() => {
  const el = videoRef.value
  if (el) {

    const playPromise = el.play()
    if (playPromise?.catch) {
      playPromise.catch(() => {

      })
    }
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
          @click="enterExhibition"
        >

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
}

.skip-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.85);
}

.final-frame {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  background: transparent;
  padding: 0;
}

.final-frame-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.enter-button {
  position: absolute;
  left: 50%;
  bottom: 12vh;
  transform: translateX(-50%);
  z-index: 1;

  width: clamp(280px, 36vw, 480px);
  height: clamp(90px, 11vh, 130px);

  background-image: url('/IntroPage/buttonbackground.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;

  border: none;
  border-radius: 16px;
  cursor: pointer;

  font-size: 1.8rem;
  font-weight: bold;
  letter-spacing: 0.2em;
  color: #4a1f05;
  text-shadow: 0 2px 6px rgba(255, 255, 255, 0.6);

  box-shadow:
    0 10px 30px rgba(223, 155, 54, 0.45),
    inset 0 3px 8px rgba(255, 255, 255, 0.4);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.enter-button:hover {
  transform: translateX(-50%) translateY(-4px);
  box-shadow:
    0 14px 34px rgba(223, 155, 54, 0.65),
    inset 0 4px 10px rgba(255, 255, 255, 0.55);
}

@media (max-width: 768px) {
  .enter-button {
    bottom: 8vh;
    width: clamp(220px, 55vw, 340px);
    height: clamp(70px, 9vh, 100px);
    font-size: 1.3rem;
    letter-spacing: 0.16em;
  }
}
  .skip-button {
    top: 16px;
    right: 20px;
    padding: 6px 14px;
    font-size: 0.85rem;
    letter-spacing: 0.1em;
  }

  .enter-button {
    padding: 12px 30px;
    font-size: 1rem;
    letter-spacing: 0.16em;
  }

</style>
