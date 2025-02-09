import { Timestamp, FieldValue } from "firebase/firestore";

export default interface SeasonStats {
    winningResults: number;
    totalResults: number;
    lastResultDate: Timestamp | FieldValue | null;
}
