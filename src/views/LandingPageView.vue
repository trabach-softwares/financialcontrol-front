<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="relative z-10">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <BarChart3 :size="20" class="text-white" />
              </div>
              <span class="text-xl font-bold text-gray-900">Controle Financeiro</span>
            </div>
          </div>

          <!-- Navigation -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-8">
              <a href="#recursos" class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Recursos
              </a>
              <a href="#planos" class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Planos
              </a>
              <router-link
                to="/login"
                class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                Entrar
              </router-link>
              <router-link
                to="/register"
                class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Começar Grátis
              </router-link>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <Menu :size="24" />
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div v-if="mobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <a href="#recursos" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900">
              Recursos
            </a>
            <a href="#planos" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900">
              Planos
            </a>
            <router-link
              to="/login"
              class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
            >
              Entrar
            </router-link>
            <router-link
              to="/register"
              class="block px-3 py-2 text-base font-medium bg-gray-900 text-white rounded-lg mt-2"
            >
              Começar Grátis
            </router-link>
          </div>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <main class="pt-16 pb-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <!-- Badge -->
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium mb-8">
            <svg class="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            Controle financeiro simplificado
          </div>

          <!-- Main Heading -->
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Gerencie suas finanças<br />
            <span class="text-gray-600">de forma prática e rápida</span>
          </h1>

          <!-- Subtitle -->
          <p class="text-lg md:text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Controle de receitas e despesas para pequenas e médias empresas.<br />
            Visualize seu fluxo de caixa, gere relatórios e tome decisões<br />
            mais inteligentes.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <router-link
              to="/register"
              class="bg-gray-900 text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center"
            >
              Começar Gratuitamente
              <ArrowRight :size="20" class="ml-2" />
            </router-link>
            <router-link
              to="/login"
              class="text-gray-700 hover:text-gray-900 font-medium px-4 py-2"
            >
              Já tenho conta
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <!-- Features Section -->
    <section id="recursos" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Recursos principais
          </h2>
          <p class="text-lg text-gray-600">
            Tudo que você precisa para controlar suas finanças
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 :size="24" class="text-gray-700" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Dashboard Completo
            </h3>
            <p class="text-gray-600 leading-relaxed">
              Visualize receitas, despesas e saldo em gráficos intuitivos
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp :size="24" class="text-gray-700" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Relatórios Detalhados
            </h3>
            <p class="text-gray-600 leading-relaxed">
              Filtre por período, categoria e exporte em PDF ou Excel
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
              <Shield :size="24" class="text-gray-700" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Seguro e Confiável
            </h3>
            <p class="text-gray-600 leading-relaxed">
              Seus dados protegidos com backup automático
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white py-12 border-t">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-center">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <BarChart3 :size="20" class="text-white" />
            </div>
            <span class="text-xl font-bold text-gray-900">Controle Financeiro</span>
          </div>
        </div>
        <p class="text-center text-gray-600 mt-4">
          © 2024 Controle Financeiro. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  BarChart3,
  Menu,
  ArrowRight,
  TrendingUp,
  Shield
} from 'lucide-vue-next'

const mobileMenuOpen = ref(false)
</script>