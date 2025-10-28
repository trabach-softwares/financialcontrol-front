<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 :class="['text-h4','q-ma-none','text-weight-bold', headingTextClass]">
          <q-icon name="person" class="q-mr-sm" color="primary" />
          Meu Perfil
        </h4>
        <p :class="['text-subtitle1','q-ma-none','q-mt-xs', subtitleTextClass]">
          Gerencie suas informações pessoais e configurações da conta
        </p>
      </div>
      <div class="col-auto">
        <q-btn 
          color="primary" 
          icon="save" 
          label="Salvar Alterações"
          @click="handleSaveProfile"
          :disable="!hasChanges"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div class="row q-col-gutter-lg">
      <!-- Profile Info Card -->
      <div class="col-12 col-md-8">
        <q-card class="shadow-2">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">
              <q-icon name="person_outline" class="q-mr-sm" />
              Informações Pessoais
            </div>
            <div class="text-subtitle2 opacity-80">
              Atualize seus dados pessoais
            </div>
          </q-card-section>

          <q-card-section>
            <q-form ref="profileFormRef" @submit.prevent="handleSaveProfile">
              <div class="row q-col-gutter-md">
                <!-- Nome -->
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="profileForm.name"
                    label="Nome Completo *"
                    filled
                    :rules="[val => !!val || 'Nome é obrigatório']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                  </q-input>
                </div>

                <!-- Email -->
                <div class="col-12 col-sm-6">
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
                      <q-icon name="mail" />
                    </template>
                  </q-input>
                </div>

                <!-- Telefone -->
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="profileForm.phone"
                    label="Telefone"
                    filled
                    mask="(##) #####-####"
                  >
                    <template v-slot:prepend>
                      <q-icon name="phone" />
                    </template>
                  </q-input>
                </div>

                <!-- Data de Nascimento -->
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="profileForm.birthDate"
                    label="Data de Nascimento"
                    filled
                    mask="##/##/####"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cake" />
                    </template>
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
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
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="profileForm.cpf"
                    label="CPF"
                    filled
                    mask="###.###.###-##"
                  >
                    <template v-slot:prepend>
                      <q-icon name="badge" />
                    </template>
                  </q-input>
                </div>

                <!-- Empresa -->
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="profileForm.company"
                    label="Empresa"
                    filled
                  >
                    <template v-slot:prepend>
                      <q-icon name="business" />
                    </template>
                  </q-input>
                </div>

                <!-- Cargo -->
                <div class="col-12">
                  <q-input
                    v-model="profileForm.position"
                    label="Cargo/Função"
                    filled
                  >
                    <template v-slot:prepend>
                      <q-icon name="work" />
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
                    rows="3"
                    hint="Conte um pouco sobre você (opcional)"
                  >
                    <template v-slot:prepend>
                      <q-icon name="info" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Profile Avatar & Settings -->
      <div class="col-12 col-md-4">
        <!-- Avatar Card -->
        <q-card class="shadow-2 q-mb-lg">
          <q-card-section class="text-center">
            <div class="text-h6 q-mb-md">Foto do Perfil</div>
            
            <div class="q-mb-md">
              <q-avatar size="120px" class="shadow-4">
                <img 
                  v-if="profileForm.avatar" 
                  :src="profileForm.avatar" 
                  alt="Avatar"
                />
                <q-icon 
                  v-else 
                  name="person" 
                  size="60px" 
                  color="grey-5"
                />
              </q-avatar>
            </div>

            <div class="q-gutter-sm">
              <q-btn
                color="primary"
                icon="upload"
                label="Enviar Foto"
                size="sm"
                @click="handleUploadAvatar"
              />
              <q-btn
                v-if="profileForm.avatar"
                color="negative"
                icon="delete"
                label="Remover"
                size="sm"
                flat
                @click="handleRemoveAvatar"
              />
            </div>

            <!-- Upload Input -->
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleFileSelect"
            />
          </q-card-section>
        </q-card>

        <!-- Account Info -->
        <q-card class="shadow-2 q-mb-lg">
          <q-card-section class="bg-secondary text-white">
            <div class="text-h6">
              <q-icon name="info" class="q-mr-sm" />
              Informações da Conta
            </div>
          </q-card-section>
          
          <q-card-section>
            <div class="q-gutter-sm">
              <div class="row items-center">
                <div class="col text-body2 text-grey-7">Plano Atual:</div>
                <div class="col-auto">
                  <q-chip 
                    :color="authStore.userPlan === 'PREMIUM' ? 'positive' : authStore.userPlan === 'PRO' ? 'warning' : 'info'"
                    text-color="white"
                    :label="authStore.userPlan"
                  />
                </div>
              </div>

              <div class="row items-center">
                <div class="col text-body2 text-grey-7">Membro desde:</div>
                <div class="col-auto text-body2">
                  {{ formatDate(userCreatedAt) }}
                </div>
              </div>

              <div class="row items-center">
                <div class="col text-body2 text-grey-7">Último login:</div>
                <div class="col-auto text-body2">
                  {{ formatDate(userLastLogin) }}
                </div>
              </div>

              <div class="row items-center">
                <div class="col text-body2 text-grey-7">Status:</div>
                <div class="col-auto">
                  <q-chip 
                    color="positive" 
                    text-color="white"
                    icon="verified"
                    label="ATIVO"
                  />
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-actions>
            <q-btn 
              color="primary" 
              icon="upgrade" 
              label="Upgrade do Plano"
              flat
              class="full-width"
              @click="$router.push('/plans')"
            />
          </q-card-actions>
        </q-card>

        <!-- Security Actions -->
        <q-card class="shadow-2">
          <q-card-section class="bg-orange text-white">
            <div class="text-h6">
              <q-icon name="security" class="q-mr-sm" />
              Segurança
            </div>
          </q-card-section>

          <q-card-section>
            <div class="q-gutter-sm">
              <q-btn
                color="warning"
                icon="lock"
                label="Alterar Senha"
                class="full-width"
                @click="showChangePassword = true"
              />
              
              <q-btn
                color="negative"
                icon="logout"
                label="Fazer Logout"
                class="full-width"
                outline
                @click="handleLogout"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

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
    const sessionRaw = sessionStorage.getItem('auth_user')
    const sessionUser = sessionRaw ? JSON.parse(sessionRaw) : null
    console.groupCollapsed('🔎 [PROFILE] Diagnóstico de dados do usuário')
    console.log('AuthStore.user:', authStore.user)
    console.log('SessionStorage auth_user:', sessionUser)
    try {
      const apiResp = await userProfileGet()
      const apiUser = apiResp?.data || apiResp
      console.log('API /users/profile:', apiUser)
    } catch (e) {
      console.warn('⚠️ Falha ao consultar API /users/profile:', e?.message || e)
    }
    console.groupEnd()
  } catch (e) {
    // ignore
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
</style>