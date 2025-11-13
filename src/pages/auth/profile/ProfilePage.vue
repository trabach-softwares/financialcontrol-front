<template>
  <q-page class="q-pa-md profile-page">
    <!-- Header com Avatar e Nome -->
    <div class="profile-header q-mb-lg">
      <div class="row items-center q-col-gutter-md">
        <!-- Avatar e Info Básica -->
        <div class="col-12 col-md-auto text-center text-md-left">
          <q-avatar size="100px" class="profile-avatar shadow-8">
            <img 
              v-if="profileForm.avatar" 
              :src="profileForm.avatar" 
              alt="Avatar"
            />
            <q-icon 
              v-else 
              name="person" 
              size="50px" 
              color="grey-5"
            />
            <q-btn
              round
              dense
              size="sm"
              color="primary"
              icon="photo_camera"
              class="avatar-edit-btn"
              @click="handleUploadAvatar"
            >
              <q-tooltip>Alterar foto</q-tooltip>
            </q-btn>
          </q-avatar>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleFileSelect"
          />
        </div>

        <div class="col">
          <h4 :class="['text-h4','q-ma-none','text-weight-bold', headingTextClass]">
            {{ profileForm.name || 'Seu Nome' }}
          </h4>
          <p :class="['text-subtitle1','q-ma-none','q-mt-xs', subtitleTextClass]">
            {{ profileForm.email || 'seu@email.com' }}
          </p>
          <div class="q-mt-sm">
            <q-chip 
              :color="authStore.userPlan === 'PREMIUM' ? 'positive' : authStore.userPlan === 'PRO' ? 'warning' : 'info'"
              text-color="white"
              icon="workspace_premium"
              :label="`Plano ${authStore.userPlan}`"
              class="q-mr-sm"
            />
            <q-chip 
              color="positive" 
              text-color="white"
              icon="verified"
              label="Conta Ativa"
            />
          </div>
        </div>

        <div class="col-12 col-md-auto">
          <q-btn 
            color="primary" 
            icon="save" 
            label="Salvar Alterações"
            size="lg"
            @click="handleSaveProfile"
            :disable="!hasChanges"
            class="full-width"
          />
        </div>
      </div>
    </div>

    <!-- Tabs de Navegação -->
    <q-tabs
      v-model="activeTab"
      align="left"
      class="text-grey-7 q-mb-md"
      active-color="primary"
      indicator-color="primary"
      narrow-indicator
    >
      <q-tab name="personal" icon="person" label="Dados Pessoais" />
      <q-tab name="professional" icon="work" label="Dados Profissionais" />
      <q-tab name="account" icon="settings" label="Conta e Segurança" />
    </q-tabs>

    <!-- Tab Panels -->
    <q-tab-panels v-model="activeTab" animated>
      <!-- Dados Pessoais -->
      <q-tab-panel name="personal" class="q-pa-none">
        <q-card class="shadow-2">
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="person_outline" color="primary" class="q-mr-sm" />
              Informações Pessoais
            </div>
            
            <q-form ref="profileFormRef">
              <div class="row q-col-gutter-md">
                <!-- Nome -->
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="profileForm.name"
                    label="Nome Completo *"
                    filled
                    :rules="[val => !!val || 'Nome é obrigatório']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" color="primary" />
                    </template>
                  </q-input>
                </div>

                <!-- Email -->
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="profileForm.email"
                    label="Email *"
                    type="email"
                    filled
                    :rules="[
                      val => !!val || 'Email é obrigatório',
                      val => /.+@.+\..+/.test(val) || 'Email deve ser válido'
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="mail" color="primary" />
                    </template>
                  </q-input>
                </div>

                <!-- Telefone -->
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="profileForm.phone"
                    label="Telefone"
                    filled
                    mask="(##) #####-####"
                    hint="Opcional"
                  >
                    <template v-slot:prepend>
                      <q-icon name="phone" color="primary" />
                    </template>
                  </q-input>
                </div>

                <!-- Data de Nascimento -->
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="profileForm.birthDate"
                    label="Data de Nascimento"
                    filled
                    mask="##/##/####"
                    hint="Opcional"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cake" color="primary" />
                    </template>
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer" color="primary">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="profileForm.birthDate" mask="DD/MM/YYYY">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Fechar" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <!-- CPF -->
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="profileForm.cpf"
                    label="CPF"
                    filled
                    mask="###.###.###-##"
                    hint="Opcional"
                  >
                    <template v-slot:prepend>
                      <q-icon name="badge" color="primary" />
                    </template>
                  </q-input>
                </div>

                <!-- Bio -->
                <div class="col-12">
                  <q-input
                    v-model="profileForm.bio"
                    label="Sobre você"
                    type="textarea"
                    filled
                    rows="4"
                    hint="Conte um pouco sobre você (opcional)"
                    counter
                    maxlength="500"
                  >
                    <template v-slot:prepend>
                      <q-icon name="description" color="primary" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Dados Profissionais -->
      <q-tab-panel name="professional" class="q-pa-none">
        <q-card class="shadow-2">
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="work_outline" color="primary" class="q-mr-sm" />
              Informações Profissionais
            </div>
            
            <div class="row q-col-gutter-md">
              <!-- Empresa -->
              <div class="col-12 col-md-6">
                <q-input
                  v-model="profileForm.company"
                  label="Empresa"
                  filled
                  hint="Opcional"
                >
                  <template v-slot:prepend>
                    <q-icon name="business" color="primary" />
                  </template>
                </q-input>
              </div>

              <!-- Cargo -->
              <div class="col-12 col-md-6">
                <q-input
                  v-model="profileForm.position"
                  label="Cargo/Função"
                  filled
                  hint="Opcional"
                >
                  <template v-slot:prepend>
                    <q-icon name="badge" color="primary" />
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Conta e Segurança -->
      <q-tab-panel name="account" class="q-pa-none">
        <div class="row q-col-gutter-md">
          <!-- Informações da Conta -->
          <div class="col-12 col-md-6">
            <q-card class="shadow-2">
              <q-card-section>
                <div class="text-h6 q-mb-md">
                  <q-icon name="info" color="primary" class="q-mr-sm" />
                  Informações da Conta
                </div>
                
                <q-list separator>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="workspace_premium" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Plano Atual</q-item-label>
                      <q-item-label>{{ authStore.userPlan }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="event" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Membro desde</q-item-label>
                      <q-item-label>{{ formatDate(userCreatedAt) }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="login" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Último login</q-item-label>
                      <q-item-label>{{ formatDate(userLastLogin) }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="verified" color="positive" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Status</q-item-label>
                      <q-item-label class="text-positive">Conta Ativa</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <q-card-actions v-if="!authStore.isAdmin" class="q-px-none q-pt-md">
                  <q-btn 
                    color="primary" 
                    icon="upgrade" 
                    label="Fazer Upgrade"
                    unelevated
                    class="full-width"
                    @click="$router.push('/plans')"
                  />
                </q-card-actions>
              </q-card-section>
            </q-card>
          </div>

          <!-- Segurança -->
          <div class="col-12 col-md-6">
            <q-card class="shadow-2">
              <q-card-section>
                <div class="text-h6 q-mb-md">
                  <q-icon name="security" color="primary" class="q-mr-sm" />
                  Segurança
                </div>
                
                <div class="q-gutter-md">
                  <q-btn
                    color="warning"
                    icon="lock"
                    label="Alterar Senha"
                    unelevated
                    class="full-width"
                    @click="showChangePassword = true"
                  />

                  <q-separator />

                  <div class="text-caption text-grey-7 q-mb-sm">
                    <q-icon name="info" size="18px" class="q-mr-xs" />
                    Gerenciamento de Sessão
                  </div>
                  
                  <q-btn
                    color="negative"
                    icon="logout"
                    label="Fazer Logout"
                    outline
                    class="full-width"
                    @click="handleLogout"
                  />

                  <q-separator />

                  <div class="text-caption text-grey-7">
                    <q-icon name="shield" size="18px" class="q-mr-xs" />
                    Suas informações estão protegidas e criptografadas
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Change Password Dialog -->
    <q-dialog v-model="showChangePassword" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="bg-warning text-white">
          <div class="text-h6">
            <q-icon name="lock" class="q-mr-sm" />
            Alterar Senha
          </div>
        </q-card-section>

        <q-card-section>
          <q-form ref="passwordFormRef" @submit.prevent="handleChangePassword">
            <div class="q-gutter-md">
              <q-input
                v-model="passwordForm.currentPassword"
                label="Senha Atual *"
                type="password"
                filled
                :rules="[val => !!val || 'Senha atual é obrigatória']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock_outline" />
                </template>
              </q-input>

              <q-input
                v-model="passwordForm.newPassword"
                label="Nova Senha *"
                type="password"
                filled
                :rules="[
                  val => !!val || 'Nova senha é obrigatória',
                  val => val.length >= 6 || 'Senha deve ter pelo menos 6 caracteres'
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>

              <q-input
                v-model="passwordForm.confirmPassword"
                label="Confirmar Nova Senha *"
                type="password"
                filled
                :rules="[
                  val => !!val || 'Confirmação é obrigatória',
                  val => val === passwordForm.newPassword || 'Senhas não coincidem'
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn 
            label="Cancelar" 
            color="grey" 
            flat 
            @click="showChangePassword = false"
          />
          <q-btn 
            label="Alterar Senha" 
            color="warning" 
            @click="handleChangePassword"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { userProfileGet, userProfileUpdate, userProfilePasswordChange, userProfileAvatarUpload, userProfileAvatarRemove } from 'src/apis/api-financial.js'
import { useNotifications } from '@/composables/useNotifications'
import { useDate } from '@/composables/useDate'
import { authService } from '@/services/authService'

// Composables
const router = useRouter()
const authStore = useAuthStore()
const { notifySuccess, notifyError } = useNotifications()
const { formatDate } = useDate()

const $q = useQuasar()
const headingTextClass = computed(() => ($q.dark.isActive ? 'text-white' : 'text-dark'))
const subtitleTextClass = computed(() => ($q.dark.isActive ? 'text-grey-4' : 'text-grey-6'))

// Refs
const fileInput = ref(null)
const profileFormRef = ref(null)
const passwordFormRef = ref(null)
const showChangePassword = ref(false)
const activeTab = ref('personal') // Tab ativa

// User data
const user = computed(() => authStore.user)

// Datas de conta (tratando snake_case e camelCase)
const userCreatedAt = computed(() => {
  const u = user.value || {}
  return u.createdAt || u.created_at || null
})

const userLastLogin = computed(() => {
  const u = user.value || {}
  return u.lastLogin || u.last_login || null
})

// Forms
const profileFormData = ref({
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  cpf: '',
  company: '',
  position: '',
  bio: '',
  avatar: null
})

const passwordFormData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Computed (dados do formulário)
const profileForm = profileFormData
const passwordForm = passwordFormData

const hasChanges = computed(() => {
  if (!user.value) return false
  
  return (
    profileForm.value.name !== (user.value.name || '') ||
    profileForm.value.email !== (user.value.email || '') ||
    profileForm.value.phone !== (user.value.phone || '') ||
    profileForm.value.birthDate !== (user.value.birthDate || user.value.birth_date || '') ||
    profileForm.value.cpf !== (user.value.cpf || '') ||
    profileForm.value.company !== (user.value.company || '') ||
    profileForm.value.position !== (user.value.position || '') ||
    profileForm.value.bio !== (user.value.bio || '') ||
    profileForm.value.avatar !== (user.value.avatar || null)
  )
})

// Methods
function toBrDate(iso) {
  if (!iso) return ''
  // iso esperado YYYY-MM-DD
  const m = /^\d{4}-\d{2}-\d{2}$/.exec(iso)
  if (!m) return iso // já pode estar em DD/MM/YYYY
  const [y, mth, d] = iso.split('-')
  return `${d}/${mth}/${y}`
}
const loadUserData = () => {
  const source = user.value
  if (source) {
    profileFormData.value = {
      name: source.name || '',
      email: source.email || '',
      phone: source.phone || source.phone_number || '',
      birthDate: (() => {
        const bd = source.birthDate || source.birth_date || ''
        if (!bd) return ''
        return bd.includes('/') ? bd : toBrDate(bd)
      })(),
      cpf: source.cpf || '',
      company: source.company || source.company_name || '',
      position: source.position || source.job_title || '',
      bio: source.bio || source.about || source.description || '',
      avatar: source.avatar || source.avatar_url || null
    }
  }
}

const handleSaveProfile = async () => {
  try {
    // Validate form
    if (profileFormRef.value) {
      const valid = await profileFormRef.value.validate()
      if (!valid) {
        return
      }
    }

    // Preparar payload (remover campos vazios e desnecessários)
    // Normaliza birthDate do formulário para YYYY-MM-DD
    let birth_date
    if (profileFormData.value.birthDate) {
      const v = profileFormData.value.birthDate.trim()
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
        const [dd, mm, yyyy] = v.split('/')
        birth_date = `${yyyy}-${mm}-${dd}`
      } else {
        birth_date = v
      }
    }

    const payload = {
      name: profileFormData.value.name?.trim() || undefined,
      email: profileFormData.value.email?.trim() || undefined,
      phone: profileFormData.value.phone?.trim() || undefined,
      birth_date: birth_date || undefined,
      cpf: profileFormData.value.cpf?.trim() || undefined,
      company: profileFormData.value.company?.trim() || undefined,
      position: profileFormData.value.position?.trim() || undefined,
      bio: profileFormData.value.bio?.trim() || undefined
    }

    // Remover campos undefined
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === '') {
        delete payload[key]
      }
    })

    

    // Update profile via API centralizada
    const response = await userProfileUpdate(payload)
    
    
    
    // Extrair dados do usuário da resposta
    const updatedUser = response?.data || response
    
    // Update store com novos dados
    authStore.updateUser(updatedUser)

    // Sincronizar formulário com dados atualizados (reflete imediatamente na tela)
    profileFormData.value = {
      ...profileFormData.value,
      name: updatedUser.name ?? profileFormData.value.name,
      email: updatedUser.email ?? profileFormData.value.email,
      phone: (updatedUser.phone ?? updatedUser.phone_number) ?? profileFormData.value.phone,
      birthDate: (() => {
        const bd = (updatedUser.birthDate ?? updatedUser.birth_date) ?? profileFormData.value.birthDate
        if (!bd) return ''
        return bd.includes('/') ? bd : toBrDate(bd)
      })(),
      cpf: updatedUser.cpf ?? profileFormData.value.cpf,
      company: (updatedUser.company ?? updatedUser.company_name) ?? profileFormData.value.company,
      position: (updatedUser.position ?? updatedUser.job_title) ?? profileFormData.value.position,
      bio: (updatedUser.bio ?? updatedUser.about ?? updatedUser.description) ?? profileFormData.value.bio,
      avatar: (updatedUser.avatar ?? updatedUser.avatar_url) ?? profileFormData.value.avatar
    }

    notifySuccess('Perfil atualizado com sucesso!')
    
    
  } catch (error) {
    notifyError(error.message || 'Erro ao atualizar perfil. Tente novamente.')
  }
}

const handleUploadAvatar = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file
  if (!file.type.startsWith('image/')) {
    notifyError('Arquivo deve ser uma imagem')
    return
  }

  if (file.size > 2 * 1024 * 1024) { // 2MB
    notifyError('Imagem deve ter no máximo 2MB')
    return
  }

  try {
    // Criar FormData
    const formData = new FormData()
    formData.append('avatar', file)
    
    // Upload avatar
    const updatedUser = await userProfileAvatarUpload(formData)
    
    // Update form
    profileFormData.value.avatar = updatedUser.avatar
    
    // Update user immediately
    await handleSaveProfile()
    
    notifySuccess('Avatar atualizado com sucesso!')
  } catch (error) {
    notifyError('Erro ao fazer upload do avatar. Tente novamente.')
  } finally {
    // Clear input
    event.target.value = ''
  }
}

const handleRemoveAvatar = async () => {
  try {
    const updatedUser = await userProfileAvatarRemove()
    
    // Update form
    profileFormData.value.avatar = null
    
    // Update user
    authStore.updateUser({ ...user.value, avatar: null })
    
    notifySuccess('Avatar removido com sucesso!')
  } catch (error) {
    notifyError('Erro ao remover avatar. Tente novamente.')
  }
}

const handleChangePassword = async () => {
  try {
    // Validate form
    if (passwordFormRef.value) {
      const valid = await passwordFormRef.value.validate()
      if (!valid) {
        return
      }
    }

    
    await userProfilePasswordChange({
      currentPassword: passwordFormData.value.currentPassword,
      newPassword: passwordFormData.value.newPassword
    })
    

    // Clear form
    passwordFormData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }

    showChangePassword.value = false
    notifySuccess('Senha alterada com sucesso!')
  } catch (error) {
    notifyError(error.response?.data?.message || 'Erro ao alterar senha. Tente novamente.')
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  notifySuccess('Logout realizado com sucesso!')
}

// Watchers
watch(user, loadUserData, { immediate: true })

// Lifecycle
onMounted(async () => {
  loadUserData()
  try {
    const userData = await authService.getMe()
    const current = authStore.user || {}
    const merged = { ...current, ...userData }
    authStore.updateUser(merged)
    loadUserData()
  } catch (e) {
  }
})
</script>

<style scoped>
.shadow-2 {
  box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
}

.shadow-4 {
  box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12);
}

.opacity-80 {
  opacity: 0.8;
}

/* Oculta as mensagens/hints inline dos inputs nesta página (atinge estrutura interna do Quasar) */
:deep(.q-field__bottom) {
  display: none !important;
  min-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
}
:deep(.q-field__messages) {
  display: none !important;
}

/* ==========================================================================
   MOBILE OPTIMIZATIONS - PROFILE PAGE
   ========================================================================== */
@media (max-width: 599px) {
  /* Página ultra compacta */
  :deep(.q-page) {
    padding: 0.5rem !important;
    padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important;
  }
  
  /* Header compacto */
  :deep(.row.items-center.q-mb-lg) {
    margin-bottom: 0.75rem !important;
    flex-direction: column;
    align-items: stretch !important;
    gap: 0.5rem;
    
    /* Título menor */
    .text-h4 {
      font-size: 1.375rem !important;
      line-height: 1.3;
      
      .q-icon {
        font-size: 1.5rem !important;
      }
    }
    
    .text-subtitle1 {
      font-size: 0.8125rem !important;
      line-height: 1.4;
      margin-top: 0.25rem !important;
    }
    
    /* Botão full width em mobile */
    .col-auto {
      width: 100%;
      
      .q-btn {
        width: 100%;
        padding: 0.75rem 1rem !important;
        font-size: 0.875rem !important;
        
        .q-icon {
          font-size: 1.125rem !important;
        }
      }
    }
  }
  
  /* Cards compactos */
  :deep(.q-card) {
    border-radius: 8px !important;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1) !important;
    margin-bottom: 0.75rem !important;
    
    /* Header do card */
    .q-card-section.bg-primary {
      padding: 0.75rem !important;
      
      .text-h6 {
        font-size: 1rem !important;
        line-height: 1.3;
        
        .q-icon {
          font-size: 1.125rem !important;
        }
      }
      
      .text-subtitle2 {
        font-size: 0.75rem !important;
        margin-top: 0.125rem;
      }
    }
    
    /* Conteúdo do card */
    .q-card-section:not(.bg-primary) {
      padding: 0.75rem !important;
    }
  }
  
  /* Grid sem gaps grandes */
  :deep(.row.q-col-gutter-lg) {
    margin: -0.375rem !important;
    
    > div {
      padding: 0.375rem !important;
    }
  }
  
  :deep(.row.q-col-gutter-md) {
    margin: -0.375rem !important;
    
    > div {
      padding: 0.375rem !important;
    }
  }
  
  /* Inputs compactos */
  :deep(.q-input),
  :deep(.q-select) {
    .q-field__control {
      min-height: 48px !important;
      padding: 0 0.75rem !important;
    }
    
    .q-field__label {
      font-size: 0.875rem !important;
    }
    
    .q-field__native,
    input {
      font-size: 0.875rem !important;
      padding: 0.5rem 0 !important;
    }
    
    .q-field__prepend {
      padding-right: 0.5rem !important;
      
      .q-icon {
        font-size: 1.125rem !important;
      }
    }
    
    .q-field__append {
      padding-left: 0.5rem !important;
      
      .q-icon {
        font-size: 1.125rem !important;
      }
    }
  }
  
  /* Botões em cards */
  :deep(.q-card-actions) {
    padding: 0.75rem !important;
    
    .q-btn {
      font-size: 0.8125rem !important;
      padding: 0.5rem 1rem !important;
      min-height: 40px !important;
    }
  }
  
  /* Lista de itens compacta */
  :deep(.q-item) {
    min-height: 48px !important;
    padding: 0.625rem 0.75rem !important;
    
    .q-item__label {
      font-size: 0.875rem !important;
      line-height: 1.4;
    }
    
    .q-item__label--caption {
      font-size: 0.75rem !important;
    }
  }
  
  /* Separadores mais sutis */
  :deep(.q-separator) {
    margin: 0.5rem 0 !important;
  }
  
  /* Tabs compactos se houver */
  :deep(.q-tabs) {
    .q-tab {
      padding: 0.5rem 0.75rem !important;
      min-height: 44px !important;
      font-size: 0.8125rem !important;
    }
  }
  
  /* Expansão panels compactos */
  :deep(.q-expansion-item) {
    .q-expansion-item__container {
      .q-item {
        padding: 0.75rem !important;
      }
    }
  }
  
  /* Avatar/Badge compactos */
  :deep(.q-avatar) {
    width: 56px !important;
    height: 56px !important;
    font-size: 1.5rem !important;
  }
  
  /* Chips menores */
  :deep(.q-chip) {
    font-size: 0.75rem !important;
    height: 24px !important;
    padding: 0 0.5rem !important;
  }
}

/* Mobile landscape e tablets */
@media (min-width: 600px) and (max-width: 1023px) {
  :deep(.q-page) {
    padding: 1rem !important;
  }
  
  :deep(.q-card) {
    border-radius: 10px !important;
  }
  
  :deep(.text-h4) {
    font-size: 1.75rem !important;
  }
}

/* Estilos para a nova UI/UX */
.profile-page {
  max-width: 1400px;
  margin: 0 auto;
}

.profile-header {
  background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%);
  border-radius: 16px;
  padding: 2rem;
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 599px) {
    padding: 1.5rem 1rem;
    border-radius: 12px;
  }
}

.profile-avatar {
  position: relative;
  border: 4px solid white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  
  .avatar-edit-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
}

/* Tabs customizados */
:deep(.q-tabs) {
  background: transparent;
  
  .q-tab {
    font-weight: 500;
    text-transform: none;
    
    @media (max-width: 599px) {
      min-width: auto;
      padding: 0.5rem 0.75rem;
      
      .q-tab__label {
        font-size: 0.75rem;
      }
    }
  }
  
  .q-tab--active {
    font-weight: 600;
  }
}

/* Cards com melhor espaçamento */
:deep(.q-card) {
  border-radius: 12px;
  overflow: hidden;
  
  .q-card-section {
    &:first-child {
      padding-bottom: 1.5rem;
    }
  }
}

/* Lista com visual melhorado */
:deep(.q-list) {
  .q-item {
    border-radius: 8px;
    margin-bottom: 0.5rem;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }
    
    .q-item__label--caption {
      color: var(--q-grey-7);
      font-size: 0.75rem;
      margin-bottom: 0.25rem;
    }
    
    .q-item__label {
      font-weight: 500;
      color: var(--q-dark);
    }
  }
}

/* Dark mode adjustments */
.body--dark {
  .profile-header {
    background: linear-gradient(135deg, #1e3a5f 0%, #2c5f6f 100%);
  }
  
  :deep(.q-list) {
    .q-item {
      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }
      
      .q-item__label {
        color: var(--q-grey-3);
      }
    }
  }
}

/* Animações */
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

.q-tab-panel {
  animation: fadeIn 0.3s ease-out;
}

</style>