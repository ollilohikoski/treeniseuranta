import { collection, query, where, orderBy, onSnapshot, doc, getDocs, runTransaction, limit, QueryConstraint, Unsubscribe, FirestoreError, DocumentReference, DocumentData } from 'firebase/firestore';
import { db } from '@/firebase';
import Result from '@shared/types/Result';
import User from '@shared/types/User';
import { calculateUpdatedSeasonStats } from '@services/stats.service';
import { handleFirestoreError } from '@/shared/utils/error.utils';

type ResultWithoutId = Omit<Result, 'id'>;
type ResultCallback = (results: Result[]) => void;

const createResultQuery = (seasonId: string, userId?: string): QueryConstraint[] => {
    const constraints: QueryConstraint[] = [
        where('seasonId', '==', seasonId),
        orderBy('date', 'desc'),
        orderBy('createdAt', 'desc')
    ];
    if (userId) constraints.push(where('userId', '==', userId));
    return constraints;
};

const mapDocToResult = (doc: any): Result => ({
    id: doc.id,
    ...doc.data()
} as Result);

export const getSeasonResultsByUser = async (seasonId: string, userId: string): Promise<Result[]> => {
    const q = query(collection(db, 'results'), ...createResultQuery(seasonId, userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToResult);
};

export const subscribeToResults = (
    seasonId: string,
    callback: ResultCallback,
    userId?: string,
    limitResults?: number
): Unsubscribe => {
    const constraints = createResultQuery(seasonId, userId);
    if (limitResults) constraints.push(limit(limitResults));

    const q = query(collection(db, 'results'), ...constraints);

    return onSnapshot(q,
        (snapshot) => callback(snapshot.docs.map(mapDocToResult)),
        (error: FirestoreError) => console.error('Error subscribing to results:', error)
    );
};

export const removeResult = async (result: Result): Promise<void> => {
    try {
        await runTransaction(db, async (transaction) => {
            const { resultRef, reportRef, userRef, userData } = await getRelatedDocuments(transaction, result);

            const results = await getSeasonResultsByUser(result.seasonId, result.userId);
            const updatedStats = await updateUserStats(userData, result, true, results.filter(r => r.id !== result.id));

            if (reportRef) transaction.delete(reportRef);
            transaction.update(userRef, { seasons: updatedStats });
            transaction.delete(resultRef!);
        });
    } catch (error) {
        handleFirestoreError(error, 'remove result');
    }
};

export const addResult = async (result: ResultWithoutId): Promise<void> => {
    try {
        await runTransaction(db, async (transaction) => {
            const { userRef, userData } = await getRelatedDocuments(transaction, result);

            const results = await getSeasonResultsByUser(result.seasonId, result.userId);
            const updatedStats = await updateUserStats(userData, result, false, results);

            const newResultRef = doc(collection(db, 'results'));

            transaction.update(userRef, { seasons: updatedStats });
            transaction.set(newResultRef, result);
        });
    } catch (error) {
        handleFirestoreError(error, 'add result');
    }
};

const getRelatedDocuments = async (transaction: any, result: Result | ResultWithoutId): Promise<{
    resultRef: DocumentReference<DocumentData> | null;
    reportRef: DocumentReference<DocumentData> | null;
    userRef: DocumentReference<DocumentData>;
    userData: User;
}> => {
    const resultRef = 'id' in result ? doc(db, 'results', result.id) : null;
    const reportRef = result.reportId ? doc(db, 'reports', result.reportId) : null;
    const userRef = doc(db, 'users', result.userId);

    const [resultDoc, reportDoc, userDoc] = await Promise.all([
        resultRef ? transaction.get(resultRef) : null,
        reportRef ? transaction.get(reportRef) : null,
        transaction.get(userRef)
    ]);

    if (resultRef && !resultDoc?.exists()) {
        throw new Error("Result document does not exist!");
    }
    if (reportRef && !reportDoc?.exists()) {
        throw new Error("Report document does not exist!");
    }
    if (!userDoc.exists()) {
        throw new Error('User document not found');
    }

    const userData = userDoc.data() as User;

    return { resultRef, reportRef, userRef, userData };
};

const updateUserStats = async (
    userData: User,
    result: Result | ResultWithoutId,
    isRemoval: boolean,
    results: Result[]
) => {
    const seasonIndex = userData.seasons.findIndex(season => season.id === result.seasonId);
    const updatedSeasonStats = await calculateUpdatedSeasonStats(
        userData.seasons[seasonIndex].stats,
        result,
        isRemoval,
        results
    );

    userData.seasons[seasonIndex].stats = updatedSeasonStats;
    return userData.seasons;
};