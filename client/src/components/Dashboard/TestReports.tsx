import React, { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  Target,
  AlertCircle,
  Calendar,
  Layers,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { reportService } from "../../services/reportService";

interface TestReport {
  _id: string;
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  weakTopics: string[];
  date: string;
}

const TestReports: React.FC = () => {
  const [reports, setReports] = useState<TestReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await reportService.getUserTestReports();
        setReports(data || []);
      } catch (err) {
        console.error("Failed to load reports", err);
        setError("Could not load your test reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
    if (percentage >= 40) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
            My Test Reports
          </h2>
          <p className="text-gray-500 text-sm">
            Review your past performance and identify areas for improvement.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold">Total Tests</p>
              <p className="text-lg font-black text-gray-900">
                {reports.length}
              </p>
            </div>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold">Avg Score</p>
              <p className="text-lg font-black text-gray-900">
                {reports.length > 0
                  ? Math.round(
                      reports.reduce((acc, r) => acc + (r.percentage || 0), 0) /
                        reports.length,
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {reports.length === 0 && !error ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4">
            <FileText className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Test Reports Yet
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Take a self-assessment test to generate your first performance
            report.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {report.subject}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 font-medium z-10 relative">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(report.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-xl border-2 font-black text-sm ${getPercentageColor(
                    report.percentage || 0,
                  )}`}
                >
                  {Math.round(report.percentage || 0)}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold mb-1">Score</p>
                  <p className="text-lg font-black text-gray-900">
                    {report.score}{" "}
                    <span className="text-gray-400 text-sm font-semibold">
                      / {report.totalQuestions}
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold mb-1">Time</p>
                  <p className="text-lg font-black text-gray-900 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" /> N/A
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Areas to Improve
                </h4>
                {report.weakTopics && report.weakTopics.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {report.weakTopics.slice(0, 3).map((topic, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-[11px] font-bold border border-red-100 inline-block max-w-[200px] truncate"
                        title={topic}
                      >
                        {topic}
                      </span>
                    ))}
                    {report.weakTopics.length > 3 && (
                      <span className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-lg text-[11px] font-bold border border-gray-200">
                        +{report.weakTopics.length - 3} more
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 p-2 rounded-xl border border-green-100">
                    <CheckCircle2 className="w-4 h-4" /> No weak topics
                    identified!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestReports;
