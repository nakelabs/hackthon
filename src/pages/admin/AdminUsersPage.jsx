import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { adminSearchUsers } from "../../services/adminService";
import { Link } from "react-router-dom";

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.trim().length === 0) {
        setUsers([]);
        return;
      }
      setLoading(true);
      try {
        const data = await adminSearchUsers(query.trim());
        setUsers(data.users || []);
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Search</h1>
        <p className="text-sm text-gray-500 mt-1">
          Search for users on the platform by their username, full name, or email.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black shadow-sm transition-all text-sm font-medium"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {users.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-white">
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">User</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap hidden sm:table-cell">ID</th>
                  <th className="text-right px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="bg-white transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden shrink-0 bg-white flex items-center justify-center font-bold text-gray-900">
                          {(user.full_name || user.username || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 line-clamp-1">{user.full_name || user.username}</p>
                          <p className="text-[11px] font-medium text-gray-500 mt-0.5">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-500 hidden sm:table-cell">
                      #{user.id}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <Link
                        to={`/profile/${user.id}`}
                        target="_blank"
                        className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-gray-900 bg-gray-50 hover:bg-black hover:text-white border border-gray-200 rounded-lg transition-colors"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : query.trim().length > 0 && !loading ? (
          <div className="text-center py-16 text-gray-500 text-sm font-medium">
            No users found matching "{query}"
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 text-sm">
            Type in the box above to search for users.
          </div>
        )}
      </div>
    </div>
  );
}
