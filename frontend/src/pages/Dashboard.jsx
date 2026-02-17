import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
      <h1 className="display-5 fw-bold text-success mb-3">
        Laravel Admin & User Management System
      </h1>
      <p className="lead text-muted mb-4">
        A secure Laravel-based system featuring REST APIs, role-based access,
        background jobs, cron automation, and an admin dashboard for user and
        system management.
      </p>

      <button
        className="btn btn-success px-4 py-2 fw-semibold shadow-sm"
        onClick={() => {
          if (!token) {
            navigate("/login");
          } else if (role === "admin") {
            navigate("/user");
          } else {
            navigate("/user/profile");
          }
        }}
      >
        {!token
          ? "Login"
          : role === "admin"
          ? "Go to Admin Dashboard"
          : "Go to Profile"}
      </button>
    </div>
  );
}
