"use client";

import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import avatar from "@/assets/imgs/pexels-hikaique-307847.jpg";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export default function UserMenu() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (user) {
    return (
      <div>
        {/* Trigger */}
        <button
          id="user-menu"
          data-tooltip-place="bottom"
          className="px-2"
        >
          <Image
            src={avatar}
            className="rounded-full w-8 h-8"
            alt={user.name}
          />
        </button>

        {/* Tooltip content = menu */}
        <Tooltip
          anchorSelect="#user-menu"
          clickable
          className="bg-white shadow-xl rounded w-48 text-black"
        >
          <ul className="flex flex-col">
            <li>
              <Link href="/user/account/profile" className="block px-4 py-2 hover:text-blue-500">
                Tài Khoản
              </Link>
            </li>
            <li>
              <Link href="/orders" className="block px-4 py-2 hover:text-blue-500">
                Đơn Mua
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="block px-4 py-2 hover:text-blue-500">
                Danh sách yêu thích
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:text-blue-500"
              >
                Đăng Xuất
              </button>
            </li>
          </ul>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="flex items-center h-full ">
      <button className="" id="guest-menu" data-tooltip-place="bottom">
        <User size={22} color="gray" />
      </button>

      <Tooltip
        anchorSelect="#guest-menu"
        clickable
        className="bg-white shadow-xl rounded w-48 text-black"
      >
        <ul className="flex flex-col">
          <li>
            <Link href="/auth/sign-in" className="block px-4 py-2 hover:text-blue-500">
              Đăng Nhập
            </Link>
          </li>
          <li>
            <Link href="/auth/sign-up" className="block px-4 py-2 hover:text-blue-500">
              Đăng Ký
            </Link>
          </li>
        </ul>
      </Tooltip>
    </div>
  );
}
