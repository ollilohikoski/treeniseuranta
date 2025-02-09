import React from 'react';
import { Link } from 'react-router-dom';
import User from '@shared/types/User';
import Season from '@shared/types/Season';

interface LeaderboardCardProps {
    user: User;
    index: number;
    selectedSeason: Season;
    getRowClassName: (index: number, user: User) => string;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ user, index, selectedSeason, getRowClassName }) => {
    const seasonStats = user.seasons.find(season => season.id === selectedSeason.id)?.stats;

    return (
        <div className={`bg-gray-800 text-white rounded-lg shadow-md transition-shadow duration-300 ${getRowClassName(index, user)}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 p-4">
                <div className="flex items-center gap-3">
                    <p className="text-lg font-semibold">{index + 1}.</p>
                    <p className="text-lg font-semibold">{user.displayName}</p>
                </div>
                <div className="flex flex-col md:flex-row justify-between gap-x-2">
                    <div className='flex gap-1'>
                        <span>Voitot:</span>
                        <span className="font-semibold">
                            {seasonStats?.winningResults || 0}
                        </span>
                    </div>
                    {!selectedSeason.onlyWins &&
                        <div className='flex gap-1'>
                            <span>Pelattu:</span>
                            <span className="font-semibold">
                                {seasonStats?.totalResults || 0}
                            </span>
                        </div>
                    }
                </div>
                <div className="flex md:justify-end">
                    <Link to={`/players/${user.id}`} className="text-blue-500 hover:underline md:text-base">
                        Avaa tulokset
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardCard;