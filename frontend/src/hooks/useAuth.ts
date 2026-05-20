import useSWR from "swr";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCredentials, clearAuth, setInitialized } from "@/store/features/authSlice";
import { authApi } from "@/lib/api/auth";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, accessToken, isInitialized } = useSelector((s: RootState) => s.auth);

  const { data, mutate, error } = useSWR(
    accessToken ? ["/auth/me", accessToken] : null,
    ([, token]) => authApi.getMe(token as string)
  );

  async function login(emailOrPhone: string, password: string) {
    const res = await authApi.login(emailOrPhone, password);
    dispatch(setCredentials({ user: res.user, accessToken: res.accessToken }));
    mutate();
    return res;
  }

  async function register(data: { email: string; phone: string; password: string; firstName: string; lastName: string }) {
    const res = await authApi.register(data);
    return res;
  }

  async function refreshToken() {
    try {
      const res = await authApi.refreshToken();
      dispatch(setCredentials({ user: res.user, accessToken: res.accessToken }));
      return res;
    } catch (err) {
      dispatch(setInitialized());
      throw err;
    }
  }

  async function logout() {
    await authApi.logout();
    dispatch(clearAuth());
    mutate(null, false);
  }

  return {
    user: data || user,
    accessToken,
    login,
    register,
    refreshToken,
    logout,
    isLoading: !isInitialized || (!error && !data && !!accessToken),
  };
}
