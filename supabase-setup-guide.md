# Supabase Setup Guide for KOSC Spitsenspel

This guide will help you set up the database for the new React application in Supabase.

## 🚀 Step-by-Step Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `kosc-spitsenspel`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

### 2. Get Your Project Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### 3. Set Up Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the Database Setup

You have two options for the database schema:

#### **Option A: Simplified Schema (Recommended)**
1. Copy the entire contents of `supabase-setup-simple.sql`
2. Paste it into the SQL editor
3. Click "Run" to execute the script

**Benefits**: 3 tables instead of 6, simpler queries, better performance

#### **Option B: Full Schema**
1. Copy the entire contents of `supabase-setup.sql`
2. Paste it into the SQL editor
3. Click "Run" to execute the script

**Benefits**: More normalized structure, separate tables for different entities

**Recommendation**: Use the simplified schema (`supabase-setup-simple.sql`) for easier development and maintenance.

### 5. Verify Setup

After running the script, you should see:
- ✅ 8 teams created (KOSC 1-8)
- ✅ 11 sample players created
- ✅ 4 sample matches created
- ✅ 3 sample goals created
- ✅ All tables with proper indexes
- ✅ Row Level Security enabled
- ✅ Proper policies created

### 6. Test the Connection

1. Go to **Table Editor** in your Supabase dashboard
2. You should see these tables:
   - `teams`
   - `players`
   - `matches`
   - `goals`
   - `user_players`
   - `rankings`

### 7. Configure Authentication (Optional)

1. Go to **Authentication** → **Settings**
2. Configure your authentication providers:
   - **Email**: Enable email confirmations
   - **Social**: Add Google, GitHub, etc. if desired
3. Set up email templates for user registration

## 🔧 Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Make sure you're using the SQL Editor in Supabase
   - Don't try to set database parameters manually

2. **Table Already Exists**
   - Drop existing tables first if needed
   - Use `DROP TABLE IF EXISTS table_name CASCADE;`

3. **Policy Errors**
   - Policies are created automatically by the script
   - Check that RLS is enabled on all tables

### Reset Database (if needed)

If you need to start over:

```sql
-- Drop all tables (WARNING: This will delete all data!)
DROP TABLE IF EXISTS rankings CASCADE;
DROP TABLE IF EXISTS user_players CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-- Then run the setup script again
```

## 📊 Database Schema Overview

The setup creates a complete fantasy football database:

- **teams**: KOSC teams with point multipliers
- **players**: Available players with prices and positions
- **matches**: Match results and schedules
- **goals**: Individual goal records
- **user_players**: User's selected players
- **rankings**: User standings and statistics

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Public read access** to teams, players, matches, and goals
- **User-specific access** to personal data (rankings, player selections)
- **Proper indexing** for performance

## 🎯 Next Steps

After successful setup:

1. ✅ Test the React app locally
2. ✅ Verify database connections
3. ✅ Deploy to Netlify
4. ✅ Test production deployment

---

**Need Help?** Check the [Supabase documentation](https://supabase.com/docs) or create an issue in your project repository.
