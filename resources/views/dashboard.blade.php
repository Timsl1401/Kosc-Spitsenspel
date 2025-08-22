<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Welkom, {{ Auth::user()->first_name }}!
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="rounded-md bg-blue-100 p-4 mb-6">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <!-- Heroicon name: solid/information-circle -->
                        <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-semibold text-blue-800">
                            {!! $notification->notification !!}
                        </h3>
                        {{-- <div class="mt-2 text-sm text-blue-700">
                            <p>
                                Op zoek naar onze app? Lees
                                <a href="{{ route('rules') }}">hier</a> hoe je het spitsenspel kunt toevoegen aan je
                                telefoon.
                            </p>
                        </div> --}}
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap mb-6">
                <div class="w-full md:w-1/3">
                    <div class="bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h3 class="text-lg leading-6 font-medium text-gray-900">Uitleg en regels</h3>
                            <div class="mt-2 sm:flex sm:items-start sm:justify-between">
                                <div class="max-w-xl text-sm text-gray-500">
                                    <p>Lees voordat je meespeelt eerst de uitleg en regels, zo weet je zeker dat alles
                                        goed gaat!</p>
                                </div>
                                <div class="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
                                    <a href="{{ route('rules') }}" type="button"
                                        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm">Naar
                                        spelregels</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-1/3 md:px-4">
                    <div class="bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h3 class="text-lg leading-6 font-medium text-gray-900">Toevoegen aan startscherm</h3>
                            <div class="mt-2 sm:flex sm:items-start sm:justify-between">
                                <div class="max-w-xl text-sm text-gray-500">
                                    <p>Ben je op zoek naar onze app? Lees hier hoe je het spitsenspel toevoegt aan je
                                        telefoon!</p>
                                </div>
                                <div class="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
                                    <a href="{{ route('add-to-homescreen') }}" type="button"
                                        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm">Toevoegen</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-1/3">
                    <div class="bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h3 class="text-lg leading-6 font-medium text-gray-900">Statistieken vorig seizoen</h3>
                            <div class="mt-2 sm:flex sm:items-start sm:justify-between">
                                <div class="max-w-xl text-sm text-gray-500">
                                    <p>Download hier de statistieken van vorig seizoen en doe er je voordeel mee!</p>
                                </div>
                                <div class="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
                                    <a href="{{ Storage::url('Statistieken_Spitsenspel_2021_2022.xlsx') }}"
                                        type="button"
                                        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm">Downloaden</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap">
                <div class="w-full md:w-1/3">
                    <h2 class="text-lg font-semibold ml-2 md:ml-0 mb-2">Info</h2>
                    <div class="flex flex-col md:mr-2 mb-4">
                        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                    <table class="min-w-full divide-y divide-gray-200">
                                        <tbody>
                                            @foreach ($info as $key => $value)
                                                @if ($loop->odd)
                                                    <tr class="bg-white">
                                                        <td
                                                            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {{ $key }}
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {{ $value }}
                                                        </td>
                                                    </tr>
                                                @else
                                                    <tr class="bg-gray-50">
                                                        <td
                                                            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {{ $key }}
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {{ $value }}
                                                        </td>
                                                    </tr>
                                                @endif
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-1/3">
                    <h2 class="text-lg font-semibold ml-2 mb-2">Top 10</h2>
                    <div class="flex flex-col md:mx-2 mb-4">
                        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                    <table class="min-w-full divide-y divide-gray-200">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th scope="col"
                                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    #
                                                </th>
                                                <th scope="col"
                                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Naam
                                                </th>
                                                <th scope="col"
                                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Punten
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @foreach ($top10 as $topuser)
                                                @if ($loop->odd)
                                                    <tr class="bg-white">
                                                        <td
                                                            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {{ $loop->iteration }}
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <a class="font-semibold hover:text-green-500"
                                                                href="{{ route('user.profile.view', $topuser) }}">
                                                                {{ $topuser->first_name }} {{ $topuser->last_name }}
                                                            </a>
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {{ $topuser->total_points }}
                                                        </td>
                                                    </tr>
                                                @else
                                                    <tr class="bg-gray-50">
                                                        <td
                                                            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {{ $loop->iteration }}
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <a class="font-semibold hover:text-green-500"
                                                                href="{{ route('user.profile.view', $topuser) }}">
                                                                {{ $topuser->first_name }} {{ $topuser->last_name }}
                                                            </a>
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {{ $topuser->total_points }}
                                                        </td>
                                                    </tr>
                                                @endif
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-1/3">
                    <h2 class="text-lg font-semibold ml-2 mb-2">Mijn selectie</h2>
                    <div class="flex flex-col md:ml-2 mb-4">
                        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                    <table class="min-w-full divide-y divide-gray-200">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th scope="col"
                                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Naam
                                                </th>
                                                <th scope="col"
                                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Doelpunten
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            @foreach ($myteam as $player)
                                                @if ($loop->odd)
                                                    <tr class="bg-white">
                                                        <td
                                                            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                                            <a href="{{ route('player.view', $player->id) }}"
                                                                class="font-semibold hover:text-green-500">
                                                                {{ $player->name }}
                                                            </a>
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {{ $player->goals->count() }}
                                                        </td>
                                                    </tr>
                                                @else
                                                    <tr class="bg-gray-50">
                                                        <td
                                                            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                                            <a href="{{ route('player.view', $player->id) }}"
                                                                class="font-semibold hover:text-green-500">
                                                                {{ $player->name }}
                                                            </a>
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {{ $player->goals->count() }}
                                                        </td>
                                                    </tr>
                                                @endif
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h2 class="text-lg font-semibold ml-2 mb-2">Laatste nieuws</h2>
            <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6 mt-6">
                <div>
                    <ul role="list" class="divide-y divide-gray-200">
                        @foreach ($articles as $article)
                            <li class="py-4">
                                <div class="flex space-x-3">
                                    <img class="h-6 w-6 rounded-full" src="{{ $article->user->profile_photo_url }}"
                                        alt="">
                                    <div class="flex-1 space-y-1">
                                        <div class="flex items-center justify-between">
                                            <h3 class="text-sm font-medium">{{ $article->user->first_name }}
                                                {{ $article->user->last_name }}</h3>
                                            <p class="text-sm text-gray-500">
                                                {{ \Carbon\Carbon::parse($article->created_at)->diffForHumans() }}
                                            </p>
                                        </div>
                                        <p class="text-sm text-gray-500">
                                            {!! $article->content !!}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        @endforeach
                    </ul>
                    <div class="mt-3">
                        <a class="font-semibold text-green-600" href="{{ route('article.index') }}">Bekijk al het
                            nieuws</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
