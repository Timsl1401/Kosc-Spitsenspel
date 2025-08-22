<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Melding op dashboard aanpassen') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                <div class="">
                    <form action="{{ route('notification.store') }}" method="POST">
                        @csrf
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700">Notificatie</label>
                            <div class="mt-1">
                                <input type="text" name="notification"
                                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    placeholder="Type hier de melding die op het dashboard moet verschijnen">
                            </div>
                        </div>
                    <button type="submit" class="bg-blue-500 text-white font-bold p-2 rounded mt-3">Voeg notificatie toe</button>
                    </form>

                </div>
            </div>
        </div>
    </div>
</x-app-layout>
