import Result from '@shared/types/Result';

export const hasResultForDateAndTime = (results: Result[], date: Date, timeName: string): boolean => {
    return results.some(result => {
        const resultDate = result.date.toDate();
        return (
            resultDate.getFullYear() === date.getFullYear() &&
            resultDate.getMonth() === date.getMonth() &&
            resultDate.getDate() === date.getDate() &&
            result.timeName === timeName
        );
    });
};
