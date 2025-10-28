<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="text-h4 q-ma-none text-weight-bold">
          <q-icon name="person" class="q-mr-sm" color="primary" />
          Meu Perfil
        </h4>
        <p class="text-subtitle1 text-grey-6 q-ma-none q-mt-xs">
          Gerencie suas informações pessoais e configurações da conta
        </p>
      </div>
      <div class="col-auto">
        <q-btn 
          color="primary" 
          icon="save" 
          label="Salvar Alterações"
          :loading="loading"
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
            <q-form ref="profileForm" @submit.prevent="handleSaveProfile">
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
                  {{ formatDate(user.createdAt) }}
                </div>
              </div>

              <div class="row items-center">
                <div class="col text-body2 text-grey-7">Último login:</div>
                <div class="col-auto text-body2">
                  {{ formatDate(user.lastLogin) }}
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
          <q-form ref="passwordForm" @submit.prevent="handleChangePassword">
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
            :loading="changingPassword"
            @click="handleChangePassword"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { userService } from '../services/userService'
import { useNotifications } from '../composables/useNotifications'
import { useDate } from '../composables/useDate'

// Composables
const router = useRouter()
const authStore = useAuthStore()
const { notifySuccess, notifyError } = useNotifications()
const { formatDate } = useDate()

// Refs
const fileInput = ref(null)
const loading = ref(false)
const changingPassword = ref(false)
const showChangePassword = ref(false)

// User data
const user = computed(() => authStore.user)

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

// Computed
const profileForm = computed(() => profileFormData.value)
const passwordForm = computed(() => passwordFormData.value)

const hasChanges = computed(() => {
  if (!user.value) return false
  
  return (
    profileForm.value.name !== (user.value.name || '') ||
    profileForm.value.email !== (user.value.email || '') ||
    profileForm.value.phone !== (user.value.phone || '') ||
    profileForm.value.birthDate !== (user.value.birthDate || '') ||
    profileForm.value.cpf !== (user.value.cpf || '') ||
    profileForm.value.company !== (user.value.company || '') ||
    profileForm.value.position !== (user.value.position || '') ||
    profileForm.value.bio !== (user.value.bio || '') ||
    profileForm.value.avatar !== (user.value.avatar || null)
  )
})

// Methods
const loadUserData = () => {
  if (user.value) {
    profileFormData.value = {
      name: user.value.name || '',
      email: user.value.email || '',
      phone: user.value.phone || '',
      birthDate: user.value.birthDate || '',
      cpf: user.value.cpf || '',
      company: user.value.company || '',
      position: user.value.position || '',
      bio: user.value.bio || '',
      avatar: user.value.avatar || null
    }
  }
}

const handleSaveProfile = async () => {
  try {
    // Validate form
    if (!(await profileForm.value?.validate())) {
      return
    }

    loading.value = true

    // Update profile
    const updatedUser = await userService.updateProfile(profileForm.value)
    
    // Update store
    authStore.updateUser(updatedUser)
    
    notifySuccess('Perfil atualizado com sucesso!')
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    notifyError('Erro ao atualizar perfil. Tente novamente.')
  } finally {
    loading.value = false
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
    loading.value = true

    // Upload avatar
    const avatarUrl = await userService.uploadAvatar(file)
    
    // Update form
    profileFormData.value.avatar = avatarUrl
    
    // Update user immediately
    await handleSaveProfile()
    
    notifySuccess('Avatar atualizado com sucesso!')
  } catch (error) {
    console.error('Erro ao fazer upload do avatar:', error)
    notifyError('Erro ao fazer upload do avatar. Tente novamente.')
  } finally {
    loading.value = false
    // Clear input
    event.target.value = ''
  }
}

const handleRemoveAvatar = async () => {
  try {
    loading.value = true

    await userService.removeAvatar()
    
    // Update form
    profileFormData.value.avatar = null
    
    // Update user
    authStore.updateUser({ ...user.value, avatar: null })
    
    notifySuccess('Avatar removido com sucesso!')
  } catch (error) {
    console.error('Erro ao remover avatar:', error)
    notifyError('Erro ao remover avatar. Tente novamente.')
  } finally {
    loading.value = false
  }
}

const handleChangePassword = async () => {
  try {
    // Validate form
    if (!(await passwordForm.value?.validate())) {
      return
    }

    changingPassword.value = true

    await userService.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
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
    console.error('Erro ao alterar senha:', error)
    notifyError(error.response?.data?.message || 'Erro ao alterar senha. Tente novamente.')
  } finally {
    changingPassword.value = false
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
onMounted(() => {
  loadUserData()
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
</style>