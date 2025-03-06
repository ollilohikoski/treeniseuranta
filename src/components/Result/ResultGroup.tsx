import React from 'react';
import Result from '@shared/types/Result';
import ResultCard from '@components/Result/ResultCard';
import User from '@shared/types/User';

interface ResultGroupProps {
    groupKey: string;
    results: Result[];
    season: { showPreciseTime?: boolean; onlyWins?: boolean };
    multiUser?: boolean;
    allowRemove?: boolean;
    allowReport?: boolean;
    currentUser: User;
    handleConfirmAction: (result: Result, action: 'remove' | 'report') => void;
}

const ResultGroup: React.FC<ResultGroupProps> = ({
    groupKey,
    results,
    season,
    multiUser,
    allowRemove,
    allowReport,
    currentUser,
    handleConfirmAction
}) => {
    const [date, time] = groupKey.split('_');
    return (
        <div className="bg-slate-800 shadow-lg rounded-lg p-3">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h3 className="text-lg font-semibold text-white">
                        {results[0].timeName} {season.showPreciseTime && `(${time})`} - {date}
                    </h3>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {results.map(result => (
                    <ResultCard
                        key={`${result.id}-${result.createdAt?.toMillis()}`}
                        result={result}
                        onlyWins={season.onlyWins}
                        multiUser={multiUser}
                        allowRemove={allowRemove}
                        allowReport={allowReport}
                        currentUser={currentUser}
                        handleConfirmAction={handleConfirmAction}
                    />
                ))}
            </div>
        </div>
    );
};

export default ResultGroup;
