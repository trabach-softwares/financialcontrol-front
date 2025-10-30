<template>
  <div class="col-12 col-sm-6 col-md-4 col-lg-2">
    <q-card class="summary-box-card" flat bordered>
      <q-card-section class="text-center q-py-md">
        <q-icon 
          :name="icon" 
          :color="color" 
          size="2.5rem" 
          class="q-mb-sm"
        />
        <div class="text-caption text-grey-6 q-mb-xs">
          {{ label }}
        </div>
        <div class="text-h6 text-weight-medium">
          {{ value }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  color: {
    type: String,
    default: 'primary'
  }
})
</script>

<style lang="scss" scoped>
.summary-box-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
}

.text-h6 {
  line-height: 1.2;
}
</style>