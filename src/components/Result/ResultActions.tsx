import React from 'react';
import Result from '@shared/types/Result';
import User from '@shared/types/User';

interface ResultActionsProps {
    result: Result;
    allowRemove?: boolean;
    allowReport?: boolean;
    currentUser: User;
    isTimestampRecent: boolean;
    handleConfirmAction: (result: Result, action: 'remove' | 'report') => void;
}

const ResultActions: React.FC<ResultActionsProps> = ({
    result,
    allowRemove,
    allowReport,
    currentUser,
    isTimestampRecent,
    handleConfirmAction
}) => (
    <div className="flex justify-between items-center flex-wrap flex-row-reverse w-min">
        {((allowRemove && isTimestampRecent) || currentUser.isSuperUser) && (
            <button
                onClick={() => handleConfirmAction(result, 'remove')}
                className="text-red-500 hover:text-red-600"
            >
                Poista
            </button>
        )}
        {!result.reportId && allowReport && currentUser.id !== result.userId && !currentUser.isSuperUser && (
            <button
                onClick={() => handleConfirmAction(result, 'report')}
                className="text-yellow-500 hover:text-yellow-700"
            >
                Ilmianna
            </button>
        )}
        {result.reportId && (
            <p className="text-red-500">Ilmiannettu</p>
        )}
    </div>
);

export default ResultActions;
