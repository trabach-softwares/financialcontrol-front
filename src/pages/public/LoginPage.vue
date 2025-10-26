<!-- ==========================================================================
LOGIN PAGE - SAGE ACCOUNTANT THEME
==========================================================================
Propósito: Página de login com acessibilidade WCAG 2.1 AA
Paleta: Sage Accountant (Verde contábil #2C5F2D)
Acessibilidade: Skip link, ARIA labels, contraste validado
Responsividade: Mobile-first design
========================================================================== -->

<template>
  <q-page class="login-page">
    <div class="login-container">
      
      <!-- Header com Logo e Título -->
      <header class="login-header text-center q-mb-xl">
        <div class="logo-container q-mb-lg" role="img" aria-label="Logo Controle Financeiro">
          <q-icon 
            name="account_balance_wallet" 
            size="5rem" 
            color="primary" 
            class="logo-icon"
          />
        </div>
        
        <h1 class="text-h3 text-weight-bold q-mb-sm login-title">
          Controle Financeiro
        </h1>
        <p class="text-subtitle1 login-subtitle">
          Gerencie suas finanças com profissionalismo
        </p>
      </header>

      <!-- Card de Autenticação -->
      <q-card 
        id="main-content"
        class="auth-card"
        flat 
        bordered
        role="main"
        aria-labelledby="auth-title"
      >
        
        <!-- Tabs de Login/Registro -->
        <q-tabs
          v-model="activeTab"
          dense
          class="auth-tabs q-mb-lg"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          role="tablist"
          aria-label="Opções de autenticação"
        >
          <q-tab 
            name="login" 
            label="Entrar"
            role="tab"
            :aria-selected="activeTab === 'login'"
            tabindex="0"
          />
          <q-tab 
            name="register" 
            label="Criar Conta"
            role="tab"
            :aria-selected="activeTab === 'register'"
            tabindex="0"
          />
        </q-tabs>

        <q-separator class="q-mb-lg" />

        <q-tab-panels v-model="activeTab" animated>
          
          <!-- ==========================================================================
          PAINEL DE LOGIN
          ========================================================================== -->
          <q-tab-panel 
            name="login" 
            class="q-pa-none"
            role="tabpanel"
            aria-labelledby="login-tab"
          >
            <h2 id="auth-title" class="text-h5 text-weight-semibold q-mb-md panel-title">
              Bem-vindo de volta
            </h2>
            <p class="text-body2 q-mb-lg panel-subtitle">
              Entre com suas credenciais para acessar o sistema
            </p>

            <q-form 
              @submit.prevent="handleLogin" 
              class="q-gutter-md"
              aria-label="Formulário de login"
            >
              
              <!-- Campo Email -->
              <div class="form-group">
                <label for="login-email" class="form-label">
                  E-mail
                  <span class="text-negative" aria-label="Campo obrigatório">*</span>
                </label>
                <q-input
                  id="login-email"
                  v-model="loginForm.email"
                  type="email"
                  outlined
                  dense
                  :loading="isLoading"
                  :error="!!loginError"
                  :error-message="loginError"
                  @update:model-value="clearErrors"
                  class="full-width focus-ring"
                  aria-required="true"
                  aria-invalid="!!loginError"
                  :aria-describedby="loginError ? 'login-email-error' : undefined"
                  autocomplete="email"
                  placeholder="seu@email.com"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" color="grey-6" aria-hidden="true" />
                  </template>
                </q-input>
                <div 
                  v-if="loginError" 
                  id="login-email-error" 
                  class="form-error" 
                  role="alert"
                >
                  {{ loginError }}
                </div>
              </div>

              <!-- Campo Senha -->
              <div class="form-group">
                <label for="login-password" class="form-label">
                  Senha
                  <span class="text-negative" aria-label="Campo obrigatório">*</span>
                </label>
                <q-input
                  id="login-password"
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  outlined
                  dense
                  :loading="isLoading"
                  class="full-width focus-ring"
                  aria-required="true"
                  autocomplete="current-password"
                  placeholder="Digite sua senha"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" color="grey-6" aria-hidden="true" />
                  </template>
                  <template v-slot:append>
                    <q-btn
                      flat
                      dense
                      round
                      :icon="showPassword ? 'visibility' : 'visibility_off'"
                      color="grey-6"
                      @click="showPassword = !showPassword"
                      :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
                      tabindex="0"
                    />
                  </template>
                </q-input>
              </div>

              <!-- Lembrar de mim -->
              <q-checkbox
                v-model="loginForm.rememberMe"
                label="Lembrar de mim"
                color="primary"
                class="text-grey-7"
                aria-label="Lembrar de mim neste dispositivo"
              />

              <!-- Botão de Login -->
              <q-btn
                type="submit"
                label="Entrar"
                color="primary"
                size="lg"
                class="full-width q-mt-lg btn-primary-sage"
                :loading="isLoading"
                :disable="!isLoginFormValid"
                no-caps
                unelevated
                aria-label="Fazer login no sistema"
              >
                <template v-slot:loading>
                  <q-spinner-dots color="white" />
                </template>
              </q-btn>

              <!-- Link para recuperar senha -->
              <div class="text-center q-mt-md">
                <q-btn
                  flat
                  no-caps
                  color="secondary"
                  label="Esqueci minha senha"
                  size="sm"
                  @click="showForgotPassword = true"
                  class="link-button"
                  aria-label="Recuperar senha esquecida"
                />
              </div>
            </q-form>

            <!-- Link para registro -->
            <div class="text-center q-mt-lg q-pt-lg" style="border-top: 1px solid var(--color-grey-300);">
              <p class="text-body2" style="color: var(--text-secondary);">
                Não tem uma conta?
                <q-btn
                  flat
                  no-caps
                  color="primary"
                  label="Criar conta gratuita"
                  size="sm"
                  @click="activeTab = 'register'"
                  class="link-button-inline"
                  aria-label="Ir para página de registro"
                />
              </p>
            </div>
          </q-tab-panel>

          <!-- ==========================================================================
          PAINEL DE REGISTRO
          ========================================================================== -->
          <q-tab-panel 
            name="register" 
            class="q-pa-none"
            role="tabpanel"
            aria-labelledby="register-tab"
          >
            <h2 id="auth-title-register" class="text-h5 text-weight-semibold q-mb-md panel-title">
              Criar sua conta
            </h2>
            <p class="text-body2 q-mb-lg panel-subtitle">
              Preencha os dados abaixo para começar
            </p>

            <q-form 
              @submit.prevent="handleRegister" 
              class="q-gutter-md"
              aria-label="Formulário de registro"
            >
              
              <!-- Campo Nome -->
              <div class="form-group">
                <label for="register-name" class="form-label">
                  Nome completo
                  <span class="text-negative" aria-label="Campo obrigatório">*</span>
                </label>
                <q-input
                  id="register-name"
                  v-model="registerForm.name"
                  type="text"
                  outlined
                  dense
                  :loading="isLoading"
                  class="full-width focus-ring"
                  aria-required="true"
                  autocomplete="name"
                  placeholder="Seu nome completo"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" color="grey-6" aria-hidden="true" />
                  </template>
                </q-input>
              </div>

              <!-- Campo Email -->
              <div class="form-group">
                <label for="register-email" class="form-label">
                  E-mail
                  <span class="text-negative" aria-label="Campo obrigatório">*</span>
                </label>
                <q-input
                  id="register-email"
                  v-model="registerForm.email"
                  type="email"
                  outlined
                  dense
                  :loading="isLoading"
                  :error="!!registerError"
                  :error-message="registerError"
                  @update:model-value="clearErrors"
                  class="full-width focus-ring"
                  aria-required="true"
                  aria-invalid="!!registerError"
                  autocomplete="email"
                  placeholder="seu@email.com"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" color="grey-6" aria-hidden="true" />
                  </template>
                </q-input>
              </div>

              <!-- Campo Senha -->
              <div class="form-group">
                <label for="register-password" class="form-label">
                  Senha
                  <span class="text-negative" aria-label="Campo obrigatório">*</span>
                </label>
                <q-input
                  id="register-password"
                  v-model="registerForm.password"
                  :type="showPasswordRegister ? 'text' : 'password'"
                  outlined
                  dense
                  :loading="isLoading"
                  class="full-width focus-ring"
                  aria-required="true"
                  autocomplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  aria-describedby="password-hint"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" color="grey-6" aria-hidden="true" />
                  </template>
                  <template v-slot:append>
                    <q-btn
                      flat
                      dense
                      round
                      :icon="showPasswordRegister ? 'visibility' : 'visibility_off'"
                      color="grey-6"
                      @click="showPasswordRegister = !showPasswordRegister"
                      :aria-label="showPasswordRegister ? 'Ocultar senha' : 'Mostrar senha'"
                    />
                  </template>
                </q-input>
                <div id="password-hint" class="form-hint">
                  A senha deve ter no mínimo 6 caracteres
                </div>
              </div>

              <!-- Botão de Registro -->
              <q-btn
                type="submit"
                label="Criar Conta"
                color="primary"
                size="lg"
                class="full-width q-mt-lg btn-primary-sage"
                :loading="isLoading"
                :disable="!isRegisterFormValid"
                no-caps
                unelevated
                aria-label="Criar nova conta"
              >
                <template v-slot:loading>
                  <q-spinner-dots color="white" />
                </template>
              </q-btn>
            </q-form>

            <!-- Link para login -->
            <div class="text-center q-mt-lg q-pt-lg" style="border-top: 1px solid var(--color-grey-300);">
              <p class="text-body2" style="color: var(--text-secondary);">
                Já tem uma conta?
                <q-btn
                  flat
                  no-caps
                  color="primary"
                  label="Fazer login"
                  size="sm"
                  @click="activeTab = 'login'"
                  class="link-button-inline"
                  aria-label="Ir para página de login"
                />
              </p>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>

      <!-- Rodapé -->
      <footer class="login-footer text-center q-mt-xl" role="contentinfo">
        <p class="text-caption text-secondary">
          © 2025 Controle Financeiro. Todos os direitos reservados.
        </p>
      </footer>
    </div>

    <!-- Dialog de Recuperação de Senha -->
    <q-dialog v-model="showForgotPassword" position="standard">
      <q-card class="forgot-password-card q-pa-md">
        <q-card-section>
          <h3 class="text-h6 q-mb-sm dialog-title">Recuperar senha</h3>
          <p class="text-body2 dialog-text">
            Digite seu e-mail para receber instruções de recuperação
          </p>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="forgotPasswordEmail"
            type="email"
            label="E-mail"
            outlined
            dense
            autofocus
            aria-label="Digite seu e-mail para recuperação"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn 
            flat 
            label="Cancelar" 
            color="grey-7" 
            v-close-popup 
            no-caps
            aria-label="Cancelar recuperação de senha"
          />
          <q-btn 
            unelevated 
            label="Enviar" 
            color="primary" 
            @click="handleForgotPassword"
            no-caps
            aria-label="Enviar e-mail de recuperação"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useNotifications } from 'src/composables/useNotifications'
import { useI18n } from 'vue-i18n'

// ==========================================================================
// COMPOSABLES
// ==========================================================================
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { notifySuccess, notifyError } = useNotifications()
const { t } = useI18n()

// ==========================================================================
// ESTADO REATIVO
// ==========================================================================
const activeTab = ref('login')
const showPassword = ref(false)
const showPasswordRegister = ref(false)
const showForgotPassword = ref(false)
const forgotPasswordEmail = ref('')
const isLoading = ref(false)
const loginError = ref('')
const registerError = ref('')

const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false
})

const registerForm = ref({
  name: '',
  email: '',
  password: ''
})

// ==========================================================================
// COMPUTED
// ==========================================================================
const isLoginFormValid = computed(() => {
  return loginForm.value.email.length > 0 && 
         loginForm.value.password.length >= 6
})

const isRegisterFormValid = computed(() => {
  return registerForm.value.name.length > 0 &&
         registerForm.value.email.length > 0 && 
         registerForm.value.password.length >= 6
})

// ==========================================================================
// MÉTODOS
// ==========================================================================
const clearErrors = () => {
  loginError.value = ''
  registerError.value = ''
}

const handleLogin = async () => {
  console.log('🔐 [LOGIN PAGE] Processando login')
  
  try {
    isLoading.value = true
    loginError.value = ''
    
    await authStore.login(loginForm.value)
    
    notifySuccess('Login realizado com sucesso!')
    
    // Redirecionar para página solicitada ou dashboard
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
    
  } catch (error) {
    console.error('❌ [LOGIN PAGE] Erro no login:', error)
    loginError.value = error.message || 'Erro ao fazer login. Verifique suas credenciais.'
    notifyError(loginError.value)
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  console.log('📝 [LOGIN PAGE] Processando registro')
  
  try {
    isLoading.value = true
    registerError.value = ''
    
    await authStore.register(registerForm.value)
    
    notifySuccess('Conta criada com sucesso!')
    
    // Redirecionar para dashboard
    router.push('/dashboard')
    
  } catch (error) {
    console.error('❌ [LOGIN PAGE] Erro no registro:', error)
    registerError.value = error.message || 'Erro ao criar conta. Tente novamente.'
    notifyError(registerError.value)
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = () => {
  if (forgotPasswordEmail.value) {
    notifySuccess('E-mail de recuperação enviado!')
    showForgotPassword.value = false
    forgotPasswordEmail.value = ''
  } else {
    notifyError('Digite um e-mail válido')
  }
}
</script>

<style lang="scss" scoped>
// ==========================================================================
// LOGIN PAGE - SAGE ACCOUNTANT THEME
// ==========================================================================

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ebe9 100%);
  
  @media (max-width: 599px) {
    padding: var(--spacing-2);
  }
}

.login-container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

// Header com Logo
.login-header {
  .logo-container {
    display: inline-flex;
    padding: var(--spacing-4);
    background: white;
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-md);
    
    .logo-icon {
      animation: fadeInScale 0.6s ease-out;
    }
  }
}

// Card de Autenticação
.auth-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-grey-200);
  animation: fadeInUp 0.5s ease-out;
  
  @media (max-width: 599px) {
    padding: var(--spacing-6);
  }
}

// Tabs
.auth-tabs {
  :deep(.q-tab) {
    font-weight: var(--font-semibold);
    text-transform: none;
    font-size: var(--text-base);
    
    &.q-tab--active {
      color: var(--color-primary);
    }
  }
}

// Formulários
.form-group {
  margin-bottom: var(--spacing-4);
}

.form-label {
  display: block;
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}

// Botões personalizados
.btn-primary-sage {
  background: var(--color-primary) !important;
  color: white !important;
  font-weight: var(--font-semibold);
  border-radius: var(--radius-md);
  transition: all var(--transition-base) var(--ease-out);
  
  &:hover:not(:disabled) {
    background: darken(#2C5F2D, 8%) !important;
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  &:focus-visible {
    outline: 3px solid rgba(44, 95, 45, 0.4);
    outline-offset: 2px;
  }
}

.link-button {
  font-weight: var(--font-medium);
  
  &:hover {
    text-decoration: underline;
  }
}

.link-button-inline {
  font-weight: var(--font-semibold);
  padding: 0;
  min-height: auto;
  
  &:hover {
    text-decoration: underline;
  }
}

// Footer
.login-footer {
  margin-top: var(--spacing-8);
}

// Animações
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

// Responsividade adicional
@media (max-width: 599px) {
  .text-h3 {
    font-size: var(--text-2xl) !important;
  }
  
  .text-h5 {
    font-size: var(--text-xl) !important;
  }
}
</style>
