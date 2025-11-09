<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalAudio } from '../../composables/useGlobalAudio'

const router = useRouter()
const { isMuted, toggleMuted } = useGlobalAudio()
const hasClicked = ref(false) // 标记是否已点击
const audioLabel = computed(() => (isMuted.value ? '取消静音' : '静音'))

// 计算背景图片路径
const backgroundImageSrc = computed(() => {
  return hasClicked.value 
    ? '/CEOExperience/value/page1.png' 
    : '/CEOExperience/value/page0.png'
})

// 处理点击事件
const handleClick = () => {
  if (!hasClicked.value) {
    hasClicked.value = true
  }
}

// 返回CEOExperience页面
const goBackToCEOExperience = () => {
  router.push('/ceo-experience')
}

// 监听全局点击事件
const handleGlobalClick = (event) => {
  // 确保点击的是页面主体，而不是按钮等元素
  if (!event.target.closest('.audio-toggle') && !event.target.closest('.back-button')) {
    handleClick()
  }
}

onMounted(() => {
  // 添加全局点击事件监听
  document.addEventListener('click', handleGlobalClick)
})

onBeforeUnmount(() => {
  // 清理事件监听
  document.removeEventListener('click', handleGlobalClick)
})
</script>

<template>
  <div class="social-value">
    <!-- 背景图片 -->
    <div 
      class="background-image" 
      :style="{ backgroundImage: `url(${backgroundImageSrc})` }"
    ></div>
    <!-- 音频控制按钮 -->
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
    <!-- 返回按钮 -->
    <button
      class="back-button"
      type="button"
      @click="goBackToCEOExperience"
    >
      <span class="back-text">返回导航</span>
    </button>
  </div>
</template>

<style scoped>
.social-value {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-color: #000;
  overflow: hidden;
  cursor: pointer; /* 表示可点击 */
}

.background-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 0;
  transition: background-image 0.6s ease; /* 背景切换动画 */
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

/* 返回按钮样式 */
.back-button {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 60px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.8);
  border: 4px solid rgba(255, 255, 255, 1);
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  cursor: pointer;
  z-index: 5;
  transition: all 0.3s ease;
}

/* 返回按钮文字样式 */
.back-text {
  display: block;
  width: 100%;
  text-align: center;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-50%) scale(1.05);
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
}

/* 响应式设计 */
@media (max-aspect-ratio: 3 / 4) {
  .audio-toggle {
    width: 44px;
    height: 44px;
    background: rgba(0, 0, 0, 0.8);
    border: 3px solid rgba(255, 255, 255, 0.9);
  }
  
  .audio-toggle .icon {
    width: 22px;
    height: 22px;
  }
  
  .back-button {
    width: 120px;
    height: 50px;
    font-size: 16px;
    background: rgba(0, 0, 0, 0.8);
    border: 3px solid rgba(255, 255, 255, 1);
  }
  
  .back-button:hover {
    transform: translateX(-50%) scale(1.05);
  }
}
</style>