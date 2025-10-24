#!/bin/bash

# Script para preparar o build para Render
echo "🔧 Preparando build para produção..."

# Criar arquivo _redirects para SPA
echo "/*    /index.html   200" > dist/spa/_redirects

# Criar arquivo robots.txt
cat > dist/spa/robots.txt << EOF
User-agent: *
Allow: /
Sitemap: https://your-domain.com/sitemap.xml
EOF

echo "✅ Build preparado para Render!"