import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminBackground from "../assets/AdminBackground.png"; // Same background image

function UserLogin() {
  const navigate = useNavigate();
  const [idno, setIdno] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("http://localhost:5000/api/user/login", { idno, password });

      // Store token in localStorage
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("idno", idno);
      toast.success("Login successful!");
      navigate("/user/crackpass");
    } catch (error) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("idno");
      toast.error("Create Account or Invalid Credentials entered");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 sm:px-6"
      style={{ backgroundImage: `url(${AdminBackground})` }}
    >
      <div className="bg-black/30 backdrop-blur-lg border border-white/20 shadow-xl p-8 rounded-lg max-w-sm w-full text-white">
        <h2 className="text-3xl font-bold text-center mb-6">User Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300">ID Number</label>
            <input
              type="text"
              value={idno}
              onChange={(e) => setIdno(e.target.value)}
              className="w-full p-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 mt-4 rounded-lg font-semibold ${
              loading ? "bg-gray-600 cursor-not-allowed" : "bg-[#050404] hover:bg-gray-900"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Sign up link */}
        <p className="text-center text-gray-300 mt-4">
          Don't have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/user/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default UserLogin;
