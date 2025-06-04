<?php
namespace App\Mail;

use App\Models\Farm;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FarmerConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $farm;

    public function __construct(Farm $farm)
    {
        $this->farm = $farm;
    }

    public function build()
    {
        return $this->subject('Your Farm Registration was Received')
                    ->view('emails.farmer-confirmation');
    }
}
