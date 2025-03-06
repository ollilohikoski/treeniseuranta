import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import CustomTooltipProps from '@shared/types/CustomTooltipProps';
import ChartProps from '@shared/types/ChartProps';

const CumulativeResultsChart: React.FC<ChartProps> = ({
    data,
    colors,
    aggregationType,
    selectedUsers,
    userNames,
    onUserSelect,
    isMultiUser
}) => {
    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            let dataToShow = payload;
            if (selectedUsers.length > 0) {
                dataToShow = payload.filter((entry) => selectedUsers.includes(entry.dataKey));
            }
            const sortedData = dataToShow.sort((a, b) => b.value - a.value);
            const limitedData = sortedData.slice(0, 15);

            let formattedDate: string;
            const date = new Date(label);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }
            formattedDate = format(date, 'dd.MM.yyyy');

            return (
                <div className="bg-slate-600 p-2 rounded-lg shadow-lg border border-slate-700 opacity-95">
                    <p className="font-bold text-white">{formattedDate}</p>
                    <div className='flex flex-col flex-wrap max-h-[32rem]'>
                        {limitedData.map((entry, index) => (
                            <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
                                {isMultiUser && index + 1 + "."} {userNames[entry.dataKey] || entry.dataKey}: {entry.value}
                            </p>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    const formatXAxis = (dateString: string): string => {
        const date = new Date(dateString);
        return aggregationType === 'week' ? `${format(date, 'ww')}` : format(date, 'MM');
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 12 }}>
                <CartesianGrid strokeDasharray="5 5" stroke="#4B5563" />
                <XAxis
                    dataKey="date"
                    tickFormatter={formatXAxis}
                    interval={'preserveStartEnd'}
                    stroke="#A0AEC0"
                    label={{
                        value: aggregationType === 'week' ? 'Viikko' : 'Kuukausi',
                        position: 'insideBottom',
                        dy: 16,
                        fill: '#A0AEC0'
                    }}
                />
                <YAxis
                    stroke="#A0AEC0"
                    label={{ value: 'Kumulatiiviset voitot', angle: -90, dx: -15, fill: '#A0AEC0' }}
                    allowDecimals={false} // Only show full integers
                    domain={['dataMin', 'dataMax']}
                />
                <Tooltip content={<CustomTooltip active={false} payload={[]} label="" />} />
                {Object.keys(colors).map((userId) => (
                    <Line
                        key={userId}
                        type="monotone"
                        dataKey={userId}
                        name={userNames[userId] || userId}
                        stroke={isMultiUser ? colors[userId] : '#3182CE'}
                        strokeWidth={selectedUsers.includes(userId) ? 5 : 2}
                        dot={false}
                        activeDot={true}
                        strokeOpacity={selectedUsers.length === 0 || selectedUsers.includes(userId) ? 1 : 0.1}
                        onClick={onUserSelect ? () => onUserSelect(userId) : undefined}
                        style={{ cursor: onUserSelect ? 'pointer' : 'auto' }}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default CumulativeResultsChart;
