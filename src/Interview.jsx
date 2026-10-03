import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Interview.css";

function Interview() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                `http://localhost:5000/api/questions/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            setQuestions(res.data);
            setAnswers(Array(res.data.length).fill(""));
        } catch (err) {
            console.log(err);
        }
    };

    const handleAnswer = (e) => {
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestion] = e.target.value;
        setAnswers(updatedAnswers);
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const previousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const submitInterview = async () => {
        try {
            const token = localStorage.getItem("token");

            const payload = questions.map((question, index) => ({
                questionId: question._id,
                answer: answers[index],
            }));

            const res = await axios.post(
                "http://localhost:5000/api/questions/submit",
                {
                    interviewId: id,
                    answers: payload,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Interview Submitted Successfully!");

            navigate("/result",
                {
                    state:
                        { score: res.data.score }

                }
            );
            console.log("Navigating to result page with score:", res.data.score);

        } catch (err) {

            console.log("Submit Error:", err);
            console.log("Backend Error:", err.response?.data);


            alert(
                err.response?.data?.message || "Failed to submit interview"
            );
        }

    };

    if (questions.length === 0) {
        return <h2>Loading Questions...</h2>;
    }

    return (
        <div className="interviewContainer">
            <h1>AI Interview Portal</h1>

            <div className="progress">
                Question {currentQuestion + 1} of {questions.length}
            </div>

            <div className="questionCard">
                <h3>{questions[currentQuestion].question}</h3>

                <textarea
                    rows="8"
                    placeholder="Type your answer..."
                    value={answers[currentQuestion]}
                    onChange={handleAnswer}
                />
            </div>

            <div className="buttons">
                <button
                    onClick={previousQuestion}
                    disabled={currentQuestion === 0}
                >
                    Previous
                </button>

                {currentQuestion === questions.length - 1 ? (
                    <button onClick={submitInterview}>
                        Submit Interview
                    </button>
                ) : (
                    <button onClick={nextQuestion}>
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}

export default Interview;