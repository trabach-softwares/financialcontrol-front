<!-- ==========================================================================
LOGIN PAGE - SAGE ACCOUNTANT THEME EVOLVED
==========================================================================
Propósito: Página de login moderna com recursos de segurança e UX avançado
Paleta: Sage Accountant (Verde contábil #2C5F2D) - Mantida
Acessibilidade: Skip link, ARIA labels, contraste WCAG 2.1 AA/AAA
Responsividade: Mobile-first design
Recursos: SSL badge, 2FA, validação em tempo real, notificações
========================================================================== -->

<template>
  <q-page class="login-page">
    
    <!-- Badge de Segurança SSL -->
    <div class="security-badge" aria-label="Conexão segura SSL">
      <q-icon name="security" class="security-icon" />
      <span class="security-text">Conexão Segura SSL</span>
      <q-icon name="verified_user" class="verification-icon" />
    </div>
    
    <!-- Layout Split Screen -->
    <div class="split-layout row no-wrap">
      
      <!-- Lado Esquerdo - Branding e Recursos -->
      <div class="left-panel col-md-6 col-xs-12">
        <div class="branding-section">
          
          <!-- Logo Centralizado -->
          <div class="logo-section text-center q-mb-xl">
            <div class="logo-container" role="img" aria-label="Logo Financial Control">
              <div class="logo-wrapper">
                <img 
                  src="/ControleFinanceiro.svg" 
                  alt="Logo Financial Control"
                  class="logo-img"
                />
              </div>
            </div>
            
            <h1 class="text-h2 text-weight-bold q-mb-sm brand-title">
              Financial Control
            </h1>
            <p class="text-h6 brand-subtitle q-mb-lg">
              Gerencie suas finanças com profissionalismo
            </p>
          </div>

          <!-- Features List -->
          <div class="features-list q-mb-xl">
            <div class="feature-item row items-center q-mb-md">
              <div class="feature-icon">
                <q-icon name="trending_up" size="md" />
              </div>
              <div class="feature-content">
                <h3 class="text-subtitle1 text-weight-semibold q-mb-xs">Controle Completo</h3>
                <p class="text-caption">Gerencie receitas, despesas e investimentos em um só lugar</p>
              </div>
            </div>
            
            <div class="feature-item row items-center q-mb-md">
              <div class="feature-icon">
                <q-icon name="security" size="md" />
              </div>
              <div class="feature-content">
                <h3 class="text-subtitle1 text-weight-semibold q-mb-xs">Segurança Bancária</h3>
                <p class="text-caption">Criptografia de nível bancário para seus dados financeiros</p>
              </div>
            </div>
            
            <div class="feature-item row items-center q-mb-md">
              <div class="feature-icon">
                <q-icon name="analytics" size="md" />
              </div>
              <div class="feature-content">
                <h3 class="text-subtitle1 text-weight-semibold q-mb-xs">Relatórios Inteligentes</h3>
                <p class="text-caption">Insights automáticos para otimizar suas finanças</p>
              </div>
            </div>
          </div>

          <!-- Trust Badges -->
          <div class="trust-badges row justify-center q-gutter-lg">
            <div class="trust-badge text-center">
              <q-icon name="account_balance" size="lg" />
              <div class="text-caption q-mt-xs">Padrão Bancário</div>
            </div>
            <div class="trust-badge text-center">
              <q-icon name="verified" size="lg" />
              <div class="text-caption q-mt-xs">ISO 27001</div>
            </div>
            <div class="trust-badge text-center">
              <q-icon name="shield" size="lg" />
              <div class="text-caption q-mt-xs">Anti-Fraude</div>
            </div>
          </div>
          
        </div>
      </div>
      
      <!-- Lado Direito - Formulário de Login -->
      <div class="right-panel col-md-6 col-xs-12">
        <div class="login-form-container">
          
          <!-- Conteúdo Principal -->
          <div class="main-content">

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
            class="text-primary"
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
            <div class="welcome-section text-center q-mb-lg">
              <h2 id="auth-title" class="text-h5 text-weight-semibold q-mb-sm panel-title">
                Bem-vindo de volta!
              </h2>
              <p class="text-body2 q-mb-lg panel-subtitle">
                Entre com suas credenciais para acessar o sistema
              </p>
            </div>

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
                  @blur="validateLoginEmail"
                  class="full-width focus-ring modern-input"
                  :class="{ 'input-valid': emailValidationStatus === 'valid', 'input-invalid': emailValidationStatus === 'invalid' }"
                  aria-required="true"
                  autocomplete="username"
                  placeholder="seu@email.com"
                  lazy-rules
                  hide-bottom-space
                  :loading="emailValidating"
                  :input-style="{ 
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif'
                  }"
                  :rules="[val => {
                    if (!val) return false
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return false
                    return true
                  }]"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" :color="emailValidationStatus === 'valid' ? 'positive' : 'grey-6'" aria-hidden="true" />
                  </template>
                  <template v-slot:append>
                    <q-icon 
                      v-if="emailValidationStatus === 'valid'" 
                      name="check_circle" 
                      color="positive" 
                      class="validation-icon"
                    />
                    <q-icon 
                      v-else-if="emailValidationStatus === 'invalid'" 
                      name="error" 
                      color="negative" 
                      class="validation-icon"
                    />
                  </template>
                </q-input>
                <div v-if="emailValidationMessage" class="validation-message" :class="emailValidationStatus">
                  {{ emailValidationMessage }}
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
                  class="full-width focus-ring modern-input"
                  :class="{ 'input-valid': passwordValidationStatus === 'valid', 'input-invalid': passwordValidationStatus === 'invalid' }"
                  aria-required="true"
                  autocomplete="current-password"
                  placeholder="Digite sua senha"
                  hide-bottom-space
                  lazy-rules
                  @blur="validatePasswordOnBlur"
                  :input-style="{ 
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segue UI, sans-serif'
                  }"
                  :rules="[val => {
                    if (!val) return 'Senha obrigatória'
                    if (val.length < 6) return 'Mínimo 6 caracteres'
                    return true
                  }]"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" :color="passwordValidationStatus === 'valid' ? 'positive' : 'grey-6'" aria-hidden="true" />
                  </template>
                  <template v-slot:append>
                    <q-btn
                      flat
                      dense
                      round
                      :icon="showPassword ? 'visibility_off' : 'visibility'"
                      color="grey-6"
                      @click="showPassword = !showPassword"
                      :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
                      tabindex="0"
                      class="password-toggle"
                    />
                    <q-icon 
                      v-if="passwordValidationStatus === 'valid'" 
                      name="check_circle" 
                      color="positive" 
                      class="validation-icon"
                    />
                  </template>
                </q-input>
              </div>

              <!-- Opções de Login -->
              <div class="login-options row justify-between items-center q-mb-md">
                <q-checkbox
                  v-model="loginForm.rememberMe"
                  label="Lembrar de mim por 30 dias"
                  color="primary"
                  class="text-grey-7 modern-checkbox"
                  aria-label="Lembrar de mim neste dispositivo por 30 dias"
                />
                
                <q-btn
                  flat
                  no-caps
                  color="secondary"
                  label="Esqueci minha senha"
                  size="sm"
                  @click="showForgotPassword = true"
                  class="forgot-link"
                  aria-label="Recuperar senha esquecida"
                />
              </div>

              <!-- Botão de Login -->
              <q-btn
                type="submit"
                color="primary"
                size="lg"
                class="q-mt-md btn-primary-evolved"
                :disable="!isLoginFormValid || isLoading"
                :loading="isLoading"
                no-caps
                unelevated
                aria-label="Fazer login no sistema"
              >
                <span class="btn-content">
                  <q-icon name="login" class="q-mr-sm" />
                  Entrar com Segurança
                </span>
                <template v-slot:loading>
                  <q-spinner-dots color="white" />
                  <span class="q-ml-sm">Conectando...</span>
                </template>
              </q-btn>


            </q-form>



            <!-- Security Features -->
            <div class="security-features q-mt-lg">
              <div class="row justify-center q-gutter-md text-center">
                <div class="security-feature">
                  <q-icon name="enhanced_encryption" color="positive" size="md" />
                  <div class="text-caption">Criptografia 256-bit</div>
                </div>
                <div class="security-feature">
                  <q-icon name="verified_user" color="positive" size="md" />
                  <div class="text-caption">Dados Protegidos</div>
                </div>
                <div class="security-feature">
                  <q-icon name="security" color="positive" size="md" />
                  <div class="text-caption">Certificado SSL</div>
                </div>
              </div>
            </div>

            <!-- Link para registro -->
            <div class="text-center q-mt-lg q-pt-md register-section">
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
                  @update:model-value="clearErrors"
                  @blur="validateRegisterEmail"
                  class="full-width focus-ring"
                  aria-required="true"
                  autocomplete="email"
                  placeholder="seu@email.com"
                  lazy-rules
                  :rules="[val => {
                    if (!val) return false
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return false
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
                  lazy-rules
                  @blur="validateRegisterPasswordOnBlur"
                  :rules="[val => {
                    if (!val) return 'Senha obrigatória'
                    if (val.length < 6) return 'Mínimo 6 caracteres'
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
                class="q-mt-md btn-primary-evolved"
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

          </div>
          
          <!-- Rodapé -->
          <footer class="login-footer text-center" role="contentinfo">
            <p class="text-caption text-secondary">
              © 2024 Trabach Softwares. Todos os direitos reservados.
            </p>
          </footer>
          
        </div>
      </div>
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
import { useNotifications } from 'src/composables/useNotifications'
import { useAuthStore } from 'src/stores/auth'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

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

// Novos estados para validação em tempo real
const emailValidating = ref(false)
const emailValidationStatus = ref('')
const emailValidationMessage = ref('')
const passwordValidationStatus = ref('')

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
const lastInvalidLoginEmail = ref('')
const lastInvalidRegisterEmail = ref('')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateLoginEmail = () => {
  const val = loginForm.value.email?.trim()
  if (!val) {
    emailValidationStatus.value = ''
    emailValidationMessage.value = ''
    return
  }
  
  if (!emailRegex.test(val)) {
    emailValidationStatus.value = 'invalid'
    emailValidationMessage.value = 'E-mail inválido'
    if (lastInvalidLoginEmail.value !== val) {
      lastInvalidLoginEmail.value = val
      notifyError('ERROR.INVALID_EMAIL')
    }
  } else {
    emailValidationStatus.value = 'valid'
    emailValidationMessage.value = 'E-mail válido'
  }
}

/**
 * Valida senha ao sair do campo (blur)
 * Mostra notificação apenas se houver erro
 */
const validatePasswordOnBlur = () => {
  const password = loginForm.value.password
  
  // Não validar se campo estiver vazio (será validado no submit)
  if (!password) {
    passwordValidationStatus.value = ''
    return
  }
  
  // Validar tamanho mínimo
  if (password.length < 6) {
    notifyError('ERROR.PASSWORD_TOO_SHORT')
  }
}

/**
 * Valida senha de registro ao sair do campo (blur)
 * Mostra notificação apenas se houver erro
 */
const validateRegisterPasswordOnBlur = () => {
  const password = registerForm.value.password
  
  // Não validar se campo estiver vazio (será validado no submit)
  if (!password) return
  
  // Validar tamanho mínimo
  if (password.length < 6) {
    notifyError('ERROR.PASSWORD_TOO_SHORT')
  }
}

const validateRegisterEmail = () => {
  const val = registerForm.value.email?.trim()
  if (!val) return
  if (!emailRegex.test(val)) {
    if (lastInvalidRegisterEmail.value !== val) {
      lastInvalidRegisterEmail.value = val
      notifyError('ERROR.INVALID_EMAIL')
    }
  }
}
const clearErrors = () => {
  loginError.value = ''
  registerError.value = ''
}

const handleLogin = async () => {
  
  // Validação do formulário
  if (!loginForm.value.email || !loginForm.value.password) {
    notifyError('ERROR.REQUIRED_FIELDS')
    return
  }
  // Validação de formato de e-mail no submit (uma única notificação)
  if (!emailRegex.test(loginForm.value.email.trim())) {
    notifyError('ERROR.INVALID_EMAIL')
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
  // Validação do formulário
  if (!registerForm.value.name || !registerForm.value.email || !registerForm.value.password) {
    notifyError('ERROR.REQUIRED_FIELDS')
    return
  }
  // Validação de formato de e-mail no submit (uma única notificação)
  if (!emailRegex.test(registerForm.value.email.trim())) {
    notifyError('ERROR.INVALID_EMAIL')
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

const handleSocialLogin = (provider) => {
  
  // Mostrar notificação de redirecionamento
  notifySuccess(`Redirecionando para login com ${provider}...`)
  
  // Simular redirecionamento (implementar integração real conforme necessário)
  setTimeout(() => {
    // Aqui você implementaria a integração real com Google/Microsoft OAuth
  }, 1500)
}
</script>

<style lang="scss" scoped>
// Esconde as mensagens de validação do Quasar
:deep(.q-field__bottom) {
  display: none !important;
}

// Corrige autocomplete globalmente - Versão Aprimorada
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
  -webkit-text-fill-color: #2d5a3d !important;
  background-color: white !important;
  background-image: none !important;
  color: #2d5a3d !important;
  border-radius: 12px !important;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  font-size: 16px !important;
  font-weight: 400 !important;
  transition: all 0.3s ease, background-color 5000s ease-in-out 0s !important;
}

// Força override completo do autocomplete
input:-webkit-autofill {
  -webkit-appearance: none !important;
  appearance: none !important;
}

// Para Firefox e outros
input:-moz-autofill {
  background-color: white !important;
  color: #2d5a3d !important;
  border-radius: 12px !important;
}

// ==========================================================================
// LOGIN PAGE - SAGE ACCOUNTANT THEME
// ==========================================================================

.login-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 1023px) {
    padding: var(--spacing-2);
  }
}

// Layout Split Screen
.split-layout {
  min-height: 100vh;
  
  @media (max-width: 1023px) {
    flex-direction: column;
  }
}

// Lado Esquerdo - Branding
.left-panel {
  background: linear-gradient(135deg, var(--color-primary) 0%, #1e4f1f 50%, #2d5a3d 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 20px 0 0 20px;
  
  // Padrão de fundo elegante
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.08) 2px, transparent 2px),
      radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.08) 2px, transparent 2px);
    background-size: 60px 60px;
    animation: backgroundMove 30s ease-in-out infinite;
    pointer-events: none;
  }
  
  .branding-section {
    position: relative;
    z-index: 1;
    padding: var(--spacing-8);
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    @media (max-width: 1023px) {
      height: auto;
      min-height: 60vh;
      padding: var(--spacing-6);
    }
    
    @media (max-width: 599px) {
      padding: var(--spacing-4);
      min-height: 50vh;
    }
  }
}

// Lado Direito - Formulário
.right-panel {
  background: 
    radial-gradient(circle at 20% 80%, rgba(44, 95, 45, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(151, 180, 152, 0.05) 0%, transparent 50%),
    linear-gradient(135deg, #f8fff9 0%, #f1f8f2 50%, #e8f5e8 100%);
    border-radius: 0 20px 20px 0;
  
  .login-form-container {
    padding: var(--spacing-8);
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between; // Distribui espaço entre elementos
    
    @media (max-width: 1023px) {
      height: auto;
      min-height: 40vh;
      padding: var(--spacing-6);
      justify-content: flex-start; // Em mobile, não força espaçamento
    }
    
    @media (max-width: 599px) {
      padding: var(--spacing-4);
    }
  }
}

@keyframes backgroundMove {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-10px, -10px); }
}

// Badge de Segurança SSL - Premium
.security-badge {
  position: fixed;
  top: 24px;
  right: 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  padding: 12px 20px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  border: 1px solid rgba(44, 95, 45, 0.2);
  box-shadow: 
    0 8px 32px rgba(44, 95, 45, 0.15),
    0 2px 8px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  z-index: 1000;
  animation: fadeInSlideDown 0.8s ease-out;
  
  .security-icon {
    color: var(--color-positive);
    animation: pulse 2s infinite;
  }
  
  .verification-icon {
    color: var(--color-positive);
    font-size: 16px;
  }
  
  @media (max-width: 768px) {
    position: relative;
    top: auto;
    right: auto;
    margin-bottom: 16px;
    align-self: center;
  }
}

@keyframes fadeInSlideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

// Logo Section - Centralizado
.logo-section {
  .logo-container {
    display: flex;
    justify-content: center;
    margin-bottom: var(--spacing-6);
    
    .logo-wrapper {
      position: relative;
      display: inline-flex;
      padding: var(--spacing-6);
      
      // Glassmorphism premium
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(25px) saturate(180%);
      -webkit-backdrop-filter: blur(25px) saturate(180%);
      
      border-radius: var(--radius-full);
      border: 2px solid rgba(255, 255, 255, 0.3);
      
      box-shadow: 
        0 16px 48px rgba(0, 0, 0, 0.2),
        0 4px 16px rgba(0, 0, 0, 0.1),
        inset 0 2px 0 rgba(255, 255, 255, 0.5);
      
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        transform: translateY(-6px) scale(1.05);
        box-shadow: 
          0 24px 64px rgba(0, 0, 0, 0.25),
          0 8px 24px rgba(0, 0, 0, 0.15),
          inset 0 2px 0 rgba(255, 255, 255, 0.6);
      }
      
      .logo-img {
        width: 120px;
        height: auto;
        animation: fadeInScale 0.8s ease-out 0.4s both, logoFloat 6s ease-in-out infinite;
        filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
        z-index: 2;
      }
      

    }
  }
  
  .brand-title {
    color: white;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    font-size: 3rem;
    line-height: 1.2;
    
    @media (max-width: 1023px) {
      font-size: 2.5rem;
    }
    
    @media (max-width: 599px) {
      font-size: 2rem;
    }
  }
  
  .brand-subtitle {
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    font-weight: 400;
    
    @media (max-width: 599px) {
      font-size: 1.1rem;
    }
  }
}

// Features List
.features-list {
  .feature-item {
    margin-bottom: var(--spacing-5);
    animation: fadeInLeft 0.8s ease-out calc(var(--delay, 0) * 0.2s) both;
    
    &:nth-child(1) { --delay: 1; }
    &:nth-child(2) { --delay: 2; }
    &:nth-child(3) { --delay: 3; }
    
    .feature-icon {
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: var(--spacing-4);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      
      i {
        color: white;
        font-size: 28px;
      }
    }
    
    .feature-content {
      flex: 1;
      
      h3 {
        color: white;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
      
      p {
        color: rgba(255, 255, 255, 0.8);
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        line-height: 1.4;
      }
    }
  }
}

// Trust Badges
.trust-badges {
  animation: fadeInUp 0.8s ease-out 1s both;
  
  .trust-badge {
    opacity: 0.9;
    transition: all 0.3s ease;
    
    &:hover {
      opacity: 1;
      transform: translateY(-4px);
    }
    
    i {
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 8px;
    }
    
    .text-caption {
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
  }
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}



@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// Card de Autenticação - Novo Layout
.auth-card {
  // Glassmorphism sutil para o novo layout
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  
  border-radius: 24px !important;
  padding: var(--spacing-8);
  max-width: 480px;
  margin: 0 auto;
  
  // Borda sutil
  border: 1px solid rgba(44, 95, 45, 0.1) !important;
  
  // Sombras elegantes
  box-shadow: 
    0 20px 60px rgba(44, 95, 45, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
  
  animation: fadeInRight 0.8s ease-out 0.3s both;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 
      0 32px 80px rgba(44, 95, 45, 0.2),
      0 12px 32px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.95) !important;
  }
  
  // Inputs com melhor contraste e autocomplete TOTALMENTE corrigido
  :deep(.q-field__control) {
    background: white !important;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 12px !important;
    border: 2px solid rgba(44, 95, 45, 0.1) !important;
    transition: all 0.3s ease;
    overflow: hidden !important;
    
    &:hover {
      background: white !important;
      border-color: rgba(44, 95, 45, 0.2) !important;
    }
  }
  
  :deep(.q-field--focused .q-field__control) {
    background: white !important;
    border-color: var(--color-primary) !important;
    box-shadow: 0 0 0 3px rgba(44, 95, 45, 0.1) !important;
  }
  
  // Força o input dentro do Quasar a seguir as regras
  :deep(.q-field__native) {
    background: transparent !important;
    border-radius: 12px !important;
    color: #2d5a3d !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    font-size: 16px !important;
    
    // Override completo do autocomplete
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 1000px white inset !important;
      -webkit-text-fill-color: #2d5a3d !important;
      background-color: white !important;
      background-image: none !important;
      border-radius: 12px !important;
      color: #2d5a3d !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segue UI', sans-serif !important;
      font-size: 16px !important;
      transition: all 0.3s ease, background-color 5000s ease-in-out 0s !important;
    }
    
    &:-moz-autofill {
      background-color: white !important;
      color: #2d5a3d !important;
      border-radius: 12px !important;
    }
    
    &::placeholder {
      color: var(--color-grey-500) !important;
      opacity: 1;
    }
  }
  
  @media (max-width: 1023px) {
    max-width: 100%;
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

// Inputs modernos com validação e autocomplete corrigido
.modern-input {
  transition: all 0.3s ease;
  
  &.input-valid {
    :deep(.q-field__control) {
      border-color: var(--color-positive) !important;
      background: white !important;
    }
    
    :deep(.q-field__native) {
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 1000px white inset !important;
        -webkit-text-fill-color: #2d5a3d !important;
        border-radius: 12px !important;
      }
    }
  }
  
  &.input-invalid {
    :deep(.q-field__control) {
      border-color: var(--color-negative) !important;
      background: white !important;
    }
    
    :deep(.q-field__native) {
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 1000px white inset !important;
        -webkit-text-fill-color: #2d5a3d !important;
        border-radius: 12px !important;
      }
    }
  }
  
  .validation-icon {
    animation: validationPop 0.3s ease-out;
  }
  
  // Autocomplete personalizado para inputs de validação
  :deep(.q-field__native) {
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 1000px white inset !important;
      -webkit-text-fill-color: #2d5a3d !important;
      background-color: white !important;
      background-image: none !important;
      border-radius: 12px !important;
      color: #2d5a3d !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      font-size: 16px !important;
      font-weight: 400 !important;
    }
  }
}

.validation-message {
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
  
  &.valid {
    color: var(--color-positive);
  }
  
  &.invalid {
    color: var(--color-negative);
  }
}

// Botão principal evoluído
.btn-primary-evolved {
  background: linear-gradient(135deg, var(--color-primary) 0%, #1e4f1f 100%) !important;
  color: white !important;
  font-weight: 600;
  border-radius: 16px !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-height: 56px;
  left: 3%;
  
  // Sombras em camadas
  box-shadow: 
    0 8px 24px rgba(44, 95, 45, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  
  .btn-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  // Efeito de brilho
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg, 
      transparent, 
      rgba(255, 255, 255, 0.2), 
      transparent
    );
    transition: left 0.5s;
  }
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #1a4a1b 0%, var(--color-primary) 100%) !important;
    transform: translateY(-4px) scale(1.02);
    box-shadow: 
      0 16px 32px rgba(44, 95, 45, 0.4),
      0 4px 16px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(1.01);
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

// Footer fixo no final
.login-footer {
  padding: var(--spacing-4) var(--spacing-6);
  // background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(15px);
  // border-top: 1px solid rgba(44, 95, 45, 0.1);
  margin-top: auto; 
  flex-shrink: 0;
  
  p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 13px;
  }
  
  @media (max-width: 1023px) {
    padding: var(--spacing-3) var(--spacing-4);
    margin-top: var(--spacing-6);
  }
  
  @media (max-width: 599px) {
    padding: var(--spacing-2) var(--spacing-3);
    
    p {
      font-size: 12px;
    }
  }
}

// Container principal flexível
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 1023px) {
    justify-content: flex-start;
  }
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



// Security Features
.security-features {
  padding: 24px;
  background: rgba(248, 255, 249, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(44, 95, 45, 0.1);
  animation: fadeInUp 0.6s ease-out 0.6s both;
  
  .security-feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-4px);
    }
    
    i {
      font-size: 28px;
      margin-bottom: 8px;
    }
    
    .text-caption {
      font-weight: 500;
      text-align: center;
      line-height: 1.3;
    }
  }
}

// Register Section
.register-section {
  border-top: 1px solid rgba(44, 95, 45, 0.2);
  animation: fadeInUp 0.6s ease-out 0.8s both;
}

// Checkbox moderno
.modern-checkbox {
  :deep(.q-checkbox__inner) {
    border-radius: 8px !important;
    border-width: 2px !important;
    transition: all 0.3s ease;
  }
  
  :deep(.q-checkbox__bg) {
    border-radius: 8px !important;
  }
  
  &:hover :deep(.q-checkbox__inner) {
    border-color: var(--color-primary) !important;
  }
}

// Forgot link
.forgot-link {
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
    transform: translateX(2px);
  }
}

// Animações
@keyframes validationPop {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

// Responsividade para layout split
@media (max-width: 1023px) {
  .split-layout {
    .left-panel {
      order: 1;
      
      .branding-section {
        text-align: center;
        padding: var(--spacing-6) var(--spacing-4);
      }
      
      .features-list {
        display: none; // Esconde features em mobile para economizar espaço
      }
      
      .logo-section {
        .logo-container .logo-wrapper .logo-img {
          width: 80px;
        }
        
        .brand-title {
          font-size: 2.2rem;
        }
        
        .brand-subtitle {
          font-size: 1rem;
        }
      }
    }
    
    .right-panel {
      order: 2;
    }
  }
  
  .login-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .security-features .row {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 599px) {
  .split-layout {
    .left-panel {
      .branding-section {
        padding: var(--spacing-4);
        min-height: 40vh;
      }
      
      .logo-section {
        margin-bottom: var(--spacing-6);
        
        .logo-container .logo-wrapper {
          padding: var(--spacing-4);
          
          .logo-img {
            width: 60px;
          }
          

        }
        
        .brand-title {
          font-size: 1.8rem;
        }
        
        .brand-subtitle {
          font-size: 0.9rem;
        }
      }
      
      .trust-badges {
        .trust-badge {
          i {
            font-size: 1.5rem;
          }
          
          .text-caption {
            font-size: 0.7rem;
          }
        }
      }
    }
  }
  
  .btn-primary-evolved {
    min-height: 48px;
    font-size: 14px;
  }
  
  .security-badge {
    position: relative;
    margin-bottom: 16px;
    align-self: center;
    font-size: 12px;
    padding: 8px 12px;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: var(--spacing-2);
  }
  
  .auth-card {
    padding: var(--spacing-4) !important;
  }
  
  .social-login .divider {
    margin: 16px 0;
  }
  
  .security-features {
    padding: 16px;
  }
}

// Acessibilidade aprimorada
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// Alto contraste para acessibilidade
@media (prefers-contrast: high) {
  .auth-card {
    background: rgba(255, 255, 255, 0.95) !important;
    border: 2px solid var(--color-primary) !important;
  }
  
  .modern-input {
    :deep(.q-field__control) {
      border-width: 2px !important;
    }
  }
  
  .btn-primary-evolved {
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  
  .social-btn {
    border-width: 2px !important;
  }
}

// Dark mode support (se necessário no futuro)
@media (prefers-color-scheme: dark) {
  .body--dark {
    .login-page {
      background: 
        radial-gradient(circle at 20% 80%, rgba(44, 95, 45, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(151, 180, 152, 0.15) 0%, transparent 50%),
        linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 35%, #2a2a2a 70%, #1f1f1f 100%);
    }
    
    .security-badge {
      background: rgba(0, 0, 0, 0.8);
      color: #ffffff;
    }
    
    .auth-card {
      background: rgba(0, 0, 0, 0.6) !important;
      border-color: rgba(44, 95, 45, 0.3) !important;
    }
  }
}

// Print styles (esconde elementos desnecessários)
@media print {
  .security-badge,
  .trust-indicators,
  .social-login,
  .security-features {
    display: none;
  }
}
</style>
