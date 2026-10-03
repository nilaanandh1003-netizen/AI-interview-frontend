import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", formData);

            localStorage.setItem("token", res.data.token);

            Swal.fire({
                icon: "success",
                title: "Login Successful",
                text: "Redirecting to your dashboard...",
                showConfirmButton: false,
                timer: 1500,
            });

            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: err.response?.data?.message || "An error occurred during login.",
                showConfirmButton: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-brand">
                    <h1>AI Interview Portal</h1>
                    <p>Sign in to continue your journey</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Welcome Back</h2>

                    <div className="input-group">
                        <Mail size={18} className="input-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Lock size={18} className="input-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" /> Remember me
                        </label>
                        <Link to="/forgot-password" className="forgot-link">
                            Forgot password?
                        </Link>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Signing in..." : "Login"}
                    </button>

                    <p className="signup-text">
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;