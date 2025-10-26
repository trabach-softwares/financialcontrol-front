<template>
  <div class="theme-switcher">
    <q-btn-toggle
      v-model="theme.currentTheme.value"
      :options="themeOptions"
      :toggle-color="theme.isDark.value ? 'sage-primary' : 'primary'"
      outline
      no-caps
      @update:model-value="handleThemeChange"
      class="theme-toggle"
    >
      <template v-slot:light>
      </template>
      
      <template v-slot:dark>
      </template>
      
      <template v-slot:auto>
      </template>
    </q-btn-toggle>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from 'src/composables/useTheme'

// ==========================================================================
// COMPOSABLES
// ==========================================================================
const theme = useTheme()

// ==========================================================================
// DATA
// ==========================================================================
const themeOptions = [
  { 
    label: 'Claro', 
    value: 'light', 
    icon: 'light_mode',
    slot: 'light'
  },
  { 
    label: 'Escuro', 
    value: 'dark', 
    icon: 'dark_mode',
    slot: 'dark'
  },
  { 
    label: 'Auto', 
    value: 'auto', 
    icon: 'brightness_auto',
    slot: 'auto'
  }
]

// ==========================================================================
// METHODS
// ==========================================================================
const handleThemeChange = (value) => {
  theme.setTheme(value)
  console.log(`🎨 [THEME SWITCHER] Tema alterado para: ${value}`)
}
</script>

<style lang="scss" scoped>
// ==========================================================================
// THEME SWITCHER COMPONENT
// ==========================================================================

.theme-switcher {
  .theme-toggle {
    border: 1px solid var(--sage-border);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: var(--sage-shadow-md);
      border-color: var(--sage-primary-light);
    }
    
    :deep(.q-btn) {
      min-width: 90px;
      padding: 0.5rem 1rem;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: var(--sage-bg-hover);
      }
      
      &.q-btn--active {
        background: var(--sage-gradient);
        color: white;
        
        .q-icon {
          color: white;
        }
      }
    }
  }
  
  .theme-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    
    .q-icon {
      font-size: 1.25rem;
    }
    
    .theme-label {
      font-size: 0.75rem;
      font-weight: 500;
    }
  }
}

// Responsividade
@media (max-width: 768px) {
  .theme-switcher {
    .theme-toggle {
      :deep(.q-btn) {
        min-width: 70px;
        padding: 0.4rem 0.75rem;
      }
    }
    
    .theme-option {
      .theme-label {
        font-size: 0.7rem;
      }
    }
  }
}
</style>
