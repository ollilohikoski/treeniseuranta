import React, { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import Report from '@shared/types/Report';
import { removeResult } from '@services/result.service';
import { contestReport } from '@services/report.service';
import ReportCard from './ReportCard';
import ConfirmModal from '@components/Shared/ConfirmModal';
import Loader from '@components/Shared/Loader';

interface ReportListProps {
    reports: Report[];
}

const ReportList: React.FC<ReportListProps> = ({ reports }) => {
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [reportToConfirm, setReportToConfirm] = useState<Report | null>(null);
    const [confirmAction, setConfirmAction] = useState<'yield' | 'contest' | null>(null);
    const [loading, setLoading] = useState(false);

    const nonContestedReports = useMemo(() =>
        reports.filter(report => !report.contested),
        [reports]);

    const handleAction = useCallback(async (action: 'yield' | 'contest') => {
        if (!reportToConfirm) return;

        setLoading(true);
        try {
            if (action === 'yield') {
                await removeResult(reportToConfirm.result);
                toast.success('Ilmianto myönnetty ja tulos poistettu!');
            } else if (action === 'contest') {
                await contestReport(reportToConfirm.id);
                toast.success('Ilmianto kiistetty!');
            }
        } catch (error) {
            toast.error(`Ilmiantoa ei voitu ${action === 'yield' ? 'myöntää' : 'kiistää'}`);
        } finally {
            setLoading(false);
            setReportToConfirm(null);
            setConfirmAction(null);
        }
    }, [reportToConfirm]);

    const handleConfirmAction = useCallback((report: Report, action: 'yield' | 'contest') => {
        setReportToConfirm(report);
        setConfirmAction(action);
        setConfirmModalOpen(true);
    }, []);

    const handleConfirm = useCallback(async () => {
        setConfirmModalOpen(false);
        if (confirmAction) {
            await handleAction(confirmAction);
        }
    }, [confirmAction, handleAction]);

    if (nonContestedReports.length === 0) {
        return null;
    }

    return (
        <>
            <div className="bg-red-600 p-4 rounded-lg w-full justify-center">
                <h2 className="text-xl text-center mb-3">Tuloksiasi on ilmiannettu!</h2>
                <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                    {nonContestedReports.map((report) => (
                        <ReportCard
                            key={report.id}
                            report={report}
                            onConfirmAction={handleConfirmAction}
                        />
                    ))}
                </div>
            </div>
            <ConfirmModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirm}
                title={confirmAction === 'yield' ? 'Vahvista myöntäminen' : 'Vahvista kiistäminen'}
                message={confirmAction === 'yield'
                    ? 'Haluatko varmasti myöntää tämän ilmiannon? Tuloksesi poistetaan.'
                    : 'Haluatko varmasti kiistää tämän ilmiannon? Ilmianto tulee valmentajan käsiteltäväksi.'
                }
            />
            {loading && <Loader />}
        </>
    );
}

export default ReportList;
