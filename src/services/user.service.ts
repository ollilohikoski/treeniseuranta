import { collection, doc, getDoc, onSnapshot, query, QuerySnapshot, setDoc, updateDoc, DocumentData, Unsubscribe, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { db } from '@/firebase';
import User from '@shared/types/User';
import { withTimeout } from "@/shared/utils/general.utils";
import { handleFirestoreError } from '@/shared/utils/error.utils';

export const createUserDocument = async (user: FirebaseUser): Promise<void> => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const snapshot = await withTimeout(getDoc(userRef));

    if (!snapshot.exists()) {
        const userData: User = {
            id: user.uid,
            displayName: user.displayName || '',
            email: user.email || '',
            createdAt: serverTimestamp(),
            nameChosen: false,
            isSuperUser: false,
            isActive: false,
            isVerified: user.emailVerified,
            selectedSeasonId: null,
            seasons: []
        };

        try {
            await withTimeout(setDoc(userRef, userData));
        } catch (error) {
            handleFirestoreError(error, 'create user document');
        }
    }
};

export const updateUser = async (user: User): Promise<void> => {
    const userRef = doc(db, 'users', user.id);

    try {
        await withTimeout(updateDoc(userRef, { ...user }));
    } catch (error) {
        handleFirestoreError(error, 'update user');
    }
}

export const updateUserSeason = async (userId: string, seasonId: string): Promise<void> => {
    const userRef = doc(db, 'users', userId);

    try {
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            throw new Error('User document not found');
        }

        const userData = userDoc.data();
        const seasons = userData.seasons || [];
        const seasonExists = seasons.some((season: any) => season.id === seasonId);

        if (!seasonExists) {
            await withTimeout(updateDoc(userRef, {
                seasons: arrayUnion({
                    id: seasonId,
                    stats: {
                        winningResults: 0,
                        lastResultDate: null,
                        totalResults: 0,
                    }
                }),
                selectedSeasonId: seasonId
            }));
        } else {
            await withTimeout(updateDoc(userRef, {
                selectedSeasonId: seasonId
            }));
        }
    } catch (error) {
        handleFirestoreError(error, 'update user season');
    }
};

export const updateUserSelectedSeason = async (userId: string, seasonId: string): Promise<void> => {
    const userRef = doc(db, 'users', userId);

    try {
        await withTimeout(updateDoc(userRef, { selectedSeasonId: seasonId }));
    } catch (error) {
        handleFirestoreError(error, 'update selected season');
    }
};

export const subscribeToAllUsers = (
    callback: (users: User[]) => void,
    filterBySeasonId?: string
): Unsubscribe => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef);

    return onSnapshot(q, (snapshot) => {
        const users = processUsers(snapshot, filterBySeasonId);
        callback(users);
    }, (error) => console.error('Error subscribing to users:', error));
};

export const subscribeToUserById = (
    userId: string,
    callback: (user: User | null) => void
): Unsubscribe => {
    const userRef = doc(db, 'users', userId);
    return onSnapshot(userRef,
        (docSnapshot) => callback(docSnapshot.exists() ? (docSnapshot.data() as User) : null),
        (error) => {
            console.error('Error getting user by id:', error);
            callback(null);
        }
    );
};

export const getUserById = async (userId: string): Promise<User | null> => {
    const userRef = doc(db, 'users', userId);

    try {
        const userDoc = await withTimeout(getDoc(userRef));
        return userDoc.exists() ? (userDoc.data() as User) : null;
    } catch (error) {
        handleFirestoreError(error, 'fetch user by ID');
    }

    return null;
};

export const updateUserActiveStatus = async (userId: string, isActive: boolean): Promise<void> => {
    const userRef = doc(db, 'users', userId);

    try {
        await withTimeout(updateDoc(userRef, { isActive }));
    } catch (error) {
        handleFirestoreError(error, 'update user active status');
    }
};

const processUsers = (snapshot: QuerySnapshot<DocumentData>, seasonId?: string): User[] => {
    const users = snapshot.docs
        .map(doc => doc.data() as User)
        .filter(user => !seasonId || user.seasons.some(season => season.id === seasonId));

    return users.sort((a, b) => {
        const aStats = a.seasons.find(s => s.id === seasonId)?.stats.winningResults || 0;
        const bStats = b.seasons.find(s => s.id === seasonId)?.stats.winningResults || 0;
        return bStats - aStats;
    });
};