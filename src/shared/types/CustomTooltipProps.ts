import { TooltipProps } from 'recharts';

interface CustomTooltipProps extends TooltipProps<any, any> {
    active: boolean;
    payload: { dataKey: string; color: string; name: string; value: number }[];
    label: string;
}

export default CustomTooltipProps;