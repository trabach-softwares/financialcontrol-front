const fs = require('fs');
const path = require('path');

console.log('🔧 Preparando build para produção...');

const distPath = path.join(__dirname, '..', 'dist', 'spa');

// Verificar se a pasta dist/spa existe
if (!fs.existsSync(distPath)) {
  console.error('❌ Pasta dist/spa não encontrada!');
  process.exit(1);
}

// Criar arquivo _redirects para SPA routing
const redirectsContent = '/*    /index.html   200';
fs.writeFileSync(path.join(distPath, '_redirects'), redirectsContent);
console.log('✅ Arquivo _redirects criado');

// Criar arquivo robots.txt
const robotsContent = `User-agent: *
Allow: /
Sitemap: https://financialcontrol.com.br/sitemap.xml`;
fs.writeFileSync(path.join(distPath, 'robots.txt'), robotsContent);
console.log('✅ Arquivo robots.txt criado');

// Criar arquivo de healthcheck
const healthContent = '{"status":"ok","timestamp":"' + new Date().toISOString() + '"}';
fs.writeFileSync(path.join(distPath, 'health.json'), healthContent);
console.log('✅ Arquivo health.json criado');

console.log('🎉 Build preparado com sucesso para Render!');