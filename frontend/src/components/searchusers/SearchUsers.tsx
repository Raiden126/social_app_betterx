import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { searchUsersService } from "@/services/searchUsersService";
import { useNavigate } from "react-router-dom";

const SearchUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await searchUsersService.getAllUsers();
        setUsers(data?.data || []);
        setFilteredUsers(data?.data || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      `${user.firstname} ${user.lastname} ${user.username}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleFollow = async (userId: string) => {
    try {
      const response = await searchUsersService.followUser(userId);
      console.log("Follow success:", response.data);

      setFollowedUsers((prev) => new Set(prev).add(userId));
    } catch (error) {
      console.error("Follow failed:", error);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-start space-y-6 p-4 sm:p-6 md:p-8 w-full">
        <input
          type="text"
          placeholder="Search by name or username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-xl mb-4 shadow-sm"
        />

        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex flex-col items-center justify-between bg-black text-white shadow rounded-2xl p-4 h-60"
              >
                <div className="flex flex-col items-center">
                  <img
                    src={
                      user.profilePicture && user.profilePicture.trim() !== ""
                        ? user.profilePicture
                        : "/default_profile.png"
                    }
                    alt={user.firstname}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default_profile.png";
                    }}
                    className="w-22 h-22 rounded-full object-cover mb-2"
                  />
                  <div className="text-center">
                    <div className="font-semibold">
                      {user.firstname} {user.lastname}
                    </div>
                    <div className="text-gray-400 text-sm">
                      @{user.username}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between space-x-2 mt-4 w-full">
                  <button
                    className={`${
                      followedUsers.has(user._id)
                        ? "bg-gray-400"
                        : "bg-blue-600 hover:bg-gray-600"
                    } text-white rounded-full px-3 py-1 text-sm w-1/2`}
                    onClick={() => handleFollow(user._id)}
                    disabled={followedUsers.has(user._id)}
                  >
                    👤 {followedUsers.has(user._id) ? "Following" : "Follow"}
                  </button>
                  <button
                    className="bg-gray-800 text-white rounded-full px-3 py-1 text-sm hover:bg-gray-600 w-1/2"
                    onClick={() => navigate(`/view-profile/${user.username}`)}
                  >
                    👁️ View
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchUsers;