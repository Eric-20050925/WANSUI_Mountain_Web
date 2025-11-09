<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 当前页面索引，从1开始
const currentPage = ref(1)
// 总页数
const totalPages = 4
// 按钮可点击状态，按顺序启用
const buttonStates = ref([
  { id: 'detailButton1', enabled: true },  // 第一个按钮默认可点击
  { id: 'detailButton2', enabled: false },
  { id: 'detailButton3', enabled: false }
])

// 返回MarketThinking组件
const goBackToMarket = () => {
  router.push('/market-thinking')
}

// 按钮点击处理函数
const handleButtonClick = (buttonIndex) => {
  // 检查按钮是否可点击
  if (!buttonStates.value[buttonIndex].enabled) return
  
  // 更新当前页面
  currentPage.value++
  
  // 如果不是最后一页，启用下一个按钮
  if (currentPage.value < totalPages) {
    buttonStates.value[buttonIndex + 1].enabled = true
  }
}

// 获取当前背景图路径
const getCurrentBackground = () => {
  return `/CEOExperience/market/asset/page${currentPage.value}.png`
}
</script>

<template>
  <div class="market-detail">
    <!-- 背景图片，根据当前页面动态切换 -->
    <div 
      class="background-image" 
      :style="{ backgroundImage: `url(${getCurrentBackground()})` }"
    ></div>
    
    <!-- 按钮区域 -->
    <div class="buttons-container">
      <!-- 按钮1 - 第一个按钮位置 -->
      <button
        v-if="currentPage <= 3"
        :id="buttonStates[0].id"
        class="detail-button"
        :class="{ 'enabled': buttonStates[0].enabled, 'disabled': !buttonStates[0].enabled }"
        :disabled="!buttonStates[0].enabled"
        @click="handleButtonClick(0)"
      >
        <!-- 空按钮，点击区域基于背景图位置 -->
      </button>
      
      <!-- 按钮2 - 第二个按钮位置 -->
      <button
        v-if="currentPage <= 3"
        :id="buttonStates[1].id"
        class="detail-button"
        :class="{ 'enabled': buttonStates[1].enabled, 'disabled': !buttonStates[1].enabled }"
        :disabled="!buttonStates[1].enabled"
        @click="handleButtonClick(1)"
      >
        <!-- 空按钮，点击区域基于背景图位置 -->
      </button>
      
      <!-- 按钮3 - 第三个按钮位置 -->
      <button
        v-if="currentPage <= 3"
        :id="buttonStates[2].id"
        class="detail-button"
        :class="{ 'enabled': buttonStates[2].enabled, 'disabled': !buttonStates[2].enabled }"
        :disabled="!buttonStates[2].enabled"
        @click="handleButtonClick(2)"
      >
        <!-- 空按钮，点击区域基于背景图位置 -->
      </button>
    </div>
    
    <!-- 返回导航按钮 -->
    <button
      class="back-navigation-button"
      type="button"
      @click="goBackToMarket"
    >
      返回导航
    </button>
  </div>
</template>

<style scoped>
.market-detail {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.background-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
  transition: background-image 0.5s ease;
}

.buttons-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.detail-button {
  position: absolute;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 150px;
  height: 150px;
  transition: all 0.3s ease;
}

.detail-button.enabled {
  cursor: pointer;
  filter: brightness(1);
}

.detail-button.disabled {
  cursor: not-allowed;
  filter: brightness(0.5);
  pointer-events: none;
}

/* 按钮位置 - 根据page1.png上的三个位置设置 */
/* 这里使用大致位置，实际需要根据设计稿调整 */
#detailButton1 {
  top: 0%;
  left: 40%;
}

#detailButton2 {
  top: 30%;
  left: 10%;
}

#detailButton3 {
  top: 30%;
  left: 80%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-button {
    width: 100px;
    height: 100px;
  }
  
  #detailButton1 {
    top: 30%;
    left: 15%;
  }
  
  #detailButton2 {
    top: 50%;
    left: 65%;
  }
  
  #detailButton3 {
    top: 70%;
    left: 40%;
  }
}

@media (max-width: 480px) {
  .detail-button {
    width: 80px;
    height: 80px;
  }
}

/* 返回导航按钮样式 */
.back-navigation-button {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: 2px solid white;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
}

.back-navigation-button:hover {
  background-color: rgba(0, 0, 0, 0.9);
  transform: translateX(-50%) scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.back-navigation-button:active {
  transform: translateX(-50%) scale(0.95);
}

/* 移动端返回导航按钮样式 */
@media (max-width: 768px) {
  .back-navigation-button {
    width: 120px;
    height: 50px;
    font-size: 16px;
    border-width: 3px;
  }
}
</style>