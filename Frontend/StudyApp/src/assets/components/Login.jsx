// Login.jsx
import "./Auth.css";

export default function Login() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login as User</h2>
        <form className="auth-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
}
