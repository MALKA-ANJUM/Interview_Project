<?php

namespace App\Repositories\Interfaces;


interface AuthRepositoryInterface
{
    public function create(array $data);
    public function findByEmail(string $email);
}