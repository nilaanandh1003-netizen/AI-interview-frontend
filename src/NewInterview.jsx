import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./NewInterview.css";

function NewInterview() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        role: "Frontend Developer",
        difficulty: "Beginner",
        numberOfQuestions: 5,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const createInterview = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(
                "http://localhost:5000/api/interviews",
                {
                    title: formData.title,
                    role: formData.role,
                    difficulty: formData.difficulty,
                    numberOfQuestions: formData.numberOfQuestions,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const interview = res.data.interview;

            await axios.post(
                "http://localhost:5000/api/questions/generate",
                {
                    interviewId: interview._id,
                    role: formData.role,
                    difficulty: formData.difficulty,
                    numberOfQuestions: formData.numberOfQuestions,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Swal.fire({
                icon: "success",
                title: "Interview Created!",
                text: "Redirecting to your interview...",
                showConfirmButton: false,
                timer: 1500,
            });

            setTimeout(() => {
                navigate(`/interview/${interview._id}`);
            }, 1500);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text: err.response?.data?.message || "Please try again.",
                showConfirmButton: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="newInterview-container">
            <div className="newInterview-card">
                <div className="newInterview-brand">
                    <h1>AI Interview Portal</h1>
                    <p>Set up your next mock interview</p>
                </div>

                <form className="newInterview-form" onSubmit={createInterview}>
                    <h2>Create New Interview</h2>

                    <div className="field-group">
                        <label>Interview Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g. Frontend Round 1"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label>Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option>Frontend Developer</option>
                            <option>Backend Developer</option>
                            <option>Full Stack Developer</option>
                            <option>React Developer</option>
                            <option>Node.js Developer</option>
                            <option>Java Developer</option>
                            <option>Python Developer</option>
                        </select>
                    </div>

                    <div className="row">
                        <div className="field-group">
                            <label>Difficulty</label>
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleChange}
                            >
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>

                        <div className="field-group">
                            <label>Questions</label>
                            <select
                                name="numberOfQuestions"
                                value={formData.numberOfQuestions}
                                onChange={handleChange}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Generating..." : "Generate Interview"}
                    </button>

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate("/dashboard")}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NewInterview;