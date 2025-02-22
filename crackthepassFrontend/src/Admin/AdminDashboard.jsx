import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Session from "./Session";

function AdminDashboard() {
  const navigate = useNavigate();
  const [key, setKey] = useState("");
  const [search, setSearch] = useState(""); // New search state
  const [passKeys, setPassKeys] = useState([]);
  const [filteredKeys, setFilteredKeys] = useState([]); // Filtered passkeys

  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!adminToken) {
      toast.error("Unauthorized access. Please log in.");
      navigate("/admin/login");
      return;
    }
    fetchPassKeys();
  }, []);

  const fetchPassKeys = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/passkey/all", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setPassKeys(data.passkeys);
      setFilteredKeys(data.passkeys);
    } catch (error) {
      toast.error("Failed to fetch passkeys.");
    }
  };

  useEffect(() => {
    fetchPassKeys();
    const interval = setInterval(() => {
      fetchPassKeys();
    }, 120000);
    return () => clearInterval(interval);
  }, []); 

  const handleAddPassKey = async () => {
    if (!key.trim()) {
      toast.error("Enter a valid passkey.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/passkey/add",
        { key },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      toast.success("Passkey added successfully!");
      setKey("");
      fetchPassKeys();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add passkey.");
    }
  };

  const handleDeletePassKey = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/passkey/delete/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      toast.success("Passkey deleted!");
      fetchPassKeys();
    } catch (error) {
      toast.error("Failed to delete passkey.");
    }
  };

  // Update filteredKeys when search input changes
  useEffect(() => {
    setFilteredKeys(
      passKeys.filter((pass) =>
        pass.key.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, passKeys]);

  return (
<div className="min-h-screen flex flex-col items-center justify-center p-4 text-white bg-black backdrop-blur-lg">
    <h1 className="text-3xl sm:text-4xl font-bold mb-6">Squid Game Pass Keys</h1>
      <Session adminToken={adminToken} />
      <div className="bg-white/10 border border-white/20 backdrop-blur-lg p-6 rounded-lg shadow-xl shadow-black/40 w-full max-w-lg">
      {/* Search Input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search passkeys..."
          className="w-full p-2 mb-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Input and Button (Stacked on Mobile) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter passkey"
            className="flex-1 p-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddPassKey}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold"
          >
            Add Pass Key
          </button>
        </div>

        {/* Passkeys List */}
        <h2 className="text-2xl font-semibold mb-4">All Passkeys</h2>
        {filteredKeys.length === 0 ? (
          <p className="text-gray-400">No passkeys available.</p>
        ) : (
          <ul className="space-y-3">
            {filteredKeys.map((pass) => (
              <li key={pass._id} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                <span className="text-white">{pass.key}</span>
                <button
                  onClick={() => handleDeletePassKey(pass._id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-lg text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
