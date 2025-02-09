import { createContext } from 'react';
import { useSeasonContext } from '@hooks/context.hooks';
import { useAllSeasonResults } from '@hooks/result.hooks';
import Result from '@shared/types/Result';

export interface RecentResultsContextType {
    results: Result[];
    resultsLoading: boolean;
    limitResults: number;
}

export const RecentResultsContext = createContext<RecentResultsContextType | undefined>(undefined);

export const RecentResultsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const limitResults = 50;

    const { selectedSeason } = useSeasonContext();
    const { results, resultsLoading } = useAllSeasonResults(selectedSeason?.id || '', limitResults)

    const value: RecentResultsContextType = {
        results: results,
        resultsLoading: resultsLoading,
        limitResults: limitResults
    };

    return <RecentResultsContext.Provider value={value}>{children}</RecentResultsContext.Provider>;
};