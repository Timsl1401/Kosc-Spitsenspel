<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Artikelen') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                <div>
                    <ul role="list" class="divide-y divide-gray-200">
                        @foreach ($articles as $article)
                        <li class="py-4">
                            <div class="flex space-x-3">
                                <img class="h-6 w-6 rounded-full" src="{{ $article->user->profile_photo_url }}" alt="">
                                <div class="flex-1 space-y-1">
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-sm font-medium">{{ $article->user->first_name }}
                                            {{ $article->user->last_name }}</h3>
                                        <p class="text-sm text-gray-500">
                                            {{ \Carbon\Carbon::parse($article->created_at)->diffForHumans() }}</p>
                                    </div>
                                    <p class="text-sm text-gray-500">
                                        {!! $article->content !!}
                                    </p>
                                </div>
                            </div>
                        </li>
                        @endforeach
                    </ul>
                    {{ $articles->links() }}
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
