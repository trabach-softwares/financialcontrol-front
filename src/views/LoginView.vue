<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Left Side -->
    <div class="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-8">
      <div class="container text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <BarChart3 :size="32" class="text-gray-700" />
        </div>
        
        <h1 class="text-3xl font-bold text-primary mb-4">
          Controle total das suas finanças
        </h1>
        
        <p class="text-lg text-secondary">
          Gerencie receitas e despesas, visualize relatórios e tome decisões mais inteligentes para o seu negócio.
        </p>
      </div>
    </div>

    <!-- Right Side -->
    <div class="flex items-center justify-center p-8" style="flex: 1;">
      <div class="w-full" style="max-width: 400px;">
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-primary mb-2">
            Bem-vindo de volta
          </h2>
          <p class="text-secondary">
            Entre com sua conta para continuar
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="label">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="seuemail.com"
              :class="['input', { 'input-error': emailError }]"
              @blur="validateEmail"
            />
            <p v-if="emailError" class="text-xs text-error-600 mt-1">{{ emailError }}</p>
          </div>

          <!-- Password -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label for="password" class="label">Senha</label>
              <button
                type="button"
                class="text-xs text-primary-600 hover:text-primary-700"
              >
                Esqueceu a senha?
              </button>
            </div>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••"
                :class="['input', { 'input-error': passwordError }]"
                style="padding-right: 3rem;"
                @blur="validatePassword"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-tertiary hover:text-secondary"
              >
                <Eye v-if="!showPassword" :size="20" />
                <EyeOff v-else :size="20" />
              </button>
            </div>
            <p v-if="passwordError" class="text-xs text-error-600 mt-1">{{ passwordError }}</p>
          </div>

          <!-- Error -->
          <div v-if="error" class="alert alert-error">
            <div class="flex items-start gap-2">
              <AlertCircle :size="16" class="flex-shrink-0 mt-1" />
              <div class="flex-1">
                <p class="text-sm">{{ error }}</p>
                <button
                  v-if="error.includes('Too many') || error.includes('wait')"
                  @click="clearError"
                  type="button"
                  class="text-xs font-medium underline mt-2"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            :class="['btn', 'btn-primary', 'btn-full', { 'loading': loading }]"
          >
            <div v-if="loading" class="flex items-center gap-2">
              <div class="loading rounded-full border-2 border-white border-t-transparent w-4 h-4"></div>
              Entrando...
            </div>
            <span v-else>Entrar</span>
          </button>
        </form>

        <!-- Sign Up Link -->
        <div class="mt-8 text-center">
          <p class="text-sm text-secondary">
            Não tem uma conta?
            <router-link
              to="/register"
              class="font-medium text-primary-600 hover:text-primary-700 ml-1"
            >
              Cadastre-se gratuitamente
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { BarChart3, Eye, EyeOff, AlertCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const emailError = ref('')
const passwordError = ref('')

const isFormValid = computed(() => {
  return form.value.email && 
         form.value.password && 
         !emailError.value && 
         !passwordError.value
})

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email) {
    emailError.value = 'Email é obrigatório'
  } else if (!emailRegex.test(form.value.email)) {
    emailError.value = 'Por favor, insira um email válido'
  } else {
    emailError.value = ''
  }
}

const validatePassword = () => {
  if (!form.value.password) {
    passwordError.value = 'Senha é obrigatória'
  } else if (form.value.password.length < 6) {
    passwordError.value = 'Senha deve ter pelo menos 6 caracteres'
  } else {
    passwordError.value = ''
  }
}

const clearError = () => {
  error.value = ''
  authStore.error = null
}

const handleLogin = async () => {
  clearError()
  
  validateEmail()
  validatePassword()
  
  if (!isFormValid.value) {
    return
  }

  loading.value = true

  try {
    const result = await authStore.signIn(form.value.email, form.value.password)
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      error.value = result.error || 'Falha no login. Tente novamente.'
    }
  } catch (err) {
    error.value = 'Ocorreu um erro inesperado. Tente novamente.'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.w-16 { width: 4rem; }
.h-16 { height: 4rem; }
.w-4 { width: 1rem; }
.h-4 { height: 1rem; }
.space-y-6 > * + * { margin-top: var(--space-6); }
.transform { transform: translateY(-50%); }
.-translate-y-1\/2 { transform: translateY(-50%); }
</style>