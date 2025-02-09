import StatsCard from '@components/Shared/StatsCard';
import User from '@shared/types/User';
import Season from '@shared/types/Season';

const UserStats: React.FC<{ user: User, userPosition: number, season: Season }> = ({ user, userPosition, season }) => {
    const seasonStats = user.seasons.find(s => s.id === season.id)?.stats;

    return (
        <>
            <h1 className='text-xl font-semibold'>Pelaajan {user.displayName} tilastot:</h1>
            <StatsCard
                seasonStats={seasonStats!}
                userPosition={userPosition}
                season={season!}
            />
        </>
    );
};

export default UserStats;