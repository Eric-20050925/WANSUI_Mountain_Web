//现在这个加载是直接找的以前写过的纯模拟加载，没接入任何进度逻辑，之后全写完再改这个吧，目前先用着
<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const progress = ref(0)
let timerId
const advance = () => {
  progress.value = Math.min(100, progress.value + Math.floor(Math.random() * 3) + 1)
  if (progress.value === 100 && timerId) {
    clearInterval(timerId)
    timerId = undefined
  }
}
onMounted(() => {
  timerId = setInterval(advance, 120)
})

onBeforeUnmount(() => {
  if (timerId) {
    clearInterval(timerId)
  }
})
</script>

<template>
  <div class="loading-page">
    <div class="loading-content">
      <video
        class="loading-video"
        src="/LoadingPage/LoadingCircle.mov"
        autoplay
        muted
        loop
        playsinline
      />
      <div class="percent">
        {{ progress }}%
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #ffd89c;
  background-image: url('/LoadingPage/LodingPageBackground.png');
  background-size: cover;
  background-position: center;
}

.loading-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;
}

.loading-video {
  width: min(240px, 55vw);
  aspect-ratio: 1 / 1;
  object-fit: contain;
  filter: drop-shadow(0 0 30px rgba(255, 160, 40, 0.55));
}

.loading-video::-webkit-media-controls {
  display: none !important;
}

.percent {
  font-size: clamp(2rem, 2.8vw, 3.2rem);
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #ffb648;
  text-shadow:
    0 0 12px rgba(255, 150, 24, 0.9),
    0 0 36px rgba(0, 0, 0, 0.8);
  text-transform: uppercase;
}

.percent::after {
  content: '';
  display: block;
  width: 56px;
  height: 4px;
  margin: 0.35rem auto 0;
  border-radius: 4px;
  background: linear-gradient(90deg, transparent, rgba(255, 160, 40, 0.85), transparent);
  opacity: 0.85;
}
</style>
