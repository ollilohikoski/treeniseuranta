import { Timestamp } from 'firebase/firestore';
import Result from '@shared/types/Result';
import SeasonStats from '@shared/types/SeasonStats';

export const calculateUpdatedSeasonStats = async (
    currentStats: SeasonStats,
    result: Omit<Result, 'id'>,
    removingResult: boolean,
    results: Result[]
): Promise<SeasonStats> => {
    const lastResultDate = removingResult
        ? getSecondLastResultTimestamp(results)
        : Timestamp.now();

    return {
        winningResults: result.won
            ? currentStats.winningResults + (removingResult ? -1 : 1)
            : currentStats.winningResults,
        lastResultDate,
        totalResults: currentStats.totalResults + (removingResult ? -1 : 1),
    };
}


const getSecondLastResultTimestamp = (results: Result[]): Timestamp | null => {
    return results.length < 2 ? null : results[1].createdAt;
};