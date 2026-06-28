import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    
    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters long");
            return;
        }

        if (currentPassword === newPassword) {
            setError("New password must be different from current password");
            return;
        }
        
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try{
            const token = localStorage.getItem('token');
            const res = await axios.put("http://localhost:5000/api/auth/change-password", {
                currentPassword,
                newPassword,
                confirmPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            setSuccess(res.data.message);
            setTimeout(() => {
                navigate('/profile');
            }, 2000);
            
        } catch (error) {
            console.error("Change password error:", error);
            setError(error.response?.data?.message || "Failed to change password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'}}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8" style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '448px', padding: '32px', boxSizing: 'border-box'}}>
                <div className="text-center mb-8" style={{textAlign: 'center', marginBottom: '32px'}}>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4" style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', backgroundColor: '#fed7aa', borderRadius: '50%', marginBottom: '16px'}}>
                        <Lock className="w-8 h-8 text-orange-600" style={{width: '32px', height: '32px', color: '#ea580c'}} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2" style={{fontSize: 'clamp(24px, 5vw, 30px)', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px'}}>Change Password</h2>
                    <p className="text-gray-600" style={{color: '#4b5563', fontSize: 'clamp(14px, 3vw, 16px)'}}>Update your account password</p>
                </div>
                
                {/* Error and Success Messages */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6" 
                         style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px'}}>
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6" 
                         style={{backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px'}}>
                        {success}
                    </div>
                )}
                
                <div style={{width: '100%', boxSizing: 'border-box'}}>
                    <div className="space-y-4" style={{display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box'}}>
                        {/* Current Password */}
                        <div className="relative" style={{position: 'relative', width: '100%', boxSizing: 'border-box'}}>
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" style={{position: 'absolute', left: '12px', top: '12px', width: '20px', height: '20px', color: '#9ca3af'}} />
                            <input 
                                type={showCurrentPassword ? "text" : "password"} 
                                placeholder="Current Password" 
                                value={currentPassword} 
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                style={{width: '100%', boxSizing: 'border-box', paddingLeft: '40px', paddingRight: '48px', paddingTop: '12px', paddingBottom: '12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', fontSize: 'clamp(14px, 3vw, 16px)'}}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                style={{position: 'absolute', right: '12px', top: '12px', color: '#9ca3af', cursor: 'pointer', background: 'none', border: 'none', zIndex: 10, width: '20px', height: '20px', padding: 0}}
                            >
                                {showCurrentPassword ? <EyeOff className="w-5 h-5" style={{width: '20px', height: '20px'}} /> : <Eye className="w-5 h-5" style={{width: '20px', height: '20px'}} />}
                            </button>
                        </div>
                        
                        {/* New Password */}
                        <div className="relative" style={{position: 'relative', width: '100%', boxSizing: 'border-box', overflow: 'hidden'}}>
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" style={{position: 'absolute', left: '12px', top: '12px', width: '20px', height: '20px', color: '#9ca3af', zIndex: 5}} />
                            <input 
                                type={showNewPassword ? "text" : "password"} 
                                placeholder="New Password" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                style={{width: '100%', boxSizing: 'border-box', paddingLeft: '40px', paddingRight: '48px', paddingTop: '12px', paddingBottom: '12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', display: 'block', fontSize: 'clamp(14px, 3vw, 16px)'}}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                style={{position: 'absolute', right: '12px', top: '12px', color: '#9ca3af', cursor: 'pointer', background: 'none', border: 'none', zIndex: 10, width: '20px', height: '20px', padding: 0}}
                            >
                                {showNewPassword ? <EyeOff className="w-5 h-5" style={{width: '20px', height: '20px'}} /> : <Eye className="w-5 h-5" style={{width: '20px', height: '20px'}} />}
                            </button>
                        </div>

                        {/* Confirm New Password */}
                        <div className="relative" style={{position: 'relative', width: '100%', boxSizing: 'border-box', overflow: 'hidden'}}>
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" style={{position: 'absolute', left: '12px', top: '12px', width: '20px', height: '20px', color: '#9ca3af', zIndex: 5}} />
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="Confirm New Password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleChangePassword()}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                style={{width: '100%', boxSizing: 'border-box', paddingLeft: '40px', paddingRight: '48px', paddingTop: '12px', paddingBottom: '12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', transition: 'all 0.2s', display: 'block', fontSize: 'clamp(14px, 3vw, 16px)'}}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                style={{position: 'absolute', right: '12px', top: '12px', color: '#9ca3af', cursor: 'pointer', background: 'none', border: 'none', zIndex: 10, width: '20px', height: '20px', padding: 0}}
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" style={{width: '20px', height: '20px'}} /> : <Eye className="w-5 h-5" style={{width: '20px', height: '20px'}} />}
                            </button>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleChangePassword}
                        disabled={isLoading}
                        className="w-full mt-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{width: '100%', marginTop: '24px', background: 'linear-gradient(90deg, #ea580c 0%, #d97706 100%)', color: 'white', paddingTop: '12px', paddingBottom: '12px', borderRadius: '8px', fontWeight: '600', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', transition: 'all 0.2s', boxSizing: 'border-box', fontSize: 'clamp(14px, 3vw, 16px)'}}
                        onMouseEnter={(e) => !isLoading && (e.target.style.background = 'linear-gradient(90deg, #c2410c 0%, #b45309 100%)')}
                        onMouseLeave={(e) => !isLoading && (e.target.style.background = 'linear-gradient(90deg, #ea580c 0%, #d97706 100%)')}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" style={{width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
                                Updating Password...
                            </>
                        ) : (
                            'Change Password'
                        )}
                    </button>
                </div>
                
                <div className="mt-6 text-center" style={{marginTop: '24px', textAlign: 'center'}}>
                    <Link 
                        to="/profile" 
                        className="text-orange-600 hover:text-orange-700 font-semibold hover:underline inline-flex items-center gap-2"
                        style={{color: '#ea580c', textDecoration: 'none', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '8px'}}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                        <ArrowLeft className="w-4 h-4" style={{width: '16px', height: '16px'}} />
                        Back to Profile
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword;
