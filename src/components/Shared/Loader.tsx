import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-slate-800 rounded-lg p-8 flex flex-col items-center">
                <div className="w-16 h-16 border-8 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
                <p className="text-white font-semibold">Ladataan...</p>
            </div>
        </div>
    );
};

export default Loader;