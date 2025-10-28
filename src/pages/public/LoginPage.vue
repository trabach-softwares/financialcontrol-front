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
      <header class="login-header text-center q-mb-md">
        <div class="logo-container q-mb-md" role="img" aria-label="Logo Financial Control">
          <img 
            src="/ControleFinanceiro.svg" 
            alt="Logo Financial Control"
            class="logo-img"
            style="width: 80px; height: auto;"
          />
        </div>
        
        <h1 class="text-h3 text-weight-bold q-mb-sm login-title">
          Financial Control
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
          class="auth-tabs q-mb-md"
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

        <q-separator class="q-mb-md" />

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
            <p class="text-body2 q-mb-md panel-subtitle">
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
                  @update:model-value="clearErrors"
                  class="full-width focus-ring"
                  aria-required="true"
                  autocomplete="email"
                  placeholder="seu@email.com"
                  hide-bottom-space
                  :rules="[val => {
                    if (!val) {
                      notifyError('ERROR.REQUIRED_FIELDS')
                      return false
                    }
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                      notifyError('ERROR.INVALID_EMAIL')
                      return false
                    }
                    return true
                  }]"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" color="grey-6" aria-hidden="true" />
                  </template>
                </q-input>
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
                  class="full-width focus-ring"
                  aria-required="true"
                  autocomplete="current-password"
                  placeholder="Digite sua senha"
                  hide-bottom-space
                  :rules="[val => {
                    if (!val) {
                      notifyError('ERROR.REQUIRED_FIELDS')
                      return false
                    }
                    if (val.length < 6) {
                      notifyError('ERROR.PASSWORD_TOO_SHORT')
                      return false
                    }
                    return true
                  }]"
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
                class="q-mt-md btn-primary-sage "
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
            <div class="text-center q-mt-md q-pt-md" 
            style="border-top: 1px solid var(--color-grey-300);">
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
            <p class="text-body2 q-mb-md panel-subtitle">
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
                class="q-mt-lg btn-primary-sage"
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
            <div class="text-center q-mt-md q-pt-md" style="border-top: 1px solid var(--color-grey-300);">
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
      <footer class="login-footer text-center q-mt-sm" role="contentinfo">
        <p class="text-caption text-secondary">
          © 2024 Trabach Softwares. Todos os direitos reservados.
        </p>
      </footer>
    </div>

    <!-- Dialog de Recuperação de Senha -->
    <q-dialog v-model="showForgotPassword" position="standard" style="backdrop-filter: blur(2px);">
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
import { MESSAGES } from 'src/constants/messages'

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
  console.log(' [LOGIN PAGE] Processando login')
  
  // Validação do formulário
  if (!loginForm.value.email || !loginForm.value.password) {
    notifyError('ERROR.REQUIRED_FIELDS')
    return
  }
  
  try {
    await authStore.login(loginForm.value)
    
    notifySuccess('SUCCESS.LOGIN')
    
    // Redirecionar para página solicitada ou dashboard
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
    
  } catch (error) {
    console.error(' [LOGIN PAGE] Erro:', error.message)
    loginError.value = error.message || 'Erro ao fazer login'
    notifyError(error.message || 'ERROR.LOGIN_FAILED')
  }
}

const handleRegister = async () => {
  console.log(' [LOGIN PAGE] Processando registro')
  
  // Validação do formulário
  if (!registerForm.value.name || !registerForm.value.email || !registerForm.value.password) {
    notifyError('ERROR.REQUIRED_FIELDS')
    return
  }
  
  if (registerForm.value.password.length < 6) {
    notifyError('ERROR.PASSWORD_TOO_SHORT')
    return
  }
  
  try {
    await authStore.register(registerForm.value)
    
    notifySuccess('SUCCESS.REGISTER')
    
    // Redirecionar para dashboard
    router.push('/dashboard')
    
  } catch (error) {
    console.error(' [LOGIN PAGE] Erro no registro:', error.message)
    registerError.value = error.message || 'Erro ao criar conta'
    notifyError(error.message || 'ERROR.REGISTER_FAILED')
  }
}

const handleForgotPassword = () => {
  if (forgotPasswordEmail.value) {
    notifySuccess('SUCCESS.PASSWORD_RESET')
    showForgotPassword.value = false
    forgotPasswordEmail.value = ''
  } else {
    notifyError('ERROR.INVALID_EMAIL')
  }
}
</script>

<style lang="scss" scoped>
// Esconde as mensagens de validação do Quasar
:deep(.q-field__bottom) {
  display: none !important;
}

// ==========================================================================
// LOGIN PAGE - SAGE ACCOUNTANT THEME
// ==========================================================================

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
  border-radius: 12px;
  
  // Background moderno com gradiente animado e padrão
  background: radial-gradient(circle at 5% 0%, rgba(44, 95, 45, 0.08) 0%, transparent 45%), radial-gradient(circle at 43% 25%, rgba(151, 180, 152, 0.08) 0%, transparent 138%), linear-gradient(135deg, #e8eceb 0%, #d4dcd6 0%, #c8d3ca 17%
42%
);
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;
  
  // Padrão de textura sutil
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.03) 35px, rgba(255,255,255,.03) 70px);
    pointer-events: none;
  }
  
  @media (max-width: 599px) {
    padding: var(--spacing-2);
  }
}

.login-container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.logo-container {
  width: 135px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  flex-wrap: nowrap;
  flex-direction: row;
}

// Header com Logo - Glassmorphism
.login-header {
  .logo-container {
    display: inline-flex;
    padding: var(--spacing-4);
    
    // Efeito Glassmorphism no logo
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    
    border-radius: var(--radius-full);
    border: 1px solid rgba(255, 255, 255, 0.4);
    
    box-shadow: 
      0 8px 32px 0 rgba(44, 95, 45, 0.15),
      0 2px 8px 0 rgba(0, 0, 0, 0.05),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.6);
    
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 
        0 12px 40px 0 rgba(44, 95, 45, 0.2),
        0 4px 12px 0 rgba(0, 0, 0, 0.08),
        inset 0 1px 0 0 rgba(255, 255, 255, 0.7);
    }
    
    .logo-icon {
      animation: fadeInScale 0.6s ease-out, floatIcon 3s ease-in-out infinite;
      filter: drop-shadow(0 2px 4px rgba(44, 95, 45, 0.2));
    }
  }
}

// Card de Autenticação - Glassmorphism Premium
.auth-card {
  // Glassmorphism com blur forte
  background: rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: blur(30px) saturate(150%);
  -webkit-backdrop-filter: blur(30px) saturate(150%);
  
  border-radius: 24px !important;
  padding: var(--spacing-8);
  
  // Borda gradiente sutil
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  
  // Sombras modernas em camadas
  box-shadow: 
    0 8px 32px 0 rgba(44, 95, 45, 0.12),
    0 2px 8px 0 rgba(0, 0, 0, 0.04),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.7),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.02) !important;
  
  animation: fadeInUp 0.5s ease-out;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  // Efeito de brilho no hover
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 16px 48px 0 rgba(44, 95, 45, 0.18),
      0 4px 16px 0 rgba(0, 0, 0, 0.08),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.8),
      inset 0 -1px 0 0 rgba(0, 0, 0, 0.03) !important;
    
    &::before {
      left: 100%;
    }
  }
  
  // Inputs com glassmorphism
  :deep(.q-field__control) {
    background: rgba(255, 255, 255, 0.6) !important;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 12px !important;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.75) !important;
    }
  }
  
  :deep(.q-field--focused .q-field__control) {
    background: rgba(255, 255, 255, 0.85) !important;
    box-shadow: 0 4px 12px rgba(44, 95, 45, 0.15);
  }
  
  @media (max-width: 599px) {
    padding: var(--spacing-6);
    border-radius: 20px !important;
  }
}

// Tabs com glassmorphism
.auth-tabs {
  border-radius: 12px;
  padding: 4px;
  
  :deep(.q-tab) {
    font-weight: var(--font-semibold);
    text-transform: none;
    font-size: var(--text-base);
    border-radius: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &.q-tab--active {
      color: var(--color-primary);
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 0 2px 8px rgba(44, 95, 45, 0.15);
    }
    
    &:not(.q-tab--active):hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }
  
  :deep(.q-tab__indicator) {
    display: none; // Removemos o indicador padrão pois temos background
  }
}

// Tab Panels com background transparente
:deep(.q-tab-panels) {
  background: transparent !important; // #ffffff00
}

:deep(.q-tab-panel) {
  background: transparent !important;
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
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

// Botões personalizados com glassmorphism
.btn-primary-sage {
  background: linear-gradient(135deg, #2C5F2D 0%, #3d7a3e 100%) !important;
  color: white !important;
  font-weight: var(--font-semibold);
  border-radius: 14px !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 95%;
  position: relative;
  overflow: hidden;
  
  // Brilho interno
  box-shadow: 
    0 4px 12px rgba(44, 95, 45, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  
  // Efeito de onda ao clicar
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  &:active::after {
    width: 300px;
    height: 300px;
  }
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #1a3a1b 0%, #2C5F2D 100%) !important;
    transform: translateY(-3px) scale(1.01);
    box-shadow: 
      0 8px 24px rgba(44, 95, 45, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  
  &:focus-visible {
    outline: 3px solid rgba(44, 95, 45, 0.5);
    outline-offset: 3px;
  }
}

.link-button {
  font-weight: var(--font-medium);
  transition: all 0.3s ease;
  
  &:hover {
    text-decoration: underline;
    transform: translateX(2px);
  }
}

.link-button-inline {
  font-weight: var(--font-semibold);
  padding: 0;
  min-height: auto;
  transition: all 0.3s ease;
  
  &:hover {
    text-decoration: underline;
    transform: scale(1.05);
  }
}

// Footer com glassmorphism sutil
.login-footer {
  margin-top: var(--spacing-8);
  padding: var(--spacing-4);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.25);
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

@keyframes floatIcon {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

// Títulos e textos com melhor legibilidade
.login-title {
  text-shadow: 0 2px 4px rgba(44, 95, 45, 0.15);
  background: linear-gradient(135deg, #2C5F2D 0%, #107C10 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.panel-title {
  color: var(--text-primary);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.panel-subtitle {
  color: var(--text-secondary);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

// Checkbox com estilo moderno
:deep(.q-checkbox__inner) {
  border-radius: 6px !important;
}

:deep(.q-checkbox__bg) {
  border-radius: 6px !important;
}

// Separador moderno
:deep(.q-separator) {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(44, 95, 45, 0.15) 50%,
    transparent 100%
  ) !important;
  height: 2px !important;
}

// Dialog de recuperação com glassmorphism
.forgot-password-card {
  background: rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(30px) saturate(150%);
  -webkit-backdrop-filter: blur(30px) saturate(150%);
  border-radius: 20px !important;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 
    0 8px 32px 0 rgba(44, 95, 45, 0.2),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.7) !important;
  
  .dialog-title {
    color: var(--text-primary);
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
  }
  
  .dialog-text {
    color: var(--text-secondary);
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
  }
  
  :deep(.q-field__control) {
    background: rgba(255, 255, 255, 0.7) !important;
    backdrop-filter: blur(10px);
    border-radius: 12px !important;
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
  
  .login-page {
    &::before {
      background-image: 
        repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,.03) 20px, rgba(255,255,255,.03) 40px);
    }
  }
}
</style>
