import React, { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import { ViewMode } from "../../types";
import { Users, FileText, Activity } from "lucide-react";

interface AdminDashboardProps {
  setView: (view: ViewMode) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ setView }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTests: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await adminService.getAllUsers();
        setStats({
          totalUsers: data.length,
          activeUsers: data.length, // Placeholder logic
          totalTests: data.reduce(
            (acc: number, user: { testsTaken?: number }) =>
              acc + (user.testsTaken || 0),
            0,
          ),
        });
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
            </div>
          </div>
        </div>

        {/* Placeholder Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Sessions</p>
              <h3 className="text-2xl font-bold">--</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Reports</p>
              <h3 className="text-2xl font-bold">{stats.totalTests}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => setView(ViewMode.AdminUsers)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Manage Users
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
