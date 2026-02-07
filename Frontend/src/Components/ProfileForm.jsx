import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfileForm({ onClose }) {
  const [formData, setFormData] = useState({
    userid: "",
    name: "",
    role: "",
    age: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:8080/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData(res.data.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        name: formData.name.trim(),
        age: Number(formData.age),
        gender: formData.gender,
      };

      await axios.put("http://localhost:8080/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile updated successfully ✅");
      onClose();
    } catch (error) {
      console.error("Update failed", error.response?.data);
      alert("Failed to update profile ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative animate-fadeIn">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-400 text-2xl hover:text-black transition"
        >
          ✕
        </button>

        {/* TITLE */}
        <h2 className="text-3xl font-extrabold text-center mb-1">
          My Profile
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Manage your personal information
        </p>

        {/* USER ID */}
        <input
          value={formData.userid}
          disabled
          className="w-full mb-4 px-4 py-3 border rounded-xl bg-gray-100 text-gray-600"
          placeholder="User ID"
        />

        {/* NAME */}
        <input
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full mb-4 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
          placeholder="Full Name"
        />

        {/* ROLE */}
        <input
          value={formData.role}
          disabled
          className="w-full mb-4 px-4 py-3 border rounded-xl bg-gray-100 text-gray-600"
          placeholder="Role"
        />

        {/* AGE */}
        <input
          type="number"
          value={formData.age}
          onChange={(e) =>
            setFormData({ ...formData, age: Number(e.target.value) })
          }
          className="w-full mb-4 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
          placeholder="Age"
        />

        {/* GENDER */}
        <select
          value={formData.gender}
          onChange={(e) =>
            setFormData({ ...formData, gender: e.target.value })
          }
          className="w-full mb-8 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        {/* ACTION */}
        <button
          onClick={updateProfile}
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-full font-bold shadow-lg transition disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
}
