import React, { useState } from 'react';
import { Wallet, Mail, Lock, User, ArrowRight, Sparkles, TrendingUp, PieChart } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-screen bg-white font-sans">
      
      {/* LEFT SIDE: The Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full text-left">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100">
              <Wallet size={28} />
            </div>
            <span className="text-2xl font-black text-gray-800 tracking-tight">FinMate</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-500 mb-8">
            {isLogin 
              ? 'Enter your credentials to access your financial dashboard.' 
              : 'Join FinMate and start tracking your finances smarter.'}
          </p>

          <form className={`${isLogin ? 'space-y-5' : 'space-y-3'}`} onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder=""
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder=""
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm" />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className={`w-full bg-gray-50 border border-gray-100 rounded-2xl ${isLogin ? 'py-3.5' : 'py-3'} pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Password</label>
                {isLogin && (
                  <button type="button" className="text-[10px] font-bold text-blue-600 hover:underline tracking-tight">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className={`w-full bg-gray-50 border border-gray-100 rounded-2xl ${isLogin ? 'py-3.5' : 'py-3'} pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm`}
                />
              </div>
            </div>

            <button className={`w-full bg-blue-600 text-white ${isLogin ? 'py-4' : 'py-3.5'} rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 ${isLogin ? 'mt-8' : 'mt-6'}`}>
              {isLogin ? 'Sign In' : 'Get Started'} <ArrowRight size={18} />
            </button>
          </form>

          <p className={`${isLogin ? 'mt-8' : 'mt-6'} text-center text-sm text-gray-500`}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 font-bold hover:underline"
            >
              {isLogin ? 'Sign Up Free' : 'Sign In Now'}
            </button>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Branding/Features */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 p-16 items-center justify-center text-white relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-20 -mb-20 blur-2xl"></div>

        <div className="relative z-10 max-w-md">
          <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl border border-white/20 mb-8">
             <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-blue-200" size={24} />
                <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Smart Finance Tracking</span>
             </div>
             <h2 className="text-2xl font-bold mb-4">Take control of your financial future.</h2>
             <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-blue-50">
                   <TrendingUp className="shrink-0 mt-1" size={16} />
                   <span>Track expenses and income with intuitive dashboards.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-blue-50">
                   <PieChart className="shrink-0 mt-1" size={16} />
                   <span>Set budgets and achieve your savings goals effortlessly.</span>
                </li>
             </ul>
          </div>
          <div className="text-center opacity-60 text-sm italic">
            "The smartest way to manage personal and shared expenses."
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;