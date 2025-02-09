import React from 'react';
import Report from '@shared/types/Report';
import { formatDate, formatTime } from '@/shared/utils/date.utils';

interface ReportCardProps {
    report: Report;
    onConfirmAction: (report: Report, action: 'yield' | 'contest') => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onConfirmAction }) => (
    <div className={`flex flex-col gap-1 rounded-lg p-4 shadow-md text-white bg-red-500`}>
        <p>Ilmiantaja: {report.reportingUserName}</p>
        <p>
            Tulos: {formatDate(report.result.date)} - {report.result.timeName} - {report.result.format} - {report.result.won ? 'Voitto' : 'Tappio'}
        </p>
        <p className='text-xs text-gray-400 text-nowrap'>Luotu: {formatDate(report.result.createdAt)} {formatTime(report.result.createdAt)}</p>
        <div className="flex gap-2 mt-1">
            <button
                className="bg-red-600 text-white py-2 px-4 rounded focus:outline-none hover:bg-red-800 transition-colors w-full"
                onClick={() => onConfirmAction(report, 'contest')}
            >
                Kiistä
            </button>
            <button
                className="bg-green-500 text-white py-2 px-4 rounded focus:outline-none hover:bg-green-700 transition-colors w-full"
                onClick={() => onConfirmAction(report, 'yield')}
            >
                Myönnytä
            </button>
        </div>
    </div>
);

export default ReportCard;