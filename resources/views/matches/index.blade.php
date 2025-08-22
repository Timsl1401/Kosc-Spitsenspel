<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Wedstrijden') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="flex flex-wrap">
                @foreach ($matches as $match)
                    <div class="w-full md:w-1/3 mb-2">
                        <div class="p-6 bg-white shadow-md rounded-lg md:mr-2">
                            @role('superadmin')
                                <div class="flex justify-between mb-6">
                                    <div>ID: {{ $match->id }}</div>
                                    <a onclick="return confirm('Weet je het zeker? Deze actie kan niet ongedaan gemaakt worden!')"
                                        class="text-red-500 font-bold" href="{{ route('match.delete', $match) }}">Wedstrijd
                                        verwijderen</a>
                                </div>
                            @endrole
                            <div class="text-center">
                                <span
                                    class="text-gray-600 text-sm mb-2 block">{{ \Carbon\Carbon::parse($match->date)->format('d-m-Y') }}</span>
                                @if ($match->home_away == 'home')
                                    <span class="text-lg font-semibold">{{ $match->team->name }}</span> -
                                    {{ $match->opponent }}
                                @else
                                    {{ $match->opponent }} - <span
                                        class="text-lg font-semibold">{{ $match->team->name }}</span>
                                @endif
                            </div>
                            <div class="text-center my-3">
                                <span class="text-gray-500 text-2xl">
                                    {{ $match->home_goals }} - {{ $match->away_goals }}
                                </span>
                            </div>
                            <div class="text-center text-sm italic">
                                @foreach ($match->playerGoals as $goalscorer => $goals)
                                    @if (!$loop->last)
                                        {{ $goalscorer }} {{ $goals }}x,
                                    @else
                                        {{ $goalscorer }} {{ $goals }}x
                                    @endif
                                @endforeach
                            </div>
                            <div class="text-center text-sm italic text-gray-500">
                                {{ $match->comments }}
                            </div>
                        </div>
                    </div>
                @endforeach
                <div class="w-full text-center mt-4">
                    {{ $matches->links() }}
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
