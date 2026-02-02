import { useEffect, useState } from "react";

interface ToastMessageProps {
  message: string;
  color: string;
  onClose: () => void;
  duration?: number;
}

const ToastMessage = ({
  message,
  color,
  onClose,
  duration = 3000,
}: ToastMessageProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500); // Delay for smooth exit animation
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor =
    {
      blue: "bg-blue-500",
      red: "bg-red-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      gray: "bg-gray-500",
    }[color] || "bg-blue-500";

  return (
    <div
      className={`fixed top-5 right-5 max-w-xs text-sm text-white rounded-xl shadow-lg transition-transform duration-500 ease-in-out transform ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } ${bgColor}`}
      role="alert"
    >
      <div className="flex p-4">
        {message}
        <div className="ms-auto">
          <button
            type="button"
            className="inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-white hover:opacity-100 focus:outline-none"
            aria-label="Close"
            onClick={() => setVisible(false)}
          >
            <span className="sr-only">Close</span>
            <svg
              className="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToastMessage;
