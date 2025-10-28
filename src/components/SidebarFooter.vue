<template>
  <div class="sidebar-footer-content" id="sidebar-footer" data-testid="sidebar-footer" data-alias="sidebar-footer">
    <div class="row items-center justify-between no-wrap" id="sidebar-footer-actions" data-testid="sidebar-footer-actions">

      <!-- Menu do usuário -->
      <q-btn-dropdown
        id="btn-user-menu"
        name="btn-user-menu"
        data-testid="btn-user-menu"
        data-alias="user-menu"
        flat
        no-caps
        class="user-menu-btn"
        aria-label="Menu do usuário"
      >
        <template #label>
          <div class="row items-center no-wrap" id="user-menu-label" data-testid="user-menu-label">
            <q-avatar size="32px" color="primary" text-color="white" id="user-menu-avatar" data-testid="user-menu-avatar">
              <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" id="user-avatar-img" data-testid="user-avatar-img" />
              <q-icon v-else name="person" id="user-avatar-icon" data-testid="user-avatar-icon" />
            </q-avatar>
            <div class="text-weight-medium q-ml-sm gt-xs" id="user-display-name" data-testid="user-display-name">
              {{ authStore.userDisplayName }}
            </div>
          </div>
        </template>

        <q-list id="user-menu-list" data-testid="user-menu-list">
          <q-item class="user-info-item" id="user-info-item" data-testid="user-info-item">
            <q-item-section avatar id="user-info-avatar-section" data-testid="user-info-avatar-section">
              <q-avatar size="40px" color="primary" text-color="white" id="user-info-avatar" data-testid="user-info-avatar">
                <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" id="user-info-avatar-img" data-testid="user-info-avatar-img" />
                <q-icon v-else name="person" id="user-info-avatar-icon" data-testid="user-info-avatar-icon" />
              </q-avatar>
            </q-item-section>
            <q-item-section id="user-info-text-section" data-testid="user-info-text-section">
              <q-item-label class="text-weight-medium" id="user-name" data-testid="user-name">
                {{ authStore.userDisplayName }}
              </q-item-label>
              <q-item-label caption id="user-email" data-testid="user-email">{{ authStore.user?.email }}</q-item-label>
              <q-item-label caption id="user-plan" data-testid="user-plan">Plano {{ authStore.userPlan }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator id="user-menu-separator-1" />

          <q-item
            v-for="route in userMenuRoutes"
            :key="route.name"
            :to="route.path"
            clickable
            v-close-popup
            :id="`user-menu-item-${route.name}`"
            :data-testid="`user-menu-item-${route.name}`"
          >
            <q-item-section avatar :id="`user-menu-item-${route.name}-icon-section`">
              <q-icon :name="route.icon" :id="`user-menu-item-${route.name}-icon`" />
            </q-item-section>
            <q-item-section :id="`user-menu-item-${route.name}-label-section`">
              <q-item-label :id="`user-menu-item-${route.name}-label`">{{ route.title }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator id="user-menu-separator-2" />

          <q-item clickable @click="$emit('logout')" v-close-popup id="user-menu-logout" data-testid="user-menu-logout">
            <q-item-section avatar id="user-menu-logout-icon-section">
              <q-icon name="logout" color="red-6" id="user-menu-logout-icon" />
            </q-item-section>
            <q-item-section id="user-menu-logout-label-section">
              <q-item-label class="text-red-6" id="user-menu-logout-label">Sair</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth'
import { getUserMenuRoutes } from 'src/router/routes'

const props = defineProps({
  notificationCount: { type: Number, default: 0 }
})

const authStore = useAuthStore()
const userMenuRoutes = getUserMenuRoutes()
</script>

<style scoped>
.sidebar-footer-content {
  padding-top: 8px;
}
.user-menu-btn {
  border-radius: 12px;
}
.user-info-item {
  padding: 12px;
}
</style>
