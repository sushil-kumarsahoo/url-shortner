import { useState } from "react";
import { loginUser, googleAuthApi } from "../api/user.api";
import { useDispatch } from "react-redux";
import { login } from "../store/slice/authSlice.js";
import { useNavigate } from "@tanstack/react-router";
import { GoogleLogin } from "@react-oauth/google";

const LoginForm = ({ state }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setError("");
      const data = await googleAuthApi(credentialResponse.credential);
      dispatch(login(data.user));
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err.message || "Google sign-in failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(email, password);
      dispatch(login(data.user));
      setEmail("");
      setPassword("");
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl shadow-purple-100/50 rounded-2xl p-6 sm:p-8"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back!</h2>
          <p className="text-xs text-slate-500 mt-1">Sign in to your Shortly account</p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm flex items-start gap-2">
            <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-700 transition-all text-sm"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-700 transition-all text-sm"
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className={`w-full bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-purple-700/25 hover:shadow-lg hover:shadow-purple-700/35 transition-all text-sm cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        {/* OR Divider */}
        <div className="my-5 flex items-center justify-between">
          <hr className="w-full border-slate-200" />
          <span className="px-3 text-xs uppercase text-slate-400 font-semibold tracking-wider">or</span>
          <hr className="w-full border-slate-200" />
        </div>

        {/* Google Sign-In Button */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError("Google sign-in was unsuccessful. Please try again.")}
            shape="pill"
            theme="outline"
            text="signin_with"
            size="large"
          />
        </div>

        <div className="text-center mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => state(false)}
              className="text-purple-700 hover:text-purple-900 font-semibold transition-colors"
            >
              Register here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
