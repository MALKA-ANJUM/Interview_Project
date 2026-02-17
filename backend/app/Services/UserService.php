<?php

namespace App\Services;

use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\Log;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function getAllUsers()
    {
        try {
            $users = $this->userRepository->getAll();

            Log::info('Users fetched successfully', [
                'count' => $users->count()
            ]);

            return $users;
        } catch (\Throwable $e) {
            Log::error('Get all users failed', [
                'error' => $e->getMessage()
            ]);
            throw new \Exception("Unable to fetch users");
        }
    }

    public function getUser($id)
    {
        try {
            $getUser = $this->userRepository->edit($id);
             Log::info('Specific User detail fetched');
            return $getUser;
        } catch (\Throwable $e) {
            Log::error('Get user failed', [
                'user_id' => $id,
                'error' => $e->getMessage()
            ]);
            throw new \Exception("Unable to fetch user");
        }
    }

    public function createUser(array $data)
    {
        try {
            if (isset($data['password'])) {
                $data['password'] = bcrypt($data['password']);
            }
            $user = $this->userRepository->insert($data);
            Log::info('New user created successfully', [
                'user_id' => $user->id,
                'created_by' => auth()->id() ?? null,
                'data' => [
                    'name' => $data['name'] ?? null,
                    'email' => $data['email'] ?? null,
                ],
            ]);
            return $user;

        } catch (\Throwable $e) {
            Log::error('Create user failed', [
                'data' => $data,
                'error' => $e->getMessage()
            ]);
            throw new \Exception("Unable to create user");
        }
    }

    public function updateUser($id, array $data)
    {
        try {
            $user = $this->userRepository->update($id, $data);
            Log::info('User updated successfully', [
                'user_id' => $id,
                'updated_by' => auth()->id() ?? null,
                'data' => $data,
            ]);
                        return $user;
        } catch (\Throwable $e) {
            Log::error('Update user failed', [
                'user_id' => $id,
                'data' => $data,
                'error' => $e->getMessage()
            ]);
            throw new \Exception("Unable to update user");
        }
    }

    public function deleteUser($id)
    {
        try {
            $deleteUser = $this->userRepository->delete($id);
            Log::info('User deleted successfully', [
                'user_id' => $id,
                'deleted_by' => auth()->id() ?? null,
            ]);
            return $deleteUser;

        } catch (\Throwable $e) {
            Log::error('Delete user failed', [
                'user_id' => $id,
                'error' => $e->getMessage()
            ]);
            throw new \Exception("Unable to delete user");
        }
    }

    public function getUsersForMail()
    {
        try {
            $mailedUser = $this->userRepository->getAllActiveUsers();
            Log::info('Fetch user data to send mail', [
                'user_id' => auth()->id() ?? null,
                'total_users' => count($mailedUser),
            ]);

            return $mailedUser;

        } catch (\Throwable $e) {
            Log::error('Get users for mail failed', [
                'error' => $e->getMessage()
            ]);
            throw new \Exception("Unable to fetch users for mail");
        }
    }

    public function getProfile()
    {
        try {
            $user = $this->userRepository->getProfile();

            Log::info('User Profile data fetch', [
                'user_id' => auth()->id(),
            ]);

            return $user;

        } catch (\Throwable $e) {
            Log::error('Get profile failed', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage()
            ]);

            throw new \Exception("Unable to fetch profile");
        }
    }
}
