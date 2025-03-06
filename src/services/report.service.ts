import { collection, query, where, orderBy, onSnapshot, doc, runTransaction, updateDoc, serverTimestamp, QueryConstraint, Unsubscribe, FirestoreError, DocumentData } from 'firebase/firestore';
import { db } from '@/firebase';
import Report from '@shared/types/Report';
import Result from '@shared/types/Result';
import User from '@shared/types/User';
import { withTimeout } from "@/shared/utils/general.utils";
import { handleFirestoreError } from '@/shared/utils/error.utils';

type ReportCallback = (reports: Report[]) => void;

const createReportQuery = (seasonId: string, userId?: string): QueryConstraint[] => {
    const constraints: QueryConstraint[] = [
        where('result.seasonId', '==', seasonId),
        orderBy('createdAt', 'desc')
    ];
    if (userId) constraints.push(where('result.userId', '==', userId));
    return constraints;
};

const mapDocToReport = (doc: DocumentData): Report => ({
    id: doc.id,
    ...doc.data()
} as Report);

export const subscribeToReports = (
    seasonId: string,
    callback: ReportCallback,
    userId?: string,
    includeContested = false
): Unsubscribe => {
    const constraints = createReportQuery(seasonId, userId);
    if (!includeContested) constraints.push(where('contested', '==', false));
    const q = query(collection(db, 'reports'), ...constraints);

    return onSnapshot(q,
        (snapshot) => callback(snapshot.docs.map(mapDocToReport)),
        (error: FirestoreError) => console.error('Error subscribing to reports:', error)
    );
};

export const addReport = async (result: Result, reportingUser: User): Promise<boolean> => {
    try {
        await withTimeout(runTransaction(db, async (transaction) => {
            const reportRef = doc(collection(db, 'reports'));
            const resultRef = doc(db, 'results', result.id);

            const reportData: Omit<Report, 'id'> = {
                result: { ...result, reportId: reportRef.id },
                reportingUserId: reportingUser.id,
                reportingUserName: reportingUser.displayName,
                createdAt: serverTimestamp(),
                contested: false,
            };

            transaction.set(reportRef, reportData);
            transaction.update(resultRef, { reportId: reportRef.id });
        }));
        return true;
    } catch (error: any) {
        handleFirestoreError(error, 'add report');
        return false;
    }
};

export const contestReport = async (reportId: string): Promise<boolean> => {
    try {
        await withTimeout(updateDoc(doc(db, 'reports', reportId), { contested: true }));
        return true;
    } catch (error: any) {
        handleFirestoreError(error, 'contest report');
        return false;
    }
};

export const removeReport = async (reportId: string): Promise<boolean> => {
    try {
        await withTimeout(runTransaction(db, async (transaction) => {
            const reportRef = doc(db, 'reports', reportId);
            const reportDoc = await transaction.get(reportRef);

            if (!reportDoc.exists()) {
                throw new Error("Report document does not exist!");
            }

            const report = reportDoc.data() as Report;
            const resultRef = doc(db, 'results', report.result.id);

            transaction.delete(reportRef);
            transaction.update(resultRef, { reportId: null });
        }));
        return true;
    } catch (error: any) {
        handleFirestoreError(error, 'remove report');
        return false;
    }
};