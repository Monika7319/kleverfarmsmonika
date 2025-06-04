<?php
namespace App\Mail;

use App\Models\Farm;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FarmApprovalStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public $farm;
    public $status;

    public function __construct(Farm $farm, string $status)
    {
        $this->farm = $farm;
        $this->status = $status; // "approved" or "rejected"
    }

    public function build()
    {
        $subject = "Your Farm Has Been " . ucfirst($this->status);
        return $this->subject($subject)
                    ->view('emails.farm-status-update');
    }
}
