<!-- ==========================================================================
AUTH LAYOUT - LAYOUT PARA PÁGINAS DE AUTENTICAÇÃO
==========================================================================
Propósito: Layout minimalista para login/registro
Origem: Páginas públicas sem autenticação
Destino: Formulários de login, registro, recuperação de senha
Efeitos: Interface limpa e focada na autenticação -->

<template>
  <q-layout view="hHh lpR fFf" class="auth-layout">
    
    <!-- ==========================================================================
    CONTEÚDO PRINCIPAL
    ========================================================================== -->
    <q-page-container class="auth-container">
      <router-view />
    </q-page-container>

    <!-- ==========================================================================
    FOOTER DE INFORMAÇÕES (OPCIONAL)
    ========================================================================== -->
    <q-footer class="auth-footer bg-transparent text-center" reveal>
      <div class="q-pa-md">
        <p class="text-caption text-grey-6">
          Controle Financeiro © {{ currentYear }}
        </p>
        <div class="footer-links q-gutter-sm">
          <q-btn 
            flat 
            size="sm" 
            color="grey-6" 
            label="Política de Privacidade"
            @click="showPrivacyPolicy = true"
          />
          <span class="text-grey-5">•</span>
          <q-btn 
            flat 
            size="sm" 
            color="grey-6" 
            label="Termos de Uso"
            @click="showTermsOfService = true"
          />
          <span class="text-grey-5">•</span>
          <q-btn 
            flat 
            size="sm" 
            color="grey-6" 
            label="Suporte"
            @click="showSupport = true"
          />
        </div>
      </div>
    </q-footer>

    <!-- ==========================================================================
    DIALOGS DE INFORMAÇÕES
    ========================================================================== -->
    <!-- Dialog Política de Privacidade -->
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
            <h6>Política de Privacidade - Controle Financeiro</h6>
            
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
            <h6>Termos de Uso - Controle Financeiro</h6>
            
            <p><strong>Última atualização:</strong> {{ currentDate }}</p>
            
            <h6>1. Aceitação dos Termos</h6>
            <p>Ao acessar e usar o Controle Financeiro, você aceita e concorda em cumprir estes Termos de Uso.</p>
            
            <h6>2. Descrição do Serviço</h6>
            <p>O Controle Financeiro é uma plataforma SaaS para gestão financeira de pequenas e médias empresas.</p>
            
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
                color="blue-6"
                outline
                class="full-width"
                no-caps
                @click="openDocumentation"
              />
              
              <q-btn
                label="Contato por Email"
                icon="email"
                color="green-6"
                outline
                class="full-width"
                no-caps
                @click="openEmailSupport"
              />
            </div>
            
            <q-separator class="q-my-md" />
            
            <p class="text-caption text-grey-6">
              Horário de atendimento: Segunda a Sexta, 8h às 18h
            </p>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'

// ==========================================================================
// ESTADO REATIVO
// ==========================================================================
const showPrivacyPolicy = ref(false)
const showTermsOfService = ref(false)
const showSupport = ref(false)

// ==========================================================================
// COMPUTED PROPERTIES
// ==========================================================================
const currentYear = computed(() => {
  return new Date().getFullYear()
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('pt-BR')
})

// ==========================================================================
// MÉTODOS
// ==========================================================================

/**
 * Abre FAQ (implementação futura)
 */
const openFAQ = () => {
  console.log('📖 [AUTH LAYOUT] Abrindo FAQ')
  // TODO: Implementar página de FAQ
  showSupport.value = false
}

/**
 * Abre documentação (implementação futura)
 */
const openDocumentation = () => {
  console.log('📚 [AUTH LAYOUT] Abrindo documentação')
  // TODO: Implementar documentação
  showSupport.value = false
}

/**
 * Abre suporte por email
 */
const openEmailSupport = () => {
  console.log('📧 [AUTH LAYOUT] Abrindo suporte por email')
  
  const subject = encodeURIComponent('Suporte - Controle Financeiro')
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
// ==========================================================================
// ESTILOS DO LAYOUT DE AUTENTICAÇÃO
// ==========================================================================

.auth-layout {
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 100%
  );
  
  // Container principal
  .auth-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 1rem;
  }
  
  // Footer
  .auth-footer {
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
      color: #1976D2;
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
  .auth-layout {
    .auth-container {
      padding: 0.5rem;
    }
    
    .footer-links {
      flex-direction: column;
      gap: 0.25rem;
    }
  }
}
</style>