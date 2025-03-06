import Season from "@shared/types/Season";

const AdminSeasonCard: React.FC<{
    season: Season;
    onEdit: (season: Season) => void;
    onShowResults: (season: Season) => void;
    onShowReports: (season: Season) => void;
}> = ({ season, onEdit, onShowResults, onShowReports }) => {
    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-md">
            <div className="mb-4">
                <h6 className="text-lg font-semibold mb-2">{season.name}</h6>
                <p className="text-sm">Näkyvissä: {season.visible ? 'Kyllä' : 'Ei'}</p>
                <p className="text-sm">Sallii tulokset: {season.allowResults ? 'Kyllä' : 'Ei'}</p>
                <p className="text-sm">
                    Alkaa: {season.startDate.toDate().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                </p>
                <p className="text-sm">
                    Päättyy: {season.endDate.toDate().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                </p>
            </div>
            <div className="flex justify-between flex-wrap gap-2">
                <button
                    onClick={() => onEdit(season)}
                    className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
                >
                    Muokkaa
                </button>
                <button
                    onClick={() => onShowResults(season)}
                    className="text-blue-600 hover:underline"
                >
                    Avaa tulokset
                </button>
                <button
                    onClick={() => onShowReports(season)}
                    className="text-blue-600 hover:underline"
                >
                    Avaa ilmiannot
                </button>
            </div>
        </div>
    );
};

export default AdminSeasonCard;