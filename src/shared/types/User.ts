import SeasonStats from './SeasonStats';
import { FieldValue, Timestamp } from 'firebase/firestore';

export default interface User {
    displayName: string;
    email: string;
    id: string;
    createdAt: Timestamp | FieldValue;
    nameChosen: boolean;
    isSuperUser: boolean;
    isVerified: boolean;
    isActive: boolean;
    selectedSeasonId: string | null;
    seasons: {
        stats: SeasonStats;
        id: string;
    }[];
}