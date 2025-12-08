<template>
  <div class="empty-state text-center q-pa-xl">
    <q-icon 
      :name="icon" 
      :size="iconSize" 
      :color="color" 
      class="q-mb-md"
    />
    <div class="text-h6 text-weight-medium q-mb-sm">
      {{ title }}
    </div>
    <div class="text-body2 text-grey-6 q-mb-md">
      {{ description }}
    </div>
    <slot name="actions">
      <q-btn
        v-if="actionLabel && actionHandler"
        :label="actionLabel"
        :color="actionColor"
        :icon="actionIcon"
        no-caps
        rounded
        @click="actionHandler"
      />
    </slot>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: 'search'
  },
  iconSize: {
    type: String,
    default: '4rem'
  },
  color: {
    type: String,
    default: 'grey-4'
  },
  title: {
    type: String,
    default: 'Nenhum resultado encontrado'
  },
  description: {
    type: String,
    default: 'Tente ajustar os filtros ou adicionar novos dados.'
  },
  actionLabel: {
    type: String,
    default: ''
  },
  actionIcon: {
    type: String,
    default: ''
  },
  actionColor: {
    type: String,
    default: 'primary'
  },
  actionHandler: {
    type: Function,
    default: null
  }
})
</script>

<style lang="scss" scoped>
  @import '../css/index.scss';

  
.empty-state {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>