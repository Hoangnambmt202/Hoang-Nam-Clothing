"use client";

import { motion } from "framer-motion";
import { UserProfile } from "@/store/features/profileSlice";
import { Star, Package, Wallet, Camera } from "lucide-react";
import Image from "next/image";

const MEMBER_CONFIG = {
  Bronze: { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", bar: "bg-amber-400" },
  Silver: { color: "text-zinc-500", bg: "bg-zinc-50", border: "border-zinc-200", bar: "bg-zinc-400" },
  Gold: { color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", bar: "bg-yellow-400" },
  Platinum: { color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-200", bar: "bg-sky-500" },
};

interface ProfileHeaderProps {
  profile: UserProfile;
  onAvatarChange?: () => void;
}

const ProfileHeader = ({ profile, onAvatarChange }: ProfileHeaderProps) => {
  const level = profile.memberLevel || "Bronze";
  const cfg = MEMBER_CONFIG[level];
  const initials = profile.name
    ? profile.name.split(" ").map((w) => w[0]).slice(-2).join("").toUpperCase()
    : "?";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm"
    >
      {/* Decorative top stripe */}
      <div className="h-24 bg-gradient-to-r from-[#1E293B] to-[#334155] relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.15) 20px, rgba(255,255,255,0.15) 40px)",
          }}
        />
      </div>

      <div className="px-8 pb-8 -mt-10">
        {/* Avatar */}
        <div className="relative w-fit">
          {profile.avatar ? (
            <div className="w-20 h-20 rounded-full ring-4 ring-white overflow-hidden shadow-md">
              <Image src={profile.avatar} alt={profile.name} width={80} height={80} className="object-cover" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full ring-4 ring-white bg-[#1E293B] flex items-center justify-center shadow-md">
              <span className="text-2xl font-cormorant font-semibold text-white">{initials}</span>
            </div>
          )}
          <button
            onClick={onAvatarChange}
            className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-zinc-200 rounded-full flex items-center justify-center hover:bg-zinc-50 transition-colors cursor-pointer shadow-sm"
            aria-label="Đổi ảnh đại diện"
          >
            <Camera size={14} className="text-zinc-600" />
          </button>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-cormorant font-semibold text-[#1E293B] tracking-tight">
              {profile.name || "Chưa cập nhật"}
            </h1>
            <p className="text-sm font-montserrat text-[#64748B] mt-0.5">{profile.email}</p>

            {/* Member badge */}
            <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full border text-xs font-montserrat font-medium ${cfg.color} ${cfg.bg} ${cfg.border}`}>
              <Star size={11} strokeWidth={2} />
              {level} Member
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1 text-[#1E293B]">
                <Package size={14} className="text-[#64748B]" />
                <span className="text-lg font-cormorant font-semibold">{profile.totalOrders ?? 0}</span>
              </div>
              <p className="text-xs font-montserrat text-[#64748B]">Đơn hàng</p>
            </div>
            <div className="h-8 w-px bg-zinc-100" />
            <div className="text-center">
              <div className="flex items-center gap-1 text-[#1E293B]">
                <Wallet size={14} className="text-[#64748B]" />
                <span className="text-lg font-cormorant font-semibold">
                  {profile.totalSpent
                    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(profile.totalSpent)
                    : "0đ"}
                </span>
              </div>
              <p className="text-xs font-montserrat text-[#64748B]">Đã chi tiêu</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
