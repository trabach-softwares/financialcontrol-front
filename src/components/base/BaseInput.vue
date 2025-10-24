<template>
  <div class="space-y-1">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-red-500 ml-1"
      >*</span>
    </label>

    <!-- Input Wrapper -->
    <div class="relative">
      <!-- Icon Left -->
      <div
        v-if="iconLeft"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <component
          :is="iconLeft"
          :size="16"
          class="text-gray-400"
        />
      </div>

      <!-- Input Field -->
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :class="inputClasses"
        v-bind="$attrs"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />

      <!-- Icon Right -->
      <div
        v-if="iconRight"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
        :class="{ 'cursor-pointer': iconClickable }"
        @click="iconClickable && $emit('icon-click')"
      >
        <component
          :is="iconRight"
          :size="16"
          class="text-gray-400"
        />
      </div>
    </div>

    <!-- Error Message -->
    <p
      v-if="error"
      class="text-sm text-red-600 dark:text-red-400"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
  modelValue: string
  type?: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  iconLeft?: any
  iconRight?: any
  iconClickable?: boolean
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  iconClickable: false
})

defineEmits<{
  'update:modelValue': [value: string]
  'blur': []
  'focus': []
  'icon-click': []
}>()

const inputId = useId()

const inputClasses = computed(() => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors duration-200'
  
  const stateClasses = props.error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
  
  const paddingClasses = [
    props.iconLeft ? 'pl-10' : 'pl-3',
    props.iconRight ? 'pr-10' : 'pr-3'
  ].join(' ')
  
  const disabledClasses = props.disabled
    ? 'bg-gray-50 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
  
  return [baseClasses, stateClasses, paddingClasses, disabledClasses].join(' ')
})
</script>