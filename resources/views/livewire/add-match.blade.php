<div class="p-6">
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
        <label for="matchDate" class="block text-sm font-medium text-gray-700">Datum</label>
        <div class="mt-1">
            <input wire:model.lazy="matchDate" type="date" value="{{ $matchDate }}" name="matchDate" id="matchDate"
                class="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md">
        </div>
    </div>
    <div class="mt-6">
        <label for="teamselect" class="block text-sm font-medium text-gray-700">Kies een team</label>
        <select wire:model="selectedTeam" id="teamselect" name="teamselect"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
            <option selected>Maak een keuze</option>
            @foreach ($teams as $team)
            <option value="{{ $team->id }}">{{ $team->name }}</option>
            @endforeach
        </select>
    </div>
    @if ($selectedTeam)

    <div class="mt-6">
        <label for="homeAway" class="block text-sm font-medium text-gray-700">Speelde het team uit of thuis?</label>
        <select wire:model="homeAway" id="homeAway" name="homeAway"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
            <option selected>Maak een keuze</option>
            <option value="home">Thuis</option>
            <option value="away">Uit</option>
        </select>
    </div>
    <div class="mt-6">
        <label for="opponent" class="block text-sm font-medium text-gray-700">Tegenstander</label>
        <div class="mt-1">
            <input wire:model.lazy="opponent" type="text" name="opponent" id="opponent"
                class="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="bijv. UD Weerselo 5" required>
        </div>
    </div>
    <div class="flex flex-wrap">
        <div class="mt-6 mr-2">
            <label for="homeGoals" class="block text-sm font-medium text-gray-700">Score
                <span class="font-bold">{{ ($homeAway == 'home' ? $teamObject->name : $opponent) }}</span>
            </label>
            <div class="mt-1">
                <input wire:model.lazy="homeGoals" type="number" name="homeGoals" id="homeGoals"
                    class="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required>
            </div>
        </div>
        <div class="mt-6">
            <label for="awayGoals" class="block text-sm font-medium text-gray-700">Score
                <span class="font-bold">{{ ($homeAway == 'away' ? $teamObject->name : $opponent) }}</span>
            </label>
            <div class="mt-1">
                <input wire:model.lazy="awayGoals" type="number" name="awayGoals" id="awayGoals"
                    class="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required>
            </div>
        </div>
    </div>

    <div class="mt-6">
        <h3 class="font-semibold">Aantal doelpunten:</h3>
        @foreach ($teamObject->players as $player)
        <div class="mt-2">
            {{ $player->name }} <button wire:click="removeGoalFromPlayer({{ $player->id }})"
                class="bg-red-500 text-white font-bold p-2 rounded">-</button>
            <span class="text-xl font-bold">{{ $goalscorers[$player->id] }}</span>
            <button wire:click="addGoalToPlayer({{ $player->id }})"
                class="bg-green-500 text-white font-bold p-2 rounded">+</button>
        </div>
        @endforeach
        <div class="mt-6">
            <input type="checkbox" wire:model="guestPlayerScored"> Gastspeler gescoord?
            @if ($guestPlayerScored)
            @foreach ($players as $player)
            <div class="mt-2">
                {{ $player->name }} <button wire:click="removeGoalFromPlayer({{ $player->id }})"
                    class="bg-red-500 text-white font-bold p-2 rounded">-</button>
                <span class="text-xl font-bold">{{ $goalscorers[$player->id] }}</span>
                <button wire:click="addGoalToPlayer({{ $player->id }})"
                    class="bg-green-500 text-white font-bold p-2 rounded">+</button>
            </div>
            @endforeach
            @endif
        </div>
        <div class="mt-6">
            <input type="checkbox" wire:model="commentsNeeded"> Opmerking toevoegen
            @if ($commentsNeeded)
            <div>
                <textarea wire:model="comments" name="comments" cols="30" rows="10"></textarea>
            </div>
            @endif
        </div>
        <div class="p-2 bg-yellow-200 mt-6 rounded">{{ ($homeAway == 'home' ? $teamObject->name : $opponent) }}
            <span class="bg-blue-200 p-1 rounded font-bold">{{ $homeGoals }} - {{ $awayGoals }}</span> {{
            ($homeAway == 'away' ? $teamObject->name : $opponent) }} <br> Totaal aantal doelpunten gemaakt door KOSC
            spelers:
            <span class="text-lg font-bold">{{ array_sum($this->goalscorers) }}</span>, klopt dit?
        </div>

    </div>
    <div class="mt-6">
        @if ($confirmAddMatch)
        <button wire:click="addMatchToDatabase" class="bg-red-500 text-white font-bold p-2 rounded">
            Weet je zeker dat je alles goed hebt ingevuld en de wedstrijd wilt toevoegen?
        </button>
        @else
        <button wire:click="sureAddMatch" class="bg-blue-500 text-white font-bold p-2 rounded">
            Wedstrijd en doelpunten toevoegen aan database
        </button>
        @endif

    </div>
    @endif
</div>
