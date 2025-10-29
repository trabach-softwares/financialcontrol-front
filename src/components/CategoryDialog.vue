<template>
  <q-dialog v-model="internalShow" persistent transition-show="scale" transition-hide="scale">
    <q-card class="q-pa-md category-dialog" style="min-width: 360px; backdrop-filter: blur(6px);">
      <q-card-section class="row items-center q-gutter-sm">
        <q-icon :name="form.icon" :color="form.color" size="md" />
        <div class="text-subtitle1">{{ mode === 'edit' ? 'Editar categoria' : 'Nova categoria' }}</div>
        <q-space />
        <q-chip square :color="form.color" text-color="white" :icon="form.icon" :label="form.name || 'Pré-visualização'" />
      </q-card-section>

      <q-card-section class="">
        <q-btn-toggle
          v-model="form.type"
          :options="[
            { label: 'Receita', value: 'income', icon: 'trending_up' },
            { label: 'Despesa', value: 'expense', icon: 'trending_down' }
          ]"
          no-caps
          unelevated
          toggle-color="primary"
          class="full-width q-mb-sm type-toggle"
          :class="form.type === 'income' ? 'type-income' : 'type-expense'"
        />
        <q-input
          v-model="form.name"
          label="Nome da categoria"
          outlined dense autofocus
          :error="isDuplicate"
          :error-message="'Já existe uma categoria com esse nome'"
          @keyup.enter="canSubmit && onSubmit()"
        />

        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-select
              v-model="form.icon"
              :options="filteredIcons"
              use-input
              @filter="filterIcons"
              label="Ícone"
              outlined dense input-debounce="0"
            >
              <template v-slot:option="{ itemProps, opt }">
                <q-item v-bind="itemProps">
                  <q-item-section avatar><q-icon :name="opt" /></q-item-section>
                  <q-item-section><q-item-label>{{ opt }}</q-item-label></q-item-section>
                </q-item>
              </template>
              <template v-slot:prepend><q-icon :name="form.icon" /></template>
            </q-select>
          </div>

          <div class="col-12 col-sm-6">
            <div class="text-caption q-mb-xs">Cor</div>
            <div class="row q-col-gutter-xs q-mb-sm">
              <div v-for="c in palette" :key="c" class="col-2 flex flex-center">
                <q-btn round size="sm" :color="c" @click="form.color = c" :outline="form.color !== c" />
              </div>
            </div>
            <q-input v-model="form.color" label="Cor (hex ou Quasar)" outlined dense placeholder="#4287f5 ou blue-6" />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="grey-6" @click="onCancel" />
        <q-btn :loading="submitting" unelevated :label="mode === 'edit' ? 'Salvar' : 'Criar'" color="primary" :disable="!canSubmit" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { categoriesCreate } from 'src/apis/categories'

const props = defineProps({
  show: { type: Boolean, default: false },
  initialName: { type: String, default: '' },
  initialIcon: { type: String, default: 'category' },
  initialColor: { type: String, default: 'blue-6' },
  initialType: { type: String, default: 'expense' },
  existingNames: { type: Array, default: () => [] },
  mode: { type: String, default: 'create' }, // 'create' | 'edit'
  submitFn: { type: Function, default: null }, // opcional para sobrescrever criação/edição
})

const emit = defineEmits(['close', 'created', 'saved'])

const internalShow = ref(false)
const submitting = ref(false)

const form = ref({ name: '', icon: 'category', color: 'blue-6', type: 'expense' })

watch(() => props.show, (v) => {
  internalShow.value = v
  if (v) init()
})
watch(internalShow, (v) => { if (!v) emit('close') })

function init() {
  form.value = {
    name: props.initialName || '',
    icon: props.initialIcon || 'category',
    color: props.initialColor || 'blue-6',
    type: (props.initialType === 'income' || props.initialType === 'expense') ? props.initialType : 'expense'
  }
}

const palette = ['blue-6','indigo-6','teal-6','green-6','amber-6','deep-orange-6','red-6','pink-6','purple-6','cyan-6','grey-7']
const allIcons = ref([
  'category','shopping_cart','restaurant','commute','home','receipt_long','payments','savings','medical_services','sports_esports','local_cafe','flight','school','work','directions_car','pets','local_mall','movie','music_note','fitness_center','eco','local_hospital','build'
])
const filteredIcons = ref([...allIcons.value])
const filterIcons = (val, update) => {
  update(() => {
    const needle = (val || '').toLowerCase()
    filteredIcons.value = allIcons.value.filter(i => i.toLowerCase().includes(needle))
  })
}

const isDuplicate = computed(() => props.existingNames.map(s => s.toLowerCase()).includes((form.value.name || '').toLowerCase()))
const canSubmit = computed(() => !!form.value.name && !isDuplicate.value && (form.value.type === 'income' || form.value.type === 'expense'))

function onCancel() {
  internalShow.value = false
}

async function onSubmit() {
  try {
    if (!canSubmit.value) return
    submitting.value = true
    if (props.submitFn) {
      const res = await props.submitFn({ ...form.value })
      if (props.mode === 'edit') emit('saved', res)
      else emit('created', res)
    } else {
      const { name, icon, color, type } = form.value
      const resp = await categoriesCreate(name, icon, color, type)
      const created = { name: resp?.data?.name || name, icon: resp?.data?.icon || icon, color: resp?.data?.color || color, type: resp?.data?.type || type, id: resp?.data?.id }
      emit('created', created)
    }
    internalShow.value = false
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.type-toggle .q-btn {
  background: rgba(0, 0, 0, 0.04);
  color: #555;
}
.type-toggle .q-btn:not(.q-btn--active):hover {
  background: rgba(0, 0, 0, 0.08);
}

.type-income .q-btn--active {
  background-color: #2e7d32 !important; /* verde forte */
  color: #fff !important;
}

.type-expense .q-btn--active {
  background-color: #c62828 !important; /* vermelho forte */
  color: #fff !important;
}
</style>
