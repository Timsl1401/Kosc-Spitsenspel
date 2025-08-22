<x-app-layout>
    {{-- <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ $user->first_name }} {{ $user->last_name }}
        </h2>
    </x-slot> --}}

    <!-- Page header -->
    <div class="bg-white shadow">
        <div class="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <div class="py-6 md:flex md:items-center md:justify-between">
                <div class="flex-1 min-w-0">
                    <!-- Profile -->
                    <div class="flex items-center">
                        <img class="hidden h-16 w-16 rounded-full sm:block" src="{{ $user->profile_photo_url }}" alt="">
                        <div>
                            <div class="flex items-center">
                                <img class="h-16 w-16 rounded-full sm:hidden" src="{{ $user->profile_photo_url }}"
                                    alt="">
                                <h1 class="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                                    {{ $user->first_name }} {{ $user->last_name }}
                                </h1>
                            </div>
                            <dl class="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                                <dt class="sr-only">Team</dt>
                                <dd class="flex items-center text-sm text-gray-500 font-medium capitalize sm:mr-6">
                                    {{ $user->my_team }}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="flex flex-wrap">
                <div class="w-full md:w-1/2">
                    <h2 class="text-lg font-semibold ml-2 md:ml-0 mb-2">Selectie van {{ $user->first_name }}</h2>
                    @if (\Carbon\Carbon::now() >= \Carbon\Carbon::parse(config('app.start_deadline')) ||
                    Auth::user()->id == $user->id)
                    <div class="flex flex-col md:mr-2 mb-4">
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
                                            @foreach ($user->players as $player)
                                            @if ($loop->odd)
                                            <tr class="bg-white">
                                                <td
                                                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    <a href="{{ route('player.view', $player->id) }}"
                                                        class="hover:text-green-500">
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
                                                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    <a href="{{ route('player.view', $player->id) }}"
                                                        class="hover:text-green-500">
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
                    @else
                    Je kunt de selectie van andere spelers pas bekijken na de start van het seizoen.
                    @endif

                </div>
                <div class="w-full md:w-1/2">
                    <h2 class="text-lg font-semibold ml-2 mb-2">Profiel van {{ $user->first_name }}</h2>
                    <div class="flex flex-col md:ml-2 mb-4">
                        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                    <table class="min-w-full divide-y divide-gray-200">
                                        <tbody>
                                            <tr class="bg-white">
                                                <td
                                                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    Naam
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {{ $user->first_name }} {{ $user->last_name }}
                                                </td>
                                            </tr>
                                            <tr class="bg-gray-50">
                                                <td
                                                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    Teamwaarde
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    &euro;{{ number_format($user->players->sum('price'), 0, ',', '.') }}
                                                </td>
                                            </tr>
                                            <tr class="bg-white">
                                                <td
                                                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    Team
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {{ $user->my_team }}
                                                </td>
                                            </tr>
                                            <tr class="bg-gray-50">
                                                <td
                                                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    Leeftijd
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {{ date_diff(date_create($user->birth_date), date_create('now'))->y
                                                    }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full">
                    <h2 class="text-lg font-semibold ml-2 md:ml-0 mb-2">Behaalde punten</h2>
                    <!-- This example requires Tailwind CSS v2.0+ -->
                    <div class="flex flex-col">
                        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                    <table class="min-w-full divide-y divide-gray-200">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th scope="col"
                                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Datum
                                                </th>
                                                <th scope="col"
                                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aantal
                                                </th>
                                                <th scope="col"
                                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Wedstrijd
                                                </th>
                                                <th scope="col"
                                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Doelpuntenmaker
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @foreach ($pointsEarned as $point)
                                            @if ($loop->odd)
                                            <!-- Odd row -->
                                            <tr class="bg-white">
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {{ \Carbon\Carbon::parse($point->match->date)->format('d-m-Y') }}
                                                </td>
                                                <td
                                                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {{ $point->amount }}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    @if ($point->match->home_away == 'home')
                                                    {{ $point->match->team->name }} - {{ $point->match->opponent }}
                                                    @else
                                                    {{ $point->match->opponent }} - {{ $point->match->team->name }}
                                                    @endif
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    @if ($point->player == null)
                                                    Tot hier werden spelers niet bijgehouden
                                                    @else
                                                    {{ $point->player->name }}
                                                    @endif

                                                </td>

                                            </tr>
                                            @else
                                            <!-- Even row -->
                                            <tr class="bg-gray-50">
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {{ \Carbon\Carbon::parse($point->match->date)->format('d-m-Y') }}
                                                </td>
                                                <td
                                                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {{ $point->amount }}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    @if ($point->match->home_away == 'home')
                                                    {{ $point->match->team->name }} - {{ $point->match->opponent }}
                                                    @else
                                                    {{ $point->match->opponent }} - {{ $point->match->team->name }}
                                                    @endif
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    @if ($point->player == null)
                                                    Tot hier werden spelers niet bijgehouden
                                                    @else
                                                    {{ $point->player->name }}
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

                </div>
                @role('superadmin')
                <div class="w-full mt-6">
                    <h2 class="text-lg font-semibold ml-2 md:ml-0 mb-2">Mail deze gebruiker</h2>
                    <div class="w-full bg-white rounded-xl shadow-md p-6">
                        <div>
                            <form action="{{ route('notify-user', $user) }}" method="post">
                                @csrf
                            <label for="emailbody" class="block text-sm font-medium text-gray-700">Type hier de tekst voor de mail.</label>
                            <div class="mt-1">
<textarea rows="10" name="emailbody" id="emailbody"
class="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
<button class="rounded p-2 bg-green-500 text-white font-semibold mt-2" type="submit">E-mail verzenden</button>
</form>
                            </div>
                        </div>
                    </div>
                </div>
                @endrole
            </div>
        </div>
    </div>
</x-app-layout>
