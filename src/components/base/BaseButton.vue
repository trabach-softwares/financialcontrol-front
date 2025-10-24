<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    v-bind="$attrs"
  >
    <component
      :is="iconLeft"
      v-if="iconLeft && !loading"
      :size="iconSize"
      class="flex-shrink-0"
      :class="{ 'mr-2': $slots.default }"
    />
    
    <div
      v-if="loading"
      class="animate-spin rounded-full border-2 border-current border-t-transparent flex-shrink-0"
      :class="[
        loadingSize,
        { 'mr-2': $slots.default }
      ]"
    />
    
    <slot />
    
    <component
      :is="iconRight"
      v-if="iconRight && !loading"
      :size="iconSize"
      class="flex-shrink-0"
      :class="{ 'ml-2': $slots.default }"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  iconLeft?: any
  iconRight?: any
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false
})

const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm focus:ring-primary-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-sm focus:ring-gray-500',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-primary-500 bg-white dark:bg-gray-800',
    ghost: 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-primary-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500'
  }
  
  const widthClass = props.fullWidth ? 'w-full' : ''
  
  return [
    baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant],
    widthClass
  ].filter(Boolean).join(' ')
})

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm': return 16
    case 'lg': return 20
    default: return 18
  }
})

const loadingSize = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-4 h-4'
    case 'lg': return 'w-5 h-5'
    default: return 'w-4 h-4'
  }
})
</script>