# Supabase Setup Guide

This guide will help you set up Supabase for the Financial Control application.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: financial-control
   - Database Password: (generate a secure password)
   - Region: (choose closest to your users)
6. Click "Create new project"
7. Wait for the project to be created (1-2 minutes)

## Step 2: Get Your API Credentials

1. Go to Project Settings (gear icon in sidebar)
2. Click "API" in the settings menu
3. Find these values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

4. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

5. Update `.env` with your values:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 3: Create Database Tables

Go to the SQL Editor in your Supabase dashboard and run these commands:

### Create Transactions Table

```sql
-- Create transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_type ON transactions(type);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);
```

### Create Subscriptions Table

```sql
-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'premium')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Create Users View for Admin (Optional)

```sql
-- Create a function to get user list for admins
CREATE OR REPLACE FUNCTION get_users_list()
RETURNS TABLE (
  id UUID,
  email TEXT,
  name TEXT,
  plan TEXT,
  status TEXT,
  joined_date TIMESTAMPTZ
) 
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin
  IF (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin' THEN
    RETURN QUERY
    SELECT 
      u.id,
      u.email,
      COALESCE(u.raw_user_meta_data->>'full_name', 'Unknown') as name,
      COALESCE(s.plan, 'free') as plan,
      COALESCE(s.status, 'active') as status,
      u.created_at as joined_date
    FROM auth.users u
    LEFT JOIN subscriptions s ON u.id = s.user_id
    ORDER BY u.created_at DESC;
  ELSE
    RAISE EXCEPTION 'Unauthorized';
  END IF;
END;
$$ LANGUAGE plpgsql;
```

## Step 4: Configure Authentication

1. Go to Authentication > Settings in Supabase dashboard
2. Configure email templates (optional)
3. Enable email confirmations (recommended for production)
4. Configure redirect URLs:
   - Site URL: `http://localhost:5173` (development)
   - Additional Redirect URLs: Your production URL

## Step 5: Create an Admin User

1. Sign up a user through your application
2. Go to Authentication > Users in Supabase dashboard
3. Find your user and click on them
4. Edit the "User Metadata" (raw_user_meta_data)
5. Add the admin role:
   ```json
   {
     "full_name": "Admin User",
     "role": "admin"
   }
   ```
6. Save changes

## Step 6: Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test the following:
   - Register a new user
   - Log in with the user
   - Add transactions
   - View dashboard and charts
   - Check profile page
   - View subscription plans
   - Log in as admin user to access admin panel

## Troubleshooting

### "relation does not exist" error
- Make sure you've created all the tables in Step 3
- Check that the table names match exactly

### "Auth session missing!" on all pages
- Verify your Supabase URL and anon key in `.env`
- Make sure the `.env` file is in the project root
- Restart the development server after changing `.env`

### Can't access admin panel
- Make sure the user has `role: "admin"` in their user_metadata
- Log out and log back in after changing user metadata

### Transactions not showing
- Check that Row Level Security policies are created
- Verify you're logged in with the correct user
- Check browser console for errors

## Production Deployment

When deploying to production:

1. Update Site URL in Supabase Authentication settings
2. Add production URL to Redirect URLs
3. Set environment variables in your hosting platform:
   ```
   VITE_SUPABASE_URL=your-production-url
   VITE_SUPABASE_ANON_KEY=your-production-key
   ```
4. Enable email confirmations
5. Configure custom email templates
6. Set up custom domain (optional)

## Database Backup

Regular backups are important:

1. Go to Project Settings > Database
2. Enable Point-in-Time Recovery (PITR) for paid plans
3. Or manually export data using the Supabase dashboard

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
