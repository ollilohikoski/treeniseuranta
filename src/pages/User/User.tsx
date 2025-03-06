import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSeasonContext, useSeasonUsersContext } from '@hooks/context.hooks';
import ResultList from '@components/Result/ResultList';
import ResultSorter from '@components/Result/ResultSorter';
import UserStats from '@components/User/UserStats';
import CumulativeResults from '@components/Chart/CumulativeResults';
import { useUserSeasonResults } from '@hooks/result.hooks';
import ResultSortOption from '@shared/types/ResultSortOptions';
import PageLoader from '@components/Shared/Loader';
import { isSeasonActive } from '@/shared/utils/season.utils';
import { formatDate, formatTime } from '@/shared/utils/date.utils';
import { handleAuthError } from '@/shared/utils/error.utils';
import { hasResultForDateAndTime } from '@/shared/utils/result.utils';

const User: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { selectedSeason, selectedSeasonLoading } = useSeasonContext();
    const { users, usersLoading } = useSeasonUsersContext();
    const { results, resultsLoading } = useUserSeasonResults(selectedSeason!.id, userId!);
    const [sortOption, setSortOption] = React.useState<ResultSortOption>('dateDesc');

    const user = useMemo(() => users.find(user => user.id === userId), [users, userId]);

    if (selectedSeasonLoading || usersLoading || resultsLoading) {
        return <PageLoader />;
    }

    if (!user) {
        return <p>Käyttäjää ei löytynyt</p>;
    }

    return (
        <div className="bg-slate-900 rounded-lg flex flex-col gap-6">
            {user && selectedSeason ?
                <>
                    <h1 className="text-2xl font-bold">{user.displayName || 'Pelaaja'}</h1>
                    <>
                        <div className='flex flex-col gap-4'>
                            <UserStats
                                user={user}
                                userPosition={users.findIndex(u => u.id === user.id) + 1}
                                season={selectedSeason}
                            />
                        </div>
                        <CumulativeResults results={results} users={[user]} />
                        <div className='flex flex-col gap-4'>
                            <h2 className="text-xl font-semibold">Pelaajan {user.displayName} viimeisimmät {selectedSeason.onlyWins ? "voitot" : "tulokset"}:</h2>
                            <ResultSorter
                                sortOption={sortOption}
                                setSortOption={setSortOption}
                            />
                            <ResultList
                                season={selectedSeason}
                                results={results}
                                sortOption={sortOption}
                                multiUser={false}
                                allowReport
                            />
                        </div>
                    </>
                </> : <p>Tietoja ei löytynyt</p>
            }
        </div >
    );
}

export default User;