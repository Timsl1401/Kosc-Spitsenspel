@if (\AppHelper::instance()->canTransfer())
@if (!Auth::user()->players()->find($playerId))
<div class="flex space-x-1 justify-around">
    <a onclick="return confirm('Weet je het zeker? Deze actie kan niet ongedaan gemaakt worden!')"
        href="{{ route('player.buy', $playerId) }}" class="p-1 text-green-600 hover:text-green-800">
        Koop
    </a>
</div>
@else
<div class="flex space-x-1 justify-around">
    <a onclick="return confirm('Weet je het zeker? Deze actie kan niet ongedaan gemaakt worden!')"
        href="{{ route('player.sell', $playerId) }}" class="p-1 text-red-600 hover:text-red-800">
        Verkoop
    </a>
</div>
@endif
@endif
