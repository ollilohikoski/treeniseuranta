import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuthContext } from '@hooks/context.hooks';
import { handleAuthError } from '@/shared/utils/error.utils';
import { signInWithGoogle } from '@services/auth.service';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { currentUser } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);


    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        const auth = getAuth();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: '' });
            toast.success('Käyttäjä luotu onnistuneesti!');
        } catch (error) {
            const errorMessage = handleAuthError(error);
            toast.error(errorMessage);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            await signInWithGoogle();
            toast.success('Google-kirjautuminen onnistui!');
        } catch (error) {
            const errorMessage = handleAuthError(error);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-md bg-slate-800 shadow-lg rounded-lg p-8  text-black">
                <h2 className="text-2xl font-bold text-center text-white mb-6">Luo käyttäjä</h2>
                <form onSubmit={handleSignup}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-white mb-2">Sähköposti</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Syötä sähköposti"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-white mb-2">Salasana</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Syötä salasana"
                            required
                        />
                        <div className='flex gap-1'>
                            <label className="text-sm font-bold text-white">Näytä salasana</label>
                            <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition duration-300"
                    >
                        Luo käyttäjä
                    </button>
                </form>

                <div className="flex flex-col gap-4 mt-6">
                    <button
                        onClick={handleGoogleSignup}
                        className="w-full bg-red-500 text-white py-2 rounded-lg font-bold hover:bg-red-600 transition duration-300"
                    >
                        Kirjaudu Google-tilillä
                    </button>
                </div>

                <p className="text-center text-white mt-6">
                    Onko sinulla jo käyttäjä?{' '}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Kirjaudu sisään
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
