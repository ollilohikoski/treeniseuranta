import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { subscribeToSeasons } from '@services/season.service';
import { updateUserSelectedSeason } from '@services/user.service';
import Season from '@shared/types/Season';
import { useAuthContext } from '@hooks/context.hooks';

export interface SeasonContextType {
    seasons: Season[];
    selectedSeason: Season | null;
    setSelectedSeason: (season: Season | null) => void;
    seasonsLoading: boolean;
    selectedSeasonLoading: boolean;
}

export const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

export const SeasonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser, authLoading } = useAuthContext();
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
    const [seasonsLoading, setSeasonsLoading] = useState(true);
    const [selectedSeasonLoading, setSelectedSeasonLoading] = useState(true);

    useEffect(() => {
        if (authLoading || !currentUser) return;

        const unsubscribe = subscribeToSeasons((fetchedSeasons) => {
            setSeasons(fetchedSeasons);
            setSeasonsLoading(false);
        });

        return unsubscribe;

    }, [authLoading, currentUser]);

    useEffect(() => {
        if (!seasonsLoading) {
            setSelectedSeasonLoading(false);
        }

        if (authLoading || !currentUser || seasons.length === 0) return;

        const season = seasons.find(s => s.id === currentUser.selectedSeasonId) || null;
        setSelectedSeason(season);
        setSelectedSeasonLoading(false);
    }, [authLoading, currentUser, seasons, seasonsLoading]);

    const handleSetSelectedSeason = useCallback((season: Season | null) => {
        setSelectedSeason(season);
        if (currentUser && season) {
            updateUserSelectedSeason(currentUser.id, season.id);
        }
    }, [currentUser]);

    const value = useMemo<SeasonContextType>(() => ({
        seasons,
        selectedSeason,
        setSelectedSeason: handleSetSelectedSeason,
        seasonsLoading,
        selectedSeasonLoading,
    }), [seasons, selectedSeason, handleSetSelectedSeason, seasonsLoading, selectedSeasonLoading]);

    return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>;
};