<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['tenant_id', 'title', 'description', 'budget_per_person', 'start_date', 'end_date'])]
class Event extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;
    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'budget_per_person' => 'decimal:2',
        ];
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function participants()
    {
        return $this->hasMany(EventParticipant::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
