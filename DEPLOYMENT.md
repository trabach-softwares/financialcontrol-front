# Deployment Guide

This guide covers deploying the Financial Control Frontend to various platforms.

## Prerequisites

Before deploying, ensure you have:
- ✅ Configured Supabase (see SETUP.md)
- ✅ Tested the application locally
- ✅ Built the application successfully (`npm run build`)
- ✅ All environment variables ready

## Environment Variables

For production, you'll need:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

⚠️ **Important**: Never commit these values to Git. Use your platform's environment variable management.

## Vercel Deployment (Recommended)

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables:
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

5. Redeploy with environment variables:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Add environment variables in project settings
6. Click "Deploy"

## Netlify Deployment

### Option 1: Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login:
   ```bash
   netlify login
   ```

3. Initialize:
   ```bash
   netlify init
   ```

4. Deploy:
   ```bash
   netlify deploy --prod
   ```

### Option 2: GitHub Integration

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Connect GitHub repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in site settings
6. Click "Deploy site"

### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Cloudflare Pages

1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Click "Create a project"
3. Connect GitHub repository
4. Configure:
   - Framework preset: Vue
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Add environment variables
6. Click "Save and Deploy"

## AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click "New app" > "Host web app"
3. Connect GitHub repository
4. Configure:
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Advanced settings:
   - Add environment variables
6. Click "Save and deploy"

### AWS Amplify Configuration

Create `amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Create nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Build and Run

```bash
# Build image
docker build -t financial-control .

# Run container
docker run -p 8080:80 financial-control
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:80"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
    restart: unless-stopped
```

Run with: `docker-compose up -d`

## GitHub Pages

1. Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/financialcontrol-front/',
     // ... rest of config
   })
   ```

2. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [main]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node
           uses: actions/setup-node@v3
           with:
             node-version: 20
             
         - name: Install dependencies
           run: npm ci
           
         - name: Build
           run: npm run build
           env:
             VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
             VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
             
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. Add secrets in GitHub repository settings

## Post-Deployment Steps

### 1. Update Supabase Settings

In Supabase dashboard > Authentication > Settings:
- Add production URL to "Site URL"
- Add production URL to "Redirect URLs"

### 2. Test Production Build

- ✅ Authentication (login/register)
- ✅ Dashboard loading
- ✅ Add transactions
- ✅ Charts rendering
- ✅ Filters working
- ✅ Profile updates
- ✅ Plan changes
- ✅ Admin panel (if admin)

### 3. Configure Custom Domain

For Vercel:
```bash
vercel domains add yourdomain.com
```

For Netlify:
- Go to Domain settings
- Click "Add custom domain"
- Follow DNS configuration steps

### 4. Enable HTTPS

Most platforms enable HTTPS automatically. If not:
- Vercel: Automatic
- Netlify: Automatic
- Cloudflare: Automatic
- Others: Configure SSL certificate

### 5. Set up Monitoring

Consider adding:
- Error tracking (Sentry)
- Analytics (Google Analytics, Plausible)
- Performance monitoring (Vercel Analytics)

## Performance Optimization

### 1. Enable Compression

Most platforms handle this automatically. For custom servers:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 2. Configure Caching

In `vite.config.ts`:
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor': ['vue', 'vue-router', 'pinia'],
        'charts': ['chart.js', 'vue-chartjs']
      }
    }
  }
}
```

### 3. Lazy Loading

Routes are already lazy-loaded. For additional optimization:
```typescript
const HeavyComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
)
```

## Troubleshooting

### 404 on Routes
Configure server to serve `index.html` for all routes (SPA mode).

### Environment Variables Not Working
- Check variable names start with `VITE_`
- Redeploy after adding variables
- Clear build cache

### Build Fails
- Check Node.js version (20+)
- Clear `node_modules` and reinstall
- Check for TypeScript errors

### Blank Page
- Check browser console for errors
- Verify Supabase credentials
- Check network tab for failed requests

## Rollback Strategy

### Vercel
```bash
vercel rollback
```

### Netlify
- Go to Deploys
- Click on previous deploy
- Click "Publish deploy"

### Docker
```bash
docker tag financial-control:latest financial-control:backup
docker pull financial-control:previous
```

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Security Checklist

Before going to production:
- ✅ HTTPS enabled
- ✅ Environment variables secured
- ✅ Supabase Row Level Security enabled
- ✅ Authentication configured properly
- ✅ No secrets in code
- ✅ Dependencies up to date
- ✅ Error tracking set up

## Cost Considerations

### Free Tier Options
- **Vercel**: Free for hobby projects
- **Netlify**: 100GB bandwidth/month free
- **Cloudflare Pages**: Unlimited sites free
- **GitHub Pages**: Free for public repos

### Paid Options
- **Vercel Pro**: $20/month
- **Netlify Pro**: $19/month
- **AWS Amplify**: Pay per GB transferred

Choose based on:
- Expected traffic
- Build minutes needed
- Team collaboration needs
- Advanced features required

## Support

For deployment issues:
- Check platform documentation
- Review deployment logs
- Open an issue on GitHub
- Contact platform support
