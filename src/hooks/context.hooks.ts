import { useContext } from 'react';
import { AuthContext } from '@context/AuthContext';
import { SeasonContext } from '@context/SeasonContext';
import { SeasonUsersContext } from '@context/SeasonUsersContext';
import { PersonalResultsContext } from '@context/PersonalResultsContext';
import { RecentResultsContext } from '@context/RecentResultsContext';

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within a AuthProvider');
    }
    return context;
};

export const useSeasonContext = () => {
    const context = useContext(SeasonContext);
    if (context === undefined) {
        throw new Error('useSeason must be used within a SeasonProvider');
    }
    return context;
};

export const useSeasonUsersContext = () => {
    const context = useContext(SeasonUsersContext);
    if (context === undefined) {
        throw new Error('useSeasonUsersContext must be used within a SeasonUsersProvider');
    }
    return context;
}

export const usePersonalResultsContext = () => {
    const context = useContext(PersonalResultsContext);
    if (context === undefined) {
        throw new Error('usePersonalResultsContext must be used within a PersonalResultsProvider');
    }
    return context;
}

export const useRecentResultsContext = () => {
    const context = useContext(RecentResultsContext);
    if (context === undefined) {
        throw new Error('useRecentResultsContext must be used within a RecentResultsProvider');
    }
    return context;
}

