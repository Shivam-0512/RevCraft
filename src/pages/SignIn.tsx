import React, { useState } from 'react';
import axios from "axios";
import { Link,useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserIcon, KeyIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from 'lucide-react';
const SignIn = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (isLogin) {
      // Sign In
      const res = await axios.post("https://backend-vale.onrender.com/api/login", {
        email,
        password
      });
      // Save JWT token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.removeItem("modbot_chat_history"); 
      window.dispatchEvent(new Event("userChanged"));
      navigate('/'); 
      toast.success('Successfully signed in!');
  
    } else {
      // Register
      const res = await axios.post("https://backend-vale.onrender.com/api/register", {
        username: name,
        email,
        password
      });
      toast.success('Account created successfully!');
      // Optionally auto-login or switch to login tab
      setIsLogin(true);
    }
  } catch (err: any) {
    toast.error(
      err?.response?.data?.error ||
      (isLogin ? "Sign in failed!" : "Registration failed!")
    );
  }
};
  return <div className="w-full bg-zinc-900 min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="text-gray-400">
              {isLogin ? 'Sign in to access your account and continue your car modification journey.' : 'Join RevCraft to unlock exclusive deals and track your orders.'}
            </p>
          </div>
          <div className="bg-zinc-800 rounded-xl p-6 shadow-xl border border-zinc-700">
            <div className="flex mb-6">
              <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-center font-medium rounded-l-lg transition-colors ${isLogin ? 'bg-orange-500 text-white' : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'}`}>
                Sign In
              </button>
              <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-center font-medium rounded-r-lg transition-colors ${!isLogin ? 'bg-orange-500 text-white' : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'}`}>
                Register
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {!isLogin && <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-zinc-600 rounded-lg bg-zinc-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="John Doe" required />
                  </div>
                </div>}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-zinc-600 rounded-lg bg-zinc-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="your@email.com" required />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={e => setPassword(e.target.value)} className="block w-full pl-10 pr-10 py-2 border border-zinc-600 rounded-lg bg-zinc-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder={isLogin ? '••••••••' : '8+ characters'} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>
              {isLogin && <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                      Remember me
                    </label>
                  </div>
                  <Link to="#" className="text-sm text-orange-500 hover:text-orange-400">
                    Forgot password?
                  </Link>
                </div>}
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            <div className="relative flex items-center justify-center mt-6">
              <div className="border-t border-zinc-700 absolute w-full"></div>
              <div className="bg-zinc-800 px-4 relative text-sm text-gray-400">
                or continue with
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button className="flex items-center justify-center py-2 px-4 border border-zinc-600 rounded-lg hover:bg-zinc-700 transition-colors">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  <path fill="currentColor" d="M1 1h22v22H1z"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center py-2 px-4 border border-zinc-600 rounded-lg hover:bg-zinc-700 transition-colors">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
                Facebook
              </button>
            </div>
            <div className="mt-6 text-center text-sm text-gray-400">
              <div className="flex items-center justify-center">
                <LockIcon className="h-4 w-4 mr-1" /> Secure authentication
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default SignIn;