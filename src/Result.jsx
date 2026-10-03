import { useLocation, useNavigate } from "react-router-dom";

function Result() {
    const { state } = useLocation();
    const navigate = useNavigate();

    return (
        <div
            style={{
                textAlign: "center",
                marginTop: "100px",
                color: "#333",
            }}
        >
            <h1>🎉 Interview Completed</h1>

            <h2>you score {state.score}%</h2>

            <p>Your answers have been submitted successfully.</p>

            <button
                onClick={() => navigate("/dashboard")}
                style={{
                    padding: "12px 25px",
                    marginTop: "20px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                }}
            >
                Back to Dashboard
            </button>
        </div>
    );
}

export default Result;