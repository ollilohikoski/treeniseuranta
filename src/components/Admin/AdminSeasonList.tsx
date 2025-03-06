import Season from "@shared/types/Season";
import AdminSeasonCard from "@components/Admin/AdminSeasonCard";

const AdminSeasonList: React.FC<{
    seasons: Season[];
    onEdit: (season: Season) => void;
    onShowResults: (season: Season) => void;
    onShowReports: (season: Season) => void;
    showInactive?: boolean;
}> = ({ seasons, onEdit, onShowResults, onShowReports }) => {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {seasons.map((season) => (
                <AdminSeasonCard
                    key={season.id}
                    season={season}
                    onEdit={onEdit}
                    onShowResults={onShowResults}
                    onShowReports={onShowReports}
                />
            ))}
        </div>
    );
};

export default AdminSeasonList;