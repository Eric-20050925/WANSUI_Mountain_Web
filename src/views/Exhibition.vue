<script setup>
import { computed, ref, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalAudio } from '../composables/useGlobalAudio'
import { useSharedBgm } from '../composables/useSharedBgm'

const characters = [
  {
    id: "visitor",
    image: "/Exhibition/visitor.png",
    plaque: "/Exhibition/visitor-plaque.png",
    plaqueWidth: "60%",
    scale: "118%",
    position: "center 96%",
    detailTitle: "/Exhibition/visitor-detail-title.png",
    detailText: "/Exhibition/visitor-detail-text.png",
    detailFigureWidth: "clamp(320px, 42vw, 520px)",
    detailFigureMaxHeight: "clamp(690px, 90vh, 860px)",

    details: [
      { text: "普通游客", variant: "heading" },
      { text: "我是从外地专门来的！在万岁山待了3天，玩到\n不想走！精彩到想拉着你从头唠一遍，要不要听？", variant: "body" },
      { text: "高阶游客", variant: "heading" },
      { text: "我是游客，但也可以是野生NPC，出一次美美的\nCOS，“集邮”“直播”都不耽误~", variant: "body" }
    ]
  },
  {
    id: "staff",
    image: "/Exhibition/staff.png",
    plaque: "/Exhibition/staff-plaque.png",
    plaqueWidth: "90%",
    scale: "146%",
    position: "center 96%",
    detailTitle: "/Exhibition/staff-detail-title.png",
    detailText: "/Exhibition/staff-detail-text.png",
    detailFigureWidth: "clamp(320px, 42vw, 520px)",
    detailFigureMaxHeight: "clamp(660px, 90vh, 860px)",
    detailParagraphsHeight: "clamp(165px, 24vh, 270px)",
    details: [
      { text: "NPC", variant: "heading" },
      { text: "我就是路边那个爱 “搞事情” 的乞丐！日常就是追着\n游客 “讨钱” 玩，哎？你也好奇丐帮里的那些江湖事儿？", variant: "body" },
      { text: "内容制作者", variant: "heading" },
      { text: "我是“乙方”，但我不是“牛马”，在这里我们有尽情\n发挥的舞台！", variant: "body" }

    ]
  },
  {
    id: "ceo",
    image: "/Exhibition/ceo.png",
    plaque: "/Exhibition/ceo-plaque.png",
    plaqueWidth: "60%",
    scale: "104%",
    position: "center 92%",
    detailTitle: "/Exhibition/ceo-detail-title.png",
    detailText: "/Exhibition/ceo-detail-text.png",
    detailFigureWidth: "clamp(320px, 42vw, 520px)",
    detailFigureMaxHeight: "clamp(660px, 90vh, 860px)",
    detailFigureLift: "clamp(30px, 8vh, 120px)",
    detailParagraphsHeight: "clamp(240px, 40vh, 380px)",
    details: [
      { text: "李孝杰", variant: "heading" },
      { text: "没错，我就是开封万岁山游览区的 CEO！要把这么大\n一个景区经营好，里头的门道可太多了，想知道我是怎么\n干的不？", variant: "body" }
    ]
  },
  {
    id: "culture",
    image: "/Exhibition/culture.png",
    plaque: "/Exhibition/culture-plaque.png",
    plaqueWidth: "92%",
    scale: "112%",
    position: "center 35%",
    detailTitle: "/Exhibition/culture-detail-title.png",
    detailText: "/Exhibition/culture-detail-text.png",
    detailFigureWidth: "clamp(320px, 42vw, 520px)",
    detailFigureMaxHeight: "clamp(660px, 90vh, 860px)",
    detailParagraphsHeight: "clamp(240px, 40vh, 380px)",
    details: [
      { text: "河南文旅局", variant: "heading" },
      { text: "咦～咱河南的文旅向来都可重视，这阵子的成果大家伙\n儿也都有目共睹。从一火就爆的晚会舞台，再到旅游业的发\n展，来瞅瞅咱的经验和规划中不中呀！", variant: "body" }
    ]
  },
  {
    id: "media",
    image: "/Exhibition/media.png",
    plaque: "/Exhibition/media-plaque.png",
    plaqueWidth: "90%",
    scale: "112%",
    position: "center 96%",
    detailTitle: "/Exhibition/media-detail-title.png",
    detailText: "/Exhibition/media-detail-text.png",
    detailFigureWidth: "clamp(320px, 42vw, 520px)",
    detailFigureMaxHeight: "clamp(660px, 90vh, 860px)",
    detailParagraphsHeight: "clamp(180px, 28vh, 300px)",
    details: [
      { text: "广大媒体", variant: "heading" },
      { text: "万岁山这波火得也太猛了！这热度咱可不能错过！得赶紧\n挖挖热点，找找值得报道的好案例，一起跟紧节奏~", variant: "body" }
    ]
  }
];

const { isMuted, toggleMuted, setMuted } = useGlobalAudio()
const {
  bgmCurrentTime,
  shouldResumeBgm,
  setBgmCurrentTime,
  setShouldResumeBgm
} = useSharedBgm()
const router = useRouter()
const audioLabel = computed(() => (isMuted.value ? 'Unmute audio' : 'Mute audio'))
const bgmRef = ref(null)
const BGM = '/BeforeExhibitionPage/bgm.mp3'

const characterRoutes = {
  visitor: {
    primary: { name: 'VisitorExperience' },
    secondary: { name: 'VisitorJourney' }
  },
  staff: {
    primary: { name: 'StaffExperience' },
    secondary: { name: 'StaffJourney' }
  },
  ceo: {
    primary: { name: 'CEOExperience' }
  },
  culture: {
    primary: { name: 'CultureExperience' }
  },
  media: {
    primary: { name: 'MediaExperience' }
  }
}

const ensureBgmPlayback = async () => {
  const bgmEl = bgmRef.value
  if (!bgmEl) {
    return
  }

  try {
    await bgmEl.play()
  } catch (error) {
    if (!isMuted.value) {
      bgmEl.muted = true
      try {
        await bgmEl.play()
      } catch (_) {
        /* ignore autoplay failure */
      }
    }
  }
}

const updateBgmTime = () => {
  const bgmEl = bgmRef.value
  if (!bgmEl) {
    return
  }
  setBgmCurrentTime(bgmEl.currentTime || 0)
}

const portraitStyle = (person) => ({
  backgroundImage: `url(${person.image})`,
  backgroundSize: person.scale ?? 'contain',
  backgroundPosition: person.position ?? 'center 85%'
})

const plaqueStyle = (person) => ({
  width: person.plaqueWidth ?? 'calc(100% - clamp(24px, 4vw, 40px))'
})

const detailFigureStyle = (person) => {
  if (!person) {
    return {}
  }
  const style = {}
  if (person.detailFigureLift) {
    style['--figure-lift'] = person.detailFigureLift
  }
  if (person.detailFigureWidth) {
    style.width = person.detailFigureWidth
  }
  if (person.detailFigureMaxHeight) {
    style.maxHeight = person.detailFigureMaxHeight
  }
  return style
}

const detailParagraphsStyle = (person) => {
  if (!person) {
    return {}
  }
  const style = {}
  if (person.detailParagraphsHeight) {
    style.height = person.detailParagraphsHeight
  }
  if (person.detailParagraphsMinHeight) {
    style.minHeight = person.detailParagraphsMinHeight
  }
  if (person.detailParagraphsMaxHeight) {
    style.maxHeight = person.detailParagraphsMaxHeight
  }
  return style
}

const paragraphVariant = (entry) =>
  typeof entry === 'object' && entry?.variant ? entry.variant : 'body'

const paragraphLines = (entry) => {
  const raw = typeof entry === 'string' ? entry : entry?.text ?? ''
  return raw.split(/\n/g)
}

const canNavigate = (person) => {
  const routes = characterRoutes[person?.id]
  return Boolean(routes?.primary)
}

const activeCharacter = ref(null)
let hoverTimeout = null

const setActive = (person) => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
  activeCharacter.value = person
}

const scheduleClear = () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
  }
  hoverTimeout = setTimeout(() => {
    activeCharacter.value = null
    hoverTimeout = null
  }, 80)
}

const keepActive = () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
}

const navigateToDetail = (person, event) => {
  const routes = characterRoutes[person?.id]
  if (!routes?.primary) {
    return
  }

  let target = routes.primary

  if (
    routes.secondary &&
    typeof MouseEvent !== 'undefined' &&
    event instanceof MouseEvent &&
    event.currentTarget instanceof HTMLElement &&
    event.currentTarget.classList.contains('detail-panel')
  ) {
    const rect = event.currentTarget.getBoundingClientRect()
    if (rect.height > 0) {
      const relativeY = event.clientY - rect.top
      if (relativeY > rect.height / 2) {
        target = routes.secondary
      }
    }
  }

  const location = target.params
    ? { ...target, params: { ...target.params } }
    : { ...target }
  router.push(location)
}

onMounted(() => {
  const bgmEl = bgmRef.value
  if (bgmEl) {
    bgmEl.muted = isMuted.value
    if (shouldResumeBgm.value && bgmCurrentTime.value > 0) {
      try {
        bgmEl.currentTime = bgmCurrentTime.value
      } catch (_) {
        /* ignore seek failure */
      }
      setShouldResumeBgm(false)
    }
    bgmEl.addEventListener('timeupdate', updateBgmTime, { passive: true })
    ensureBgmPlayback()
  }
})

onBeforeUnmount(() => {
  const bgmEl = bgmRef.value
  if (bgmEl) {
    setBgmCurrentTime(bgmEl.currentTime || 0)
    setShouldResumeBgm(true)
    bgmEl.removeEventListener('timeupdate', updateBgmTime)
    bgmEl.pause()
    bgmEl.currentTime = 0
  }
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
})

watch(isMuted, (muted) => {
  const bgmEl = bgmRef.value
  if (!bgmEl) {
    return
  }
  bgmEl.muted = muted
  if (!muted) {
    ensureBgmPlayback()
  }
})
</script>

<template>
  <div class="exhibition-page">
    <audio
      ref="bgmRef"
      :src="BGM"
      loop
      class="bg-music"
      :muted="isMuted"
    />
    <button
      type="button"
      class="audio-toggle"
      :aria-label="audioLabel"
      @click="toggleMuted"
    >
      <svg
        v-if="isMuted"
        class="icon"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="white" stroke-width="2" stroke-linejoin="round" />
        <path d="M15 9L20 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M20 9L15 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <svg
        v-else
        class="icon"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="white" stroke-width="2" stroke-linejoin="round" />
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

    <header class="page-header">
      <img
        src="/Exhibition/title.png"
        alt="浜虹墿浠嬬粛"
        class="title-image"
      >
    </header>

    <section class="character-grid">
      <article
        v-for="person in characters"
        :key="person.id"
        :class="[
          'character-card',
          {
            'character-card--link': canNavigate(person),
            'character-card--active': activeCharacter?.id === person.id
          }
        ]"
        @mouseenter="setActive(person)"
        @mouseleave="scheduleClear"
        @click="navigateToDetail(person, $event)"
        @keyup.enter="navigateToDetail(person, $event)"
        :tabindex="canNavigate(person) ? 0 : null"
        :role="canNavigate(person) ? 'button' : null"
      >
        <img
          v-if="person.plaque"
          :src="person.plaque"
          alt=""
          class="role-plaque"
          :style="plaqueStyle(person)"
          aria-hidden="true"
        >
        <div
          class="portrait"
          :style="portraitStyle(person)"
          role="presentation"
        />
      </article>
    </section>

    <transition name="detail-fade">
      <div
        v-if="activeCharacter"
        :class="['detail-panel', { 'detail-panel--link': canNavigate(activeCharacter) }]"
        @mouseenter="keepActive"
        @mouseleave="scheduleClear"
        @click="navigateToDetail(activeCharacter, $event)"
        @keyup.enter="navigateToDetail(activeCharacter, $event)"
        :tabindex="canNavigate(activeCharacter) ? 0 : null"
        :role="canNavigate(activeCharacter) ? 'button' : null"
      >
        <div class="detail-panel-body">
          <div class="detail-panel-figure">
            <img
              v-if="activeCharacter.detailTitle"
              :src="activeCharacter.detailTitle"
              alt=""
              class="detail-panel-title-overlay"
            >
            <img
              :src="activeCharacter.image"
              alt=""
              class="detail-panel-figure-image"
              :style="detailFigureStyle(activeCharacter)"
            >
          </div>
          <div class="detail-panel-content">
            <img
              v-if="activeCharacter.detailText"
              :src="activeCharacter.detailText"
              alt=""
              class="detail-panel-text"
            >
            <div
              v-if="activeCharacter.details?.length"
              class="detail-panel-paragraphs"
              :style="detailParagraphsStyle(activeCharacter)"
            >
              <p
                v-for="(paragraph, index) in activeCharacter.details"
                :key="index"
                :class="['detail-paragraph', `detail-paragraph--${paragraphVariant(paragraph)}`]"
              >
                {{
                  typeof paragraph === "string"
                    ? paragraph
                    : paragraph?.text ?? ""
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.exhibition-page {
  position: relative;
  min-height: 100vh;
  padding: clamp(32px, 6vw, 80px) clamp(24px, 5vw, 72px) clamp(60px, 8vw, 120px);
  color: #fff;
  background: url('/Exhibition/background.png') center / cover no-repeat;
  overflow: hidden;
}

.bg-music {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
}

.page-header,
.character-grid,
.audio-toggle {
  position: relative;
  z-index: 1;
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
}

.audio-toggle:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.85);
}

.audio-toggle .icon {
  width: 24px;
  height: 24px;
}

.page-header {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: clamp(24px, 6vw, 72px);
}

.title-image {
  max-width: clamp(320px, 60vw, 760px);
  width: 100%;
  height: auto;
  filter: drop-shadow(0 20px 55px rgba(0, 0, 0, 0.48));
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: clamp(12px, 1vw, 24px);
  margin-top: clamp(36px, 10vw, 160px);
}

.character-card {
  position: relative;
  padding: clamp(18px, 3vw, 28px) clamp(12px, 2vw, 18px) clamp(24px, 4vw, 36px);
  background: rgba(12, 12, 12, 0.42);
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.character-card--link {
  cursor: pointer;
}

.character-card--link:focus-visible {
  outline: 2px solid rgba(255, 244, 229, 0.85);
  outline-offset: 6px;
  animation: character-card-bob 0.9s ease-in-out 0.12s infinite alternate both;
}

.character-card:hover,
.character-card--active {
  transform: translateY(-6px);
  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.5);
}

.character-card--link:hover,
.character-card--link:focus-visible,
.character-card--link.character-card--active,
.detail-panel--link:focus-visible {
  animation: character-card-bob 0.9s ease-in-out 0.12s infinite alternate both;
}

.role-plaque {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -45%);
  height: auto;
  max-width: 110%;
  filter: drop-shadow(0 16px 32px rgba(0, 0, 0, 0.45));
  pointer-events: none;
}

.portrait {
  width: 100%;
  aspect-ratio: 3 / 4;
  background-position: center 90%;
  background-size: contain;
  background-repeat: no-repeat;
  filter: drop-shadow(0 12px 26px rgba(0, 0, 0, 0.55));
}

.detail-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: clamp(340px, 55vh, 520px);
  padding: clamp(24px, 5vw, 48px) clamp(32px, 8vw, 96px);
  background: linear-gradient(180deg, rgba(10, 10, 10, 0.88), rgba(28, 22, 16, 0.9));
  box-shadow: 0 -18px 48px rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  z-index: 10;
  pointer-events: auto;
}

.detail-panel--link {
  cursor: pointer;
}

.detail-panel--link:focus-visible {
  outline: 2px solid rgba(255, 244, 229, 0.85);
  outline-offset: 6px;
}

.character-card--link:focus-visible,
.character-card--link:hover,
.detail-panel--link:focus-visible {
  animation: character-card-bob 0.9s ease-in-out 0.12s infinite alternate both;
}

.detail-panel-body {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(220px, clamp(280px, 26vw, 360px)) 1fr;
  gap: clamp(24px, 6vw, 80px);
  align-items: end;
}

.detail-panel-figure {
  --figure-lift: clamp(20px, 6vh, 80px);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.detail-panel-figure-image {
  width: clamp(240px, 32vw, 420px);
  max-height: clamp(320px, 52vh, 480px);
  object-fit: contain;
  filter: drop-shadow(0 26px 46px rgba(0, 0, 0, 0.65));
  transform: translateY(calc(var(--figure-lift) * -1));
}

.detail-panel-title-overlay {
  position: absolute;
  top: calc(60% - clamp(0px, 2vh, 40px));
  left: calc(64% + 200px);
  width: clamp(220px, 32vw, 420px);
  height: auto;
  transform: translate(-50%, calc(-50% - var(--figure-lift)));
  filter: drop-shadow(0 18px 34px rgba(0, 0, 0, 0.6));
  pointer-events: none;
  z-index: 2;
}

.detail-panel-content {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 3vw, 32px);
  align-items: flex-start;
  transform: translate(clamp(150px, 15vw, 300px), clamp(-200px, -40vh, -115px));
}

.detail-panel-text {
  max-width: clamp(320px, 42vw, 520px);
  width: 100%;
  height: auto;
}

.detail-panel-paragraphs {
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2.2vw, 20px);
  width: max-content;
  max-width: none;
}

.detail-paragraph {
  margin: 0;
  text-indent: 2em;
  color: rgba(255, 244, 229, 0.9);
  font-size: clamp(14px, 1.15vw, 18px);
  line-height: 1.68;
  white-space: pre;
}

.detail-paragraph--heading {
  text-indent: 0;
  font-family: 'FZQianLXSJW', 'FZQingLongSongS', 'STKaiti', 'KaiTi', serif;
  font-size: clamp(24px, 3.6vw, 48px);
  line-height: 1.3;
  color: rgba(255, 250, 240, 0.95);
}

.detail-paragraph--body {
  font-family: '华文仿宋', 'STFangsong', 'FangSong', serif;
  font-size: clamp(18px, 2.2vw, 32px);
  line-height: 1.7;
}

.detail-fade-enter-active,
.detail-fade-leave-active {
  transition: opacity 0.28s ease;
}

.detail-fade-enter-from,
.detail-fade-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .exhibition-page {
    padding: clamp(24px, 6vw, 48px) clamp(18px, 6vw, 40px) clamp(48px, 10vw, 80px);
  }

  .character-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  .detail-panel {
    height: auto;
    min-height: clamp(300px, 55vh, 420px);
    padding: clamp(20px, 6vw, 36px);
  }

  .detail-panel-body {
    grid-template-columns: 1fr;
    text-align: center;
    align-items: center;
  }

  .detail-panel-content {
    align-items: center;
  }

  .detail-panel-text {
    max-width: clamp(260px, 60vw, 520px);
  }
}

@media (max-width: 520px) {
  .character-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }

  .role {
    letter-spacing: 0.2em;
    text-indent: 0.2em;
  }
}

@keyframes character-card-bob {
  from {
    transform: translateY(-6px) scale(1);
  }
  to {
    transform: translateY(-10px) scale(1.02);
  }
}
</style>



