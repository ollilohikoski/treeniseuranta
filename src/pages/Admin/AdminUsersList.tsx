import React, { useState } from 'react';
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "@components/Shared/ConfirmModal";
import { useAllUsers } from "@hooks/user.hooks";
import { formatDate } from "@/shared/utils/date.utils";
import PageLoader from "@components/Shared/Loader";
import { updateUserActiveStatus } from "@services/user.service";
import { Timestamp, FieldValue } from "firebase/firestore";

const AdminUsersList: React.FC = () => {
    const { users, usersLoading } = useAllUsers();
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'activate' | 'unactivate' | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        hasAccess: 'all', // 'all', 'granted', 'not_granted'
        hasNameAndConfirmed: 'all' // 'all', 'confirmed', 'not_confirmed'
    });

    const handleConfirm = async () => {
        if (!selectedUserId || !confirmAction) return;
        try {
            if (confirmAction === 'activate') {
                await updateUserActiveStatus(selectedUserId, true);
                toast.success('Pelaaja on saanut käyttöoikeuden!');
            } else if (confirmAction === 'unactivate') {
                await updateUserActiveStatus(selectedUserId, false);
                toast.success('Pelaajan käyttöoikeus on poistettu.');
            }
        } catch (error) {
            toast.error('Toiminto epäonnistui. Yritä uudelleen.');
        }
        setConfirmModalOpen(false);
        setConfirmAction(null);
        setSelectedUserId(null);
    };

    const openConfirmModal = (action: 'activate' | 'unactivate', userId: string) => {
        setConfirmAction(action);
        setSelectedUserId(userId);
        setConfirmModalOpen(true);
    };

    const nonSuperUsers = users.filter(user => !user.isSuperUser);

    // Messy but necessary sort function to handle firebase timestamps.
    const sortedUsers = [...nonSuperUsers].sort((a, b) => {
        const getTime = (createdAt: Timestamp | FieldValue): number => {
            if (createdAt instanceof Timestamp) {
                return createdAt.toDate().getTime();
            }
            return 0;
        };

        return getTime(b.createdAt) - getTime(a.createdAt);
    });

    const filteredUsers = sortedUsers.filter(user => {
        const hasAccessFilter = filters.hasAccess === 'all' ||
            (filters.hasAccess === 'granted' ? user.isActive : !user.isActive);
        const hasNameAndConfirmedFilter = filters.hasNameAndConfirmed === 'all' ||
            (filters.hasNameAndConfirmed === 'confirmed' ? user.isVerified && user.nameChosen : !user.isVerified || !user.nameChosen);

        return hasAccessFilter && hasNameAndConfirmedFilter;
    });

    if (usersLoading) return <PageLoader />;

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Käyttäjien hallinta</h1>

            <div className="flex flex-wrap gap-4">
                <div className="w-full md:w-auto">
                    <label htmlFor="access-filter" className="block text-sm">Käyttöoikeus</label>
                    <select
                        id="access-filter"
                        className="p-2 w-full md:w-auto rounded bg-slate-700 text-white"
                        value={filters.hasAccess}
                        onChange={(e) => setFilters(prev => ({ ...prev, hasAccess: e.target.value }))}
                    >
                        <option value="all">Kaikki</option>
                        <option value="granted">Käyttöoikeus annettu</option>
                        <option value="not_granted">Käyttöoikeutta ei ole annettu</option>
                    </select>
                </div>
                <div className="w-full md:w-auto">
                    <label htmlFor="name-email-filter" className="block text-sm">Sähköpostin vahvistus ja nimen asetus</label>
                    <select
                        id="name-email-filter"
                        className="p-2 w-full md:w-auto rounded bg-slate-700 text-white"
                        value={filters.hasNameAndConfirmed}
                        onChange={(e) => setFilters(prev => ({ ...prev, hasNameAndConfirmed: e.target.value }))}
                    >
                        <option value="all">Kaikki</option>
                        <option value="confirmed">Vahvistettu ja nimi asetettu</option>
                        <option value="not_confirmed">Vahvistamaton tai nimeä ei asetettu</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="bg-slate-800">
                        <tr>
                            <th className="px-4 py-2">Nimi</th>
                            <th className="px-4 py-2">Sähköposti</th>
                            <th className="px-4 py-2">Liittynyt</th>
                            <th className="px-4 py-2">Käyttöoikeus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b border-gray-700">
                                <td className="px-4 py-2">{user.nameChosen ? user.displayName : <span className='text-red-500'>(Ei vielä)</span>}</td>
                                <td className="px-4 py-2">
                                    {user.email} {!user.isVerified && <span className="text-red-500">(Ei vahvistettu)</span>}
                                </td>
                                <td className="px-4 py-2">{formatDate(user.createdAt)}</td>
                                <td className="px-4 py-2">
                                    <button
                                        className={`p-2 rounded ${user.isActive ? 'bg-red-700' : 'bg-green-700'}`}
                                        onClick={() => openConfirmModal(user.isActive ? 'unactivate' : 'activate', user.id)}
                                    >
                                        {user.isActive ? 'Poista käyttöoikeus' : 'Anna käyttöoikeus'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Link to="/admin/dashboard" className="px-4 pb-4 text-blue-600 hover:underline">Takaisin</Link>

            <ConfirmModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirm}
                title={confirmAction === 'activate' ? 'Vahvista oikeus' : 'Vahvista peruutus'}
                message={confirmAction === 'activate'
                    ? `Haluatko varmasti antaa käyttäjälle käyttöoikeuden?`
                    : 'Haluatko varmasti poistaa käyttöoikeuden tältä käyttäjältä?'
                }
            />
        </div>
    );
};

export default AdminUsersList;
