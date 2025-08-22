<x-guest-layout>
    <x-jet-authentication-card>
        <x-slot name="logo">
            <x-jet-authentication-card-logo />
        </x-slot>

        <x-jet-validation-errors class="mb-4" />

        <form method="POST" action="{{ route('register') }}">
            @csrf

            <div>
                <x-jet-label for="first_name" value="{{ __('Voornaam') }}" />
                <x-jet-input id="first_name" class="block mt-1 w-full" type="text" name="first_name"
                    :value="old('first_name')" required autofocus autocomplete="first_name" />
            </div>

            <div class="mt-4">
                <x-jet-label for="last_name" value="{{ __('Achternaam') }}" />
                <x-jet-input id="last_name" class="block mt-1 w-full" type="text" name="last_name"
                    :value="old('last_name')" required autofocus autocomplete="last_name" />
            </div>

            <div class="mt-4">
                <x-jet-label for="my_team" value="{{ __('Mijn team') }}" />
                <select class="block mt-1 w-full border-gray-300 focus:border-green-300
focus:ring focus:ring-green-200 focus:ring-opacity-50 rounded-md shadow-sm" name="my_team" id="my_team" name="my_team">
                    <option value="Toeschouwer">Toeschouwer</option>
                    <option value="KOSC 1">KOSC 1</option>
                    <option value="KOSC 2">KOSC 2</option>
                    <option value="KOSC 3">KOSC 3</option>
                    <option value="KOSC 4">KOSC 4</option>
                    <option value="KOSC 5">KOSC 5</option>
                    <option value="KOSC 6">KOSC 6</option>
                    <option value="KOSC 7">KOSC 7</option>
                    <option value="KOSC 8">KOSC 8</option>
                    <option value="KOSC 2 zat">KOSC 2 zat</option>
                    <option value="KOSC 3 zat">KOSC 3 zat</option>
                    <option value="KOSC 1">KOSC 1</option>
                    <option value="KOSC 2">KOSC 2</option>
                    <option value="KOSC 35+1">KOSC 35+1</option>
                    <option value="KOSC 35+2">KOSC 35+2</option>
                    <option value="KOSC 45+1">KOSC 45+1</option>
                    <option value="KOSC JO19-1">KOSC JO19-1</option>
                    <option value="KOSC JO19-2">KOSC JO19-2</option>
                    <option value="KOSC JO17-1">KOSC JO17-1</option>
                    <option value="KOSC JO17-2">KOSC JO17-2</option>
                    <option value="KOSC JO17-3">KOSC JO17-3</option>
                    <option value="KOSC JO15-1">KOSC JO15-1</option>
                    <option value="KOSC JO15-2">KOSC JO15-2</option>
                    <option value="KOSC JO13-1">KOSC JO13-1</option>
                    <option value="KOSC JO13-2">KOSC JO13-2</option>
                    <option value="KOSC JO11-1JM">KOSC JO11-1JM</option>
                    <option value="KOSC JO11-2">KOSC JO11-2</option>
                    <option value="KOSC JO10-1">KOSC JO10-1</option>
                    <option value="KOSC JO9-1">KOSC JO9-1</option>
                    <option value="KOSC JO9-2">KOSC JO9-2</option>
                    <option value="KOSC JO8-1">KOSC JO8-1</option>
                    <option value="KOSC JO8-2">KOSC JO8-2</option>
                    <option value="KOSC JO8-3">KOSC JO8-3</option>
                    <option value="KOSC VR30+1">KOSC VR30+1</option>
                    <option value="KOSC MO19-1">KOSC MO19-1</option>
                    <option value="KOSC MO13-1">KOSC MO13-1</option>
                </select>
            </div>

            <div class="mt-4">
                <x-jet-label for="birth_date" value="{{ __('Geboortedatum') }}" />
                <x-jet-input id="birth_date" class="block mt-1 w-full" type="date" name="birth_date"
                    :value="old('birth_date')" required autofocus autocomplete="birth_date" />
            </div>

            <div class="mt-4">
                <x-jet-label for="email" value="{{ __('E-mail') }}" />
                <x-jet-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')"
                    required />
            </div>

            <div class="mt-4">
                <x-jet-label for="password" value="{{ __('Wachtwoord') }}" />
                <x-jet-input id="password" class="block mt-1 w-full" type="password" name="password" required
                    autocomplete="new-password" />
            </div>

            <div class="mt-4">
                <x-jet-label for="password_confirmation" value="{{ __('Wachtwoord bevestigen') }}" />
                <x-jet-input id="password_confirmation" class="block mt-1 w-full" type="password"
                    name="password_confirmation" required autocomplete="new-password" />
            </div>

            @if (Laravel\Jetstream\Jetstream::hasTermsAndPrivacyPolicyFeature())
            <div class="mt-4">
                <x-jet-label for="terms">
                    <div class="flex items-center">
                        <x-jet-checkbox name="terms" id="terms" />

                        <div class="ml-2">
                            {!! __('I agree to the :terms_of_service and :privacy_policy', [
                            'terms_of_service' => '<a target="_blank" href="'.route('terms.show').'"
                                class="underline text-sm text-gray-600 hover:text-gray-900">'.__('Terms of
                                Service').'</a>',
                            'privacy_policy' => '<a target="_blank" href="'.route('policy.show').'"
                                class="underline text-sm text-gray-600 hover:text-gray-900">'.__('Privacy
                                Policy').'</a>',
                            ]) !!}
                        </div>
                    </div>
                </x-jet-label>
            </div>
            @endif

            <div class="flex items-center justify-end mt-4">
                <a class="underline text-sm text-gray-600 hover:text-gray-900" href="{{ route('login') }}">
                    {{ __('Heb je al een account?') }}
                </a>

                <x-jet-button class="ml-4">
                    {{ __('Registreren') }}
                </x-jet-button>
            </div>
        </form>
    </x-jet-authentication-card>
</x-guest-layout>
