import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";
import UserModal from "../components/UserModal";


const UserProfile = () => {
	const [user, setUser] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [editUser, setEditUser] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem("token");

		axiosClient
		.get("/user/getProfile", {
			headers: {
			Authorization: `Bearer ${token}`,
			},
		})
		.then((res) => {
			setUser(res.data);
		})
		.catch((err) => {
			console.error("Profile error:", err.response?.data || err);
		});
	}, []);

	const openEdit = (user) => { setEditUser(user); setShowModal(true); };

	const handleSave = async (formData) => {
		try {
			const { data } = await axiosClient.post(`/user/update/${editUser.id}`, formData);
			setShowModal(false);
			setEditUser(null);
			setUser(data);
			// fetchUser(page);
			toast.success("User updated successfully");
		} catch (err) {
			const msg = err.response?.data?.message || 'Save failed';
			toast.error(msg);
		}
	};

	if (!user) return <div className="text-center mt-5">Loading...</div>;

	return (
		<div className="d-flex justify-content-center mt-5">
		<div
			className="card shadow-lg border-0"
			style={{ width: "24rem", borderRadius: "16px" }}
		>
			{/* Header */}
			<div className="bg-success text-white text-center p-4 rounded-top">
			{/* <img
				src="https://i.pravatar.cc/150?img=12"
				alt="avatar"
				className="rounded-circle border border-3 border-white mb-2"
				width="100"
				height="100"
			/> */}
			<h4 className="mb-0">{user.name}</h4>
			<small>{user.email}</small>
			</div>

			{/* Body */}
			<div className="card-body">
			<div className="mb-2 d-flex justify-content-between">
				<span className="fw-semibold text-muted">📞 Phone</span>
				<span>{user.phone || "Not provided"}</span>
			</div>

			<div className="mb-2 d-flex justify-content-between">
				<span className="fw-semibold text-muted">🏠 Address</span>
				<span>{user.address || "Not provided"}</span>
			</div>

			<div className="mb-3 d-flex justify-content-between">
				<span className="fw-semibold text-muted">⚧ Gender</span>
				<span className="badge bg-primary">{user.gender || "N/A"}</span>
			</div>

			<button className="btn btn-outline-success w-100"  onClick={() => openEdit(user)}>
				Edit Profile
			</button>
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
};

export default UserProfile;
