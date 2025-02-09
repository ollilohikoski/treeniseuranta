import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@context/AuthContext';
import { subscribeToResults } from '@services/result.service';
import Result from '@shared/types/Result';

export const useAllSeasonResults = (seasonId: string, limitResults?: number) => {
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (!seasonId || !currentUser) return;

        const unsubscribe = subscribeToResults(
            seasonId,
            (results) => {
                setResults(results);
                setLoading(false);
            },
            undefined,
            limitResults
        );

        return unsubscribe;
    }, [seasonId, limitResults, currentUser]);

    return { results, resultsLoading: loading };
};

export const useUserSeasonResults = (seasonId: string, userId: string, limitResults?: number) => {
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useContext(AuthContext); // Access authentication context

    useEffect(() => {
        if (!seasonId || !userId || !currentUser) return;

        const unsubscribe = subscribeToResults(
            seasonId,
            (results) => {
                setResults(results);
                setLoading(false);
            },
            userId,
            limitResults
        );

        return unsubscribe;
    }, [seasonId, userId, limitResults, currentUser]);

    return { results, resultsLoading: loading };
};
