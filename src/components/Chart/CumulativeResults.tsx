import React, { useState, useEffect, useMemo } from 'react';
import { startOfWeek, startOfMonth } from 'date-fns';
import chroma from 'chroma-js';
import CumulativeResultsChart from '@components/Chart/CumulativeResultsChart';
import Result from '@shared/types/Result';
import User from '@shared/types/User';
import ChartDataPoint from '@shared/types/ChartDataPoint';
import AggregationType from '@shared/types/AggregationType';

interface ChartDataProps {
    results: Result[];
    users: User[];
    aggregationType?: AggregationType;
}

const calculateChartData = ({ results, users, aggregationType = 'week' }: ChartDataProps) => {
    const userMetadata = {
        colors: Object.fromEntries(users.map(user => [user.id, generateColorFromId(user.id)])),
        userNames: Object.fromEntries(users.map(user => [user.id, user.displayName])),
    };

    if (!results.length) return { data: [], ...userMetadata };

    const sortedResults = [...results].sort((a, b) => a.date.toMillis() - b.date.toMillis());
    const start = getAggregatedDate(sortedResults[0].date.toDate(), aggregationType);
    const end = getAggregatedDate(sortedResults[sortedResults.length - 1].date.toDate(), aggregationType);
    const dates = generateDateRange(start, end, aggregationType);

    const userIds = users.map(user => user.id);
    const scores = Object.fromEntries(userIds.map(id => [id, 0]));

    const data = dates.map(date => {
        const dateStr = date.toISOString();

        sortedResults
            .filter(result => getAggregatedDate(result.date.toDate(), aggregationType).toISOString() === dateStr)
            .forEach(result => result.won && (scores[result.userId] += 1));

        return {
            date: dateStr,
            ...scores
        };
    });

    return { data, ...userMetadata };
};

const getAggregatedDate = (date: Date, aggregationType: 'week' | 'month'): Date => {
    return aggregationType === 'week' ? startOfWeek(date) : startOfMonth(date);
};

const generateDateRange = (start: Date, end: Date, aggregationType: 'week' | 'month'): Date[] => {
    const dates = [];
    let current = new Date(start);

    while (current <= end) {
        dates.push(new Date(current));
        if (aggregationType === 'week') {
            current.setDate(current.getDate() + 7);
        } else {
            current.setMonth(current.getMonth() + 1);
        }
    }

    return dates;
};

const generateColorFromId = (id: string): string => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        const char = id.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    const hue = Math.abs(hash) % 360;
    return chroma.hsl(hue, 0.7, 0.5).hex();
};

const CumulativeResults: React.FC<ChartDataProps> = ({ results, users }) => {
    const [aggregationType, setAggregationType] = useState<AggregationType>('week');
    const [data, setData] = useState<ChartDataPoint[]>([]);
    const [colors, setColors] = useState<Record<string, string>>({});
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [userNames, setUserNames] = useState<Record<string, string>>({});

    useEffect(() => {
        const { data, colors, userNames } = calculateChartData({ results, users, aggregationType });
        setData(data);
        setColors(colors);
        setUserNames(userNames);
    }, [results, users, aggregationType]);

    const handleUserSelection = (userId: string): void => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(userId)
                ? prevSelected.filter((id) => id !== userId)
                : [...prevSelected, userId]
        );
    };

    const isMultiUser = useMemo(() => Object.keys(colors).length > 1, [colors]);

    return (
        <div className="w-full">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <label htmlFor="aggregation" className="block text-sm font-medium mb-2 text-white">
                        Näytä tulokset:
                    </label>
                    <select
                        id="aggregation"
                        value={aggregationType}
                        onChange={(e) => setAggregationType(e.target.value as AggregationType)}
                        className="block w-full pl-3 pr-10 py-2 bg-slate-700 hover:bg-slate-600 text-white border-gray-600 sm:text-sm rounded-md"
                    >
                        <option className="bg-slate-700" value="week">Viikoittain</option>
                        <option className="bg-slate-700" value="month">Kuukausittain</option>
                    </select>
                </div>
                <div className="h-[60vh] mb-2">
                    <CumulativeResultsChart
                        data={data}
                        colors={colors}
                        aggregationType={aggregationType}
                        selectedUsers={selectedUsers}
                        userNames={userNames}
                        onUserSelect={isMultiUser ? handleUserSelection : undefined}
                        isMultiUser={isMultiUser}
                    />
                </div>
                {isMultiUser && (
                    <div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 overflow-y-auto p-4 bg-slate-800 rounded-lg mb-3">
                            {users.map((user) => (
                                <div key={user.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`checkbox-${user.id}`}
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleUserSelection(user.id)}
                                        className="form-checkbox h-3 w-3 text-indigo-600 transition duration-150 ease-in-out"
                                        style={{ accentColor: colors[user.id] }}
                                    />
                                    <label
                                        htmlFor={`checkbox-${user.id}`}
                                        className="ml-1 text-md [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]"
                                        style={{ color: colors[user.id] }}
                                    >
                                        {user.displayName}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <button className="bg-slate-700 text-white py-2 px-4 rounded my-4 w-full" onClick={() => setSelectedUsers([])}>
                            Poista valinnat
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CumulativeResults;
