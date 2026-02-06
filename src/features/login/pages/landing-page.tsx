import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase/supabase';
import { useAuth } from '@common/hooks/use-auth';
import { Heart, CheckCircle2, ArrowRight, Users, MessageCircle, Share2 } from 'lucide-react';
import logo from '@shared/logo.svg';

export function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    navigate('/home');
    return null;
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setMessage('');

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Success! Check your email to confirm your account.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      }
    }

    setAuthLoading(false);
  };

  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage(error.message);
    }
    setAuthLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden font-sans">
      {/* Left Side: Brand & Preview - 60% width */}
      <div className="hidden lg:flex lg:flex-[1.5] bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 relative overflow-hidden flex-col py-[clamp(1.5rem,3vh,5rem)] px-[clamp(3rem,8vw,15rem)] justify-between">
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-950/10 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-[clamp(35rem,45vw,65rem)]">
          <div className="flex items-center gap-6 lg:gap-10 mb-[clamp(1rem,4vh,4rem)]">
            <img
              src={logo}
              alt="Dinder"
              className="w-16 h-16 lg:w-24 lg:h-24 xl:w-28 xl:h-28 transform hover:rotate-12 transition-transform duration-500 cursor-pointer"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <span className="text-white font-black text-6xl lg:text-7xl xl:text-8xl tracking-tighter drop-shadow-md">
              Dinder
            </span>
          </div>

          <h1 className="text-white text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] mb-[clamp(0.5rem,2vh,1.5rem)]">
            The social <br />
            <span className="text-orange-950/30">way to cook.</span>
          </h1>
          <p className="text-orange-50 text-xl lg:text-2xl xl:text-3xl leading-relaxed opacity-90 font-medium mb-[clamp(1rem,3vh,2.5rem)]">
            Join a vibrant community of food lovers. Discover trending recipes, share your culinary
            masterpieces, and plan your week together.
          </p>

          <div className="space-y-4 lg:space-y-6">
            {[
              {
                icon: <Users className="w-6 h-6 lg:w-7 lg:h-7" />,
                text: 'Follow your favorite home chefs',
              },
              {
                icon: <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7" />,
                text: 'Discuss tips and variations',
              },
              {
                icon: <Share2 className="w-6 h-6 lg:w-7 lg:h-7" />,
                text: 'Share your weekplans with friends',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 text-white/90 text-lg lg:text-xl xl:text-2xl font-bold hover:translate-x-2 transition-transform duration-300"
              >
                <div className="bg-white/20 p-1.5 rounded-xl">{item.icon}</div>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Mockup Preview Area */}
        <div className="relative z-10 mt-4 h-64 lg:h-80 xl:min-h-[320px]">
          <div className="absolute left-0 top-0 w-64 h-80 bg-white rounded-3xl shadow-2xl overflow-hidden transform -rotate-6 hover:rotate-0 transition-transform duration-500 border-4 border-white cursor-pointer group">
            <img
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400"
              className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-500"
              alt="Pizza"
            />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                  <img src="https://i.pravatar.cc/100?u=pizza" alt="avatar" />
                </div>
                <span className="text-xs font-bold text-gray-500">@marcopizza</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">Artisan Pizza</h3>
              <div className="flex gap-3 text-gray-400">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-rose-500 fill-current" />
                  <span className="text-[10px] font-bold">1.2k</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-[10px] font-bold">42</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute left-32 top-8 w-64 h-80 bg-white rounded-3xl shadow-2xl overflow-hidden transform rotate-6 hover:rotate-0 transition-transform duration-500 border-4 border-white z-20 cursor-pointer group">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400"
              className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-500"
              alt="Salad"
            />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                  <img src="https://i.pravatar.cc/100?u=salad" alt="avatar" />
                </div>
                <span className="text-xs font-bold text-gray-500">@greenleaf</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">Buddha Bowl</h3>
              <div className="flex gap-3 text-gray-400">
                <div className="flex items-center gap-1 text-orange-500">
                  <Heart className="w-4 h-4 fill-current" />
                  <span className="text-[10px] font-bold">850</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-[10px] font-bold">18</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-4 relative z-10" />
      </div>

      {/* Right Side: Auth Form - 40% width */}
      <div className="flex-1 flex flex-col items-center px-8 lg:px-16 relative overflow-y-auto bg-white">
        <div className="w-full max-w-md pt-[clamp(8rem,25vh,20rem)] pb-12 flex flex-col min-h-full">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-4 mb-12">
            <img src={logo} alt="Dinder" className="w-12 h-12 cursor-pointer" />
            <span className="text-orange-600 font-black text-4xl tracking-tighter">Dinder</span>
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
              {isSignUp ? 'Create account' : 'Welcome back'}
            </h2>
            <div className="min-h-[48px]">
              <p className="text-gray-500 font-medium mb-8 text-sm lg:text-base">
                {isSignUp
                  ? "Join the world's most delicious social network."
                  : "See what's cooking in your community."}
              </p>
            </div>

            {/* Tabbing Toggle */}
            <div className="flex bg-gray-100/80 rounded-2xl p-1.5 mb-8">
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  isSignUp
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  !isSignUp
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Auth Card */}
          <div className="space-y-6">
            <button
              onClick={handleGoogleAuth}
              disabled={authLoading}
              className="w-full py-4 px-6 border-2 border-gray-100 rounded-2xl text-base font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-gray-400">
                <span className="px-4 bg-white">or use email</span>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignUp && (
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-6 py-4 border-2 border-gray-100 rounded-2xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all font-medium"
                  />
                </div>
              )}
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-6 py-4 border-2 border-gray-100 rounded-2xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all font-medium"
                />
              </div>
              <div className="relative group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-6 py-4 border-2 border-gray-100 rounded-2xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50 shadow-xl shadow-gray-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                {authLoading ? (
                  'Setting things up...'
                ) : (
                  <>
                    {isSignUp ? 'Create account' : 'Sign in'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {message && (
              <div
                className={`p-4 rounded-2xl text-sm font-medium flex items-center gap-3 ${
                  message.includes('Success')
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                {message}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-12">
            <button
              onClick={() => navigate('/home')}
              className="text-gray-400 hover:text-gray-600 text-xs font-bold transition-colors cursor-pointer"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
