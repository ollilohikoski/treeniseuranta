import React from 'react';
import Report from '@shared/types/Report';
import { formatDate, formatTime } from '@/shared/utils/date.utils';

interface AdminReportCardProps {
    report: Report;
    onConfirmAction: (report: Report, action: 'remove' | 'keep') => void;
}

const AdminReportCard: React.FC<AdminReportCardProps> = ({ report, onConfirmAction }) => (
    <li className="mb-4 rounded shadow bg-slate-800 p-6">
        <div className="flex flex-col gap-2">
            {[
                { label: "Ilmiantaja", value: report.reportingUserName || 'Ilmiantajan nimi' },
                { label: "Ilmiannettu", value: report.result.userName || 'Ilmiannetun nimi' },
                { label: "Ilmiannon aika", value: `${formatDate(report.createdAt)} ${formatTime(report.createdAt)}` },
                { label: "Tuloksen aika", value: formatDate(report.result.date) },
                { label: "Aika", value: report.result.timeName },
                { label: "Pelityyppi", value: report.result.format },
                { label: "Tulos", value: report.result.won ? 'Voitto' : 'Tappio' },
            ].map(({ label, value }) => (
                <div key={label}>
                    <p>{label}:</p>
                    <p className="font-medium text-lg">{value}</p>
                </div>
            ))}
        </div>
        <div className="mt-4 flex gap-2">
            <button
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded focus:outline-none transition-colors"
                onClick={() => onConfirmAction(report, 'keep')}
            >
                Säilytä tulos
            </button>
            <button
                className="bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded focus:outline-none transition-colors"
                onClick={() => onConfirmAction(report, 'remove')}
            >
                Poista tulos
            </button>
        </div>
    </li>
);

export default AdminReportCard;