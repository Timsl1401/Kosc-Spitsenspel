<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Laravel\Jetstream\Jetstream;
use Illuminate\Support\Facades\Hash;
use Spatie\Newsletter\NewsletterFacade;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array  $input
     * @return \App\Models\User
     */
    public function create(array $input)
    {
        Validator::make($input, [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'my_team' => ['required', 'string'],
            'birth_date' => ['required', 'date'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => $this->passwordRules(),
            'terms' => Jetstream::hasTermsAndPrivacyPolicyFeature() ? ['required', 'accepted'] : '',
        ])->validate();
        NewsletterFacade::subscribe($input['email'], ['FNAME'=>$input['first_name'],'LNAME'=>$input['last_name']]);
        return User::create([
            'first_name' => $input['first_name'],
            'last_name' => $input['last_name'],
            'my_team' => $input['my_team'],
            'birth_date' => $input['birth_date'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
        ]);

    }
}