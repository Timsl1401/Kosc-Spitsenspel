<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Prijzenpot') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                <div class="">
                    <h2 class="text-lg font-semibold">Maak kans op mooie prijzen!</h2>
                    De prijzenpot wordt binnenkort bekend gemaakt!
                    {{-- Als je meespeelt met het KOSC Spitsenspel maak je gratis kans op de volgende mooie prijzen:<br><br>
                    - Voor 4 personen all-inclusive naar de skybox van Grolsch in de Grolsch Veste in het seizoen 2022-2023.<br>
                    - Een elektrische scooter rit voor 8 personen t.w.v. €220,- verzorgd door Twentetoer.<br>
                    - Een prachtige fauteuil t.w.v. €395,- verzorgd door Kato.<br>
                    - Dolphin Shower Set Lux regendouche t.w.v. €299,- verzorgd door Kabra.<br>
                    - Tegoedbon t.w.v. &euro;50 verzorgd door en te besteden bij Camping de Bronnen.<br>
                    - Schilderij t.w.v. €45,- verzorgd door Madison.<br>
                    - 3x Bierpakket t.w.v. &euro;25 verzorgd door Othmar Bier.<br>
                    - 3x Een wasbon t.w.v. €12,- verzorgd door Heisterkamp Auto's. --}}
                    <br><br>
                    <strong>En daarnaast iedere maand een tegoedbon voor de top 3 van de maand, te besteden bij en
                        verzorgd door Café 'n Deurloop.</strong><br><br>
                    1. €30,-<br>
                    2. €20,-<br>
                    3. €10,-<br>
                    <span class="italic">* Maandprijzen zijn alleen te winnen wanneer er minimaal 2 volledige speelrondes
                        zijn gespeeld in de betreffende maand.</span>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
