<<<<<<< HEAD
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
=======
<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains over 1500 video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the Laravel [Patreon page](https://patreon.com/taylorotwell).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Cubet Techno Labs](https://cubettech.com)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[Many](https://www.many.co.uk)**
- **[Webdock, Fast VPS Hosting](https://www.webdock.io/en)**
- **[DevSquad](https://devsquad.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[OP.GG](https://op.gg)**
- **[CMS Max](https://www.cmsmax.com/)**
- **[WebReinvent](https://webreinvent.com/?utm_source=laravel&utm_medium=github&utm_campaign=patreon-sponsors)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
>>>>>>> 4cb9831aca19fa2a9b2a0a2268c7297903f20b91
