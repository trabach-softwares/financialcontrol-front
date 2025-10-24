<template>
  <aside
    :class="sidebarClasses"
    class="fixed left-0 top-0 z-50 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out"
  >
    <!-- Backdrop for mobile -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen && isMobile"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
        @click="$emit('close')"
      />
    </Transition>

    <!-- Sidebar Content -->
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <DollarSign :size="24" class="text-white" />
          </div>
          <div v-if="!collapsed">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              FinanceControl
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ user?.name }}
            </p>
          </div>
        </div>

        <!-- Close button for mobile -->
        <button
          v-if="isMobile"
          type="button"
          class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          @click="$emit('close')"
        >
          <X :size="20" />
        </button>

        <!-- Collapse button for desktop -->
        <button
          v-else
          type="button"
          class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          @click="$emit('toggleCollapse')"
        >
          <ChevronLeft
            :size="20"
            class="transition-transform duration-200"
            :class="{ 'rotate-180': collapsed }"
          />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <!-- Main Navigation -->
        <div class="space-y-1">
          <h3
            v-if="!collapsed"
            class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Main
          </h3>
          
          <router-link
            v-for="item in mainNavigation"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group"
            :class="[
              item.active 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            <component
              :is="item.icon"
              :size="20"
              class="flex-shrink-0"
              :class="[
                item.active 
                  ? 'text-primary-500' 
                  : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'
              ]"
            />
            <span
              v-if="!collapsed"
              class="ml-3 truncate"
            >
              {{ item.name }}
            </span>
            
            <!-- Badge -->
            <span
              v-if="item.badge && !collapsed"
              class="ml-auto px-2 py-0.5 text-xs font-medium rounded-full"
              :class="[
                item.badge.variant === 'danger' 
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              ]"
            >
              {{ item.badge.text }}
            </span>
          </router-link>
        </div>

        <!-- Secondary Navigation -->
        <div v-if="secondaryNavigation.length > 0" class="space-y-1 pt-4">
          <h3
            v-if="!collapsed"
            class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Settings
          </h3>
          
          <router-link
            v-for="item in secondaryNavigation"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group"
            :class="[
              item.active 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            <component
              :is="item.icon"
              :size="20"
              class="flex-shrink-0"
              :class="[
                item.active 
                  ? 'text-primary-500' 
                  : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'
              ]"
            />
            <span
              v-if="!collapsed"
              class="ml-3 truncate"
            >
              {{ item.name }}
            </span>
          </router-link>
        </div>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-800">
        <!-- Plan Info -->
        <div
          v-if="!collapsed && currentPlan"
          class="mb-4 p-3 rounded-lg bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-200 dark:border-primary-800"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-primary-700 dark:text-primary-300">
                {{ currentPlan.name }} Plan
              </p>
              <p class="text-xs text-primary-600 dark:text-primary-400">
                {{ currentPlan.price === 0 ? 'Free' : `$${currentPlan.price}/mo` }}
              </p>
            </div>
            <Crown
              :size="20"
              class="text-primary-500"
            />
          </div>
          
          <router-link
            to="/plans"
            class="inline-flex items-center mt-2 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            Upgrade
            <ArrowRight :size="12" class="ml-1" />
          </router-link>
        </div>

        <!-- User Actions -->
        <div class="flex items-center space-x-2">
          <button
            type="button"
            class="flex-1 flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            @click="$emit('logout')"
          >
            <LogOut :size="16" class="flex-shrink-0" />
            <span v-if="!collapsed" class="ml-3">
              Sign out
            </span>
          </button>
          
          <button
            v-if="!collapsed"
            type="button"
            class="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            @click="toggleDark"
          >
            <Sun v-if="isDark" :size="16" />
            <Moon v-else :size="16" />
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  DollarSign,
  X, 
  ChevronLeft,
  BarChart3,
  CreditCard,
  Users,
  Settings,
  User,
  Crown,
  ArrowRight,
  LogOut,
  Sun,
  Moon,
  PieChart,
  TrendingUp,
  Wallet,
} from 'lucide-vue-next'
import { useDarkMode } from '@/composables/useDarkMode'
import { useAuthStore } from '@/stores/auth'
import { useSubscriptionStore } from '@/stores/subscription'
import { useWindowSize } from '@vueuse/core'

interface NavigationItem {
  name: string
  path: string
  icon: any
  active?: boolean
  badge?: {
    text: string
    variant: 'default' | 'danger'
  }
}

interface Props {
  isOpen: boolean
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
})

defineEmits<{
  close: []
  toggleCollapse: []
  logout: []
}>()

const route = useRoute()
const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()
const { isDark, toggleDark } = useDarkMode()
const { width } = useWindowSize()

const isMobile = computed(() => width.value < 1024)
const user = computed(() => authStore.user)
const currentPlan = computed(() => subscriptionStore.currentPlan)

const sidebarClasses = computed(() => {
  const classes = []
  
  if (props.collapsed && !isMobile.value) {
    classes.push('w-20')
  } else {
    classes.push('w-64')
  }
  
  if (isMobile.value) {
    if (props.isOpen) {
      classes.push('translate-x-0')
    } else {
      classes.push('-translate-x-full')
    }
  } else {
    classes.push('translate-x-0')
  }
  
  return classes.join(' ')
})

const mainNavigation = computed(() => [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: BarChart3,
    active: route.path === '/dashboard',
  },
  {
    name: 'Transactions',
    path: '/transactions',
    icon: Wallet,
    active: route.path.startsWith('/transactions'),
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: TrendingUp,
    active: route.path === '/analytics',
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: PieChart,
    active: route.path === '/reports',
  },
  {
    name: 'Plans',
    path: '/plans',
    icon: CreditCard,
    active: route.path === '/plans',
  },
] as NavigationItem[])

const secondaryNavigation = computed(() => {
  const items: NavigationItem[] = [
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
      active: route.path === '/profile',
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      active: route.path === '/settings',
    },
  ]
  
  // Add admin link if user is admin
  if (authStore.isAdmin) {
    items.push({
      name: 'Admin',
      path: '/admin',
      icon: Users,
      active: route.path === '/admin',
      badge: {
        text: 'Admin',
        variant: 'danger',
      },
    })
  }
  
  return items
})
</script>