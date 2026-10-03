import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Swal from "sweetalert2";

function Dashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        recentInterviews: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get("http://localhost:5000/api/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setDashboard(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#6366f1",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout!",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                Swal.fire({
                    icon: "success",
                    title: "Logged Out",
                    showConfirmButton: false,
                    timer: 1500,
                });
                navigate("/");
            }
        });
    };

    return (
        <div className="dashboard">
            <div className="navbar">
                <h2>AI Interview Portal</h2>
                <button className="logoutBtn" onClick={logout}>
                    Logout
                </button>
            </div>

            <div className="dashboard-content">
                <h1>Dashboard</h1>
                <p className="subtitle">Track your interview performance at a glance</p>

                {loading ? (
                    <div className="loading-state">Loading your dashboard...</div>
                ) : (
                    <>
                        <div className="cards">
                            <div className="card">
                                <span className="card-label">Total Interviews</span>
                                <h2>{dashboard.totalInterviews}</h2>
                            </div>

                            <div className="card">
                                <span className="card-label">Average Score</span>
                                <h2>{dashboard.averageScore}%</h2>
                            </div>

                            <div className="card">
                                <span className="card-label">Best Score</span>
                                <h2>{dashboard.bestScore}%</h2>
                            </div>
                        </div>

                        <button
                            className="startBtn"
                            onClick={() => navigate("/new-interview")}
                        >
                            + Start New Interview
                        </button>

                        <div className="recent-section">
                            <h2>Recent Interviews</h2>

                            {dashboard.recentInterviews.length === 0 ? (
                                <div className="empty-state">
                                    <p>No interviews yet</p>
                                    <span>Start your first interview to see your performance here.</span>
                                </div>
                            ) : (
                                <div className="recent-interviews">
                                    {dashboard.recentInterviews.map((interview) => (
                                        <div key={interview._id} className="interview-item">
                                            <h3>{interview.title}</h3>
                                            <p>Score: {interview.score}%</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Dashboard;