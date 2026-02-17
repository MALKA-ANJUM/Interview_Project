import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import UserModal from '../components/UserModal';
import { toast } from "react-toastify";

export default function User() {
	const [users, setUsers] = useState([]);
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [editUser, setEditUser] = useState(null);
	const [error, setError] = useState('');

	const fetchUser = async (p = 1) => {
		setLoading(true);
		setError('');
		try {
			const res = await axiosClient.get('/user', { params: { page: p, per_page: 10 }});
			// Laravel paginator returns res.data.data, res.data.current_page, res.data.last_page
			const payload = res.data;
			setUsers(payload.data || []);
			setPage(payload.current_page || p);
			setLastPage(payload.last_page || 1);
		} catch (err) {
			toast.error(err.response?.data?.message || 'Could not load users');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { fetchUser(page); }, [page]);

	const openEdit = (user) => { setEditUser(user); setShowModal(true); };

	const handleDelete = async (id) => {
		if (!confirm('Delete this user?')) return;
		try {
			await axiosClient.delete(`/user/delete/${id}`);
			if (users.length === 1 && page > 1) setPage(page - 1);
			else fetchUser(page);
			toast.success("User deleted successfully");
		} catch (err) {
			toast.error(err.response?.data?.message || 'Delete failed');
		}
	};

	const handleSave = async (formData) => {
		try {
			await axiosClient.post(`/user/update/${editUser.id}`, formData);
			setShowModal(false);
			setEditUser(null);
			fetchUser(page);
			toast.success("User updated successfully");
		} catch (err) {
			const msg = err.response?.data?.message || 'Save failed';
			toast.error(msg);
		}
	};

	return (
		<div className="container mt-5">
			<div className="d-flex justify-content-between align-items-center mb-3">
				<h3 className="fw-bold">User</h3>
				
			</div>

			{error && <div className="alert alert-danger">{error}</div>}

			<div className="table-responsive">
				<table className="table table-striped table-bordered align-middle">
					<thead className="table-success">
						<tr>
						<th>Name</th>
						<th>Phone No.</th>
						<th>Email</th>
						<th>Address</th>
						<th style={{width:160}}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
						<tr><td colSpan="5" className="text-center">Loading...</td></tr>
						) : users.length ? (
						users.map(user => (
							<tr key={user.id}>
								<td>{user.name}</td>
								<td>{user.phone}</td>
								<td>{user.email}</td>
								<td>{user.address}</td>
								<td>
									<button className="btn btn-sm btn-primary me-2" onClick={() => openEdit(user)}>Edit</button>
									<button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id)}>Delete</button>
								</td>
							</tr>
						))
						) : (
						<tr><td colSpan="6" className="text-center">No user found</td></tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="d-flex justify-content-between align-items-center">
				<div>Page {page} of {lastPage}</div>
				<div>
					<button className="btn btn-sm btn-outline-secondary me-2" disabled={page<=1} onClick={()=>setPage(prev=>Math.max(1, prev-1))}>Prev</button>
					<button className="btn btn-sm btn-outline-secondary" disabled={page>=lastPage} onClick={()=>setPage(prev=>prev+1)}>Next</button>
				</div>
			</div>

			{/* Modal */}
			{showModal && (
				<UserModal
				user={editUser}
				onClose={() => { setShowModal(false); setEditUser(null); }}
				onSave={handleSave}
				/>
			)}
		</div>
	);
}
