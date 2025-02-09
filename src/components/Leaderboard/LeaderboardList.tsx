import React from 'react';
import User from '@shared/types/User';
import Season from '@shared/types/Season';
import LeaderboardCard from '@components/Leaderboard/LeaderboardCard';

interface LeaderboardListProps {
    users: User[];
    selectedSeason: Season;
    getRowClassName: (index: number, user: User) => string;
}

const LeaderboardList: React.FC<LeaderboardListProps> = ({ users, selectedSeason, getRowClassName }) => {
    if (users.length < 1) return <p>Ei pelaajia vielä</p>;

    return (
        <div className="flex flex-col gap-3">
            {users.map((user, index) => (
                <div key={user.id} className="flex flex-col gap-3">
                    <LeaderboardCard
                        key={`${user.id}`}
                        user={user}
                        index={index}
                        selectedSeason={selectedSeason}
                        getRowClassName={getRowClassName}
                    />
                </div>
            ))}
        </div>
    );
};

export default LeaderboardList;