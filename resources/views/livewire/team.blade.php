<div>
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

    <div>
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
                    {{ $substitutesRemaining }} / <span class="text-xs">{{ config('app.max_substitutes') }}</span>
                </dd>
            </div>
        </dl>
    </div>
    <div class="mt-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6 ml-3 md:ml-0">
            Mijn selectie
        </h3>
        <div class="flex flex-col">
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
                                        Waarde
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Doelpunten
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Positie
                                    </th>
                                    <th scope="col" class="relative px-6 py-3">
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($players as $player)
                                @if ($loop->odd)
                                <!-- Odd row -->
                                <tr class="bg-white">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <a href="{{ route('player.view', $player->id) }}" class="hover:text-green-500">
                                            {{ $player->name }}
                                        </a>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        &euro;{{ number_format($player->price, 0, ',', '.') }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ $player->goals->count() ?? 0 }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ $player->playerPosition->name }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        @if ($canTransfer == true)
                                        @if ($sellPlayerId == $player->id)
                                        <button wire:click="sellPlayer"
                                            class="bg-red-500 text-white text-sm rounded p-1 font-semibold">
                                            Weet je het zeker?
                                            </a>
                                            @else
                                            <button wire:click="sellPlayerConfirm({{ $player->id }})"
                                                class="text-red-600 hover:text-red-900">
                                                Verkoop
                                                </a>
                                                @endif
                                                @endif
                                    </td>
                                </tr>
                                @else
                                <!-- Even row -->
                                <tr class="bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <a href="{{ route('player.view', $player->id) }}" class="hover:text-green-500">
                                            {{ $player->name }}
                                        </a>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        &euro;{{ number_format($player->price, 0, ',', '.') }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ $player->goals->count() ?? 0 }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ $player->playerPosition->name }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        @if ($canTransfer == true)
                                        @if ($sellPlayerId == $player->id)
                                        <button wire:click="sellPlayer"
                                            class="bg-red-500 text-white text-sm rounded p-1 font-semibold">
                                            Weet je het zeker?
                                            </a>
                                            @else
                                            <button wire:click="sellPlayerConfirm({{ $player->id }})"
                                                class="text-red-600 hover:text-red-900">
                                                Verkoop
                                                </a>
                                                @endif
                                                @endif
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
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-6 ml-3 md:ml-0">
            Alle spelers
        </h3>
        @foreach ($teams as $team)
        <h3 class="leading-6 font-semibold text-gray-900 my-6 ml-3 md:ml-0">
            {{ $team->name }}
        </h3>
        <div class="flex flex-col">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table class="table-fixed min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col"
                                        class="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Naam
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Waarde
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Doelpunten
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Positie
                                    </th>
                                    <th scope="col" class="relative px-6 py-3">
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($team->players as $player)
                                @if ($loop->odd)
                                <!-- Odd row -->
                                <tr class="bg-white">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <a href="{{ route('player.view', $player->id) }}" class="hover:text-green-500">
                                            {{ $player->name }}
                                        </a>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        &euro;{{ number_format($player->price, 0, ',', '.') }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ $player->goals->count() ?? 0 }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ $player->playerPosition->name }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        @if ($canTransfer == true && !Auth::user()->players()->find($player->id))
                                        @if ($buyPlayerId == $player->id)
                                        <button wire:click="buyPlayer"
                                            class="bg-red-500 text-white text-sm rounded p-1 font-semibold">
                                            Weet je het zeker?
                                            </a>
                                            @else
                                            <button wire:click="buyPlayerConfirm({{ $player->id }})"
                                                class="text-green-600 hover:text-green-900">
                                                Koop
                                                </a>
                                                @endif
                                                @endif
                                    </td>
                                </tr>
                                @else
                                <!-- Even row -->
                                <tr class="bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <a href="{{ route('player.view', $player->id) }}" class="hover:text-green-500">
                                            {{ $player->name }}
                                        </a>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        &euro;{{ number_format($player->price, 0, ',', '.') }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ $player->goals->count() ?? 0 }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ $player->playerPosition->name }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        @if ($canTransfer == true && !Auth::user()->players()->find($player->id))
                                        {{-- <button wire:click="buyPlayer({{ $player->id }})"
                                        class="text-green-600 hover:text-green-900">Koop</button> --}}
                                        @if ($buyPlayerId == $player->id)
                                        <button wire:click="buyPlayer"
                                            class="bg-red-500 text-white text-sm rounded p-1 font-semibold">
                                            Weet je het zeker?
                                            </a>
                                            @else
                                            <button wire:click="buyPlayerConfirm({{ $player->id }})"
                                                class="text-green-600 hover:text-green-900">
                                                Koop
                                                </a>
                                                @endif
                                                @endif
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
        @endforeach

        {{-- <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
    <h2 class="font-bold">Alle spelers</h2>
    @foreach ($teams as $team)
    <div>
        <h3 class="font-semibold mt-3">{{ $team->name }}</h3>
        @foreach ($team->players as $player)
        {{ $player->name }} <span
            class="text-xs italic">(&euro;{{ number_format($player->price, 0, ',', '.') }})</span><br>
        @endforeach
    </div>
    @endforeach
</div> --}}

</div>
</div>
