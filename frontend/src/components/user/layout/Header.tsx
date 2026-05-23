"use client";

import CartButton from "@/components/user/features/cart/CartButton";
import MenuToggle from "@/components/user/layout/MenuToogle";
import WishlistSidebar from "@/components/user/features/wishlist/WishlistSidebar";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setScrollY } from "@/store/ui/ui.slice";
import { fetchCartDb } from "@/store/features/cartSlice";
import { fetchWishlist } from "@/store/features/wishlistSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const scrolled = useAppSelector((s) => s.ui.isScrolled);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const { accessToken } = useAppSelector((state: any) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    const handleScroll = () => {
      dispatch(setScrollY(window.scrollY));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

  // Sync db cart and wishlist if user is authenticated
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchCartDb(accessToken) as any);
      dispatch(fetchWishlist(accessToken));
    }
  }, [accessToken, dispatch]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-6 lg:px-12 transition-all duration-300
        /* ${scrolled ? "bg-black/10 shadow-lg backdrop-blur-md" : "bg-transparent"} */

          ${scrolled ? "bg-white text-black" : "bg-transparent"}
        `}
      >
        <div className="flex items-center gap-2">
          <h2
            className={` text-2xl font-bold tracking-widest uppercase ${scrolled ? "text-black" : "text-white"}`}
          >
            Hoang Nam
          </h2>
        </div>
        <div className="flex items-center gap-8 ">
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative block text-sm font-semibold tracking-[0.2em] uppercase hover:opacity-60 transition-colors hover:cursor-pointer"
          >
            <Heart color={scrolled ? "black" : "white"} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                {wishlistItems.length}
              </span>
            )}
          </button>

          <CartButton />

          <MenuToggle />
        </div>
      </header>

      <WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </>
  );
};

export default Header;

