import React from 'react';

const ScrollPage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = () => {
    document.body.style.overflow = 'hidden';
    setIsModalOpen(true);
  };

  const closeModal = () => {
    document.body.style.overflow = 'unset';
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Modal Example</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={openModal}
      >
        Open Modal
      </button>
      {isModalOpen && <Modal onClose={closeModal} />}
      {/* 긴 콘텐츠를 생성하여 스크롤이 생기도록 합니다 */}
      {Array(50)
        .fill(0)
        .map((_, index) => (
          <>
            {index === 30 && (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={openModal}
              >
                Open Modal
              </button>
            )}
            <p key={index} className="my-4">
              This is a long content paragraph {index + 1}
            </p>
          </>
        ))}
    </div>
  );
};

export default ScrollPage;

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Modal Title</h2>
        <p className="mb-4">This is the modal content.</p>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={onClose}
        >
          Close Modal
        </button>
      </div>
    </div>
  );
};
