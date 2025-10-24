<template>
  <div
    :class="cardClasses"
    class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 ease-in-out"
  >
    <!-- Header -->
    <div
      v-if="$slots.header || title"
      class="px-6 py-4 border-b border-gray-200 dark:border-gray-700"
    >
      <slot name="header">
        <div class="flex items-center justify-between">
          <h3
            v-if="title"
            class="text-lg font-semibold text-gray-900 dark:text-white"
          >
            {{ title }}
          </h3>
          <slot name="headerActions" />
        </div>
      </slot>
    </div>

    <!-- Content -->
    <div
      :class="contentClasses"
      class="transition-all duration-200"
    >
      <slot />
    </div>

    <!-- Footer -->
    <div
      v-if="$slots.footer"
      class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  variant?: 'default' | 'elevated' | 'glass' | 'outline'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  hover: true,
  clickable: false,
})

const cardClasses = computed(() => {
  const classes = []

  // Variant classes
  const variantClasses = {
    default: [
      'shadow-soft dark:shadow-soft-dark',
    ],
    elevated: [
      'shadow-lg hover:shadow-xl dark:shadow-lg',
    ],
    glass: [
      'glass dark:glass-dark backdrop-blur-xl shadow-glass dark:shadow-glass-dark',
      'bg-white/10 dark:bg-black/10 border-white/20 dark:border-white/10',
    ],
    outline: [
      'border-2 shadow-none',
    ],
  }
  classes.push(...variantClasses[props.variant])

  // Hover effects
  if (props.hover && props.variant !== 'glass') {
    classes.push('hover:shadow-lg hover:-translate-y-1')
  }

  if (props.hover && props.variant === 'glass') {
    classes.push('hover:bg-white/20 dark:hover:bg-white/5')
  }

  // Clickable
  if (props.clickable) {
    classes.push('cursor-pointer transform transition-transform active:scale-98')
  }

  return classes.join(' ')
})

const contentClasses = computed(() => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
  return paddingClasses[props.padding]
})
</script>