<!-- ==========================================================================
COMPLETE PROFILE DIALOG - Diálogo para completar cadastro do usuário
==========================================================================
Propósito: Solicitar dados complementares após registro/login
Campos: phone, birth_date, cpf, company, position, bio, avatar
Exibido: Automaticamente no Dashboard quando perfil incompleto
========================================================================== -->

<template>
  <q-dialog v-model="isOpen" persistent transition-show="scale" transition-hide="scale">
    <q-card class="complete-profile-card" :dark="$q.dark.isActive" style="min-width: 500px; max-width: 600px;">
      <q-card-section class="text-center q-pb-none">
        <div class="welcome-icon q-mb-md">
          <q-icon name="account_circle" color="primary" size="64px" />
        </div>
        <h2 class="text-h5 text-weight-bold q-mb-sm">
          Complete seu Perfil
        </h2>
        <p class="text-body2 text-grey-7">
          Adicione mais informações para uma experiência personalizada
        </p>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleSubmit" class="q-gutter-md">

          <!-- Avatar Upload -->
          <div class="text-center q-mb-md">
            <q-avatar size="100px" class="q-mb-sm">
              <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar preview" />
              <q-icon v-else name="person" size="64px" color="grey-6" />
            </q-avatar>
            <div>
              <q-btn flat dense color="primary" icon="photo_camera" label="Adicionar foto" size="sm"
                @click="$refs.avatarInput.click()" />
              <input ref="avatarInput" type="file" accept="image/*" style="display: none"
                @change="handleAvatarChange" />
            </div>
          </div>

          <!-- Nome -->
          <q-input v-model="form.name" label="Nome Completo" outlined dense placeholder="Digite seu nome completo"
            hint="Obrigatório" :rules="[(val) => !!val || 'Nome é obrigatório']">
            <template v-slot:prepend>
              <q-icon name="person" color="grey-6" />
            </template>
          </q-input>

          <!-- Telefone -->
          <q-input v-model="form.phone" label="Telefone" outlined dense mask="(##) #####-####"
            placeholder="(00) 00000-0000" hint="Opcional">
            <template v-slot:prepend>
              <q-icon name="phone" color="grey-6" />
            </template>
          </q-input>

          <!-- Data de Nascimento -->
          <q-input v-model="form.birth_date" label="Data de Nascimento" outlined dense mask="##/##/####"
            placeholder="DD/MM/AAAA" hint="Opcional">
            <template v-slot:prepend>
              <q-icon name="cake" color="grey-6" />
            </template>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="birthDateProxy" mask="DD/MM/YYYY" @update:model-value="updateBirthDate">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Fechar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <!-- CPF -->
          <q-input v-model="form.cpf" label="CPF" outlined dense mask="###.###.###-##" placeholder="000.000.000-00"
            hint="Opcional">
            <template v-slot:prepend>
              <q-icon name="badge" color="grey-6" />
            </template>
          </q-input>

          <!-- Empresa -->
          <q-input v-model="form.company" label="Empresa" outlined dense placeholder="Nome da sua empresa"
            hint="Opcional">
            <template v-slot:prepend>
              <q-icon name="business" color="grey-6" />
            </template>
          </q-input>

          <!-- Cargo -->
          <q-input v-model="form.position" label="Cargo" outlined dense placeholder="Seu cargo ou função"
            hint="Opcional">
            <template v-slot:prepend>
              <q-icon name="work" color="grey-6" />
            </template>
          </q-input>

          <!-- Bio -->
          <q-input v-model="form.bio" label="Sobre você" outlined type="textarea" rows="3"
            placeholder="Conte um pouco sobre você..." hint="Opcional - Máximo 500 caracteres" maxlength="500" counter>
            <template v-slot:prepend>
              <q-icon name="info" color="grey-6" />
            </template>
          </q-input>

          <!-- Botões de ação -->
          <div class="row q-gutter-sm q-mt-md">
            <q-btn type="submit" label="Salvar e Continuar" color="primary" unelevated class="col"
              :loading="isSubmitting" :disable="isSubmitting" />
            <q-btn label="Pular por Agora" color="grey-6" flat class="col" @click="handleSkip"
              :disable="isSubmitting" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { userProfileAvatarUpload, userProfileUpdate } from 'src/apis/user'
import { useAuthStore } from 'src/stores/auth'
import { computed, ref, watch } from 'vue'

const $q = useQuasar()
const authStore = useAuthStore()

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'completed', 'skipped'])

// State
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const form = ref({
  name: '',
  phone: '',
  birth_date: '',
  cpf: '',
  company: '',
  position: '',
  bio: ''
})

const avatarFile = ref(null)
const avatarPreview = ref(null)
const isSubmitting = ref(false)
const birthDateProxy = ref('')

// Watch para carregar dados existentes quando o modal abrir
watch(isOpen, async (newValue) => {
  if (newValue) {
    
    // Recarregar dados do usuário do backend para garantir dados atualizados
    try {
      await authStore.fetchUser()
    } catch (error) {
      console.warn('⚠️ [COMPLETE PROFILE] Erro ao recarregar usuário:', error)
    }
    
    const user = authStore.user
    
    if (user) {
      
      // Carregar dados existentes no formulário
      const formattedPhone = user.phone ? formatPhone(user.phone) : ''
      const formattedBirthDate = user.birth_date ? formatDateFromISO(user.birth_date) : ''
      const formattedCPF = user.cpf ? formatCPF(user.cpf) : ''

      form.value = {
        name: user.name || '',
        phone: formattedPhone,
        birth_date: formattedBirthDate,
        cpf: formattedCPF,
        company: user.company || '',
        position: user.position || '',
        bio: user.bio || ''
      }
      
      // Carregar avatar se existir
      if (user.avatar) {
        avatarPreview.value = user.avatar
      }
          } else {
      console.warn('⚠️ [COMPLETE PROFILE] Nenhum usuário encontrado na store')
    }
  }
})

// Funções auxiliares para formatação
const formatPhone = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

const formatCPF = (cpf) => {
  if (!cpf) return ''
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
  }
  return cpf
}

const formatDateFromISO = (isoDate) => {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// Methods
const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      $q.notify({
        type: 'negative',
        message: 'Por favor, selecione uma imagem válida',
        position: 'top'
      })
      return
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      $q.notify({
        type: 'negative',
        message: 'A imagem deve ter no máximo 5MB',
        position: 'top'
      })
      return
    }

    avatarFile.value = file

    // Criar preview
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const updateBirthDate = (val) => {
  // Converter de DD/MM/YYYY para o formato do input
  form.value.birth_date = val
}

const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    // Obter dados atuais do usuário
    const currentUser = authStore.user || {}
    
    // Preparar novos dados
    // ⚠️ IMPORTANTE: Backend espera PHONE COM máscara: (##) #####-####
    // ⚠️ IMPORTANTE: Backend espera CPF COM máscara: ###.###.###-##
    const formattedPhone = form.value.phone ? formatPhone(form.value.phone) : null
    const formattedCPF = form.value.cpf ? formatCPF(form.value.cpf) : null
    const isoBirthDate = form.value.birth_date ? convertToISODate(form.value.birth_date) : null

    const newData = {
      name: form.value.name || null,
      phone: formattedPhone,
      birth_date: isoBirthDate,
      cpf: formattedCPF,
      company: form.value.company || null,
      position: form.value.position || null,
      bio: form.value.bio || null
    }

    // Mesclar dados existentes com novos dados
    const payload = {
      name: newData.name || currentUser.name,
      email: currentUser.email,
      phone: newData.phone || currentUser.phone,
      birth_date: newData.birth_date || currentUser.birth_date,
      cpf: newData.cpf || currentUser.cpf,
      company: newData.company || currentUser.company,
      position: newData.position || currentUser.position,
      bio: newData.bio || currentUser.bio,
      // Preservar outros campos importantes
      role: currentUser.role,
      plan_id: currentUser.plan_id
    }

    // Remover campos null ou vazios (exceto campos obrigatórios)
    const finalPayload = {}
    Object.keys(payload).forEach(key => {
      if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
        finalPayload[key] = payload[key]
      }
    })


    // Atualizar perfil
    await userProfileUpdate(finalPayload)

    // Upload de avatar se houver
    if (avatarFile.value) {
      const formData = new FormData()
      formData.append('avatar', avatarFile.value)
      await userProfileAvatarUpload(formData)
    }

    emit('completed')
    isOpen.value = false

  } catch (error) {
    console.error('Erro ao completar perfil:', error)
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao salvar perfil. Tente novamente.',
      position: 'top'
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleSkip = () => {
  emit('skipped')
  isOpen.value = false
}

const convertToISODate = (dateStr) => {
  // Converter DD/MM/YYYY para YYYY-MM-DD
  if (!dateStr) return null
  
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null
  
  const [day, month, year] = parts
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
    @import '../css/index.scss';
.complete-profile-card {
  border-radius: 16px;

  .welcome-icon {
    animation: scaleIn 0.5s ease-out;
  }
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.q-avatar {
  border: 3px solid #e0e0e0;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: var(--q-primary);
  }
}
</style>
