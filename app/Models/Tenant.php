<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'description', 'bank_account_info'])]
class Tenant extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;
    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('role')->withTimestamps();
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
