<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="text-h4 q-ma-none text-weight-bold">
          <q-icon name="settings" class="q-mr-sm" color="primary" />
          Configurações
        </h4>
        <p class="text-subtitle1 q-ma-none q-mt-xs">
          Personalize sua experiência e configure suas preferências
        </p>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Main Settings -->
      <div class="col-12 col-md-8">
        <!-- General Settings -->
        <q-card class="shadow-2 q-mb-lg">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">
              <q-icon name="tune" class="q-mr-sm" />
              Configurações Gerais
            </div>
          </q-card-section>

          <q-card-section>
            <div class="q-gutter-md">
              <!-- Language -->
              <div class="row items-center">
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 text-weight-medium">
                    <q-icon name="language" class="q-mr-sm" />
                    Idioma
                  </div>
                  <div class="text-caption">
                    Escolha o idioma da interface
                  </div>
                </div>
                <div class="col-12 col-sm-8">
                  <q-select
                    v-model="settings.language"
                    :options="languageOptions"
                    emit-value
                    map-options
                    outlined
                    @update:model-value="saveSettings"
                  />
                </div>
              </div>

              <q-separator />

              <!-- Currency -->
              <div class="row items-center">
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 text-weight-medium">
                    <q-icon name="attach_money" class="q-mr-sm" />
                    Moeda
                  </div>
                  <div class="text-caption">
                    Moeda padrão para exibição
                  </div>
                </div>
                <div class="col-12 col-sm-8">
                  <q-select
                    v-model="settings.currency"
                    :options="currencyOptions"
                    emit-value
                    map-options
                    outlined
                    @update:model-value="saveSettings"
                  />
                </div>
              </div>

              <q-separator />

              <!-- Date Format -->
              <div class="row items-center">
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 text-weight-medium">
                    <q-icon name="event" class="q-mr-sm" />
                    Formato de Data
                  </div>
                  <div class="text-caption">
                    Como as datas são exibidas
                  </div>
                </div>
                <div class="col-12 col-sm-8">
                  <q-select
                    v-model="settings.dateFormat"
                    :options="dateFormatOptions"
                    emit-value
                    map-options
                    outlined
                    @update:model-value="saveSettings"
                  />
                </div>
              </div>

              <q-separator />

              <!-- Number Format -->
              <div class="row items-center">
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 text-weight-medium">
                    <q-icon name="format_list_numbered" class="q-mr-sm" />
                    Formato de Números
                  </div>
                  <div class="text-caption">
                    Separadores decimais e milhares
                  </div>
                </div>
                <div class="col-12 col-sm-8">
                  <q-select
                    v-model="settings.numberFormat"
                    :options="numberFormatOptions"
                    emit-value
                    map-options
                    outlined
                    @update:model-value="saveSettings"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Appearance Settings -->
        <q-card class="shadow-2 q-mb-lg">
          <q-card-section class="bg-secondary text-white">
            <div class="text-h6">
              <q-icon name="palette" class="q-mr-sm" />
              Aparência
            </div>
          </q-card-section>

          <q-card-section>
            <div class="q-gutter-md">
              <!-- Theme -->
              <div class="row items-center">
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 text-weight-medium">
                    <q-icon name="dark_mode" class="q-mr-sm" />
                    Tema
                  </div>
                  <div class="text-caption">
                    Aparência da interface
                  </div>
                </div>
                <div class="col-12 col-sm-8">
                  <ThemeSwitcher />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Notifications Settings -->
        <q-card class="shadow-2">
          <q-card-section class="bg-warning text-white">
            <div class="text-h6">
              <q-icon name="notifications" class="q-mr-sm" />
              Notificações
            </div>
          </q-card-section>

          <q-card-section>
            <div class="q-gutter-md">
              <!-- Email Notifications -->
              <div class="row items-center">
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 text-weight-medium">
                    <q-icon name="email" class="q-mr-sm" />
                    Email
                  </div>
                  <div class="text-caption">
                    Notificações por email
                  </div>
                </div>
                <div class="col-12 col-sm-8">
                  <q-toggle
                    v-model="settings.notifications.email"
                    label="Receber emails de notificação"
                    @update:model-value="saveSettings"
                  />
                </div>
              </div>

              <q-separator />

              <!-- Push Notifications -->
              <div class="row items-center">
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 text-weight-medium">
                    <q-icon name="push_pin" class="q-mr-sm" />
                    Push
                  </div>
                  <div class="text-caption">
                    Notificações no navegador
                  </div>
                </div>
                <div class="col-12 col-sm-8">
                  <q-toggle
                    v-model="settings.notifications.push"
                    label="Ativar notificações push"
                    @update:model-value="saveSettings"
                  />
                </div>
              </div>

              <q-separator />

              <!-- Report Notifications -->
              <div class="row items-center">
                <div class="col-12 col-sm-4">
                  <div class="text-subtitle2 text-weight-medium">
                    <q-icon name="assessment" class="q-mr-sm" />
                    Relatórios
                  </div>
                  <div class="text-caption">
                    Relatórios automáticos
                  </div>
                </div>
                <div class="col-12 col-sm-8">
                  <q-toggle
                    v-model="settings.notifications.reports"
                    label="Receber relatórios mensais"
                    @update:model-value="saveSettings"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Side Panel -->
      <div class="col-12 col-md-4">
        <!-- Quick Actions -->
        <q-card class="shadow-2 q-mb-lg">
          <q-card-section class="bg-positive text-white">
            <div class="text-h6">
              <q-icon name="flash_on" class="q-mr-sm" />
              Ações Rápidas
            </div>
          </q-card-section>

          <q-card-section>
            <div class="q-gutter-sm">
              <q-btn
                color="primary"
                icon="backup"
                label="Backup dos Dados"
                class="full-width"
                @click="backupData"
              />

              <q-btn
                color="secondary"
                icon="restore"
                label="Restaurar Dados"
                class="full-width"
                @click="restoreData"
              />

              <q-btn
                color="warning"
                icon="refresh"
                label="Limpar Cache"
                class="full-width"
                @click="clearCache"
              />
            </div>
          </q-card-section>
        </q-card>

        <!-- Storage Info -->
        <q-card class="shadow-2 q-mb-lg">
          <q-card-section class="bg-info text-white">
            <div class="text-h6">
              <q-icon name="storage" class="q-mr-sm" />
              Armazenamento
            </div>
          </q-card-section>

          <q-card-section>
            <div class="q-gutter-sm">
              <div class="row items-center">
                <div class="col text-body2">Transações:</div>
                <div class="col-auto text-weight-bold">
                  {{ storageInfo.transactions }}
                </div>
              </div>

              <div class="row items-center">
                <div class="col text-body2">Categorias:</div>
                <div class="col-auto text-weight-bold">
                  {{ storageInfo.categories }}
                </div>
              </div>

              <div class="row items-center">
                <div class="col text-body2">Anexos:</div>
                <div class="col-auto text-weight-bold">
                  {{ storageInfo.attachments }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Support -->
        <q-card class="shadow-2">
          <q-card-section class="bg-orange text-white">
            <div class="text-h6">
              <q-icon name="help" class="q-mr-sm" />
              Suporte
            </div>
          </q-card-section>

          <q-card-section>
            <div class="q-gutter-sm">
              <q-btn
                color="primary"
                icon="help_center"
                label="Central de Ajuda"
                class="full-width"
                flat
                @click="openHelp"
              />

              <q-btn
                color="secondary"
                icon="email"
                label="Contatar Suporte"
                class="full-width"
                flat
                @click="contactSupport"
              />

              <q-btn
                color="positive"
                icon="feedback"
                label="Enviar Feedback"
                class="full-width"
                flat
                @click="sendFeedback"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { userService } from "@/services/userService";
import { useNotifications } from "@/composables/useNotifications";
import ThemeSwitcher from "@/components/ThemeSwitcher.vue";

// Composables
const { showSuccess, showError, showConfirm } = useNotifications();

// Refs
const loading = ref(false);

// Settings
const settings = ref({
  language: "pt-BR",
  currency: "BRL",
  dateFormat: "DD/MM/YYYY",
  numberFormat: "pt-BR",
  theme: "light",
  sidebarOpen: true,
  compactMode: false,
  notifications: {
    email: true,
    push: false,
    reports: true,
  },
});

// Storage info
const storageInfo = ref({
  transactions: 0,
  categories: 0,
  attachments: 0,
  totalSize: "0 MB",
  usagePercentage: 0,
});

// Options
const languageOptions = [
  { label: "Português (Brasil)", value: "pt-BR" },
  { label: "English (US)", value: "en-US" },
  { label: "Español (ES)", value: "es-ES" },
];

const currencyOptions = [
  { label: "Real Brasileiro (BRL)", value: "BRL" },
  { label: "Dólar Americano (USD)", value: "USD" },
  { label: "Euro (EUR)", value: "EUR" },
];

const dateFormatOptions = [
  { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
  { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
  { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
];

const numberFormatOptions = [
  { label: "Brasileiro (1.234,56)", value: "pt-BR" },
  { label: "Americano (1,234.56)", value: "en-US" },
  { label: "Europeu (1 234,56)", value: "fr-FR" },
];

const themeOptions = [
  { label: "Claro", value: "light", icon: "light_mode" },
  { label: "Escuro", value: "dark", icon: "dark_mode" },
  { label: "Auto", value: "auto", icon: "brightness_auto" },
];

// Methods
const loadSettings = async () => {
  try {
    loading.value = true;
    const userSettings = await userService.getUserSettings();

    // Update settings with user data
    settings.value = {
      ...settings.value,
      ...userSettings,
    };

    // Load storage info
    const stats = await userService.getUserStats();
    storageInfo.value = {
      transactions: stats.transactionsCount || 0,
      categories: stats.categoriesCount || 0,
      attachments: stats.attachmentsCount || 0,
      totalSize: stats.storageUsed || "0 MB",
      usagePercentage: stats.storagePercentage || 0,
    };
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
    showError("Erro ao carregar configurações");
  } finally {
    loading.value = false;
  }
};

const saveSettings = async () => {
  try {
    await userService.updateUserSettings(settings.value);
    showSuccess("Configurações salvas com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    showError("Erro ao salvar configurações");
  }
};

const backupData = async () => {
  try {
    showSuccess("Iniciando backup dos dados...");
    // In a real app, this would generate and download a backup file
    console.log("Backing up user data");
  } catch (error) {
    showError("Erro ao fazer backup dos dados");
  }
};

const restoreData = async () => {
  const confirmed = await showConfirm(
    "Confirmar Restauração",
    "Tem certeza que deseja restaurar dados? Esta ação pode sobrescrever dados existentes.",
    "Restaurar",
    "Cancelar"
  );

  if (confirmed) {
    try {
      showSuccess("Iniciando restauração de dados...");
      // In a real app, this would open file picker and restore data
      console.log("Restoring user data");
    } catch (error) {
      showError("Erro ao restaurar dados");
    }
  }
};

const clearCache = async () => {
  const confirmed = await showConfirm(
    "Limpar Cache",
    "Tem certeza que deseja limpar o cache? Isso pode melhorar a performance mas alguns dados precisarão ser recarregados.",
    "Limpar",
    "Cancelar"
  );

  if (confirmed) {
    try {
      // Clear browser cache
      localStorage.removeItem("cache");
      sessionStorage.clear();

      showSuccess("Cache limpo com sucesso!");
    } catch (error) {
      showError("Erro ao limpar cache");
    }
  }
};

const openHelp = () => {
  window.open("https://help.financialcontrol.com", "_blank");
};

const contactSupport = () => {
  window.open(
    "mailto:suporte@financialcontrol.com?subject=Suporte - Configurações",
    "_blank"
  );
};

const sendFeedback = () => {
  window.open("https://forms.financialcontrol.com/feedback", "_blank");
};

// Lifecycle
onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.shadow-2 {
  box-shadow:
    0 1px 5px rgba(0, 0, 0, 0.2),
    0 2px 2px rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12);
}
</style>
