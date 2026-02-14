import React, { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import { ArrowLeft, BookOpen, Clock, Trophy } from "lucide-react";

interface UserDetailProps {
  userId: string;
  onBack: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ userId, onBack }) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await adminService.getUserDetails(userId);
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user details", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDetails();
    }
  }, [userId]);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Loading details...</div>
    );
  if (!userData)
    return <div className="p-8 text-center text-red-500">User not found.</div>;

  const { user, testResults, studySessions, stats } = userData;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500">
              {user.email} • {user.grade || "No Grade"}
            </p>
          </div>
          <div className="bg-indigo-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-indigo-800 font-medium">
              Joined: {new Date(user.joinedDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Test Score</p>
              <h3 className="text-2xl font-bold">
                {stats.averageScore.toFixed(1)}%
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Study Time</p>
              <h3 className="text-2xl font-bold">
                {Math.round(stats.totalStudyTime / 60)} hrs
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sessions Completed</p>
              <h3 className="text-2xl font-bold">{stats.totalSessions}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Test Reports */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Test Reports</h2>
        {testResults.length === 0 ? (
          <p className="text-gray-500 italic">No tests taken yet.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Score
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {testResults.map((test: any) => (
                  <tr key={test._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {test.subject}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(test.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {test.score} / {test.totalQuestions}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          test.percentage >= 80
                            ? "bg-green-100 text-green-700"
                            : test.percentage >= 60
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {test.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Study Sessions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Study Sessions
        </h2>
        {studySessions.length === 0 ? (
          <p className="text-gray-500 italic">No study sessions recorded.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Topic
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {studySessions.map((session: any) => (
                  <tr key={session._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {session.topic}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {session.subject}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {session.duration} mins
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(session.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
