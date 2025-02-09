import { useAuthContext } from "@hooks/context.hooks";
import CumulativeResults from "@components/Chart/CumulativeResults";
import { usePersonalResultsContext } from "@hooks/context.hooks";
import PageLoader from "@components/Shared/Loader";

const PersonalChart = () => {
    const { currentUser } = useAuthContext();
    const { results, resultsLoading } = usePersonalResultsContext();

    if (resultsLoading) return <PageLoader />;

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Tuloskaaviosi</h1>
            <CumulativeResults results={results} users={[currentUser!]} />
        </div>
    );
}

export default PersonalChart;