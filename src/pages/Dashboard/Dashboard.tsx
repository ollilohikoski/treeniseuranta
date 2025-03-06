import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useAuthContext, useSeasonContext, usePersonalResultsContext, useSeasonUsersContext } from '@hooks/context.hooks';
import ResultFormModal from '@components/Dashboard/ResultFormModal';
import PersonalResults from '@components/Dashboard/PersonalResults';
import ReportList from '@components/Report/ReportList';
import PersonalStats from '@components/Dashboard/PersonalStats';
import { addResult } from '@services/result.service';
import { isSeasonActive } from '@/shared/utils/season.utils';
import Result from '@shared/types/Result';
import PageLoader from '@components/Shared/Loader';
import { useUserSeasonReports } from '@/hooks/report.hooks';

const Dashboard: React.FC = () => {
    const { currentUser } = useAuthContext();
    const { selectedSeason } = useSeasonContext();
    const { results, resultsLoading } = usePersonalResultsContext();
    const { users, usersLoading } = useSeasonUsersContext();
    const { reports } = useUserSeasonReports(selectedSeason!.id, currentUser!.id);

    const [loading, setLoading] = useState(false);
    const [resultModalOpen, setResultModalOpen] = useState(false);

    const handleAddResult = async (formData: { date: Timestamp; timeName: string; format: string; won: boolean }) => {
        setLoading(true);
        setResultModalOpen(false);
        if (currentUser && selectedSeason) {
            try {
                const newResult: Omit<Result, 'id'> = {
                    userId: currentUser.id,
                    userName: currentUser.displayName || '',
                    date: formData.date,
                    timeName: formData.timeName,
                    format: formData.format,
                    won: selectedSeason.onlyWins ? true : formData.won,
                    seasonId: selectedSeason.id,
                    reportId: null,
                    createdAt: Timestamp.now(),
                };
                await addResult(newResult);
                toast.success('Tulos lisätty!');
            } catch (error) {
                toast.error('Tuloksen lisääminen epäonnistui');
            }
        }
        setLoading(false);
    };

    if (resultsLoading || usersLoading) return <PageLoader />;
    if (!currentUser?.id) return <p>Kirjaudu sisään nähdäksesi tulokset</p>;
    if (!selectedSeason) return <p>Ei valittua kautta</p>;

    return (
        <>
            {loading && <PageLoader />}
            <div className="bg-slate-900 rounded-lg flex flex-col gap-6">
                {!isSeasonActive(selectedSeason) && (
                    <div className='flex flex-col gap-4 bg-slate-800 py-8 px-16 rounded-md text-center max-w-fit'>
                        <h2 className="text-xl font-semibold">Tämä kausi on päättynyt!</h2>
                        <Link to="/seasons" className="text-blue-600 hover:underline">Vaihda kautta</Link>
                    </div>
                )}
                <ReportList reports={reports} />
                <div className='flex flex-col gap-4'>
                    <PersonalStats
                        user={users.find(user => user.id === currentUser.id)!}
                        userPosition={users.findIndex(user => user.id === currentUser.id) + 1}
                        season={selectedSeason}
                    />
                    <div className='flex gap-4 justify-between'>
                        <Link to="/chart" className="text-blue-600 hover:underline">Avaa kaaviosi</Link>
                        <Link to="/leaderboard" className="text-blue-600 hover:underline">Avaa tulokset</Link>
                    </div>
                </div>
                <div>
                    {selectedSeason.allowResults && isSeasonActive(selectedSeason) ? (
                        <button
                            className="w-full text-xl p-3 rounded bg-blue-800 hover:bg-blue-700 text-white"
                            onClick={() => setResultModalOpen(true)}
                        >
                            Lisää {selectedSeason?.onlyWins ? 'voitto' : 'tulos'}
                        </button>
                    ) : (
                        <p className="text-gray-500">
                            Tulosten lisääminen ei ole sallittua tälle kaudelle.
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold">Viimeisimmät {selectedSeason.onlyWins ? 'voittosi' : 'tuloksesi'}:</h2>
                    <PersonalResults
                        results={results}
                        selectedSeason={selectedSeason}
                    />
                </div>
                <ResultFormModal
                    isOpen={resultModalOpen}
                    onClose={() => setResultModalOpen(false)}
                    onConfirm={handleAddResult}
                />
            </div>
        </>
    );
};

export default Dashboard;