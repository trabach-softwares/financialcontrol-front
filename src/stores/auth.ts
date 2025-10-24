import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email || '')
  const userRole = computed(() => {
    // Check user metadata for role (admin or regular user)
    return user.value?.user_metadata?.role || 'user'
  })
  const isAdmin = computed(() => userRole.value === 'admin')

  // Actions
  async function signUp(email: string, password: string, fullName: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'user'
          }
        }
      })
      if (signUpError) throw signUpError
      user.value = data.user
      return { success: true }
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
      return { success: false, error: (err instanceof Error ? err.message : String(err)) }
    } finally {
      loading.value = false
    }
  }

  async function signIn(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (signInError) throw signInError
      user.value = data.user
      return { success: true }
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
      return { success: false, error: (err instanceof Error ? err.message : String(err)) }
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    loading.value = true
    error.value = null
    try {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
      user.value = null
      return { success: true }
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
      return { success: false, error: (err instanceof Error ? err.message : String(err)) }
    } finally {
      loading.value = false
    }
  }

  async function getCurrentUser() {
    loading.value = true
    try {
      const { data: { user: currentUser }, error: getUserError } = await supabase.auth.getUser()
      if (getUserError) throw getUserError
      user.value = currentUser
    } catch (err: unknown) {
      error.value = (err instanceof Error ? err.message : String(err))
      user.value = null
    } finally {
      loading.value = false
    }
  }

  // Initialize auth state listener
  function initAuthListener() {
    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user || null
    })
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
