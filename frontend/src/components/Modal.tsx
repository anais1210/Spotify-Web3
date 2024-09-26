import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  // Function to handle clicks on the overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      onClose(); // Close the modal if clicking on the overlay
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={handleOverlayClick}
    >
      <div className="rounded-lg p-8 w-11/12 max-w-lg bg-gray-900 shadow-lg border border-gray-700 transition-transform transform scale-95 hover:scale-100">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition duration-200"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
