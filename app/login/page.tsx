"use client";

import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50 p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Smart Bookmark App</h1>
        <p className="text-gray-600 mb-8">Save and manage your links securely</p>
        
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.28426 53.749 C -8.73374 55.894 -10.1241 57.604 -12.0916 58.604 L -12.1016 61.879 L -6.99957 65.329 C -4.99957 64.069 -3.264 61.919 -3.264 51.509 Z"/>
              <path fill="#34A853" d="M -14.754 63.239 C -9.9138 63.239 -5.80914 61.349 -3.156 58.354 L -7.33626 54.994 C -8.5464 56.114 -10.3691 56.759 -12.1496 56.759 C -17.2038 56.759 -21.27 53.249 -22.8757 48.624 L -27.024 48.624 L -27.024 52.114 C -24.6152 57.039 -20.014 63.239 -14.754 63.239 Z"/>
              <path fill="#FBBC05" d="M -22.8757 48.624 C -23.6082 46.604 -24.024 44.419 -24.024 42.154 C -24.024 39.884 -23.6187 37.699 -22.8757 35.684 L -22.8757 32.194 L -27.024 32.194 C -29.2435 36.444 -30.024 41.164 -30.024 42.154 C -30.024 43.144 -29.2435 47.864 -27.024 52.114 L -22.8757 48.624 Z"/>
              <path fill="#EA4335" d="M -14.754 27.549 C -11.8643 27.549 -9.2138 28.604 -7.0914 30.424 L -2.83014 26.329 C -5.79957 23.554 -10.064 21.069 -14.754 21.069 C -20.014 21.069 -24.6152 24.269 -27.024 29.194 L -22.8757 32.684 C -21.27 28.059 -17.2038 27.549 -14.754 27.549 Z"/>
            </g>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
