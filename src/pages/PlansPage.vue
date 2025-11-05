<template>
  <q-page class="plans-page">
    <div class="container q-py-xl">
      <!-- Header -->
      <div class="text-center q-mb-xl">
        <h1 class="text-h3 text-bold q-mb-md">
          Escolha Seu Plano
        </h1>
        <p class="text-h6 text-grey-7">
          Selecione o plano ideal para suas necessidades
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center q-py-xl">
        <q-spinner-dots size="64px" color="primary" />
        <div class="text-body1 text-grey-7 q-mt-md">
          Carregando planos...
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center q-py-xl">
        <q-icon name="error_outline" size="64px" color="negative" />
        <div class="text-body1 text-negative q-mt-md">
          {{ error }}
        </div>
        <q-btn
          label="Tentar Novamente"
          color="primary"
          outline
          class="q-mt-md"
          @click="loadPlans"
        />
      </div>

      <!-- Plans Grid -->
      <div v-else class="row q-col-gutter-lg justify-center">
        <div
          v-for="plan in activePlansOnly"
          :key="plan.id"
          class="col-12 col-sm-6 col-md-4"
        >
          <PlanCard
            :plan="plan"
            :is-current-plan="isCurrentPlan(plan.id)"
            :loading="selectedPlanId === plan.id && processingPayment"
            @select="selectPlan"
          />
        </div>
      </div>

      <!-- No Plans -->
      <div v-if="!loading && !error && activePlansOnly.length === 0" class="text-center q-py-xl">
        <q-icon name="inbox" size="64px" color="grey-5" />
        <div class="text-body1 text-grey-7 q-mt-md">
          Nenhum plano disponível no momento
        </div>
      </div>

      <!-- FAQ Section -->
      <div v-if="!loading && activePlansOnly.length > 0" class="q-mt-xl q-pt-xl">
        <q-separator class="q-mb-xl" />
        
        <div class="text-center q-mb-lg">
          <h2 class="text-h4 text-bold">Perguntas Frequentes</h2>
        </div>

        <q-list class="faq-list">
          <q-expansion-item
            icon="help_outline"
            label="Posso cancelar a qualquer momento?"
            class="faq-item"
          >
            <q-card flat bordered>
              <q-card-section>
                Sim! Você pode cancelar seu plano a qualquer momento sem multas ou taxas adicionais.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            icon="help_outline"
            label="Quais formas de pagamento são aceitas?"
            class="faq-item"
          >
            <q-card flat bordered>
              <q-card-section>
                Aceitamos PIX (instantâneo), Boleto Bancário (até 3 dias úteis) e Cartão de Crédito (aprovação instantânea).
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            icon="help_outline"
            label="Quando meu plano é ativado?"
            class="faq-item"
          >
            <q-card flat bordered>
              <q-card-section>
                Para PIX e Cartão de Crédito, a ativação é imediata após confirmação do pagamento. 
                Para Boleto, pode levar até 3 dias úteis após o pagamento.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            icon="help_outline"
            label="Posso mudar de plano depois?"
            class="faq-item"
          >
            <q-card flat bordered>
              <q-card-section>
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { usePlans } from 'src/composables/usePlans';
import { useAuthStore } from 'src/stores/auth';
import PlanCard from 'src/components/payments/PlanCard.vue';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

const {
  loading,
  error,
  plans,
  sortedByPrice,
  list: loadPlans,
} = usePlans();

const selectedPlanId = ref(null);
const processingPayment = ref(false);

// Filtra apenas planos ativos e ordena por preço
const activePlansOnly = computed(() => {
  return sortedByPrice.value.filter(plan => plan.is_active === true);
});

// Verifica se é o plano atual do usuário
const isCurrentPlan = (planId) => {
  return authStore.user?.plan_id === planId;
};

// Seleciona um plano e redireciona para checkout
const selectPlan = (plan) => {
  if (isCurrentPlan(plan.id)) {
    $q.notify({
      type: 'info',
      message: 'Este já é seu plano atual',
      position: 'top',
    });
    return;
  }

  selectedPlanId.value = plan.id;
  
  // Redireciona para página de checkout
  router.push({
    name: 'checkout',
    params: { planId: plan.id },
  });
};

onMounted(async () => {
  await loadPlans();
});
</script>

<style lang="scss" scoped>
.plans-page {
  min-height: 100vh;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.02) 0%, transparent 100%);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  margin-bottom: 8px;
  background: white;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
