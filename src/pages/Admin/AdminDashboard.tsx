import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext, useSeasonContext } from '@hooks/context.hooks';
import { updateUserSelectedSeason } from '@services/user.service';
import { createSeason, updateSeason } from '@services/season.service';
import Season from '@shared/types/Season';
import { isSeasonActive } from '@/shared/utils/season.utils';
import PageLoader from '@components/Shared/Loader';
import SeasonModal from '@components/Admin/SeasonModal';
import SeasonList from '@components/Admin/AdminSeasonList';

const AdminDashboard: React.FC = () => {
    const { currentUser } = useAuthContext();
    const { seasons, setSelectedSeason, seasonsLoading } = useSeasonContext();
    const [activeSeasons, setActiveSeasons] = useState<Season[]>([]);
    const [inactiveSeasons, setInactiveSeasons] = useState<Season[]>([]);
    const [seasonModalOpen, setSeasonModalOpen] = useState(false);
    const [editSeason, setEditSeason] = useState<Season | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setActiveSeasons(seasons.filter(isSeasonActive));
        setInactiveSeasons(seasons.filter((season) => !isSeasonActive(season)));
    }, [seasons]);

    const handleOpenModal = () => {
        setEditSeason(null);
        setSeasonModalOpen(true);
    };

    const handleSubmitSeason = async (formData: Omit<Season, 'id'>) => {
        setSeasonModalOpen(false);
        setLoading(true);
        try {
            if (editSeason) {
                await updateSeason(editSeason.id, formData);
                toast.success('Kautta muokattu!');
                setEditSeason(null);
            } else {
                await createSeason(formData);
                toast.success('Kausi luotu!');
            }
        } catch (error) {
            toast.error('Toiminto epäonnistui');
        }
        setLoading(false);
    };

    const handleShowSeason = async (season: Season) => {
        await updateUserSelectedSeason(currentUser!.id, season.id);
        setSelectedSeason(season);
        navigate('/leaderboard');
    };

    const handleShowReports = async (season: Season) => {
        await updateUserSelectedSeason(currentUser!.id, season.id);
        setSelectedSeason(season);
        navigate(`/admin/reports`);
    };

    const handleEditSeason = (season: Season) => {
        setEditSeason(season);
        setSeasonModalOpen(true);
    };

    if (seasonsLoading || loading) return <PageLoader />;

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Admin taulu</h2>
            <Link
                to="/admin/players"
                className="text-blue-600 hover:underline"
            >
                Avaa käyttäjien hallinta
            </Link>

            {seasons.length > 0 ?
                <>
                    <div className="flex flex-col gap-4">
                        <h5 className="text-xl font-semibold">Aktiiviset kaudet:</h5>
                        {activeSeasons.length === 0 ? (
                            <p>Ei aktiivisia kausia</p>
                        ) : (
                            <SeasonList
                                seasons={activeSeasons}
                                onEdit={handleEditSeason}
                                onShowResults={handleShowSeason}
                                onShowReports={handleShowReports}
                            />
                        )}
                    </div>

                    {inactiveSeasons.length > 0 && (
                        <div className='flex flex-col gap-4'>
                            <h5 className='text-xl font-semibold'>Epäaktiiviset kaudet: </h5>
                            <SeasonList
                                seasons={inactiveSeasons}
                                onEdit={handleEditSeason}
                                onShowResults={handleShowSeason}
                                onShowReports={handleShowReports}
                                showInactive
                            />
                        </div>
                    )}
                </> : <p>Ei kausia vielä</p>
            }

            <button
                onClick={handleOpenModal}
                className="px-6 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
            >
                Luo uusi kausi
            </button>

            <SeasonModal
                isOpen={seasonModalOpen}
                onClose={() => setSeasonModalOpen(false)}
                onConfirm={handleSubmitSeason}
                season={editSeason!}
            />
        </div>
    );
};

export default AdminDashboard;
