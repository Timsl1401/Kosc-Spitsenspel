<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Subleague aanmaken') }}
        </h2>
    </x-slot>

    @if ($errors->any())
    <div class="bg-red-100 text-red-800 px-5 py-3 rounded mb-4">
        <ul>
            @foreach ($errors->all() as $error)
            <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
    @endif
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                <div>
                    <form action="{{ route('subleague.store') }}" method="post">
                        @csrf
                        <label for="name" class="block text-sm font-medium text-gray-700">Subleague naam</label>
                        <div class="mt-1">
                            <input type="text" name="name" id="name"
                                class="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Kantinebazen" required>
                        </div>
                        <button class="rounded bg-green-700 text-white text-lg p-2 mt-4" type="submit">Subleague
                            aanmaken
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
