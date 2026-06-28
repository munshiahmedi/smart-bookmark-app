import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        confirmPassword
      });
      alert(res.data.message);
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'}}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '448px', padding: '32px'}}>
        <div className="text-center mb-8" style={{textAlign: 'center', marginBottom: '32px'}}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4" style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', backgroundColor: '#dbeafe', borderRadius: '50%', marginBottom: '16px'}}>
            <BookOpen className="w-8 h-8 text-blue-600" style={{width: '32px', height: '32px', color: '#2563eb'}} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2" style={{fontSize: 'clamp(24px, 5vw, 30px)', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px'}}>Create Account</h2>
          <p className="text-gray-600" style={{color: '#4b5563', fontSize: 'clamp(14px, 3vw, 16px)'}}>Join Smart Book today</p>
        </div>
        
        <div className="space-y-4" style={{display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box'}}>
          <div className="relative" style={{position: 'relative', width: '100%', boxSizing: 'border-box'}}>
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" style={{position: 'absolute', left: '12px', top: '12px', width: '20px', height: '20px', color: '#9ca3af'}} />
            <input 
              type="text" 
              placeholder="Full Name" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              style={{width: '100%', boxSizing: 'border-box', paddingLeft: '40px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', fontSize: 'clamp(14px, 3vw, 16px)'}}
            />
          </div>
          
          <div className="relative" style={{position: 'relative', width: '100%', boxSizing: 'border-box'}}>
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" style={{position: 'absolute', left: '12px', top: '12px', width: '20px', height: '20px', color: '#9ca3af'}} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              style={{width: '100%', boxSizing: 'border-box', paddingLeft: '40px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', fontSize: 'clamp(14px, 3vw, 16px)'}}
            />
          </div>
          
          <div className="relative" style={{position: 'relative', width: '100%', boxSizing: 'border-box'}}>
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" style={{position: 'absolute', left: '12px', top: '12px', width: '20px', height: '20px', color: '#9ca3af'}} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              style={{width: '100%', boxSizing: 'border-box', paddingLeft: '40px', paddingRight: '48px', paddingTop: '12px', paddingBottom: '12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s'}}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              style={{position: 'absolute', right: '12px', top: '12px', color: '#9ca3af', cursor: 'pointer', background: 'none', border: 'none', zIndex: 10}}
            >
              {showPassword ? <EyeOff className="w-5 h-5" style={{width: '20px', height: '20px'}} /> : <Eye className="w-5 h-5" style={{width: '20px', height: '20px'}} />}
            </button>
          </div>

          <div className="relative" style={{position: 'relative', width: '100%', boxSizing: 'border-box'}}>
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" style={{position: 'absolute', left: '12px', top: '12px', width: '20px', height: '20px', color: '#9ca3af'}} />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              style={{width: '100%', boxSizing: 'border-box', paddingLeft: '40px', paddingRight: '48px', paddingTop: '12px', paddingBottom: '12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s'}}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              style={{position: 'absolute', right: '12px', top: '12px', color: '#9ca3af', cursor: 'pointer', background: 'none', border: 'none', zIndex: 10}}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" style={{width: '20px', height: '20px'}} /> : <Eye className="w-5 h-5" style={{width: '20px', height: '20px'}} />}
            </button>
          </div>
        </div>
        
        <button 
          onClick={handleRegister}
          disabled={isLoading}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{width: '100%', marginTop: '24px', backgroundColor: '#2563eb', color: 'white', paddingTop: '12px', paddingBottom: '12px', borderRadius: '8px', fontWeight: '600', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', transition: 'background-color 0.2s', fontSize: 'clamp(14px, 3vw, 16px)'}}
          onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#2563eb')}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" style={{width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
              Creating Account...
            </>
          ) : (
            'Sign Up'
          )}
        </button>
        
        <div className="mt-6 text-center" style={{marginTop: '24px', textAlign: 'center'}}>
          <p className="text-gray-600" style={{color: '#4b5563'}}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              style={{color: '#2563eb', textDecoration: 'none', fontWeight: '600'}}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
