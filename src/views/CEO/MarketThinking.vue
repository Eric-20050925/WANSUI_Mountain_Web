<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalAudio } from '../../composables/useGlobalAudio'

const router = useRouter()
const { isMuted, toggleMuted } = useGlobalAudio()
const videoRef = ref(null)
const hasEnded = ref(false)
const audioLabel = computed(() => (isMuted.value ? '取消静音' : '静音'))

// 信息展示区域的悬停状态
const hoveredInfo = ref(null)

// 缩放控制参数 - 提供可调整的缩放元素
const scaleControls = {
  button1: ref(1), // 默认缩放比例，可根据需要调整
  button2: ref(1),
  button3: ref(1)
}

const handleVideoEnded = () => {
  hasEnded.value = true
}

const handleVideoPlay = () => {
  hasEnded.value = false
}

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

// 返回上一页
const goBack = () => {
  // 导航到打开锦囊出现五个选项的页面，并传递状态参数
  router.push({
    path: '/ceo-experience',
    params: {
      videoIndex: '1',  // 确保返回时显示第二个视频
      videoEnded: 'true', // 确保返回时视频已播放完成
      inPocket: 'true' // 确保在pocket状态
    }
  })
}

// 按钮点击函数
const handleButtonClick = (buttonId) => {
  if (buttonId === 'button1') {
    // 活跃IP按钮，跳转到活跃IP页面
    router.push('/active-ip')
  } else if (buttonId === 'button2') {
    // 对赌协议按钮，跳转到对赌协议页面
    router.push('/bet-agreement')
  } else if (buttonId === 'button3') {
    // 市场详情按钮，跳转到市场详情页面
    router.push('/market-detail')
  } else {
    console.log(`按钮 ${buttonId} 被点击`)
    // 其他按钮的预留逻辑
  }
}

onMounted(() => {
  syncVideoMuted(isMuted.value)
})

onBeforeUnmount(() => {
  const el = videoRef.value
  if (el) {
    el.pause()
    el.currentTime = 0
  }
})
</script>

<template>
  <div class="market-thinking">
    <!-- 背景图片显示，视频播放完成后显示 -->
    <div 
      class="background-image" 
      v-show="hasEnded"
      :style="{ backgroundImage: 'url(/CEOExperience/pause-ceo-2.png)' }"
    ></div>
    
    <!-- 视频播放器 -->
    <video
      ref="videoRef"
      class="market-video"
      src="/CEOExperience/video-4.mp4"
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
    
    <!-- 返回按钮，仅在视频播放完成后显示 -->
    <button
      v-show="hasEnded"
      class="back-button"
      type="button"
      @click="goBack"
    >
      <img
        src="/CEOExperience/backmain.png"
        alt="返回"
        class="control-image"
      >
    </button>
    
    <!-- 按钮区域，仅在视频播放完成后显示 -->
    <div v-show="hasEnded" class="buttons-container">
      <div class="buttons-row">
        <!-- 按钮1 -->
        <div 
          class="info-button"
          id="button1"
          @click="handleButtonClick('button1')"
          :style="{ transform: `scale(${scaleControls.button1})` }"
        >
          <img 
            src="/CEOExperience/market/button1.png" 
            alt="市场运营思维1"
            class="button-image"
          >
        </div>
        
        <!-- 按钮2 -->
        <div 
          class="info-button"
          id="button2"
          @click="handleButtonClick('button2')"
          :style="{ transform: `scale(${scaleControls.button2})` }"
        >
          <img 
            src="/CEOExperience/market/button2.png" 
            alt="市场运营思维2"
            class="button-image"
          >
        </div>
        
        <!-- 按钮3 -->
        <div 
          class="info-button"
          id="button3"
          @click="handleButtonClick('button3')"
          :style="{ transform: `scale(${scaleControls.button3})` }"
        >
          <img 
            src="/CEOExperience/market/button3.png" 
            alt="市场运营思维3"
            class="button-image"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.market-thinking {
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

.market-video {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  object-fit: cover;
  background: transparent;
  transition: opacity 0.6s ease;
}

.market-video.is-hidden {
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

.back-button {
  position: absolute;
  left: 68%; /* 放在左边，距离左侧有一定距离 */
  bottom: 8%; /* 垂直居中 */
  transform: scale(1.4);
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.2s ease, scale 0.2s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  z-index: 5;
}

.back-button:hover {
  transform: scale(1.45) translateY(-3px); /* 稍微放大并上移一点 */
}

.back-button .control-image {
  width: clamp(60px, 12vw, 90px);
  height: auto;
}

/* 按钮容器样式 */
.buttons-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.buttons-row {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 按钮样式 */
.info-button {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease, filter 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  z-index: 5;
}

/* 按钮交互效果 */
.info-button:hover {
  transform: translateY(-8px) scale(1.05);
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
}

.info-button:active {
  transform: scale(0.98);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* 按钮图片样式 */
.button-image {
  width: auto;
  height: auto;
  display: block;
}

/* 按钮位置样式 */
#button1 {
  position: absolute;
  top: 20%;
  left: 0%;
  transform: scale(0.3);
}

#button2 {
  position: absolute;
  top: 30%;
  left: 10%;
  transform: scale(0.2);
}

#button3 {
  position: absolute;
  top: 50%;
  left: 40%;
  transform: scale(0.3);
}

/* 响应式设计 */
@media (max-aspect-ratio: 3 / 4) {
  .market-video {
    height: auto;
    min-height: 100vh;
  }
  
  /* 移动端按钮位置调整 */
  #button1 {
    top: 20%;
    left: 20%;
  }
  
  #button2 {
    top: 45%;
    left: 50%;
  }
  
  #button3 {
    top: 70%;
    left: 80%;
  }
  
  /* 移动端按钮图片大小调整 */
  .button-image {
    width: clamp(60px, 20vw, 120px);
  }
}
</style>