<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserService;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function list()
    {
        return response()->json(
            $this->userService->getAllUsers()
        );
    }

    public function edit($id)
    {
        return response()->json(
            $this->userService->getUser($id)
        );
    }

    public function store(Request $request)
    {
        return response()->json(
            $this->userService->createUser($request->all())
        );
    }

    public function update(Request $request, $id)
    {
        return response()->json(
            $this->userService->updateUser($id, $request->all())
        );
    }

    public function delete($id)
    {
        $this->userService->deleteUser($id);

        return response()->json([
            'message' => 'User deleted'
        ]);
    }

    public function getProfile()
    {
        return response()->json(
            $this->userService->getProfile()
        );
    }

}