import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { BrainCircuit, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [focusedField, setFocusedField] = React.useState(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

  e.preventDefault();

  setLoading(true);

  setError(null);

  try {

    const response = await authService.login(email, password);

    /*
      Handle BOTH formats:
      response.user OR response.data
    */

    const token =
      response.token ||
      response.data?.token;

    const user =
      response.user ||
      response.data?.user ||
      response.data;

    if (!token || !user) {
      throw new Error("Invalid login response");
    }

    login(user, token);

    toast.success("Login successful!");

    navigate("/dashboard");

  }

  catch (err) {

    console.error(err);

    const errorMessage =
      err.response?.data?.error ||
      err.message ||
      "Login failed";

    setError(errorMessage);

    toast.error(errorMessage);

  }

  finally {

    setLoading(false);

  }

};

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]" />

            <div className="relative w-full max-w-md px-6 py-12">
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] shadow-2xl p-8 md:p-10">
                    
                    <div className="text-center mb-10">
                        {/* Sky Blue Theme Icon */}
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-500/30 mb-6">
                            <BrainCircuit className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
                        <p className="text-slate-500 mt-2 text-sm font-medium">Log in to your account to continue</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 z-10 ${focusedField === 'email' ? 'text-sky-500' : 'text-slate-400'}`}>
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm transition-all focus:bg-white focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 z-10 ${focusedField === 'password' ? 'text-sky-500' : 'text-slate-400'}`}>
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm transition-all focus:bg-white focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                                <p className="text-xs text-red-600 text-center font-bold">{error}</p>
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-sky-600 font-bold hover:underline">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
                                


                
