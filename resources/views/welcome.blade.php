<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>KOSC Spitsenspel</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">

    <!-- Styles -->
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">

    <!-- Scripts -->
    <script src="{{ mix('js/app.js') }}" defer></script>

    @livewireStyles

</head>

<body class="antialiased font-sans bg-gray-200">
    <div class="" style="">
        <div>
            <div class="min-h-screen bg-white">
                <header>
                    <div class="relative bg-white" x-data="Components.popover({ open: false, focus: true })"
                        x-init="init()" @keydown.escape="onEscape" @close-popover-group.window="onClosePopoverGroup">
                        <div
                            class="flex justify-between items-center max-w-7xl mx-auto px-4 py-6 sm:px-6 md:justify-start md:space-x-10 lg:px-8">
                            <div class="flex justify-start lg:w-0 lg:flex-1">
                                <a href="#">
                                    <img src="{{ Storage::url('spitsenspel-logo100x50.png') }}" alt="">
                                </a>
                            </div>
                            @if (Route::has('login'))
                            <div class="flex items-center justify-end flex-1 lg:w-0">
                                @auth
                                <a href="{{ url('/dashboard') }}"
                                    class="ml-8 whitespace-nowrap inline-flex items-center justify-center bg-gradient-to-r from-green-400 to-green-600 bg-origin-border px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:from-green-400 hover:to-green-700">
                                    Dashboard
                                </a>
                                @else
                                <a href="{{ route('login') }}"
                                    class="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                                    Inloggen
                                </a>
                                <a href="{{ route('register') }}"
                                    class="ml-8 whitespace-nowrap inline-flex items-center justify-center bg-gradient-to-r from-green-400 to-green-600 bg-origin-border px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:from-green-400 hover:to-green-700">
                                    Registreren
                                </a>
                                @endauth
                            </div>
                            @endif
                        </div>
                    </div>
                </header>

                <main>
                    <div>
                        <!-- Hero card -->
                        <div class="relative">
                            <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100"></div>
                            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                                <div class="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
                                    <div class="absolute inset-0">
                                        <img class="h-full w-full object-cover"
                                            src="{{ Storage::url('spitsenspel.png') }}" alt="KOSC Spitsenspel">
                                        <div class="absolute inset-0 bg-green-700 mix-blend-multiply"></div>
                                    </div>
                                    <div class="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                                        <h1
                                            class="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                                            <span class="block text-white">Speel mee met het</span>
                                            <span class="block text-green-200">KOSC Spitsenspel</span>
                                        </h1>
                                        <p class="mt-6 max-w-lg mx-auto text-center text-xl text-white sm:max-w-3xl">
                                            Stel je selectie van maximaal 11 KOSC spelers samen en verdien punten
                                            wanneer jouw spelers doelpunten maken!
                                        </p>
                                        <div class="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                                            <div
                                                class="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5">
                                                <a href="{{ url('/dashboard') }}"
                                                    class="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-green-700 bg-white hover:bg-green-50 sm:px-8">
                                                    Naar het spel
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Logo cloud -->
                        <div class="bg-gray-100">
                            <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                                <p class="text-center text-sm font-semibold uppercase text-gray-500 tracking-wide">
                                    Het KOSC Spitsenspel wordt mede mogelijk gemaakt door
                                </p>
                                <div class="flex flex-wrap">
                                    <div class="w-full mt-12 md:w-1/3 text-center">
                                        <span class="h-12 text-green-900 font-bold text-xl">Café 'n Deurloop</span>
                                    </div>
                                    <div class="w-full mt-12 md:w-1/3 text-center">
                                        <span class="h-12 text-green-900 font-bold text-xl">Grolsch</span>
                                    </div>
                                    <div class="w-full mt-12 md:w-1/3 text-center">
                                        <span class="h-12 text-green-900 font-bold text-xl">Othmar</span>
                                    </div>
                                    <div class="w-full mt-12 md:w-1/3 text-center">
                                        <span class="h-12 text-green-900 font-bold text-xl">Madison</span>
                                    </div>
                                    <div class="w-full mt-12 md:w-1/3 text-center">
                                        <span class="h-12 text-green-900 font-bold text-xl">Heisterkamp Auto's</span>
                                    </div>
                                    <div class="w-full mt-12 md:w-1/3 text-center">
                                        <span class="h-12 text-green-900 font-bold text-xl">Camping bij de Bronnen</span>
                                    </div>
                                    <div class="w-full mt-12 md:w-1/3 text-center">
                                        <span class="h-12 text-green-900 font-bold text-xl">Twentetoer</span>
                                    </div>
                                    <div class="w-full mt-12 md:w-1/3 text-center">
                                        <span class="h-12 text-green-900 font-bold text-xl">KATO</span>
                                    </div>
                                    <div class="w-full mt-12 md:w-1/3 text-center">
                                        <span class="h-12 text-green-900 font-bold text-xl">Kabra</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <!-- This example requires Tailwind CSS v2.0+ -->
                <footer class="bg-white">
                    <div
                        class="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                        <div class="flex justify-center space-x-6 md:order-2">
                            <a href="https://www.instagram.com/koscspitsenspel/"
                                class="text-gray-400 hover:text-gray-500">
                                <span class="sr-only">Instagram</span>
                                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fill-rule="evenodd"
                                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                        clip-rule="evenodd" />
                                </svg>
                            </a>
                        </div>
                        <div class="mt-8 md:mt-0 md:order-1">
                            <p class="text-center text-base text-gray-400">
                                &copy; {{ date('Y') }} KOSC Spitsenspel.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    </div>

</body>

</html>
