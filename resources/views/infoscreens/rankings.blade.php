<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap">

    <!-- Styles -->
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">

    @livewireStyles

    <!-- Scripts -->
    <script src="{{ mix('js/app.js') }}" defer></script>

    <meta http-equiv="refresh" content="180">
</head>

<body class="font-sans antialiased bg-gray-100 min-h-screen">
    <div class="" style="">
        @include('infoscreens.header')
        <div class="py-2 flex items-stretch ">
            <div class="mx-auto">
                <div class="flex flex-col">
                    <div class="text-2xl text-center my-6">Algemeen klassement</div>
                    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                                                #
                                            </th>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                                                Naam
                                            </th>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                                                Punten
                                            </th>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                                                Team
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach ($total as $ranking)
                                        @if ($loop->odd)
                                        <tr class="bg-white" x-description="Odd row">
                                            <td class="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                                                {{ $ranking->rank }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                                                {{ $ranking->user->first_name }} {{ $ranking->user->last_name }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                                                {{ $ranking->points }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                                                {{ $ranking->user->my_team }}
                                            </td>
                                        </tr>
                                        @else
                                        <tr class="bg-gray-50" x-description="Even row">
                                            <td class="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                                                {{ $ranking->rank }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                                                {{ $ranking->user->first_name }} {{ $ranking->user->last_name }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                                                {{ $ranking->points }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                                                {{ $ranking->user->my_team }}
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
            <div class="mx-auto">
                <div class="flex flex-col">
                    <div class="text-2xl text-center my-6">{{ $period->name }} klassement</div>
                    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                                                #
                                            </th>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                                                Naam
                                            </th>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                                                Punten
                                            </th>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                                                Team
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach ($periodTotal as $ranking)
                                        @if ($loop->odd)
                                        <tr class="bg-white" x-description="Odd row">
                                            <td class="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                                                {{ $ranking->rank }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                                                {{ $ranking->user->first_name }} {{ $ranking->user->last_name }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                                                {{ $ranking->points }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                                                {{ $ranking->user->my_team }}
                                            </td>
                                        </tr>
                                        @else
                                        <tr class="bg-gray-50" x-description="Even row">
                                            <td class="px-6 py-4 whitespace-nowrap text-xl font-medium text-gray-900">
                                                {{ $ranking->rank }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                                                {{ $ranking->user->first_name }} {{ $ranking->user->last_name }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                                                {{ $ranking->points }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                                                {{ $ranking->user->my_team }}
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
            <div class="mx-auto w-1/4">
                <div>
                    <div class="text-2xl text-center my-6">Meest geselecteerde speler</div>
                    <div class="w-full bg-white shadow-md rounded-lg p-4 text-3xl text-center">
                        {{ $mostSelectedOverall->name }}
                        <span class="text-xl text-gray-700">
                            ({{ $mostSelectedOverall->total_users }})
                        </span>
                    </div>
                </div>
                <div>
                    <div class="text-2xl text-center mt-6  mb-3">Meeste goals gescoord</div>
                    <div class="w-full bg-white shadow-md rounded-lg p-4 text-3xl text-center">
                        {{ $mostgoals['key'] }}
                        <span class="text-xl text-gray-700">
                            ({{ $mostgoals['value'] }})
                        </span>
                    </div>
                </div>
                <div>
                    <div class="text-2xl text-center mt-6  mb-3">Meeste punten behaald (speler)</div>
                    <div class="w-full bg-white shadow-md rounded-lg p-4 text-3xl text-center">
                        {{ $mostpointsplayer['key'] }}
                        <span class="text-xl text-gray-700">
                            ({{ $mostpointsplayer['value'] }})
                        </span>
                    </div>
                </div>
                <div>
                    <div class="text-2xl text-center mt-6  mb-3">Meeste punten behaald (team)</div>
                    <div class="w-full bg-white shadow-md rounded-lg p-4 text-3xl text-center">
                        {{ $mostpointsteam['key'] }}
                        <span class="text-xl text-gray-700">
                            ({{ $mostpointsteam['value'] }})
                        </span>
                    </div>
                </div>
                <div>
                    <div class="text-2xl text-center mt-6  mb-3">Meeste goals gescoord (team)</div>
                    <div class="w-full bg-white shadow-md rounded-lg p-4 text-3xl text-center">
                        {{ $mostgoalsteam['key'] }}
                        <span class="text-xl text-gray-700">
                            ({{ $mostgoalsteam['value'] }})
                        </span>
                    </div>
                </div>
                <div>
                    <div class="text-2xl text-center mt-6  mb-3">MVP (meeste goals per €)</div>
                    <div class="w-full bg-white shadow-md rounded-lg p-4 text-3xl text-center">
                        {{ $mvp['key'] }}
                        <span class="text-xl text-gray-700">
                            (€{{ number_format($mvp['value'], 0, ',', '.') }})
                        </span>
                    </div>
                </div>
                <div>
                    <div class="text-2xl text-center mt-6  mb-3">LVP (minste goals per €)</div>
                    <div class="w-full bg-white shadow-md rounded-lg p-4 text-3xl text-center">
                        {{ $lvp['key'] }}
                        <span class="text-xl text-gray-700">
                            (€{{ number_format($lvp['value'], 0, ',', '.') }})
                        </span>
                    </div>
                </div>
            </div>
        </div>
        @include('infoscreens.footer')
    </div>
</body>

</html>
