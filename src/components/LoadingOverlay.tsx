import React from 'react';

export default function LoadingOverlay() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
                {/* Outer spinner */}
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 border-solid shadow-lg drop-shadow-glow scale-110"></div>
                {/* Inner spinner */}
                <div className="absolute animate-spin-slow rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-500 border-solid shadow-md drop-shadow-glow2"></div>
                {/* Center dot */}
                <div className="absolute h-6 w-6 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full shadow-xl"></div>
            </div>
            <style jsx global>{`
                .animate-spin-slow {
                    animation: spin 2s linear infinite;
                }
                .drop-shadow-glow {
                    filter: drop-shadow(0 0 16px #60a5fa);
                }
                .drop-shadow-glow2 {
                    filter: drop-shadow(0 0 12px #ec4899);
                }
            `}</style>
        </div>
    );
}
