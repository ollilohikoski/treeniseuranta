import Season from "@shared/types/Season";

const SeasonCard: React.FC<{ season: Season, selectedSeason: Season, onSelect: (season: Season) => void }> = ({ season, selectedSeason, onSelect }) => {
    return (
        <div key={season.id} onClick={() => onSelect(season)} className={`bg-slate-800 hover:bg-slate-700 transition-all duration-500 p-4 rounded-lg shadow-md cursor-pointer border-blue-700 ${selectedSeason?.id === season.id && "border"}`}>
            <h6 className="text-lg font-semibold mb-2">{season.name}</h6>
            <p className="text-sm">
                Alkaa: {season.startDate.toDate().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}
            </p>
            <p className="text-sm">
                Päättyy: {season.endDate.toDate().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}
            </p>
        </div>
    );
}

export default SeasonCard;