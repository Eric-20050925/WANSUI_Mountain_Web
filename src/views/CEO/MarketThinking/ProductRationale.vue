<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalAudio } from '../../../composables/useGlobalAudio'

const router = useRouter()
const { isMuted, toggleMuted } = useGlobalAudio()
const videoRef = ref(null)
const hasEnded = ref(false)
const audioLabel = computed(() => (isMuted.value ? 'Unmute audio' : 'Mute audio'))

// 信息展示区域的悬停状态
const hoveredInfo = ref(null)

// 信息展示的数据
const infoData = {
  info1: {
    title: '信息标题1',
    content: '这里是第一个信息展示区域的详细内容，可以包含产品研发理念的相关信息。'
  },
  info2: {
    title: '信息标题2',
    content: '这里是第二个信息展示区域的详细内容，继续阐述产品研发的核心理念。'
  },
  info3: {
    title: '信息标题3',
    content: '这里是第三个信息展示区域的详细内容，介绍产品研发过程中的关键要点。'
  },
  info4: {
    title: '信息标题4',
    content: '这里是第四个信息展示区域的详细内容，总结产品研发理念的重要价值。'
  }
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
  <div class="product-rationale">
    <!-- 背景图片显示，视频播放完成后显示 -->
    <div 
      class="background-image" 
      v-show="hasEnded"
      :style="{ backgroundImage: 'url(/CEOExperience/pause-ceo-2.png)' }"
    ></div>
    
    <!-- 视频播放器 -->
    <video
      ref="videoRef"
      class="product-video"
      src="/CEOExperience/video-3.mp4"
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
    
    <!-- 信息显示触发器，仅在视频播放完成后显示 -->
      <div v-show="hasEnded" class="info-triggers-container">
        <div class="info-triggers-row">
          <!-- 触发器1 -->
          <div 
            class="info-trigger"
            id="info1"
            @mouseenter="hoveredInfo = 'info1'"
            @mouseleave="hoveredInfo = null"
          >
            <img 
              src="/CEOExperience/product/button1.png" 
              alt="产品研发理念1"
              class="trigger-image"
            >
            <!-- 信息展示框 -->
            <div 
              v-show="hoveredInfo === 'info1'" 
              class="info-popup"
              :class="`info-popup-${hoveredInfo}`"
            >
              <!-- 背景图片 -->
              <img src="/CEOExperience/product/info_bg.png" alt="背景" class="info-bg-image">
              <!-- 内容图片 -->
              <img src="/CEOExperience/product/info_title_1.png" alt="标题1" class="info-title-image">
              <img src="/CEOExperience/product/info_content_1.png" alt="内容1" class="info-content-image">
            </div>
          </div>
          
          <!-- 触发器2 -->
          <div 
            class="info-trigger"
            id="info2"
            @mouseenter="hoveredInfo = 'info2'"
            @mouseleave="hoveredInfo = null"
          >
            <img 
              src="/CEOExperience/product/button2.png" 
              alt="产品研发理念2"
              class="trigger-image"
            >
            <div 
              v-show="hoveredInfo === 'info2'" 
              class="info-popup"
              :class="`info-popup-${hoveredInfo}`"
            >
              <!-- 背景图片 -->
              <img src="/CEOExperience/product/info_bg.png" alt="背景" class="info-bg-image">
              <!-- 内容图片 -->
              <img src="/CEOExperience/product/info_title_2.png" alt="标题2" class="info-title-image">
              <img src="/CEOExperience/product/info_content_2.png" alt="内容2" class="info-content-image">
            </div>
          </div>
          
          <!-- 触发器3 -->
          <div 
            class="info-trigger"
            id="info3"
            @mouseenter="hoveredInfo = 'info3'"
            @mouseleave="hoveredInfo = null"
          >
            <img 
              src="/CEOExperience/product/button3.png" 
              alt="产品研发理念3"
              class="trigger-image"
            >
            <div 
              v-show="hoveredInfo === 'info3'" 
              class="info-popup"
              :class="`info-popup-${hoveredInfo}`"
            >
              <!-- 背景图片 -->
              <img src="/CEOExperience/product/info_bg.png" alt="背景" class="info-bg-image">
              <!-- 内容图片 -->
              <img src="/CEOExperience/product/info_title_3.png" alt="标题3" class="info-title-image">
              <img src="/CEOExperience/product/info_content_3.png" alt="内容3" class="info-content-image">
            </div>
          </div>
          
          <!-- 触发器4 -->
          <div 
            class="info-trigger"
            id="info4"
            @mouseenter="hoveredInfo = 'info4'"
            @mouseleave="hoveredInfo = null"
          >
            <img 
              src="/CEOExperience/product/button4.png" 
              alt="产品研发理念4"
              class="trigger-image"
            >
            <div 
              v-show="hoveredInfo === 'info4'" 
              class="info-popup"
              :class="`info-popup-${hoveredInfo}`"
            >
              <!-- 背景图片 -->
              <img src="/CEOExperience/product/info_bg.png" alt="背景" class="info-bg-image">
              <!-- 内容图片 -->
              <img src="/CEOExperience/product/info_title_4.png" alt="标题4" class="info-title-image">
              <img src="/CEOExperience/product/info_content_4.png" alt="内容4" class="info-content-image">
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<style scoped>
.product-rationale {
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

.product-video {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  object-fit: cover;
  background: transparent;
  transition: opacity 0.6s ease;
}

.product-video.is-hidden {
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

.info-triggers-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.info-triggers-row {
  position: relative;
  width: 100%;
  height: 100%;
}

.info-trigger {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* 为每个触发器定义独立位置样式 */
#info1 {
  position: absolute;
  top: 20%;
  left: 25%;
}

#info2 {
  position: absolute;
  top: 35%;
  left: 65%;
}

#info3 {
  position: absolute;
  top: 60%;
  left: 30%;
}

#info4 {
  position: absolute;
  top: 70%;
  left: 60%;
}

/* 为每个触发器的图片设置独立缩放样式 */
#info1 .trigger-image {
  transform: scale(2.4); 
}

#info2 .trigger-image {
  transform: scale(1.6); 
}

#info3 .trigger-image {
  transform: scale(1.0);
}

#info4 .trigger-image {
  transform: scale(1.15); 
}

.info-trigger:hover {
  transform: translateY(-5px) scale(1.05);
}

.trigger-image {
  width: clamp(80px, 15vw, 120px);
  height: auto;
  display: block;
}

/* 移除圆形区域样式 */

/* 信息弹出框样式 */
.info-popup {
  position: absolute;
  padding: 0;
  z-index: 10;
  animation: fadeIn 0.3s ease;
  display: inline-block;
  /* 让容器根据背景图片自适应大小 */
  width: fit-content;
  height: fit-content;
  /* 确保内容居中 */
  text-align: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-bg-image {
  display: block;
  width: auto;
  height: auto;
  max-width: 600px;
  position: relative;
  z-index: 1;
}

.info-title-image,
.info-content-image {
  position: absolute;
  width: auto;
  height: auto;
  max-width: 80%; /* 内容图片稍小于背景图片 */
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.info-title-image {
  top: 10%; /* 标题图片位置，考虑到缩放，向上调整位置 */
  max-width: 85%; /* 标题图片可以稍宽一些 */
  transform: translateX(-50%) scale(0.5); /* 确保水平居中并缩放 */
}

.info-content-image {
  top: 40%; /* 内容图片放在标题下方，考虑到标题图片缩放，调整位置 */
  max-width: 75%;
  transform: translateX(-50%) scale(1.1); /* 确保水平居中并缩放 */
}

/* 每个弹出框的位置调整 - 显示在按钮上方 */
.info-popup-info1,
.info-popup-info2,
.info-popup-info3,
.info-popup-info4 {
  bottom: 120%; /* 增加距离，确保不与按钮重叠 */
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0;
}

/* 增强视觉效果 */
.info-popup {
  border: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

@media (max-aspect-ratio: 3 / 4) {
  .product-video {
    height: auto;
    min-height: 100vh;
  }
  
  /* 调整移动端布局 */
  .info-triggers-container {
    top: 0;
  }
  
  /* 移动端触发器位置调整 */
  #info1 {
    top: 15%;
    left: 20%;
  }
  
  #info2 {
    top: 30%;
    left: 60%;
  }
  
  #info3 {
    top: 55%;
    left: 25%;
  }
  
  #info4 {
    top: 65%;
    left: 55%;
  }
  
  /* 移动端触发器图片缩放调整 */
  #info1 .trigger-image {
    transform: scale(0.95); /* 移动端第一个触发器图片稍微小一点 */
  }
  
  #info2 .trigger-image {
    transform: scale(1.05); /* 移动端第二个触发器图片稍微大一点 */
  }
  
  #info3 .trigger-image {
    transform: scale(0.85); /* 移动端第三个触发器图片更小一点 */
  }
  
  #info4 .trigger-image {
    transform: scale(1.1); /* 移动端第四个触发器图片最大 */
  }
  
  .trigger-image {
    width: clamp(70px, 12vw, 100px);
  }
  
  /* 调整移动端弹出框位置 */
  .info-popup {
    max-width: 95vw; /* 在移动端使用更大的宽度 */
  }
  
  /* 移动端背景图片限制 */
  .info-bg-image {
    max-width: 95vw;
  }
  
  /* 移动端内容图片调整 */
  .info-title-image,
  .info-content-image {
    max-width: 75%; /* 确保在小屏幕上也能清晰显示 */
  }
  
  /* 调整标题和内容图片在移动端的位置 */
  .info-title-image {
    top: 15%; /* 在移动端标题位置，考虑到缩放，向上调整位置 */
    transform: translateX(-50%) scale(0.5); /* 确保水平居中并缩放 */
  }
  
  .info-content-image {
    top: 35%; /* 在移动端内容放在标题下方，考虑到标题图片缩放，调整位置 */
    transform: translateX(-50%); /* 确保水平居中 */
  }
  
  /* 为所有弹出框统一设置移动端位置 */
  [class^="info-popup-info"] {
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 0;
  }
}
</style>