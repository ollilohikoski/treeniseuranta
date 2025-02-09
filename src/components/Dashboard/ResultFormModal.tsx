import React, { useState, useEffect } from 'react';
import { useSeasonContext } from '@hooks/context.hooks';
import { Timestamp } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from '@components/Shared/Modal';
import { isSeasonActive } from '@/shared/utils/season.utils';

interface ResultFormModalProps {
    isOpen: boolean;
    onConfirm: (formData: { date: Timestamp; timeName: string; format: string; won: boolean }) => void;
    onClose: () => void;
}

const ResultFormModal: React.FC<ResultFormModalProps> = ({ isOpen, onConfirm, onClose }) => {
    const { seasons, selectedSeason } = useSeasonContext();
    const [format, setFormat] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedTimeName, setSelectedTimeName] = useState('');
    const [won, setWon] = useState(false);

    const today: Date = new Date();
    const oneWeekAgo: Date = new Date(today.getTime() - 2 * 7 * 24 * 60 * 60 * 1000);

    const [selectedDate, setSelectedDate] = useState<Date | null>(today);

    useEffect(() => {
        if (selectedSeason) {
            setFormat(selectedSeason.formats?.[0] || '');
            setSelectedTime(selectedSeason.times?.[0]?.value || '');
            setSelectedTimeName(selectedSeason.times?.[0]?.name || '');
        }
    }, [selectedSeason]);

    const handleSubmit = () => {
        if (selectedDate) {
            const date = new Date(selectedDate);
            date.setHours(parseInt(selectedTime.split(':')[0], 10));
            date.setMinutes(parseInt(selectedTime.split(':')[1], 10));
            onConfirm({ date: Timestamp.fromDate(date), timeName: selectedTimeName, format, won });
        }
    };

    const handleChangeFormat = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFormat(event.target.value);
    };

    const handleChangeTime = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTime(event.target.value);
        setSelectedTimeName(selectedSeason?.times?.find(time => time.value === event.target.value)?.name || '');
    };

    if (!selectedSeason) return null;

    const activateSeasons = seasons.filter(season => isSeasonActive(season));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Lisää ${selectedSeason.onlyWins ? 'voitto' : 'tulos'}`}
            onConfirm={handleSubmit}
            confirmText={`Lisää ${selectedSeason.onlyWins ? 'voitto' : 'tulos'}`}
            cancelText="Sulje"
        >
            {activateSeasons.length > 1 &&
                <div className="mb-4">
                    <p className="text-sm">Valittu kausi: {selectedSeason.name}</p>
                </div>}
            <div className="mb-4 w-full">
                <label className="block text-sm font-medium mb-1">Päivämäärä</label>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    minDate={oneWeekAgo}
                    maxDate={today}
                    dateFormat="dd.MM.yyyy"
                    className="text-black mt-1 block w-full p-2 border rounded-md"
                    wrapperClassName="w-full"
                    calendarClassName="bg-white text-black"
                    popperClassName="z-50"
                    calendarStartDay={1}
                    showPopperArrow={false}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Aika</label>
                <select
                    value={selectedTime}
                    onChange={handleChangeTime}
                    className="text-black mt-1 block w-full p-2 border rounded-md"
                >
                    {selectedSeason.times ? selectedSeason.times.map((time) => (
                        <option key={time.value} value={time.value}>
                            {time.name}{selectedSeason.showPreciseTime && (' - ' + time.value)}
                        </option>
                    )) : <option value=""><em>Peliajat eivät ole saatavilla</em></option>}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Pelityyppi</label>
                <select
                    value={format}
                    onChange={handleChangeFormat}
                    className="text-black mt-1 block w-full p-2 border rounded-md"
                >
                    {selectedSeason.formats ? selectedSeason.formats.map((format) => (
                        <option className='text-black' key={format} value={format}>
                            {format}
                        </option>
                    )) : <option value=""><em>Pelityypit eivät ole saatavilla</em></option>}
                </select>
            </div>
            {!selectedSeason.onlyWins &&
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        checked={won || selectedSeason.onlyWins}
                        onChange={(e) => setWon(e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label className="ml-2 block text-sm">Voitto</label>
                </div>
            }
        </Modal>
    );
};

export default ResultFormModal;