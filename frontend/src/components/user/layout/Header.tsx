"use client";

import CartButton from "@/components/user/CartButton";
import MenuToggle from "@/components/user/MenuToogle";
import { Heart, Search } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // đổi bg sau 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-6 lg:px-12 transition-all duration-300
        ${scrolled ? "bg-black/10 shadow-lg backdrop-blur-md" : "bg-transparent"}
      `}
    >
      <div className="flex items-center gap-2">
        <h2
          className={` text-2xl font-bold tracking-widest uppercase ${scrolled ? "text-black" : "text-white"}`}
        >
          Hoang Nam
        </h2>
      </div>
      <div className="flex items-center gap-6">
        <button className="hidden lg:block text-white text-sm font-semibold tracking-[0.2em] uppercase hover:opacity-60 transition-colors hover:cursor-pointer">
          <Heart />
        </button>

        <CartButton />

        <MenuToggle />
      </div>
    </header>
  );
};

export default Header;
