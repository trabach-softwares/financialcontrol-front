import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import vueDevTools from 'vite-plugin-vue-devtools'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { resolve } from 'path'

export default defineConfig(({ mode, command }) => {
  // Carrega variáveis do .env conforme o modo
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:3000'
  const ssoApiBaseUrl = env.VITE_SSO_API_BASE_URL
  
  const isDev = mode === 'development'
  const isProd = mode === 'production'

  // Configuração para build de biblioteca
  const isLibBuild = command === 'build' && process.env.BUILD_MODE === 'lib'

  if (isLibBuild) {
    return {
      plugins: [
        vue({
          template: { transformAssetUrls }
        }),
      ],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.js'),
          name: 'FinancialControl',
          fileName: (format) => `financial-control.${format}.js`,
          formats: ['es', 'umd']
        },
        rollupOptions: {
          external: ['vue', 'pinia', 'vue-router', 'quasar', 'axios', 'chart.js', 'vue-chartjs'],
          output: {
            globals: {
              vue: 'Vue',
              pinia: 'Pinia',
              'vue-router': 'VueRouter',
              quasar: 'Quasar',
              axios: 'axios',
              'chart.js': 'Chart',
              'vue-chartjs': 'VueChartJs'
            },
            assetFileNames: (assetInfo) => {
              if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                return 'style.css'
              }
              return assetInfo.name
            }
          }
        },
        cssCodeSplit: false,
        sourcemap: true,
        minify: 'esbuild',
        target: 'es2019'
      },
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
        extensions: ['.js', '.vue', '.json', '.mjs']
      }
    }
  }

  // Configuração padrão para desenvolvimento e produção
  return {
    plugins: [
      vue({
        template: { 
          transformAssetUrls,
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('ion-')
          }
        },
        script: {
          defineModel: true,
          propsDestructure: true
        }
      }),
      quasar({
        sassVariables: 'src/quasar-variables.sass'
      }),
      // Vue DevTools - apenas em desenvolvimento
      isDev && vueDevTools({
        componentInspector: true,
        launchEditor: 'code'
      }),
    ].filter(Boolean),

    server: {
      host: '0.0.0.0',
      port: 8000,
      strictPort: false,
      open: true,
      cors: true,
      hmr: {
        overlay: true
      },
      proxy: {
        // Proxy para rotas da API
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              console.info('[VITE][PROXY] → API', req.method, req.url)
            })
            proxy.on('proxyRes', (proxyRes, req) => {
              console.info('[VITE][PROXY] ← API', proxyRes.statusCode, req.url)
            })
            proxy.on('error', (err, req, res) => {
              console.error('[VITE][PROXY] ✗ API Error:', err.message)
            })
          }
        },
        '/auth': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: 'localhost',
          cookiePathRewrite: '/',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              console.info('[VITE][PROXY] → AUTH', req.method, req.url)
            })
            proxy.on('proxyRes', (proxyRes, req) => {
              const setCookies = proxyRes.headers['set-cookie']
              console.info('[VITE][PROXY] ← AUTH', proxyRes.statusCode, req.url, {
                cookies: setCookies ? `${setCookies.length} cookies` : 'nenhum'
              })
            })
          }
        },
        // Proxy para SSO se configurado
        ...(ssoApiBaseUrl ? {
          '/login/v1': {
            target: ssoApiBaseUrl.replace(/\/login\/v1$/, ''),
            changeOrigin: true,
            secure: false,
            cookieDomainRewrite: 'localhost',
            cookiePathRewrite: '/',
            configure: (proxy) => {
              proxy.on('proxyReq', (proxyReq, req) => {
                console.info('[VITE][PROXY] → SSO', req.method, req.url, {
                  auth: !!proxyReq.getHeader('authorization'),
                  cookies: req.headers.cookie ? 'presente' : 'ausente'
                })
              })
              proxy.on('proxyRes', (proxyRes, req) => {
                const setCookies = proxyRes.headers['set-cookie']
                console.info('[VITE][PROXY] ← SSO', proxyRes.statusCode, req.url, {
                  setCookie: setCookies ? `${setCookies.length} cookies` : 'nenhum'
                })
                if (setCookies) {
                  console.info('[VITE][PROXY] Set-Cookie headers:', setCookies)
                }
              })
            }
          }
        } : {})
      }
    },

    preview: {
      host: '0.0.0.0',
      port: 4173,
      strictPort: false,
      open: true,
      cors: true
    },

    build: {
      target: 'es2019',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: isDev ? 'inline' : false,
      minify: isProd ? 'esbuild' : false,
      cssMinify: isProd,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            // Agrupa vendor libs
            'vendor-vue': ['vue', 'vue-router', 'pinia'],
            'vendor-quasar': ['quasar', '@quasar/extras'],
            'vendor-charts': ['chart.js', 'vue-chartjs'],
            'vendor-utils': ['axios', 'date-fns'],
            'vendor-export': ['jspdf', 'jspdf-autotable', 'xlsx']
          },
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
            return `assets/js/${chunkInfo.name || facadeModuleId}-[hash].js`;
          },
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(assetInfo.name)) {
              return `assets/images/[name]-[hash].${ext}`;
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return `assets/fonts/[name]-[hash].${ext}`;
            }
            if (/\.css$/i.test(assetInfo.name)) {
              return `assets/css/[name]-[hash].${ext}`;
            }
            return `assets/[name]-[hash].${ext}`;
          }
        }
      },
      // Optimizações
      reportCompressedSize: false,
      cssCodeSplit: true,
    },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'components': fileURLToPath(new URL('./src/components', import.meta.url)),
        'pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        'layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
        'stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
        'router': fileURLToPath(new URL('./src/router', import.meta.url)),
        'boot': fileURLToPath(new URL('./src/boot', import.meta.url)),
        'assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        'composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
        'utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
        'services': fileURLToPath(new URL('./src/services', import.meta.url)),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },

    css: {
      preprocessorOptions: {
        sass: {
          quietDeps: true,
          silenceDeprecations: ['import', 'global-builtin', 'import'],
          api: 'modern-compiler'
        },
        scss: {
          quietDeps: true,
          silenceDeprecations: ['import', 'global-builtin'],
          api: 'modern-compiler',
          additionalData: `@use "@/assets/variables.scss" as *;`
        },
      },
      devSourcemap: isDev,
      postcss: {
        plugins: []
      }
    },

    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'quasar',
        'axios',
        'chart.js',
        'vue-chartjs',
        'date-fns',
        'jspdf',
        'jspdf-autotable'
      ],
      exclude: ['xlsx'],
      esbuildOptions: {
        target: 'es2019'
      }
    },

    esbuild: {
      drop: isProd ? ['console', 'debugger'] : [],
      legalComments: 'none'
    },

    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __DEV__: isDev,
      __PROD__: isProd
    },

    logLevel: 'info',
    clearScreen: false
  }
})