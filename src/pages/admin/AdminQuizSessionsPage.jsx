import { useState, useEffect } from "react";
import { getSessions, getSessionLeaderboard } from "../../services/quizService";
import Spinner from "../../components/ui/Spinner";
import { Calendar, Clock, CheckCircle, X, Trophy } from "lucide-react";

export default function AdminQuizSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);

  useEffect(() => {
    getSessions()
      .then(setSessions)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "live":
        return <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase rounded-full tracking-wider border border-green-200">Live Now</span>;
      case "completed":
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase rounded-full tracking-wider border border-gray-200">Completed</span>;
      default:
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase rounded-full tracking-wider border border-blue-200">Upcoming</span>;
    }
  };

  const handleViewLeaderboard = async (session) => {
    setSelectedSession(session);
    setIsLeaderboardLoading(true);
    try {
      const data = await getSessionLeaderboard(session.id);
      setLeaderboardData(data?.top_three || []);
    } catch (e) {
      console.error(e);
      setLeaderboardData([]);
    } finally {
      setIsLeaderboardLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quiz Sessions</h1>
        <p className="text-base text-gray-500 mt-2">Manage all live, scheduled, and completed quiz sessions.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-20">
          <Spinner size={32} className="text-gray-400" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <Calendar className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No Sessions Found</h3>
          <p className="text-gray-500 text-sm">You haven't created any quiz sessions yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <th className="p-4 pl-6 w-16">ID</th>
                  <th className="p-4">Session Details</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Open Time</th>
                  <th className="p-4">Close Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sessions.map((session) => (
                  <tr key={session.id} 
                      onClick={() => handleViewLeaderboard(session)}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                    <td className="p-4 pl-6">
                      <span className="font-mono text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">#{session.id}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-900 text-sm mb-0.5">{session.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{session.description}</p>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(session.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(session.open_time).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                        <CheckCircle className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(session.close_time).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" /> Leaderboard
                </h3>
                <p className="text-xs text-gray-500 mt-1">{selectedSession.title}</p>
              </div>
              <button 
                onClick={() => setSelectedSession(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {isLeaderboardLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner size={24} className="text-[#008751]" />
                </div>
              ) : leaderboardData.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 font-medium">No leaderboard data available.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboardData.map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:border-gray-200 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          user.position === 1 ? 'bg-yellow-100 text-yellow-700' :
                          user.position === 2 ? 'bg-gray-200 text-gray-700' :
                          user.position === 3 ? 'bg-amber-100/50 text-amber-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          #{user.position}
                        </div>
                        <span className="font-bold text-sm text-gray-900">{user.username || user.full_name || `User ${user.user_id}`}</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-[#008751] bg-[#008751]/10 px-3 py-1 rounded-full">
                        {user.total_score.toLocaleString()}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
