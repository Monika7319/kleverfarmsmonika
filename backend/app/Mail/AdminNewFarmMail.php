<?php 

namespace App\Mail;

use App\Models\Farm;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdminNewFarmMail extends Mailable
{
    use Queueable, SerializesModels;

    public $farm;

    public function __construct(Farm $farm)
    {
        $this->farm = $farm;
    }

    public function build()
    {
        return $this->subject('New Farm Registration Received')
                    ->view('emails.admin-new-farm');
    }
}
