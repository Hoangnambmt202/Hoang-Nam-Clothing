import useSWR from "swr";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCredentials, clearAuth } from "@/store/features/authSlice";
import { apiFetch } from "@/lib/api";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((s: RootState) => s.auth);

  // Fetch user info khi đã có accessToken
  const { data, mutate, error } = useSWR(
    accessToken ? ["/auth/me", accessToken] : null,
    ([url, token]) =>
      apiFetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
  );

  async function login(phone: string, password: string) {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone, password }),
    });

    dispatch(setCredentials({ user: res.user, accessToken: res.accessToken }));
    mutate(); // load lại user
  }

  async function refreshToken() {
    const res = await apiFetch("/auth/refresh", { method: "POST" });
    dispatch(setCredentials({ user: res.user, accessToken: res.accessToken }));
  }

  async function logout() {
    await apiFetch("/auth/logout", { method: "POST" });
    dispatch(clearAuth());
    mutate(null, false); // clear cache SWR
  }

  return {
    user: data || user,
    accessToken,
    login,
    refreshToken,
    logout,
    isLoading: !error && !data && !!accessToken,
  };
}
