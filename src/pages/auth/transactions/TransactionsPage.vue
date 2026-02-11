<template>
  <q-page class="transactions-page">
    <div class="q-pa-md">
      
      <!-- ==========================================================================
      CABEÇALHO MODERNO E COMPACTO
      ========================================================================== -->
      <div class="page-header-modern q-mb-lg">
        <div class="row items-center justify-between no-wrap">
          <!-- Título e Badge -->
          <div class="col-auto">
            <div class="header-title-group">
              <h1 class="page-title">
                Transações
              </h1>
              <q-badge 
                color="blue-grey-3" 
                text-color="blue-grey-9"
                class="total-transactions-badge"
              >
                {{ transactionStore.pagination.total || 0 }} registros
              </q-badge>
            </div>
          </div>
          
          <!-- Botão Nova Transação -->
          <div class="col-auto">
            <q-btn
              label="Nova Transação"
              icon="add"
              color="primary"
              unelevated
              no-caps
              class="new-transaction-btn"
              @click="openTransactionForm()"
            />
          </div>
        </div>
      </div>

      <!-- ==========================================================================
      NAVEGAÇÃO E FILTROS - DESIGN LIMPO
      ========================================================================== -->
      <div class="filters-container row q-col-gutter-md q-mb-lg">
        
        <!-- Navegador de Mês - Design Limpo -->
        <div class="col-12 col-md-6">
          <MonthNavigator 
            @change="handleMonthChange"
            :loading="isLoadingTransactions"
            storage-key="transactions-month"
          />
        </div>

        <!-- Filtros Avançados - Design Compacto -->
        <div class="col-12 col-md-6">
          <q-expansion-item
            dense-toggle
            expand-separator
            class="advanced-filters-modern"
            header-class="filters-header"
          >
            <template v-slot:header>
              <q-item-section avatar style="min-width: 40px;">
                <div class="filter-icon-wrapper">
                  <q-icon name="tune" size="20px" />
                </div>
              </q-item-section>

              <q-item-section>
                <q-item-label class="filter-label">
                  Filtros Avançados
                </q-item-label>
                <q-item-label caption class="filter-caption">
                  Busca, período, tipo, categoria, status
                </q-item-label>
              </q-item-section>
              
              <q-item-section side>
                <q-icon name="expand_more" size="20px" color="grey-6" />
              </q-item-section>
            </template>

            <q-card flat class="filters-content">
              <q-card-section class="q-pa-md">
                
                <!-- Filtro de Período -->
                <div class="filter-group q-mb-md">
                  <div class="filter-group-label">
                    <q-icon name="event" size="16px" class="q-mr-xs" />
                    Período Personalizado
                  </div>
                  <PeriodFilter 
                    @change="handleAdvancedPeriodChange"
                    storage-key="transactions-advanced-period"
                  />
                </div>

                <q-separator class="q-my-md" />

                <!-- Filtros de Busca e Seleção -->
                <div class="filter-group">
                  <div class="filter-group-label q-mb-sm">
                    <q-icon name="manage_search" size="16px" class="q-mr-xs" />
                    Filtros de Busca
                  </div>
                  <div class="row q-col-gutter-sm">
                    
                    <!-- Buscar por descrição -->
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="filters.search"
                        label="Buscar transação"
                        outlined
                        dense
                        clearable
                        debounce="500"
                        @update:model-value="applyFilters"
                      >
                        <template v-slot:prepend>
                          <q-icon name="search" size="18px" />
                        </template>
                      </q-input>
                    </div>

                    <!-- Filtro por tipo -->
                    <div class="col-12 col-sm-6">
                      <q-select
                        v-model="filters.type"
                        label="Tipo"
                        :options="typeOptions"
                        outlined
                        dense
                        clearable
                        emit-value
                        map-options
                        @update:model-value="applyFilters"
                      >
                        <template v-slot:prepend>
                          <q-icon name="swap_vert" size="18px" />
                        </template>
                      </q-select>
                    </div>

                    <!-- Filtro por categoria -->
                    <div class="col-12 col-sm-6">
                      <q-select
                        v-model="filters.category"
                        label="Categoria"
                        :options="categoryOptions"
                        outlined
                        dense
                        clearable
                        @update:model-value="applyFilters"
                      >
                        <template v-slot:prepend>
                          <q-icon name="label" size="18px" />
                        </template>
                      </q-select>
                    </div>

                    <!-- Status (Pago/Pendente) -->
                    <div class="col-12 col-sm-6">
                      <q-select
                        v-model="filters.paid"
                        label="Status"
                        :options="paidOptions"
                        outlined
                        dense
                        clearable
                        emit-value
                        map-options
                        @update:model-value="applyFilters"
                      >
                        <template v-slot:prepend>
                          <q-icon name="check_circle" size="18px" />
                        </template>
                      </q-select>
                    </div>

                    <!-- Botão limpar filtros -->
                    <div class="col-12">
                      <q-btn
                        label="Limpar Filtros"
                        icon="clear_all"
                        color="grey-7"
                        flat
                        dense
                        no-caps
                        class="full-width"
                        @click="clearAllFilters"
                      />
                    </div>
                  </div>
                </div>

              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </div>

      <!-- Banner informativo se estiver em mês futuro -->
      <div v-if="isFutureMonth" class="row q-mb-lg">
        <div class="col-12">
          <q-banner class="future-month-banner" rounded>
            <template v-slot:avatar>
              <q-avatar color="orange" text-color="white" size="48px">
                <q-icon name="schedule" size="24px" />
              </q-avatar>
            </template>
            <div class="text-weight-medium text-h6">
              🔮 Visualizando lançamentos futuros
            </div>
            <div class="text-body2 q-mt-xs opacity-80">
              As transações marcadas como "Pendente" ainda não foram pagas ou recebidas.
            </div>
          </q-banner>
        </div>
      </div>

      <!-- ==========================================================================
      RESUMO FINANCEIRO - DESIGN LIMPO E MODERNO
      ========================================================================== -->
      
      <!-- Card Único com Grid de Estatísticas -->
      <q-card flat bordered class="financial-summary-card q-mb-lg">
        
        <!-- Header com Título -->
        <q-card-section class="summary-header bg-teal-1">
          <div class="row items-center">
            <div class="col">
              <div class="text-h6 text-weight-bold text-teal-9">
                Fluxo de Caixa Efetivado
              </div>
              <div class="text-caption text-teal-8">
                Movimentações já realizadas neste período
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- Grid de Valores - 3 colunas em desktop -->
        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            
            <!-- Receitas Recebidas -->
            <div class="col-12 col-sm-4">
              <div class="stat-item stat-positive">
                <div class="stat-label">
                  <q-icon name="arrow_upward" size="18px" class="q-mr-xs" />
                  Receitas Recebidas
                </div>
                <div class="stat-value text-positive">
                  {{ formatCurrency(totalReceived) }}
                </div>
                <div class="stat-meta">
                  {{ receivedCount }} {{ receivedCount === 1 ? 'transação' : 'transações' }}
                </div>
              </div>
            </div>

            <!-- Despesas Pagas -->
            <div class="col-12 col-sm-4">
              <div class="stat-item stat-negative">
                <div class="stat-label">
                  <q-icon name="arrow_downward" size="18px" class="q-mr-xs" />
                  Despesas Pagas
                </div>
                <div class="stat-value text-negative">
                  {{ formatCurrency(totalPaid) }}
                </div>
                <div class="stat-meta">
                  {{ paidCount }} {{ paidCount === 1 ? 'transação' : 'transações' }}
                </div>
              </div>
            </div>

            <!-- Saldo Efetivado -->
            <div class="col-12 col-sm-4">
              <div class="stat-item stat-balance" :class="'stat-balance-' + effectiveBalanceColor">
                <div class="stat-label">
                  <q-icon name="account_balance" size="18px" class="q-mr-xs" />
                  Saldo Atual
                </div>
                <div class="stat-value" :class="'text-' + effectiveBalanceColor + '-9'">
                  {{ formatCurrency(effectiveBalance) }}
                </div>
                <div class="stat-meta" :class="'text-' + effectiveBalanceColor + '-7'">
                  <q-icon name="info_outline" size="14px" class="q-mr-xs" />
                  {{ effectiveBalance >= 0 ? 'Superávit' : 'Déficit' }}
                </div>
              </div>
            </div>

          </div>
        </q-card-section>

        <!-- Alerta se houver déficit -->
        <q-card-section v-if="effectiveBalance < 0" class="q-pt-none">
          <q-banner dense class="bg-red-1 text-red-9" rounded>
            <template v-slot:avatar>
              <q-icon name="warning" color="red-7" />
            </template>
            Atenção: Você gastou {{ formatCurrency(Math.abs(effectiveBalance)) }} a mais do que recebeu
          </q-banner>
        </q-card-section>

      </q-card>

      <!-- ==========================================================================
      VISÃO COMPLETA - INCLUINDO PENDÊNCIAS
      ========================================================================== -->
      
      <q-card flat bordered class="financial-summary-card q-mb-lg">
        
        <!-- Header com Título -->
        <q-card-section class="summary-header bg-blue-1">
          <div class="row items-center">
            <div class="col">
              <div class="text-h6 text-weight-bold text-blue-9">
                Visão Completa do Período
              </div>
              <div class="text-caption text-blue-8">
                Incluindo transações pendentes de pagamento/recebimento
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- Grid de Valores - 2 colunas -->
        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            
            <!-- Total de Receitas -->
            <div class="col-12 col-sm-6">
              <div class="stat-item-complete">
                <div class="stat-complete-header">
                  <q-icon name="trending_up" size="20px" color="green-7" class="q-mr-xs" />
                  <span class="text-subtitle2 text-weight-medium">Total de Receitas</span>
                </div>
                <div class="stat-complete-value text-green-8">
                  {{ formatCurrency(transactionStore.stats.totalIncome) }}
                </div>
                <div class="stat-complete-breakdown">
                  <div class="breakdown-row">
                    <span>✓ Recebido</span>
                    <span class="text-weight-medium">{{ formatCurrency(totalReceived) }}</span>
                  </div>
                  <div class="breakdown-row" v-if="pendingIncome > 0">
                    <span class="text-orange-8">⏳ A receber</span>
                    <span class="text-weight-medium text-orange-8">{{ formatCurrency(pendingIncome) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total de Despesas -->
            <div class="col-12 col-sm-6">
              <div class="stat-item-complete">
                <div class="stat-complete-header">
                  <q-icon name="trending_down" size="20px" color="red-7" class="q-mr-xs" />
                  <span class="text-subtitle2 text-weight-medium">Total de Despesas</span>
                </div>
                <div class="stat-complete-value text-red-8">
                  {{ formatCurrency(transactionStore.stats.totalExpense) }}
                </div>
                <div class="stat-complete-breakdown">
                  <div class="breakdown-row">
                    <span>✓ Pago</span>
                    <span class="text-weight-medium">{{ formatCurrency(totalPaid) }}</span>
                  </div>
                  <div class="breakdown-row" v-if="pendingExpense > 0">
                    <span class="text-orange-8">⏳ A pagar</span>
                    <span class="text-weight-medium text-orange-8">{{ formatCurrency(pendingExpense) }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </q-card-section>

        <q-separator />

        <!-- Saldo Previsto -->
        <q-card-section class="saldo-previsto-section">
          <div class="row items-center">
            <div class="col-auto">
              <q-icon 
                :name="transactionStore.stats.balance >= 0 ? 'check_circle' : 'warning'" 
                :color="transactionStore.stats.balance >= 0 ? 'green-7' : 'orange-7'"
                size="32px"
              />
            </div>
            <div class="col">
              <div class="text-caption text-grey-7">
                Saldo Previsto (considerando tudo)
              </div>
              <div class="text-h5 text-weight-bold" :class="balanceColor">
                {{ formatCurrency(transactionStore.stats.balance) }}
              </div>
            </div>
            <div class="col-auto" v-if="pendingIncome > 0 || pendingExpense > 0">
              <q-chip 
                dense 
                :color="transactionStore.stats.balance >= 0 ? 'green-1' : 'orange-1'"
                :text-color="transactionStore.stats.balance >= 0 ? 'green-9' : 'orange-9'"
              >
                <q-icon name="schedule" size="16px" class="q-mr-xs" />
                Há pendências
              </q-chip>
            </div>
          </div>
        </q-card-section>

      </q-card>

      <!-- ==========================================================================
      LISTAS DE TRANSAÇÕES SEPARADAS (RECEITAS E DESPESAS)
      ========================================================================== -->
      
      <!-- Loading State -->
      <div v-if="transactionStore.isLoading" class="text-center q-py-xl q-mb-lg">
        <q-card flat bordered>
          <q-card-section class="q-py-xl">
            <q-spinner color="primary" size="3rem" />
            <p class="text-h6 q-mt-md">
              Carregando transações...
            </p>
          </q-card-section>
        </q-card>
      </div>

      <!-- Empty State -->
      <div v-else-if="transactionStore.transactions.length === 0" class="text-center q-py-xl q-mb-lg">
        <q-card flat bordered>
          <q-card-section class="text-center q-py-xl">
            <q-icon name="receipt_long" size="4rem" color="grey-4" />
            <h6 class="text-h6 q-mt-md">
              {{ hasActiveFilters ? 'Nenhuma transação encontrada' : 'Nenhuma transação cadastrada' }}
            </h6>
            <p class="text-caption q-mb-lg">
              {{ hasActiveFilters ? 'Tente alterar os filtros de busca' : 'Comece adicionando sua primeira transação' }}
            </p>
            <q-btn
              v-if="!hasActiveFilters"
              label="Adicionar Transação"
              color="primary"
              outline
              no-caps
              @click="openTransactionForm()"
            />
            <q-btn
              v-else
              label="Limpar Filtros"
              color="grey-6"
              outline
              no-caps
              @click="clearAllFilters"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- ==========================================================================
      LISTAS DE TRANSAÇÕES - DESIGN LIMPO E MODERNO
      ========================================================================== -->
      
      <div v-else class="row q-col-gutter-md q-mb-lg">
        
        <!-- ==========================================================================
        RECEITAS (INCOME)
        ========================================================================== -->
        <div class="col-12" :class="expenseTransactions.length > 0 ? 'col-md-6' : ''">
          <q-card class="transactions-list-card" flat bordered v-if="incomeTransactions.length > 0">
            
            <!-- Header -->
            <q-card-section class="list-header bg-green-1">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-subtitle1 text-weight-bold text-green-9">
                    <q-icon name="arrow_upward" size="18px" class="q-mr-xs" />
                    Receitas
                  </div>
                  <div class="text-caption text-green-8">
                    {{ incomeTransactions.length }} {{ incomeTransactions.length === 1 ? 'transação' : 'transações' }}
                  </div>
                </div>
                <div class="col-auto">
                  <div class="text-h6 text-weight-bold text-green-9">
                    {{ formatCurrency(incomeTotal) }}
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <!-- Lista de Transações -->
            <q-list>
              <q-item
                v-for="transaction in incomeTransactions"
                :key="transaction.id"
                class="transaction-item-modern"
                clickable
                @click="viewTransaction(transaction)"
              >
                <!-- Indicador de cor -->
                <div class="transaction-indicator transaction-indicator-positive"></div>

                <!-- Ícone pequeno -->
                <q-item-section avatar style="min-width: 40px; padding-right: 12px;">
                  <div class="transaction-icon transaction-icon-positive">
                    <q-icon name="arrow_upward" size="16px" />
                  </div>
                </q-item-section>

                <!-- Informações principais -->
                <q-item-section>
                  <q-item-label class="text-body1 text-weight-medium">
                    {{ transaction.description }}
                  </q-item-label>
                  <q-item-label caption class="row items-center q-gutter-xs q-mt-xs">
                    <span class="transaction-meta">
                      <q-icon name="label" size="14px" />
                      {{ transaction.category }}
                    </span>
                    <span class="transaction-meta-dot">•</span>
                    <span class="transaction-meta">
                      <q-icon name="calendar_today" size="14px" />
                      {{ formatBRDateSafe(transaction.date) }}
                    </span>
                    <span v-if="transaction.paid && transaction.paid_at" class="transaction-meta-dot">•</span>
                    <span v-if="transaction.paid && transaction.paid_at" class="transaction-meta text-teal-8">
                      Recebido em {{ formatBRDate(transaction.paid_at) }}
                    </span>
                  </q-item-label>
                </q-item-section>

                <!-- Valor e Status -->
                <q-item-section side class="transaction-value-section">
                  <div class="text-right">
                    <div class="text-h6 text-weight-bold text-green-9">
                      +{{ formatCurrency(transaction.amount) }}
                    </div>
                    <div class="transaction-status q-mt-xs">
                      <q-chip 
                        :label="transaction.paid ? 'Recebido' : 'A receber'"
                        size="sm"
                        :color="transaction.paid ? 'teal' : 'orange'"
                        :text-color="transaction.paid ? 'white' : 'white'"
                        :icon="transaction.paid ? 'check_circle' : 'schedule'"
                        dense
                      />
                    </div>
                  </div>
                </q-item-section>

                <!-- Toggle -->
                <q-item-section side style="padding-left: 8px;">
                  <q-toggle
                    v-model="transaction.paid"
                    color="teal"
                    size="sm"
                    @update:model-value="val => onTogglePaid(transaction, val)"
                    @click.stop
                  />
                </q-item-section>

                <!-- Menu de ações -->
                <q-item-section side style="padding-left: 4px;">
                  <q-btn
                    icon="more_vert"
                    flat
                    round
                    dense
                    size="sm"
                    color="grey-7"
                    @click.stop
                  >
                    <q-menu>
                      <q-list dense style="min-width: 150px">
                        <q-item clickable v-close-popup @click="editTransaction(transaction)">
                          <q-item-section avatar style="min-width: 32px">
                            <q-icon name="edit" size="18px" color="blue-6" />
                          </q-item-section>
                          <q-item-section>Editar</q-item-section>
                        </q-item>
                        
                        <q-item clickable v-close-popup @click="duplicateTransaction(transaction)">
                          <q-item-section avatar style="min-width: 32px">
                            <q-icon name="content_copy" size="18px" color="green-6" />
                          </q-item-section>
                          <q-item-section>Duplicar</q-item-section>
                        </q-item>
                        
                        <q-separator />
                        
                        <q-item clickable v-close-popup @click="confirmDeleteTransaction(transaction)">
                          <q-item-section avatar style="min-width: 32px">
                            <q-icon name="delete" size="18px" color="red-6" />
                          </q-item-section>
                          <q-item-section class="text-red-6">Excluir</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>

        <!-- ==========================================================================
        DESPESAS (EXPENSE)
        ========================================================================== -->
        <div class="col-12" :class="incomeTransactions.length > 0 ? 'col-md-6' : ''">
          <q-card class="transactions-list-card" flat bordered v-if="expenseTransactions.length > 0">
            
            <!-- Header -->
            <q-card-section class="list-header bg-red-1">
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-subtitle1 text-weight-bold text-red-9">
                    <q-icon name="arrow_downward" size="18px" class="q-mr-xs" />
                    Despesas
                  </div>
                  <div class="text-caption text-red-8">
                    {{ expenseTransactions.length }} {{ expenseTransactions.length === 1 ? 'transação' : 'transações' }}
                  </div>
                </div>
                <div class="col-auto">
                  <div class="text-h6 text-weight-bold text-red-9">
                    {{ formatCurrency(expenseTotal) }}
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <!-- Lista de Transações -->
            <q-list>
              <q-item
                v-for="transaction in expenseTransactions"
                :key="transaction.id"
                class="transaction-item-modern"
                clickable
                @click="viewTransaction(transaction)"
              >
                <!-- Indicador de cor -->
                <div class="transaction-indicator transaction-indicator-negative"></div>

                <!-- Ícone pequeno -->
                <q-item-section avatar style="min-width: 40px; padding-right: 12px;">
                  <div class="transaction-icon transaction-icon-negative">
                    <q-icon name="arrow_downward" size="16px" />
                  </div>
                </q-item-section>

                <!-- Informações principais -->
                <q-item-section>
                  <q-item-label class="text-body1 text-weight-medium">
                    {{ transaction.description }}
                  </q-item-label>
                  <q-item-label caption class="row items-center q-gutter-xs q-mt-xs">
                    <span class="transaction-meta">
                      <q-icon name="label" size="14px" />
                      {{ transaction.category }}
                    </span>
                    <span class="transaction-meta-dot">•</span>
                    <span class="transaction-meta">
                      <q-icon name="calendar_today" size="14px" />
                      {{ formatBRDateSafe(transaction.date) }}
                    </span>
                    <span v-if="transaction.paid && transaction.paid_at" class="transaction-meta-dot">•</span>
                    <span v-if="transaction.paid && transaction.paid_at" class="transaction-meta text-teal-8">
                      Pago em {{ formatBRDate(transaction.paid_at) }}
                    </span>
                  </q-item-label>
                </q-item-section>

                <!-- Valor e Status -->
                <q-item-section side class="transaction-value-section">
                  <div class="text-right">
                    <div class="text-h6 text-weight-bold text-red-9">
                      -{{ formatCurrency(transaction.amount) }}
                    </div>
                    <div class="transaction-status q-mt-xs">
                      <q-chip 
                        :label="transaction.paid ? 'Pago' : 'Em aberto'"
                        size="sm"
                        :color="transaction.paid ? 'teal' : 'orange'"
                        :text-color="transaction.paid ? 'white' : 'white'"
                        :icon="transaction.paid ? 'check_circle' : 'schedule'"
                        dense
                      />
                    </div>
                  </div>
                </q-item-section>

                <!-- Toggle -->
                <q-item-section side style="padding-left: 8px;">
                  <q-toggle
                    v-model="transaction.paid"
                    color="teal"
                    size="sm"
                    @update:model-value="val => onTogglePaid(transaction, val)"
                    @click.stop
                  />
                </q-item-section>

                <!-- Menu de ações -->
                <q-item-section side style="padding-left: 4px;">
                  <q-btn
                    icon="more_vert"
                    flat
                    round
                    dense
                    size="sm"
                    color="grey-7"
                    @click.stop
                  >
                    <q-menu>
                      <q-list dense style="min-width: 150px">
                        <q-item clickable v-close-popup @click="editTransaction(transaction)">
                          <q-item-section avatar style="min-width: 32px">
                            <q-icon name="edit" size="18px" color="blue-6" />
                          </q-item-section>
                          <q-item-section>Editar</q-item-section>
                        </q-item>
                        
                        <q-item clickable v-close-popup @click="duplicateTransaction(transaction)">
                          <q-item-section avatar style="min-width: 32px">
                            <q-icon name="content_copy" size="18px" color="green-6" />
                          </q-item-section>
                          <q-item-section>Duplicar</q-item-section>
                        </q-item>
                        
                        <q-separator />
                        
                        <q-item clickable v-close-popup @click="confirmDeleteTransaction(transaction)">
                          <q-item-section avatar style="min-width: 32px">
                            <q-icon name="delete" size="18px" color="red-6" />
                          </q-item-section>
                          <q-item-section class="text-red-6">Excluir</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>

      <!-- ==========================================================================
      PAGINAÇÃO
      ========================================================================== -->
      <div v-if="transactionStore.pagination.totalPages > 1" class="q-mb-lg">
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="col-auto">
                <p class="text-caption">
                  {{ getPaginationLabel() }}
                </p>
              </div>
              
              <div class="col-auto">
                <q-pagination
                  v-model="currentPage"
                  :max="transactionStore.pagination.totalPages"
                  :max-pages="5"
                  direction-links
                  boundary-links
                  color="primary"
                  @update:model-value="changePage"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- ==========================================================================
    DIALOG DE TRANSAÇÃO (CRIAR/EDITAR)
    ========================================================================== -->
    <q-dialog 
      v-model="showTransactionDialog" 
      persistent 
      transition-show="slide-up" 
      transition-hide="slide-down"
    >
      <TransactionForm
        :transaction="selectedTransaction"
        :mode="dialogMode"
        @saved="handleTransactionSaved"
        @cancelled="closeTransactionDialog"
        @switch-edit="switchToEditFromView"
      />
    </q-dialog>

    <!-- ==========================================================================
    DIALOG DE CONFIRMAÇÃO DE EXCLUSÃO
    ========================================================================== -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red-6" text-color="white" />
          <span class="q-ml-sm text-h6">Confirmar Exclusão</span>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>Tem certeza que deseja excluir esta transação?</p>
          <p class="text-weight-medium">
            {{ transactionToDelete?.description }}
          </p>
          <p class="text-caption">
            Esta ação não pode ser desfeita.
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="grey-6"
            v-close-popup
          />
          <q-btn
            color="negative"
            label="Excluir"
            icon="delete"
            @click="deleteTransaction"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { endOfMonth, format, isAfter, startOfMonth } from 'date-fns'
import { useQuasar } from 'quasar'
import MonthNavigator from 'src/components/MonthNavigator.vue'
import PeriodFilter from 'src/components/PeriodFilter.vue'
import TransactionForm from 'src/components/TransactionForm.vue'
import { useCurrency } from 'src/composables/useCurrency'
import { useDate } from 'src/composables/useDate'
import { useNotifications } from 'src/composables/useNotifications'
import { useTransactionStore } from 'src/stores/transactions'
import { computed, onMounted, ref, watch } from 'vue'

// ==========================================================================
// COMPOSABLES E STORES
// ==========================================================================
const transactionStore = useTransactionStore()
const $q = useQuasar()
const { formatCurrency } = useCurrency()
const { formatDate, toISODate } = useDate()
const { notifySuccess, notifyError } = useNotifications()

// ==========================================================================
// ESTADO REATIVO
// ==========================================================================
const showTransactionDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedTransaction = ref(null)
const transactionToDelete = ref(null)
const dialogMode = ref('create') // 'create' | 'edit' | 'view'
const currentPage = ref(1)
const currentMonth = ref(new Date()) // Mês atual sendo visualizado no MonthNavigator
const isUsingAdvancedFilter = ref(false) // Flag para indicar se está usando filtro avançado

// Filtros
const filters = ref({
  search: '',
  type: '',
  category: '',
  startDate: '',
  endDate: '',
  paid: '' // '' | true | false (emit-value)
})

// Opções para selects
const typeOptions = [
  { label: 'Receita', value: 'income' },
  { label: 'Despesa', value: 'expense' }
]

const categoryOptions = ref([])
const paidOptions = [
  { label: 'Todos', value: '' },
  { label: 'Pago', value: true },
  { label: 'Em aberto', value: false }
]

// ==========================================================================
// COMPUTED PROPERTIES
// ==========================================================================

/**
 * Verifica se o mês atual sendo visualizado é futuro
 */
const isFutureMonth = computed(() => {
  if (!currentMonth.value) return false
  const now = new Date()
  const currentStart = startOfMonth(currentMonth.value)
  const nowStart = startOfMonth(now)
  return isAfter(currentStart, nowStart)
})

/**
 * Verifica se há filtros ativos
 */
const hasActiveFilters = computed(() => {
  return transactionStore.hasActiveFilters
})

/**
 * Cor do saldo baseada no valor
 */
const balanceColor = computed(() => {
  const balance = transactionStore.stats.balance
  if (balance > 0) return 'text-green-7'
  if (balance < 0) return 'text-red-7'
  return 'text-grey-7'
})

/**
 * Calcula o total de receitas já recebidas (status PAGO = true)
 */
const totalReceived = computed(() => {
  return transactionStore.transactions
    .filter(t => t.type === 'income' && t.paid === true)
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
})

/**
 * Conta quantas receitas foram recebidas
 */
const receivedCount = computed(() => {
  return transactionStore.transactions
    .filter(t => t.type === 'income' && t.paid === true)
    .length
})

/**
 * Calcula o total de despesas já pagas (status PAGO = true)
 */
const totalPaid = computed(() => {
  return transactionStore.transactions
    .filter(t => t.type === 'expense' && t.paid === true)
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
})

/**
 * Conta quantas despesas foram pagas
 */
const paidCount = computed(() => {
  return transactionStore.transactions
    .filter(t => t.type === 'expense' && t.paid === true)
    .length
})

/**
 * Calcula receitas pendentes (não recebidas)
 */
const pendingIncome = computed(() => {
  return transactionStore.transactions
    .filter(t => t.type === 'income' && t.paid === false)
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
})

/**
 * Calcula despesas pendentes (não pagas)
 */
const pendingExpense = computed(() => {
  return transactionStore.transactions
    .filter(t => t.type === 'expense' && t.paid === false)
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
})

/**
 * Calcula o saldo efetivado (apenas transações pagas/recebidas)
 */
const effectiveBalance = computed(() => {
  return totalReceived.value - totalPaid.value
})

/**
 * Cor do saldo efetivado
 */
const effectiveBalanceColor = computed(() => {
  if (effectiveBalance.value > 0) return 'green'
  if (effectiveBalance.value < 0) return 'red'
  return 'grey'
})

/**
 * Ícone do saldo efetivado
 */
const effectiveBalanceIcon = computed(() => {
  if (effectiveBalance.value > 0) return 'trending_up'
  if (effectiveBalance.value < 0) return 'trending_down'
  return 'remove'
})

/**
 * Mensagem explicativa do saldo efetivado
 */
const effectiveBalanceMessage = computed(() => {
  const abs = Math.abs(effectiveBalance.value)
  if (effectiveBalance.value > 0) {
    return `✅ Você tem R$ ${abs.toFixed(2)} a mais do que gastou`
  }
  if (effectiveBalance.value < 0) {
    return `⚠️ Você gastou R$ ${abs.toFixed(2)} a mais do que recebeu`
  }
  return '✅ Suas receitas e despesas estão equilibradas'
})

/**
 * Ícone do saldo total
 */
const totalBalanceIcon = computed(() => {
  const balance = transactionStore.stats.balance
  if (balance > 0) return 'account_balance_wallet'
  if (balance < 0) return 'warning'
  return 'check_circle'
})

/**
 * Mensagem explicativa do saldo total
 */
const totalBalanceMessage = computed(() => {
  const messages = []
  
  if (pendingIncome.value > 0) {
    messages.push(`R$ ${pendingIncome.value.toFixed(2)} em receitas pendentes`)
  }
  
  if (pendingExpense.value > 0) {
    messages.push(`R$ ${pendingExpense.value.toFixed(2)} em despesas pendentes`)
  }
  
  if (messages.length === 0) {
    return '✅ Todas as transações foram efetivadas'
  }
  
  return `💡 Você tem ${messages.join(' e ')}`
})

// ==========================================================================
// COMPUTED PROPERTIES PARA LISTAS SEPARADAS
// ==========================================================================

/**
 * Filtra apenas as transações de RECEITA (income)
 */
const incomeTransactions = computed(() => {
  return transactionStore.transactions.filter(t => t.type === 'income')
})

/**
 * Filtra apenas as transações de DESPESA (expense)
 */
const expenseTransactions = computed(() => {
  return transactionStore.transactions.filter(t => t.type === 'expense')
})

/**
 * Calcula o total de TODAS as receitas (pagas + pendentes)
 */
const incomeTotal = computed(() => {
  return incomeTransactions.value
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
})

/**
 * Calcula o total de TODAS as despesas (pagas + pendentes)
 */
const expenseTotal = computed(() => {
  return expenseTransactions.value
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
})

// ==========================================================================
// MÉTODOS
// ==========================================================================

/**
 * Carrega dados iniciais
 */
const loadInitialData = async () => {
  
  try {
    // Carrega categorias
    transactionStore.loadCategories()
    categoryOptions.value = transactionStore.categories
    
    // SEMPRE inicializa com o mês atual ao entrar na tela
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    
    // Define período para o mês atual
    if (!filters.value.startDate && !filters.value.endDate) {
      filters.value.startDate = format(monthStart, 'yyyy-MM-dd')
      filters.value.endDate = format(monthEnd, 'yyyy-MM-dd')
      
      // Atualiza currentMonth para sincronizar com MonthNavigator
      currentMonth.value = now
      
      // Limpa preferência anterior para garantir que sempre inicie no mês atual
      try {
        localStorage.removeItem('transactions-month')
      } catch (error) {
        console.error('Erro ao limpar localStorage:', error)
      }
    }

    // Carrega transações já com o filtro de mês aplicado
    await applyFilters()
    
    // Carrega estatísticas
    await transactionStore.fetchStats({
      startDate: filters.value.startDate,
      endDate: filters.value.endDate
    })
    
  } catch (error) {
    notifyError('Erro ao carregar transações')
  }
}

/**
 * Aplica filtros
 */
const applyFilters = async () => {
  
  try {
    await transactionStore.applyFilters({
      search: filters.value.search,
      type: filters.value.type,
      category: filters.value.category,
      startDate: filters.value.startDate,
      endDate: filters.value.endDate,
      paid: filters.value.paid
    })
    
    // Atualiza estatísticas com os filtros
    await transactionStore.fetchStats({
      startDate: filters.value.startDate,
      endDate: filters.value.endDate
    })
    
  } catch (error) {
    notifyError('Erro ao filtrar transações')
  }
}

/**
 * Limpa todos os filtros
 */
const clearAllFilters = async () => {
  
  const { start, end } = getCurrentMonthRange()
  filters.value = {
    search: '',
    type: '',
    category: '',
    startDate: start,
    endDate: end,
    paid: ''
  }
  
  await transactionStore.applyFilters({
    search: '', type: '', category: '', startDate: start, endDate: end, paid: ''
  })
  await transactionStore.fetchStats({ startDate: start, endDate: end })
}

/**
 * Handler para mudança de mês no MonthNavigator
 */
const handleMonthChange = async (range) => {
  
  // Desativa filtro avançado quando usa navegação simples
  isUsingAdvancedFilter.value = false
  
  // Atualiza o mês atual
  currentMonth.value = new Date(range.startDate)
  
  // Atualiza os filtros de data
  filters.value.startDate = range.startDate || ''
  filters.value.endDate = range.endDate || ''
  
  // Aplica os filtros com o novo período
  await applyFilters()
}

/**
 * Handler para mudança de período no filtro avançado
 */
const handleAdvancedPeriodChange = async (range) => {
  
  // Ativa flag de filtro avançado
  isUsingAdvancedFilter.value = true
  
  // Atualiza os filtros de data
  filters.value.startDate = range.startDate || ''
  filters.value.endDate = range.endDate || ''
  
  // Aplica os filtros com o novo período
  await applyFilters()
}

/**
 * Abre formulário de transação
 */
const openTransactionForm = (transaction = null) => {
  
  selectedTransaction.value = transaction
  dialogMode.value = transaction ? 'edit' : 'create'
  showTransactionDialog.value = true
}

/**
 * Visualiza transação
 */
const viewTransaction = (transaction) => {
  
  selectedTransaction.value = transaction
  dialogMode.value = 'view'
  showTransactionDialog.value = true
}

/**
 * Edita transação
 */
const editTransaction = (transaction) => {
  
  selectedTransaction.value = transaction
  dialogMode.value = 'edit'
  showTransactionDialog.value = true
}

/**
 * Duplica transação
 */
const duplicateTransaction = (transaction) => {
  
  // Cria cópia sem ID para nova transação
  const duplicated = { ...transaction }
  delete duplicated.id
  duplicated.description = `${duplicated.description} (Cópia)`
  
  selectedTransaction.value = duplicated
  dialogMode.value = 'create'
  showTransactionDialog.value = true
}

/**
 * Marca transação como paga/não paga
 */
const onTogglePaid = async (transaction, val) => {
  try {
    let paidAt = null
    if (val) {
      const decision = await new Promise((resolve) => {
        $q.dialog({
          title: transaction.type === 'income' ? 'Confirmar recebimento' : 'Confirmar pagamento',
          message: transaction.type === 'income' ? 'Deseja registrar como recebido com a data de hoje?' : 'Deseja registrar como pago com a data de hoje?',
          ok: 'Hoje',
          cancel: 'Outro dia'
        }).onOk(() => resolve({ today: true }))
          .onCancel(() => resolve({ today: false }))
          .onDismiss(() => resolve(null))
      })
      if (!decision) { transaction.paid = !val; return }
      if (decision.today) {
        // Mesmo formato usado no modal: YYYY-MM-DD
        paidAt = toISODate(new Date())
      } else {
        const res = await new Promise((resolve) => {
          $q.dialog({
            title: transaction.type === 'income' ? 'Data de recebimento' : 'Data de pagamento',
            message: 'Informe a data (DD/MM/AAAA):',
            prompt: { model: formatBRDate(new Date()), type: 'text' },
            cancel: true,
            ok: 'Registrar'
          }).onOk((v) => resolve(v))
            .onCancel(() => resolve(null))
            .onDismiss(() => resolve(null))
        })
        if (!res) { transaction.paid = !val; return }
        // Mesmo formato do modal: YYYY-MM-DD
        paidAt = toISOFromBR(res)
      }
    }
    await transactionStore.markPaid(transaction.id, !!val, paidAt)
    notifySuccess(
      val
        ? (transaction.type === 'income' ? 'Transação marcada como recebida' : 'Transação marcada como paga')
        : (transaction.type === 'income' ? 'Recebimento desmarcado' : 'Pagamento desmarcado')
    )
  } catch (e) {
    const status = e?.response?.status
    const data = e?.response?.data
    console.error('[UI] onTogglePaid failed', { status, data, id: transaction?.id, val })
    notifyError('Falha ao atualizar status de pagamento')
    transaction.paid = !val
  }
}

/**
 * Confirma exclusão de transação
 */
const confirmDeleteTransaction = (transaction) => {
  // Detecta se é parcela: series_id, campos de total ou padrão na descrição (n/total)
  const isInstallment = !!(
    transaction.series_id ||
    transaction.installment_total > 1 ||
    transaction.installmentTotal > 1 ||
    (/\(\d+\/\d+\)\s*$/.test(transaction.description || ''))
  )

  if (isInstallment) {
    $q.dialog({
      title: 'Excluir transação parcelada',
      message: 'Deseja excluir apenas esta parcela ou todas as próximas parcelas desta série?',
      options: {
        type: 'radio',
        model: 'single',
        items: [
          { label: 'Apenas esta parcela', value: 'single' },
          { label: 'Todas as próximas (a partir desta)', value: 'forward' }
        ]
      },
      cancel: true,
      ok: 'Continuar'
    }).onOk(async (choice) => {
      try {
        if (choice === 'forward') {
          if (transaction.series_id) {
            await transactionStore.deleteSeriesForward(transaction.series_id, transaction.date)
            notifySuccess('Parcelas futuras excluídas com sucesso')
          } else {
            // Sem series_id: tenta excluir futuras com base no padrão da descrição
            const base = (transaction.description || '').replace(/\s*\(\d+\/\d+\)\s*$/, '').trim()
            const totalMatch = /\((\d+)\/(\d+)\)\s*$/.exec(transaction.description || '')
            const total = totalMatch ? Number(totalMatch[2]) : null
            const expr = total
              ? new RegExp('^' + escapeRegex(base) + ' \\((?:\\d+)\/' + total + '\\)\\s*$')
              : new RegExp('^' + escapeRegex(base) + ' \\((?:\\d+)\/\\d+\\)\\s*$')
            const targets = (transactionStore.transactions || [])
              .filter(t => expr.test(t.description || '') && (t.date >= transaction.date))
              .map(t => t.id)
            for (const id of targets) {
              await transactionStore.deleteTransaction(id)
            }
            notifySuccess('Parcelas futuras excluídas com sucesso')
          }
        } else {
          await transactionStore.deleteTransaction(transaction.id)
          notifySuccess('Transação excluída com sucesso')
        }
        // Atualiza lista/estatísticas
        await transactionStore.fetchTransactions()
        await transactionStore.fetchStats()
      } catch (e) {
        notifyError('Erro ao excluir transação')
      }
    })
  } else {
    // Fluxo normal
    transactionToDelete.value = transaction
    showDeleteDialog.value = true
  }
}

function escapeRegex(s) {
  return (s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Deleta transação
 */
const deleteTransaction = async () => {
  if (!transactionToDelete.value) return
  
  try {
    await transactionStore.deleteTransaction(transactionToDelete.value.id)
    
    notifySuccess('Transação excluída com sucesso')
    showDeleteDialog.value = false
    transactionToDelete.value = null
    
    // Atualiza estatísticas
    await transactionStore.fetchStats()
    
  } catch (error) {
    notifyError('Erro ao excluir transação')
  }
}

/**
 * Fecha dialog de transação
 */
const closeTransactionDialog = () => {
  showTransactionDialog.value = false
  selectedTransaction.value = null
  dialogMode.value = 'create'
}

/**
 * Troca para modo edição dentro do modal (emitido pelo TransactionForm)
 */
const switchToEditFromView = () => {
  dialogMode.value = 'edit'
}

/**
 * Manipula transação salva
 */
const handleTransactionSaved = async () => {
  
  closeTransactionDialog()
  
  // Recarrega dados
  await transactionStore.fetchTransactions()
  await transactionStore.fetchStats()
}

/**
 * Muda página
 */
const changePage = async (page) => {
  
  currentPage.value = page
  
  await transactionStore.fetchTransactions({ page })
}

/**
 * Obter label do tipo
 */
const getTypeLabel = (type) => {
  const option = typeOptions.find(opt => opt.value === type)
  return option ? option.label : type
}

/**
 * Obter label do período de datas
 */
const getDateRangeLabel = () => {
  const { startDate, endDate } = filters.value
  
  if (startDate && endDate) {
    return `${formatDate(startDate, 'short')} - ${formatDate(endDate, 'short')}`
  } else if (startDate) {
    return `A partir de ${formatDate(startDate, 'short')}`
  } else if (endDate) {
    return `Até ${formatDate(endDate, 'short')}`
  }
  
  return ''
}

/**
 * Obter label da paginação
 */
const getPaginationLabel = () => {
  const { page, limit, total } = transactionStore.pagination
  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)
  
  return `${start}-${end} de ${total} transações`
}

function toISOFromBR(s) {
  if (!s) return ''
  const parts = s.replace(/\s/g,'').split('/')
  if (parts.length !== 3) return s
  const [dd,mm,yyyy] = parts
  return `${yyyy}-${mm}-${dd}`
}

// Helpers para exibição e prompt em BR
function pad2(n) { return String(n).padStart(2,'0') }
// Formata data sem aplicar timezone quando vier como 'YYYY-MM-DD'
function formatBRDateSafe(input) {
  if (!input) return ''
  if (typeof input === 'string') {
    // 'YYYY-MM-DD' ou 'YYYY-MM-DDTHH:MM:SSZ'
    const m = input.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (m) {
      const [, y, mth, d] = m
      return `${d}/${mth}/${y}`
    }
  }
  const dt = (input instanceof Date) ? input : new Date(input)
  if (isNaN(dt)) return ''
  return `${pad2(dt.getDate())}/${pad2(dt.getMonth()+1)}/${dt.getFullYear()}`
}
// manter compat com usos antigos
const formatBRDate = formatBRDateSafe

// (Sem uso: mantemos somente BR <-> ISO (YYYY-MM-DD) para alinhar com o modal)

/**
 * Retorna o primeiro e último dia do mês atual em YYYY-MM-DD
 */
function getCurrentMonthRange() {
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return { start: toISODate(startDate), end: toISODate(endDate) }
}

// ==========================================================================
// WATCHERS
// ==========================================================================
watch(
  () => transactionStore.pagination.page,
  (newPage) => {
    currentPage.value = newPage
  }
)

// ==========================================================================
// LIFECYCLE
// ==========================================================================
onMounted(() => {
  loadInitialData()
})
</script>

<style lang="scss" scoped>
// ==========================================================================
// HEADER MODERNO E COMPACTO
// ==========================================================================
.page-header-modern {
  animation: fadeIn 0.4s ease;
  
  .header-title-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .page-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    color: #1f2937;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
  
  .total-transactions-badge {
    font-size: 0.75rem;
    padding: 4px 10px;
    font-weight: 600;
    border-radius: 12px;
  }
  
  .new-transaction-btn {
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.9375rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.25);
    
    &:hover {
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.35);
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

// ==========================================================================
// FILTROS AVANÇADOS - DESIGN LIMPO E MODERNO
// ==========================================================================
.filters-container {
  animation: fadeIn 0.5s ease;
}

.advanced-filters-modern {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    border-color: rgba(25, 118, 210, 0.25);
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.08);
  }
  
  .filters-header {
    padding: 12px 16px;
    
    .filter-icon-wrapper {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: transform 0.3s ease;
    }
    
    &:hover .filter-icon-wrapper {
      transform: scale(1.05);
    }
  }
  
  .filter-label {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1f2937;
    letter-spacing: -0.01em;
  }
  
  .filter-caption {
    font-size: 0.8125rem;
    color: #6b7280;
    margin-top: 2px;
  }
  
  .filters-content {
    background: #fafbfc;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }
  
  .filter-group {
    .filter-group-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      
      .q-icon {
        color: #6b7280;
      }
    }
  }
  
  :deep(.q-field) {
    .q-field__control {
      border-radius: 8px;
    }
    
    .q-field__prepend .q-icon {
      color: #9ca3af;
    }
  }
  
  :deep(.q-btn) {
    border-radius: 8px;
    font-weight: 500;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Mobile adjustments
@media (max-width: 768px) {
  .page-header-modern {
    .row {
      gap: 12px;
    }
    
    .page-title {
      font-size: 1.5rem;
    }
    
    .total-transactions-badge {
      font-size: 0.7rem;
      padding: 3px 8px;
    }
    
    .new-transaction-btn {
      width: 100%;
      justify-content: center;
    }
  }
  
  .advanced-filters-modern {
    .filters-header {
      padding: 10px 12px;
      
      .filter-icon-wrapper {
        width: 32px;
        height: 32px;
      }
    }
    
    .filter-label {
      font-size: 0.875rem;
    }
    
    .filter-caption {
      font-size: 0.75rem;
    }
  }
}

// ==========================================================================
// ESTILOS DA PÁGINA DE TRANSAÇÕES - MOBILE FIRST
// ==========================================================================

.transactions-page {
  /* Mobile-first: padding ULTRA reduzido */
  padding: 0.375rem; /* Muito menor */
  min-height: 100vh;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
}

.page-header {
  padding: 0.5rem 0.125rem; /* Padding menor */
  margin-bottom: 0.5rem;
  
  h1 {
    font-size: 1.25rem; /* Título menor */
    margin: 0;
  }
  
  p {
    font-size: 0.75rem;
    margin-top: 0.125rem;
  }
  
  /* Em mobile, botão ocupa largura total */
  .q-btn {
    width: 100%;
    min-height: var(--touch-target-ideal);
  }
}

// Cards ultra compactos
.filters-card,
.stat-card,
.stat-card-detailed,
.balance-card,
.transactions-card {
  border-radius: 8px; /* Border menor */
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04); /* Sombra menor */
  margin-bottom: 0.5rem; /* Margem menor entre cards */
  
  :deep(.q-card__section) {
    padding: 0.5rem; /* Padding muito reduzido */
  }
}

/* Cabeçalhos de Seção */
.section-header {
  padding: 1rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  
  .text-h5 {
    font-size: 1.25rem;
    margin: 0;
  }
  
  .text-caption {
    font-size: 0.875rem;
  }
  
  /* Seção 1: Fluxo de Caixa Efetivado - Verde/Teal */
  &.section-header-primary {
    background: linear-gradient(135deg, rgba(0, 150, 136, 0.08), rgba(0, 150, 136, 0.04));
    border-left: 5px solid var(--q-teal);
    border: 1px solid rgba(0, 150, 136, 0.15);
    box-shadow: 0 2px 8px rgba(0, 150, 136, 0.08);
  }
  
  /* Seção 2: Visão Completa - Azul */
  &.section-header-secondary {
    background: linear-gradient(135deg, rgba(33, 150, 243, 0.08), rgba(33, 150, 243, 0.04));
    border-left: 5px solid var(--q-blue);
    border: 1px solid rgba(33, 150, 243, 0.15);
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.08);
  }
}

/* Cards de Estatísticas Detalhadas */
.stat-card-detailed {
  transition: all 0.3s ease;
  
  .stat-header {
    display: flex;
    align-items: center;
  }
  
  .stat-value {
    font-size: 1.5rem;
    line-height: 1.2;
  }
  
  .stat-breakdown {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    
    .breakdown-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

/* Cards de Saldo */
.balance-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 1));
  border: 2px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  
  &.effective-balance {
    border-left: 4px solid var(--q-info);
  }
  
  &.total-balance {
    border-left: 4px solid var(--q-primary);
  }
}

/* Filtros em mobile - Design colapsável */
.filters-card {
  margin-bottom: 1rem;
  
  .q-card-section {
    padding: 0.875rem;
  }
  
  /* Inputs com altura adequada para toque */
  :deep(.q-field) {
    margin-bottom: 0.5rem;
    
    .q-field__control {
      min-height: var(--touch-target-ideal);
    }
    
    input, .q-field__native {
      font-size: 0.9375rem; /* 15px - ideal para mobile */
    }
  }
}

// ==========================================================================
// NOVO DESIGN - CARDS FINANCEIROS MODERNOS E LIMPOS
// ==========================================================================

/* Card Principal de Resumo Financeiro */
.financial-summary-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
}

/* Header do Resumo */
.summary-header {
  padding: 1rem 1.25rem !important;
  
  .text-h6 {
    font-size: 1.125rem;
    margin: 0;
    line-height: 1.4;
  }
  
  .text-caption {
    font-size: 0.8125rem;
    line-height: 1.4;
    margin-top: 0.125rem;
  }
}

/* Item de Estatística */
.stat-item {
  padding: 1.25rem;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    background: #f5f5f5;
    transform: translateY(-2px);
  }
  
  .stat-label {
    font-size: 0.75rem;
    color: #666;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
  }
  
  .stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 0.5rem;
  }
  
  .stat-meta {
    font-size: 0.75rem;
    color: #999;
    display: flex;
    align-items: center;
  }
  
  /* Variantes de cor */
  &.stat-positive {
    border-left: 4px solid #4caf50;
    
    .stat-label {
      color: #2e7d32;
    }
  }
  
  &.stat-negative {
    border-left: 4px solid #f44336;
    
    .stat-label {
      color: #c62828;
    }
  }
  
  &.stat-balance {
    border-left: 4px solid #2196f3;
    
    &.stat-balance-green {
      border-left-color: #4caf50;
      background: #f1f8f4;
      
      &:hover {
        background: #e8f5e9;
      }
    }
    
    &.stat-balance-red {
      border-left-color: #f44336;
      background: #fef5f5;
      
      &:hover {
        background: #ffebee;
      }
    }
  }
}

/* Cores de texto */
.text-positive {
  color: #2e7d32 !important;
}

.text-negative {
  color: #c62828 !important;
}

/* Item de Estatística Completa (com breakdown) */
.stat-item-complete {
  padding: 1.25rem;
  border-radius: 8px;
  background: #fafafa;
  height: 100%;
  
  .stat-complete-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    
    .text-subtitle2 {
      color: #666;
      font-size: 0.875rem;
    }
  }
  
  .stat-complete-value {
    font-size: 1.875rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
  }
  
  .stat-complete-breakdown {
    .breakdown-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      font-size: 0.875rem;
      color: #666;
      
      &:first-child {
        border-top: none;
        padding-top: 0;
      }
      
      .text-weight-medium {
        color: #333;
      }
    }
  }
}

/* Seção de Saldo Previsto */
.saldo-previsto-section {
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
  padding: 1.25rem !important;
  
  .text-caption {
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
  }
  
  .text-h5 {
    font-size: 1.5rem;
    line-height: 1.2;
  }
}

// ==========================================================================
// ESTILOS ANTIGOS MANTIDOS PARA COMPATIBILIDADE
// ==========================================================================

/* Cards de Estatísticas */
.stat-card {
  transition: all 0.3s ease;
  padding: 1rem;
  
  .stat-value {
    font-size: 1.375rem;
    font-weight: 600;
    line-height: 1.2;
  }
  
  .stat-label {
    font-size: 0.75rem;
    margin-top: 0.25rem;
    opacity: 0.7;
  }
  
  /* Remover hover em mobile */
  &:hover {
    transform: none;
  }
}

/* Cards de Pagamentos Realizados (Total Pago/Recebido) */
.paid-stat-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  
  &.received-card {
    border-left: 4px solid var(--q-positive);
  }
  
  &.paid-card {
    border-left: 4px solid var(--q-negative);
  }
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  .q-card__section {
    padding: 1.25rem;
  }
  
  .q-avatar {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .text-h5 {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }
  
  .text-caption {
    font-size: 0.75rem;
    letter-spacing: 0.03em;
    font-weight: 500;
  }
}

/* Cards de Receitas e Despesas Separados */
.income-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  border: 1px solid rgba(76, 175, 80, 0.2);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
  overflow: hidden;
  
  .card-header {
    padding: 1rem;
    border-bottom: 1px solid rgba(76, 175, 80, 0.1);
  }
  
  &:hover {
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
    transform: translateY(-2px);
  }
}

.expense-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  border: 1px solid rgba(244, 67, 54, 0.2);
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.1);
  overflow: hidden;
  
  .card-header {
    padding: 1rem;
    border-bottom: 1px solid rgba(244, 67, 54, 0.1);
  }
  
  &:hover {
    box-shadow: 0 4px 16px rgba(244, 67, 54, 0.2);
    transform: translateY(-2px);
  }
}

.income-item,
.expense-item {
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  &:active {
    background-color: rgba(0, 0, 0, 0.04);
  }
}


/* Lista de transações - Otimizada para mobile */
.transactions-card {
  .q-card-section {
    padding: 1rem 0.875rem;
    
    h6 {
      font-size: 1rem;
      margin: 0;
    }
    
    .q-btn {
      font-size: 0.75rem;
      padding: 0.375rem 0.75rem;
    }
  }
}

.transaction-item {
  padding: 0.875rem;
  margin: 0.375rem 0;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  min-height: var(--touch-target-ideal);
  
  /* Avatar menor em mobile */
  .q-avatar {
    width: 40px;
    height: 40px;
    
    .q-icon {
      font-size: 1.25rem;
    }
  }
  
  .q-item-label {
    font-size: 0.875rem;
    
    &.caption {
      font-size: 0.75rem;
    }
  }
  
  /* Chips menores */
  :deep(.q-chip) {
    font-size: 0.65rem;
    height: 20px;
    padding: 0 6px;
  }
  
  /* Valor em destaque */
  .q-item-section.side {
    .text-h6 {
      font-size: 1rem;
    }
    
    .text-caption {
      font-size: 0.7rem;
    }
  }
  
  /* Toggle mais fácil de tocar */
  :deep(.q-toggle) {
    min-width: var(--touch-target-min);
    
    .q-toggle__label {
      font-size: 0.75rem;
    }
  }
  
  /* Botão de ações com área de toque adequada */
  .q-btn {
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
  }
  
  /* Remover hover em touch devices */
  &:hover {
    background-color: rgba(25, 118, 210, 0.02);
  }
  
  /* Active state para feedback tátil */
  &:active {
    background-color: rgba(25, 118, 210, 0.05);
  }
}

/* Paginação mobile */
.q-pagination {
  :deep(.q-btn) {
    min-width: var(--touch-target-min);
    min-height: var(--touch-target-min);
    font-size: 0.875rem;
  }
}

/* Empty States */
.text-center {
  .q-icon {
    opacity: 0.4;
  }
  
  h6 {
    font-size: 1rem;
  }
  
  .q-btn {
    min-height: var(--touch-target-ideal);
    padding: 0.75rem 1.5rem;
  }
}

/* Botão de limpar filtros */
.div-clear-filters {
  display: flex;
  align-items: flex-end;
  
  .btn-clear-filters {
    width: 100%;
    min-height: var(--touch-target-ideal);
  }
}

// ==========================================================================
// TABLET PORTRAIT (600px - 1023px)
// ==========================================================================
@media (min-width: 600px) {
  .transactions-page {
    padding: 1rem;
  }
  
  .page-header {
    .q-btn {
      width: auto;
      min-width: 180px;
    }
  }
  
  .filters-card {
    .q-card-section {
      padding: 1.25rem;
    }
  }
  
  .stat-card {
    padding: 1.25rem;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
  }
  
  .stat-card-detailed {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
  }
  
  .balance-card {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }
  }
  
  .section-header {
    padding: 1rem 0.75rem;
    
    .text-h6 {
      font-size: 1.125rem;
    }
  }
  
  .paid-stat-card {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }
    
    .q-card__section {
      padding: 1.5rem;
    }
    
    .text-h5 {
      font-size: 1.625rem;
    }
  }
  
  .transaction-item {
    padding: 1rem;
    
    .q-avatar {
      width: 48px;
      height: 48px;
    }
    
    .q-item-label {
      font-size: 0.9375rem;
    }
    
    .q-item-section.side {
      .text-h6 {
        font-size: 1.125rem;
      }
    }
  }
}

// ==========================================================================
// TABLET LANDSCAPE / DESKTOP (1024px+)
// ==========================================================================
@media (min-width: 1024px) {
  .transactions-page {
    padding: 1.5rem;
  }
  
  .page-header {
    padding: 1.5rem 0;
    
    h1 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
  
  .filters-card {
    .q-card-section {
      padding: 1.5rem;
    }
    
    :deep(.q-field) {
      margin-bottom: 0;
    }
  }
  
  .stat-card {
    padding: 1.5rem;
    
    .stat-value {
      font-size: 1.5rem;
    }
  }
  
  .stat-card-detailed {
    .q-card__section {
      padding: 1.5rem;
    }
    
    .stat-value {
      font-size: 1.625rem;
    }
    
    .stat-breakdown {
      gap: 0.75rem;
      padding-top: 0.75rem;
    }
  }
  
  .balance-card {
    .q-card__section {
      padding: 1.5rem;
    }
    
    .text-h5 {
      font-size: 1.625rem;
    }
  }
  
  .section-header {
    padding: 1.25rem 1rem;
    
    .text-h6 {
      font-size: 1.25rem;
    }
    
    .text-caption {
      font-size: 0.875rem;
    }
  }
  
  .paid-stat-card {
    .q-card__section {
      padding: 1.75rem;
    }
    
    .q-avatar {
      width: 64px;
      height: 64px;
      
      .q-icon {
        font-size: 36px;
      }
    }
    
    .text-h5 {
      font-size: 1.75rem;
      font-weight: 800;
    }
    
    .text-caption {
      font-size: 0.8125rem;
    }
  }
  
  .transaction-item {
    padding: 1.25rem;
    
    &:hover {
      transform: translateX(4px);
    }
    
    .q-avatar {
      width: 56px;
      height: 56px;
    }
    
    .q-item-label {
      font-size: 1rem;
      
      &.caption {
        font-size: 0.875rem;
      }
    }
    
    :deep(.q-chip) {
      font-size: 0.75rem;
      height: 24px;
    }
    
    .q-item-section.side {
      .text-h6 {
        font-size: 1.25rem;
      }
    }
  }
  
  .div-clear-filters {
    .btn-clear-filters {
      width: auto;
    }
  }
}

// ==========================================================================
// LANDSCAPE MODE (altura baixa)
// ==========================================================================
@media (max-height: 600px) and (orientation: landscape) {
  .page-header {
    padding: 0.5rem 0;
    margin-bottom: 0.5rem;
    
    h1 {
      font-size: 1.25rem;
    }
  }
  
  .filters-card,
  .stat-card {
    margin-bottom: 0.5rem;
  }
  
  .transaction-item {
    padding: 0.625rem;
  }
}

// ==========================================================================
// DARK MODE SUPPORT
// ==========================================================================
:global(.body--dark) {
  .filters-card,
  .stat-card,
  .transactions-card {
    background: #1e1e2e;
    border-color: rgba(255, 255, 255, 0.05);
  }
  
  .transaction-item {
    &:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }
    
    &:active {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
}

// ==========================================================================
// MOBILE OPTIMIZATIONS - LAYOUT ULTRA COMPACTO
// ==========================================================================
@media (max-width: 599px) {
  .transaction-item {
    /* Layout ultra compacto */
    padding: 0.5rem 0.5rem !important;
    margin: 0 !important;
    min-height: unset !important;
    
    /* LINHA 1: Avatar + Descrição + Menu (tudo junto) */
    display: grid !important;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto auto;
    gap: 0.375rem 0.5rem;
    align-items: start;
    
    /* Avatar (grid: linha 1, coluna 1) */
    .q-item-section.avatar {
      grid-row: 1 / 2;
      grid-column: 1 / 2;
      padding: 0 !important;
      min-width: unset !important;
      
      .q-avatar {
        width: 36px !important;
        height: 36px !important;
        
        .q-icon {
          font-size: 1rem !important;
        }
      }
    }
    
    /* Descrição + Chips (grid: linha 1-2, coluna 2) */
    .q-item-section:not(.avatar):not(.side) {
      grid-row: 1 / 3;
      grid-column: 2 / 3;
      padding: 0 !important;
      min-width: 0;
      
      .q-item-label {
        font-size: 0.875rem !important;
        line-height: 1.3;
        font-weight: 600;
        margin-bottom: 0.25rem;
        
        &.caption {
          font-size: 0.6875rem !important;
          opacity: 0.75;
          margin-top: 0.125rem;
          line-height: 1.2;
          
          .row {
            flex-wrap: wrap;
            gap: 0.25rem;
            margin: 0 !important;
            
            .q-chip {
              font-size: 0.5625rem !important; /* 9px */
              height: 16px !important;
              padding: 0 5px !important;
              margin: 0 !important;
            }
            
            span {
              font-size: 0.6875rem !important;
            }
          }
        }
      }
    }
    
    /* Valor + Tipo (grid: linha 3, coluna 1-2) */
    .q-item-section.side:first-of-type {
      grid-row: 3 / 4;
      grid-column: 1 / 3;
      padding: 0.375rem 0 0 0 !important;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      margin-left: 0 !important;
      
      > div {
        display: flex !important;
        flex-direction: row !important;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        gap: 0.5rem;
        
        /* Container do valor */
        > div:first-child {
          display: flex;
          flex-direction: row;
          align-items: baseline;
          gap: 0.375rem;
          
          /* Valor */
          div:first-child {
            font-size: 1rem !important; /* 16px */
            font-weight: 700 !important;
            line-height: 1;
          }
          
          /* Tipo (Receita/Despesa) */
          .text-caption {
            font-size: 0.6875rem !important;
            opacity: 0.7;
            line-height: 1;
          }
        }
        
        /* Toggle compacto */
        > div:last-child {
          .q-toggle {
            margin: 0 !important;
            
            :deep(.q-toggle__label) {
              font-size: 0.6875rem !important;
              padding-left: 0.25rem;
            }
            
            :deep(.q-toggle__inner) {
              font-size: 0.75rem;
              width: 32px;
              min-width: 32px;
            }
          }
        }
      }
    }
    
    /* Menu (grid: linha 1, coluna 3) */
    .q-item-section.side:last-of-type {
      grid-row: 1 / 2;
      grid-column: 3 / 4;
      padding: 0 !important;
      align-self: start;
      
      .q-btn {
        min-width: 36px !important;
        min-height: 36px !important;
        padding: 0.25rem !important;
      }
    }
    
    /* Remove hover em mobile */
    &:hover {
      transform: none !important;
      box-shadow: none !important;
      background-color: transparent !important;
    }
    
    &:active {
      background-color: rgba(25, 118, 210, 0.04) !important;
    }
  }
  
  /* Card e lista ultra compactos */
  .transactions-card {
    padding: 0 !important;
    
    :deep(.q-card__section) {
      padding: 0.5rem !important;
    }
  }
  
  .q-list {
    padding: 0 !important;
    
    .q-separator {
      margin: 0 !important;
    }
  }
}

// ==========================================================================
// LISTAS DE TRANSAÇÕES - DESIGN MODERNO E LIMPO
// ==========================================================================
.transactions-list-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .list-header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    
    .text-subtitle1 {
      font-size: 1rem;
      letter-spacing: -0.01em;
      display: flex;
      align-items: center;
    }
    
    .text-caption {
      margin-top: 2px;
      font-size: 0.8rem;
      opacity: 0.85;
    }
    
    .text-h6 {
      font-size: 1.375rem;
      letter-spacing: -0.02em;
    }
  }
  
  .q-list {
    padding: 0;
  }
}

.transaction-item-modern {
  padding: 1rem 1.25rem;
  transition: all 0.2s ease;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  &:active {
    background-color: rgba(25, 118, 210, 0.04);
  }
  
  // Indicador de cor na lateral
  .transaction-indicator {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover .transaction-indicator {
    opacity: 1;
  }
  
  .transaction-indicator-positive {
    background: linear-gradient(180deg, #10b981 0%, #059669 100%);
  }
  
  .transaction-indicator-negative {
    background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
  }
  
  // Ícone pequeno e limpo
  .transaction-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }
  
  .transaction-icon-positive {
    background-color: rgba(16, 185, 129, 0.1);
    color: #059669;
  }
  
  .transaction-icon-negative {
    background-color: rgba(239, 68, 68, 0.1);
    color: #dc2626;
  }
  
  &:hover .transaction-icon {
    transform: scale(1.1);
  }
  
  // Meta informações (categoria, data)
  .transaction-meta {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.8125rem;
    color: #6b7280;
    
    .q-icon {
      opacity: 0.7;
    }
  }
  
  .transaction-meta-dot {
    color: #d1d5db;
    font-weight: bold;
    margin: 0 2px;
  }
  
  // Seção de valor
  .transaction-value-section {
    min-width: 140px;
    padding-left: 12px;
    
    .text-h6 {
      font-size: 1.125rem;
      letter-spacing: -0.01em;
    }
  }
  
  .transaction-status {
    display: flex;
    justify-content: flex-end;
    
    .q-chip {
      font-size: 0.7rem;
      padding: 2px 8px;
      height: 20px;
    }
  }
}

// Responsividade mobile
@media (max-width: 768px) {
  .transactions-list-card {
    border-radius: 12px;
    
    .list-header {
      padding: 0.875rem 1rem;
      
      .text-subtitle1 {
        font-size: 0.925rem;
      }
      
      .text-h6 {
        font-size: 1.125rem;
      }
    }
  }
  
  .transaction-item-modern {
    padding: 0.875rem 1rem;
    
    .transaction-icon {
      width: 28px;
      height: 28px;
      
      .q-icon {
        font-size: 14px !important;
      }
    }
    
    .transaction-value-section {
      min-width: 120px;
      
      .text-h6 {
        font-size: 1rem;
      }
    }
    
    .transaction-meta {
      font-size: 0.75rem;
    }
    
    :deep(.q-item-section.side) {
      padding-left: 4px !important;
    }
  }
}

// ==========================================================================
// PERIOD FILTER SECTION - DESIGN MELHORADO
// ==========================================================================
.period-filter-section {
  animation: fadeInUp 0.6s ease;
  
  .advanced-filter-expansion {
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      border-color: rgba(25, 118, 210, 0.3);
      box-shadow: 0 4px 16px rgba(25, 118, 210, 0.08);
    }
    
    :deep(.q-item) {
      padding: 12px 16px;
    }
    
    :deep(.q-item__label) {
      font-size: 0.95rem;
      color: #1f2937;
    }
    
    :deep(.q-item__label--caption) {
      font-size: 0.8rem;
      color: #6b7280;
      margin-top: 2px;
    }
  }
  
  .advanced-filter-card {
    background: #f9fafb;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }
}

.future-month-banner {
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border: 2px solid #fed7aa;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 12px rgba(251, 146, 60, 0.15);
  
  .text-h6 {
    color: #ea580c;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }
  
  .text-body2 {
    color: #9a3412;
    line-height: 1.5;
  }
}

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

// ==========================================================================
// PRINT STYLES
// ==========================================================================
@media print {
  .page-header .q-btn,
  .filters-card,
  .q-item-section.side .q-btn,
  .q-pagination {
    display: none !important;
  }
  
  .transaction-item {
    break-inside: avoid;
  }
}
</style>