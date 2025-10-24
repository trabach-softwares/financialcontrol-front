# Financial Control - Frontend

A modern SaaS application for financial control built with Vue 3, Tailwind CSS, and Pinia.

## 🚀 Features

- **Authentication**: Complete user registration and login system
- **Dashboard**: Real-time financial overview with income, expenses, and balance
- **Charts & Analytics**: Visual representation of financial data by category
- **Filters**: Advanced filtering by type, category, and date range
- **User Profile**: Manage account information and change password
- **Subscription Plans**: Free, Pro, and Premium tiers with different features
- **Admin Panel**: User management dashboard for administrators
- **Responsive Design**: Fully responsive with a clean, minimalist blue theme (#007bff)

## 🛠️ Technology Stack

- **Framework**: Vue 3 with TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase
- **Charts**: Chart.js with vue-chartjs
- **Build Tool**: Vite
- **Testing**: Vitest

## 📋 Prerequisites

- Node.js 20.19.0+ or 22.12.0+
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/trabach-softwares/financialcontrol-front.git
cd financialcontrol-front
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your Supabase credentials in `.env`:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🧪 Testing

Run unit tests:
```bash
npm run test:unit
```

## 📝 Code Quality

Run ESLint:
```bash
npm run lint
```

Type checking:
```bash
npm run type-check
```

## 📁 Project Structure

```
src/
├── assets/          # Static assets and styles
├── components/      # Reusable Vue components
│   ├── PieChart.vue
│   └── TransactionModal.vue
├── lib/            # Library configurations
│   └── supabase.ts # Supabase client setup
├── router/         # Vue Router configuration
├── stores/         # Pinia stores
│   ├── auth.ts
│   ├── subscription.ts
│   └── transactions.ts
└── views/          # Page components
    ├── AdminView.vue
    ├── DashboardView.vue
    ├── LoginView.vue
    ├── PlansView.vue
    ├── ProfileView.vue
    └── RegisterView.vue
```

## 🎨 Theme

The application uses a minimalist blue theme with the primary color `#007bff`. The color scheme is configured in `tailwind.config.js` and includes:
- Primary: `#007bff`
- Primary Dark: `#0056b3`
- Primary Light: `#4da3ff`

## 📊 Supabase Database Schema

### Tables Required

**transactions**
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- type (text: 'income' | 'expense')
- amount (numeric)
- category (text)
- description (text)
- date (date)
- created_at (timestamp)

**subscriptions**
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- plan (text: 'free' | 'pro' | 'premium')
- status (text: 'active' | 'cancelled' | 'expired')
- start_date (timestamp)
- end_date (timestamp, nullable)

## 👥 User Roles

- **User**: Regular user with access to dashboard, transactions, and profile
- **Admin**: Full access including the admin panel for user management

Set user role in Supabase user metadata:
```json
{
  "role": "admin"
}
```

## 🔐 Authentication

The application uses Supabase Authentication with:
- Email/Password sign up
- Email/Password sign in
- Session management
- Protected routes

## 📱 Subscription Plans

### Free
- Up to 50 transactions per month
- Basic reports
- Mobile access
- Email support

### Pro ($29.99/month)
- Unlimited transactions
- Advanced reports and analytics
- Priority email support
- Export to CSV/PDF
- Custom categories
- Multi-currency support

### Premium ($79.99/month)
- Everything in Pro
- Dedicated account manager
- Custom integrations
- API access
- Advanced forecasting
- Team collaboration (up to 5 users)
- Phone support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is private and proprietary to Trabach Softwares.

## 📞 Support

For support, email support@trabach-softwares.com or open an issue in the repository.
