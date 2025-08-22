<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Alle spelers') }}
        </h2>
    </x-slot>

    <div class="py-12">

        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="mb-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 ml-3 md:ml-0">
                    Statistieken
                </h3>
                <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                        <dt class="text-sm font-medium text-gray-500 truncate">
                            Resterend budget
                        </dt>
                        <dd class="mt-1 text-3xl font-semibold text-gray-900">
                            &euro;{{ number_format($remainingBudget, 0, ',', '.') }} / <span
                                class="text-xs">&euro;{{ number_format(config('app.budget'), 0, ',', '.') }}</span>
                        </dd>
                    </div>

                    <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                        <dt class="text-sm font-medium text-gray-500 truncate">
                            Aantal spelers in selectie
                        </dt>
                        <dd class="mt-1 text-3xl font-semibold text-gray-900">
                            {{ $playersInTeamCount }} / <span class="text-xs">{{ config('app.max_players') }}</span>
                        </dd>
                    </div>

                    <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                        <dt class="text-sm font-medium text-gray-500 truncate">
                            Transfers resterend
                        </dt>
                        <dd class="mt-1 text-3xl font-semibold text-gray-900">
                            {{ $substitutesRemaining }} / <span
                                class="text-xs">{{ config('app.max_substitutes') }}</span>
                        </dd>
                    </div>
                </dl>
            </div>
            <livewire:players />
        </div>
    </div>
</x-app-layout>
