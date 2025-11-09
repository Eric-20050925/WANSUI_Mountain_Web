<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalAudio } from '../../composables/useGlobalAudio'

const { isMuted, toggleMuted } = useGlobalAudio()
const router = useRouter()

const audioLabel = computed(() => (isMuted.value ? 'Unmute audio' : 'Mute audio'))

const goBack = () => {
  router.push({ name: 'Exhibition' })
}
</script>

<template>
  <div class="experience-page">
    <button
      class="audio-toggle"
      type="button"
      :aria-label="audioLabel"
      @click="toggleMuted"
    >
      <svg
        class="icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.23 8.5H8.5L12 5V19L8.5 15.5H5.23C4.55 15.5 4 14.95 4 14.27V9.73C4 9.05 4.55 8.5 5.23 8.5Z"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M16 8.5L19.5 5M19.5 5L16 8.5M19.5 5L16 1.5M16 15.5L19.5 19M19.5 19L16 15.5M19.5 19L16 22.5"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <div class="content">
      <h1 class="title">文旅合作体验页</h1>
      <p class="placeholder">此处文字等待填充</p>
      <button class="back-button" type="button" @click="goBack">
        返回展会主页
      </button>
    </div>
  </div>
</template>

<style scoped>
.experience-page {
  position: relative;
  min-height: 100vh;
  padding: clamp(32px, 6vw, 80px) clamp(24px, 6vw, 96px) clamp(72px, 10vw, 140px);
  background: linear-gradient(180deg, #0a0d0c 0%, #1c2015 44%, #020202 100%);
  color: #fff4e5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.audio-toggle {
  position: absolute;
  top: clamp(16px, 4vw, 32px);
  left: clamp(16px, 4vw, 32px);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
  z-index: 1;
}

.audio-toggle:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.85);
}

.audio-toggle .icon {
  width: 24px;
  height: 24px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 4vw, 28px);
  align-items: center;
  text-align: center;
}

.title {
  margin: 0;
  font-family: 'FZQianLXSJW', 'FZQingLongSongS', 'STKaiti', 'KaiTi', serif;
  font-size: clamp(32px, 6vw, 68px);
  letter-spacing: 0.12em;
  color: rgba(255, 250, 240, 0.96);
}

.placeholder {
  margin: 0;
  font-family: '华文仿宋', 'STFangsong', 'FangSong', serif;
  font-size: clamp(18px, 2.4vw, 28px);
  line-height: 1.7;
  color: rgba(255, 244, 229, 0.85);
}

.back-button {
  padding: clamp(10px, 1.6vw, 14px) clamp(18px, 3vw, 26px);
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(0, 0, 0, 0.35);
  color: rgba(255, 244, 229, 0.92);
  font-size: clamp(14px, 1.8vw, 18px);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.65);
  transform: translateY(-2px);
}
</style>
