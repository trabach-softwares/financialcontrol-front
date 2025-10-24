import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/lib/api'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  plan_id?: string
  created_at?: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email || '')
  const userRole = computed(() => user.value?.role || 'user')
  const isAdmin = computed(() => userRole.value === 'admin')

  // Actions
  async function signUp(email: string, password: string, fullName: string) {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.post('/auth/register', {
        email,
        password,
        name: fullName
      })
      
      if (response.success) {
        if (response.data.user && response.data.token) {
          user.value = response.data.user
          apiClient.setToken(response.data.token)
        }
        return { success: true }
      } else {
        throw new Error(response.message)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      error.value = errorMessage
      
      // Handle specific error types
      if (errorMessage.includes('Too many requests')) {
        error.value = 'Too many registration attempts. Please wait a moment and try again.'
      } else if (errorMessage.includes('User already registered')) {
        error.value = 'An account with this email already exists. Please try logging in instead.'
      }
      
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function signIn(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      })
      
      if (response.success) {
        if (response.data.user && response.data.token) {
          user.value = response.data.user
          apiClient.setToken(response.data.token)
        }
        return { success: true }
      } else {
        throw new Error(response.message)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      error.value = errorMessage
      
      // Handle specific error types
      if (errorMessage.includes('Too many requests')) {
        error.value = 'Too many login attempts. Please wait a moment and try again.'
      } else if (errorMessage.includes('Invalid login credentials')) {
        error.value = 'Invalid email or password. Please check your credentials and try again.'
      } else if (errorMessage.includes('Unable to connect')) {
        error.value = 'Unable to connect to server. Please check your internet connection.'
      }
      
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    loading.value = true
    error.value = null
    try {
      apiClient.clearToken()
      user.value = null
      return { success: true }
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function getCurrentUser() {
    loading.value = true
    try {
      const response = await apiClient.get<{ user: User }>('/auth/me')
      if (response.success && response.data.user) {
        user.value = response.data.user
      }
    } catch (err: unknown) {
      console.log('Failed to get current user:', err)
      user.value = null
      apiClient.clearToken()
    } finally {
      loading.value = false
    }
  }

  // Initialize auth state
  function initAuthListener() {
    // Com API REST, verificamos se há token salvo
    const token = localStorage.getItem('auth_token')
    if (token) {
      apiClient.setToken(token)
      getCurrentUser()
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    userEmail,
    userRole,
    isAdmin,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    initAuthListener
  }
})