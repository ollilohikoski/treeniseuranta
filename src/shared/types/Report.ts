import { Timestamp, FieldValue } from "firebase/firestore";
import Result from "./Result";

interface Report {
    id: string;
    reportingUserId: string;
    reportingUserName: string;
    result: Result;
    createdAt: Timestamp | FieldValue;
    contested: boolean;
}

export default Report;