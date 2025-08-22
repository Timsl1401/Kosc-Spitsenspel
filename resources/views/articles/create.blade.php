<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Artikel toevoegen') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                <form method="POST" action="{{ route('article.store') }}">
                    @csrf
                    <div>
                        <label for="title" class="block text-sm font-medium text-gray-700">Titel</label>
                        <div class="mt-1">
                            <input type="text" name="title" id="title"
                                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                required>
                        </div>
                    </div>
                    <div class="mt-4">
                        <label for="title" class="block text-sm font-medium text-gray-700">Nieuwsbericht</label>
                        <div class="mt-1">
                            <textarea class="ckeditor" name="content"></textarea>
                        </div>
                    </div>
                    <button class="rounded bg-green-700 text-white text-lg p-2 mt-4" type="submit">Bericht
                        plaatsen</button>
                </form>
            </div>
        </div>
    </div>
    @push('scripts')
    <script src="//cdn.ckeditor.com/4.16.2/basic/ckeditor.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            $('.ckeditor').ckeditor();
        });
    </script>
    @endpush
</x-app-layout>
