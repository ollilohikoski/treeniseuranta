import React, { ReactNode } from 'react';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    confirmText?: string;
    onConfirm?: () => void;
    cancelText?: string;
    maxWidth?: string;
}

const Modal: React.FC<BaseModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    onConfirm,
    maxWidth = 'max-w-md',
    confirmText = 'Hyväksy',
    cancelText = 'Peruuta',
}) => {
    return (
        <div
            className={`fixed inset-0 flex items-center justify-center transition-opacity z-20 duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div className='fixed inset-0 bg-black bg-opacity-40'></div>
            <div
                className={`bg-slate-800 p-4 sm:p-6 mx-4 rounded-lg shadow-lg w-full ${maxWidth} z-20 transition-transform transform duration-300 ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-40 opacity-0'}`}
            >
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <div className="max-h-[60vh] overflow-y-auto">
                    <div className='sm:mr-4'>
                        {children}
                    </div>
                </div>
                <div className="flex justify-between pt-2 mt-3 space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="py-2 px-4 rounded bg-slate-700 text-white hover:bg-slate-600"
                    >
                        {cancelText}
                    </button>
                    {onConfirm && (
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="py-2 px-4 rounded bg-blue-800 hover:bg-blue-700 text-white"
                        >
                            {confirmText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;