import React, { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSeasonContext } from "@hooks/context.hooks";
import { useAllSeasonReports } from "@hooks/report.hooks";
import { removeReport } from "@services/report.service";
import { removeResult } from "@services/result.service";
import Report from "@shared/types/Report";
import ConfirmModal from "@components/Shared/ConfirmModal";
import ReportCard from "@components/Admin/AdminReportCard";
import PageLoader from "@components/Shared/Loader";

const AdminReportsList: React.FC = () => {
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [reportToConfirm, setReportToConfirm] = useState<Report | null>(null);
    const [confirmAction, setConfirmAction] = useState<'remove' | 'keep' | null>(null);
    const [showUncontested, setShowUncontested] = useState(false);

    const { selectedSeason } = useSeasonContext();
    const { reports, reportsLoading } = useAllSeasonReports(selectedSeason?.id || '', true);

    const handleAction = useCallback(async (action: 'remove' | 'keep') => {
        if (!reportToConfirm) return;
        try {
            if (action === 'remove') {
                await removeResult(reportToConfirm.result);
                toast.success('Tulos ja ilmianto poistettu!');
            } else {
                await removeReport(reportToConfirm.id);
                toast.success('Tulos säilytetty ja ilmianto poistettu!');
            }
        } catch (error) {
            toast.error(action === 'remove'
                ? 'Tulosta ja ilmiantoa ei voitu poistaa'
                : 'Ilmiantoa ei voitu poistaa');
        }
    }, [reportToConfirm]);

    const handleConfirmAction = useCallback((report: Report, action: 'remove' | 'keep') => {
        setReportToConfirm(report);
        setConfirmAction(action);
        setConfirmModalOpen(true);
    }, []);

    const handleConfirm = useCallback(async () => {
        setConfirmModalOpen(false);
        if (confirmAction) {
            await handleAction(confirmAction);
        }
        setReportToConfirm(null);
        setConfirmAction(null);
    }, [confirmAction, handleAction]);

    const { contestedReports, notContestedReports } = useMemo(() => ({
        contestedReports: reports.filter(report => report.contested),
        notContestedReports: reports.filter(report => !report.contested)
    }), [reports]);

    if (!selectedSeason) return <h1>Ei valittua kautta</h1>;

    if (reportsLoading) return <PageLoader />;

    return (
        <>
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">Ilmiannot</h1>
                {reports.length > 0 ? (
                    <>
                        <div>
                            <h2 className="text-2xl font-semibold mb-3">Kiistetyt ilmiannot:</h2>
                            {contestedReports.length > 0 ? (
                                <ul className="list-none">
                                    {contestedReports.map((report) => (
                                        <ReportCard
                                            key={report.id}
                                            report={report}
                                            onConfirmAction={handleConfirmAction}
                                        />
                                    ))}
                                </ul>
                            ) : (
                                <p>Ei kiistettyjä ilmiantoja</p>
                            )}
                        </div>
                        {notContestedReports.length > 0 && (
                            <>
                                <button
                                    className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded focus:outline-none transition-colors w-fit"
                                    onClick={() => setShowUncontested(!showUncontested)}
                                >
                                    {showUncontested ? 'Piilota muut ilmiannot' : 'Näytä muut ilmiannot'}
                                </button>
                                {showUncontested && (
                                    <div>
                                        <h2 className="text-2xl font-semibold mb-3">Muut ilmiannot:</h2>
                                        <ul className="list-none">
                                            {notContestedReports.map((report) => (
                                                <ReportCard
                                                    key={report.id}
                                                    report={report}
                                                    onConfirmAction={handleConfirmAction}
                                                />
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <p>Ei ilmiantoja vielä</p>
                )}
                <Link to="/admin/dashboard"><button className="text-blue-600 hover:underline">Takaisin</button></Link>
            </div>
            <ConfirmModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirm}
                title={confirmAction === 'remove' ? 'Vahvista poistaminen' : 'Vahvista säilyttäminen'}
                message={confirmAction === 'remove'
                    ? 'Haluatko varmasti poistaa tämän tuloksen?. Poistamista ei voi peruuttaa.'
                    : 'Haluatko varmasti säilytää tämän tuloksen?'
                }
            />
        </>
    );
}

export default AdminReportsList;