<?php

namespace App\Repositories\Interfaces;

interface UserRepositoryInterface
{
    public function getAll();

    public function insert(array $data);

    public function edit($id);

    public function update($id, array $data);

    public function delete($id);

    public function getAllActiveUsers();

    public function getProfile();
}