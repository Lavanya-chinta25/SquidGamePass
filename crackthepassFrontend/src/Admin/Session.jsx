import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Session({ adminToken }) {
  const sessionStopped = useRef(false); // Prevent duplicate stop calls
  const timerRef = useRef(null); // Store the timer reference

  const getSavedTime = () => {
    const savedTime = localStorage.getItem("timeLeft");
    return savedTime ? parseInt(savedTime, 10) : 1800;
  };

  const [timeLeft, setTimeLeft] = useState(getSavedTime);
  const [sessionActive, setSessionActive] = useState(
    localStorage.getItem("sessionActive") === "true"
  );

  useEffect(() => {
    if (sessionActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          localStorage.setItem("timeLeft", newTime);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && sessionActive && !sessionStopped.current) {
      sessionStopped.current = true;
      stopSession();
    }

    return () => clearInterval(timerRef.current);
  }, [sessionActive, timeLeft]);

  const startSession = async () => {
    try {
      await axios.post("http://localhost:5000/api/session/start", {}, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setSessionActive(true);
      setTimeLeft(1800);
      sessionStopped.current = false; // Reset flag
      localStorage.setItem("timeLeft", 1800);
      localStorage.setItem("sessionActive", "true");
      toast.success("Session started successfully.");
    } catch (error) {
      toast.error("Failed to start session.");
    }
  };

  const stopSession = async () => {
    if (sessionStopped.current) return; // Prevent duplicate calls
    sessionStopped.current = true; // Mark as stopped

    try {
      console.log("Stopping session...");
      await axios.post("http://localhost:5000/api/session/stop", {}, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setSessionActive(false);
      setTimeLeft(0);
      localStorage.setItem("timeLeft", 0);
      localStorage.setItem("sessionActive", "false");
      toast.info("Session ended.");
    } catch (error) {
      toast.error("Failed to stop session.");
    }
  };

  return (
    <div className="text-center mb-6">
      <h2 className="text-xl mb-2">Session: {sessionActive ? "Active" : "Over"}</h2>
      <h3 className="text-lg mb-4">
        Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
      </h3>
      <div className="flex gap-4 justify-center">
        <button
          onClick={startSession}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold"
          disabled={sessionActive}
        >
          Start Session
        </button>
        <button
          onClick={stopSession}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold"
          disabled={!sessionActive}
        >
          End Session
        </button>
      </div>
    </div>
  );
}

export default Session;
