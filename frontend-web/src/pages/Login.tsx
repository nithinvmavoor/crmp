import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("Pass@123");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await authApi.post("/login", { email, password });
      const token = res.data?.data?.token;

      if (!token) {
        setMsg("Token not received");
        return;
      }

      localStorage.setItem("token", token);
      nav("/menu");
    } catch (err: any) {
      setMsg(err?.response?.data?.error?.message || "Login failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 350 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
        />
        <button type="submit">Login</button>
      </form>

      {msg && <p style={{ color: "red" }}>{msg}</p>}

      <p>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
