"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import AuthLoader from "@/components/auth/AuthLoader";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthLoader>{children}</AuthLoader>
    </Provider>
  );
}
