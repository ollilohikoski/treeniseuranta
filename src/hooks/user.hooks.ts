import { useState, useEffect, } from 'react';
import { subscribeToAllUsers, subscribeToUserById } from '@services/user.service';
import User from '@shared/types/User';
import { useAuthContext } from '@hooks/context.hooks';

export const useUserById = (userId: string) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuthContext();

    useEffect(() => {
        const unsubscribe = subscribeToUserById(
            userId,
            (fetchedUser) => {
                setUser(fetchedUser);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId, currentUser]);

    return { user, userLoading: loading };
};

export const useAllUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuthContext();

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = subscribeToAllUsers(
            (fetchedUsers) => {
                setUsers(fetchedUsers);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [currentUser]);

    return { users, usersLoading: loading };
};

export const useAllSeasonUsers = (seasonId: string) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuthContext();

    useEffect(() => {
        if (!currentUser || !seasonId) return;

        const unsubscribe = subscribeToAllUsers(
            (fetchedUsers) => {
                setUsers(fetchedUsers);
                setLoading(false);
            },
            seasonId
        );

        return () => unsubscribe();
    }, [currentUser, seasonId]);

    return { users, usersLoading: loading };
};
