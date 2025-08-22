<?php

namespace App\Http\Livewire;

use App\Models\Period;
use Livewire\Component;

class PeriodSelect extends Component
{
    public $periods;
    public $selectedPeriod;

    public function mount(){
        $this->periods = Period::all();
    }

    public function updatedSelectedPeriod(){
        return redirect(route('user.index', $this->selectedPeriod));
    }

    public function render()
    {
        return view('livewire.period-select');
    }
}