<x-app-layout>
    <x-slot name="header">
        <div class="flex flex-wrap justify-between">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ $subleague->name }}
            </h2>
            <div>
                @if ($subleague->users->contains(Auth::user()->id))
                <a href="{{ route('subleague.leave', $subleague) }}"
                    class="rounded bg-gray-300 text-gray-800 px-3 py-2">Subleague
                    verlaten</a>
                @endif
            </div>
        </div>
    </x-slot>

    @if (session()->has('message'))
    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div class="flex">
            <div class="flex-shrink-0">
                <!-- Heroicon name: solid/exclamation -->
                <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                    fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd" />
                </svg>
            </div>
            <div class="ml-3">
                <p class="text-sm text-yellow-700">
                    {{ session('message') }}
                </p>
            </div>
        </div>
    </div>
    @endif

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            @if (Auth::user()->id == $subleague->user_id)
            <div class="rounded-md bg-blue-100 p-4 mb-4">
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
                    <div class="ml-3 flex-1 md:flex md:justify-between">
                        <p class="text-sm text-blue-700">
                            Nodig vrienden uit voor jouw subleague:
                            <span
                                class="p-1 rounded bg-gray-300 text-gray-800 md:ml-2">{{ url('subleague/join', [$subleague, $subleague->invite_code]) }}</span>
                        </p>
                        <p class="mt-3 text-sm md:mt-0 md:ml-6">
                            <a href="whatsapp://send?text=Doe mee met mijn subleague ({{ $subleague->name }}) in het KOSC Spitsenspel {{ url('subleague/join', [$subleague, $subleague->invite_code]) }}"
                                class="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">Delen
                                <span aria-hidden="true">&rarr;</span></a>
                        </p>
                    </div>
                </div>
            </div>
            @endif
            <div class="flex flex-col">
                <h2 class="font-semibold mb-2 text-lg">Stand
                </h2>
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
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Teamwaarde
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Team
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($total as $user)
                                    @if ($loop->odd)
                                    <!-- Odd row -->
                                    <tr class="bg-white {{ (Auth::user()->id == $user->id ? 'bg-green-100' : '') }}">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {{ $loop->iteration }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <a href="{{ route('user.profile.view', $user) }}"
                                                class="font-semibold hover:text-green-500">
                                                {{ $user->first_name }} {{ $user->last_name }}
                                            </a>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ $user->points()->sum('amount') }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            &euro;{{ number_format($user->players()->sum('price'), 0, ',', '.') }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ $user->my_team }}
                                        </td>
                                    </tr>
                                    @else
                                    <!-- Even row -->
                                    <tr class="bg-gray-50 {{ (Auth::user()->id == $user->id ? 'bg-green-100' : '') }}">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {{ $loop->iteration }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <a href="{{ route('user.profile.view', $user) }}"
                                                class="font-semibold hover:text-green-500">
                                                {{ $user->first_name }} {{ $user->last_name }}
                                            </a>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ $user->points()->sum('amount') }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            &euro;{{ number_format($user->players()->sum('price'), 0, ',', '.') }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ $user->my_team }}
                                        </td>
                                    </tr>
                                    @endif
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                        <div class="mt-5">{{ $total->links() }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
