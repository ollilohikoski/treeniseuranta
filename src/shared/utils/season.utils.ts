import Season from '@shared/types/Season';

export const isSeasonActive = (season: Season) => {
    const now = new Date();
    return now >= season.startDate.toDate() && now <= season.endDate.toDate();
};
