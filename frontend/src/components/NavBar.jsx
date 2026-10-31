import { Link, useNavigate } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slice/authSlice.js';
import { logoutUser } from '../api/user.api.js';
import { useQueryClient } from '@tanstack/react-query';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log(err);
    } finally {
      queryClient.removeQueries({ queryKey: ['currentUser'] });  // 2. clear cached user
      dispatch(logout());
      navigate({ to: '/auth' });
    }
  };

  return (
    <nav className="bg-white border border-b-black">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              URL Shortener
            </Link>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user?.name || 'User'}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;