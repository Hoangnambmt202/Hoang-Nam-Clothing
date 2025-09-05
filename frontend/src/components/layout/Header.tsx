"use client";

import HeaderTop from "@components/header/HeaderTop";
import MenuToggle from "../header/MenuToogle";
import Link from "next/link";
import SearchBar from "../header/SearchBar";
import UserMenu from "../header/UserMenu";
import CartButton from "../header/CartButton";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <HeaderTop />
      <div className="container sticky top-0 flex justify-between px-4 py-4 mx-auto lg:flex md:flex md:justify-around lg:items-center lg:justify-between">
        <MenuToggle />

        <Link className="grow-7 flex justify-center" href="/">
          <span className="text-3xl font-Dosis font-bold text-blue-500">
            HOÀNG NAM
          </span>
        </Link>

        <div className=" gap-4 items-center mr-4 lg:flex md:flex sm:flex">
          <SearchBar />
          <UserMenu />
          <CartButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
