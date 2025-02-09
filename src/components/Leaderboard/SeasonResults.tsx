import ResultList from "@components/Result/ResultList"
import Season from "@shared/types/Season"
import Result from "@shared/types/Result"

const SeasonResults: React.FC<{ results: Result[], selectedSeason: Season, allowRemove?: boolean, allowReport?: boolean, limitResults?: number }> = ({ results, selectedSeason, allowRemove, allowReport, limitResults }) => {
    return (
        <>
            <ResultList
                results={results}
                season={selectedSeason}
                allowRemove={allowRemove}
                allowReport={allowReport}
                limitResults={limitResults}
                multiUser
            />
        </>
    )
}

export default SeasonResults;