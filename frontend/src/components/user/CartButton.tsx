import { ShoppingCart } from "lucide-react";

export default function CartButton() {
  return (
    <button>
      <ShoppingCart
        className="hover:opacity-60 transition-colors hover:cursor-pointer"
        size={22}
        color="white"
      />
    </button>
  );
}
