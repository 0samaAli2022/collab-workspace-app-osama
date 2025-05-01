import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Spinner from '../componenets/Spinner';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { login, register, user, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, displayName);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          {isLogin ? 'Sign In' : 'Create an Account'}
        </h2>

        {/* Show spinner while loading */}
        {isLoading ? (
          <div className="flex justify-center items-center h-56">
            <Spinner loading={isLoading} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white mb-1">Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-900 transition duration-300 transform hover:scale-105"
            >
              {isLogin ? 'Sign In' : 'Register'}
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-gray-300">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-400 hover:underline"
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
