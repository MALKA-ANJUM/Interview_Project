<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{ 
    public $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function getAll()
    {
        return $this->user->where('id', '<>', auth()->user()->id)->paginate(10);
    }

    public function edit($id)
    {
        return $this->user->findOrFail($id);
    }

    public function insert(array $data)
    {
        return $this->user->create($data);
    }

    public function update($id, array $data)
    {
        $user = $this->edit($id);

        $user->update($data);

        return $user;
    }

    public function delete($id)
    {
        $user = $this->edit($id);

        return $user->delete();
    } 

    public function getAllActiveUsers()
    {
        return $this->user->whereNotNull('email')->cursor();
    }

    public function getProfile()
    {
        return $this->user->findOrFail(auth()->id());
    }
}