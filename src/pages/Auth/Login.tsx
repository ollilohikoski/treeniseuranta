import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@hooks/context.hooks';
import toast from 'react-hot-toast';
import { handleAuthError } from '@/shared/utils/error.utils';
import { signInWithCredentials, signInWithGoogle, sendPasswordReset } from '@services/auth.service';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const { currentUser } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    const handleEmailPasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithCredentials(email, password);
            toast.success('Kirjautuminen onnistui!');
            navigate('/dashboard');
        } catch (error) {
            console.log(error);
            const errorMessage = handleAuthError(error);
            toast.error(errorMessage);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
            toast.success('Kirjautuminen onnistui!');
            navigate('/dashboard');
        } catch (error) {
            const errorMessage = handleAuthError(error);
            toast.error(errorMessage);
        }
    };

    const handleForgotPassword = async () => {
        try {
            await sendPasswordReset(resetEmail);
            toast.success('Salasanan palautusviesti lähetetty sähköpostiisi.');
        } catch (error) {
            const errorMessage = handleAuthError(error);
            toast.error(errorMessage);
        }
    };


    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-md bg-slate-800 text-black shadow-lg rounded-lg p-8 flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-center text-white">Kirjaudu sisään</h2>

                <form onSubmit={handleEmailPasswordLogin} className='flex flex-col gap-4'>
                    <div>
                        <label className="block text-sm font-bold text-white mb-2">Sähköposti</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Sähköposti"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-white mb-2">Salasana</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Salasana"
                            required
                        />
                    </div>
                    <div className='flex gap-1'>
                        <label className="text-sm font-bold text-white">Näytä salasana</label>
                        <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 mt-2 rounded-lg font-bold hover:bg-blue-600 transition duration-300"
                    >
                        Kirjaudu sisään
                    </button>
                </form>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-red-500 text-white py-2 rounded-lg font-bold hover:bg-red-600 transition duration-300"
                    >
                        Kirjaudu sisään Google-tilillä
                    </button>
                </div>

                <p className="text-center text-white pb-4">
                    Ei vielä tiliä?{' '}
                    <a href="/signup" className="text-blue-500 hover:underline">
                        Luo käyttäjä
                    </a>
                </p>

                <div className="flex flex-col gap-4">
                    <label className="block text-sm font-bold text-white">Unohditko salasanasi?</label>
                    <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Sähköposti"
                        required
                    />
                    <button
                        onClick={handleForgotPassword}
                        className="w-full bg-gray-500 text-white py-2 rounded-lg font-bold hover:bg-gray-600 transition duration-300"
                    >
                        Palauta salasana
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
