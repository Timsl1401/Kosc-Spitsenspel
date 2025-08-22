<div>
    <div class="mb-6">
        <div class="sm:hidden">
            <label for="tabs" class="sr-only">Select a tab</label>
            <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
            <select wire:model="selectedPeriod"
                class="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                <option value="0">Maak een keuze</option>
                @foreach ($periods as $period)
                <option value="{{ $period->id }}">{{ $period->name }}</option>
                @endforeach
            </select>
        </div>
        <div class="hidden sm:block">
            <nav class="flex space-x-4" aria-label="Tabs">
                @foreach ($periods as $period)
                <a href="{{ route('user.index', $period->id) }}"
                    class="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md bg-gray-200">
                    {{ $period->name }}
                </a>
                @endforeach
            </nav>
        </div>
    </div>
</div>
