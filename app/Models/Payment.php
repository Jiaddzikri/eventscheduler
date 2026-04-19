<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['event_id', 'user_id', 'amount', 'proof_of_transfer_url', 'status', 'payment_date', 'rejection_reason'])]
class Payment extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;
    protected function casts(): array
    {
        return [
            'payment_date' => 'datetime',
            'amount' => 'decimal:2',
        ];
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
