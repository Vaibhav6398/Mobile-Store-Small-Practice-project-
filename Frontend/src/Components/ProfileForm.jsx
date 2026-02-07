import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfileForm({onClose}) {
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
        console.log(token);
        const res = await axios.get(
          "http://localhost:8080/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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


    await axios.put(
      "http://localhost:8080/profile",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Profile updated successfully ✅");
  } catch (error) {
    console.error("Update failed", error.response?.data);
    alert("Failed to update profile ❌");
  } finally {
    setLoading(false);
  }
};

return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 relative">
        
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 text-xl hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">
          My Profile
        </h2>

        <input
          value={formData.userid}
          disabled
          className="w-full mb-3 px-4 py-2 border rounded-lg bg-gray-100"
        />

        <input
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full mb-3 px-4 py-2 border rounded-lg"
          placeholder="Name"
        />

        <input
          value={formData.role}
          disabled
          className="w-full mb-3 px-4 py-2 border rounded-lg bg-gray-100"
        />

        <input
          type="number"
          value={formData.age}
          onChange={(e) =>
            setFormData({
              ...formData,
              age: Number(e.target.value),
            })
          }
          className="w-full mb-3 px-4 py-2 border rounded-lg"
          placeholder="Age"
        />

        <select
          value={formData.gender}
          onChange={(e) =>
            setFormData({ ...formData, gender: e.target.value })
          }
          className="w-full mb-6 px-4 py-2 border rounded-lg"
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <button
          onClick={updateProfile}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
}