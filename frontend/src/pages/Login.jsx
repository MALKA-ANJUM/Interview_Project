import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

export default function Login({ setToken, setRole }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
		const { data } = await axiosClient.post('/login', { email, password });
		//  Save to state
		setToken(data.token);
		setRole(data.role);

		localStorage.setItem('token', data.token);
		localStorage.setItem('role', data.role);

		toast.success('Login successful!');

		//  Redirect based on role
		if (data.role === 'admin') {
			navigate('/user');
		} else {
			navigate('/user/profile');
		}

		} catch (err) {
			const msg = err.response?.data?.message || 'Invalid credentials';
			toast.error(msg);
			setError(msg);
		}
	};

	return (
		<div className="auth-wrapper d-flex justify-content-center align-items-center vh-100">
		<div className="auth-card shadow-lg p-4 rounded-4 bg-white">
			<div className="text-center mb-4">
			<h2 className="text-success fw-bold">Welcome!</h2>
			<p className="text-muted">Login to your website</p>
			</div>

			<form onSubmit={handleSubmit}>
			<div className="mb-3">
				<label className="form-label fw-semibold text-success">Email</label>
				<input
				type="email"
				className="form-control"
				placeholder="Enter your email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				/>
			</div>

			<div className="mb-3">
				<label className="form-label fw-semibold text-success">Password</label>
				<input
				type="password"
				className="form-control"
				placeholder="Enter your password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				/>
			</div>

			{error && <div className="text-danger mb-3">{error}</div>}

			<button type="submit" className="btn btn-success w-100 py-2 fw-semibold shadow-sm">
				Login
			</button>
			</form>

			<div className="text-center mt-3">
			<p className="text-muted mb-0">
				Don’t have an account?{' '}
				<span
				className="text-success fw-semibold"
				style={{ cursor: 'pointer' }}
				onClick={() => navigate('/register')}
				>
				Register
				</span>
			</p>
			</div>
		</div>
		</div>
	);
}
