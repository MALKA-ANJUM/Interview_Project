import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import User from './pages/User';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import './index.css';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoutes';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	// 🔹 Keep token in state so React can re-render when it changes
	const [token, setToken] = useState(localStorage.getItem('token'));
	const [role, setRole] = useState(localStorage.getItem('role'));

	// 🔹 Whenever token changes, sync it to localStorage
	useEffect(() => {
	if (token) localStorage.setItem('token', token);
	else localStorage.removeItem('token');

	if (role) localStorage.setItem('role', role);
	else localStorage.removeItem('role');
	}, [token, role]);


	return (
		<BrowserRouter>
			<ToastContainer />
			<div className="app-container d-flex flex-column min-vh-100">
				{/* {token && <Header />} */}
				<Header role={role} />
				<main className="flex-grow-1">
					<Routes>
						<Route path="/" element={<Dashboard />} />

						{/* 🔹 Pass setToken to Login so it can update the token */}
						<Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
						<Route path="/register" element={<Register />} />

						{/* 🔹 Protected route */}
						<Route
						path="/user"
						element={
							<ProtectedRoute token={token} role={role} allowedRoles={['admin']}>
							<User />
							</ProtectedRoute>
						}
						/>

						<Route path="/user/profile" element={
							<ProtectedRoute token={token} role={role} allowedRoles={['user','admin']}>
							<UserProfile  />
							</ProtectedRoute>
						} />
						<Route path="*" element={<Navigate to="/" />} />

					</Routes>
				</main>
				<Footer />
				{/* {token && <Footer />} */}
			</div>
		</BrowserRouter>
	);
}

export default App;
