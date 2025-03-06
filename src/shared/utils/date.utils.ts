import { FieldValue, Timestamp } from 'firebase/firestore';

export const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

export const isTimestampRecent = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return false;
    const now = new Date();
    const diff = now.getTime() - timestamp.toMillis();
    return diff < (1000 * 60 * 60 * 24); // 24 hours
};

export const formatDate = (date: Timestamp | FieldValue) => {
    if (date instanceof FieldValue) return 'N/A';
    return date.toDate().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export const formatTime = (date: Timestamp | FieldValue) => {
    if (date instanceof FieldValue) return 'N/A';
    return date.toDate().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
