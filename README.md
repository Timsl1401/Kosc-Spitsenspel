# KOSC Spitsenspel - Project Structure

This repository contains both the original Laravel application and the new modern React application.

## 📁 Project Structure

```
Kosc Spitsenspel/
├── old-laravel-code/          # Original Laravel application (pushed to GitHub)
│   ├── app/                   # Laravel application code
│   ├── resources/             # Views and assets
│   ├── routes/                # Laravel routes
│   ├── database/              # Migrations and seeders
│   └── ...                   # Other Laravel files
│
├── src/                       # New React application source code
│   ├── components/            # React components
│   ├── contexts/              # React contexts
│   ├── lib/                   # Utility functions
│   └── pages/                 # Page components
│
├── package.json               # React app dependencies
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── netlify.toml               # Netlify deployment config
├── supabase-setup.sql         # Database schema for Supabase
└── README.md                  # This file
```

## 🚀 New Modern React Application

The new application is built with:
- **React 18 + TypeScript + Vite**
- **Tailwind CSS** for styling
- **Supabase** for backend and authentication
- **Netlify** for deployment

### 🗄️ Database Setup
See [supabase-setup-guide.md](./supabase-setup-guide.md) for detailed instructions on setting up your Supabase database.

### Features
- Modern, responsive design
- Real-time updates with Supabase
- Mobile-first approach
- Progressive Web App capabilities
- Better performance and user experience

## 🏗️ Original Laravel Application

The original Laravel application is preserved in the `old-laravel-code/` directory and has been pushed to:
**https://github.com/Timsl1401/Kosc-Spitsenspel.git**

### Features
- PHP Laravel 8 framework
- MySQL database
- User authentication with Jetstream
- Livewire components
- Traditional server-side rendering

## 🔄 Migration Path

1. **Phase 1**: ✅ Complete - Old Laravel code preserved in separate directory
2. **Phase 2**: ✅ Complete - New React application created
3. **Phase 3**: 🚧 In Progress - Database migration to Supabase
4. **Phase 4**: 📋 Planned - Deploy to Netlify
5. **Phase 5**: 📋 Planned - Data migration and testing

## 🛠️ Development

### For the New React App:
```bash
npm install
npm run dev
```

### For the Old Laravel App:
```bash
cd old-laravel-code
composer install
php artisan serve
```

## 📚 Documentation

- **New App**: See the main README.md for detailed setup instructions
- **Old App**: The Laravel application is self-contained with its own documentation

## 🔗 Links

- **New App Repository**: Current directory (React + Supabase + Netlify)
- **Old App Repository**: https://github.com/Timsl1401/Kosc-Spitsenspel.git (Laravel)

---

**Note**: This structure allows you to maintain both versions while transitioning to the new modern stack. The old Laravel code is safely preserved in the GitHub repository, and the new React application is ready for development and deployment.
