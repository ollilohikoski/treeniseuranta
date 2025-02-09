import { useState } from "react"
import ResultList from "@components/Result/ResultList"
import ResultSorter from "@components/Result/ResultSorter"
import Season from "@shared/types/Season"
import Result from "@/shared/types/Result"

const PersonalResults: React.FC<{ results: Result[], selectedSeason: Season }> = ({ results, selectedSeason }) => {
    const [sortOption, setSortOption] = useState<'dateDesc' | 'dateAsc'>('dateDesc')

    return (
        <>
            <ResultSorter sortOption={sortOption} setSortOption={setSortOption} />
            <ResultList
                results={results}
                season={selectedSeason}
                sortOption={sortOption}
                multiUser={false}
                allowRemove
            />
        </>
    )
}

export default PersonalResults;