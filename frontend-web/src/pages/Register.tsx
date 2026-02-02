import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api";

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setMsg("");

    try {
      await authApi.post("/auth/register", { email, password });
      nav("/login");
    } catch (err: any) {
      setMsg(err?.response?.data?.error?.message || "Register failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 350 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
        />
        <button type="submit">Register</button>
      </form>

      {msg && <p style={{ color: "red" }}>{msg}</p>}

      <p>
        Already have account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
