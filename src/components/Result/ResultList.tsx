import React, { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { addReport } from '@services/report.service';
import { removeResult } from '@services/result.service';
import { useAuthContext } from '@hooks/context.hooks';
import ConfirmModal from '@components/Shared/ConfirmModal';
import PageLoader from '@components/Shared/Loader';
import ResultGroup from '@components/Result/ResultGroup';
import Result from '@shared/types/Result';
import ResultSortOption from '@shared/types/ResultSortOptions';
import { formatDate, formatTime } from '@/shared/utils/date.utils';

interface ResultListProps {
    results: Result[];
    season: { id: string; showPreciseTime?: boolean; onlyWins?: boolean };
    limitResults?: number;
    sortOption?: ResultSortOption;
    multiUser?: boolean;
    allowRemove?: boolean;
    allowReport?: boolean;
}

const ResultList: React.FC<ResultListProps> = ({
    results,
    season,
    limitResults,
    sortOption = 'dateDesc',
    multiUser = true,
    allowRemove = false,
    allowReport = false,
}) => {
    const { currentUser } = useAuthContext();
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [resultToConfirm, setResultToConfirm] = useState<Result | null>(null);
    const [confirmAction, setConfirmAction] = useState<'remove' | 'report' | null>(null);
    const [loader, setLoader] = useState(false);

    const timeGroupedResults = useMemo(() => {
        // Group results by date and time.
        const groupedResults: { [key: string]: Result[] } = results.reduce((acc, result) => {
            const groupKey = `${formatDate(result.date)}_${formatTime(result.date)}`;
            if (!acc[groupKey]) {
                acc[groupKey] = [];
            }
            acc[groupKey].push(result);
            return acc;
        }, {} as { [key: string]: Result[] });

        // Sort groups by date and time, with the option for ascending or descending order.
        const sortedGroups = Object.entries(groupedResults).sort(([keyA], [keyB]) => {
            const [dateA, timeA] = keyA.split('_');
            const [dateB, timeB] = keyB.split('_');
            const dateComparison = new Date(dateB).getTime() - new Date(dateA).getTime();

            if (dateComparison !== 0) return dateComparison;

            return new Date(`1970-01-01T${timeB}:00`).getTime() - new Date(`1970-01-01T${timeA}:00`).getTime();
        });

        // Sort grouped results by creation time ascending.
        const finalGroupedResults = sortedGroups.map(([key, group]) => {
            const sortedGroup = group.sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime());
            return [key, sortedGroup] as [string, Result[]];
        });

        // Apply the sort option.
        if (sortOption === 'dateAsc') {
            finalGroupedResults.reverse();
        }

        // Remove the last group if there’s a chance it will get cut off by query limit.
        if (limitResults && results.length >= limitResults) {
            finalGroupedResults.pop();
        }

        return finalGroupedResults;
    }, [results, sortOption, limitResults]);

    const handleConfirmAction = (result: Result, action: 'remove' | 'report') => {
        if (action === 'remove' && (!currentUser || result.userId !== currentUser.id) && !currentUser?.isSuperUser) {
            toast.error('Voit poistaa vain omia tuloksiasi!');
            return;
        }

        if (action === 'report') {
            if (!currentUser || currentUser.id === result.userId) {
                toast.error('Et voi ilmiantaa omaa tulostasi.');
                return;
            }

            if (result.reportId) {
                toast.success('Toinen pelaaja on jo ilmiantanut tämän tuloksen.');
                return;
            }
        }

        setResultToConfirm(result);
        setConfirmAction(action);
        setConfirmModalOpen(true);
    };

    const handleConfirm = async () => {
        setLoader(true);
        setConfirmModalOpen(false);
        if (!resultToConfirm || !confirmAction || !currentUser) return;

        try {
            if (confirmAction === 'remove') {
                await removeResult(resultToConfirm);
                toast.success('Tulos poistettu!');
            } else if (confirmAction === 'report') {
                await addReport(resultToConfirm, currentUser);
                toast.success('Tulos ilmiannettu!');
            }
        } catch (error) {
            toast.error(confirmAction === 'remove'
                ? 'Tulosta ei voitu poistaa'
                : 'Tulosta ei voitu ilmiantaa');
            console.error(`Error ${confirmAction === 'remove' ? 'removing' : 'reporting'} report:`, error);
        }
        setLoader(false);
    };

    if (timeGroupedResults.length === 0) return <p>Ei tuloksia vielä</p>;

    return (
        <>
            {loader && <PageLoader />}
            <div className="flex flex-col gap-3">
                {timeGroupedResults.map(([key, groupResults]) => (
                    <ResultGroup
                        key={key}
                        groupKey={key}
                        results={groupResults}
                        season={season}
                        multiUser={multiUser}
                        allowRemove={allowRemove}
                        allowReport={allowReport}
                        currentUser={currentUser!}
                        handleConfirmAction={handleConfirmAction}
                    />
                ))}
                <ConfirmModal
                    isOpen={confirmModalOpen}
                    onClose={() => setConfirmModalOpen(false)}
                    onConfirm={handleConfirm}
                    title={confirmAction === 'remove' ? 'Vahvista poisto' : 'Vahvista ilmianto'}
                    message={confirmAction === 'remove'
                        ? 'Haluatko varmasti poistaa tämän tuloksen? Poistamista ei voi peruuttaa.'
                        : `Ilmiannosta ilmoitetaan tuloksen lisänneelle pelaajalle ja valmentajalle. 
                        Ilmianna tulos ainoastaan silloin kun olet varma, että se on virheellisesti ilmoitettu.
                        Ilmiantoa ei voi peruuttaa. Haluatko varmasti ilmiantaa tämän tuloksen? `}
                    content={resultToConfirm && (
                        <div className="flex flex-col gap-2">
                            <p>Pelaaja: {resultToConfirm.userName}</p>
                            <p>Päivämäärä: {formatDate(resultToConfirm.date)}</p>
                            <p>Aika: {resultToConfirm.timeName} {season.showPreciseTime && `(${formatTime(resultToConfirm.date)})`}</p>
                            <p>Peli: {resultToConfirm.format}</p>
                            <p>Luotu: {formatDate(resultToConfirm.createdAt)} {formatTime(resultToConfirm.createdAt)}</p>
                            {!season.onlyWins &&
                                <p>Tulos: {resultToConfirm.won ? 'Voitto' : 'Tappio'}</p>
                            }
                        </div>
                    )}
                />
            </div>
        </>
    );
};

export default ResultList;