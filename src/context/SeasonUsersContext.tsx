import { createContext } from 'react';
import { useSeasonContext } from '@hooks/context.hooks';
import User from '@shared/types/User';
import { useAllSeasonUsers } from '@hooks/user.hooks';

export interface SeasonUsersContextType {
    users: User[];
    usersLoading: boolean;
}

export const SeasonUsersContext = createContext<SeasonUsersContextType | undefined>(undefined);

export const SeasonUsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { selectedSeason } = useSeasonContext();

    const { users, usersLoading } = useAllSeasonUsers(selectedSeason?.id || '');

    const value: SeasonUsersContextType = {
        users,
        usersLoading,
    };

    return <SeasonUsersContext.Provider value={value}>{children}</SeasonUsersContext.Provider>;
};
