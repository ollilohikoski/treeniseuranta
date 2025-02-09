import ChartDataPoint from "./ChartDataPoint";
import AggregationType from '@shared/types/AggregationType';

interface ChartProps {
    data: ChartDataPoint[];
    colors: Record<string, string>;
    aggregationType: AggregationType;
    selectedUsers: string[];
    userNames: Record<string, string>;
    onUserSelect?: (userId: string) => void;
    isMultiUser: boolean;
}

export default ChartProps;