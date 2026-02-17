import { useEffect, useState } from 'react';

export default function UserModal({ user, onClose, onSave }) {
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [address, setAddress] = useState('');
	const [gender, setGender] = useState('');

	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (user) {
		setName(user.name || '');
		setPhone(user.phone || '');
		setEmail(user.email || '');
		setAddress(user.address || '');
		setGender(user.gender || '');
		}
	}, [user]);

	const handleSubmit = async (e) => {
		
		e.preventDefault();
		setSaving(true);
		try {
		const payload = {
			name: name.trim(),
			phone: phone.trim(),
			email: email.trim(),
			address: address.trim(),
			gender: gender.trim(),
		};
		await onSave(payload);
		} catch (err) {
		console.error('Save error', err);
		alert(err.response?.data?.message || 'Update failed');
		} finally {
		setSaving(false);
		}
	};

	return (
		<div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
			<div className="modal-dialog">
				<div className="modal-content">
				<form onSubmit={handleSubmit}>
					<div className="modal-header">
						<h5 className="modal-title">Edit User</h5>
						<button type="button" className="btn-close" onClick={onClose} />
					</div>

					<div className="modal-body">
						<div className="mb-3">
							<label className="form-label">Name <span className="text-danger">*</span></label>
							<input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
						</div>

						<div className="mb-3">
							<label className="form-label">Phone  <span className="text-danger">*</span></label>
							<input className="form-control" value={phone} onChange={e => setPhone(e.target.value)} required />
						</div>

						<div className="mb-3">
							<label className="form-label">Email <span className="text-danger">*</span></label>
							<input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
						</div>

						<div className="mb-3">
							<label className="form-label">Address</label>
							<textarea className="form-control" value={address} onChange={e => setAddress(e.target.value)} />
						</div>

						<div className="mb-3">
							<label className="form-label">Gender</label>
							<select
								className="form-select"
								value={gender}
								onChange={e => setGender(e.target.value)}
							>
								<option value="">Select Gender</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Other">Other</option>
							</select>
						</div>

					</div>

					<div className="modal-footer">
					<button type="button" className="btn btn-secondary" onClick={onClose}>
						Cancel
					</button>
					<button type="submit" className="btn btn-success" disabled={saving}>
						{saving ? 'Updating...' : 'Update'}
					</button>
					</div>
				</form>
				</div>
			</div>
		</div>
	);
}
