<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="isVisible"
        class="loading-overlay"
        :class="{ 
          'loading-overlay--fullscreen': fullscreen, 
          'loading-overlay--inline': !fullscreen 
        }"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <!-- Spinner e Mensagem -->
        <div class="q-pa-md q-gutter-xs">
          <div class="row justify-center" style="font-size: 5em">
            <q-spinner-gears 
              v-if="showSpinner" 
              :color="spinnerColor" 
              :size="spinnerSize" 
            />
          </div>
        </div>
        
        <div v-if="currentMessage" class="text-white q-mt-md text-body1">
          {{ currentMessage }}
        </div>
        
        <slot />
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { watch, ref, onBeforeUnmount, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'Carregando...'
  },
  fullscreen: {
    type: Boolean,
    default: true
  },
  minShowMs: {
    type: Number,
    default: 200
  },
  lockScroll: {
    type: Boolean,
    default: true
  },
  showSpinner: {
    type: Boolean,
    default: true
  },
  spinnerColor: {
    type: String,
    default: 'primary'
  },
  spinnerSize: {
    type: [String, Number],
    default: '64px'
  }
})

const fullscreen = computed(() => props.fullscreen !== false)
const currentMessage = computed(() => props.message)
const minShow = computed(() => props.minShowMs ?? 200)
const lockScroll = computed(() => props.lockScroll !== false)
const spinnerColor = computed(() => props.spinnerColor || 'primary')
const spinnerSize = computed(() => props.spinnerSize || '64px')

const isVisible = ref(false)
let shownAt = 0
let hideTimer = null

function setBodyLock(lock) {
  if (!fullscreen.value || !lockScroll.value) return
  if (typeof document === 'undefined') return
  
  const cls = 'no-scroll'
  if (lock) {
    document.body.classList.add(cls)
  } else {
    document.body.classList.remove(cls)
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = null
      }
      shownAt = Date.now()
      isVisible.value = true
      setBodyLock(true)
    } else {
      const elapsed = Date.now() - shownAt
      const remain = minShow.value - elapsed
      if (remain > 0) {
        hideTimer = setTimeout(() => {
          isVisible.value = false
          setBodyLock(false)
        }, remain)
      } else {
        isVisible.value = false
        setBodyLock(false)
      }
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (hideTimer) clearTimeout(hideTimer)
  setBodyLock(false)
})
</script>

<style lang="scss" scoped>
.loading-overlay {
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  backdrop-filter: blur(1px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &--fullscreen {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    min-height: 100vh !important;
    max-height: 100vh !important;

    /* unidades modernas para mobile */
    @supports (height: 100dvh) {
      height: 100dvh !important;
      min-height: 100dvh !important;
      max-height: 100dvh !important;
    }

    /* safe-areas (notch) */
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }

  &--inline {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }
}

.fade-enter-active,
.fade-leave-active { 
  transition: opacity 0.2s ease; 
}

.fade-enter-from,
.fade-leave-to { 
  opacity: 0; 
}

.text-body1 {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: 0.03125em;
  margin: 1rem;
}

/* Previne scroll quando overlay está ativo */
:global(body.no-scroll) {
  overflow: hidden !important;
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>
