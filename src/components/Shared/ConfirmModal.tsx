import React, { ReactNode } from 'react';
import Modal from '@components/Shared/Modal';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message?: string;
    content?: ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message, content }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            onConfirm={onConfirm}
        >
            <p className="text-gray-300">{message}</p>
            {content && <div className="mb-4">{content}</div>}
        </Modal>
    );
};

export default ConfirmModal;
