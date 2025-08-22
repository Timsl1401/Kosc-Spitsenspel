<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Spelregels') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                <div class="">
                    <h2 class="text-lg font-semibold">Spelregels KOSC Spitsenspel</h2>
                    <div class="bg-gray-100 p-3 rounded mb-2">Kies maximaal {{ config('app.max_players') }} spelers uit
                        de spelerslijst, minder dan
                        {{ config('app.max_players') }} mag ook, voor een totaalwaarde van
                        &euro;{{ number_format(config('app.budget'), 0, ',', '.') }}. Aan
                        elke speler is een bepaalde
                        prijs gekoppeld. Wanneer de speler die jij hebt gekozen een doelpunt maakt, krijg je
                        hiervoor punten.</div>
                    <div class="bg-gray-100 p-3 rounded mb-2">Je krijgt alleen punten voor <span
                            class="font-bold ml-2">competitiewedstrijden</span>.</div>
                    <div class="bg-gray-100 p-3 rounded mb-2">
                        Je krijgt het volgende aantal punten voor spelers:<br>
                        KOSC 1: <span class="font-bold ml-2">3 punten</span><br>
                        KOSC 2: <span class="font-bold ml-2">2,5 punten</span><br>
                        KOSC 3: <span class="font-bold ml-2">2 punten</span><br>
                        KOSC 4 t/m 8: <span class="font-bold ml-2">1 punt</span><br>
                        {{-- KOSC JO19-1 & KOSC JO17-1: <span class="font-bold ml-2">2 punten</span> --}}
                    </div>
                    <div class="bg-gray-100 p-3 rounded mb-2">
                        Wanneer een gastspeler scoort, krijgt deze de punten die tellen voor het team waarbij de speler
                        meespeelt.<br>
                        Je krijgt per doelpunt het aantal punten dat geldt voor het team waarin de gastspeler mee deed.
                        Voorbeeld: Bas Bruns speelt mee met KOSC 1 en maakt 3 doelpunten, jij hebt Bas Bruns in je
                        team en ontvangt dus 3 * 3 = 9 punten.<br>
                    </div>
                    <div class="bg-gray-100 p-3 rounded mb-2">Het kopen van spelers is mogelijk tot
                        {{ config('app.start_deadline') }}, daarna is het niet
                        meer mogelijk om spelers te kopen en is je team definitief! Voor de tijd kun je zoveel wisselen
                        als je wilt.</div>
                    <div class="bg-gray-100 p-3 rounded mb-2">Na de start van het spel is het nog wel
                        mogelijk om maximaal 3 nieuwe spelers te kopen. Je moet hiervoor wel plek hebben in je
                        selectie (max. {{ config('app.max_players') }} spelers) en voldoende budget. Aan het verkopen
                        van spelers zit geen limiet. Let op dat je bij het transfereren van een speler zijn reeds
                        behaalde punten niet aan jouw puntentotaal worden
                        toegevoegd. Je krijgt enkel de punten die hij vanaf dat moment gaat binnenslepen. Hetzelfde
                        geldt voor een speler die je verkoopt; de reeds behaalde punten van deze speler blijven
                        behouden.<br>
                        In het weekend (za+zo) is het niet mogelijk om spelers te kopen of te verkopen.
                    </div>
                    <div class="bg-gray-100 p-3 rounded mb-2">
                        De doelpunten worden iedere week doorgegeven door de leiders in een hiervoor aangemaakte
                        WhatsApp groep.
                    </div>
                    <div class="bg-gray-100 p-3 rounded mb-2">
                        Bij een gelijke stand in een bepaalde periode wordt de volgende volgorde gehanteerd:<br>
                        1. Behaalde punten (aflopend)<br>
                        2. Teamwaarde (oplopend)<br>
                        3. Het aantal verschillende doelpuntenmakers in deze periode<br>
                        4. Datum van aanmelding (oplopend)<br>
                        Het is niet toegestaan om na het einde van een periode spelers te verkopen om je teamwaarde
                        omlaag te halen, hiervoor word je gediskwalificeerd.
                    </div>
                    <div class="bg-gray-100 p-3 rounded mb-2">
                        Prijzen dienen persoonlijk in ontvangst genomen te worden. Datum en locatie worden t.z.t.
                        bekendgemaakt.
                    </div>
                    <div class="bg-gray-100 p-3 rounded mb-2">
                        Valsspelen, in welke vorm dan ook, zal leiden tot diskwalificatie en uitsluiting tot deelname.
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
