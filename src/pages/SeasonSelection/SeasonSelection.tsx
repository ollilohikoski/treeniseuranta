import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSeasonContext, useAuthContext } from '@hooks/context.hooks';
import { isSeasonActive } from '@/shared/utils/season.utils';
import Season from '@shared/types/Season';
import { updateUserSeason } from '@services/user.service';
import SeasonCard from '@components/SeasonSelection/SeasonCard';
import PageLoader from '@components/Shared/Loader';

const SeasonSelection: React.FC = () => {
    const { seasons, selectedSeason, setSelectedSeason, seasonsLoading } = useSeasonContext();
    const { currentUser } = useAuthContext();
    const navigate = useNavigate();

    const [showInactive, setShowInactive] = useState(false);

    const { visibleSeasons, activeSeasons, inactiveSeasons } = useMemo(() => {
        const visible = seasons.filter((season) => season.visible);
        return {
            visibleSeasons: visible,
            activeSeasons: visible.filter((season) => isSeasonActive(season)),
            inactiveSeasons: visible.filter((season) => !isSeasonActive(season)),
        };
    }, [seasons]);

    const handleLinkClick = async (season: Season) => {
        if (!currentUser) return;
        await updateUserSeason(currentUser.id, season.id);
        setSelectedSeason(season);
        navigate('/dashboard');
    };

    if (seasonsLoading) {
        return <PageLoader />;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Valitse kausi</h2>
            <h5 className="text-xl font-semibold mb-4">Kaudet:</h5>
            <div className='flex flex-col gap-6'>
                {visibleSeasons.length > 0 ? (
                    <>
                        {activeSeasons.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {activeSeasons.map((season) => (
                                    <SeasonCard
                                        key={season.id}
                                        season={season}
                                        selectedSeason={selectedSeason!}
                                        onSelect={handleLinkClick}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p>Ei aktiivisia kausia</p>
                        )}

                        {inactiveSeasons.length > 0 && (
                            <button
                                className='text-left px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md'
                                onClick={() => setShowInactive(!showInactive)}
                            >
                                {showInactive ? "Piilota epäaktiiviset kaudet ▲" : "Näytä epäaktiiviset kaudet ▼"}
                            </button>
                        )}

                        {showInactive && inactiveSeasons.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {inactiveSeasons.map((season) => (
                                    <SeasonCard
                                        key={season.id}
                                        season={season}
                                        selectedSeason={selectedSeason!}
                                        onSelect={handleLinkClick}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <p>Ei kausia vielä</p>
                )}
            </div>
        </div>
    );
};

export default SeasonSelection;