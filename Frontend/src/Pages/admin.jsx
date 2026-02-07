import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("");
  const navigate = useNavigate();


  const fetchUsers = async (type) => {
    try {
      const response = await axios.get(`http://localhost:8080/showEmployee/${type}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.data);

      setView(type);
    } catch (error) {
      alert("Unauthorized or Failed to fetch users");
      console.error(error);
    }
  };

  function logout() {
    localStorage.clear();
    navigate("/auth");
  }

  const token = localStorage.getItem("token");
  const deleteHandler = async (userID) => {
    try {

      const res = await axios.delete(`http://localhost:8080/user/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      alert(res.data.message || "User deleted succesfully");
      setUsers(prev => prev.filter(users => users.userId !== userID))
      fetchUsers(view);
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
  const restoreHandler = async (userID) => {
    try {
      const res = await axios.patch(`http://localhost:8080/user/${userID}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      alert(res.data.message || "User Restored succesfully");
      setUsers(prev => prev.filter(users => users.userId !== userID))
      fetchUsers(view);
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to restore user"
      );
    }
  }


  return (

    <div className="min-h-screen bg-gray-100 p-8">
      <button
        className="bg-gray-800 text-white px-4 py-2 rounded-full font-semibold "
        onClick={logout}
      >
        Logout
      </button>
      <h1 className="text-3xl font-bold mb-6 text-center">
        Admin Dashboard
      </h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => fetchUsers("All")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Fetch All Users
        </button>
      </div>
      <div className="flex justify-between"><div className="flex justify-center mb-6">
        <button
          onClick={() => { fetchUsers("Active") }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Fetch Active Users
        </button>
      </div>
      <div className="flex justify-center mb-6">
        <button
          onClick={() => { fetchUsers("NonActive") }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Fetch Non Active Users
        </button>
      </div>
      </div>

      {users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">User ID</th>
                <th className="px-4 py-2 text-left">User Name</th>
                <th className="px-4 py-2 text-left">Age</th>
                <th className="px-4 py-2 text-left">Gender</th>
                {view == "NonActive" && (<th className="px-4 py-2 text-left"> Deleted_At </th>)}
                {view != "All" && (<th className="px-4 py-2 text-left">Action</th>)}
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{user.UserId}</td>
                  <td className="px-4 py-2">{user.UserName}</td>
                  <td className="px-4 py-2">{user.Age}</td>
                  <td className="px-4 py-2">{user.Gender}</td>
                  {view == "NonActive" && (<td className="px-4 py-2">
  {user.DeletedAt?.Valid
    ? new Date(user.DeletedAt.Time).toLocaleString()
    : "Active"}
</td>
)}
                  {view !== "All" && (
                    <td>
                      <button
                        className="px-4 py-1 bg-blue-200 rounded-2xl"
                        onClick={() =>
                          view === "Active"
                            ? deleteHandler(user.UserId)
                            : restoreHandler(user.UserId)
                        }
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
  );
}
