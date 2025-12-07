<!-- ==========================================================================
AUTH LAYOUT - LAYOUT PARA PÁGINAS DE AUTENTICAÇÃO
==========================================================================
Propósito: Layout minimalista para login/registro
Origem: Páginas públicas sem autenticação
Destino: Formulários de login, registro, recuperação de senha
Efeitos: Interface limpa e focada na autenticação -->

<template>
  <q-layout view="hHh lpR fFf" class="auth-layout q-light">
    
    <!-- Background 3D Animado com Ícones do Quasar -->
    <div class="auth-background">
      <div class="floating-shapes">
        <!-- Cifrão -->
        <div class="shape shape-1">
          <q-icon name="attach_money" class="shape-icon" />
        </div>
        
        <!-- Gráfico de linha -->
        <div class="shape shape-2">
          <q-icon name="show_chart" class="shape-icon" />
        </div>
        
        <!-- Carteira -->
        <div class="shape shape-3">
          <q-icon name="account_balance_wallet" class="shape-icon" />
        </div>
        
        <!-- Gráfico de barras -->
        <div class="shape shape-4">
          <q-icon name="bar_chart" class="shape-icon" />
        </div>
        
        <!-- Monetização -->
        <div class="shape shape-5">
          <q-icon name="monetization_on" class="shape-icon" />
        </div>
        
        <!-- Gráfico de pizza -->
        <div class="shape shape-6">
          <q-icon name="pie_chart" class="shape-icon" />
        </div>
      </div>
      <div class="gradient-overlay"></div>
      <div class="texture-overlay"></div>
    </div>
  
    <q-page-container class="auth-container">
      <router-view />
    </q-page-container>

    <q-dialog v-model="showPrivacyPolicy" maximized>
      <q-card class="policy-card">
        <q-bar class="bg-primary text-white">
          <q-icon name="policy" />
          <div class="text-weight-medium q-ml-sm">Política de Privacidade</div>
          <q-space />
          <q-btn dense flat icon="close" @click="showPrivacyPolicy = false" />
        </q-bar>
        
        <q-card-section class="q-pa-lg">
          <div class="text-body1">
            <h6>Política de Privacidade - Financial Control</h6>
            
            <p><strong>Última atualização:</strong> {{ currentDate }}</p>
            
            <h6>1. Informações que Coletamos</h6>
            <p>Coletamos informações que você nos fornece diretamente, como:</p>
            <ul>
              <li>Dados de cadastro (nome, email, empresa)</li>
              <li>Informações financeiras inseridas na plataforma</li>
              <li>Dados de uso e navegação</li>
            </ul>
            
            <h6>2. Como Usamos suas Informações</h6>
            <p>Utilizamos suas informações para:</p>
            <ul>
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Processar transações e gerar relatórios</li>
              <li>Enviar atualizações e comunicações importantes</li>
            </ul>
            
            <h6>3. Proteção de Dados</h6>
            <p>Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição.</p>
            
            <h6>4. Compartilhamento de Informações</h6>
            <p>Não vendemos, trocamos ou transferimos suas informações pessoais para terceiros sem seu consentimento, exceto conforme descrito nesta política.</p>
            
            <h6>5. Seus Direitos</h6>
            <p>Você tem o direito de acessar, corrigir, excluir ou portar seus dados pessoais. Entre em contato conosco para exercer esses direitos.</p>
            
            <h6>6. Contato</h6>
            <p>Para dúvidas sobre esta política, entre em contato: <strong>privacidade@controle-financeiro.com</strong></p>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog Termos de Uso -->
    <q-dialog v-model="showTermsOfService" maximized>
      <q-card class="policy-card">
        <q-bar class="bg-primary text-white">
          <q-icon name="gavel" />
          <div class="text-weight-medium q-ml-sm">Termos de Uso</div>
          <q-space />
          <q-btn dense flat icon="close" @click="showTermsOfService = false" />
        </q-bar>
        
        <q-card-section class="q-pa-lg">
          <div class="text-body1">
            <h6>Termos de Uso - Financial Control</h6>
            
            <p><strong>Última atualização:</strong> {{ currentDate }}</p>
            
            <h6>1. Aceitação dos Termos</h6>
            <p>Ao acessar e usar o Financial Control, você aceita e concorda em cumprir estes Termos de Uso.</p>
            
            <h6>2. Descrição do Serviço</h6>
            <p>O Financial Control é uma plataforma SaaS para gestão financeira de pequenas e médias empresas.</p>
            
            <h6>3. Responsabilidades do Usuário</h6>
            <ul>
              <li>Manter a confidencialidade de suas credenciais</li>
              <li>Usar o serviço apenas para fins legítimos</li>
              <li>Não violar direitos de propriedade intelectual</li>
              <li>Inserir dados precisos e atualizados</li>
            </ul>
            
            <h6>4. Restrições de Uso</h6>
            <p>É proibido:</p>
            <ul>
              <li>Usar o serviço para atividades ilegais</li>
              <li>Tentar acessar sistemas não autorizados</li>
              <li>Interferir no funcionamento da plataforma</li>
              <li>Reproduzir ou distribuir conteúdo sem autorização</li>
            </ul>
            
            <h6>5. Planos e Pagamentos</h6>
            <p>Os planos e preços estão disponíveis na página de assinaturas. O pagamento é processado mensalmente ou anualmente conforme escolhido.</p>
            
            <h6>6. Cancelamento</h6>
            <p>Você pode cancelar sua conta a qualquer momento. Os dados serão mantidos conforme nossa Política de Privacidade.</p>
            
            <h6>7. Limitação de Responsabilidade</h6>
            <p>O serviço é fornecido "como está". Não garantimos disponibilidade ininterrupta ou ausência de erros.</p>
            
            <h6>8. Contato</h6>
            <p>Para dúvidas sobre estes termos, entre em contato: <strong>suporte@controle-financeiro.com</strong></p>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog Suporte -->
    <q-dialog v-model="showSupport">
      <q-card style="min-width: 400px">
        <q-bar class="bg-primary text-white">
          <q-icon name="support_agent" />
          <div class="text-weight-medium q-ml-sm">Central de Suporte</div>
          <q-space />
          <q-btn dense flat icon="close" @click="showSupport = false" />
        </q-bar>
        
        <q-card-section>
          <div class="text-center q-py-md">
            <q-icon name="support_agent" size="4rem" color="primary" class="q-mb-md" />
            <h6 class="text-h6 q-mb-md">Como podemos ajudar?</h6>
            
            <div class="q-gutter-sm">
              <q-btn
                label="FAQ - Perguntas Frequentes"
                icon="help"
                color="primary"
                outline
                class="full-width"
                no-caps
                @click="openFAQ"
              />
              
              <q-btn
                label="Documentação"
                icon="description"
                color="secondary"
                outline
                class="full-width"
                no-caps
                @click="openDocumentation"
              />
              
              <q-btn
                label="Contato por Email"
                icon="email"
                color="positive"
                outline
                class="full-width"
                no-caps
                @click="openEmailSupport"
              />
            </div>
            
            <q-separator class="q-my-md" />
            
            <p class="text-caption">
              Horário de atendimento: Segunda a Sexta, 8h às 18h
            </p>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'

const showPrivacyPolicy = ref(false)
const showTermsOfService = ref(false)
const showSupport = ref(false)
const currentYear = computed(() => {
  return new Date().getFullYear()
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('pt-BR')
})

const $q = useQuasar()
const prevDark = ref(false)

onMounted(() => {
  prevDark.value = $q.dark.isActive
  $q.dark.set(false)
})

onBeforeUnmount(() => {
  $q.dark.set(prevDark.value)
})

/**
 * Abre FAQ (implementação futura)
 */
const openFAQ = () => {
  // TODO: Implementar página de FAQ
  showSupport.value = false
}

/**
 * Abre documentação (implementação futura)
 */
const openDocumentation = () => {
  // TODO: Implementar documentação
  showSupport.value = false
}

/**
 * Abre suporte por email
 */
const openEmailSupport = () => {
  
  const subject = encodeURIComponent('Suporte - Financial Control')
  const body = encodeURIComponent(`
Olá equipe de suporte!

Por favor, descreva sua dúvida ou problema abaixo:

---

Dados do sistema:
- Data: ${new Date().toLocaleString('pt-BR')}
- Navegador: ${navigator.userAgent}
  `)
  
  window.open(`mailto:suporte@controle-financeiro.com?subject=${subject}&body=${body}`)
  showSupport.value = false
}
</script>

<style lang="scss" scoped>
.auth-layout {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  
  // Container principal
  .auth-container {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: var(--spacing-4);
  }
}

// ==========================================================================
// BACKGROUND 3D ANIMADO - SAGE ACCOUNTANT
// ==========================================================================

.auth-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #2C5F2D 0%,
    #3d7a3e 50%,
    #107C10 100%
  );
}

// Formas Geométricas 3D Flutuantes
.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  
  .shape {
    position: absolute;
    color: rgba(255, 255, 255, 0.1);
    font-size: 120px;
    z-index: 0;
    pointer-events: none;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    
    // Estilo para os ícones dentro das formas
    .q-icon {
      opacity: 0.8;
      transition: all 0.3s ease;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    }
    
    // Efeito de hover sutil
    &:hover .q-icon {
      opacity: 1;
      transform: scale(1.1);
    }
    
    // Efeito 3D
    transform-style: preserve-3d;
    transform: perspective(1000px) rotateX(20deg) rotateY(20deg);
    
    &::before {
      display: block;
    }
    
    // Removido o conteúdo dos pseudo-elementos pois usaremos ícones do Quasar
    &::before {
      display: none;
    }
    
    // Estilo para os ícones do Quasar
    .q-icon {
      font-size: inherit;
      width: 1em;
      height: 1em;
      color: inherit;
    }
    
    &.shape-1 {
      width: auto;
      height: auto;
      top: 10%;
      left: 5%;
      animation: float 25s ease-in-out infinite;
      font-size: 200px;
      animation-delay: 0s;
    }
    
    &.shape-2 {
      width: auto;
      height: auto;
      top: 60%;
      right: 10%;
      animation: float 30s ease-in-out infinite reverse;
      animation-delay: -5s;
      font-size: 120px;
    }
    
    &.shape-3 {
      width: auto;
      height: auto;
      bottom: 20%;
      left: 15%;
      animation: float 22s ease-in-out infinite;
      animation-delay: -10s;
      font-size: 150px;
    }
    
    &.shape-4 {
      width: auto;
      height: auto;
      top: 30%;
      right: 20%;
      animation: float 28s ease-in-out infinite reverse;
      animation-delay: -15s;
      font-size: 180px;
    }
    
    &.shape-5 {
      width: auto;
      height: auto;
      bottom: 10%;
      right: 5%;
      animation: float 26s ease-in-out infinite;
      animation-delay: -20s;
      font-size: 160px;
    }
    
    &.shape-6 {
      width: auto;
      height: auto;
      top: 5%;
      left: 50%;
      animation: float 24s ease-in-out infinite reverse;
      animation-delay: -8s;
      font-size: 140px;
    }
  }
}

// Animação de Flutuação 3D com Pulsação
@keyframes float {
  0%, 100% {
    transform: 
      perspective(1000px) 
      rotateX(20deg) 
      rotateY(20deg) 
      translateY(0px) 
      translateX(0px) 
      scale(1);
    opacity: 0.6;
  }
  25% {
    transform: 
      perspective(1000px) 
      rotateX(-10deg) 
      rotateY(30deg) 
      translateY(-30px) 
      translateX(20px) 
      scale(1.05);
    opacity: 0.8;
  }
  50% {
    transform: 
      perspective(1000px) 
      rotateX(15deg) 
      rotateY(-20deg) 
      translateY(-50px) 
      translateX(-20px) 
      scale(1.1);
    opacity: 1;
  }
  75% {
    transform: 
      perspective(1000px) 
      rotateX(-20deg) 
      rotateY(10deg) 
      translateY(-30px) 
      translateX(30px) 
      scale(1.05);
    opacity: 0.8;
  }
}

// Gradiente Overlay Animado
.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(44, 95, 45, 0.15) 0%, transparent 30%),
    radial-gradient(circle at 80% 70%, rgba(25, 118, 210, 0.1) 0%, transparent 30%),
    linear-gradient(135deg, rgba(44, 95, 45, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%);
  z-index: 0;
  
  // Linhas de conexão entre elementos
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(90deg, transparent 49.5%, rgba(255, 255, 255, 0.03) 49.5%, rgba(255, 255, 255, 0.03) 50.5%, transparent 50.5%),
      linear-gradient(0deg, transparent 49.5%, rgba(255, 255, 255, 0.03) 49.5%, rgba(255, 255, 255, 0.03) 50.5%, transparent 50.5%);
    background-size: 50px 50px;
    opacity: 0.5;
  }
}

@keyframes gradientShift {
  0%, 100% {
    opacity: 0.5;
    transform: translateX(0) translateY(0);
  }
  50% {
    opacity: 0.8;
    transform: translateX(-20px) translateY(-20px);
  }
}

// Textura Sutil
.texture-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.03;
  background-image: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.05) 2px,
      rgba(255, 255, 255, 0.05) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.05) 2px,
      rgba(255, 255, 255, 0.05) 4px
    );
  pointer-events: none;
}

// Footer
.auth-footer {
  position: relative;
  z-index: 10;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1) !important;
  
  .footer-links {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }
}

// Cards de política
.policy-card {
    .q-bar {
      border-radius: 0;
    }
    
    h6 {
      color: var(--color-primary); // Verde contábil #2C5F2D
      margin: 1.5rem 0 0.5rem 0;
      
      &:first-child {
        margin-top: 0;
      }
    }
    
    ul {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
      
      li {
        margin: 0.25rem 0;
      }
    }
    
    p {
      margin: 0.75rem 0;
      line-height: 1.6;
    }
  }


// Animação de entrada
.auth-layout {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// Responsividade
@media (max-width: 768px) {
  .auth-layout .auth-container {
    padding: var(--spacing-2);
  }
  
  .auth-footer .footer-links {
    flex-direction: column;
    gap: var(--spacing-1);
  }
  
  // Reduzir complexidade das formas em mobile
  .floating-shapes .shape {
    opacity: 0.5;
    
    &.shape-4,
    &.shape-5,
    &.shape-6 {
      display: none;
    }
  }
}
</style>