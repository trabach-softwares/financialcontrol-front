<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // Initialize auth state listener
  authStore.initAuthListener()
  // Get current user
  authStore.getCurrentUser()
})
</script>

<template>
  <RouterView />
</template>

<style>
/* Global styles are handled by Tailwind CSS */
</style>
