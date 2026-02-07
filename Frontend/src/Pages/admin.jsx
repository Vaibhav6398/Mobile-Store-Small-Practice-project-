import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchUsers = async (type) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/showEmployee/${type}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data.data);
      setView(type);
      setOpenMenu(false);
    } catch {
      alert("Unauthorized or failed to fetch users");
    }
  };

  function logout() {
    localStorage.clear();
    navigate("/auth");
  }

  const deleteHandler = async (userID) => {
    try {
      await axios.delete(`http://localhost:8080/user/${userID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(view);
    } catch {
      alert("Failed to delete user");
    }
  };

  const restoreHandler = async (userID) => {
    try {
      await axios.patch(
        `http://localhost:8080/user/${userID}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(view);
    } catch {
      alert("Failed to restore user");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-lg px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">

          <button
            onClick={() => navigate("/home")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold"
          >
            Home
          </button>

          <span className="text-2xl font-extrabold">
            Admin Dashboard
          </span>

          {/* USERS DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold"
            >
              Users ▾
            </button>

            {openMenu && (
              <div className="absolute top-12 left-0 bg-white text-gray-800 shadow-xl rounded-2xl overflow-hidden w-44">
                <button
                  onClick={() => fetchUsers("All")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  All Users
                </button>
                <button
                  onClick={() => fetchUsers("Active")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Active Users
                </button>
                <button
                  onClick={() => fetchUsers("NonActive")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Deleted Users
                </button>
              </div>
            )}
          </div>

          <button className="text-gray-300 hover:text-yellow-400">
            Reports
          </button>

          <button className="text-gray-300 hover:text-yellow-400">
            Settings
          </button>
        </div>

        <button
          onClick={logout}
          className="bg-black hover:bg-gray-900 px-5 py-2 rounded-full font-semibold"
        >
          Logout
        </button>
      </nav>

      {/* CONTENT */}
      <div className="p-10">

        {/* EMPTY STATE */}
        {users.length === 0 && !view && (
          <div className="flex flex-col items-center justify-center text-center mt-28">
            <div className="bg-white/70 backdrop-blur-lg p-12 rounded-3xl shadow-2xl max-w-xl">
              <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
                Welcome, Admin 👋
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Manage users, monitor activity, and keep your platform
                running smoothly from one powerful dashboard.
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => fetchUsers("All")}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold"
                >
                  View All Users
                </button>

                <button
                  onClick={() => fetchUsers("Active")}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold"
                >
                  Active Users
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TABLE */}
        {users.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-3xl shadow-2xl p-6">
            <table className="min-w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-4 py-3">User ID</th>
                  <th className="px-4 py-3">User Name</th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">Gender</th>
                  {view === "NonActive" && (
                    <th className="px-4 py-3">Deleted At</th>
                  )}
                  {view !== "All" && (
                    <th className="px-4 py-3">Action</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{user.UserId}</td>
                    <td className="px-4 py-3 font-medium">
                      {user.UserName}
                    </td>
                    <td className="px-4 py-3">{user.Age}</td>
                    <td className="px-4 py-3">{user.Gender}</td>

                    {view === "NonActive" && (
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {user.DeletedAt?.Valid
                          ? new Date(user.DeletedAt.Time).toLocaleString()
                          : "Active"}
                      </td>
                    )}

                    {view !== "All" && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            view === "Active"
                              ? deleteHandler(user.UserId)
                              : restoreHandler(user.UserId)
                          }
                          className={`px-5 py-1.5 rounded-full text-white font-semibold
                            ${
                              view === "Active"
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                        >
                          {view === "Active" ? "Delete" : "Restore"}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
