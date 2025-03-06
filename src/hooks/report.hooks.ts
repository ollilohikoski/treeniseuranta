import { useEffect, useState } from 'react';
import { subscribeToReports } from '@services/report.service';
import Report from '@shared/types/Report';
import { useAuthContext } from '@hooks/context.hooks';

export const useUserSeasonReports = (seasonId: string, userId: string, includeContested = false) => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuthContext();

    useEffect(() => {
        if (!currentUser || !seasonId || !userId) return;

        const unsubscribe = subscribeToReports(seasonId, (reports) => {
            setReports(reports);
            setLoading(false);
        }, userId, includeContested);

        return () => unsubscribe();
    }, [seasonId, userId, includeContested, currentUser]);

    return { reports, reportsLoading: loading };
};

export const useAllSeasonReports = (seasonId: string, includeContested = false) => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuthContext();

    useEffect(() => {
        if (!currentUser || !seasonId) return;

        const unsubscribe = subscribeToReports(seasonId, (reports) => {
            setReports(reports);
            setLoading(false);
        }, undefined, includeContested);

        return () => unsubscribe();
    }, [seasonId, includeContested, currentUser]);

    return { reports, reportsLoading: loading };
};