import ResultSortOptions from "@shared/types/ResultSortOptions";

const ResultSorter: React.FC<{ sortOption: ResultSortOptions; setSortOption: (newSort: ResultSortOptions) => void }> = ({ sortOption, setSortOption }) => {
    return (
        <div className="mb-1">
            <label htmlFor="sort-select" className="mr-2">Järjestä:</label>
            <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as ResultSortOptions)}
                className="bg-slate-700 p-2 hover:bg-slate-600 text-white rounded px-2 py-1"
            >
                <option className='bg-slate-700' value="dateDesc">Uusin ensin</option>
                <option className='bg-slate-700' value="dateAsc">Vanhin ensin</option>
            </select>
        </div>
    );
};

export default ResultSorter;
