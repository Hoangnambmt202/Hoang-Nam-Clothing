import { useAppSelector } from "@/store/hooks";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartButton() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/cart");
  };
  const isScrolled = useAppSelector((s) => s.ui.isScrolled);
  return (
    <button onClick={handleClick}>
      <ShoppingCart
        className="hover:opacity-60 transition-colors hover:cursor-pointer"
        size={22}
        color={isScrolled ? "black" : "white"}
      />
    </button>
  );
}
