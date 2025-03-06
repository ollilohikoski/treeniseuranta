import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '@components/Shared/ConfirmModal';
import { toast } from 'react-hot-toast';
import { useAuthContext } from '@hooks/context.hooks';
import { updateUser } from '@services/user.service';
import Loader from '@components/Shared/Loader';

const NameSelection: React.FC = () => {
    const { currentUser, authLoading } = useAuthContext();
    const [newName, setNewName] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser?.nameChosen) {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    };

    const handleConfirm = () => {
        if (newName.length >= 5) {
            setIsConfirmModalOpen(true);
        } else {
            toast.error("Käyttäjänimen on oltava vähintään 5 merkkiä pitkä.");
        }
    };

    const handleFinalConfirm = async () => {
        setLoading(true);
        try {
            await updateUser({ ...currentUser!, displayName: newName, nameChosen: true });
            setIsConfirmModalOpen(false);
            toast.success('Nimi asetettu!');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Nimen asettaminen epäonnistui');
        }
        setLoading(false);
    };

    if (authLoading) return <Loader />;

    return (
        <>
            <div className="flex justify-center items-center bg-slate-900">
                <div className="w-full  max-w-md bg-slate-800 p-8 rounded-lg shadow-lg flex flex-col gap-6">
                    <h1 className="text-2xl font-semibold text-gray-100">Syötä koko nimesi</h1>
                    <input
                        type="text"
                        className="w-full p-3 text-lg rounded-md bg-slate-700 text-gray-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nimi"
                        value={newName}
                        onChange={handleNameChange}
                    />
                    <button
                        className="w-full bg-blue-700 hover:bg-blue-600 text-white py-2 rounded-md text-lg transition-colors duration-200"
                        onClick={handleConfirm}
                    >
                        Vahvista
                    </button>
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleFinalConfirm}
                title="Vahvista nimi"
                content={<p>Oletko varma, että haluat asettaa nimeksesi <span className='font-semibold text-nowrap'>{newName}</span>? Et voi muuttaa nimeä myöhemmin.</p>}
            />
            {loading && <Loader />}
        </>
    );
};

export default NameSelection;