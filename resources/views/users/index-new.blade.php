<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Ranglijst') }}
        </h2>
    </x-slot>

    <div class="py-12">

        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <livewire:period-select />
            {{-- Totaal stand --}}
            <div class="flex flex-col">
                <h2 class="font-semibold mb-2 text-lg">{{ $period->name }} <span
                        class="text-sm text-gray-700">({{ \Carbon\Carbon::parse($period->start)->format('d-m-Y') }} -
                        {{ \Carbon\Carbon::parse($period->end)->format('d-m-Y') }})</span>
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
                                            {{ ($total->currentpage()-1) * $total->perpage() + $loop->index +1 }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <a href="{{ route('user.profile.view', $user) }}"
                                                class="font-semibold hover:text-green-500">
                                                {{ $user->first_name }} {{ $user->last_name }}
                                            </a>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ $user->points()->whereBetween('created_at', [$period->start, $period->end])->sum('amount') }}
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
                                            {{ ($total->currentpage()-1) * $total->perpage() + $loop->index +1 }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <a href="{{ route('user.profile.view', $user) }}"
                                                class="font-semibold hover:text-green-500">
                                                {{ $user->first_name }} {{ $user->last_name }}
                                            </a>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ $user->points()->whereBetween('created_at', [$period->start, $period->end])->sum('amount') }}
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
            {{-- Periode 1 stand --}}
            {{-- <div class="flex flex-col mt-6">
                <h2 class="font-semibold mb-2 text-lg">Periode 1 (Winterkampioen)</h2>
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
                                    @foreach ($period1 as $user)
                                    @if ($loop->odd)
                                    <!-- Odd row -->
                                    <tr class="bg-white">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {{ $loop->iteration }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <a href="{{ route('user.profile.view', $user) }}" class="font-semibold hover:text-green-500">
                    {{ $user->first_name }} {{ $user->last_name }}
                </a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ $user->points()->whereBetween('created_at', [env('PERIOD_1_START'), env('PERIOD_1_END')])->sum('amount') }}
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
            <tr class="bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ $loop->iteration }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a href="{{ route('user.profile.view', $user) }}" class="font-semibold hover:text-green-500">
                        {{ $user->first_name }} {{ $user->last_name }}
                    </a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ $user->points()->whereBetween('created_at', [env('PERIOD_1_START'), env('PERIOD_1_END')])->sum('amount') }}
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
    </div>
    </div>
    </div> --}}
    {{-- Periode 2 stand --}}
    {{-- <div class="flex flex-col mt-6">
                <h2 class="font-semibold mb-2 text-lg">Periode 2 (Zomerkampioen)</h2>
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
                                    @foreach ($period2 as $user)
                                    @if ($loop->odd)
                                    <!-- Odd row -->
                                    <tr class="bg-white">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {{ $loop->iteration }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <a href="{{ route('user.profile.view', $user) }}" class="font-semibold hover:text-green-500">
            {{ $user->first_name }} {{ $user->last_name }}
        </a>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {{ $user->points()->whereBetween('created_at', [env('PERIOD_2_START'), env('PERIOD_2_END')])->sum('amount') }}
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
    <tr class="bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {{ $loop->iteration }}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <a href="{{ route('user.profile.view', $user) }}" class="font-semibold hover:text-green-500">
                {{ $user->first_name }} {{ $user->last_name }}
            </a>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ $user->points()->whereBetween('created_at', [env('PERIOD_2_START'), env('PERIOD_2_END')])->sum('amount') }}
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
    </div>
    </div>
    </div> --}}
    </div>
    </div>
</x-app-layout>
