<nav x-data="{ open: false }" class="bg-white border-b border-gray-100">
    <!-- Primary Navigation Menu -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex">
                <!-- Logo -->
                <div class="flex-shrink-0 flex items-center">
                    <a href="{{ route('dashboard') }}">
                        <x-jet-application-mark class="block h-9 w-auto" />
                    </a>
                </div>

                <!-- Navigation Links -->
                <div class="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                    <x-jet-nav-link href="{{ route('dashboard') }}" :active="request()->routeIs('dashboard')">
                        {{ __('Dashboard') }}
                    </x-jet-nav-link>
                    <x-jet-nav-link href="{{ route('user.myteam') }}" :active="request()->routeIs('user.myteam')">
                        {{ __('Selectie') }}
                    </x-jet-nav-link>
                    <x-jet-nav-link href="{{ route('player.index') }}" :active="request()->routeIs('player.index')">
                        {{ __('Spelers') }}
                    </x-jet-nav-link>
                    <x-jet-nav-link href="{{ route('user.index',1) }}" :active="request()->routeIs('user.index.*')">
                        {{ __('Ranglijst') }}
                    </x-jet-nav-link>
                    <x-jet-nav-link href="{{ route('subleague.index') }}"
                        :active="request()->routeIs('subleague.index')">
                        {{ __('Subleagues') }}
                    </x-jet-nav-link>
                    <x-jet-nav-link href="{{ route('match.index') }}" :active="request()->routeIs('match.index')">
                        {{ __('Wedstrijden') }}
                    </x-jet-nav-link>
                    {{-- <x-jet-nav-link href="{{ route('rules') }}" :active="request()->routeIs('rules')">
                    {{ __('Spelregels') }}
                    </x-jet-nav-link> --}}
                    <div class="relative inline-block mt-3 text-left justify-center w-full py-2 bg-white
                                items-center text-sm font-medium leading-5 text-gray-500 border-b border-gray-150
                            hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition"
                        x-data="Components.menu({ open: false })" x-init="init()"
                        @keydown.escape.stop="open = false; focusButton()" @click.away="onClickAway($event)" class="">
                        <div>
                            <button type="button" class="inline-flex justify-center w-full bg-white
                                items-center pt-1
                            focus:text-gray-700 focus:border-gray-300 transition" id="menu-button" x-ref="button"
                                @click="onButtonClick()" @keyup.space.prevent="onButtonEnter()"
                                @keydown.enter.prevent="onButtonEnter()" aria-expanded="true" aria-haspopup="true"
                                x-bind:aria-expanded="open.toString()" @keydown.arrow-up.prevent="onArrowUp()"
                                @keydown.arrow-down.prevent="onArrowDown()">
                                Overige
                                <svg class="-mr-1 ml-2 h-5 w-5" x-description="Heroicon name: solid/chevron-down"
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                    aria-hidden="true">
                                    <path fill-rule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                        <div x-show="open" x-transition:enter="transition ease-out duration-100"
                            x-transition:enter-start="transform opacity-0 scale-95"
                            x-transition:enter-end="transform opacity-100 scale-100"
                            x-transition:leave="transition ease-in duration-75"
                            x-transition:leave-start="transform opacity-100 scale-100"
                            x-transition:leave-end="transform opacity-0 scale-95"
                            class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                            x-ref="menu-items" x-description="Dropdown menu, show/hide based on menu state."
                            x-bind:aria-activedescendant="activeDescendant" role="menu" aria-orientation="vertical"
                            aria-labelledby="menu-button" tabindex="-1" @keydown.arrow-up.prevent="onArrowUp()"
                            @keydown.arrow-down.prevent="onArrowDown()" @keydown.tab="open = false"
                            @keydown.enter.prevent="open = false; focusButton()"
                            @keyup.space.prevent="open = false; focusButton()">
                            <div class="py-1" role="none">
                                <a href="{{ route('statistics') }}" class="block px-4 py-2 text-sm text-gray-700"
                                    x-state:on="Active" x-state:off="Not Active"
                                    :class="{ 'bg-gray-100 text-gray-900': activeIndex === 0, 'text-gray-700': !(activeIndex === 0) }"
                                    role="menuitem" tabindex="-1" id="menu-item-0" @mouseenter="activeIndex = 0"
                                    @mouseleave="activeIndex = -1" @click="open = false; focusButton()">Statistieken</a>
                                <a href="{{ route('rules') }}" class="text-gray-700 block px-4 py-2 text-sm"
                                    :class="{ 'bg-gray-100 text-gray-900': activeIndex === 1, 'text-gray-700': !(activeIndex === 1) }"
                                    role="menuitem" tabindex="-1" id="menu-item-1" @mouseenter="activeIndex = 1"
                                    @mouseleave="activeIndex = -1" @click="open = false; focusButton()">Spelregels</a>
                                <a href="{{ route('prizes') }}" class="block px-4 py-2 text-sm text-gray-700"
                                    :class="{ 'bg-gray-100 text-gray-900': activeIndex === 2, 'text-gray-700': !(activeIndex === 2) }"
                                    role="menuitem" tabindex="-1" id="menu-item-2" @mouseenter="activeIndex = 2"
                                    @mouseleave="activeIndex = -1" @click="open = false; focusButton()">Prijzenpot</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="hidden sm:flex sm:items-center sm:ml-6">
                <!-- Settings Dropdown -->
                <div class="ml-3 relative">
                    <x-jet-dropdown align="right" width="48">
                        <x-slot name="trigger">
                            @if (Laravel\Jetstream\Jetstream::managesProfilePhotos())
                            <button
                                class="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition">
                                <img class="h-8 w-8 rounded-full object-cover"
                                    src="{{ Auth::user()->profile_photo_url }}" alt="{{ Auth::user()->first_name }}" />
                            </button>
                            @else
                            <span class="inline-flex rounded-md">
                                <button type="button"
                                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition">
                                    {{ Auth::user()->first_name }}

                                    <svg class="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </span>
                            @endif
                        </x-slot>

                        <x-slot name="content">
                            <!-- Account Management -->
                            <div class="block px-4 py-2 text-xs text-gray-400">
                                {{ __('Account beheren') }}
                            </div>

                            <x-jet-dropdown-link href="{{ route('profile.show') }}">
                                {{ __('Profiel') }}
                            </x-jet-dropdown-link>

                            @role('superadmin')
                            <x-jet-dropdown-link href="{{ route('addmatch') }}">
                                {{ __('Wedstrijd toevoegen') }}
                            </x-jet-dropdown-link>
                            <x-jet-dropdown-link href="{{ route('article.create') }}">
                                {{ __('Nieuws toevoegen') }}
                            </x-jet-dropdown-link>
                            <x-jet-dropdown-link href="{{ route('notification.create') }}">
                                {{ __('Notificatie toevoegen') }}
                            </x-jet-dropdown-link>
                            @endrole

                            @if (Laravel\Jetstream\Jetstream::hasApiFeatures())
                            <x-jet-dropdown-link href="{{ route('api-tokens.index') }}">
                                {{ __('API Tokens') }}
                            </x-jet-dropdown-link>
                            @endif

                            <div class="border-t border-gray-100"></div>

                            <!-- Authentication -->
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf

                                <x-jet-dropdown-link href="{{ route('logout') }}" onclick="event.preventDefault();
                                                this.closest('form').submit();">
                                    {{ __('Uitloggen') }}
                                </x-jet-dropdown-link>
                            </form>
                        </x-slot>
                    </x-jet-dropdown>
                </div>
            </div>

            <!-- Hamburger -->
            <div class="-mr-2 flex items-center sm:hidden">
                <button @click="open = ! open"
                    class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition">
                    <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path :class="{'hidden': open, 'inline-flex': ! open }" class="inline-flex"
                            stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                        <path :class="{'hidden': ! open, 'inline-flex': open }" class="hidden" stroke-linecap="round"
                            stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Responsive Navigation Menu -->
    <div :class="{'block': open, 'hidden': ! open}" class="hidden sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
            <x-jet-responsive-nav-link href="{{ route('dashboard') }}" :active="request()->routeIs('dashboard')">
                {{ __('Dashboard') }}
            </x-jet-responsive-nav-link>
            <x-jet-responsive-nav-link href="{{ route('user.myteam') }}" :active="request()->routeIs('user.myteam')">
                {{ __('Mijn selectie') }}
            </x-jet-responsive-nav-link>
            <x-jet-responsive-nav-link href="{{ route('player.index') }}" :active="request()->routeIs('player.index')">
                {{ __('Spelers') }}
            </x-jet-responsive-nav-link>
            <x-jet-responsive-nav-link href="{{ route('user.index',1) }}" :active="request()->routeIs('user.index.*')">
                {{ __('Ranglijst') }}
            </x-jet-responsive-nav-link>
            <x-jet-responsive-nav-link href="{{ route('subleague.index') }}"
                :active="request()->routeIs('subleague.index')">
                {{ __('Subleagues') }}
            </x-jet-responsive-nav-link>
            <x-jet-responsive-nav-link href="{{ route('match.index') }}" :active="request()->routeIs('match.index')">
                {{ __('Wedstrijden') }}
            </x-jet-responsive-nav-link>
            <x-jet-responsive-nav-link href="{{ route('statistics') }}" :active="request()->routeIs('statistics')">
                {{ __('Statistieken') }}
            </x-jet-responsive-nav-link>
            <x-jet-responsive-nav-link href="{{ route('rules') }}" :active="request()->routeIs('rules')">
                {{ __('Spelregels') }}
            </x-jet-responsive-nav-link>
            <x-jet-responsive-nav-link href="{{ route('prizes') }}" :active="request()->routeIs('prizes')">
                {{ __('Prijzenpot') }}
            </x-jet-responsive-nav-link>
            @role('superadmin')
            <x-jet-responsive-nav-link href="{{ route('addmatch') }}" :active="request()->routeIs('addmatch')">
                {{ __('Wedstrijd toevoegen') }}
            </x-jet-responsive-nav-link>
            <x-jet-responsive-nav-link href="{{ route('article.create') }}"
                :active="request()->routeIs('article.create')">
                {{ __('Nieuws toevoegen') }}
            </x-jet-responsive-nav-link>
            <x-jet-responsive-nav-link href="{{ route('notification.create') }}" :active="request()->routeIs('notification.create')">
                {{ __('Notificatie toevoegen') }}
            </x-jet-responsive-nav-link>
            @endrole
        </div>

        <!-- Responsive Settings Options -->
        <div class="pt-4 pb-1 border-t border-gray-200">
            <div class="flex items-center px-4">
                @if (Laravel\Jetstream\Jetstream::managesProfilePhotos())
                <div class="flex-shrink-0 mr-3">
                    <img class="h-10 w-10 rounded-full object-cover" src="{{ Auth::user()->profile_photo_url }}"
                        alt="{{ Auth::user()->first_name }}" />
                </div>
                @endif

                <div>
                    <div class="font-medium text-base text-gray-800">{{ Auth::user()->first_name }}</div>
                    <div class="font-medium text-sm text-gray-500">{{ Auth::user()->email }}</div>
                </div>
            </div>

            <div class="mt-3 space-y-1">
                <!-- Account Management -->
                <x-jet-responsive-nav-link href="{{ route('profile.show') }}"
                    :active="request()->routeIs('profile.show')">
                    {{ __('Profiel') }}
                </x-jet-responsive-nav-link>

                @if (Laravel\Jetstream\Jetstream::hasApiFeatures())
                <x-jet-responsive-nav-link href="{{ route('api-tokens.index') }}"
                    :active="request()->routeIs('api-tokens.index')">
                    {{ __('API Tokens') }}
                </x-jet-responsive-nav-link>
                @endif

                <!-- Authentication -->
                <form method="POST" action="{{ route('logout') }}">
                    @csrf

                    <x-jet-responsive-nav-link href="{{ route('logout') }}" onclick="event.preventDefault();
                                    this.closest('form').submit();">
                        {{ __('Uitloggen') }}
                    </x-jet-responsive-nav-link>
                </form>
            </div>
        </div>
    </div>
</nav>
