import { doc, getDoc, onSnapshot, addDoc, collection, updateDoc, query, orderBy, FirestoreError } from "firebase/firestore";
import { db } from '@/firebase';
import Season from '@shared/types/Season';
import { withTimeout } from "@/shared/utils/general.utils";
import { handleFirestoreError } from '@/shared/utils/error.utils';

export const getSeasonById = async (id: string): Promise<Season | null> => {
    try {
        const seasonSnapshot = await withTimeout(getDoc(doc(db, 'seasons', id)));
        if (!seasonSnapshot.exists()) return null;
        return { id: seasonSnapshot.id, ...seasonSnapshot.data() } as Season;
    } catch (error: any) {
        handleFirestoreError(error, 'get season');
        return null;
    }
}

export const subscribeToSeasons = (callback: (seasons: Season[]) => void) => {
    const seasonsRef = collection(db, 'seasons');
    const allSeasonsQuery = query(seasonsRef, orderBy('startDate', 'desc'));

    return onSnapshot(
        allSeasonsQuery,
        (snapshot) => {
            const seasons = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Season[];
            callback(seasons);
        },
        (error: FirestoreError) => {
            console.error('Error subscribing to seasons:', error);
            callback([]);
        }
    );
};

export const createSeason = async (season: Omit<Season, 'id' | 'isActive'>) => {
    try {
        const seasonDocRef = await withTimeout(
            addDoc(collection(db, 'seasons'), season)
        );
        return seasonDocRef.id;
    } catch (error: any) {
        handleFirestoreError(error, 'create season');
        return null;
    }
}

export const updateSeason = async (
    id: string,
    season: Omit<Season, 'id' | 'isActive'>
): Promise<boolean> => {
    try {
        await withTimeout(updateDoc(doc(db, 'seasons', id), season));
        return true;
    } catch (error: any) {
        handleFirestoreError(error, 'update season');
        return false;
    }
};