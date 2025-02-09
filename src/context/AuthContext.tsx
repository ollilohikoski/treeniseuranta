import React, { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import { subscribeToUserById } from '@services/user.service';
import AuthContextType from '@shared/types/AuthContextType';
import User from '@shared/types/User';

export const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    authLoading: true,
    emailVerified: false,
    setCurrentUser: () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [emailVerified, setEmailVerified] = useState(false);

    useEffect(() => {
        let unsubscribeFromUser: (() => void) | undefined;

        const unsubscribeFromAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                if (unsubscribeFromUser) {
                    unsubscribeFromUser();
                }
                setCurrentUser(null);
                setEmailVerified(false);
                setAuthLoading(false);
                return;
            }

            setEmailVerified(firebaseUser.emailVerified);

            unsubscribeFromUser = subscribeToUserById(firebaseUser.uid, (user) => {
                setCurrentUser(user);
                setAuthLoading(false);
            });
        });

        return () => {
            if (unsubscribeFromUser) {
                unsubscribeFromUser();
            }
            unsubscribeFromAuth();
        };
    }, []);

    return (
        <AuthContext.Provider value={{
            currentUser,
            setCurrentUser,
            authLoading,
            emailVerified
        }}>
            {children}
        </AuthContext.Provider>
    );
};