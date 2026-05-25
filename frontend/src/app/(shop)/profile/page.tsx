"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setProfile } from "@/store/features/profileSlice";
import { useAuth } from "@/hooks/useAuth";
import { userApi } from "@/lib/api/user";

import ProfileHeader from "@/components/user/profile/ProfileHeader";
import EditProfileTab from "@/components/user/profile/EditProfileTab";
import ChangePasswordTab from "@/components/user/profile/ChangePasswordTab";
import AddressTab from "@/components/user/profile/AddressTab";
import OrderHistoryTab from "@/components/user/profile/OrderHistoryTab";

import {
  User,
  ShieldCheck,
  MapPin,
  Package,
  LogOut,
  ChevronRight,
  Loader2,
} from "lucide-react";

const TABS = [
  { key: "profile", label: "Thông tin cá nhân", icon: User },
  { key: "password", label: "Đổi mật khẩu", icon: ShieldCheck },
  { key: "address", label: "Sổ địa chỉ", icon: MapPin },
  { key: "orders", label: "Đơn hàng", icon: Package },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const ProfilePage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, accessToken, isLoading, logout } = useAuth();
  const profile = useSelector((s: RootState) => s.profile.profile);

  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Redirect if not logged in (only after auth is initialized)
  useEffect(() => {
    if (!isLoading && !accessToken && !user) {
      router.replace("/auth/sign-in");
    }
  }, [accessToken, user, isLoading, router]);

  // Load profile once auth is initialized
  useEffect(() => {
    if (isLoading) return;
    if (!accessToken || profile) {
      setLoadingProfile(false);
      return;
    }
    (async () => {
      try {
        const data = await userApi.getProfile(accessToken);
        dispatch(setProfile(data));
      } catch {
        // silently fail, use auth user as fallback
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, [accessToken, profile, dispatch, isLoading]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.push("/auth/sign-in");
    } catch {
      // fallback if logout API fails
      router.push("/auth/sign-in");
    } finally {
      setLoggingOut(false);
    }
  };

  const displayProfile = profile ?? {
    id: typeof user?.id === "number" ? user.id : Number(user?.id ?? 0) || 0,
    name: user?.name ?? "",
    email: user?.email ?? "",
  };

  if (isLoading || (loadingProfile && accessToken)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 size={32} className="animate-spin text-zinc-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        {/* Profile header card */}
        <ProfileHeader profile={displayProfile} />

        <div className="mt-6 flex flex-col lg:flex-row gap-6">
          {/* Sidebar navigation */}
          <aside className="lg:w-60 flex-shrink-0">
            <nav className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
              {TABS.map((tab, i) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center justify-between px-5 py-3.5 text-sm font-montserrat transition-colors duration-150 cursor-pointer ${
                      i < TABS.length - 1 ? "border-b border-zinc-50" : ""
                    } ${
                      isActive
                        ? "bg-[#1E293B] text-white font-medium"
                        : "text-[#475569] hover:bg-zinc-50"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon size={15} strokeWidth={isActive ? 2 : 1.5} />
                      {tab.label}
                    </span>
                    {isActive && <ChevronRight size={14} />}
                  </button>
                );
              })}

              {/* Logout */}
              <div className="border-t border-zinc-100">
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-2.5 px-5 py-3.5 text-sm font-montserrat text-red-500 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {loggingOut ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <LogOut size={15} strokeWidth={1.5} />
                  )}
                  Đăng xuất
                </button>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white border border-zinc-100 rounded-2xl p-6 lg:p-8 shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {activeTab === "profile" && <EditProfileTab />}
                  {activeTab === "password" && <ChangePasswordTab />}
                  {activeTab === "address" && <AddressTab />}
                  {activeTab === "orders" && <OrderHistoryTab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
