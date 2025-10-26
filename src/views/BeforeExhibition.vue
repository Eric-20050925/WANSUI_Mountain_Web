<script setup>
import { onBeforeUnmount,onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const videoRef = ref(null)
const bgmRef = ref(null)  // BGM音频元素引用
const isMuted = ref(false)  //控制BGM静音状态
const hasEnded = ref(false)
const VIDEO_SRC = '/BeforeExhibitionPage/exhibition-video.mp4'
const CONFIRM_BUTTON='/BeforeExhibitionPage/confirm.png'
const BGM='/BeforeExhibitionPage/bgm.mp3'

// 切换BGM静音状态
const toggleMute = () => {
  const bgmEl = bgmRef.value
  if (bgmEl) {
    isMuted.value = !isMuted.value
    bgmEl.muted = isMuted.value
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
const onConfirm = () => {
  router.push('/exhibition')
}
const handleSkip = () => {
  const el = videoRef.value
  if (el) {
    try {
      el.currentTime = el.duration || el.currentTime
    } catch (error) {
      console.error('Error skipping video:', error);
    }
  }
  finishPlayback()
}
onMounted(() => {
  // 播放背景音乐
  const bgmEl = bgmRef.value
  if (bgmEl) {
    const bgmPlayPromise = bgmEl.play()
    if (bgmPlayPromise?.catch) {
      bgmPlayPromise.catch(() => {
        // 处理播放失败的情况（例如用户未与页面交互）
      })
    }
  }
})
onBeforeUnmount(() => {
  // 停止背景音乐播放
  const bgmEl = bgmRef.value
  if (bgmEl) {
    bgmEl.pause()
    bgmEl.currentTime = 0
  }
})
</script>
<template>
  <div class="intro-video-page">
    <!-- 背景音乐元素 -->
    <audio
      ref="bgmRef"
      :src="BGM"
      loop 
      class="bg-music"
      :muted="isMuted"  
    >
    </audio>
    <!-- BGM静音控制按钮 -->
    <button 
      class="bgm-control" 
      @click="toggleMute"
      aria-label="控制背景音乐"
    >
      <svg v-if="!isMuted" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
        <path d="M15.54 8.46C16.4774 9.39764 17.0017 10.6692 17.0017 11.995C17.0017 13.3208 16.4774 14.5924 15.54 15.53" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19.07 4.93C20.9447 6.80528 22.0017 9.34805 22.0017 11.995C22.0017 14.6419 20.9447 17.1847 19.07 19.06" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
        <path d="M15 9L20 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M20 9L15 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
        <button class="confirm-btn" @click="onConfirm">
          <img :src="CONFIRM_BUTTON" alt="我已知晓" class="btn-img" />
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
/* 背景音乐元素*/
.bg-music {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
}
/* BGM控制按钮样式 */
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
  transition: all 0.2s ease;
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
.skip-button {
    top: 16px;
    right: 20px;
    padding: 6px 14px;
    font-size: 0.85rem;
    letter-spacing: 0.1em;
  }
.skip-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.85);
}

/* 按钮样式 - 绝对定位 */
.confirm-btn {
  position: absolute; /* 绝对定位 */
  bottom: 8rem; /* 距离卷轴底部8rem */
  left: 50%; /* 水平居中 */
  transform: translateX(-50%); /* 水平居中修正 */
  background: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease;
  padding: 0.5rem;
  z-index: 10; /* 确保在内容上方 */
}

.confirm-btn:hover {
  transform: translateX(-50%) scale(1.05); /*  hover效果修正 */
}

.btn-img {
  height: 60px;
  width: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .confirm-btn {
    bottom: 2rem; /* 移动端调整底部距离 */
  }
  
  .btn-img {
    height: 50px;
  }
}

</style>
