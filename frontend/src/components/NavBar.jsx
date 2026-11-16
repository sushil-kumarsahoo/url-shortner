import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slice/authSlice.js';
import { logoutUser } from '../api/user.api.js';
import { useQueryClient } from '@tanstack/react-query';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === '/';
  const isDashboard = pathname === '/dashboard';

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log(err);
    } finally {
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      dispatch(logout());
      navigate({ to: '/auth' });
    }
  };

  const displayName = user?.name || user?.user?.name || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Full width container with edge padding */}
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-16 relative">
          
          {/* 1. Far Left: Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-purple-700 flex items-center justify-center text-white shadow-md shadow-purple-700/25 group-hover:scale-105 transition-transform">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Short<span className="text-purple-700">ly</span>
              </span>
            </Link>
          </div>

          {/* 2. Middle: Navigation Links (Home & Dashboard with Active Indicator) */}
          <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60 shadow-inner">
            <Link
              to="/"
              className={`px-4 py-1.5 text-xs sm:text-sm rounded-xl transition-all ${
                isHome
                  ? 'bg-white text-purple-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              Home
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`px-4 py-1.5 text-xs sm:text-sm rounded-xl transition-all ${
                  isDashboard
                    ? 'bg-white text-purple-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* 3. Far Right: User Profile & Logout / Sign In Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium hover:bg-slate-100 transition-colors"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs font-bold">
                    {initial}
                  </div>
                  <span className="max-w-[80px] sm:max-w-[120px] truncate">{displayName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors border border-slate-200/80 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Link
                  to="/auth"
                  className="text-slate-700 hover:text-purple-700 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-purple-700/25 hover:shadow-purple-700/35 transition-all duration-200 cursor-pointer"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Links Row (visible on small mobile screens below sm) */}
      {isAuthenticated && (
        <div className="sm:hidden flex justify-center items-center py-2 border-t border-slate-100 bg-slate-50/50">
          <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/60">
            <Link
              to="/"
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                isHome
                  ? 'bg-white text-purple-700 font-semibold shadow-xs'
                  : 'text-slate-600 font-medium'
              }`}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                isDashboard
                  ? 'bg-white text-purple-700 font-semibold shadow-xs'
                  : 'text-slate-600 font-medium'
              }`}
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
