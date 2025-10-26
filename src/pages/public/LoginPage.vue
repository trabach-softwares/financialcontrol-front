

<template>
  <q-page class="flex flex-center bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
    <div class="login-container">
      
      <div class="text-center q-mb-xl">
        <div class="logo-container q-mb-md">
          <q-icon 
            name="account_balance_wallet" 
            size="4rem" 
            color="primary" 
            class="logo-icon"
          />
        </div>
        
        <h1 class="text-h3 text-grey-8 q-mb-xs font-weight-bold">
          Controle Financeiro
        </h1>
        <p class="text-subtitle1 text-grey-6">
          Gerencie suas finanças com inteligência
        </p>
      </div>

      <q-card 
        class="auth-card q-pa-xl shadow-10" 
        flat 
        bordered
      >
        
        <q-tabs
          v-model="activeTab"
          dense
          class="text-grey-8 q-mb-lg"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="login" label="Entrar" />
          <q-tab name="register" label="Criar Conta" />
        </q-tabs>

        <q-separator class="q-mb-lg" />

        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="login" class="q-pa-none">
            <q-form @submit="handleLogin" class="q-gutter-md">
              
              <!-- Email -->
              <q-input
                v-model="loginForm.email"
                type="email"
                label="Email"
                outlined
                dense
                :loading="authStore.isLoggingIn"
                :error="!!authStore.loginError"
                :error-message="authStore.loginError"
                @input="authStore.clearErrors"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="email" color="grey-6" />
                </template>
              </q-input>

              <!-- Senha -->
              <q-input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                label="Senha"
                outlined
                dense
                :loading="authStore.isLoggingIn"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="grey-6" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    color="grey-6"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <!-- Lembrar de mim -->
              <q-checkbox
                v-model="loginForm.rememberMe"
                label="Lembrar de mim"
                color="primary"
                class="text-grey-7"
              />

              <!-- Botão de Login -->
              <q-btn
                type="submit"
                label="Entrar"
                color="primary"
                size="lg"
                class="full-width q-mt-lg"
                :loading="authStore.isLoggingIn"
                :disable="!isLoginFormValid"
                no-caps
                rounded
              >
                <template v-slot:loading>
                  <q-spinner-dots />
                </template>
              </q-btn>

              <!-- Link para recuperar senha -->
              <div class="text-center q-mt-md">
                <q-btn
                  flat
                  no-caps
                  color="primary"
                  label="Esqueci minha senha"
                  size="sm"
                  @click="showForgotPassword = true"
                />
              </div>
            </q-form>
          </q-tab-panel>

          <!-- ==========================================================================
          FORMULÁRIO DE REGISTRO
          ========================================================================== -->
          <q-tab-panel name="register" class="q-pa-none">
            <q-form @submit="handleRegister" class="q-gutter-md">
              
              <!-- Nome -->
              <q-input
                v-model="registerForm.name"
                label="Nome completo"
                outlined
                dense
                :loading="authStore.isRegistering"
                :error="!!authStore.registerError"
                :error-message="authStore.registerError"
                @input="authStore.clearErrors"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="person" color="grey-6" />
                </template>
              </q-input>

              <!-- Email -->
              <q-input
                v-model="registerForm.email"
                type="email"
                label="Email"
                outlined
                dense
                :loading="authStore.isRegistering"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="email" color="grey-6" />
                </template>
              </q-input>

              <!-- Empresa (opcional) -->
              <q-input
                v-model="registerForm.company"
                label="Empresa (opcional)"
                outlined
                dense
                :loading="authStore.isRegistering"
                class="full-width"
              >
                <template v-slot:prepend>
                  <q-icon name="business" color="grey-6" />
                </template>
              </q-input>

              <!-- Senha -->
              <q-input
                v-model="registerForm.password"
                :type="showRegisterPassword ? 'text' : 'password'"
                label="Senha"
                outlined
                dense
                :loading="authStore.isRegistering"
                class="full-width"
                hint="Mínimo 6 caracteres"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="grey-6" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showRegisterPassword ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    color="grey-6"
                    @click="showRegisterPassword = !showRegisterPassword"
                  />
                </template>
              </q-input>

              <!-- Confirmar Senha -->
              <q-input
                v-model="registerForm.confirmPassword"
                :type="showRegisterPassword ? 'text' : 'password'"
                label="Confirmar senha"
                outlined
                dense
                :loading="authStore.isRegistering"
                class="full-width"
                :error="registerForm.password !== registerForm.confirmPassword && registerForm.confirmPassword.length > 0"
                error-message="Senhas não coincidem"
              >
                <template v-slot:prepend>
                  <q-icon name="lock_outline" color="grey-6" />
                </template>
              </q-input>

              <!-- Termos de uso -->
              <q-checkbox
                v-model="registerForm.acceptTerms"
                color="primary"
                class="text-grey-7"
              >
                <span class="text-body2">
                  Aceito os 
                  <q-btn 
                    flat 
                    no-caps 
                    color="primary" 
                    label="Termos de Uso" 
                    size="sm"
                    dense
                    @click="showTerms = true"
                  />
                  e 
                  <q-btn 
                    flat 
                    no-caps 
                    color="primary" 
                    label="Política de Privacidade" 
                    size="sm"
                    dense
                    @click="showPrivacy = true"
                  />
                </span>
              </q-checkbox>

              <!-- Botão de Registro -->
              <q-btn
                type="submit"
                label="Criar Conta"
                color="secondary"
                size="lg"
                class="full-width q-mt-lg"
                :loading="authStore.isRegistering"
                :disable="!isRegisterFormValid"
                no-caps
                rounded
              >
                <template v-slot:loading>
                  <q-spinner-dots />
                </template>
              </q-btn>
            </q-form>
          </q-tab-panel>
        </q-tab-panels>

        <div class="q-mt-xl">
          <q-separator class="q-mb-md">
            <span class="text-grey-6 text-caption bg-white q-px-sm">
              ou
            </span>
          </q-separator>
          
          <!-- Placeholder para login social -->
          <div class="text-center">
            <p class="text-grey-6 text-caption">
              Login social em breve
            </p>
          </div>
        </div>
      </q-card>

      <div class="text-center q-mt-lg">
        <p class="text-grey-6 text-caption">
          © 2024 Controle Financeiro. Todos os direitos reservados.
        </p>
      </div>
    </div>

    <!-- Dialog de Esqueci a Senha -->
    <q-dialog v-model="showForgotPassword" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Recuperar Senha</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="forgotPasswordEmail"
            label="Digite seu email"
            outlined
            dense
            type="email"
            class="full-width"
          />
          <p class="text-caption text-grey-6 q-mt-sm">
            Enviaremos um link para redefinir sua senha.
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn 
            label="Enviar" 
            color="primary" 
            @click="handleForgotPassword" 
            :disable="!forgotPasswordEmail"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog de Seleção de Planos -->
    <q-dialog 
      v-model="showPlanSelection" 
      persistent 
      maximized 
      transition-show="slide-up" 
      transition-hide="slide-down"
    >
      <q-card class="column full-height">
        <!-- Header -->
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="text-h5 q-mr-md">
            <q-icon name="card_membership" class="q-mr-sm" />
            Escolha seu Plano
          </div>
          <q-space />
          <q-btn 
            flat 
            round 
            dense 
            icon="close" 
            @click="skipPlanSelection"
            color="white"
          >
            <q-tooltip>Escolher depois</q-tooltip>
          </q-btn>
        </q-card-section>

        <!-- Conteúdo -->
        <q-card-section class="col q-pa-lg">
          <div class="text-center q-mb-lg">
            <h6 class="text-h6 q-mb-sm">Bem-vindo! Agora escolha o plano ideal para você</h6>
            <p class="text-grey-7">
              Selecione o plano que melhor se adequa às suas necessidades. 
              Você pode alterar seu plano a qualquer momento.
            </p>
          </div>

          <!-- Loading de Planos -->
          <div v-if="plansStore.loading" class="text-center q-py-xl">
            <q-spinner-dots size="50px" color="primary" />
            <p class="q-mt-md text-grey-7">Carregando planos...</p>
          </div>

          <!-- Lista de Planos -->
          <div v-else-if="planOptions.length > 0" class="row q-gutter-md justify-center">
            <div 
              v-for="plan in planOptions" 
              :key="plan.id"
              class="col-12 col-sm-6 col-md-4"
              style="max-width: 320px;"
            >
              <q-card 
                :class="[
                  'plan-card cursor-pointer transition-all',
                  selectedPlanId === plan.id ? 'selected-plan' : 'hover-card'
                ]"
                @click="selectedPlanId = plan.id"
                bordered
              >
                <q-card-section class="text-center q-pb-none">
                  <div class="text-h6 text-weight-bold">{{ plan.name }}</div>
                  <div class="text-grey-7 q-mb-sm">{{ plan.description }}</div>
                  <div class="text-h4 text-primary text-weight-bold">
                    {{ parseFloat(plan.price) === 0 ? 'Gratuito' : `R$ ${plan.price}` }}
                    <span v-if="parseFloat(plan.price) > 0" class="text-body2">/mês</span>
                  </div>
                </q-card-section>

                <q-card-section>
                  <q-list dense class="q-mt-sm">
                    <q-item 
                      v-for="feature in plan.features" 
                      :key="feature"
                      class="q-px-none"
                    >
                      <q-item-section avatar>
                        <q-icon name="check_circle" color="positive" size="sm" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-body2">{{ feature }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>

                <q-card-section class="text-center q-pt-none">
                  <q-radio 
                    v-model="selectedPlanId" 
                    :val="plan.id" 
                    :label="'Selecionar ' + plan.name"
                    color="primary"
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Nenhum Plano Disponível -->
          <div v-else class="text-center q-py-xl">
            <q-icon name="info" size="64px" color="grey-5" />
            <p class="text-h6 q-mt-md text-grey-7">Nenhum plano disponível no momento</p>
            <p class="text-body2 text-grey-6">Você pode continuar e escolher um plano mais tarde.</p>
          </div>
        </q-card-section>

        <!-- Actions -->
        <q-card-actions class="q-pa-lg">
          <q-btn 
            flat 
            color="grey-7" 
            label="Escolher depois" 
            @click="skipPlanSelection"
            no-caps
          />
          <q-space />
          <q-btn 
            color="primary" 
            label="Continuar com plano selecionado" 
            @click="handlePlanSelection"
            :disable="!selectedPlanId"
            no-caps
            unelevated
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { usePlansStore } from 'src/stores/plans'
import { useNotifications } from 'src/composables/useNotifications'

// ==========================================================================
// COMPOSABLES E STORES
// ==========================================================================
const router = useRouter()
const authStore = useAuthStore()
const plansStore = usePlansStore()
const { notifySuccess, notifyError } = useNotifications()

// ==========================================================================
// ESTADO REATIVO
// ==========================================================================
const activeTab = ref('login')
const showPassword = ref(false)
const showRegisterPassword = ref(false)
const showForgotPassword = ref(false)
const showTerms = ref(false)
const showPrivacy = ref(false)
const showPlanSelection = ref(false)
const forgotPasswordEmail = ref('')
const selectedPlanId = ref('')

// Formulário de Login
const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false
})

// Formulário de Registro
const registerForm = ref({
  name: '',
  email: '',
  company: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

// ==========================================================================
// COMPUTED PROPERTIES
// ==========================================================================
const isLoginFormValid = computed(() => {
  return loginForm.value.email && 
         loginForm.value.password && 
         loginForm.value.email.includes('@')
})

const isRegisterFormValid = computed(() => {
  return registerForm.value.name &&
         registerForm.value.email &&
         registerForm.value.password &&
         registerForm.value.confirmPassword &&
         registerForm.value.password === registerForm.value.confirmPassword &&
         registerForm.value.password.length >= 6 &&
         registerForm.value.acceptTerms &&
         registerForm.value.email.includes('@')
})

const planOptions = computed(() => {
  return plansStore.availablePlans.map(plan => ({
    ...plan,
    displayName: `${plan.name} - ${parseFloat(plan.price) === 0 ? 'Gratuito' : `R$ ${plan.price}/mês`}`
  }))
})

// ==========================================================================
// MÉTODOS
// ==========================================================================

/**
 * Processa o login do usuário
 */
const handleLogin = async () => {
  console.log('🔐 [LOGIN PAGE] Processando login')
  
  try {
    await authStore.login({
      email: loginForm.value.email,
      password: loginForm.value.password
    })
    
    notifySuccess('Login realizado com sucesso!')
    
    // Redireciona para dashboard
    router.push('/dashboard')
    
  } catch (error) {
    console.error('❌ [LOGIN PAGE] Erro no login:', error.message)
    notifyError(authStore.loginError || 'Erro ao fazer login')
  }
}

/**
 * Processa o registro do usuário
 */
const handleRegister = async () => {
  console.log('📝 [LOGIN PAGE] Processando registro')
  
  try {
    await authStore.register({
      name: registerForm.value.name,
      email: registerForm.value.email,
      company: registerForm.value.company || null,
      password: registerForm.value.password
    })
    
    notifySuccess('Conta criada com sucesso!')
    
    // Carrega planos e mostra modal de seleção
    try {
      await plansStore.fetchPlans()
      showPlanSelection.value = true
    } catch (error) {
      console.error('❌ [LOGIN PAGE] Erro ao carregar planos:', error)
      // Se não conseguir carregar planos, vai direto para dashboard
      notifyError('Não foi possível carregar os planos. Você pode escolher um plano mais tarde.')
      router.push('/dashboard')
    }
    
  } catch (error) {
    console.error('❌ [LOGIN PAGE] Erro no registro:', error.message)
    notifyError(authStore.registerError || 'Erro ao criar conta')
  }
}

/**
 * Processa recuperação de senha
 */
const handleForgotPassword = () => {
  console.log('🔐 [LOGIN PAGE] Enviando recuperação de senha para:', forgotPasswordEmail.value)
  
  // TODO: Implementar API de recuperação de senha
  notifySuccess('Email de recuperação enviado!')
  showForgotPassword.value = false
  forgotPasswordEmail.value = ''
}

/**
 * Processa seleção de plano após registro
 */
const handlePlanSelection = async () => {
  if (!selectedPlanId.value) {
    notifyError('Por favor, selecione um plano')
    return
  }

  try {
    console.log('💳 [LOGIN PAGE] Atualizando plano:', selectedPlanId.value)
    
    const { userService } = await import('src/services/userService')
    await userService.changePlan(selectedPlanId.value)
    
    // Atualiza dados do usuário para refletir o novo plano
    await authStore.fetchUser()
    
    notifySuccess('Plano selecionado com sucesso!')
    showPlanSelection.value = false
    
    // Redireciona para dashboard
    router.push('/dashboard')
    
  } catch (error) {
    console.error('❌ [LOGIN PAGE] Erro ao atualizar plano:', error)
    notifyError('Erro ao selecionar plano. Você pode escolher um plano mais tarde.')
    
    // Mesmo com erro, permite continuar para dashboard
    showPlanSelection.value = false
    router.push('/dashboard')
  }
}

/**
 * Pula seleção de plano e vai direto para dashboard
 */
const skipPlanSelection = () => {
  console.log('⏭️ [LOGIN PAGE] Pulando seleção de plano')
  showPlanSelection.value = false
  router.push('/dashboard')
}

// ==========================================================================
// LIFECYCLE
// ==========================================================================
onMounted(async () => {
  console.log('🚀 [LOGIN PAGE] Página de login montada')
  
  // Se já estiver logado, redireciona
  if (authStore.isAuthenticated) {
    console.log('✅ [LOGIN PAGE] Usuário já autenticado, redirecionando')
    router.push('/dashboard')
    return
  }
  
  // Limpa erros ao entrar na página
  authStore.clearErrors()
})
</script>

<style lang="scss" scoped>
// ==========================================================================
// ESTILOS CUSTOMIZADOS
// ==========================================================================

.login-container {
  width: 100%;
  max-width: 450px;
  padding: 2rem 1rem;
}

.logo-container {
  .logo-icon {
    padding: 1rem;
    background: rgba(25, 118, 210, 0.1);
    border-radius: 50%;
  }
}

.auth-card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

// Gradiente de fundo
.bg-gradient-to-br {
  background: linear-gradient(
    135deg,
    #f8faff 0%,
    #e8f0fe 50%,
    #e3f2fd 100%
  );
}

// Animações
.q-tab-panel {
  transition: all 0.3s ease;
}

// Estilos para o modal de planos
.plan-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &.hover-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  &.selected-plan {
    border: 2px solid var(--q-primary);
    background: rgba(25, 118, 210, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(25, 118, 210, 0.2);
  }
}

// Responsivo
@media (max-width: 480px) {
  .login-container {
    padding: 1rem 0.5rem;
  }
  
  .auth-card {
    margin: 0 0.5rem;
  }
}
</style>