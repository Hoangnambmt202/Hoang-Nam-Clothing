"use client";

import { Home, Search, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toggleSearch } from "@/store/features/searchSlice";
type Tab = "home" | "search" | "profile";

export default function BottomNavigation() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const dispatch = useDispatch();
  const navItems: {
    id: Tab;
    icon: typeof Home;
    label: string;
    href: string;
  }[] = [
    {
      id: "home" as const,
      icon: Home,
      label: "Home",
      href: "/",
    },
    {
      id: "search" as const,
      icon: Search,
      label: "Search",
      href: "/search",
    },
    {
      id: "profile" as const,
      icon: User,
      label: "Profile",
      href: "/profile",
    },
  ];
  const handleNavigate = (id: Tab) => {
    setActiveTab(id);

    if (id === "search") {
      dispatch(toggleSearch());
      return;
    }

    router.push(navItems.find((item) => item.id === id)?.href || "/");
  };
  return (
    <div className="fixed bottom-4 left-0 right-0 z-40">
      <div className="relative bg-transparent">
        <div className="max-w-screen-sm mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isCenter = index === 1;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === "search") {
                      dispatch(toggleSearch());
                    } else {
                      handleNavigate(item.id);
                    }
                  }}
                  className={`
                    flex flex-col items-center justify-center
                    transition-all duration-200
                    rounded-full bg-white shadow-lg hover:cursor-pointer shadow-xl/50 border border-gray-500
                    ${isCenter ? "p-3" : "p-2"}
                    ${isActive ? "text-black" : "text-gray-500 hover:text-gray-700 shadow-xl/50 border border-gray-500 "}
                  `}
                  aria-label={item.label}
                >
                  <Icon
                    size={isCenter ? 32 : 30}
                    strokeWidth={isActive ? 2.5 : 2}
                    fill={isActive ? "currentColor" : "none"}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
