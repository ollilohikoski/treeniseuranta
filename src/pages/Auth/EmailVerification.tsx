import React, { useEffect, useState } from 'react';
import { useAuthContext } from '@hooks/context.hooks';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Loader from '@components/Shared/Loader';
import { checkEmailVerification, sendVerificationEmail } from '@services/auth.service';

const EmailVerification: React.FC = () => {
    const { currentUser, authLoading } = useAuthContext();
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading) {
            if (!currentUser) {
                navigate('/login');
            } else if (currentUser.isVerified) {
                navigate('/dashboard');
            }
        }
    }, [currentUser, authLoading, navigate]);

    const handleSendVerificationEmail = async () => {
        setIsSending(true);
        try {
            await sendVerificationEmail();
            setIsSent(true);
            toast.success('Vahvistusviesti lähetetty onnistuneesti! Tarkista sähköpostisi.');
        } catch (error) {
            toast.error('Vahvistusviestin lähettäminen epäonnistui.');
        }
        setIsSending(false);
    };

    const handleCheckVerification = async () => {
        setIsLoading(true);
        try {
            const isVerified = await checkEmailVerification();
            if (isVerified) {
                toast.success('Sähköposti on vahvistettu!');
                navigate('/set-name');
            } else {
                toast.error('Sähköpostia ei ole vielä vahvistettu. Yritä uudelleen.');
            }
        } catch (error) {
            toast.error('Vahvistuksen tarkistaminen epäonnistui.');
        }
        setIsLoading(false);
    };

    if (authLoading) return <Loader />;
    if (!currentUser || currentUser.isVerified) return null;

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-md bg-slate-800 shadow-lg rounded-lg p-8 text-white flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-center">Sähköpostisi täytyy vahvistaa</h2>
                <p className="text-center">
                    Ole hyvä ja vahvista sähköpostiosoitteesi klikkaamalla linkkiä, jonka lähetämme sinulle osoitteeseen: <span className='font-semibold'>{currentUser.email}</span>.
                </p>
                <button
                    onClick={handleSendVerificationEmail}
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition duration-300"
                >
                    {isSending ? 'Lähetetään...' : 'Lähetä vahvistusviesti'}
                </button>
                {isSent && (
                    <button
                        onClick={handleCheckVerification}
                        disabled={isLoading}
                        className="w-full bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600 transition duration-300"
                    >
                        {isLoading ? 'Tarkistetaan...' : 'Olen vahvistanut sähköpostini'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default EmailVerification;