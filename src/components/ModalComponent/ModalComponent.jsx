
// eslint-disable-next-line react/prop-types
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-11/12 bg-white rounded-lg shadow-lg md:w-1/2 lg:w-1/3">
        {/* Header */}
        <div className="flex flex-col items-center justify-center px-4 py-2 border-b border-gray-200">
          <h1 className="mb-4 text-3xl font-bold text-blue-500 ">HOÀNG NAM COLLECTION</h1>
          <p className="text-xl text-center">
           {title}
          </p>
          <h2 className="text-xl font-semibold"></h2>
          
        </div>
        {/* Body */}
        <div className="p-4">{children}</div>
        {/* Footer */}
        <div className="flex justify-end px-4 py-2 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
