<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="col">
        <h4 class="text-h4 q-ma-none text-weight-bold text-negative">
          <q-icon name="people" class="q-mr-sm" />
          Gerenciamento de Usuários
        </h4>
        <p class="text-subtitle1 q-ma-none q-mt-xs">
          Visualize e gerencie todos os usuários do sistema
        </p>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="person_add" label="Novo Usuário" @click="showAddUser = true" />
      </div>
    </div>

    <!-- Filters -->
    <q-card class="shadow-2 q-mb-lg">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <q-input v-model="filters.search" label="Pesquisar" outlined clearable>
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <q-select 
              v-model="filters.plan" 
              :options="planOptions" 
              label="Plano" 
              outlined 
              clearable
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select 
              v-model="filters.status" 
              :options="statusOptions" 
              label="Status" 
              outlined 
              clearable
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-md-3">
            <q-btn color="primary" icon="filter_list" label="Aplicar Filtros" @click="applyFilters" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Users Table -->
    <q-card class="shadow-2">
      <q-table
        :rows="users"
        :columns="columns"
        row-key="id"
        :pagination="{ rowsPerPage: 10 }"
        class="full-width"
      >
        <!-- Avatar Column -->
        <template v-slot:body-cell-avatar="props">
          <q-td :props="props">
            <q-avatar size="40px">
              <img v-if="props.row.avatar" :src="props.row.avatar" alt="Avatar" />
              <q-icon v-else name="person" />
            </q-avatar>
          </q-td>
        </template>

        <!-- Plan Column -->
        <template v-slot:body-cell-plan="props">
          <q-td :props="props">
            <q-chip 
              :color="getPlanColor(props.row.plan)" 
              text-color="white"
            >
              {{ props.row.plan.toUpperCase() }}
            </q-chip>
          </q-td>
        </template>

        <!-- Status Column -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip 
              :color="props.row.status === 'active' ? 'positive' : 'negative'" 
              text-color="white"
              :icon="props.row.status === 'active' ? 'check_circle' : 'block'"
            >
              {{ props.row.status === 'active' ? 'ATIVO' : 'INATIVO' }}
            </q-chip>
          </q-td>
        </template>

        <!-- Actions Column -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn-group>
              <q-btn 
                color="primary" 
                icon="edit" 
                size="sm"
                @click="editUser(props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn 
                color="secondary" 
                icon="visibility" 
                size="sm"
                @click="viewUser(props.row)"
              >
                <q-tooltip>Visualizar</q-tooltip>
              </q-btn>
              <q-btn 
                :color="props.row.status === 'active' ? 'negative' : 'positive'" 
                :icon="props.row.status === 'active' ? 'block' : 'check_circle'"
                size="sm"
                @click="toggleUserStatus(props.row)"
              >
                <q-tooltip>{{ props.row.status === 'active' ? 'Desativar' : 'Ativar' }}</q-tooltip>
              </q-btn>
            </q-btn-group>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Add/Edit User Dialog -->
    <q-dialog v-model="showAddUser" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Novo Usuário</div>
        </q-card-section>
        
        <q-card-section>
          <div class="q-gutter-md">
            <q-input v-model="userForm.name" label="Nome Completo *" outlined />
            <q-input v-model="userForm.email" label="Email *" type="email" outlined />
            <q-select 
              v-model="userForm.plan" 
              :options="planOptions" 
              label="Plano *" 
              outlined
              emit-value
              map-options
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancelar" color="grey" flat @click="showAddUser = false" />
          <q-btn label="Criar Usuário" color="primary" @click="createUser" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useNotifications } from 'src/composables/useNotifications'

// Composables  
const { showSuccess, showError, showConfirm } = useNotifications()


// Refs
const showAddUser = ref(false)

// Data
const filters = ref({
  search: '',
  plan: null,
  status: null
})

const userForm = ref({
  name: '',
  email: '',
  plan: 'free'
})

// Options
const planOptions = [
  { label: 'Gratuito', value: 'free' },
  { label: 'Pro', value: 'pro' },
  { label: 'Premium', value: 'premium' }
]

const statusOptions = [
  { label: 'Ativo', value: 'active' },
  { label: 'Inativo', value: 'inactive' }
]

// Table columns
const columns = [
  { name: 'avatar', label: '', field: 'avatar', align: 'center' },
  { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'plan', label: 'Plano', field: 'plan', align: 'center', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true },
  { name: 'createdAt', label: 'Criado em', field: 'createdAt', align: 'center', sortable: true },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
]

// Sample users data
const users = ref([
  {
    id: 1,
    name: 'Maria Silva',
    email: 'maria@email.com',
    plan: 'premium',
    status: 'active',
    avatar: null,
    createdAt: '15/01/2024'
  },
  {
    id: 2,
    name: 'João Santos',
    email: 'joao@email.com',
    plan: 'pro',
    status: 'active',
    avatar: null,
    createdAt: '14/01/2024'
  },
  // Add more sample users...
])

// Methods
const getPlanColor = (plan) => {
  const colors = {
    'free': 'info',
    'pro': 'warning',
    'premium': 'positive'
  }
  return colors[plan] || 'grey'
}

const applyFilters = () => {
  showSuccess('Filtros aplicados!')
  // In a real app, this would filter the users based on the criteria
}

const editUser = (user) => {
  showSuccess(`Editando usuário: ${user.name}`)
}

const viewUser = (user) => {
  showSuccess(`Visualizando usuário: ${user.name}`)
}

const toggleUserStatus = async (user) => {
  const action = user.status === 'active' ? 'desativar' : 'ativar'
  const confirmed = await showConfirm(
    'Confirmar Ação',
    `Tem certeza que deseja ${action} o usuário ${user.name}?`
  )
  
  if (confirmed) {
    user.status = user.status === 'active' ? 'inactive' : 'active'
    showSuccess(`Usuário ${action}do com sucesso!`)
  }
}

const createUser = () => {
  if (!userForm.value.name || !userForm.value.email) {
    showError('Preencha todos os campos obrigatórios')
    return
  }
  
  showSuccess('Usuário criado com sucesso!')
  showAddUser.value = false
  userForm.value = { name: '', email: '', plan: 'free' }
}
</script>

<style scoped>
.shadow-2 {
  box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
}
</style>