import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const login = async () => {
        try {
            const res = await axios.post("http://localhost:9090/api/login", {
                username: ref1.current.value,
                password: ref2.current.value,
            });

            const { data } = res;
            const { login, role, token } = data;

            if (login === "success") {
                window.localStorage.setItem("token", token);

                switch (role) {
                    case "ROLE_EMPLOYEE":
                        navigate("/employee");
                        break;
                    case "ROLE_ADMIN":
                        navigate("/admin");
                        break;
                    case "ROLE_HR":
                        navigate("/hrdashboard");
                        break;
                    case "ROLE_RECRUITER":
                        navigate("/recruiter");
                        break;
                    case "ROLE_FINANCE":
                        navigate("/finance");
                        break;
                    default:
                        navigate("/error");
                }
            } else {
                navigate("/error");
            }
        } catch (e) {
            navigate("/error");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Login</h2>
                <p style={styles.subheading}>Welcome to the HRMS Portal</p>

                <label style={styles.label}>Email Address</label>
                <input
                    type="text"
                    ref={ref1}
                    placeholder="email@website.com"
                    style={styles.input}
                />

                <label style={styles.label}>Password</label>
                <div style={styles.passwordWrapper}>
                    <input
                        type={showPassword ? "text" : "password"}
                        ref={ref2}
                        placeholder="************"
                        style={styles.passwordInput}
                    />
                    <span
                        style={styles.showText}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </span>
                </div>

                <button onClick={login} style={styles.button}>
                    Login
                </button>
            </div>
        </div>
    );
};

const styles = {
    
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafb",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    card: {
        width: "420px",
        padding: "40px",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
    },
    heading: {
        fontSize: "28px",
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: "px",
    },
    subheading: {
        fontSize: "18px",
        color: "#6b7280",
        marginBottom: "15px",
    },
    label: {
        fontSize: "16px",
        color: "#374151",
        fontWeight: "500",
        marginBottom: "0px",
    },
    input: {
        padding: "12px 14px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        fontSize: "16px",
        outline: "none",
        width: "100%",
    },
    passwordWrapper: {
        position: "relative",
        display: "flex",
        alignItems: "center",
    },
    passwordInput: {
        padding: "12px 14px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        fontSize: "16px",
        outline: "none",
        width: "100%",
    },
    showText: {
        position: "absolute",
        right: "14px",
        color: "#4f46e5",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
    },
    button: {
        marginTop: "20px",
        padding: "14px 0",
        backgroundColor: "#1d4ed8",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "18px",
        fontWeight: "600",
        cursor: "pointer",
    },
};

export default Login;
