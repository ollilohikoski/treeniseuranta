import React from 'react';
import Result from '@shared/types/Result';
import User from '@shared/types/User';
import ResultActions from '@components/Result/ResultActions';
import { isTimestampRecent, formatDate, formatTime } from '@/shared/utils/date.utils';

interface ResultCardProps {
    result: Result;
    onlyWins?: boolean
    multiUser?: boolean;
    allowRemove?: boolean;
    allowReport?: boolean;
    currentUser: User;
    handleConfirmAction: (result: Result, action: 'remove' | 'report') => void;
}

const ResultCard: React.FC<ResultCardProps> = ({
    result,
    onlyWins = false,
    multiUser,
    allowRemove,
    allowReport,
    currentUser,
    handleConfirmAction
}) => (
    <div className="bg-slate-700 px-4 py-3 rounded-md flex justify-between">
        <div className='flex flex-col gap-1'>
            {multiUser && (
                <p className="font-bold text-white">
                    {result.userName}
                </p>
            )}
            <p className="text-gray-400">Peli: <span className="text-white">{result.format}</span></p>
            {!onlyWins && (
                <p className="text-gray-400">Tulos: <span className="text-white">
                    {result.won ? 'Voitto' : 'Tappio'}
                </span></p>
            )}
            <p className='text-xs text-gray-400 text-nowrap'>Luotu: {formatDate(result.createdAt)} {formatTime(result.createdAt)}</p>
        </div>
        <ResultActions
            result={result}
            allowRemove={allowRemove}
            allowReport={allowReport}
            currentUser={currentUser}
            isTimestampRecent={isTimestampRecent(result.createdAt)}
            handleConfirmAction={handleConfirmAction}
        />
    </div>
);

export default ResultCard;
