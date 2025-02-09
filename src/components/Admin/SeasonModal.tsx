import React, { useState, useEffect } from "react";
import Season from "@shared/types/Season";
import { Timestamp } from "firebase/firestore";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from "@components/Shared/Modal";

interface SeasonModalProps {
    isOpen: boolean;
    onConfirm: (formData: Omit<Season, 'id'>) => void;
    onClose: () => void;
    season?: Season;
}

const SeasonModal: React.FC<SeasonModalProps> = ({ isOpen, onConfirm, onClose, season }) => {
    const initialFormData: Omit<Season, 'id'> = {
        name: '',
        startDate: Timestamp.now(),
        endDate: Timestamp.now(),
        formats: [''],
        allowResults: true,
        visible: true,
        times: [{ name: '', value: '00:00' }],
        showPreciseTime: false,
        onlyWins: true
    };

    const [formData, setFormData] = useState<Omit<Season, 'id'>>(initialFormData);

    useEffect(() => {
        if (season) {
            setFormData({
                name: season.name || '',
                startDate: season.startDate || Timestamp.now(),
                endDate: season.endDate || Timestamp.now(),
                formats: season.formats.length > 0 ? season.formats : [''],
                allowResults: season.allowResults !== undefined ? season.allowResults : true,
                visible: season.visible !== undefined ? season.visible : true,
                times: season.times.length > 0 ? season.times : [{ name: '', value: '00:00' }],
                showPreciseTime: season.showPreciseTime !== undefined ? season.showPreciseTime : false,
                onlyWins: season.onlyWins !== undefined ? season.onlyWins : false
            });
        } else {
            setFormData(initialFormData);
        }
    }, [season]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDateChange = (date: Date | null, fieldName: 'startDate' | 'endDate') => {
        if (date) {
            setFormData(prev => ({
                ...prev,
                [fieldName]: Timestamp.fromDate(date)
            }));
        }
    };

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = event.target;
        const newTimes = [...formData.times];
        newTimes[index] = { ...newTimes[index], [name]: value };
        setFormData(prev => ({ ...prev, times: newTimes }));
    };

    const handleFormatChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newFormats = [...formData.formats];
        newFormats[index] = event.target.value;
        setFormData(prev => ({ ...prev, formats: newFormats }));
    };

    const addFormatField = () => {
        setFormData(prev => ({ ...prev, formats: [...prev.formats, ''] }));
    };

    const removeFormatField = (index: number) => {
        setFormData(prev => ({ ...prev, formats: prev.formats.filter((_, i) => i !== index) }));
    };

    const addTimeField = () => {
        setFormData(prev => ({ ...prev, times: [...prev.times, { name: '', value: '00:00' }] }));
    };

    const removeTimeField = (index: number) => {
        setFormData(prev => ({ ...prev, times: prev.times.filter((_, i) => i !== index) }));
    };

    const handleSubmit = () => {
        onConfirm(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={season ? "Muokkaa kautta" : "Luo uusi kausi"}
            onConfirm={handleSubmit}
            confirmText={season ? "Tallenna muutokset" : "Luo kausi"}
            cancelText="Peruuta"
            maxWidth="max-w-3xl"
        >
            <div className="overflow-y-auto space-y-4 pr-6 mb-20 ">
                <div>
                    <label className="block mb-1">Nimi</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Kauden nimi"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded text-black"
                    />
                </div>
                <div>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="visible"
                            checked={formData.visible}
                            onChange={handleInputChange}
                            className="h-4 w-4"
                        />
                        <span>Näkyvissä</span>
                    </label>
                </div>
                <div>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="allowResults"
                            checked={formData.allowResults}
                            onChange={handleInputChange}
                            className="h-4 w-4"
                        />
                        <span>Salli tulosten lisääminen</span>
                    </label>
                </div>
                <div>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="onlyWins"
                            checked={formData.onlyWins}
                            onChange={handleInputChange}
                            className="h-4 w-4"
                        />
                        <span>Vain voitot ilmoitetaan</span>
                    </label>
                </div>
                <div>
                    <label className="block mb-1">Alkamispäivä</label>
                    <DatePicker
                        selected={formData.startDate.toDate()}
                        onChange={(date: Date | null) => handleDateChange(date, 'startDate')}
                        dateFormat="dd.MM.yyyy"
                        className="w-full p-2 border rounded text-black"
                        calendarClassName="bg-white text-black"
                        popperClassName="z-50"
                        calendarStartDay={1}
                        showPopperArrow={false}
                    />
                </div>
                <div>
                    <label className="block mb-1">Päättymispäivä</label>
                    <DatePicker
                        selected={formData.endDate.toDate()}
                        onChange={(date: Date | null) => handleDateChange(date, 'endDate')}
                        dateFormat="dd.MM.yyyy"
                        className="w-full p-2 border rounded text-black"
                        calendarClassName="bg-white text-black"
                        popperClassName="z-50"
                        calendarStartDay={1}
                        showPopperArrow={false}
                    />
                </div>
                <div>
                    <label className="block mb-1">Peliajat</label>
                    {formData.times.map((time, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2 text-black">
                            <input
                                type="text"
                                name="name"
                                value={time.name}
                                onChange={(e) => handleTimeChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                                required
                                placeholder="Esim. Aamutreeni"
                                className="w-1/2 p-2 border rounded"
                            />
                            <input
                                type="time"
                                name="value"
                                value={time.value}
                                onChange={(e) => handleTimeChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                                required
                                className="w-1/2 p-2 border rounded"
                            />
                            <button
                                type="button"
                                onClick={() => removeTimeField(index)}
                                className="p-2 text-red-500"
                            >
                                Poista
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addTimeField}
                        className="p-2 text-blue-500"
                    >
                        Lisää peliaika
                    </button>
                </div>
                <div>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="showPreciseTime"
                            checked={formData.showPreciseTime}
                            onChange={handleInputChange}
                            className="h-4 w-4"
                        />
                        <span>Näytä peliaikojen kellonaika</span>
                    </label>
                </div>
                <div>
                    <label className="block mb-1">Pelityypit</label>
                    {formData.formats.map((format, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                            <input
                                type="text"
                                value={format}
                                onChange={(e) => handleFormatChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                                required
                                placeholder="Esim. 1v1"
                                className="w-full p-2 border rounded text-black"
                            />
                            <button
                                type="button"
                                onClick={() => removeFormatField(index)}
                                className="p-2 text-red-500"
                            >
                                Poista
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addFormatField}
                        className="p-2 text-blue-500"
                    >
                        Lisää pelityyppi
                    </button>
                </div>
            </div>

        </Modal>
    );
};

export default SeasonModal;