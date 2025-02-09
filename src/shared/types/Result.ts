import { Timestamp } from "firebase/firestore";

export default interface Result {
    id: string;
    userId: string;
    userName: string;
    date: Timestamp;
    timeName: string;
    format: string;
    won: boolean;
    reportId: string | null;
    seasonId: string;
    createdAt: Timestamp;
}