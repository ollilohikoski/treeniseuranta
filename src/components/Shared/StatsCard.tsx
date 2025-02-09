import Season from "@/shared/types/Season";
import SeasonStats from "@/shared/types/SeasonStats";

const StatsCard: React.FC<{
    seasonStats: SeasonStats,
    userPosition: number,
    season: Season
}> = ({
    seasonStats,
    userPosition,
    season
}) => {
        const getPositionClassName = (position: number) => {
            switch (position) {
                case 1:
                    return "text-orange-500 font-bold";
                case 2:
                    return "text-zinc-400 font-bold";
                case 3:
                    return "text-orange-700 font-bold";
                default:
                    return "text-white font-bold";
            }
        };

        if (!seasonStats) return <div>Ei tilastoja vielä</div>;

        return (
            <div>
                <div className='flex flex-col gap-4'>
                    <div className='grid grid-cols-2 gap-x-5 bg-slate-800 w-fit px-5 py-3 rounded'>
                        <>
                            <p>Sijoitus:{" "}</p>
                            {(season.onlyWins ? seasonStats.winningResults : seasonStats.totalResults > 0) ? (
                                <p className={getPositionClassName(userPosition || 0)}>{userPosition}</p>
                            ) : '-'}
                            <p>Voitot: </p><p>{seasonStats.winningResults || 0}</p>
                            {!season?.onlyWins && (
                                <>
                                    <p>Pelattu:</p><p>{seasonStats.totalResults || 0}</p>
                                </>
                            )}
                        </>
                    </div>
                </div>
            </div>
        );
    };

export default StatsCard;