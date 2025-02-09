import { createContext } from 'react';
import { useAuthContext, useSeasonContext } from '@hooks/context.hooks';
import { useUserSeasonResults } from '@hooks/result.hooks';
import Result from '@shared/types/Result';
import { isTimestampRecent } from '@/shared/utils/date.utils';

export interface PersonalResultsContextType {
    results: Result[];
    resultsLoading: boolean;
}

export const PersonalResultsContext = createContext<PersonalResultsContextType | undefined>(undefined);

export const PersonalResultsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuthContext();
    const { selectedSeason } = useSeasonContext();
    const { results, resultsLoading } = useUserSeasonResults(selectedSeason?.id || '', currentUser?.id || '');

    const value: PersonalResultsContextType = {
        results: results,
        resultsLoading: resultsLoading,
    };

    return <PersonalResultsContext.Provider value={value}>{children}</PersonalResultsContext.Provider>;
};