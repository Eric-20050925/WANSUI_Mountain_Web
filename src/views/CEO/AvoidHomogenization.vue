<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalAudio } from '../../composables/useGlobalAudio'

const router = useRouter()
const { isMuted, toggleMuted } = useGlobalAudio()
const videoRef = ref(null)
const hasEnded = ref(false)
const currentPage = ref(1) // 从1开始，对应page1.mp4
const totalPages = ref(3) // 总共有3个视频
const audioLabel = computed(() => (isMuted.value ? '取消静音' : '静音'))

// 获取当前页面的视频和图片路径
// 初始背景为page0.png，视频从page1.mp4开始
const currentVideoSrc = computed(() => `/CEOExperience/avoid/page${currentPage.value}.mp4`)
const currentImageSrc = computed(() => {
  // 初始背景使用page0.png
  if (!hasEnded.value && currentPage.value === 1) {
    return '/CEOExperience/avoid/page0.png'
  }
  return `/CEOExperience/avoid/page${currentPage.value}.png`
})

// 视频播放结束处理
const handleVideoEnded = () => {
  hasEnded.value = true
}

// 视频播放处理
const handleVideoPlay = () => {
  hasEnded.value = false
}

// 同步视频静音状态
const syncVideoMuted = (muted) => {
  const el = videoRef.value
  if (!el) return
  
  el.muted = muted
  if (!muted && !hasEnded.value && !el.ended) {
    try {
      el.play()
    } catch (e) {
      console.log('Auto-play prevented:', e)
    }
  }
}

// 切换到下一页
const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    hasEnded.value = false
    // 重置视频元素以便重新播放
    setTimeout(() => {
      const el = videoRef.value
      if (el) {
        el.currentTime = 0
        try {
          el.play()
        } catch (e) {
          console.log('Auto-play prevented:', e)
        }
      }
    }, 100)
  }
}

// 切换到上一页
const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    hasEnded.value = false
    // 重置视频元素以便重新播放
    setTimeout(() => {
      const el = videoRef.value
      if (el) {
        el.currentTime = 0
        try {
          el.play()
        } catch (e) {
          console.log('Auto-play prevented:', e)
        }
      }
    }, 100)
  }
}

// 返回CEOExperience页面
const goBackToCEOExperience = () => {
  router.push('/ceo-experience')
}

// 页面加载时初始化
onMounted(() => {
  syncVideoMuted(isMuted.value)
})

// 页面离开前清理
onBeforeUnmount(() => {
  const el = videoRef.value
  if (el) {
    el.pause()
    el.currentTime = 0
  }
})
</script>

<template>
  <div class="avoid-homogenization">
    <!-- 背景图片显示，初始和视频播放完成后显示 -->
    <div 
      class="background-image" 
      :style="{ backgroundImage: `url(${currentImageSrc})` }"
    ></div>
    
    <!-- 视频播放器 -->
    <video
      ref="videoRef"
      class="avoid-homogenization-video"
      :src="currentVideoSrc"
      playsinline
      autoplay
      :muted="isMuted"
      :class="{ 'is-hidden': hasEnded }"
      @ended="handleVideoEnded"
      @play="handleVideoPlay"
    />
    
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
    
    <!-- 分页控制按钮，仅在视频播放完成后显示 -->
      <div v-show="hasEnded" class="pagination-controls">
        <!-- 上一页按钮 -->
        <button
          v-show="currentPage > 1 && currentPage < totalPages"
          class="page-button prev-button"
          type="button"
          @click="goToPrevPage"
        >
          <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15 18L9 12L15 6"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      
      <!-- 下一页按钮或返回按钮 -->
      <button
        :class="['page-button', currentPage === totalPages ? 'back-button' : 'next-button']"
        type="button"
        @click="currentPage === totalPages ? goBackToCEOExperience() : goToNextPage()"
      >
        <!-- 下一页图标 -->
        <svg 
          v-show="currentPage !== totalPages"
          class="icon" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <!-- 返回按钮文字 -->
        <span v-show="currentPage === totalPages" class="back-text">返回导航</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.avoid-homogenization {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-color: #000;
  overflow: hidden;
}

.background-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.avoid-homogenization-video {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  object-fit: cover;
  background: transparent;
  transition: opacity 0.6s ease;
  opacity: 1; /* 确保视频默认显示 */
}

.avoid-homogenization-video.is-hidden {
  opacity: 0;
  pointer-events: none;
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

/* 分页控制样式 - 右侧纵向排列 */
.pagination-controls {
  position: absolute;
  top: 45%;
  right: 10%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 5;
}

.page-button {
  width: 100px;
  height: 60px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.7);
  border: 3px solid rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
}

/* 返回按钮 - 矩形样式 */
.back-button {
  width: 150px;
  height: 60px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.8);
  border: 4px solid rgba(255, 255, 255, 1);
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  margin-left: -30px;
  margin-top: 50px;
}

/* 返回按钮文字样式 */
.back-text {
  display: block;
  width: 100%;
  text-align: center;
}

.page-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.9);
  transform: scale(1.1) translateX(-5px);
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
}

/* 特殊的返回按钮悬停效果 */
.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05) translateX(-10px);
}

.page-button .icon {
  width: 40px;
  height: 40px;
  fill: none;
  stroke-width: 2.5;
}

/* 响应式设计 */
@media (max-aspect-ratio: 3 / 4) {
  .avoid-homogenization-video {
    height: auto;
    min-height: 100vh;
  }
  
  .page-button {
    width: 80px;
    height: 50px;
    background: rgba(0, 0, 0, 0.8);
    border: 3px solid rgba(255, 255, 255, 0.9);
  }
  
  .page-button .icon {
    width: 30px;
    height: 30px;
  }
  
  .pagination-controls {
    right: 3%;
    gap: 15px;
  }
  
  /* 移动端返回按钮样式调整 */
  .back-button {
    width: 120px;
    height: 50px;
    font-size: 16px;
    background: rgba(0, 0, 0, 0.8);
    border: 3px solid rgba(255, 255, 255, 1);
    margin-left: -20px;
    margin-top: 30px;
  }
  
  .back-button:hover {
    transform: scale(1.05) translateX(-5px);
  }
  
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
}
</style>