import React from 'react';
import { useRecentResultsContext, useSeasonContext } from '@hooks/context.hooks';
import SeasonResults from '@components/Leaderboard/SeasonResults';
import LeaderboardList from '@components/Leaderboard/LeaderboardList';
import { useSeasonUsersContext } from '@hooks/context.hooks';
import PageLoader from '@components/Shared/Loader';

const Leaderboard: React.FC = () => {
    const { selectedSeason, selectedSeasonLoading } = useSeasonContext();
    const { users, usersLoading } = useSeasonUsersContext();
    const { results, resultsLoading, limitResults } = useRecentResultsContext()
    const usersWithResults = users.filter(user => user.seasons.find(season => season.id === selectedSeason?.id && (selectedSeason.onlyWins ? season.stats.winningResults : season.stats.totalResults) > 0));

    const getRowClassName = (index: number) => {
        if (index === 0) return 'gold-gradient';
        else if (index === 1) return 'silver-gradient';
        else if (index === 2) return 'bronze-gradient';
        else return 'text-white'
    };

    if (selectedSeasonLoading || usersLoading || resultsLoading) return <PageLoader />;
    if (!selectedSeason) return <p>Ei valittua kautta</p>;

    return (
        <div className="bg-slate-900 rounded-lg">
            <div className="flex flex-col gap-6">
                <h1 className="text-2xl font-bold">Tulokset</h1>
                <div className='flex flex-col gap-3'>
                    <h2 className="text-xl font-semibold">Kauden parhaat pelaajat:</h2>
                    <LeaderboardList
                        users={usersWithResults}
                        selectedSeason={selectedSeason}
                        getRowClassName={getRowClassName}
                    />
                </div>
                <div className='flex flex-col gap-3'>
                    <h2 className="text-xl font-semibold">Viimeisimmät {selectedSeason.onlyWins ? 'voitot' : 'tulokset'}:</h2>
                    <SeasonResults results={results} selectedSeason={selectedSeason} limitResults={limitResults} allowReport />
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
