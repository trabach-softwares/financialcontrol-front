<template>
  <header class="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60 dark:border-gray-800">
    <div class="container flex h-16 items-center justify-between px-4 mx-auto">
      <!-- Logo / Brand -->
      <div class="flex items-center space-x-4">
        <!-- Mobile Menu Button -->
        <button
          v-if="showMobileMenu"
          type="button"
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 md:hidden"
          @click="$emit('toggleSidebar')"
        >
          <Menu :size="20" />
        </button>

        <!-- Logo -->
        <router-link
          to="/"
          class="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <DollarSign :size="20" class="text-white" />
          </div>
          <span class="hidden sm:block">FinanceControl</span>
        </router-link>
      </div>

      <!-- Navigation (Desktop) -->
      <nav
        v-if="showNavigation"
        class="hidden md:flex items-center space-x-1"
      >
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.path"
          class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="{
            'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20': item.active,
            'text-gray-700 dark:text-gray-300': !item.active
          }"
        >
          <component
            :is="item.icon"
            :size="16"
            class="inline mr-2"
          />
          {{ item.name }}
        </router-link>
      </nav>

      <!-- Actions -->
      <div class="flex items-center space-x-2">
        <!-- Search (if enabled) -->
        <div
          v-if="showSearch"
          class="hidden sm:block relative"
        >
          <div class="relative">
            <Search
              :size="16"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search..."
              class="pl-10 pr-4 py-2 w-64 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              @keydown.enter="$emit('search', searchQuery)"
            />
          </div>
        </div>

        <!-- Notifications -->
        <button
          v-if="showNotifications"
          type="button"
          class="relative p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          @click="$emit('toggleNotifications')"
        >
          <Bell :size="20" />
          <span
            v-if="notificationCount > 0"
            class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
          >
            {{ notificationCount > 99 ? '99+' : notificationCount }}
          </span>
        </button>

        <!-- Theme Toggle -->
        <button
          type="button"
          class="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          @click="toggleDark"
        >
          <Sun
            v-if="isDark"
            :size="20"
            class="transform rotate-0 scale-100 transition-all duration-200"
          />
          <Moon
            v-else
            :size="20"
            class="transform rotate-0 scale-100 transition-all duration-200"
          />
        </button>

        <!-- User Menu -->
        <div
          v-if="showUserMenu && user"
          class="relative"
        >
          <button
            type="button"
            class="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            @click="toggleUserMenu"
          >
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {{ user.name?.charAt(0).toUpperCase() }}
            </div>
            <ChevronDown
              :size="16"
              class="hidden sm:block transform transition-transform duration-200"
              :class="{ 'rotate-180': userMenuOpen }"
            />
          </button>

          <!-- User Dropdown -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="userMenuOpen"
              class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
            >
              <!-- User Info -->
              <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ user.name }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {{ user.email }}
                </p>
              </div>

              <!-- Menu Items -->
              <div class="py-1">
                <router-link
                  v-for="item in userMenuItems"
                  :key="item.name"
                  :to="item.path"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  @click="userMenuOpen = false"
                >
                  <component
                    :is="item.icon"
                    :size="16"
                    class="mr-3"
                  />
                  {{ item.name }}
                </router-link>

                <hr class="my-1 border-gray-200 dark:border-gray-700" />

                <button
                  type="button"
                  class="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  @click="handleLogout"
                >
                  <LogOut
                    :size="16"
                    class="mr-3"
                  />
                  Sign out
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Login Button (if not authenticated) -->
        <router-link
          v-if="!user"
          to="/login"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105"
        >
          <LogIn
            :size="16"
            class="mr-2"
          />
          Sign in
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Menu, 
  DollarSign, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  ChevronDown, 
  LogOut, 
  LogIn,
  User,
  Settings,
  CreditCard,
  BarChart3,
} from 'lucide-vue-next'
import { useDarkMode } from '@/composables/useDarkMode'
import { useAuthStore } from '@/stores/auth'
import { onClickOutside } from '@vueuse/core'

interface NavigationItem {
  name: string
  path: string
  icon: any
  active?: boolean
}

interface Props {
  showMobileMenu?: boolean
  showNavigation?: boolean
  showSearch?: boolean
  showNotifications?: boolean
  showUserMenu?: boolean
  notificationCount?: number
  navigationItems?: NavigationItem[]
}

const props = withDefaults(defineProps<Props>(), {
  showMobileMenu: true,
  showNavigation: true,
  showSearch: true,
  showNotifications: true,
  showUserMenu: true,
  notificationCount: 0,
  navigationItems: () => [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3, active: true },
    { name: 'Plans', path: '/plans', icon: CreditCard },
  ],
})

defineEmits<{
  toggleSidebar: []
  toggleNotifications: []
  search: [query: string]
}>()

const router = useRouter()
const authStore = useAuthStore()
const { isDark, toggleDark } = useDarkMode()

const searchQuery = ref('')
const userMenuOpen = ref(false)
const userMenuRef = ref()

const user = computed(() => authStore.user)

const userMenuItems = computed(() => [
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'Billing', path: '/plans', icon: CreditCard },
])

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const handleLogout = async () => {
  userMenuOpen.value = false
  await authStore.signOut()
  router.push('/login')
}

// Close user menu when clicking outside
onClickOutside(userMenuRef, () => {
  userMenuOpen.value = false
})
</script>