<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Left Side - Welcome Message -->
    <div class="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12">
      <div class="max-w-md text-center">
        <div class="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <BarChart3 :size="32" class="text-primary-600" />
        </div>
        
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Comece seu controle financeiro hoje
        </h1>
        
        <p class="text-gray-600 text-lg leading-relaxed">
          Junte-se a milhares de usuários que já transformaram suas finanças com nossa plataforma.
        </p>
      </div>
    </div>

    <!-- Right Side - Register Form -->
    <div class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-sm">
        <!-- Logo Mobile -->
        <div class="lg:hidden text-center mb-8">
          <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 :size="24" class="text-primary-600" />
          </div>
          <h2 class="text-xl font-bold text-gray-900">Controle Financeiro</h2>
        </div>

        <!-- Register Header -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            Crie sua conta
          </h2>
          <p class="text-gray-600">
            Comece gratuitamente em segundos
          </p>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-start">
            <div class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
              <div class="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            <p class="text-sm text-green-800">{{ successMessage }}</p>
          </div>
        </div>

        <!-- Register Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Full Name -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
              Nome completo
            </label>
            <input
              id="fullName"
              v-model="fullName"
              type="text"
              required
              placeholder="Seu nome completo"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white hover:border-gray-400 transition duration-200"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="seuemail@exemplo.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white hover:border-gray-400 transition duration-200"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                placeholder="••••••"
                class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white hover:border-gray-400 transition duration-200"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <Eye v-if="!showPassword" :size="20" />
                <EyeOff v-else :size="20" />
              </button>
            </div>
            <p class="mt-1 text-xs text-gray-500">Mínimo de 6 caracteres</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              placeholder="••••••"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white hover:border-gray-400 transition duration-200"
            />
          </div>

          <!-- Error Message -->
          <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-start">
              <AlertCircle :size="16" class="text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              <p class="text-sm text-red-800">{{ authStore.error }}</p>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="authStore.loading"
            :class="[
              'w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
              authStore.loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800'
            ]"
          >
            <div v-if="authStore.loading" class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Criando conta...
            </div>
            <span v-else>Criar conta</span>
          </button>
        </form>

        <!-- Sign In Link -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            Já tem uma conta?
            <router-link
              to="/login"
              class="font-medium text-primary-600 hover:text-primary-500 ml-1"
            >
              Entre aqui
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  BarChart3,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const successMessage = ref('')

const handleSubmit = async () => {
  // Clear previous messages
  successMessage.value = ''
  authStore.error = null

  // Validate password match
  if (password.value !== confirmPassword.value) {
    authStore.error = 'As senhas não coincidem'
    return
  }

  const result = await authStore.signUp(email.value, password.value, fullName.value)
  if (result.success) {
    successMessage.value = 'Conta criada com sucesso! Você será redirecionado para o dashboard.'
    
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }
}
</script>