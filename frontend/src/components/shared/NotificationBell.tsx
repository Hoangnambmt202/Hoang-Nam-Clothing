"use client";

import { Bell } from "lucide-react";
import { useRef, useEffect } from "react";
import {
  toggleNotification,
  closeNotification,
  markAsRead,
  markAllAsRead,
} from "@/store/notification/notification.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { timeAgo } from "@/utils/time";

export default function NotificationBell() {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((s) => s.notification);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = items.filter((i) => !i.read).length;

  // click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        dispatch(closeNotification());
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => dispatch(toggleNotification())}
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-100 relative hover:cursor-pointer"
      >
        <Bell size={20} color="black" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border z-50">
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <span className="font-semibold text-gray-700">Thông báo</span>
            <button
              onClick={() => dispatch(markAllAsRead())}
              className="text-sm text-blue-600 hover:underline"
            >
              Đánh dấu đã đọc
            </button>
          </div>

          <ul className="max-h-96 overflow-y-auto">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => dispatch(markAsRead(item.id))}
                className={`px-4 py-3 cursor-pointer border-b hover:bg-gray-50 ${
                  !item.read ? "bg-gray-100" : ""
                }`}
              >
                <p className="text-sm font-medium text-gray-700">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500">{item.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {timeAgo(item.createdAt)}
                </p>
                {!item.read && (
                  <div className="absolute top-2/5 right-4 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
