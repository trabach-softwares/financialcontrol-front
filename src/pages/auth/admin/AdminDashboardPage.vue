<template>
  <q-page class="admin-dashboard-page">
    <div class="q-pa-md">
      
      <!-- ==========================================================================
      CABEÇALHO DO DASHBOARD ADMINISTRATIVO
      ========================================================================== -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12">
          <div class="admin-welcome-section">
            <div class="row items-center justify-between">
              <div class="col">
                <h1 class="text-h4 text-grey-8 q-mb-xs">
                  <q-icon name="admin_panel_settings" class="q-mr-sm text-primary" />
                  Dashboard Administrativo
                </h1>
                <p class="text-subtitle1 text-grey-6">
                  Visão geral do sistema e controle de plataforma
                </p>
              </div>
              <div class="col-auto">
                <q-btn-group class="admin-actions">
                  <q-btn 
                    color="primary" 
                    icon="refresh" 
                    label="Atualizar" 
                    @click="refreshData"
                    no-caps
                    unelevated
                  />
                  <q-btn 
                    color="secondary" 
                    icon="download" 
                    label="Exportar" 
                    @click="exportData"
                    no-caps
                    unelevated
                  />
                </q-btn-group>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================================================
      CARDS DE MÉTRICAS ADMINISTRATIVAS
      ========================================================================== -->
      <div class="row q-col-gutter-md q-mb-lg">
        
        <!-- Card de Usuários Totais -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="admin-metric-card users-card" flat bordered>
            <q-card-section class="flex items-center justify-between">
              <div>
                <div class="metric-label text-grey-6 text-caption">
                  Total de Usuários
                </div>
                <div class="metric-value text-h5 text-blue-7 q-mb-xs">
                  {{ metrics.totalUsers }}
                </div>
                <div class="metric-trend text-blue-6 text-caption">
                  <q-icon name="trending_up" size="xs" />
                  +{{ metrics.newUsersToday }} hoje
                </div>
              </div>
              <q-icon 
                name="people" 
                size="2.5rem" 
                color="blue-6" 
                class="metric-icon"
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- Card de Receita Total -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="admin-metric-card revenue-card" flat bordered>
            <q-card-section class="flex items-center justify-between">
              <div>
                <div class="metric-label text-grey-6 text-caption">
                  Receita Total
                </div>
                <div class="metric-value text-h5 text-green-7 q-mb-xs">
                  {{ formatCurrency(metrics.totalRevenue) }}
                </div>
                <div class="metric-trend text-green-6 text-caption">
                  <q-icon name="trending_up" size="xs" />
                  +{{ formatCurrency(metrics.monthlyGrowth) }} este mês
                </div>
              </div>
              <q-icon 
                name="account_balance_wallet" 
                size="2.5rem" 
                color="green-6" 
                class="metric-icon"
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- Card de Assinaturas Ativas -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="admin-metric-card subscriptions-card" flat bordered>
            <q-card-section class="flex items-center justify-between">
              <div>
                <div class="metric-label text-grey-6 text-caption">
                  Assinaturas Ativas
                </div>
                <div class="metric-value text-h5 text-orange-7 q-mb-xs">
                  {{ metrics.activeSubscriptions }}
                </div>
                <div class="metric-trend text-orange-6 text-caption">
                  <q-icon name="trending_up" size="xs" />
                  {{ metrics.subscriptionGrowth }}% crescimento
                </div>
              </div>
              <q-icon 
                name="card_membership" 
                size="2.5rem" 
                color="orange-6" 
                class="metric-icon"
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- Card de Problemas do Sistema -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="admin-metric-card issues-card" flat bordered>
            <q-card-section class="flex items-center justify-between">
              <div>
                <div class="metric-label text-grey-6 text-caption">
                  Problemas do Sistema
                </div>
                <div class="metric-value text-h5 q-mb-xs" :class="metrics.systemIssues > 0 ? 'text-red-7' : 'text-grey-5'">
                  {{ metrics.systemIssues }}
                </div>
                <div class="metric-trend text-grey-6 text-caption">
                  <q-icon name="schedule" size="xs" />
                  Últimas 24h
                </div>
              </div>
              <q-icon 
                name="error_outline" 
                size="2.5rem" 
                :color="metrics.systemIssues > 0 ? 'red-6' : 'grey-5'" 
                class="metric-icon"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- ==========================================================================
      GRÁFICOS E ANALYTICS
      ========================================================================== -->
      <div class="row q-col-gutter-md q-mb-lg">
        
        <!-- Gráfico de Crescimento de Usuários -->
        <div class="col-12 col-lg-8">
          <q-card class="admin-chart-card full-height" flat bordered>
            <q-card-section>
              <div class="text-h6 q-mb-md text-grey-8">
                <q-icon name="trending_up" class="q-mr-sm text-blue-6" />
                Crescimento de Usuários
              </div>
              <div class="chart-container">
                <div class="chart-placeholder text-center">
                  <q-icon name="show_chart" size="80px" color="grey-4" />
                  <div class="text-h6 q-mt-md text-grey-6">Gráfico de Crescimento</div>
                  <div class="text-body2 text-grey-5">Dados dos últimos 30 dias</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Distribuição de Planos -->
        <div class="col-12 col-lg-4">
          <q-card class="admin-chart-card full-height" flat bordered>
            <q-card-section>
              <div class="text-h6 q-mb-md text-grey-8">
                <q-icon name="pie_chart" class="q-mr-sm text-orange-6" />
                Distribuição de Planos
              </div>
              
              <div class="plan-distribution q-gutter-md">
                <div class="plan-item">
                  <div class="row items-center q-mb-sm">
                    <div class="col">
                      <div class="text-weight-medium text-grey-7">Gratuito</div>
                    </div>
                    <div class="col-auto">
                      <div class="text-h6 text-weight-bold text-blue-7">65%</div>
                    </div>
                  </div>
                  <q-linear-progress :value="0.65" color="blue-6" size="8px" rounded />
                </div>

                <div class="plan-item">
                  <div class="row items-center q-mb-sm">
                    <div class="col">
                      <div class="text-weight-medium text-grey-7">Pro</div>
                    </div>
                    <div class="col-auto">
                      <div class="text-h6 text-weight-bold text-orange-7">25%</div>
                    </div>
                  </div>
                  <q-linear-progress :value="0.25" color="orange-6" size="8px" rounded />
                </div>

                <div class="plan-item">
                  <div class="row items-center q-mb-sm">
                    <div class="col">
                      <div class="text-weight-medium text-grey-7">Enterprise</div>
                    </div>
                    <div class="col-auto">
                      <div class="text-h6 text-weight-bold text-green-7">10%</div>
                    </div>
                  </div>
                  <q-linear-progress :value="0.10" color="green-6" size="8px" rounded />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- ==========================================================================
      ATIVIDADES RECENTES E STATUS DO SISTEMA
      ========================================================================== -->
      <div class="row q-col-gutter-md">
        
        <!-- Usuários Recentes -->
        <div class="col-12 col-lg-6">
          <q-card class="admin-activity-card" flat bordered>
            <q-card-section>
              <div class="text-h6 q-mb-md text-grey-8">
                <q-icon name="person_add" class="q-mr-sm text-blue-6" />
                Usuários Recentes
              </div>

              <q-list separator class="recent-users-list">
                <q-item
                  v-for="user in recentUsers"
                  :key="user.id"
                  class="recent-user-item"
                >
                  <q-item-section avatar>
                    <q-avatar color="blue-1" text-color="blue-7">
                      <img v-if="user.avatar" :src="user.avatar" alt="Avatar" />
                      <q-icon v-else name="person" />
                    </q-avatar>
                  </q-item-section>
                  
                  <q-item-section>
                    <q-item-label class="text-weight-medium text-grey-8">{{ user.name }}</q-item-label>
                    <q-item-label caption class="text-grey-6">{{ user.email }}</q-item-label>
                  </q-item-section>
                  
                  <q-item-section side>
                    <div class="column items-end">
                      <q-chip 
                        :color="getPlanColor(user.plan)" 
                        text-color="white" 
                        size="sm"
                        outline
                      >
                        {{ getPlanName(user.plan) }}
                      </q-chip>
                      <div class="text-caption text-grey-5 q-mt-xs">
                        {{ formatDate(user.createdAt) }}
                      </div>
                    </div>
                  </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          
          <q-card-actions>
            <q-btn 
              color="primary" 
              flat 
              icon="people" 
              label="Ver Todos os Usuários"
              @click="$router.push('/admin/users')"
            />
          </q-card-actions>
        </q-card>
      </div>

        <!-- Status do Sistema -->
        <div class="col-12 col-lg-6">
          <q-card class="admin-activity-card" flat bordered>
            <q-card-section>
              <div class="text-h6 q-mb-md text-grey-8">
                <q-icon name="health_and_safety" class="q-mr-sm text-green-6" />
                Status do Sistema
              </div>

              <div class="system-status q-gutter-md">
                <!-- Status dos Serviços -->
                <div class="service-status">
                  <div class="row items-center q-mb-sm">
                    <div class="col">
                      <div class="text-weight-medium text-grey-7">
                        <q-icon name="dns" class="q-mr-sm text-blue-6" />
                        Servidor Principal
                      </div>
                    </div>
                    <div class="col-auto">
                      <q-chip color="green" text-color="white" icon="check_circle" outline>
                        Online
                      </q-chip>
                    </div>
                  </div>

                  <div class="row items-center q-mb-sm">
                    <div class="col">
                      <div class="text-weight-medium text-grey-7">
                        <q-icon name="storage" class="q-mr-sm text-blue-6" />
                        Banco de Dados
                      </div>
                    </div>
                    <div class="col-auto">
                      <q-chip color="green" text-color="white" icon="check_circle" outline>
                        Conectado
                      </q-chip>
                    </div>
                  </div>

                  <div class="row items-center q-mb-sm">
                    <div class="col">
                      <div class="text-weight-medium text-grey-7">
                        <q-icon name="api" class="q-mr-sm text-blue-6" />
                        API REST
                      </div>
                    </div>
                    <div class="col-auto">
                      <q-chip color="green" text-color="white" icon="check_circle" outline>
                        Funcionando
                      </q-chip>
                    </div>
                  </div>

                  <div class="row items-center q-mb-md">
                    <div class="col">
                      <div class="text-weight-medium text-grey-7">
                        <q-icon name="backup" class="q-mr-sm text-blue-6" />
                        Último Backup
                      </div>
                    </div>
                    <div class="col-auto">
                      <q-chip color="blue" text-color="white" outline>
                        2h atrás
                      </q-chip>
                    </div>
                  </div>
                </div>

                <!-- Performance do Sistema -->
                <q-separator />
                <div class="performance-section q-mt-md">
                  <div class="text-weight-medium q-mb-md text-grey-7">Métricas de Performance</div>
                  
                  <div class="performance-item q-mb-sm">
                    <div class="row items-center q-mb-xs">
                      <div class="col-3 text-body2 text-grey-6">CPU:</div>
                      <div class="col">
                        <q-linear-progress :value="0.35" color="green-6" size="10px" rounded />
                      </div>
                      <div class="col-auto text-body2 text-weight-medium">35%</div>
                    </div>
                  </div>
                  
                  <div class="performance-item q-mb-sm">
                    <div class="row items-center q-mb-xs">
                      <div class="col-3 text-body2 text-grey-6">RAM:</div>
                      <div class="col">
                        <q-linear-progress :value="0.60" color="orange-6" size="10px" rounded />
                      </div>
                      <div class="col-auto text-body2 text-weight-medium">60%</div>
                    </div>
                  </div>
                  
                  <div class="performance-item">
                    <div class="row items-center">
                      <div class="col-3 text-body2 text-grey-6">Disco:</div>
                      <div class="col">
                        <q-linear-progress :value="0.20" color="green-6" size="10px" rounded />
                      </div>
                      <div class="col-auto text-body2 text-weight-medium">20%</div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
            
            <q-card-actions>
              <q-btn 
                color="primary" 
                flat 
                icon="settings_applications" 
                label="Configurações do Sistema"
                @click="$router.push('/admin/system')"
                no-caps
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
      
    </div>

    <!-- Loading -->
    <div v-if="loading" class="fixed-center">
      <q-circular-progress
        indeterminate
        size="50px"
        color="primary"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCurrency } from 'src/composables/useCurrency'
import { useDate } from 'src/composables/useDate'
import { useNotifications } from 'src/composables/useNotifications'

// Composables
const { formatCurrency } = useCurrency()
const { formatDate } = useDate()
const { showSuccess, showError } = useNotifications()

// Refs
const loading = ref(false)

// Data
const metrics = ref({
  totalUsers: 1250,
  newUsersToday: 12,
  totalRevenue: 45680.50,
  monthlyGrowth: 3450.25,
  activeSubscriptions: 890,
  subscriptionGrowth: 8.5,
  systemIssues: 2
})

const recentUsers = ref([
  {
    id: 1,
    name: 'Maria Silva',
    email: 'maria@email.com',
    plan: 'premium',
    avatar: null,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'João Santos',
    email: 'joao@email.com',
    plan: 'pro',
    avatar: null,
    createdAt: '2024-01-15T09:15:00Z'
  },
  {
    id: 3,
    name: 'Ana Costa',
    email: 'ana@email.com',
    plan: 'free',
    avatar: null,
    createdAt: '2024-01-15T08:45:00Z'
  },
  {
    id: 4,
    name: 'Pedro Lima',
    email: 'pedro@email.com',
    plan: 'pro',
    avatar: null,
    createdAt: '2024-01-14T16:20:00Z'
  },
  {
    id: 5,
    name: 'Carla Mendes',
    email: 'carla@email.com',
    plan: 'premium',
    avatar: null,
    createdAt: '2024-01-14T14:10:00Z'
  }
])

// Methods
const getPlanColor = (plan) => {
  const planName = getPlanName(plan).toLowerCase()
  const colors = {
    'free': 'info',
    'pro': 'warning',
    'premium': 'positive'
  }
  return colors[planName] || 'grey'
}

const getPlanName = (plan) => {
  if (typeof plan === 'string') {
    return plan.toUpperCase()
  }
  if (typeof plan === 'object' && plan?.name) {
    return plan.name.toUpperCase()
  }
  return 'FREE'
}

const refreshData = async () => {
  try {
    loading.value = true
    // In a real app, this would fetch fresh data from the API
    await new Promise(resolve => setTimeout(resolve, 1000))
    showSuccess('Dados atualizados com sucesso!')
  } catch (error) {
    showError('Erro ao atualizar dados')
  } finally {
    loading.value = false
  }
}

const exportData = () => {
  showSuccess('Exportando dados administrativos...')
  // In a real app, this would generate and download a report
}

// Lifecycle
onMounted(() => {
  // Load admin dashboard data
  console.log('Loading admin dashboard')
})
</script>

<style lang="scss" scoped>
// ==========================================================================
// ESTILOS DO DASHBOARD ADMINISTRATIVO
// ==========================================================================

.admin-dashboard-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.admin-welcome-section {
  padding: 1rem 0;
}

// Botões de ações administrativas
.admin-actions {
  .q-btn {
    border-radius: 8px;
    
    &:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
}

// Cards de métricas administrativas
.admin-metric-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  &.users-card {
    border-left-color: #2196F3;
  }
  
  &.revenue-card {
    border-left-color: #4CAF50;
  }
  
  &.subscriptions-card {
    border-left-color: #FF9800;
  }
  
  &.issues-card {
    border-left-color: #f44336;
  }
}

.metric-value {
  font-weight: 600;
  line-height: 1.2;
}

.metric-icon {
  opacity: 0.7;
}

// Cards de gráficos
.admin-chart-card {
  border-radius: 12px;
  
  .chart-container {
    height: 300px;
    position: relative;
    background: #fafafa;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .chart-placeholder {
    padding: 2rem;
  }
}

// Distribuição de planos
.plan-distribution {
  .plan-item {
    padding: 0.5rem 0;
    
    &:not(:last-child) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      margin-bottom: 0.75rem;
      padding-bottom: 0.75rem;
    }
  }
}

// Cards de atividades
.admin-activity-card {
  border-radius: 12px;
  
  .recent-users-list {
    .recent-user-item {
      padding: 0.75rem 0;
      border-radius: 8px;
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
    }
  }
}

// Status do sistema
.system-status {
  .service-status {
    .row {
      padding: 0.25rem 0;
    }
  }
  
  .performance-section {
    .performance-item {
      .row {
        margin-bottom: 0.5rem;
      }
    }
  }
}

// Loading overlay
.fixed-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}

// Responsividade
@media (max-width: 768px) {
  .metric-value {
    font-size: 1.2rem;
  }
  
  .admin-chart-card .chart-container {
    height: 250px;
  }
  
  .admin-actions {
    flex-direction: column;
    
    .q-btn {
      width: 100%;
      margin-bottom: 0.5rem;
      margin-right: 0;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

@media (max-width: 480px) {
  .admin-welcome-section {
    .row {
      flex-direction: column;
      
      .col-auto {
        align-self: stretch;
        margin-top: 1rem;
      }
    }
  }
}

.opacity-80 {
  opacity: 0.8;
}

.full-height {
  height: 100%;
}

.fixed-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
</style>