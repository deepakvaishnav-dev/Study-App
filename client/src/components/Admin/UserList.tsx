import React, { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import { ViewMode } from "../../types";
import { Search, ChevronRight } from "lucide-react";

interface UserListProps {
  setView: (view: ViewMode) => void;
  setSelectedUser: (userId: string) => void; // We need to pass this state up or via context
}

const UserList: React.FC<UserListProps> = ({ setView, setSelectedUser }) => {
  const [users, setUsers] = useState<
    {
      _id: string;
      name: string;
      email: string;
      grade?: string;
      joinedDate: string;
      testsTaken?: number;
      averageScore?: number;
    }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleUserClick = (userId: string) => {
    setSelectedUser(userId);
    setView(ViewMode.AdminUserDetail);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Grade
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">
                  Tests Taken
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">
                  Avg Score
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">
                  Joined
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 hidden md:table-cell">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full">
                        {user.grade || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-700">
                      {user.testsTaken || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                          (user.averageScore || 0) >= 80
                            ? "bg-green-100 text-green-700"
                            : (user.averageScore || 0) >= 50
                              ? "bg-blue-100 text-blue-700"
                              : (user.averageScore || 0) > 0
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {user.averageScore || 0}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">
                      {new Date(user.joinedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleUserClick(user._id)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                      >
                        Details <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
