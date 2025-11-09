<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalAudio } from '../../composables/useGlobalAudio'

// 静态资源配置
const BACKGROUND_IMAGES = [
  '/CEOExperience/pause-ceo-0.png',
  '/CEOExperience/pause-ceo-1.png'
]
const VIDEO_SOURCES = [
  '/CEOExperience/video-1.mp4',
  '/CEOExperience/video-2.mp4'
]
const BGM = '/VisitorExperience/bgm.mp3'
const BGM_VOLUME = 0.4

// 响应式状态
const router = useRouter()
const { isMuted, toggleMuted } = useGlobalAudio()
const videoRef = ref(null)
const bgmRef = ref(null)
const hasEnded = ref(false)
const currentVideoIndex = ref(0)
const isinPocket = ref(true)
// 用于标记是否正在从路由参数恢复状态
const isRestoringFromRoute = ref(false)

// 计算属性
const audioLabel = computed(() => (isMuted.value ? '取消静音' : '静音'))
const currentVideoSrc = computed(() => VIDEO_SOURCES[currentVideoIndex.value])
const currentBackground = computed(() => {
  // 当任何视频播放完成时，显示第二个背景图
  return hasEnded.value ? BACKGROUND_IMAGES[1] : BACKGROUND_IMAGES[0]
})

// 同步视频静音状态
const syncVideoMuted = (muted) => {
  const el = videoRef.value
  if (!el) return
  
  el.muted = muted
  
  // 非静音状态且视频未结束时尝试播放
  if (!muted && !hasEnded.value && !el.ended) {
    try {
      const playPromise = el.play()
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(() => {})
      }
    } catch (e) {}
  }
}

// 处理背景音乐播放
const setupBackgroundMusic = () => {
  const el = bgmRef.value
  if (!el) return
  
  el.muted = isMuted.value
  el.volume = BGM_VOLUME
  
  try {
    const playPromise = el.play()
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.catch(() => {})
    }
  } catch (e) {}
}

// 事件处理函数
const handleVideoEnded = () => {
  hasEnded.value = true
}

const handleVideoPlay = () => {
  hasEnded.value = false
}

// 路由导航
const routerTo = (name) => {
  // 保存当前视频状态到路由参数中
  router.push({
    name,
    params: {
      videoIndex: currentVideoIndex.value,
      videoEnded: hasEnded.value,
      inPocket: isinPocket.value
    }
  })
}

const goToNavigation = () => {
  router.push({ name: 'Exhibition' })
}

// 播放下一个视频
const playNextVideo = () => {
  // 暂停当前视频
  const el = videoRef.value
  if (!hasEnded.value && el) {
    try {
      el.pause()
      el.currentTime = 0
    } catch (e) {}
  }
  
  // 播放第二个视频
  currentVideoIndex.value = 1
  hasEnded.value = false
  isinPocket.value = false
}

// 监听视频源变化
watch(currentVideoSrc, () => {
  const el = videoRef.value
  if (!el) return
  
  el.load()
  
  // 根据当前视频索引设置播放状态
  if (currentVideoIndex.value === 1) {
    // 只有在非恢复状态时才重置hasEnded
    if (!isRestoringFromRoute.value) {
      hasEnded.value = false
    }
    syncVideoMuted(isMuted.value)
    
    // 在恢复状态时且hasEnded为true，不尝试播放视频
    if (!isRestoringFromRoute.value || !hasEnded.value) {
      // 尝试播放第二个视频
      try {
        const playPromise = el.play()
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.catch(() => {})
        }
      } catch (e) {}
    }
  } else {
    // 只有在非恢复状态时才重置hasEnded
    if (!isRestoringFromRoute.value) {
      hasEnded.value = false
    }
    syncVideoMuted(isMuted.value)
  }
})

// 监听静音状态变化
watch(isMuted, (muted) => {
  if (videoRef.value) videoRef.value.muted = muted
  if (bgmRef.value) bgmRef.value.muted = muted
})

// 生命周期钩子
onMounted(() => {
  syncVideoMuted(isMuted.value)
  setupBackgroundMusic()
  
  // 标记为正在从路由参数恢复状态
  isRestoringFromRoute.value = true
  
  // 从路由参数中恢复视频状态
  const route = router.currentRoute.value
  if (route.params && (route.params.videoIndex !== undefined || route.params.videoEnded !== undefined)) {
    // 恢复视频索引状态
    if (route.params.videoIndex !== undefined) {
      currentVideoIndex.value = parseInt(route.params.videoIndex) || 0
    }
    
    // 恢复视频是否播放结束的状态
    if (route.params.videoEnded !== undefined) {
      hasEnded.value = route.params.videoEnded === 'true' || route.params.videoEnded === true
    }
    
    // 恢复inPocket状态
    if (route.params.inPocket !== undefined) {
      isinPocket.value = route.params.inPocket === 'true' || route.params.inPocket === true
    }
  }
  
  // 延迟设置标志，确保视频源变化的watch执行完成
  setTimeout(() => {
    isRestoringFromRoute.value = false
  }, 100)
})

onBeforeUnmount(() => {
  const bgmEl = bgmRef.value
  if (!bgmEl) return
  
  try {
    bgmEl.pause()
    bgmEl.currentTime = 0
  } catch (e) {}
})
</script>

<template>
  <div
    class="visitor-experience"
    :style="{ '--background-image': `url(${currentBackground})` }"
  >
    <!-- 背景音乐元素 -->
    <audio
      ref="bgmRef"
      class="background-music"
      loop
      :src="BGM"
      :muted="isMuted"
    />
    
    <!-- 视频元素 -->
    <video
      ref="videoRef"
      class="visitor-video"
      :class="{ 'is-hidden': hasEnded }"
      :src="currentVideoSrc"
      :poster="currentBackground"
      playsinline
      autoplay
      :muted="isMuted"
      @ended="handleVideoEnded"
      @play="handleVideoPlay"
    />

    <!-- 音频控制按钮 -->
    <button
      class="audio-toggle"
      type="button"
      @click="toggleMuted"
      :aria-label="audioLabel"
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
      v-if="currentVideoIndex == 0"
      type="button"
      class="back-button"
      @click="playNextVideo"
      aria-label="开始体验"
    >
      <img
        src="/CEOExperience/empty.png"
        alt="返回主界面"
        class="control-image"
      >
    </button>
    
    <!-- 右下角返回导航页按钮 -->
    <button
      v-if="currentVideoIndex > 0"
      type="button"
      class="nav-back-button"
      @click="goToNavigation"
      aria-label="返回导航页"
    >
      <img
        src="/CEOExperience/backmain.png"
        alt="返回导航页"
        class="control-image"
      >
    </button>

    <!-- 五个锦囊跳转按钮，分为两排 -->
    <div v-if="currentVideoIndex > 0" class="pocket-buttons-container">
      <!-- 第一排：前三个按钮 -->
      <div class="buttons-row">
        <!-- 产品研发理念按钮 -->
        <button
          type="button"
          class="pocket-button pocket-button1"
          @click="routerTo('ProductRationale')"
          aria-label="产品研发理念"
        >
          <img
            src="/CEOExperience/pocket/button1.png"
            alt="产品研发理念"
            class="control-image"
          >
        </button>
        <!-- 市场运营思维按钮 -->
        <button
          type="button"
          class="pocket-button pocket-button2"
          @click="routerTo('MarketThinking')"
          aria-label="市场运营思维"
        >
          <img
            src="/CEOExperience/pocket/button2.png"
            alt="市场运营思维"
            class="control-image"
          >
        </button>
        <!-- 避免同质化思维按钮 -->
        <button
          type="button"
          class="pocket-button pocket-button3"
          @click="routerTo('AvoidHomogenization')"
          aria-label="避免同质化思维"
        >
          <img
            src="/CEOExperience/pocket/button3.png"
            alt="避免同质化思维"
            class="control-image"
          >
        </button>
      </div>
      
      <!-- 第二排：后两个按钮 -->
      <div class="buttons-row buttons-row-second">
        <!-- 企业的社会价值按钮 -->
        <button
          type="button"
          class="pocket-button pocket-button4"
          @click="routerTo('SocialValue')"
          aria-label="企业的社会价值"
        >
          <img
            src="/CEOExperience/pocket/button4.png"
            alt="企业的社会价值"
            class="control-image"
          >
        </button>
        <!-- 未来发展规划按钮 -->
        <button
          type="button"
          class="pocket-button pocket-button5"
          @click="routerTo('FuturePlan')"
          aria-label="未来发展规划"
        >
          <img
            src="/CEOExperience/pocket/button5.png"
            alt="未来发展规划"
            class="control-image"
          >
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 主容器样式 */
.visitor-experience {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-color: #000;
  overflow: hidden;
}

/* 背景图片样式 */
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

/* 音频控制按钮 */
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

/* 背景音乐元素（隐藏） */
.background-music {
  display: none;
}

/* 视频元素样式 */
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

/* 控制图片通用样式 */
.control-image {
  display: block;
  transform: scale(0.9);
}

/* 锦囊点击判定区 */
.back-button {
  position: absolute;
  left: 62%;
  bottom: 36%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.35));
}

.back-button:hover {
  transform: translateY(-4px);
}

.back-button .control-image {
  width: clamp(100px, 20vw, 150px);
  height: auto;
}

/* 右下角返回导航页按钮 */
.nav-back-button {
  position: absolute;
  right: clamp(20px, 5vw, 40px);
  bottom: clamp(20px, 5vw, 40px);
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  transform: scale(1.4);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  z-index: 5;
}

.nav-back-button:hover {
  transform: scale(1.45) translateY(-3px);
}

.nav-back-button .control-image {
  width: clamp(60px, 12vw, 90px);
  height: auto;
}

/* 锦囊按钮容器 */
.pocket-buttons-container {
  position: absolute;
  left: 80%;
  bottom: 10%;
  transform: scale(1.5) translateX(-45%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 85%;
  max-width: 1100px;
}

/* 按钮行样式 */
.buttons-row {
  display: flex;
  justify-content: center;
  gap: clamp(20px, 5vw, 40px);
  margin-bottom: clamp(15px, 3vw, 25px);
}

.buttons-row-second {
  margin-bottom: 0;
  margin-top: -15px;
  margin-left: clamp(30px, 8vw, 60px);
}

/* 锦囊按钮样式 */
.pocket-button {
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.35));
}

.pocket-button:hover {
  transform: translateY(-4px);
}

.pocket-button .control-image {
  width: clamp(90px, 18vw, 150px);
  height: auto;
}

/* 各个按钮的位置微调 */
.pocket-button1 { transform: translateX(-10%); }
.pocket-button2 { transform: translateX(-5%); }
.pocket-button3 { transform: translateX(0); }
.pocket-button4 { transform: translateX(5%); }
.pocket-button5 { transform: translateX(10%); }

/* 移动端响应式 */
@media (max-aspect-ratio: 3 / 4) {
  .visitor-video {
    height: auto;
    min-height: 100vh;
  }
}
</style>
