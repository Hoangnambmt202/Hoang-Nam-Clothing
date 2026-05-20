"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AuthLoader({ children }: { children: React.ReactNode }) {
  const { refreshToken, accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      refreshToken().catch(() => {
        // Lỗi được nuốt ở đây vì đã được handle setInitialized(true) bên trong hook useAuth
      });
    }
  }, [accessToken, refreshToken]);

  return <>{children}</>;
}
