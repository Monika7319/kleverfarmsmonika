<p>Dear {{ $farm->ownerName }},</p>

<p>Your farm "<strong>{{ $farm->farmName }}</strong>" has been <strong>{{ $status }}</strong> by the admin team.</p>

@if($status === 'approved')
<p>You may now access and manage your listing on our platform.</p>
@else
<p>Please review your submitted information and try again if needed.</p>
@endif

<p>Thank you,<br>The Admin Team</p>
