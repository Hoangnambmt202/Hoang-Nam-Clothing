
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "outline",
  className = "",
  children,
  ...props
}) => {
  let baseStyle =
    "px-4 py-2 font-medium transition-colors duration-200 focus:outline-none";

  let variantStyle = "";

  switch (variant) {
    case "primary":
      variantStyle = "bg-black text-white hover:bg-gray-800";
      break;
    case "secondary":
      variantStyle = "bg-gray-200 text-black hover:bg-gray-300";
      break;
    case "outline":
      variantStyle =
        "border border-black text-black bg-transparent hover:bg-black hover:text-white";
      break;
    case "danger":
      variantStyle = "bg-red-500 text-white hover:bg-red-600";
      break;
  }

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
