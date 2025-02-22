import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import crackPassBackground from "../assets/crackpassBackground.png"; // Background image
import congratsImage from "../assets/congrats.png"; // Success image
import entryImage from "../assets/entry1.png"; // Entry warning image

const CrackPass = () => {
  const [passkey, setPasskey] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // Retrieve ID Number from localStorage
  const idno = localStorage.getItem("idno") || "Player";

  const handleVerify = async () => {
    if (!passkey) {
      toast.error("Enter the password, or face elimination.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/user/verify", {
        idno,
        passkey,
      });

      if (response.data.success) {
        setIsVerified(true);
        toast.success("Verification successful! Welcome to the next round.");
      } else {
        toast.error("Wrong move. Try again before it's too late.");
      }
    }catch (error) {
      toast.error("Wrong move. Try again before it's too late.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-screen min-h-screen flex items-center justify-center bg-gray-900 text-white px-4 sm:px-6"
      style={{
        backgroundImage: `url(${crackPassBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!isVerified ? (
        <div className="bg-black/50 backdrop-blur-lg border border-white/20 shadow-xl p-8 sm:p-10 rounded-lg max-w-md w-full text-center flex flex-col items-center justify-center min-h-[400px] sm:min-h-[450px] md:min-h-[420px]">
        <img src={entryImage} alt="Entry Warning" className="w-44 sm:w-48 md:w-52 mt-4" />
      
        <p className="text-red-500 text-lg font-semibold mt-4">
          "One mistake... and it's Game Over."
        </p>
      
        <input
          type="password"
          placeholder="Enter the code or be eliminated"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
          className="w-full p-3 mt-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-center text-lg"
        />
      
        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full p-3 mt-5 rounded-lg font-semibold text-lg ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Processing..." : "Advance to the Next Round"}
        </button>
      </div>
      
      ) : (
        // Squid Game-style success message
        <div className="bg-black/70 backdrop-blur-md p-6 rounded-lg max-w-md w-full min-h-[450px] flex flex-col items-center justify-center text-center">
          <h3 className="text-4xl font-bold text-green-400"> "Player Survived" </h3>
          <p className="mt-3 text-gray-300 text-lg">
            "You cracked the code. But the game is far from over!!"
          </p>
          <img src={congratsImage} alt="Congratulations" className="mt-5 w-44 sm:w-48 md:w-52" />
        </div>
      )}
    </div>
  );
};

export default CrackPass;
