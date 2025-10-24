<template>
  <div class="inline-block">
    <!-- Loading Spinner -->
    <div
      v-if="variant === 'spinner'"
      :class="spinnerClasses"
      class="animate-spin"
    >
      <svg
        class="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>

    <!-- Dots Loading -->
    <div
      v-else-if="variant === 'dots'"
      class="flex space-x-1"
    >
      <div
        v-for="i in 3"
        :key="i"
        :class="[dotClasses, `animate-pulse`]"
        :style="{ animationDelay: `${(i - 1) * 0.2}s` }"
        class="rounded-full animate-bounce"
      />
    </div>

    <!-- Pulse Loading -->
    <div
      v-else-if="variant === 'pulse'"
      :class="pulseClasses"
      class="animate-pulse-soft rounded-lg bg-gray-200 dark:bg-gray-700"
    />

    <!-- Skeleton Loading -->
    <div
      v-else-if="variant === 'skeleton'"
      class="animate-pulse space-y-3"
    >
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded-md" />
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6" />
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-4/6" />
    </div>

    <!-- Shimmer Loading -->
    <div
      v-else-if="variant === 'shimmer'"
      :class="shimmerClasses"
      class="relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700"
    >
      <div class="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer" />
    </div>

    <!-- Bars Loading -->
    <div
      v-else-if="variant === 'bars'"
      class="flex items-end space-x-1"
    >
      <div
        v-for="i in 4"
        :key="i"
        :class="barClasses"
        :style="{
          animationDelay: `${(i - 1) * 0.1}s`,
          height: `${Math.random() * 20 + 10}px`
        }"
        class="bg-current animate-pulse"
      />
    </div>

    <!-- Text -->
    <p
      v-if="text"
      :class="textClasses"
      class="mt-3 text-sm font-medium"
    >
      {{ text }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'shimmer' | 'bars'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'gray' | 'white'
  text?: string
  width?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'spinner',
  size: 'md',
  color: 'primary',
})

const spinnerClasses = computed(() => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  const colorClasses = {
    primary: 'text-primary-500',
    secondary: 'text-gray-500',
    gray: 'text-gray-400',
    white: 'text-white',
  }

  return [sizeClasses[props.size], colorClasses[props.color]].join(' ')
})

const dotClasses = computed(() => {
  const sizeClasses = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
    xl: 'w-3 h-3',
  }

  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-gray-500',
    gray: 'bg-gray-400',
    white: 'bg-white',
  }

  return [sizeClasses[props.size], colorClasses[props.color]].join(' ')
})

const pulseClasses = computed(() => {
  const width = props.width || '100%'
  const height = props.height || '1rem'
  
  return `w-[${width}] h-[${height}]`
})

const shimmerClasses = computed(() => {
  const width = props.width || '100%'
  const height = props.height || '4rem'
  
  return `w-[${width}] h-[${height}]`
})

const barClasses = computed(() => {
  const sizeClasses = {
    xs: 'w-0.5',
    sm: 'w-1',
    md: 'w-1.5',
    lg: 'w-2',
    xl: 'w-2.5',
  }

  const colorClasses = {
    primary: 'text-primary-500',
    secondary: 'text-gray-500',
    gray: 'text-gray-400',
    white: 'text-white',
  }

  return [sizeClasses[props.size], colorClasses[props.color]].join(' ')
})

const textClasses = computed(() => {
  const colorClasses = {
    primary: 'text-primary-600 dark:text-primary-400',
    secondary: 'text-gray-600 dark:text-gray-400',
    gray: 'text-gray-500 dark:text-gray-400',
    white: 'text-white',
  }

  return colorClasses[props.color]
})
</script>

<style scoped>
@keyframes bounce-custom {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.animate-bounce {
  animation: bounce-custom 1.4s infinite ease-in-out;
}
</style>