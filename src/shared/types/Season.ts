import { Timestamp } from 'firebase/firestore'

export default interface Season {
    id: string;
    name: string;
    startDate: Timestamp;
    endDate: Timestamp;
    allowResults: boolean;
    visible: boolean;
    formats: string[];
    times: { name: string; value: string }[];
    showPreciseTime: boolean;
    onlyWins: boolean;
}